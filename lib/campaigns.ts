/**
 * Firestore service layer for campaigns and multiplayer features.
 * Follows the same patterns as lib/firestore.ts (real-time subscriptions, debounced writes).
 *
 * Data model:
 *   campaigns/{campaignId}                     – Campaign doc
 *   campaigns/{campaignId}/members/{uid}       – CampaignMember
 *   campaigns/{campaignId}/encounters/{id}     – CombatEncounter
 *   campaigns/{campaignId}/notes/{id}          – DMNote
 *   campaigns/{campaignId}/templates/{id}      – EncounterTemplate
 *   campaigns/{campaignId}/whispers/{id}       – Whisper
 *   campaigns/{campaignId}/rollRequests/{id}   – RollRequest
 *   invites/{inviteId}                         – CampaignInvite (top-level)
 */

import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  writeBatch,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  Unsubscribe,
} from 'firebase/firestore';
import { firebaseApp } from '../contexts/AuthContext';
import {
  Campaign,
  CampaignMember,
  CampaignInvite,
  CampaignSettings,
  CombatEncounter,
  DMNote,
  EncounterTemplate,
  Whisper,
  RollRequest,
  CampaignStatus,
} from '../types';

// ─── Firestore instance ─────────────────────────────────────────────
const db = getFirestore(firebaseApp);

// ─── Collection refs ─────────────────────────────────────────────────
const campaignsCol = () => collection(db, 'campaigns');
const membersCol = (campaignId: string) =>
  collection(db, 'campaigns', campaignId, 'members');
const encountersCol = (campaignId: string) =>
  collection(db, 'campaigns', campaignId, 'encounters');
const notesCol = (campaignId: string) =>
  collection(db, 'campaigns', campaignId, 'notes');
const templatesCol = (campaignId: string) =>
  collection(db, 'campaigns', campaignId, 'templates');
const whispersCol = (campaignId: string) =>
  collection(db, 'campaigns', campaignId, 'whispers');
const rollRequestsCol = (campaignId: string) =>
  collection(db, 'campaigns', campaignId, 'rollRequests');
const invitesCol = () => collection(db, 'invites');

// ─── Helpers ─────────────────────────────────────────────────────────

/** Generate a short alphanumeric join code (6 chars). */
function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes confusing chars (I/1/O/0)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Generate a unique ID (matches Firestore auto-id length). */
function generateId(): string {
  return doc(collection(db, '_')).id;
}

// ═══════════════════════════════════════════════════════════════════════
// Campaign CRUD
// ═══════════════════════════════════════════════════════════════════════

/** Create a new campaign. The creator becomes the DM automatically. */
export async function createCampaign(
  dmUid: string,
  dmDisplayName: string,
  name: string,
  description: string = '',
): Promise<Campaign> {
  const id = generateId();
  const now = Date.now();

  const campaign: Campaign = {
    id,
    name,
    dmId: dmUid,
    description,
    joinCode: generateJoinCode(),
    members: [],
    memberUids: [dmUid],
    status: 'active',
    currentSessionNumber: 1,
    settings: {
      allowPlayerInvites: false,
      defaultCharacterVisibility: 'limited',
    },
    createdAt: now,
    updatedAt: now,
  };

  const batch = writeBatch(db);

  // Write campaign doc
  batch.set(doc(db, 'campaigns', id), campaign);

  // Write DM as the first member
  const dmMember: CampaignMember = {
    uid: dmUid,
    displayName: dmDisplayName,
    role: 'dm',
    joinedAt: now,
  };
  batch.set(doc(db, 'campaigns', id, 'members', dmUid), dmMember);

  await batch.commit();
  return campaign;
}

/** Update campaign metadata (name, description, settings, status). */
export async function updateCampaign(
  campaignId: string,
  updates: Partial<Pick<Campaign, 'name' | 'description' | 'settings' | 'status' | 'currentSessionNumber' | 'activeEncounterId'>>,
): Promise<void> {
  await updateDoc(doc(db, 'campaigns', campaignId), {
    ...updates,
    updatedAt: Date.now(),
  });
}

