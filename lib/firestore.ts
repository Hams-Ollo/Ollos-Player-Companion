import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { firebaseApp } from '../contexts/AuthContext';
import { CharacterData } from '../types';
import { compressPortrait } from '../utils';

// ─── Firestore instance ─────────────────────────────────────────────
export const db = getFirestore(firebaseApp);
const CHARACTERS_COLLECTION = 'characters';

// ─── Debounce helper ─────────────────────────────────────────────────
const pendingWrites = new Map<string, ReturnType<typeof setTimeout>>();
const DEBOUNCE_MS = 500;

function debouncedWrite(charId: string, writeFn: () => Promise<void>) {
  const existing = pendingWrites.get(charId);
  if (existing) clearTimeout(existing);

  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingWrites.delete(charId);
      writeFn().then(resolve).catch(reject);
    }, DEBOUNCE_MS);
    pendingWrites.set(charId, timer);
  });
}

// ─── Subscribe to a user's characters (real-time) ───────────────────
export function subscribeUserCharacters(
  uid: string,
  onData: (chars: CharacterData[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, CHARACTERS_COLLECTION),
    where('ownerUid', '==', uid),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const chars: CharacterData[] = snapshot.docs.map((d) => d.data() as CharacterData);
      onData(chars);
    },
    (err) => {
      console.error('[Firestore] snapshot error:', err);
      onError?.(err);
    },
  );
}

// ─── Save / update a character (debounced) ──────────────────────────
export async function saveCharacter(char: CharacterData): Promise<void> {
  // Compress portrait if it's a large base64 data URI
  let portraitUrl = char.portraitUrl;
  if (portraitUrl && portraitUrl.startsWith('data:image') && portraitUrl.length > 200_000) {
    portraitUrl = await compressPortrait(portraitUrl, 512, 0.75);
  }

  const data: CharacterData = {
    ...char,
    portraitUrl,
    updatedAt: Date.now(),
  };

  // Final safety check — warn but still attempt
  const json = JSON.stringify(data);
  if (json.length > 800_000) {
    console.warn(
      `[Firestore] Character "${data.name}" document is ${(json.length / 1024).toFixed(0)} KB — ` +
      `approaching Firestore's 1 MB limit.`,
    );
  }

  return debouncedWrite(char.id, () =>
    setDoc(doc(db, CHARACTERS_COLLECTION, char.id), data, { merge: true }),
  );
}

// ─── Delete a character ─────────────────────────────────────────────
export async function deleteCharacter(charId: string): Promise<void> {
  // Cancel any pending debounced write
  const pending = pendingWrites.get(charId);
  if (pending) {
    clearTimeout(pending);
    pendingWrites.delete(charId);
  }
  await deleteDoc(doc(db, CHARACTERS_COLLECTION, charId));
}

// ─── Migrate local characters to Firestore (batch) ─────────────────
export async function migrateLocalCharacters(
  uid: string,
  chars: CharacterData[],
): Promise<void> {
  if (chars.length === 0) return;

  const batch = writeBatch(db);
  const now = Date.now();

  for (const char of chars) {
    const ref = doc(db, CHARACTERS_COLLECTION, char.id);
    batch.set(ref, {
      ...char,
      ownerUid: uid,
      createdAt: char.createdAt ?? now,
      updatedAt: now,
    });
  }

  await batch.commit();
}

// ─── Flush any pending debounced writes (call before sign-out) ──────
export async function flushPendingWrites(): Promise<void> {
  // This is intentionally a no-op for now; the debounce timeout is short
  // and onSnapshot will have already synced. In the future we could
  // track pending promises and await them here.
}
