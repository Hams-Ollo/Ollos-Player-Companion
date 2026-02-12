import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Campaign,
  CampaignMember,
  CampaignInvite,
  CombatEncounter,
  DMNote,
  CampaignRole,
} from '../types';
import { useAuth } from './AuthContext';
import {
  subscribeUserCampaigns,
  subscribeToCampaign,
  subscribeToMembers,
  subscribeToMyInvites,
  subscribeToActiveEncounter,
  subscribeToNotes,
  migrateCampaignMemberUids,
  createCampaign as firestoreCreateCampaign,
  updateCampaign as firestoreUpdateCampaign,
  archiveCampaign as firestoreArchiveCampaign,
  deleteCampaign as firestoreDeleteCampaign,
  joinCampaignByCode,
  leaveCampaign as firestoreLeaveCampaign,
  acceptInvite as firestoreAcceptInvite,
  declineInvite as firestoreDeclineInvite,
} from '../lib/campaigns';

// ─── Types ──────────────────────────────────────────────────────────

interface CampaignContextType {
  /** All campaigns the user is a member of */
  campaigns: Campaign[];
  /** The currently selected/active campaign */
  activeCampaign: Campaign | null;
  activeCampaignId: string | null;
  setActiveCampaignId: (id: string | null) => void;

  /** Members of the active campaign */
  members: CampaignMember[];
  /** Current user's role in the active campaign */
  myRole: CampaignRole | null;
  /** Whether current user is the DM of the active campaign */
  isDM: boolean;

  /** Active combat encounter (if any) */
  activeEncounter: CombatEncounter | null;

  /** DM notes for the active campaign */
  notes: DMNote[];

  /** Pending invites for the current user */
  pendingInvites: CampaignInvite[];

  /** Loading state */
  isLoading: boolean;