/** Archive a campaign (soft-delete). */
export async function archiveCampaign(campaignId: string): Promise<void> {
  await updateCampaign(campaignId, { status: 'archived' });
}

/** Permanently delete a campaign and its subcollections. DM only. */
export async function deleteCampaign(campaignId: string, dmUid: string): Promise<void> {
  // Verify the caller is the DM
  const campaignSnap = await getDoc(doc(db, 'campaigns', campaignId));
  if (!campaignSnap.exists()) return;
  const campaign = campaignSnap.data() as Campaign;
  if (campaign.dmId !== dmUid) {
    throw new Error('Only the DM can delete a campaign.');
  }

  // Delete subcollection docs (members, encounters, notes, templates, whispers, rollRequests)
  const subcollections = ['members', 'encounters', 'notes', 'templates', 'whispers', 'rollRequests'];
  for (const sub of subcollections) {
    const subSnap = await getDocs(collection(db, 'campaigns', campaignId, sub));
    if (!subSnap.empty) {
      const batch = writeBatch(db);
      subSnap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
  }

  // Delete the campaign document itself
  await deleteDoc(doc(db, 'campaigns', campaignId));
}

/** Regenerate a campaign's join code. */
export async function regenerateJoinCode(campaignId: string): Promise<string> {
  const newCode = generateJoinCode();
  await updateDoc(doc(db, 'campaigns', campaignId), {
    joinCode: newCode,
    updatedAt: Date.now(),
  });
  return newCode;
}

/**
 * One-time migration: patch any campaigns created before the memberUids field
 * was introduced. Finds campaigns where this user is the DM but memberUids
 * doesn't include them, and seeds the array from the members subcollection.
 */
export async function migrateCampaignMemberUids(uid: string): Promise<void> {
  try {
    // Find campaigns where this user is the DM (they definitely should be a member)
    const q = query(
      campaignsCol(),
      where('dmId', '==', uid),
      where('status', '==', 'active'),
    );
    const snap = await getDocs(q);
    if (snap.empty) return;

    const batch = writeBatch(db);
    let patchCount = 0;

    for (const campaignDoc of snap.docs) {
      const data = campaignDoc.data() as Campaign;
      // Skip if memberUids already exists and contains the DM
      if (Array.isArray(data.memberUids) && data.memberUids.includes(uid)) continue;

      // Read all members from subcollection to build the array
      const membersSnap = await getDocs(membersCol(campaignDoc.id));
      const uids = membersSnap.docs.map(d => d.id);
      if (uids.length === 0) uids.push(uid); // At minimum, DM is a member

      batch.update(campaignDoc.ref, { memberUids: uids, updatedAt: Date.now() });
      patchCount++;
    }

    if (patchCount > 0) {
      await batch.commit();
      console.log(`[Campaigns] Migrated memberUids for ${patchCount} campaign(s)`);
    }
  } catch (err) {
    console.warn('[Campaigns] memberUids migration failed (non-critical):', err);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Campaign Subscriptions
// ═══════════════════════════════════════════════════════════════════════

/** Subscribe to all active campaigns the user is a member of. */
export function subscribeUserCampaigns(
  uid: string,
  onData: (campaigns: Campaign[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  // Query only campaigns where this user is a member using the denormalized memberUids array.
  // This is a single synchronous query with no async follow-up — no race conditions.
  const memberQuery = query(
    collection(db, 'campaigns'),
    where('memberUids', 'array-contains', uid),
    where('status', '==', 'active'),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(
    memberQuery,
    (snapshot) => {
      const campaigns = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Campaign));
      onData(campaigns);
    },
    (err) => {
      console.error('[Campaigns] subscription error:', err);
      onError?.(err);
    },
  );
}

/** Subscribe to a single campaign's data (real-time). */
export function subscribeToCampaign(
  campaignId: string,
  onData: (campaign: Campaign | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campaigns', campaignId),
    (snapshot) => {
      if (snapshot.exists()) {
        onData({ ...snapshot.data(), id: snapshot.id } as Campaign);
      } else {
        onData(null);
      }
    },
    (err) => {
      console.error('[Campaigns] campaign subscription error:', err);
      onError?.(err);
    },
  );
}

/** Subscribe to members of a campaign (real-time). */
export function subscribeToMembers(
  campaignId: string,
  onData: (members: CampaignMember[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    membersCol(campaignId),
    (snapshot) => {
      const members = snapshot.docs.map(d => d.data() as CampaignMember);
      onData(members);
    },
    (err) => {
      console.error('[Campaigns] members subscription error:', err);
      onError?.(err);
    },
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Join / Leave
// ═══════════════════════════════════════════════════════════════════════

/** Join a campaign via join code. Returns the campaign or null if not found. */
export async function joinCampaignByCode(
  joinCode: string,
  uid: string,
  displayName: string,
  characterId?: string,
): Promise<Campaign | null> {
  const q = query(
    campaignsCol(),
    where('joinCode', '==', joinCode.toUpperCase()),
    where('status', '==', 'active'),
    limit(1),
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const campaignDoc = snap.docs[0];
  const campaign = { ...campaignDoc.data(), id: campaignDoc.id } as Campaign;

  // Check if already a member
  const existingMember = await getDoc(doc(db, 'campaigns', campaign.id, 'members', uid));
  if (existingMember.exists()) return campaign; // Already in

  // Add as player
  const member: CampaignMember = {
    uid,
    displayName,
    role: 'player',
    characterId,
    joinedAt: Date.now(),
  };

  const batch = writeBatch(db);
  batch.set(doc(db, 'campaigns', campaign.id, 'members', uid), member);
  batch.update(doc(db, 'campaigns', campaign.id), { memberUids: arrayUnion(uid), updatedAt: Date.now() });
  await batch.commit();
  return campaign;
}

/** Leave a campaign. DM cannot leave (must archive instead). */
export async function leaveCampaign(
  campaignId: string,
  uid: string,
): Promise<void> {
  // Verify user isn't the DM
  const campaignSnap = await getDoc(doc(db, 'campaigns', campaignId));
  if (!campaignSnap.exists()) return;
  const campaign = campaignSnap.data() as Campaign;
  if (campaign.dmId === uid) {
    throw new Error('DM cannot leave their own campaign. Archive it instead.');
  }

  const batch = writeBatch(db);
  batch.delete(doc(db, 'campaigns', campaignId, 'members', uid));
  batch.update(doc(db, 'campaigns', campaignId), { memberUids: arrayRemove(uid), updatedAt: Date.now() });
  await batch.commit();
}

/** Remove a player from the campaign (DM only action). */
export async function removeMember(
  campaignId: string,
  targetUid: string,
): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, 'campaigns', campaignId, 'members', targetUid));
  batch.update(doc(db, 'campaigns', campaignId), { memberUids: arrayRemove(targetUid), updatedAt: Date.now() });
  await batch.commit();
}

// ═══════════════════════════════════════════════════════════════════════
// Invites
// ═══════════════════════════════════════════════════════════════════════

/** Create an email invite. */
export async function createInvite(
  campaignId: string,
  campaignName: string,
  email: string,
  invitedByUid: string,
  invitedByName: string,
): Promise<CampaignInvite> {
  const id = generateId();
  const invite: CampaignInvite = {
    id,
    email: email.toLowerCase(),
    invitedByUid,
    invitedByName,
    campaignId,
    campaignName,
    createdAt: Date.now(),
    status: 'pending',
  };

  await setDoc(doc(db, 'invites', id), invite);
  return invite;
}

/** Subscribe to pending invites for a user's email. */
export function subscribeToMyInvites(
  email: string,
  onData: (invites: CampaignInvite[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    invitesCol(),
    where('email', '==', email.toLowerCase()),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CampaignInvite)));
    },
    (err) => {
      console.error('[Campaigns] invites subscription error:', err);
      onError?.(err);
    },
  );
}

/** Accept a campaign invite. */
export async function acceptInvite(
  inviteId: string,
  uid: string,
  displayName: string,
  characterId?: string,
): Promise<void> {
  const inviteSnap = await getDoc(doc(db, 'invites', inviteId));
  if (!inviteSnap.exists()) throw new Error('Invite not found');

  const invite = inviteSnap.data() as CampaignInvite;

  const batch = writeBatch(db);

  // Update invite status
  batch.update(doc(db, 'invites', inviteId), { status: 'accepted' });

  // Add user as a member
  const member: CampaignMember = {
    uid,
    displayName,
    role: 'player',
    characterId,
    joinedAt: Date.now(),
  };
  batch.set(doc(db, 'campaigns', invite.campaignId, 'members', uid), member);
  batch.update(doc(db, 'campaigns', invite.campaignId), { memberUids: arrayUnion(uid), updatedAt: Date.now() });

  await batch.commit();
}

/** Decline a campaign invite. */
export async function declineInvite(inviteId: string): Promise<void> {
  await updateDoc(doc(db, 'invites', inviteId), { status: 'declined' });
}

// ═══════════════════════════════════════════════════════════════════════
// Combat Encounters
// ═══════════════════════════════════════════════════════════════════════

/** Create a new combat encounter. */
export async function createEncounter(
  campaignId: string,
  encounter: Omit<CombatEncounter, 'id' | 'createdAt'>,
): Promise<string> {
  const id = generateId();
  const data: CombatEncounter = {
    ...encounter,
    id,
    campaignId,
    createdAt: Date.now(),
  };

  await setDoc(doc(db, 'campaigns', campaignId, 'encounters', id), data);

  // Set as active encounter on the campaign
  await updateDoc(doc(db, 'campaigns', campaignId), {
    activeEncounterId: id,
    updatedAt: Date.now(),
  });

  return id;
}

/** Update an encounter (initiative order, HP changes, turn changes, etc.). */
export async function updateEncounter(
  campaignId: string,
  encounterId: string,
  updates: Partial<CombatEncounter>,
): Promise<void> {
  await updateDoc(
    doc(db, 'campaigns', campaignId, 'encounters', encounterId),
    updates,
  );
}

/** End an encounter. */
export async function endEncounter(
  campaignId: string,
  encounterId: string,
): Promise<void> {
  const batch = writeBatch(db);

  batch.update(doc(db, 'campaigns', campaignId, 'encounters', encounterId), {
    active: false,
    endedAt: Date.now(),
  });

  batch.update(doc(db, 'campaigns', campaignId), {
    activeEncounterId: null,
    updatedAt: Date.now(),
  });

  await batch.commit();
}

/** Subscribe to the active encounter for a campaign. */
export function subscribeToActiveEncounter(
  campaignId: string,
  encounterId: string,
  onData: (encounter: CombatEncounter | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'campaigns', campaignId, 'encounters', encounterId),
    (snapshot) => {
      if (snapshot.exists()) {
        onData({ ...snapshot.data(), id: snapshot.id } as CombatEncounter);
      } else {
        onData(null);
      }
    },
    (err) => {
      console.error('[Campaigns] encounter subscription error:', err);
      onError?.(err);
    },
  );
}

// ═══════════════════════════════════════════════════════════════════════
// DM Notes
// ═══════════════════════════════════════════════════════════════════════

/** Create a DM note. */
export async function createNote(
  campaignId: string,
  note: Omit<DMNote, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
  const id = generateId();
  const now = Date.now();
  const data: DMNote = {
    ...note,
    id,
    campaignId,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, 'campaigns', campaignId, 'notes', id), data);
  return id;
}

