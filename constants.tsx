import { CharacterData, StatKey, Skill, Item } from './types';

// Helper to generate a unique ID
export const generateId = () => Math.random().toString(36).substring(2, 11);

// ==========================================
// D&D 5th Edition Reference Data
// ==========================================

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

export const DND_BACKGROUNDS: string[] = [
  'Acolyte',
  'Charlatan',
  'Criminal',
  'Entertainer',
  'Folk Hero',
  'Guild Artisan',
  'Hermit',
  'Noble',
  'Outlander',
  'Sage',
  'Sailor',
  'Soldier',
  'Urchin',
];

export const DND_ALIGNMENTS: string[] = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil',
];

// Basic Shop Inventory (SRD)
export const SHOP_INVENTORY: Item[] = [
  { name: "Dagger", cost: 2, weight: 1, type: "Weapon", quantity: 1, notes: "1d4 piercing, Finesse, Light" },
  { name: "Longsword", cost: 15, weight: 3, type: "Weapon", quantity: 1, notes: "1d8 slashing, Versatile (1d10)" },
  { name: "Shortbow", cost: 25, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 piercing, Two-handed" },
  { name: "Greatsword", cost: 50, weight: 6, type: "Weapon", quantity: 1, notes: "2d6 slashing, Heavy, Two-handed" },
  { name: "Leather Armor", cost: 10, weight: 10, type: "Armor", quantity: 1, notes: "AC 11, Light Armor" },
  { name: "Chain Shirt", cost: 50, weight: 20, type: "Armor", quantity: 1, notes: "AC 13, Medium Armor" },
  { name: "Plate Armor", cost: 1500, weight: 65, type: "Armor", quantity: 1, notes: "AC 18, Heavy Armor, Str 15" },
  { name: "Shield", cost: 10, weight: 6, type: "Armor", quantity: 1, notes: "+2 AC" },
  { name: "Potion of Healing", cost: 50, weight: 0.5, type: "Consumable", quantity: 1, notes: "Heals 2d4+2 HP" },
  { name: "Rations (1 day)", cost: 0.5, weight: 2, type: "Consumable", quantity: 1 },
  { name: "Rope, Hempen (50ft)", cost: 1, weight: 10, type: "Gear", quantity: 1 },
  { name: "Torch", cost: 0.01, weight: 1, type: "Gear", quantity: 1, notes: "Burns for 1 hour" },
  { name: "Backpack", cost: 2, weight: 5, type: "Gear", quantity: 1 },
  { name: "Bedroll", cost: 1, weight: 7, type: "Gear", quantity: 1 },
];

export const RACIAL_BONUSES: Record<string, Partial<Record<StatKey, number>>> = {
  'Dragonborn':          { STR: 2, CHA: 1 },
  'Hill Dwarf':          { CON: 2, WIS: 1 },
  'Mountain Dwarf':      { CON: 2, STR: 2 },
  'High Elf':            { DEX: 2, INT: 1 },
  'Wood Elf':            { DEX: 2, WIS: 1 },
  'Drow Elf':            { DEX: 2, CHA: 1 },
  'Forest Gnome':        { INT: 2, DEX: 1 },
  'Rock Gnome':          { INT: 2, CON: 1 },
  'Half-Elf':            { CHA: 2 },
  'Half-Orc':            { STR: 2, CON: 1 },
  'Lightfoot Halfling':  { DEX: 2, CHA: 1 },
  'Stout Halfling':      { DEX: 2, CON: 1 },
  'Human':               { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
  'Tiefling':            { CHA: 2, INT: 1 },
};

export const getRacialBonus = (race: string, stat: StatKey): number => {
  return RACIAL_BONUSES[race]?.[stat] ?? 0;
};

export const getRacialBonusDisplay = (race: string): string => {
  const bonuses = RACIAL_BONUSES[race];
  if (!bonuses) return 'None';
  return Object.entries(bonuses)
    .map(([stat, val]) => `+${val} ${stat}`)
    .join(', ');
};

export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};
export const POINT_BUY_TOTAL = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;

export const getAllRaceOptions = (): string[] => {
  const options: string[] = [];
  DND_RACES.forEach(race => {
    if (race.subraces && race.subraces.length > 0) {
      race.subraces.forEach(sub => options.push(sub));
    } else {
      options.push(race.name);
    }
  });
  return options;
};

export const getRaceSpeed = (raceName: string): number => {
  for (const race of DND_RACES) {
    if (race.name === raceName) return race.speed;
    if (race.subraces?.includes(raceName)) return race.speed;
  }
  return 30;
};

export const getClassData = (className: string): ClassOption | undefined => {
  return DND_CLASSES.find(c => c.name === className);
};

export const VESPER_DATA: CharacterData = {
  id: "vesper-default",
  campaign: "The Underdark Saga",
  name: "Vesper",
  nickname: "The Whisper",
  race: "Drow Elf",
  class: "Rogue",
  level: 1,
  portraitUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=800&auto=format&fit=crop",
  stats: {
    STR: { score: 8, modifier: -1, save: -1, proficientSave: false },
    DEX: { score: 18, modifier: +4, save: +6, proficientSave: true },
    CON: { score: 14, modifier: +2, save: +2, proficientSave: false },
    INT: { score: 12, modifier: +1, save: +3, proficientSave: true },
    WIS: { score: 10, modifier: +0, save: +0, proficientSave: false },
    CHA: { score: 15, modifier: +2, save: +2, proficientSave: false },
  },
  hp: { current: 10, max: 10 },
  hitDice: { current: 1, max: 1, die: "1d8" },
  ac: 15,
  initiative: 4,
  speed: 30,
  passivePerception: 14,
  skills: [
    { name: "Acrobatics", ability: "DEX", modifier: 6, proficiency: "proficient" },
    { name: "Animal Handling", ability: "WIS", modifier: 0, proficiency: "none" },
    { name: "Arcana", ability: "INT", modifier: 1, proficiency: "none" },
    { name: "Athletics", ability: "STR", modifier: -1, proficiency: "none" },
    { name: "Deception", ability: "CHA", modifier: 4, proficiency: "proficient" },
    { name: "History", ability: "INT", modifier: 1, proficiency: "none" },
    { name: "Insight", ability: "WIS", modifier: 0, proficiency: "none" },
    { name: "Intimidation", ability: "CHA", modifier: 2, proficiency: "none" },
    { name: "Investigation", ability: "INT", modifier: 1, proficiency: "none" },
    { name: "Medicine", ability: "WIS", modifier: 0, proficiency: "none" },
    { name: "Nature", ability: "INT", modifier: 1, proficiency: "none" },
    { name: "Perception", ability: "WIS", modifier: 4, proficiency: "expertise" },
    { name: "Performance", ability: "CHA", modifier: 2, proficiency: "none" },
    { name: "Persuasion", ability: "CHA", modifier: 2, proficiency: "none" },
    { name: "Religion", ability: "INT", modifier: 1, proficiency: "none" },
    { name: "Sleight of Hand", ability: "DEX", modifier: 4, proficiency: "none" },
    { name: "Stealth", ability: "DEX", modifier: 8, proficiency: "expertise" },
    { name: "Survival", ability: "WIS", modifier: 0, proficiency: "none" },
  ],
  attacks: [
    { name: "Dagger (Main)", bonus: 6, damage: "1d4+4", type: "Piercing", range: "20/60", properties: ["Finesse", "Light", "Thrown"] },
    { name: "Dagger (Off)", bonus: 6, damage: "1d4", type: "Piercing", range: "20/60", properties: ["Finesse", "Light", "Thrown"] },
    { name: "Shortbow", bonus: 6, damage: "1d6+4", type: "Piercing", range: "80/320", properties: ["Two-handed"] },
  ],
  features: [
    { 
      name: "Sneak Attack", 
      source: "Class", 
      description: "Deal extra 1d6 damage once per turn.",
      fullText: "Beginning at 1st level, you know how to strike subtly..."
    },
    { 
      name: "Expertise", 
      source: "Class", 
      description: "Double proficiency bonus for Stealth and Perception.",
      fullText: "At 1st level, choose two of your skill proficiencies..."
    },
    { 
      name: "Thieves' Cant", 
      source: "Class", 
      description: "A secret mix of dialect, jargon, and code.",
      fullText: "During your rogue training you learned thieves' cant..."
    },
    { 
      name: "Superior Darkvision", 
      source: "Race", 
      description: "See in dark up to 120ft.",
      fullText: "Your darkvision has a radius of 120 feet."
    },
    { 
      name: "Sunlight Sensitivity", 
      source: "Race", 
      description: "Disadvantage in direct sunlight.",
      fullText: "You have disadvantage on attack rolls..."
    },
  ],
  spells: [],
  spellSlots: [],
  inventory: {
    gold: 150,
    items: [
      { name: "Leather Armor", quantity: 1, notes: "AC 11, Light Armor", cost: 10, type: "Armor", equipped: true },
      { name: "Thieves' Tools", quantity: 1, cost: 25, type: "Gear" },
      { name: "Dagger", quantity: 2, cost: 2, type: "Weapon", equipped: true, notes: "1d4 piercing, Finesse" },
      { name: "Shortbow", quantity: 1, cost: 25, type: "Weapon", equipped: false, notes: "1d6 piercing, Two-handed" },
      { name: "Arrows", quantity: 20, cost: 1, type: "Consumable" },
      { name: "Burglar's Pack", quantity: 1, cost: 16, type: "Gear" },
    ],
    load: "Light"
  },
  journal: [
    { id: '1', timestamp: Date.now(), type: 'note', content: 'We arrived in the Underdark. The air is stale and cold.' },
  ]
};

export const createNewCharacter = (name: string, race: string, charClass: string, background?: string, alignment?: string): CharacterData => {
  const defaultSkills: Skill[] = [
    { name: "Acrobatics", ability: "DEX", modifier: 0, proficiency: "none" },
    { name: "Animal Handling", ability: "WIS", modifier: 0, proficiency: "none" },
    { name: "Arcana", ability: "INT", modifier: 0, proficiency: "none" },
    { name: "Athletics", ability: "STR", modifier: 0, proficiency: "none" },
    { name: "Deception", ability: "CHA", modifier: 0, proficiency: "none" },
    { name: "History", ability: "INT", modifier: 0, proficiency: "none" },
    { name: "Insight", ability: "WIS", modifier: 0, proficiency: "none" },
    { name: "Intimidation", ability: "CHA", modifier: 0, proficiency: "none" },
    { name: "Investigation", ability: "INT", modifier: 0, proficiency: "none" },
    { name: "Medicine", ability: "WIS", modifier: 0, proficiency: "none" },
    { name: "Nature", ability: "INT", modifier: 0, proficiency: "none" },
    { name: "Perception", ability: "WIS", modifier: 0, proficiency: "none" },
    { name: "Performance", ability: "CHA", modifier: 0, proficiency: "none" },
    { name: "Persuasion", ability: "CHA", modifier: 0, proficiency: "none" },
    { name: "Religion", ability: "INT", modifier: 0, proficiency: "none" },
    { name: "Sleight of Hand", ability: "DEX", modifier: 0, proficiency: "none" },
    { name: "Stealth", ability: "DEX", modifier: 0, proficiency: "none" },
    { name: "Survival", ability: "WIS", modifier: 0, proficiency: "none" },
  ];

  const classData = getClassData(charClass);
  const hitDie = classData?.hitDie ?? 8;
  const speed = getRaceSpeed(race);
  const proficientSaves = classData?.savingThrows ?? ['STR', 'CON'];

  const baseStats: Record<StatKey, { score: number; modifier: number; save: number; proficientSave: boolean }> = {
    STR: { score: 10, modifier: 0, save: 0, proficientSave: proficientSaves.includes('STR') },
    DEX: { score: 10, modifier: 0, save: 0, proficientSave: proficientSaves.includes('DEX') },
    CON: { score: 10, modifier: 0, save: 0, proficientSave: proficientSaves.includes('CON') },
    INT: { score: 10, modifier: 0, save: 0, proficientSave: proficientSaves.includes('INT') },
    WIS: { score: 10, modifier: 0, save: 0, proficientSave: proficientSaves.includes('WIS') },
    CHA: { score: 10, modifier: 0, save: 0, proficientSave: proficientSaves.includes('CHA') },
  };

  const id = generateId();

  return {
    id: id,
    campaign: "New Campaign",
    name: name || "Unknown Hero",
    nickname: "",
    race: race || "Human",
    class: charClass || "Fighter",
    level: 1,
    portraitUrl: `https://picsum.photos/seed/${id}/400/600`,
    stats: baseStats,
    hp: { current: hitDie, max: hitDie },
    hitDice: { current: 1, max: 1, die: `1d${hitDie}` },
    ac: 10 + baseStats.DEX.modifier,
    initiative: baseStats.DEX.modifier,
    speed: speed,
    passivePerception: 10 + baseStats.WIS.modifier,
    skills: defaultSkills,
    attacks: [
      { name: "Unarmed Strike", bonus: baseStats.STR.modifier + 2, damage: `1${baseStats.STR.modifier >= 0 ? '+' : ''}${baseStats.STR.modifier}`, type: "Bludgeoning" }
    ],
    features: [],
    spells: [],
    spellSlots: [],
    inventory: {
      gold: 150, // Standard starting gold
      items: [],
      load: "Light"
    },
    journal: []
  };
};