  // ── Actions ─────────────────────────────────────────────────────
  createCampaign: (name: string, description?: string) => Promise<Campaign>;
  updateCampaign: (updates: Partial<Pick<Campaign, 'name' | 'description' | 'settings' | 'currentSessionNumber'>>) => Promise<void>;
  archiveCampaign: () => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  joinByCode: (code: string, characterId?: string) => Promise<Campaign | null>;
  leaveCampaign: () => Promise<void>;
  acceptInvite: (inviteId: string, characterId?: string) => Promise<void>;
  declineInvite: (inviteId: string) => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

// ─── Local storage key for selected campaign ────────────────────────
const ACTIVE_CAMPAIGN_KEY = 'vesper_active_campaign';

// ─── Provider ───────────────────────────────────────────────────────
export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaignId, setActiveCampaignIdRaw] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_CAMPAIGN_KEY),
  );
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [members, setMembers] = useState<CampaignMember[]>([]);
  const [activeEncounter, setActiveEncounter] = useState<CombatEncounter | null>(null);
  const [notes, setNotes] = useState<DMNote[]>([]);
  const [pendingInvites, setPendingInvites] = useState<CampaignInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscription refs for cleanup
  const unsubCampaignsRef = useRef<(() => void) | null>(null);
  const unsubCampaignRef = useRef<(() => void) | null>(null);
  const unsubMembersRef = useRef<(() => void) | null>(null);
  const unsubEncounterRef = useRef<(() => void) | null>(null);
  const unsubNotesRef = useRef<(() => void) | null>(null);
  const unsubInvitesRef = useRef<(() => void) | null>(null);

  // Persist active campaign selection
  const setActiveCampaignId = useCallback((id: string | null) => {
    setActiveCampaignIdRaw(id);
    if (id) {
      localStorage.setItem(ACTIVE_CAMPAIGN_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_CAMPAIGN_KEY);
    }
  }, []);

  // ── Subscribe to user's campaigns list ───────────────────────────
  useEffect(() => {
    if (unsubCampaignsRef.current) {
      unsubCampaignsRef.current();
      unsubCampaignsRef.current = null;
    }

    if (!user?.uid) {
      setCampaigns([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // One-time migration: patch pre-memberUids campaigns, then subscribe
    migrateCampaignMemberUids(user.uid).finally(() => {
      const unsub = subscribeUserCampaigns(
        user.uid,
        (data) => {
          setCampaigns(data);
          setIsLoading(false);
        },
        (err) => {
          console.error('[CampaignContext] campaigns error:', err);
          setIsLoading(false);
        },
      );

      unsubCampaignsRef.current = unsub;
    });

    return () => {
      if (unsubCampaignsRef.current) {
        unsubCampaignsRef.current();
        unsubCampaignsRef.current = null;
      }
    };
  }, [user?.uid]);

  // ── Subscribe to active campaign details when selected ────────────
  useEffect(() => {
    // Cleanup previous subscriptions
    [unsubCampaignRef, unsubMembersRef, unsubEncounterRef, unsubNotesRef].forEach(ref => {
      if (ref.current) {
        ref.current();
        ref.current = null;
      }
    });

    if (!activeCampaignId) {
      setActiveCampaign(null);
      setMembers([]);
      setActiveEncounter(null);
      setNotes([]);
      return;
    }

    // Subscribe to campaign doc
    unsubCampaignRef.current = subscribeToCampaign(
      activeCampaignId,
      (campaign) => {
        setActiveCampaign(campaign);

        // If campaign has an active encounter, subscribe to it
        if (campaign?.activeEncounterId) {
          if (unsubEncounterRef.current) unsubEncounterRef.current();
          unsubEncounterRef.current = subscribeToActiveEncounter(
            activeCampaignId,
            campaign.activeEncounterId,
            setActiveEncounter,
          );
        } else {
          setActiveEncounter(null);
        }
      },
    );

    // Subscribe to members
    unsubMembersRef.current = subscribeToMembers(
      activeCampaignId,
      setMembers,
    );

    // Subscribe to notes
    unsubNotesRef.current = subscribeToNotes(
      activeCampaignId,
      setNotes,
    );

    return () => {
      [unsubCampaignRef, unsubMembersRef, unsubEncounterRef, unsubNotesRef].forEach(ref => {
        if (ref.current) {
          ref.current();
          ref.current = null;
        }
      });
    };
  }, [activeCampaignId]);

  // ── Subscribe to invites ──────────────────────────────────────────
  useEffect(() => {
    if (unsubInvitesRef.current) {
      unsubInvitesRef.current();
      unsubInvitesRef.current = null;
    }

    if (!user?.email) {
      setPendingInvites([]);
      return;
    }

    const unsub = subscribeToMyInvites(
      user.email,
      setPendingInvites,
    );

    unsubInvitesRef.current = unsub;
    return () => unsub();
  }, [user?.email]);

  // ── Derived state ─────────────────────────────────────────────────
  const myMembership = members.find(m => m.uid === user?.uid);
  const myRole = myMembership?.role ?? null;
  const isDM = myRole === 'dm';

  // ── Actions ───────────────────────────────────────────────────────
  const createCampaignAction = useCallback(
    async (name: string, description?: string) => {
      if (!user?.uid || !user.displayName) {
        throw new Error('Must be signed in to create a campaign');
      }
      const campaign = await firestoreCreateCampaign(
        user.uid,
        user.displayName,
        name,
        description,
      );
      setActiveCampaignId(campaign.id);
      return campaign;
    },
    [user?.uid, user?.displayName, setActiveCampaignId],
  );

  const updateCampaignAction = useCallback(
    async (updates: Partial<Pick<Campaign, 'name' | 'description' | 'settings' | 'currentSessionNumber'>>) => {
      if (!activeCampaignId) throw new Error('No active campaign');
      await firestoreUpdateCampaign(activeCampaignId, updates);
    },
    [activeCampaignId],
  );

  const archiveCampaignAction = useCallback(async () => {
    if (!activeCampaignId) throw new Error('No active campaign');
    await firestoreArchiveCampaign(activeCampaignId);
    setActiveCampaignId(null);
  }, [activeCampaignId, setActiveCampaignId]);

  const deleteCampaignAction = useCallback(async (campaignId: string) => {
    if (!user?.uid) throw new Error('Must be signed in');
    // Tear down active subscriptions BEFORE deleting to prevent permission errors from listeners
    if (activeCampaignId === campaignId) {
      setActiveCampaignId(null);
    }
    await firestoreDeleteCampaign(campaignId, user.uid);
  }, [user?.uid, activeCampaignId, setActiveCampaignId]);

  const joinByCode = useCallback(
    async (code: string, characterId?: string) => {
      if (!user?.uid || !user.displayName) {
        throw new Error('Must be signed in to join a campaign');
      }
      const campaign = await joinCampaignByCode(code, user.uid, user.displayName, characterId);
      if (campaign) {
        setActiveCampaignId(campaign.id);
      }
      return campaign;
    },
    [user?.uid, user?.displayName, setActiveCampaignId],
  );

  const leaveCampaignAction = useCallback(async () => {
    if (!activeCampaignId || !user?.uid) return;
    await firestoreLeaveCampaign(activeCampaignId, user.uid);
    setActiveCampaignId(null);
  }, [activeCampaignId, user?.uid, setActiveCampaignId]);

  const acceptInviteAction = useCallback(
    async (inviteId: string, characterId?: string) => {
      if (!user?.uid || !user.displayName) throw new Error('Must be signed in');
      await firestoreAcceptInvite(inviteId, user.uid, user.displayName, characterId);
    },
    [user?.uid, user?.displayName],
  );

  const declineInviteAction = useCallback(
    async (inviteId: string) => {
      await firestoreDeclineInvite(inviteId);
    },
    [],
  );

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        activeCampaign,
        activeCampaignId,
        setActiveCampaignId,
        members,
        myRole,
        isDM,
        activeEncounter,
        notes,
        pendingInvites,
        isLoading,
        createCampaign: createCampaignAction,
        updateCampaign: updateCampaignAction,
        archiveCampaign: archiveCampaignAction,
        deleteCampaign: deleteCampaignAction,
        joinByCode,
        leaveCampaign: leaveCampaignAction,
        acceptInvite: acceptInviteAction,
        declineInvite: declineInviteAction,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

// ─── Hook ───────────────────────────────────────────────────────────
export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