/** Update a DM note. */
export async function updateNote(
  campaignId: string,
  noteId: string,
  updates: Partial<DMNote>,
): Promise<void> {
  await updateDoc(doc(db, 'campaigns', campaignId, 'notes', noteId), {
    ...updates,
    updatedAt: Date.now(),
  });
}

/** Delete a DM note. */
export async function deleteNote(
  campaignId: string,
  noteId: string,
): Promise<void> {
  await deleteDoc(doc(db, 'campaigns', campaignId, 'notes', noteId));
}

/** Subscribe to all notes in a campaign (real-time). */
export function subscribeToNotes(
  campaignId: string,
  onData: (notes: DMNote[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    notesCol(campaignId),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as DMNote)));
    },
    (err) => {
      console.error('[Campaigns] notes subscription error:', err);
      onError?.(err);
    },
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Encounter Templates
// ═══════════════════════════════════════════════════════════════════════

/** Save an encounter template. */
export async function saveTemplate(
  campaignId: string,
  template: Omit<EncounterTemplate, 'id' | 'createdAt'>,
): Promise<string> {
  const id = generateId();
  const data: EncounterTemplate = {
    ...template,
    id,
    campaignId,
    createdAt: Date.now(),
  };

  await setDoc(doc(db, 'campaigns', campaignId, 'templates', id), data);
  return id;
}

