// Fix: ClassOption is defined locally in this file, so it should not be imported from './types'
import { CharacterData, StatKey, Item } from './types';

export const generateId = () => Math.random().toString(36).substring(2, 11);

export interface RaceOption {
  name: string;
  speed: number;
  subraces?: string[];
}

export interface ClassOption {
  name: string;
  hitDie: number;
  primaryAbility: string;
  savingThrows: [StatKey, StatKey];
}

export const DND_RACES: RaceOption[] = [
  { name: 'Dragonborn', speed: 30 },
  { name: 'Dwarf', speed: 25, subraces: ['Hill Dwarf', 'Mountain Dwarf'] },
  { name: 'Elf', speed: 30, subraces: ['High Elf', 'Wood Elf', 'Drow Elf'] },
  { name: 'Gnome', speed: 25, subraces: ['Forest Gnome', 'Rock Gnome'] },
  { name: 'Half-Elf', speed: 30 },
  { name: 'Half-Orc', speed: 30 },
  { name: 'Halfling', speed: 25, subraces: ['Lightfoot Halfling', 'Stout Halfling'] },
  { name: 'Human', speed: 30 },
  { name: 'Tiefling', speed: 30 },
];

export const DND_CLASSES: ClassOption[] = [
  { name: 'Barbarian', hitDie: 12, primaryAbility: 'STR', savingThrows: ['STR', 'CON'] },
  { name: 'Bard', hitDie: 8, primaryAbility: 'CHA', savingThrows: ['DEX', 'CHA'] },
  { name: 'Cleric', hitDie: 8, primaryAbility: 'WIS', savingThrows: ['WIS', 'CHA'] },
  { name: 'Druid', hitDie: 8, primaryAbility: 'WIS', savingThrows: ['INT', 'WIS'] },
  { name: 'Fighter', hitDie: 10, primaryAbility: 'STR', savingThrows: ['STR', 'CON'] },
  { name: 'Monk', hitDie: 8, primaryAbility: 'DEX', savingThrows: ['STR', 'DEX'] },
  { name: 'Paladin', hitDie: 10, primaryAbility: 'STR', savingThrows: ['WIS', 'CHA'] },
  { name: 'Ranger', hitDie: 10, primaryAbility: 'DEX', savingThrows: ['STR', 'DEX'] },
  { name: 'Rogue', hitDie: 8, primaryAbility: 'DEX', savingThrows: ['DEX', 'INT'] },
  { name: 'Sorcerer', hitDie: 6, primaryAbility: 'CHA', savingThrows: ['CON', 'CHA'] },
  { name: 'Warlock', hitDie: 8, primaryAbility: 'CHA', savingThrows: ['WIS', 'CHA'] },
  { name: 'Wizard', hitDie: 6, primaryAbility: 'INT', savingThrows: ['INT', 'WIS'] },
];

export const DND_BACKGROUNDS = ['Acolyte', 'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero', 'Noble', 'Sage', 'Soldier', 'Urchin'];
export const DND_ALIGNMENTS = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];

export const RACIAL_BONUSES: Record<string, Partial<Record<StatKey, number>>> = {
  'Dragonborn': { STR: 2, CHA: 1 },
  'Hill Dwarf': { CON: 2, WIS: 1 },
  'Mountain Dwarf': { CON: 2, STR: 2 },
  'High Elf': { DEX: 2, INT: 1 },
  'Wood Elf': { DEX: 2, WIS: 1 },
  'Drow Elf': { DEX: 2, CHA: 1 },
  'Human': { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
};

export const POINT_BUY_COSTS: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const POINT_BUY_TOTAL = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;

export const SHOP_INVENTORY: Item[] = [
  { name: "Dagger", cost: 2, weight: 1, type: "Weapon", quantity: 1, notes: "1d4 piercing, Finesse, Light" },
  { name: "Longsword", cost: 15, weight: 3, type: "Weapon", quantity: 1, notes: "1d8 slashing, Versatile (1d10)" },
  { name: "Shortbow", cost: 25, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 piercing, Range 80/320" },
  { name: "Leather Armor", cost: 10, weight: 10, type: "Armor", quantity: 1, notes: "AC 11 + Dex" },
  { name: "Studded Leather", cost: 45, weight: 13, type: "Armor", quantity: 1, notes: "AC 12 + Dex" },
  { name: "Potion of Healing", cost: 50, weight: 0.5, type: "Consumable", quantity: 1, notes: "Heals 2d4+2 HP" },
];

export const getAllRaceOptions = () => DND_RACES.flatMap(r => r.subraces ? r.subraces : [r.name]);
export const getRaceSpeed = (n: string) => DND_RACES.find(r => r.name === n || r.subraces?.includes(n))?.speed || 30;
export const getClassData = (n: string) => DND_CLASSES.find(c => c.name === n);
export const getRacialBonus = (r: string, s: StatKey) => RACIAL_BONUSES[r]?.[s] ?? 0;
export const getRacialBonusDisplay = (r: string) => Object.entries(RACIAL_BONUSES[r] || {}).map(([s,v]) => `+${v} ${s}`).join(', ') || 'None';

export const VESPER_DATA: CharacterData = {
  id: "vesper-default",
  name: "Vesper",
  race: "Drow Elf",
  class: "Rogue",
  level: 1,
  campaign: "The Underdark Saga",
  portraitUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=800&auto=format&fit=crop",
  stats: {
    STR: { score: 8, modifier: -1, save: -1, proficientSave: false },
    DEX: { score: 18, modifier: 4, save: 6, proficientSave: true },
    CON: { score: 14, modifier: 2, save: 2, proficientSave: false },
    INT: { score: 12, modifier: 1, save: 3, proficientSave: true },
    WIS: { score: 10, modifier: 0, save: 0, proficientSave: false },
    CHA: { score: 15, modifier: 2, save: 2, proficientSave: false },
  },
  hp: { current: 10, max: 10 },
  hitDice: { current: 1, max: 1, die: "1d8" },
  ac: 15,
  initiative: 4,
  speed: 30,
  passivePerception: 14,
  skills: [
    { name: "Stealth", ability: "DEX", modifier: 8, proficiency: "expertise" },
    { name: "Perception", ability: "WIS", modifier: 4, proficiency: "expertise" },
  ],
  attacks: [
    { name: "Dagger", bonus: 6, damage: "1d4+4", type: "Piercing", range: "20/60" }
  ],
  features: [
    { name: "Sneak Attack", source: "Class", description: "Extra 1d6 damage once per turn.", fullText: "Beginning at 1st level..." }
  ],
  spells: [
    { name: "Dancing Lights", level: 0, school: "Evocation", castingTime: "1 action", range: "120 ft", components: "V, S, M", duration: "Concentration, up to 1 minute", description: "Create four torch-sized lights." }
  ],
  spellSlots: [
    { level: 1, current: 2, max: 2 },
    { level: 2, current: 0, max: 0 }
  ],
  inventory: { gold: 150.00, items: [], load: "Light" },
  journal: []
};