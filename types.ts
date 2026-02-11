export type StatKey = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface AbilityScore {
  score: number;
  modifier: number;
  save: number;
  proficientSave: boolean;
}

export interface Skill {
  name: string;
  ability: StatKey;
  modifier: number;
  proficiency: 'none' | 'proficient' | 'expertise';
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
  source: 'Race' | 'Class' | 'Background' | 'Feat';
  description: string;
  fullText: string;
}

export interface Item {
  name: string;
  quantity: number;
  notes?: string;
  cost?: number; // In gp
  weight?: number; // In lbs
  type?: 'Weapon' | 'Armor' | 'Gear' | 'Consumable' | 'Magic Item';
  equipped?: boolean;
  slot?: 'Main Hand' | 'Off Hand' | 'Body' | 'Accessory';
  armorClass?: number; // If armor
}

export interface Spell {
  name: string;
  level: number;
  school?: string;
  castingTime?: string;
  range?: string;
  components?: string;
  duration?: string;
  description: string;
  prepared?: boolean;
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  type: 'note' | 'npc' | 'location' | 'summary';
  content: string;
  tags?: string[];
}

export interface CharacterData {
  id: string; // Unique ID
  campaign?: string; // Campaign Name
  name: string;
  nickname: string;
  race: string;
  class: string;
  background?: string;
  alignment?: string;
  level: number;
  portraitUrl: string;
  stats: Record<StatKey, AbilityScore>;
  hp: { current: number; max: number };
  hitDice: { current: number; max: number; die: string };
  ac: number;
  initiative: number;
  speed: number;
  passivePerception: number;
  skills: Skill[];
  attacks: Attack[];
  features: Feature[];
  spells: Spell[]; 
  spellSlots: { current: number; max: number; level: number }[];
  inventory: {
    gold: number;
    items: Item[];
    load: 'Light' | 'Medium' | 'Heavy';
  };
  journal: JournalEntry[];
}

export type StackType = 'vitals' | 'combat' | 'skills' | 'features' | 'inventory' | 'journal';

export interface RollResult {
  label: string;
  total: number;
  die: string;
  rolls: number[];
  modifier: number;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  dmId: string; // User ID of the DM
  description: string;
  joinCode: string;
  members: { uid: string; characterId?: string; name: string }[];
  createdAt: number;
}