/** Subscribe to encounter templates for a campaign. */
export function subscribeToTemplates(
  campaignId: string,
  onData: (templates: EncounterTemplate[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    templatesCol(campaignId),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as EncounterTemplate)));
    },
    (err) => {
      console.error('[Campaigns] templates subscription error:', err);
      onError?.(err);
    },
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Whispers (DM ↔ Player private messages)
// ═══════════════════════════════════════════════════════════════════════

/** Send a whisper. */
export async function sendWhisper(
  campaignId: string,
  fromUid: string,
  toUid: string,
  content: string,
): Promise<void> {
  const id = generateId();
  const whisper: Whisper = {
    id,
    campaignId,
    fromUid,
    toUid,
    content,
    read: false,
    createdAt: Date.now(),
  };

  await setDoc(doc(db, 'campaigns', campaignId, 'whispers', id), whisper);
}

/** Subscribe to whispers for a user in a campaign. */
export function subscribeToWhispers(
  campaignId: string,
  uid: string,
  onData: (whispers: Whisper[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  // Get whispers sent TO this user
  const q = query(
    whispersCol(campaignId),
    where('toUid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(50),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Whisper)));
    },
    (err) => {
      console.error('[Campaigns] whispers subscription error:', err);
      onError?.(err);
    },
  );
}

/** Mark a whisper as read. */
export async function markWhisperRead(
  campaignId: string,
  whisperId: string,
): Promise<void> {
  await updateDoc(doc(db, 'campaigns', campaignId, 'whispers', whisperId), {
    read: true,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// Roll Requests (DM asks players to roll)
// ═══════════════════════════════════════════════════════════════════════

/** Create a roll request from the DM. */
export async function createRollRequest(
  campaignId: string,
  dmUid: string,
  type: string,
  targetUids: string[],
  dc?: number,
): Promise<string> {
  const id = generateId();
  const rollReq: RollRequest = {
    id,
    campaignId,
    dmUid,
    type,
    dc,
    targetUids,
    responses: [],
    createdAt: Date.now(),
  };

  await setDoc(doc(db, 'campaigns', campaignId, 'rollRequests', id), rollReq);
  return id;
}

/** Subscribe to active roll requests for a campaign. */
export function subscribeToRollRequests(
  campaignId: string,
  onData: (requests: RollRequest[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    rollRequestsCol(campaignId),
    orderBy('createdAt', 'desc'),
    limit(20),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as RollRequest)));
    },
    (err) => {
      console.error('[Campaigns] rollRequests subscription error:', err);
      onError?.(err);
    },
  );
}

/** Submit a roll response to a roll request. */
export async function submitRollResponse(
  campaignId: string,
  requestId: string,
  response: RollRequest['responses'][0],
): Promise<void> {
  const reqDoc = doc(db, 'campaigns', campaignId, 'rollRequests', requestId);
  const snap = await getDoc(reqDoc);
  if (!snap.exists()) throw new Error('Roll request not found');

  const data = snap.data() as RollRequest;
  const updatedResponses = [...data.responses, response];

  await updateDoc(reqDoc, { responses: updatedResponses });
}
