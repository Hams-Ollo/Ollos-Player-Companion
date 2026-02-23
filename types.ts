
export type StatKey = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface Stat {
  score: number;
  modifier: number;
  save: number;
  proficientSave: boolean;
}

export type ProficiencyLevel = 'none' | 'proficient' | 'expertise';

export interface Skill {
  name: string;
  ability: StatKey;
  modifier: number;
  proficiency: ProficiencyLevel;
}

export interface Attack {
  name: string;
  bonus: number;
  damage: string;
  type: string;
  range?: string;
  properties?: string[];
}

export interface Feature {
  name: string;
  source: string;
  description: string;
  fullText: string;
}

export interface Spell {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  atHigherLevels?: string;
}

export interface Item {
  name: string;
  quantity: number;
  type?: 'Weapon' | 'Armor' | 'Gear' | 'Consumable' | 'Magic Item';
  cost?: number;
  weight?: number;
  notes?: string;
  equipped?: boolean;
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  type: 'note' | 'npc' | 'location' | 'summary' | 'bond';
  content: string;
}

export interface CharacterData {
  id: string;
  ownerUid?: string;
  createdAt?: number;
  updatedAt?: number;
  name: string;
  nickname?: string;
  race: string;
  class: string;
  background?: string;
  alignment?: string;
  level: number;
  subclass?: string;
  campaign?: string;
  campaignId?: string;
  portraitUrl: string;
  stats: Record<StatKey, Stat>;
  hp: { current: number; max: number };
  hitDice: { current: number; max: number; die: string };
  ac: number;
  initiative: number;
  speed: number;
  passivePerception: number;
  activeConditions?: string[];
  exhaustionLevel?: number;
  heroicInspiration?: boolean;
  xp?: number;
  skills: Skill[];
  attacks: Attack[];
  features: Feature[];
  spells: Spell[];
  spellSlots: { level: number; current: number; max: number }[];
  inventory: {
    gold: number;
    items: Item[];
    load: string;
  };
  journal: JournalEntry[];
  motivations?: string;
  keyNPCs?: string;
}

export interface Campaign {
  id: string;
  name: string;
  dmId: string;
  description: string;
  joinCode: string;
  members: CampaignMember[];
  /** Denormalized array of member UIDs for efficient array-contains queries */
  memberUids: string[];
  status: CampaignStatus;
  currentSessionNumber: number;
  activeEncounterId?: string;
  settings: CampaignSettings;
  createdAt: number;
  updatedAt?: number;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export type StackType = 'vitals' | 'combat' | 'skills' | 'features' | 'inventory' | 'journal' | 'spells' | 'party';

export type RollMode = 'normal' | 'advantage' | 'disadvantage';

export interface DiceGroup {
  sides: number;
  rolls: number[];
  dropped?: number; // For adv/dis
}

export interface RollResult {
  label: string;
  total: number;
  expression: string;
  diceGroups: DiceGroup[];
  modifier: number;
  mode: RollMode;
}

// ─── Campaign & Multiplayer Types ────────────────────────────────────────────

export type CampaignRole = 'dm' | 'player';
export type CampaignStatus = 'active' | 'archived';

export interface CampaignMember {
  uid: string;
  displayName: string;
  role: CampaignRole;
  characterId?: string;
  characterSummary?: CampaignMemberCharacterSummary;
  joinedAt: number;
  lastSeen?: number;
}

export interface CampaignMemberCharacterSummary {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  portraitUrl: string;
  hpCurrent: number;
  hpMax: number;
  ac: number;
  initiative: number;
  passivePerception: number;
  keySkills: { name: string; modifier: number }[];
  topFeatures: string[];
  primaryAttack?: string;
  journalPreview?: string;
}

export interface CampaignSettings {
  allowPlayerInvites: boolean;
  defaultCharacterVisibility: 'full' | 'limited' | 'hidden';
}

export interface CampaignInvite {
  id: string;
  email: string;
  invitedByUid: string;
  invitedByName: string;
  campaignId: string;
  campaignName: string;
  createdAt: number;
  expiresAt?: number;
  status: 'pending' | 'accepted' | 'declined';
}

// ─── Equipment Pack Types ─────────────────────────────────────────────────────

export interface EquipmentPack {
  label: string;
  description: string;
  items: Item[];
  goldCost: number;
}

// ─── Combat & Encounter Types ────────────────────────────────────────────────

export type CombatantType = 'pc' | 'npc' | 'monster';

/** A single attack action for an NPC or monster stat block */
export interface NPCAttack {
  name: string;
  attackBonus: number;
  reach?: string;
  range?: string;
  targets: string;
  damageExpression: string;   // e.g. "2d6+4"
  damageType: string;         // e.g. "Slashing"
  additionalEffects?: string;
  requiresWeapon?: string;
  requiresSpell?: string;
}

/** Full structured stat block for an NPC or monster */
export interface NPCStatBlock {
  cr?: string;
  size?: string;
  creatureType?: string;
  alignment?: string;
  hp?: number;
  ac?: number;
  speed?: string;
  abilityScores?: Record<StatKey, number>;
  savingThrows?: Partial<Record<StatKey, number>>;
  skillBonuses?: { name: string; modifier: number }[];
  damageImmunities?: string[];
  conditionImmunities?: string[];
  senses?: string;
  languages?: string;
  traits?: { name: string; description: string }[];
  attacks: NPCAttack[];
  legendaryActionsDesc?: string;
  xp?: number;
}

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  ac: number;
  type: CombatantType;
  /** Reference to CharacterData.id for PCs */
  characterId?: string;
  conditions: string[];
  /** Structured stat block (monsters / NPCs) */
  statBlock?: NPCStatBlock;
  /** Fixed-initiative event entry (e.g. lair actions at initiative 20) */
  isLairAction?: boolean;
  /** Legendary action uses remaining (resets on creature's turn) */
  legendaryActions?: number;
  legendaryActionsMax?: number;
  /** Whether the combatant is concentrating on a spell */
  concentrating?: boolean;
}

