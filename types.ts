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
  source: 'Race' | 'Class' | 'Background';
  description: string;
  fullText: string;
}

export interface Item {
  name: string;
  quantity: number;
  notes?: string;
}

export interface CharacterData {
  id: string; // Unique ID
  campaign?: string; // Campaign Name
  name: string;
  nickname: string;
  race: string;
  class: string;
  level: number;
  portraitUrl: string;
  stats: Record<StatKey, AbilityScore>;
  hp: { current: number; max: number };
  ac: number;
  initiative: number;
  speed: number;
  passivePerception: number;
  skills: Skill[];
  attacks: Attack[];
  features: Feature[];
  inventory: {
    gold: number;
    items: Item[];
    load: 'Light' | 'Medium' | 'Heavy';
  };
}

export type StackType = 'vitals' | 'combat' | 'skills' | 'features' | 'inventory';

export interface RollResult {
  label: string;
  total: number;
  die: string;
  rolls: number[];
  modifier: number;
}
