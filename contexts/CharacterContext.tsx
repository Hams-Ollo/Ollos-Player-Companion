import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CharacterData } from '../types';
import { VESPER_DATA } from '../constants';
import { recalculateCharacterStats } from '../utils';
import { useAuth } from './AuthContext';
import {
  subscribeUserCharacters,
  saveCharacter as firestoreSave,
  deleteCharacter as firestoreDelete,
  migrateLocalCharacters,
} from '../lib/firestore';

// ─── Types ──────────────────────────────────────────────────────────
interface CharacterContextType {
  characters: CharacterData[];
  activeCharacter: CharacterData | null;
  activeCharacterId: string | null;
  setActiveCharacterId: (id: string | null) => void;
  createCharacter: (char: CharacterData) => void;
  updateCharacter: (partial: Partial<CharacterData>) => void;
  updateCharacterById: (id: string, partial: Partial<CharacterData>) => void;
  updatePortrait: (url: string) => void;
  deleteCharacter: (id: string) => void;
  isCloudUser: boolean;
  isLoading: boolean;
  /** Last save error — cleared on successful save */
  saveError: string | null;
  // Migration
  pendingMigration: CharacterData[] | null;
  acceptMigration: () => Promise<void>;
  dismissMigration: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

// ─── Helpers ────────────────────────────────────────────────────────
const LOCAL_CHARS_KEY = 'vesper_chars';

function loadLocalCharacters(): CharacterData[] {
  try {
    const raw = localStorage.getItem(LOCAL_CHARS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter((c: any) => c && typeof c === 'object' && c.id).map(recalculateCharacterStats);
    }
  } catch {
    console.error('[CharacterContext] Corrupt local data — ignoring.');
  }
  return [];
}

function saveLocalCharacters(chars: CharacterData[]) {
  localStorage.setItem(LOCAL_CHARS_KEY, JSON.stringify(chars));
}

function isCloudUid(uid: string | undefined | null): boolean {
  if (!uid) return false;
  // Local-guest UIDs start with 'guest-local-', anonymous Firebase UIDs are real
  return !uid.startsWith('guest-local-');
}

// ─── Provider ───────────────────────────────────────────────────────
export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingMigration, setPendingMigration] = useState<CharacterData[] | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isCloud = isCloudUid(user?.uid);
  const unsubRef = useRef<(() => void) | null>(null);

  // ── Effect: react to auth changes ───────────────────────────────
  useEffect(() => {
    // Cleanup previous subscription
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    if (!user) {
      // Logged out
      setCharacters([]);
      setActiveCharacterId(null);
      setIsLoading(false);
      setPendingMigration(null);
      return;
    }

    if (!isCloud) {
      // Guest / local user → localStorage
      const local = loadLocalCharacters();
      setCharacters(local.length > 0 ? local : [recalculateCharacterStats(VESPER_DATA)]);
      setIsLoading(false);
      return;
    }

    // Cloud user → subscribe to Firestore
    setIsLoading(true);
    let firstSnapshot = true;

    const unsub = subscribeUserCharacters(
      user.uid,
      (firestoreChars) => {
        const recalced = firestoreChars.map(recalculateCharacterStats);
        setCharacters(recalced);

        // On the very first snapshot, check if we should offer migration
        if (firstSnapshot) {
          firstSnapshot = false;
          setIsLoading(false);

          if (recalced.length === 0) {
            const local = loadLocalCharacters();
            if (local.length > 0) {
              // User has local characters but no cloud characters → offer migration
              setPendingMigration(local);
            }
          }
        }
      },
      (err) => {
        console.error('[CharacterContext] Firestore error, falling back to local:', err);
        const local = loadLocalCharacters();
        setCharacters(local.length > 0 ? local : [recalculateCharacterStats(VESPER_DATA)]);
        setIsLoading(false);
      },
    );

    unsubRef.current = unsub;
    return () => unsub();
  }, [user?.uid, isCloud]);

  // ── Persist local characters when they change (guest mode only) ──
  useEffect(() => {
    if (!isCloud && characters.length > 0) {
      saveLocalCharacters(characters);
    }
  }, [characters, isCloud]);

  // ── CRUD operations ─────────────────────────────────────────────
  const createCharacter = useCallback(
    (char: CharacterData) => {
      const now = Date.now();
      const enriched: CharacterData = {
        ...char,
        ownerUid: user?.uid,
        createdAt: now,
        updatedAt: now,
      };

      // Optimistic update
      setCharacters((prev) => [...prev, enriched]);
      setActiveCharacterId(enriched.id);

      if (isCloud) {
        firestoreSave(enriched)
          .then(() => {
            console.log(`[CharacterContext] Saved new character "${enriched.name}" to Firestore`);
            setSaveError(null);
          })
          .catch((err) => {
            console.error('[CharacterContext] Failed to save new character:', err);
            setSaveError(`Failed to save "${enriched.name}": ${err.message}`);
          });
      }
    },
    [isCloud, user?.uid],
  );

  const updateCharacter = useCallback(
    (partial: Partial<CharacterData>) => {
      let charToSave: CharacterData | null = null;

      setCharacters((prev) =>
        prev.map((c) => {
          if (c.id !== activeCharacterId) return c;
          const updated = recalculateCharacterStats({ ...c, ...partial, updatedAt: Date.now() });
          charToSave = updated;
          return updated;
        }),
      );

      // Save to Firestore OUTSIDE the state updater (React 19 concurrent safety)
      if (isCloud && charToSave) {
        firestoreSave(charToSave)
          .then(() => setSaveError(null))
          .catch((err) => {
            console.error('[CharacterContext] Failed to update character:', err);
            setSaveError(`Save failed: ${err.message}`);
          });
      }
    },
    [activeCharacterId, isCloud],
  );

  /** Update a specific character by ID (not just the active one). */
  const updateCharacterById = useCallback(
    (id: string, partial: Partial<CharacterData>) => {
      let charToSave: CharacterData | null = null;

      setCharacters((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const updated = recalculateCharacterStats({ ...c, ...partial, updatedAt: Date.now() });
          charToSave = updated;
          return updated;
        }),
      );

      if (isCloud && charToSave) {
        firestoreSave(charToSave)
          .then(() => setSaveError(null))
          .catch((err) => {
            console.error('[CharacterContext] Failed to update character by ID:', err);
            setSaveError(`Save failed: ${err.message}`);
          });
      }
    },
    [isCloud],
  );

  const updatePortrait = useCallback(
    (url: string) => {
      updateCharacter({ portraitUrl: url });
    },
    [updateCharacter],
  );

  const deleteChar = useCallback(
    (id: string) => {
      setCharacters((prev) => prev.filter((c) => c.id !== id));
      if (activeCharacterId === id) setActiveCharacterId(null);
      if (isCloud) {
        firestoreDelete(id).catch((err) =>
          console.error('[CharacterContext] Failed to delete character:', err),
        );
      }
    },
    [isCloud, activeCharacterId],
  );

  // ── Migration ───────────────────────────────────────────────────
  const acceptMigration = useCallback(async () => {
    if (!pendingMigration || !user?.uid) return;
    try {
      await migrateLocalCharacters(user.uid, pendingMigration);
      localStorage.removeItem(LOCAL_CHARS_KEY);
      setPendingMigration(null);
    } catch (err) {
      console.error('[CharacterContext] Migration failed:', err);
      throw err;
    }
  }, [pendingMigration, user?.uid]);

  const dismissMigration = useCallback(() => {
    setPendingMigration(null);
  }, []);

  // ── Context value ───────────────────────────────────────────────
  const activeCharacter = characters.find((c) => c.id === activeCharacterId) ?? null;

  return (
    <CharacterContext.Provider
      value={{
        characters,
        activeCharacter,
        activeCharacterId,
        setActiveCharacterId,
        createCharacter,
        updateCharacter,
        updateCharacterById,
        updatePortrait,
        deleteCharacter: deleteChar,
        isCloudUser: isCloud,
        isLoading,
        saveError,
        pendingMigration,
        acceptMigration,
        dismissMigration,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

// ─── Hook ───────────────────────────────────────────────────────────
export const useCharacters = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacters must be used within a CharacterProvider');
  }
  return context;
};
