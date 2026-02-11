
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
  name: string;
  nickname?: string;
  race: string;
  class: string;
  background?: string;
  alignment?: string;
  level: number;
  campaign?: string;
  portraitUrl: string;
  stats: Record<StatKey, Stat>;
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
  members: { uid: string; name: string }[];
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export type StackType = 'vitals' | 'combat' | 'skills' | 'features' | 'inventory' | 'journal' | 'spells';

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