export type CombatLogEntryType = 'turn_change' | 'damage' | 'heal' | 'condition' | 'roll' | 'note' | 'encounter_start' | 'encounter_end';

export interface CombatLogEntry {
  timestamp: number;
  type: CombatLogEntryType;
  actorName?: string;
  description: string;
}

export interface CombatEncounter {
  id: string;
  campaignId: string;
  name: string;
  active: boolean;
  round: number;
  currentTurnIndex: number;
  combatants: Combatant[];
  log: CombatLogEntry[];
  createdAt: number;
  endedAt?: number;
}

export interface EncounterTemplate {
  id: string;
  campaignId: string;
  name: string;
  /** Combatants without runtime state (id, initiative) */
  combatants: Omit<Combatant, 'id' | 'initiative'>[];
  difficulty?: string;
  notes?: string;
  createdAt: number;
}

// ─── DM Notes Types ──────────────────────────────────────────────────────────

export type DMNoteType = 'session' | 'event' | 'npc' | 'location' | 'lore' | 'quest';

export interface LinkedEntity {
  type: DMNoteType | 'character';
  id: string;
  name: string;
}

export interface DMNote {
  id: string;
  campaignId: string;
  authorUid: string;
  title: string;
  content: string;
  tags: string[];
  type: DMNoteType;
  sessionNumber?: number;
  linkedEntities?: LinkedEntity[];
  createdAt: number;
  updatedAt: number;
}

// ─── Multiplayer Communication Types ─────────────────────────────────────────

export interface Whisper {
  id: string;
  campaignId: string;
  fromUid: string;
  toUid: string;
  content: string;
  read: boolean;
  createdAt: number;
}

export type CampaignChatChannel = 'round_table' | 'party_private';

export interface CampaignChatMessage {
  id: string;
  campaignId: string;
  channel: CampaignChatChannel;
  fromUid: string;
  fromDisplayName: string;
  content: string;
  createdAt: number;
}

// ─── AI Encounter Generation Types ──────────────────────────────────────────

export interface EncounterGenerationRequest {
  scenarioDescription: string;
  partyLevels: number[];
  partyClasses: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
  environment?: string;
}

export interface GeneratedCreature {
  name: string;
  count: number;
  statBlock: NPCStatBlock;
  tacticsNotes?: string;
}

export interface GeneratedEncounterResponse {
  name: string;
  narrativeHook: string;
  creatures: GeneratedCreature[];
  terrainFeatures: string[];
  difficultyRating: 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly';
  totalXP: number;
  adjustedXP: number;
}

export interface RollRequestResponse {
  uid: string;
  displayName: string;
  result: RollResult;
  timestamp: number;
}

export interface RollRequest {
  id: string;
  campaignId: string;
  dmUid: string;
  /** e.g. "Wisdom Saving Throw", "Perception Check" */
  type: string;
  dc?: number;
  targetUids: string[];
  responses: RollRequestResponse[];
  createdAt: number;
}
