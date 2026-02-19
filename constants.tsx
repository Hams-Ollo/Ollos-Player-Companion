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
  primaryAbility: StatKey;
  savingThrows: [StatKey, StatKey];
  skillsToPick: number;
  skillChoices: string[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies?: string[];
  isCaster: boolean;
  spellcastingAbility?: StatKey;
  subclassLevel: number;
  subclassName: string;
  asiLevels: number[];
  expertiseLevels?: number[];
}

export const DND_SKILLS: { name: string; ability: StatKey }[] = [
  { name: 'Acrobatics', ability: 'DEX' },
  { name: 'Animal Handling', ability: 'WIS' },
  { name: 'Arcana', ability: 'INT' },
  { name: 'Athletics', ability: 'STR' },
  { name: 'Deception', ability: 'CHA' },
  { name: 'History', ability: 'INT' },
  { name: 'Insight', ability: 'WIS' },
  { name: 'Intimidation', ability: 'CHA' },
  { name: 'Investigation', ability: 'INT' },
  { name: 'Medicine', ability: 'WIS' },
  { name: 'Nature', ability: 'INT' },
  { name: 'Perception', ability: 'WIS' },
  { name: 'Performance', ability: 'CHA' },
  { name: 'Persuasion', ability: 'CHA' },
  { name: 'Religion', ability: 'INT' },
  { name: 'Sleight of Hand', ability: 'DEX' },
  { name: 'Stealth', ability: 'DEX' },
  { name: 'Survival', ability: 'WIS' },
];

export const DND_TOOLS = [
  "Thieves' Tools", "Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies", 
  "Carpenter's Tools", "Cartographer's Tools", "Cook's Utensils", "Glassblower's Tools",
  "Jeweler's Tools", "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies",
  "Potter's Tools", "Smith's Tools", "Tinker's Tools", "Weaver's Tools", "Woodcarver's Tools"
];

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
  { name: 'Barbarian', hitDie: 12, primaryAbility: 'STR', savingThrows: ['STR', 'CON'],
    skillsToPick: 2, skillChoices: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
    armorProficiencies: ['Light', 'Medium', 'Shields'], weaponProficiencies: ['Simple', 'Martial'],
    isCaster: false, subclassLevel: 3, subclassName: 'Primal Path', asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Bard', hitDie: 8, primaryAbility: 'CHA', savingThrows: ['DEX', 'CHA'],
    skillsToPick: 3, skillChoices: ['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'],
    armorProficiencies: ['Light'], weaponProficiencies: ['Simple', 'Hand crossbow', 'Longsword', 'Rapier', 'Shortsword'],
    toolProficiencies: ['Three musical instruments of your choice'],
    isCaster: true, spellcastingAbility: 'CHA', subclassLevel: 3, subclassName: 'Bard College',
    asiLevels: [4, 8, 12, 16, 19], expertiseLevels: [3, 10] },
  { name: 'Cleric', hitDie: 8, primaryAbility: 'WIS', savingThrows: ['WIS', 'CHA'],
    skillsToPick: 2, skillChoices: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    armorProficiencies: ['Light', 'Medium', 'Shields'], weaponProficiencies: ['Simple'],
    isCaster: true, spellcastingAbility: 'WIS', subclassLevel: 1, subclassName: 'Divine Domain',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Druid', hitDie: 8, primaryAbility: 'WIS', savingThrows: ['INT', 'WIS'],
    skillsToPick: 2, skillChoices: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    armorProficiencies: ['Light', 'Medium (nonmetal)', 'Shields (nonmetal)'],
    weaponProficiencies: ['Club', 'Dagger', 'Dart', 'Javelin', 'Mace', 'Quarterstaff', 'Scimitar', 'Sickle', 'Sling', 'Spear'],
    toolProficiencies: ['Herbalism kit'],
    isCaster: true, spellcastingAbility: 'WIS', subclassLevel: 2, subclassName: 'Druid Circle',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Fighter', hitDie: 10, primaryAbility: 'STR', savingThrows: ['STR', 'CON'],
    skillsToPick: 2, skillChoices: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    armorProficiencies: ['Light', 'Medium', 'Heavy', 'Shields'], weaponProficiencies: ['Simple', 'Martial'],
    isCaster: false, subclassLevel: 3, subclassName: 'Martial Archetype',
    asiLevels: [4, 6, 8, 12, 14, 16, 19] },
  { name: 'Monk', hitDie: 8, primaryAbility: 'DEX', savingThrows: ['STR', 'DEX'],
    skillsToPick: 2, skillChoices: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    armorProficiencies: [], weaponProficiencies: ['Simple', 'Shortsword'],
    toolProficiencies: ['One artisan tool or musical instrument'],
    isCaster: false, subclassLevel: 3, subclassName: 'Monastic Tradition',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Paladin', hitDie: 10, primaryAbility: 'STR', savingThrows: ['WIS', 'CHA'],
    skillsToPick: 2, skillChoices: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    armorProficiencies: ['Light', 'Medium', 'Heavy', 'Shields'], weaponProficiencies: ['Simple', 'Martial'],
    isCaster: true, spellcastingAbility: 'CHA', subclassLevel: 3, subclassName: 'Sacred Oath',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Ranger', hitDie: 10, primaryAbility: 'DEX', savingThrows: ['STR', 'DEX'],
    skillsToPick: 3, skillChoices: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
    armorProficiencies: ['Light', 'Medium', 'Shields'], weaponProficiencies: ['Simple', 'Martial'],
    isCaster: true, spellcastingAbility: 'WIS', subclassLevel: 3, subclassName: 'Ranger Archetype',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Rogue', hitDie: 8, primaryAbility: 'DEX', savingThrows: ['DEX', 'INT'],
    skillsToPick: 4, skillChoices: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
    armorProficiencies: ['Light'], weaponProficiencies: ['Simple', 'Hand crossbow', 'Longsword', 'Rapier', 'Shortsword'],
    toolProficiencies: ["Thieves' Tools"],
    isCaster: false, subclassLevel: 3, subclassName: 'Roguish Archetype',
    asiLevels: [4, 8, 10, 12, 16, 19], expertiseLevels: [1, 6] },
  { name: 'Sorcerer', hitDie: 6, primaryAbility: 'CHA', savingThrows: ['CON', 'CHA'],
    skillsToPick: 2, skillChoices: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    armorProficiencies: [], weaponProficiencies: ['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light crossbow'],
    isCaster: true, spellcastingAbility: 'CHA', subclassLevel: 1, subclassName: 'Sorcerous Origin',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Warlock', hitDie: 8, primaryAbility: 'CHA', savingThrows: ['WIS', 'CHA'],
    skillsToPick: 2, skillChoices: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
    armorProficiencies: ['Light'], weaponProficiencies: ['Simple'],
    isCaster: true, spellcastingAbility: 'CHA', subclassLevel: 1, subclassName: 'Otherworldly Patron',
    asiLevels: [4, 8, 12, 16, 19] },
  { name: 'Wizard', hitDie: 6, primaryAbility: 'INT', savingThrows: ['INT', 'WIS'],
    skillsToPick: 2, skillChoices: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    armorProficiencies: [], weaponProficiencies: ['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light crossbow'],
    isCaster: true, spellcastingAbility: 'INT', subclassLevel: 2, subclassName: 'Arcane Tradition',
    asiLevels: [4, 8, 12, 16, 19] },
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
  'Forest Gnome': { INT: 2, DEX: 1 },
  'Rock Gnome': { INT: 2, CON: 1 },
  'Half-Elf': { CHA: 2 },
  'Half-Orc': { STR: 2, CON: 1 },
  'Lightfoot Halfling': { DEX: 2, CHA: 1 },
  'Stout Halfling': { DEX: 2, CON: 1 },
  'Human': { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
  'Tiefling': { CHA: 2, INT: 1 },
};

export const POINT_BUY_COSTS: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const POINT_BUY_TOTAL = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;

export const SHOP_INVENTORY: Item[] = [
  // ======================================
  // SIMPLE MELEE WEAPONS (PHB Ch.5)
  // ======================================
  { name: "Club", cost: 0.1, weight: 2, type: "Weapon", quantity: 1, notes: "1d4 bludgeoning, Light" },
  { name: "Dagger", cost: 2, weight: 1, type: "Weapon", quantity: 1, notes: "1d4 piercing, Finesse, Light, Thrown (20/60)" },
  { name: "Greatclub", cost: 0.2, weight: 10, type: "Weapon", quantity: 1, notes: "1d8 bludgeoning, Two-handed" },
  { name: "Handaxe", cost: 5, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 slashing, Light, Thrown (20/60)" },
  { name: "Javelin", cost: 0.5, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 piercing, Thrown (30/120)" },
  { name: "Light Hammer", cost: 2, weight: 2, type: "Weapon", quantity: 1, notes: "1d4 bludgeoning, Light, Thrown (20/60)" },
  { name: "Mace", cost: 5, weight: 4, type: "Weapon", quantity: 1, notes: "1d6 bludgeoning" },
  { name: "Quarterstaff", cost: 0.2, weight: 4, type: "Weapon", quantity: 1, notes: "1d6 bludgeoning, Versatile (1d8)" },
  { name: "Sickle", cost: 1, weight: 2, type: "Weapon", quantity: 1, notes: "1d4 slashing, Light" },
  { name: "Spear", cost: 1, weight: 3, type: "Weapon", quantity: 1, notes: "1d6 piercing, Thrown (20/60), Versatile (1d8)" },

  // ======================================
  // SIMPLE RANGED WEAPONS (PHB Ch.5)
  // ======================================
  { name: "Crossbow, Light", cost: 25, weight: 5, type: "Weapon", quantity: 1, notes: "1d8 piercing, Ammunition, Loading, Range 80/320, Two-handed" },
  { name: "Dart", cost: 0.05, weight: 0.25, type: "Weapon", quantity: 1, notes: "1d4 piercing, Finesse, Thrown (20/60)" },
  { name: "Shortbow", cost: 25, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 piercing, Ammunition, Range 80/320, Two-handed" },
  { name: "Sling", cost: 0.1, weight: 0, type: "Weapon", quantity: 1, notes: "1d4 bludgeoning, Ammunition, Range 30/120" },

  // ======================================
  // MARTIAL MELEE WEAPONS (PHB Ch.5)
  // ======================================
  { name: "Battleaxe", cost: 10, weight: 4, type: "Weapon", quantity: 1, notes: "1d8 slashing, Versatile (1d10)" },
  { name: "Flail", cost: 10, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 bludgeoning" },
  { name: "Glaive", cost: 20, weight: 6, type: "Weapon", quantity: 1, notes: "1d10 slashing, Heavy, Reach, Two-handed" },
  { name: "Greataxe", cost: 30, weight: 7, type: "Weapon", quantity: 1, notes: "1d12 slashing, Heavy, Two-handed" },
  { name: "Greatsword", cost: 50, weight: 6, type: "Weapon", quantity: 1, notes: "2d6 slashing, Heavy, Two-handed" },
  { name: "Halberd", cost: 20, weight: 6, type: "Weapon", quantity: 1, notes: "1d10 slashing, Heavy, Reach, Two-handed" },
  { name: "Lance", cost: 10, weight: 6, type: "Weapon", quantity: 1, notes: "1d12 piercing, Reach, Special" },
  { name: "Longsword", cost: 15, weight: 3, type: "Weapon", quantity: 1, notes: "1d8 slashing, Versatile (1d10)" },
  { name: "Maul", cost: 10, weight: 10, type: "Weapon", quantity: 1, notes: "2d6 bludgeoning, Heavy, Two-handed" },
  { name: "Morningstar", cost: 15, weight: 4, type: "Weapon", quantity: 1, notes: "1d8 piercing" },
  { name: "Pike", cost: 5, weight: 18, type: "Weapon", quantity: 1, notes: "1d10 piercing, Heavy, Reach, Two-handed" },
  { name: "Rapier", cost: 25, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 piercing, Finesse" },
  { name: "Scimitar", cost: 25, weight: 3, type: "Weapon", quantity: 1, notes: "1d6 slashing, Finesse, Light" },
  { name: "Shortsword", cost: 10, weight: 2, type: "Weapon", quantity: 1, notes: "1d6 piercing, Finesse, Light" },
  { name: "Trident", cost: 5, weight: 4, type: "Weapon", quantity: 1, notes: "1d6 piercing, Thrown (20/60), Versatile (1d8)" },
  { name: "War Pick", cost: 5, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 piercing" },
  { name: "Warhammer", cost: 15, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 bludgeoning, Versatile (1d10)" },
  { name: "Whip", cost: 2, weight: 3, type: "Weapon", quantity: 1, notes: "1d4 slashing, Finesse, Reach" },

  // ======================================
  // MARTIAL RANGED WEAPONS (PHB Ch.5)
  // ======================================
  { name: "Blowgun", cost: 10, weight: 1, type: "Weapon", quantity: 1, notes: "1 piercing, Ammunition, Loading, Range 25/100" },
  { name: "Crossbow, Hand", cost: 75, weight: 3, type: "Weapon", quantity: 1, notes: "1d6 piercing, Ammunition, Light, Loading, Range 30/120" },
  { name: "Crossbow, Heavy", cost: 50, weight: 18, type: "Weapon", quantity: 1, notes: "1d10 piercing, Ammunition, Heavy, Loading, Range 100/400, Two-handed" },
  { name: "Longbow", cost: 50, weight: 2, type: "Weapon", quantity: 1, notes: "1d8 piercing, Ammunition, Heavy, Range 150/600, Two-handed" },
  { name: "Net", cost: 1, weight: 3, type: "Weapon", quantity: 1, notes: "Special, Thrown (5/15)" },

  // ======================================
  // AMMUNITION (PHB Ch.5)
  // ======================================
  { name: "Arrows (20)", cost: 1, weight: 1, type: "Gear", quantity: 1, notes: "Ammunition for bows" },
  { name: "Blowgun Needles (50)", cost: 1, weight: 1, type: "Gear", quantity: 1, notes: "Ammunition for blowguns" },
  { name: "Crossbow Bolts (20)", cost: 1, weight: 1.5, type: "Gear", quantity: 1, notes: "Ammunition for crossbows" },
  { name: "Sling Bullets (20)", cost: 0.04, weight: 1.5, type: "Gear", quantity: 1, notes: "Ammunition for slings" },

  // ======================================
  // LIGHT ARMOR (PHB Ch.5)
  // ======================================
  { name: "Padded Armor", cost: 5, weight: 8, type: "Armor", quantity: 1, notes: "AC 11 + Dex, Disadvantage on Stealth" },
  { name: "Leather Armor", cost: 10, weight: 10, type: "Armor", quantity: 1, notes: "AC 11 + Dex" },
  { name: "Studded Leather", cost: 45, weight: 13, type: "Armor", quantity: 1, notes: "AC 12 + Dex" },

  // ======================================
  // MEDIUM ARMOR (PHB Ch.5)
  // ======================================
  { name: "Hide Armor", cost: 10, weight: 12, type: "Armor", quantity: 1, notes: "AC 12 + Dex (max 2)" },
  { name: "Chain Shirt", cost: 50, weight: 20, type: "Armor", quantity: 1, notes: "AC 13 + Dex (max 2)" },
  { name: "Scale Mail", cost: 50, weight: 45, type: "Armor", quantity: 1, notes: "AC 14 + Dex (max 2), Disadvantage on Stealth" },
  { name: "Breastplate", cost: 400, weight: 20, type: "Armor", quantity: 1, notes: "AC 14 + Dex (max 2)" },
  { name: "Half Plate", cost: 750, weight: 40, type: "Armor", quantity: 1, notes: "AC 15 + Dex (max 2), Disadvantage on Stealth" },

  // ======================================
  // HEAVY ARMOR (PHB Ch.5)
  // ======================================
  { name: "Ring Mail", cost: 30, weight: 40, type: "Armor", quantity: 1, notes: "AC 14, Disadvantage on Stealth" },
  { name: "Chain Mail", cost: 75, weight: 55, type: "Armor", quantity: 1, notes: "AC 16, Str 13 required, Disadvantage on Stealth" },
  { name: "Splint Armor", cost: 200, weight: 60, type: "Armor", quantity: 1, notes: "AC 17, Str 15 required, Disadvantage on Stealth" },
  { name: "Plate Armor", cost: 1500, weight: 65, type: "Armor", quantity: 1, notes: "AC 18, Str 15 required, Disadvantage on Stealth" },

  // ======================================
  // SHIELDS (PHB Ch.5)
  // ======================================
  { name: "Shield", cost: 10, weight: 6, type: "Armor", quantity: 1, notes: "+2 AC" },

  // ======================================
  // ADVENTURING GEAR (PHB Ch.5)
  // ======================================
  { name: "Abacus", cost: 2, weight: 2, type: "Gear", quantity: 1, notes: "Counting tool" },
  { name: "Acid (vial)", cost: 25, weight: 1, type: "Gear", quantity: 1, notes: "2d6 acid damage, Ranged attack (20 ft)" },
  { name: "Alchemist's Fire (flask)", cost: 50, weight: 1, type: "Gear", quantity: 1, notes: "1d4 fire/turn, Ranged attack (20 ft)" },
  { name: "Antitoxin (vial)", cost: 50, weight: 0, type: "Gear", quantity: 1, notes: "Advantage on saves vs poison for 1 hour" },
  { name: "Backpack", cost: 2, weight: 5, type: "Gear", quantity: 1, notes: "Holds 30 lbs / 1 cu. ft." },
  { name: "Ball Bearings (bag of 1000)", cost: 1, weight: 2, type: "Gear", quantity: 1, notes: "10 ft area, DEX DC 10 or fall prone" },
  { name: "Barrel", cost: 2, weight: 70, type: "Gear", quantity: 1, notes: "Holds 40 gal liquid / 4 cu. ft. dry" },
  { name: "Basket", cost: 0.4, weight: 2, type: "Gear", quantity: 1, notes: "Holds 2 cu. ft. / 40 lbs" },
  { name: "Bedroll", cost: 1, weight: 7, type: "Gear", quantity: 1, notes: "Sleeping gear" },
  { name: "Bell", cost: 1, weight: 0, type: "Gear", quantity: 1, notes: "Small bell" },
  { name: "Blanket", cost: 0.5, weight: 3, type: "Gear", quantity: 1, notes: "Keeps warm" },
  { name: "Block and Tackle", cost: 1, weight: 5, type: "Gear", quantity: 1, notes: "Pulley system, lift 4x normal weight" },
  { name: "Book", cost: 25, weight: 5, type: "Gear", quantity: 1, notes: "Blank journal, 100 pages" },
  { name: "Bottle, Glass", cost: 2, weight: 2, type: "Gear", quantity: 1, notes: "Holds 1.5 pints" },
  { name: "Bucket", cost: 0.05, weight: 2, type: "Gear", quantity: 1, notes: "Holds 3 gal liquid / 0.5 cu. ft." },
  { name: "Burglar's Pack", cost: 16, weight: 44.5, type: "Gear", quantity: 1, notes: "Backpack, ball bearings, string, bell, 5 candles, crowbar, hammer, pitons, lantern, oil, rations, waterskin, rope" },
  { name: "Caltrops (bag of 20)", cost: 1, weight: 2, type: "Gear", quantity: 1, notes: "5 ft area, DEX DC 15 or 1 piercing + stop" },
  { name: "Candle", cost: 0.01, weight: 0, type: "Gear", quantity: 1, notes: "5 ft bright + 5 ft dim, 1 hour" },
  { name: "Case, Crossbow Bolt", cost: 1, weight: 1, type: "Gear", quantity: 1, notes: "Holds 20 bolts" },
  { name: "Case, Map or Scroll", cost: 1, weight: 1, type: "Gear", quantity: 1, notes: "Holds 10 sheets of paper or 5 scrolls" },
  { name: "Chain (10 feet)", cost: 5, weight: 10, type: "Gear", quantity: 1, notes: "AC 19, 10 HP, break DC 20" },
  { name: "Chalk (1 piece)", cost: 0.01, weight: 0, type: "Gear", quantity: 1, notes: "For marking" },
  { name: "Chest", cost: 5, weight: 25, type: "Gear", quantity: 1, notes: "Holds 12 cu. ft. / 300 lbs" },
  { name: "Climber's Kit", cost: 25, weight: 12, type: "Gear", quantity: 1, notes: "Pitons, boot tips, gloves, harness. Advantage on climbing checks" },
  { name: "Common Clothes", cost: 0.5, weight: 3, type: "Gear", quantity: 1, notes: "Standard clothing" },
  { name: "Component Pouch", cost: 25, weight: 2, type: "Gear", quantity: 1, notes: "Spellcasting focus (material components)" },
  { name: "Costume Clothes", cost: 5, weight: 4, type: "Gear", quantity: 1, notes: "Disguise or performance clothing" },
  { name: "Crowbar", cost: 2, weight: 5, type: "Gear", quantity: 1, notes: "Advantage on STR checks to pry" },
  { name: "Diplomat's Pack", cost: 39, weight: 36, type: "Gear", quantity: 1, notes: "Chest, 2 map cases, fine clothes, ink, pen, lamp, oil, paper, perfume, sealing wax, soap" },
  { name: "Dragonchess Set", cost: 1, weight: 0.5, type: "Gear", quantity: 1, notes: "Gaming set" },
  { name: "Dungeoneer's Pack", cost: 12, weight: 61.5, type: "Gear", quantity: 1, notes: "Backpack, crowbar, hammer, pitons, torches, tinderbox, rations, waterskin, rope" },
  { name: "Entertainer's Pack", cost: 40, weight: 38, type: "Gear", quantity: 1, notes: "Backpack, bedroll, 2 costumes, candles, rations, waterskin, disguise kit" },
  { name: "Explorer's Pack", cost: 10, weight: 59, type: "Gear", quantity: 1, notes: "Backpack, bedroll, mess kit, tinderbox, torches, rations, waterskin, rope" },
  { name: "Fine Clothes", cost: 15, weight: 6, type: "Gear", quantity: 1, notes: "High-quality clothing" },
  { name: "Fishing Tackle", cost: 1, weight: 4, type: "Gear", quantity: 1, notes: "Rod, line, hooks, bobbers, bait" },
  { name: "Flask or Tankard", cost: 0.02, weight: 1, type: "Gear", quantity: 1, notes: "Holds 1 pint" },
  { name: "Grappling Hook", cost: 2, weight: 4, type: "Gear", quantity: 1, notes: "Attach to rope for climbing" },
  { name: "Hammer", cost: 1, weight: 3, type: "Gear", quantity: 1, notes: "Standard hammer" },
  { name: "Hammer, Sledge", cost: 2, weight: 10, type: "Gear", quantity: 1, notes: "Heavy hammer" },
  { name: "Healer's Kit", cost: 5, weight: 3, type: "Gear", quantity: 1, notes: "10 uses, stabilize at 0 HP without Medicine check" },
  { name: "Holy Symbol (Amulet)", cost: 5, weight: 1, type: "Gear", quantity: 1, notes: "Spellcasting focus (divine)" },
  { name: "Holy Symbol (Emblem)", cost: 5, weight: 0, type: "Gear", quantity: 1, notes: "Spellcasting focus (divine), attach to shield" },
  { name: "Holy Symbol (Reliquary)", cost: 5, weight: 2, type: "Gear", quantity: 1, notes: "Spellcasting focus (divine)" },
  { name: "Holy Water (flask)", cost: 25, weight: 1, type: "Gear", quantity: 1, notes: "2d6 radiant to fiends/undead, Ranged (20 ft)" },
  { name: "Hourglass", cost: 25, weight: 1, type: "Gear", quantity: 1, notes: "Measure 1 minute intervals" },
  { name: "Hunting Trap", cost: 5, weight: 25, type: "Gear", quantity: 1, notes: "1d4 piercing, DC 13 STR to escape" },
  { name: "Ink (1 oz. bottle)", cost: 10, weight: 0, type: "Gear", quantity: 1, notes: "Writing ink" },
  { name: "Ink Pen", cost: 0.02, weight: 0, type: "Gear", quantity: 1, notes: "Writing pen" },
  { name: "Jug or Pitcher", cost: 0.02, weight: 4, type: "Gear", quantity: 1, notes: "Holds 1 gallon" },
  { name: "Ladder (10-foot)", cost: 0.1, weight: 25, type: "Gear", quantity: 1, notes: "10-foot wooden ladder" },
  { name: "Lamp", cost: 0.5, weight: 1, type: "Gear", quantity: 1, notes: "15 ft bright + 30 ft dim, 6 hours on 1 flask oil" },
  { name: "Lantern, Bullseye", cost: 10, weight: 2, type: "Gear", quantity: 1, notes: "60 ft cone bright + 60 ft dim, 6 hours" },
  { name: "Lantern, Hooded", cost: 5, weight: 2, type: "Gear", quantity: 1, notes: "30 ft bright + 30 ft dim, 6 hours, can dim to 5 ft" },
  { name: "Lock", cost: 10, weight: 1, type: "Gear", quantity: 1, notes: "DC 15 to pick (Dexterity check with thieves' tools)" },
  { name: "Magnifying Glass", cost: 100, weight: 0, type: "Gear", quantity: 1, notes: "Start fire in sunlight, +5 Appraise checks" },
  { name: "Manacles", cost: 2, weight: 6, type: "Gear", quantity: 1, notes: "DC 20 DEX to escape, DC 20 STR to break" },
  { name: "Mess Kit", cost: 0.2, weight: 1, type: "Gear", quantity: 1, notes: "Tin box with cup, cutlery, pan" },
  { name: "Mirror, Steel", cost: 5, weight: 0.5, type: "Gear", quantity: 1, notes: "Handheld steel mirror" },
  { name: "Oil (flask)", cost: 0.1, weight: 1, type: "Gear", quantity: 1, notes: "5 damage fire if lit, 15 ft bright + 15 ft dim, 6 hours in lamp" },
  { name: "Paper (one sheet)", cost: 0.2, weight: 0, type: "Gear", quantity: 1, notes: "Writing paper" },
  { name: "Parchment (one sheet)", cost: 0.1, weight: 0, type: "Gear", quantity: 1, notes: "Writing surface" },
  { name: "Perfume (vial)", cost: 5, weight: 0, type: "Gear", quantity: 1, notes: "Fragrance" },
  { name: "Pick, Miner's", cost: 2, weight: 10, type: "Gear", quantity: 1, notes: "Mining tool" },
  { name: "Piton", cost: 0.05, weight: 0.25, type: "Gear", quantity: 1, notes: "Iron spike for climbing" },
  { name: "Pole (10-foot)", cost: 0.05, weight: 7, type: "Gear", quantity: 1, notes: "10-foot wooden pole" },
  { name: "Pot, Iron", cost: 2, weight: 10, type: "Gear", quantity: 1, notes: "Holds 1 gallon" },
  { name: "Pouch", cost: 0.5, weight: 1, type: "Gear", quantity: 1, notes: "Holds 6 lbs / 0.2 cu. ft." },
  { name: "Priest's Pack", cost: 19, weight: 24, type: "Gear", quantity: 1, notes: "Backpack, blanket, candles, tinderbox, alms box, incense, censer, vestments, rations, waterskin" },
  { name: "Quiver", cost: 1, weight: 1, type: "Gear", quantity: 1, notes: "Holds 20 arrows" },
  { name: "Ram, Portable", cost: 4, weight: 35, type: "Gear", quantity: 1, notes: "+4 to STR checks to break down doors" },
  { name: "Rations (1 day)", cost: 0.5, weight: 2, type: "Gear", quantity: 1, notes: "Dried food for 1 day" },
  { name: "Robes", cost: 1, weight: 4, type: "Gear", quantity: 1, notes: "Standard robes" },
  { name: "Rope, Hempen (50 feet)", cost: 1, weight: 10, type: "Gear", quantity: 1, notes: "2 HP, burst DC 17" },
  { name: "Rope, Silk (50 feet)", cost: 10, weight: 5, type: "Gear", quantity: 1, notes: "2 HP, burst DC 17. Easier to climb" },
  { name: "Sack", cost: 0.01, weight: 0.5, type: "Gear", quantity: 1, notes: "Holds 30 lbs / 1 cu. ft." },
  { name: "Scale, Merchant's", cost: 5, weight: 3, type: "Gear", quantity: 1, notes: "Measures up to 2 lbs precisely" },
  { name: "Scholar's Pack", cost: 40, weight: 10, type: "Gear", quantity: 1, notes: "Backpack, book of lore, ink, pen, parchment, small knife, little bag of sand" },
  { name: "Sealing Wax", cost: 0.5, weight: 0, type: "Gear", quantity: 1, notes: "For sealing letters" },
  { name: "Shovel", cost: 2, weight: 5, type: "Gear", quantity: 1, notes: "Digging tool" },
  { name: "Signal Whistle", cost: 0.05, weight: 0, type: "Gear", quantity: 1, notes: "Audible up to 600 ft" },
  { name: "Signet Ring", cost: 5, weight: 0, type: "Gear", quantity: 1, notes: "Personal seal" },
  { name: "Soap", cost: 0.02, weight: 0, type: "Gear", quantity: 1, notes: "Cleaning" },
  { name: "Spellbook", cost: 50, weight: 3, type: "Gear", quantity: 1, notes: "100-page book for wizard spells" },
  { name: "Spike, Iron (10)", cost: 1, weight: 5, type: "Gear", quantity: 1, notes: "Iron spikes for securing doors or climbing" },
  { name: "Spyglass", cost: 1000, weight: 1, type: "Gear", quantity: 1, notes: "Objects appear 2x closer" },
  { name: "Tent, Two-Person", cost: 2, weight: 20, type: "Gear", quantity: 1, notes: "Shelter for 2 people" },
  { name: "Thieves' Tools", cost: 25, weight: 1, type: "Gear", quantity: 1, notes: "Pick locks & disarm traps (DEX check)" },
  { name: "Tinderbox", cost: 0.5, weight: 1, type: "Gear", quantity: 1, notes: "Start fire in 1 action (1 min without dry tinder)" },
  { name: "Torch", cost: 0.01, weight: 1, type: "Gear", quantity: 1, notes: "20 ft bright + 20 ft dim, 1 hour, 1 fire damage" },
  { name: "Traveler's Clothes", cost: 2, weight: 4, type: "Gear", quantity: 1, notes: "Durable traveling clothing" },
  { name: "Vial", cost: 1, weight: 0, type: "Gear", quantity: 1, notes: "Holds 4 oz liquid" },
  { name: "Waterskin", cost: 0.2, weight: 5, type: "Gear", quantity: 1, notes: "Holds 4 pints water" },
  { name: "Whetstone", cost: 0.01, weight: 1, type: "Gear", quantity: 1, notes: "Sharpen blades" },

  // ======================================
  // ARCANE FOCUSES (PHB Ch.5)
  // ======================================
  { name: "Arcane Focus — Crystal", cost: 10, weight: 1, type: "Gear", quantity: 1, notes: "Spellcasting focus (arcane)" },
  { name: "Arcane Focus — Orb", cost: 20, weight: 3, type: "Gear", quantity: 1, notes: "Spellcasting focus (arcane)" },
  { name: "Arcane Focus — Rod", cost: 10, weight: 2, type: "Gear", quantity: 1, notes: "Spellcasting focus (arcane)" },
  { name: "Arcane Focus — Staff", cost: 5, weight: 4, type: "Gear", quantity: 1, notes: "Spellcasting focus (arcane)" },
  { name: "Arcane Focus — Wand", cost: 10, weight: 1, type: "Gear", quantity: 1, notes: "Spellcasting focus (arcane)" },

  // ======================================
  // DRUIDIC FOCUSES (PHB Ch.5)
  // ======================================
  { name: "Druidic Focus — Sprig of Mistletoe", cost: 1, weight: 0, type: "Gear", quantity: 1, notes: "Spellcasting focus (druidic)" },
  { name: "Druidic Focus — Totem", cost: 1, weight: 0, type: "Gear", quantity: 1, notes: "Spellcasting focus (druidic)" },
  { name: "Druidic Focus — Wooden Staff", cost: 5, weight: 4, type: "Gear", quantity: 1, notes: "Spellcasting focus (druidic)" },
  { name: "Druidic Focus — Yew Wand", cost: 10, weight: 1, type: "Gear", quantity: 1, notes: "Spellcasting focus (druidic)" },

  // ======================================
  // MUSICAL INSTRUMENTS (PHB Ch.5)
  // ======================================
  { name: "Bagpipes", cost: 30, weight: 6, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Drum", cost: 6, weight: 3, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Dulcimer", cost: 25, weight: 10, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Flute", cost: 2, weight: 1, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Lute", cost: 35, weight: 2, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Lyre", cost: 30, weight: 2, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Horn", cost: 3, weight: 2, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Pan Flute", cost: 12, weight: 2, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Shawm", cost: 2, weight: 1, type: "Gear", quantity: 1, notes: "Musical instrument" },
  { name: "Viol", cost: 30, weight: 1, type: "Gear", quantity: 1, notes: "Musical instrument" },

  // ======================================
  // TOOLS & KITS (PHB Ch.5)
  // ======================================
  { name: "Alchemist's Supplies", cost: 50, weight: 8, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Brewer's Supplies", cost: 20, weight: 9, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Calligrapher's Supplies", cost: 10, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Carpenter's Tools", cost: 8, weight: 6, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Cartographer's Tools", cost: 15, weight: 6, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Cobbler's Tools", cost: 5, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Cook's Utensils", cost: 1, weight: 8, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Disguise Kit", cost: 25, weight: 3, type: "Gear", quantity: 1, notes: "Proficiency lets you create disguises" },
  { name: "Forgery Kit", cost: 15, weight: 5, type: "Gear", quantity: 1, notes: "Proficiency lets you forge documents" },
  { name: "Glassblower's Tools", cost: 30, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Herbalism Kit", cost: 5, weight: 3, type: "Gear", quantity: 1, notes: "Create antitoxin and potions of healing" },
  { name: "Jeweler's Tools", cost: 25, weight: 2, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Leatherworker's Tools", cost: 5, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Mason's Tools", cost: 10, weight: 8, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Navigator's Tools", cost: 25, weight: 2, type: "Gear", quantity: 1, notes: "Determine position at sea" },
  { name: "Painter's Supplies", cost: 10, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Playing Card Set", cost: 0.5, weight: 0, type: "Gear", quantity: 1, notes: "Gaming set" },
  { name: "Poisoner's Kit", cost: 50, weight: 2, type: "Gear", quantity: 1, notes: "Create and apply poisons" },
  { name: "Potter's Tools", cost: 10, weight: 3, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Smith's Tools", cost: 20, weight: 8, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Three-Dragon Ante Set", cost: 1, weight: 0, type: "Gear", quantity: 1, notes: "Gaming set" },
  { name: "Tinker's Tools", cost: 50, weight: 10, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Weaver's Tools", cost: 1, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },
  { name: "Woodcarver's Tools", cost: 1, weight: 5, type: "Gear", quantity: 1, notes: "Artisan's tools" },

  // ======================================
  // CONSUMABLES & POTIONS
  // ======================================
  { name: "Potion of Healing", cost: 50, weight: 0.5, type: "Consumable", quantity: 1, notes: "Heals 2d4+2 HP" },
  { name: "Potion of Greater Healing", cost: 150, weight: 0.5, type: "Consumable", quantity: 1, notes: "Heals 4d4+4 HP" },
  { name: "Potion of Climbing", cost: 75, weight: 0.5, type: "Consumable", quantity: 1, notes: "Climbing speed equal to walking speed for 1 hour" },
  { name: "Oil of Slipperiness", cost: 100, weight: 0.5, type: "Consumable", quantity: 1, notes: "Freedom of Movement for 8 hours" },
  { name: "Philter of Love", cost: 90, weight: 0.5, type: "Consumable", quantity: 1, notes: "Charmed for 1 hour after drinking" },
  { name: "Potion of Animal Friendship", cost: 100, weight: 0.5, type: "Consumable", quantity: 1, notes: "Animal Friendship (save DC 13) for 1 hour" },
  { name: "Potion of Fire Breath", cost: 150, weight: 0.5, type: "Consumable", quantity: 1, notes: "Exhale fire 30 ft, 4d6 fire (DEX DC 13), 3 uses, 1 hour" },
  { name: "Potion of Resistance", cost: 300, weight: 0.5, type: "Consumable", quantity: 1, notes: "Resistance to one damage type for 1 hour" },
  { name: "Potion of Water Breathing", cost: 100, weight: 0.5, type: "Consumable", quantity: 1, notes: "Breathe underwater for 1 hour" },
];

// ==========================================
// Racial Traits (PHB)
// ==========================================
export interface RacialTrait { name: string; description: string; }
export interface RacialSpell { name: string; level: number; minCharLevel: number; }
export interface RaceTraitData {
  traits: RacialTrait[]; languages: string[]; darkvision?: number; size: 'Small' | 'Medium';
  racialSpells?: RacialSpell[]; skillProficiencies?: string[]; weaponProficiencies?: string[];
  armorProficiencies?: string[]; toolProficiencyChoices?: string[]; resistances?: string[];
  extraSkillChoices?: number; extraLanguageChoices?: number; hpBonusPerLevel?: number;
}
export const RACE_TRAITS: Record<string, RaceTraitData> = {
  'Dragonborn': { traits: [
    { name: 'Draconic Ancestry', description: 'Choose a dragon type for breath weapon and damage resistance.' },
    { name: 'Breath Weapon', description: 'Action: exhale destructive energy. DC 8+CON mod+prof. 2d6 at 1st, 3d6 at 6th, 4d6 at 11th, 5d6 at 16th.' },
    { name: 'Damage Resistance', description: 'Resistance to your ancestry damage type.' },
  ], languages: ['Common', 'Draconic'], size: 'Medium' },
  'Hill Dwarf': { traits: [
    { name: 'Dwarven Resilience', description: 'Advantage on saves vs poison; resistance to poison damage.' },
    { name: 'Stonecunning', description: 'Double proficiency on History checks related to stonework.' },
    { name: 'Dwarven Toughness', description: 'HP max increases by 1 per level.' },
  ], languages: ['Common', 'Dwarvish'], darkvision: 60, size: 'Medium',
    weaponProficiencies: ['Battleaxe', 'Handaxe', 'Light hammer', 'Warhammer'],
    toolProficiencyChoices: ["Smith's Tools", "Brewer's Supplies", "Mason's Tools"],
    resistances: ['Poison'], hpBonusPerLevel: 1 },
  'Mountain Dwarf': { traits: [
    { name: 'Dwarven Resilience', description: 'Advantage on saves vs poison; resistance to poison damage.' },
    { name: 'Stonecunning', description: 'Double proficiency on History checks related to stonework.' },
    { name: 'Dwarven Armor Training', description: 'Proficiency with light and medium armor.' },
  ], languages: ['Common', 'Dwarvish'], darkvision: 60, size: 'Medium',
    weaponProficiencies: ['Battleaxe', 'Handaxe', 'Light hammer', 'Warhammer'],
    armorProficiencies: ['Light', 'Medium'],
    toolProficiencyChoices: ["Smith's Tools", "Brewer's Supplies", "Mason's Tools"],
    resistances: ['Poison'] },
  'High Elf': { traits: [
    { name: 'Keen Senses', description: 'Proficiency in Perception.' },
    { name: 'Fey Ancestry', description: 'Advantage on saves vs charmed; immune to magical sleep.' },
    { name: 'Trance', description: 'Meditate 4 hours instead of sleeping 8.' },
    { name: 'Cantrip', description: 'One wizard cantrip of your choice. INT is your spellcasting ability.' },
  ], languages: ['Common', 'Elvish'], darkvision: 60, size: 'Medium',
    skillProficiencies: ['Perception'], weaponProficiencies: ['Longsword', 'Shortsword', 'Shortbow', 'Longbow'],
    extraLanguageChoices: 1 },
  'Wood Elf': { traits: [
    { name: 'Keen Senses', description: 'Proficiency in Perception.' },
    { name: 'Fey Ancestry', description: 'Advantage on saves vs charmed; immune to magical sleep.' },
    { name: 'Trance', description: 'Meditate 4 hours instead of sleeping 8.' },
    { name: 'Fleet of Foot', description: 'Base walking speed is 35 feet.' },
    { name: 'Mask of the Wild', description: 'Hide when lightly obscured by natural phenomena.' },
  ], languages: ['Common', 'Elvish'], darkvision: 60, size: 'Medium',
    skillProficiencies: ['Perception'], weaponProficiencies: ['Longsword', 'Shortsword', 'Shortbow', 'Longbow'] },
  'Drow Elf': { traits: [
    { name: 'Superior Darkvision', description: 'Darkvision 120 feet.' },
    { name: 'Keen Senses', description: 'Proficiency in Perception.' },
    { name: 'Fey Ancestry', description: 'Advantage on saves vs charmed; immune to magical sleep.' },
    { name: 'Trance', description: 'Meditate 4 hours instead of sleeping 8.' },
    { name: 'Sunlight Sensitivity', description: 'Disadvantage on attacks and Perception in direct sunlight.' },
    { name: 'Drow Magic', description: 'Dancing Lights at 1st. Faerie Fire 1/long rest at 3rd. Darkness 1/long rest at 5th. CHA spellcasting.' },
  ], languages: ['Common', 'Elvish'], darkvision: 120, size: 'Medium',
    skillProficiencies: ['Perception'], weaponProficiencies: ['Rapier', 'Shortsword', 'Hand crossbow'],
    racialSpells: [{ name: 'Dancing Lights', level: 0, minCharLevel: 1 }, { name: 'Faerie Fire', level: 1, minCharLevel: 3 }, { name: 'Darkness', level: 2, minCharLevel: 5 }] },
  'Forest Gnome': { traits: [
    { name: 'Gnome Cunning', description: 'Advantage on INT/WIS/CHA saves against magic.' },
    { name: 'Natural Illusionist', description: 'You know Minor Illusion cantrip. INT spellcasting.' },
    { name: 'Speak with Small Beasts', description: 'Communicate simple ideas with Small or smaller beasts.' },
  ], languages: ['Common', 'Gnomish'], darkvision: 60, size: 'Small',
    racialSpells: [{ name: 'Minor Illusion', level: 0, minCharLevel: 1 }] },
  'Rock Gnome': { traits: [
    { name: 'Gnome Cunning', description: 'Advantage on INT/WIS/CHA saves against magic.' },
    { name: "Artificer's Lore", description: 'Double proficiency on History checks for magic items, alchemical objects, or tech.' },
    { name: 'Tinker', description: "Proficiency with tinker's tools. Construct Tiny clockwork devices (10 gp, 1 hour)." },
  ], languages: ['Common', 'Gnomish'], darkvision: 60, size: 'Small',
    toolProficiencyChoices: ["Tinker's Tools"] },
  'Half-Elf': { traits: [
    { name: 'Fey Ancestry', description: 'Advantage on saves vs charmed; immune to magical sleep.' },
    { name: 'Skill Versatility', description: 'Gain proficiency in two skills of your choice.' },
  ], languages: ['Common', 'Elvish'], darkvision: 60, size: 'Medium',
    extraSkillChoices: 2, extraLanguageChoices: 1 },
  'Half-Orc': { traits: [
    { name: 'Menacing', description: 'Proficiency in Intimidation.' },
    { name: 'Relentless Endurance', description: 'Drop to 1 HP instead of 0 once per long rest.' },
    { name: 'Savage Attacks', description: 'On a melee crit, roll one extra weapon damage die.' },
  ], languages: ['Common', 'Orc'], darkvision: 60, size: 'Medium',
    skillProficiencies: ['Intimidation'] },
  'Lightfoot Halfling': { traits: [
    { name: 'Lucky', description: 'Reroll 1s on d20 attack rolls, ability checks, and saving throws.' },
    { name: 'Brave', description: 'Advantage on saves vs frightened.' },
    { name: 'Halfling Nimbleness', description: 'Move through space of creatures one size larger.' },
    { name: 'Naturally Stealthy', description: 'Hide when obscured by a creature at least one size larger.' },
  ], languages: ['Common', 'Halfling'], size: 'Small' },
  'Stout Halfling': { traits: [
    { name: 'Lucky', description: 'Reroll 1s on d20 attack rolls, ability checks, and saving throws.' },
    { name: 'Brave', description: 'Advantage on saves vs frightened.' },
    { name: 'Halfling Nimbleness', description: 'Move through space of creatures one size larger.' },
    { name: 'Stout Resilience', description: 'Advantage on saves vs poison; resistance to poison damage.' },
  ], languages: ['Common', 'Halfling'], size: 'Small', resistances: ['Poison'] },
  'Human': { traits: [
    { name: 'Versatile', description: '+1 to all ability scores. One extra language of your choice.' },
  ], languages: ['Common'], size: 'Medium', extraLanguageChoices: 1 },
  'Tiefling': { traits: [
    { name: 'Hellish Resistance', description: 'Resistance to fire damage.' },
    { name: 'Infernal Legacy', description: 'Thaumaturgy at 1st. Hellish Rebuke (2nd-level) 1/long rest at 3rd. Darkness 1/long rest at 5th. CHA spellcasting.' },
  ], languages: ['Common', 'Infernal'], darkvision: 60, size: 'Medium', resistances: ['Fire'],
    racialSpells: [{ name: 'Dancing Lights', level: 0, minCharLevel: 1 }, { name: 'Hellish Rebuke', level: 1, minCharLevel: 3 }, { name: 'Darkness', level: 2, minCharLevel: 5 }] },
};

export const getRaceTraits = (race: string): RaceTraitData | undefined => RACE_TRAITS[race];

export const getAllRaceOptions = () => DND_RACES.flatMap(r => r.subraces ? r.subraces : [r.name]);
export const getRaceSpeed = (n: string) => DND_RACES.find(r => r.name === n || r.subraces?.includes(n))?.speed || 30;
export const getClassData = (n: string) => DND_CLASSES.find(c => c.name === n);
export const getRacialBonus = (r: string, s: StatKey) => RACIAL_BONUSES[r]?.[s] ?? 0;
export const getRacialBonusDisplay = (r: string) => Object.entries(RACIAL_BONUSES[r] || {}).map(([s,v]) => `+${v} ${s}`).join(', ') || 'None';

// ==========================================
// Class Feature Progression (PHB)
// ==========================================
export interface ClassFeatureEntry { name: string; description: string; }
export const CLASS_FEATURES: Record<string, Record<number, ClassFeatureEntry[]>> = {
  'Barbarian': {
    1: [{ name: 'Rage', description: 'Bonus action: advantage on STR checks/saves, +2 rage damage, resistance to bludgeoning/piercing/slashing. 2/long rest.' },
        { name: 'Unarmored Defense', description: 'AC = 10 + DEX mod + CON mod (no armor).' }],
    2: [{ name: 'Reckless Attack', description: 'Advantage on melee STR attacks; attacks against you have advantage until next turn.' },
        { name: 'Danger Sense', description: 'Advantage on DEX saves against effects you can see.' }],
    3: [{ name: 'Primal Path', description: 'Choose: Berserker or Totem Warrior.' }],
    5: [{ name: 'Extra Attack', description: 'Attack twice per Attack action.' }, { name: 'Fast Movement', description: '+10 ft speed (no heavy armor).' }],
    7: [{ name: 'Feral Instinct', description: 'Advantage on initiative. Act normally if surprised and you rage.' }],
    9: [{ name: 'Brutal Critical (1 die)', description: '+1 weapon damage die on critical hits.' }],
    11: [{ name: 'Relentless Rage', description: 'DC 10 CON save to stay at 1 HP instead of 0 while raging.' }],
    15: [{ name: 'Persistent Rage', description: 'Rage only ends if you fall unconscious or choose to end it.' }],
    18: [{ name: 'Indomitable Might', description: 'Use STR score if STR check result is lower.' }],
    20: [{ name: 'Primal Champion', description: 'STR and CON +4 (max 24).' }],
  },
  'Bard': {
    1: [{ name: 'Spellcasting', description: 'CHA-based. Cantrips and spells known from bard list.' },
        { name: 'Bardic Inspiration (d6)', description: 'Bonus action: give creature within 60ft a d6 inspiration die. CHA mod uses/long rest.' }],
    2: [{ name: 'Jack of All Trades', description: 'Add half proficiency to unproficient ability checks.' },
        { name: 'Song of Rest (d6)', description: 'Allies regain extra 1d6 HP during short rest if they spend Hit Dice.' }],
    3: [{ name: 'Bard College', description: 'Choose: College of Lore or College of Valor.' },
        { name: 'Expertise', description: 'Double proficiency for two skills.' }],
    5: [{ name: 'Bardic Inspiration (d8)', description: 'Inspiration die becomes d8.' },
        { name: 'Font of Inspiration', description: 'Regain all Bardic Inspiration on short rest.' }],
    6: [{ name: 'Countercharm', description: 'Allies within 30ft have advantage vs frightened/charmed.' }],
    10: [{ name: 'Bardic Inspiration (d10)', description: 'Inspiration die becomes d10.' },
         { name: 'Expertise (2)', description: 'Double proficiency for two more skills.' },
         { name: 'Magical Secrets', description: 'Learn 2 spells from any class.' }],
    15: [{ name: 'Bardic Inspiration (d12)', description: 'Inspiration die becomes d12.' }],
    18: [{ name: 'Magical Secrets (3)', description: 'Learn 2 more spells from any class.' }],
    20: [{ name: 'Superior Inspiration', description: 'Regain 1 Bardic Inspiration if you have none on initiative.' }],
  },
  'Cleric': {
    1: [{ name: 'Spellcasting', description: 'WIS-based prepared caster.' },
        { name: 'Divine Domain', description: 'Choose: Knowledge, Life, Light, Nature, Tempest, Trickery, or War.' }],
    2: [{ name: 'Channel Divinity (1/rest)', description: 'Turn Undead + domain channel divinity.' }],
    5: [{ name: 'Destroy Undead (CR 1/2)', description: 'Turned undead CR 1/2 or lower are destroyed.' }],
    6: [{ name: 'Channel Divinity (2/rest)', description: 'Two uses between rests.' }],
    8: [{ name: 'Destroy Undead (CR 1)', description: 'Destroy undead CR 1 or lower.' }],
    10: [{ name: 'Divine Intervention', description: 'Call on deity: d100 roll ≤ cleric level = success.' }],
    17: [{ name: 'Destroy Undead (CR 4)', description: 'Destroy undead CR 4 or lower.' }],
    18: [{ name: 'Channel Divinity (3/rest)', description: 'Three uses between rests.' }],
    20: [{ name: 'Divine Intervention Improvement', description: 'Auto-success.' }],
  },
  'Druid': {
    1: [{ name: 'Druidic', description: 'Secret druid language.' },
        { name: 'Spellcasting', description: 'WIS-based prepared caster.' }],
    2: [{ name: 'Wild Shape', description: 'Transform into beast. Max CR 1/4, no fly/swim. 2/short rest.' },
        { name: 'Druid Circle', description: 'Choose: Circle of the Land or Circle of the Moon.' }],
    4: [{ name: 'Wild Shape (CR 1/2)', description: 'Max CR 1/2, no flying.' }],
    8: [{ name: 'Wild Shape (CR 1)', description: 'Max CR 1, flying allowed.' }],
    18: [{ name: 'Timeless Body', description: 'Age 10x slower.' }, { name: 'Beast Spells', description: 'Cast spells in Wild Shape.' }],
    20: [{ name: 'Archdruid', description: 'Unlimited Wild Shape. Ignore V/S components.' }],
  },
  'Fighter': {
    1: [{ name: 'Fighting Style', description: 'Choose: Archery, Defense, Dueling, Great Weapon Fighting, Protection, or Two-Weapon Fighting.' },
        { name: 'Second Wind', description: 'Bonus action: regain 1d10 + fighter level HP. 1/short rest.' }],
    2: [{ name: 'Action Surge', description: 'One additional action. 1/short rest.' }],
    3: [{ name: 'Martial Archetype', description: 'Choose: Champion, Battle Master, or Eldritch Knight.' }],
    5: [{ name: 'Extra Attack', description: 'Attack twice per Attack action.' }],
    9: [{ name: 'Indomitable (1)', description: 'Reroll a failed save. 1/long rest.' }],
    11: [{ name: 'Extra Attack (2)', description: 'Three attacks per Attack action.' }],
    13: [{ name: 'Indomitable (2)', description: 'Two rerolls per long rest.' }],
    17: [{ name: 'Action Surge (2)', description: 'Two uses per short rest.' }, { name: 'Indomitable (3)', description: 'Three rerolls per long rest.' }],
    20: [{ name: 'Extra Attack (3)', description: 'Four attacks per Attack action.' }],
  },
  'Monk': {
    1: [{ name: 'Unarmored Defense', description: 'AC = 10 + DEX mod + WIS mod (no armor).' },
        { name: 'Martial Arts', description: 'Use DEX for monk weapons. Unarmed = 1d4. Bonus action unarmed strike.' }],
    2: [{ name: 'Ki', description: 'Ki points = monk level. Flurry of Blows, Patient Defense, Step of the Wind.' },
        { name: 'Unarmored Movement (+10ft)', description: '+10ft speed without armor/shield.' }],
    3: [{ name: 'Monastic Tradition', description: 'Choose: Open Hand, Shadow, or Four Elements.' },
        { name: 'Deflect Missiles', description: 'Reduce ranged attack damage by 1d10 + DEX mod + level.' }],
    4: [{ name: 'Slow Fall', description: 'Reduce fall damage by 5 × monk level.' }],
    5: [{ name: 'Extra Attack', description: 'Attack twice per Attack action.' },
        { name: 'Stunning Strike', description: '1 ki: target CON save or stunned.' }],
    6: [{ name: 'Ki-Empowered Strikes', description: 'Unarmed strikes count as magical.' }],
    7: [{ name: 'Evasion', description: 'No damage on DEX save success; half on fail.' },
        { name: 'Stillness of Mind', description: 'End one charmed/frightened effect as action.' }],
    10: [{ name: 'Purity of Body', description: 'Immune to disease and poison.' }],
    14: [{ name: 'Diamond Soul', description: 'Proficient in all saves. 1 ki to reroll failed save.' }],
    18: [{ name: 'Empty Body', description: '4 ki: invisible 1 min. 8 ki: Astral Projection.' }],
    20: [{ name: 'Perfect Self', description: 'Regain 4 ki if you have none on initiative.' }],
  },
  'Paladin': {
    1: [{ name: 'Divine Sense', description: 'Detect celestials/fiends/undead within 60ft. 1+CHA mod uses/long rest.' },
        { name: 'Lay on Hands', description: 'Pool = 5 × paladin level. Heal HP or cure disease/poison (5 HP each).' }],
    2: [{ name: 'Fighting Style', description: 'Choose: Defense, Dueling, Great Weapon Fighting, or Protection.' },
        { name: 'Spellcasting', description: 'CHA-based prepared caster (half-caster).' },
        { name: 'Divine Smite', description: 'On melee hit, expend slot: +2d8 radiant (+1d8/slot above 1st, max 5d8). +1d8 vs undead/fiend.' }],
    3: [{ name: 'Divine Health', description: 'Immune to disease.' },
        { name: 'Sacred Oath', description: 'Choose: Devotion, Ancients, or Vengeance.' }],
    5: [{ name: 'Extra Attack', description: 'Attack twice per Attack action.' }],
    6: [{ name: 'Aura of Protection', description: 'You + allies within 10ft add CHA mod to saves.' }],
    10: [{ name: 'Aura of Courage', description: "You + allies within 10ft can't be frightened." }],
    11: [{ name: 'Improved Divine Smite', description: 'All melee hits deal +1d8 radiant.' }],
    14: [{ name: 'Cleansing Touch', description: 'End one spell on yourself/ally. CHA mod uses/long rest.' }],
    18: [{ name: 'Aura Improvements', description: 'Auras extend to 30 feet.' }],
  },
  'Ranger': {
    1: [{ name: 'Favored Enemy', description: 'Choose enemy type. Advantage on Survival to track, INT to recall info.' },
        { name: 'Natural Explorer', description: 'Choose terrain. Travel benefits and advantage on INT/WIS checks.' }],
    2: [{ name: 'Fighting Style', description: 'Choose: Archery, Defense, Dueling, or Two-Weapon Fighting.' },
        { name: 'Spellcasting', description: 'WIS-based known caster (half-caster, starts at level 2).' }],
    3: [{ name: 'Ranger Archetype', description: 'Choose: Hunter or Beast Master.' },
        { name: 'Primeval Awareness', description: 'Spend slot to sense aberrations/celestials/dragons/elementals/fey/fiends/undead within 1 mile.' }],
    5: [{ name: 'Extra Attack', description: 'Attack twice per Attack action.' }],
    8: [{ name: "Land's Stride", description: 'No extra cost for nonmagical difficult terrain.' }],
    10: [{ name: 'Hide in Plain Sight', description: '+10 Stealth when pressed against solid surface.' }],
    14: [{ name: 'Vanish', description: 'Hide as bonus action. Cannot be tracked nonmagically.' }],
    18: [{ name: 'Feral Senses', description: 'No disadvantage vs invisible creatures. Sense invisible within 30ft.' }],
    20: [{ name: 'Foe Slayer', description: 'Add WIS mod to attack or damage vs favored enemy, once/turn.' }],
  },
  'Rogue': {
    1: [{ name: 'Expertise', description: 'Double proficiency for two skills or one skill + thieves\' tools.' },
        { name: 'Sneak Attack (1d6)', description: 'Once/turn extra damage with advantage or ally adjacent. +1d6 every 2 levels.' },
        { name: "Thieves' Cant", description: 'Secret rogue language.' }],
    2: [{ name: 'Cunning Action', description: 'Bonus action: Dash, Disengage, or Hide.' }],
    3: [{ name: 'Roguish Archetype', description: 'Choose: Thief, Assassin, or Arcane Trickster.' }],
    5: [{ name: 'Uncanny Dodge', description: 'Reaction: halve damage from one attack.' }],
    6: [{ name: 'Expertise (2)', description: 'Double proficiency for two more skills.' }],
    7: [{ name: 'Evasion', description: 'No damage on DEX save success; half on fail.' }],
    11: [{ name: 'Reliable Talent', description: 'Minimum 10 on d20 for proficient ability checks.' }],
    14: [{ name: 'Blindsense', description: 'Sense hidden/invisible creatures within 10ft.' }],
    15: [{ name: 'Slippery Mind', description: 'Proficiency in WIS saves.' }],
    18: [{ name: 'Elusive', description: 'No attack has advantage against you.' }],
    20: [{ name: 'Stroke of Luck', description: 'Turn miss into hit, or failed check into 20. 1/short rest.' }],
  },
  'Sorcerer': {
    1: [{ name: 'Spellcasting', description: 'CHA-based known caster.' },
        { name: 'Sorcerous Origin', description: 'Choose: Draconic Bloodline or Wild Magic.' }],
    2: [{ name: 'Font of Magic', description: 'Sorcery points = sorcerer level. Convert between points and spell slots.' }],
    3: [{ name: 'Metamagic', description: 'Choose 2: Careful, Distant, Empowered, Extended, Heightened, Quickened, Subtle, Twinned.' }],
    10: [{ name: 'Metamagic (3)', description: 'Learn one more Metamagic option.' }],
    17: [{ name: 'Metamagic (4)', description: 'Learn one more Metamagic option.' }],
    20: [{ name: 'Sorcerous Restoration', description: 'Regain 4 sorcery points on short rest.' }],
  },
  'Warlock': {
    1: [{ name: 'Otherworldly Patron', description: 'Choose: Archfey, Fiend, or Great Old One.' },
        { name: 'Pact Magic', description: 'CHA-based known caster. Slots recharge on short rest, all same level.' }],
    2: [{ name: 'Eldritch Invocations', description: 'Choose 2 invocations (Agonizing Blast, Devil\'s Sight, etc.).' }],
    3: [{ name: 'Pact Boon', description: 'Choose: Pact of Chain (familiar), Blade (weapon), or Tome (cantrips).' }],
    11: [{ name: 'Mystic Arcanum (6th)', description: 'One 6th-level spell 1/long rest.' }],
    13: [{ name: 'Mystic Arcanum (7th)', description: 'One 7th-level spell 1/long rest.' }],
    15: [{ name: 'Mystic Arcanum (8th)', description: 'One 8th-level spell 1/long rest.' }],
    17: [{ name: 'Mystic Arcanum (9th)', description: 'One 9th-level spell 1/long rest.' }],
    20: [{ name: 'Eldritch Master', description: 'Regain all Pact Magic slots (1 min). 1/long rest.' }],
  },
  'Wizard': {
    1: [{ name: 'Spellcasting', description: 'INT-based prepared caster via spellbook. Start with 6 1st-level spells.' },
        { name: 'Arcane Recovery', description: 'After short rest: recover slots totaling ≤ half wizard level (rounded up). 1/day.' }],
    2: [{ name: 'Arcane Tradition', description: 'Choose school: Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, or Transmutation.' }],
    18: [{ name: 'Spell Mastery', description: 'Choose a 1st + 2nd level spell to cast at will.' }],
    20: [{ name: 'Signature Spells', description: 'Two 3rd-level spells always prepared, cast each 1/short rest free.' }],
  },
};

// ==========================================
// Spell Slot Progression (PHB)
// ==========================================
// Full casters: Bard, Cleric, Druid, Sorcerer, Wizard — [1st,2nd,3rd,4th,5th,6th,7th,8th,9th]
export const FULL_CASTER_SLOTS: Record<number, number[]> = {
  1:[2,0,0,0,0,0,0,0,0], 2:[3,0,0,0,0,0,0,0,0], 3:[4,2,0,0,0,0,0,0,0], 4:[4,3,0,0,0,0,0,0,0],
  5:[4,3,2,0,0,0,0,0,0], 6:[4,3,3,0,0,0,0,0,0], 7:[4,3,3,1,0,0,0,0,0], 8:[4,3,3,2,0,0,0,0,0],
  9:[4,3,3,3,1,0,0,0,0], 10:[4,3,3,3,2,0,0,0,0], 11:[4,3,3,3,2,1,0,0,0], 12:[4,3,3,3,2,1,0,0,0],
  13:[4,3,3,3,2,1,1,0,0], 14:[4,3,3,3,2,1,1,0,0], 15:[4,3,3,3,2,1,1,1,0], 16:[4,3,3,3,2,1,1,1,0],
  17:[4,3,3,3,2,1,1,1,1], 18:[4,3,3,3,3,1,1,1,1], 19:[4,3,3,3,3,2,1,1,1], 20:[4,3,3,3,3,2,2,1,1],
};
// Half casters: Paladin, Ranger — [1st,2nd,3rd,4th,5th]
export const HALF_CASTER_SLOTS: Record<number, number[]> = {
  1:[0,0,0,0,0], 2:[2,0,0,0,0], 3:[3,0,0,0,0], 4:[3,0,0,0,0], 5:[4,2,0,0,0],
  6:[4,2,0,0,0], 7:[4,3,0,0,0], 8:[4,3,0,0,0], 9:[4,3,2,0,0], 10:[4,3,2,0,0],
  11:[4,3,3,0,0], 12:[4,3,3,0,0], 13:[4,3,3,1,0], 14:[4,3,3,1,0], 15:[4,3,3,2,0],
  16:[4,3,3,2,0], 17:[4,3,3,3,1], 18:[4,3,3,3,1], 19:[4,3,3,3,2], 20:[4,3,3,3,2],
};
// Warlock Pact Magic
export const WARLOCK_PACT_SLOTS: Record<number, { count: number; level: number }> = {
  1:{count:1,level:1}, 2:{count:2,level:1}, 3:{count:2,level:2}, 4:{count:2,level:2},
  5:{count:2,level:3}, 6:{count:2,level:3}, 7:{count:2,level:4}, 8:{count:2,level:4},
  9:{count:2,level:5}, 10:{count:2,level:5}, 11:{count:3,level:5}, 12:{count:3,level:5},
  13:{count:3,level:5}, 14:{count:3,level:5}, 15:{count:3,level:5}, 16:{count:3,level:5},
  17:{count:4,level:5}, 18:{count:4,level:5}, 19:{count:4,level:5}, 20:{count:4,level:5},
};
// Cantrips known at level thresholds (use highest threshold ≤ char level)
export const CANTRIPS_KNOWN: Record<string, Record<number, number>> = {
  'Bard':{ 1:2, 4:3, 10:4 }, 'Cleric':{ 1:3, 4:4, 10:5 }, 'Druid':{ 1:2, 4:3, 10:4 },
  'Sorcerer':{ 1:4, 4:5, 10:6 }, 'Warlock':{ 1:2, 4:3, 10:4 }, 'Wizard':{ 1:3, 4:4, 10:5 },
};
// Spells known for "known" casters (level thresholds)
export const SPELLS_KNOWN: Record<string, Record<number, number>> = {
  'Bard':{ 1:4, 2:5, 3:6, 4:7, 5:8, 6:9, 7:10, 8:11, 9:12, 10:14, 11:15, 13:16, 14:18, 15:19, 17:20, 18:22 },
  'Ranger':{ 2:2, 3:3, 5:4, 7:5, 9:6, 11:7, 13:8, 15:9, 17:10, 19:11 },
  'Sorcerer':{ 1:2, 2:3, 3:4, 4:5, 5:6, 6:7, 7:8, 8:9, 9:10, 10:11, 11:12, 13:13, 15:14, 17:15 },
  'Warlock':{ 1:2, 2:3, 3:4, 4:5, 5:6, 6:7, 7:8, 8:9, 9:10, 11:11, 13:12, 15:13, 17:14, 19:15 },
  'Wizard':{ 1:6, 2:8, 3:10, 4:12, 5:14, 6:16, 7:18, 8:20, 9:22, 10:24, 11:26, 12:28, 13:30, 14:32, 15:34, 16:36, 17:38, 18:40, 19:42, 20:44 },
};

// ==========================================
// Class Cantrip Lists (PHB SRD)
// ==========================================
export const CLASS_CANTRIPS: Record<string, string[]> = {
  'Bard': ['Blade Ward','Dancing Lights','Friends','Light','Mage Hand','Mending','Message','Minor Illusion','Prestidigitation','True Strike','Vicious Mockery'],
  'Cleric': ['Guidance','Light','Mending','Resistance','Sacred Flame','Spare the Dying','Thaumaturgy'],
  'Druid': ['Druidcraft','Guidance','Mending','Poison Spray','Produce Flame','Resistance','Shillelagh','Thorn Whip'],
  'Sorcerer': ['Acid Splash','Blade Ward','Chill Touch','Dancing Lights','Fire Bolt','Friends','Light','Mage Hand','Mending','Message','Minor Illusion','Poison Spray','Prestidigitation','Ray of Frost','Shocking Grasp','True Strike'],
  'Warlock': ['Blade Ward','Chill Touch','Eldritch Blast','Friends','Mage Hand','Minor Illusion','Poison Spray','Prestidigitation','True Strike'],
  'Wizard': ['Acid Splash','Blade Ward','Chill Touch','Dancing Lights','Fire Bolt','Friends','Light','Mage Hand','Mending','Message','Minor Illusion','Poison Spray','Prestidigitation','Ray of Frost','Shocking Grasp','True Strike'],
};

// ==========================================
// Class 1st-Level Spell Lists (PHB SRD)
// ==========================================
export const CLASS_SPELLS_1ST: Record<string, string[]> = {
  'Bard': ['Animal Friendship','Bane','Charm Person','Comprehend Languages','Cure Wounds','Detect Magic','Disguise Self','Dissonant Whispers','Faerie Fire','Feather Fall','Healing Word','Heroism','Identify','Longstrider','Silent Image','Sleep','Speak with Animals','Thunderwave','Unseen Servant'],
  'Cleric': ['Bane','Bless','Command','Create or Destroy Water','Cure Wounds','Detect Evil and Good','Detect Magic','Detect Poison and Disease','Guiding Bolt','Healing Word','Inflict Wounds','Protection from Evil and Good','Purify Food and Drink','Sanctuary','Shield of Faith'],
  'Druid': ['Animal Friendship','Charm Person','Create or Destroy Water','Cure Wounds','Detect Magic','Detect Poison and Disease','Entangle','Faerie Fire','Fog Cloud','Goodberry','Healing Word','Jump','Longstrider','Purify Food and Drink','Speak with Animals','Thunderwave'],
  'Paladin': ['Bless','Command','Compelled Duel','Cure Wounds','Detect Evil and Good','Detect Magic','Detect Poison and Disease','Divine Favor','Heroism','Protection from Evil and Good','Purify Food and Drink','Searing Smite','Shield of Faith','Thunderous Smite','Wrathful Smite'],
  'Ranger': ['Alarm','Animal Friendship','Cure Wounds','Detect Magic','Detect Poison and Disease','Ensnaring Strike','Fog Cloud','Goodberry','Hail of Thorns','Hunter\'s Mark','Jump','Longstrider','Speak with Animals'],
  'Sorcerer': ['Burning Hands','Charm Person','Chromatic Orb','Color Spray','Comprehend Languages','Detect Magic','Disguise Self','Expeditious Retreat','False Life','Feather Fall','Fog Cloud','Jump','Mage Armor','Magic Missile','Ray of Sickness','Shield','Silent Image','Sleep','Thunderwave','Witch Bolt'],
  'Warlock': ['Armor of Agathys','Arms of Hadar','Charm Person','Comprehend Languages','Expeditious Retreat','Hellish Rebuke','Hex','Illusory Script','Protection from Evil and Good','Unseen Servant','Witch Bolt'],
  'Wizard': ['Alarm','Burning Hands','Charm Person','Chromatic Orb','Color Spray','Comprehend Languages','Detect Magic','Disguise Self','Expeditious Retreat','False Life','Feather Fall','Find Familiar','Fog Cloud','Grease','Identify','Illusory Script','Jump','Longstrider','Mage Armor','Magic Missile','Protection from Evil and Good','Ray of Sickness','Shield','Silent Image','Sleep','Tasha\'s Hideous Laughter','Thunderwave','Unseen Servant','Witch Bolt'],
};

// ==========================================
// Class 2nd-Level Spell Lists (PHB)
// ==========================================
export const CLASS_SPELLS_2ND: Record<string, string[]> = {
  'Bard': ['Animal Messenger','Blindness/Deafness','Calm Emotions','Cloud of Daggers','Crown of Madness','Detect Thoughts','Enhance Ability','Enthrall','Heat Metal','Hold Person','Invisibility','Knock','Lesser Restoration','Locate Animals or Plants','Locate Object','Magic Mouth','Phantasmal Force','See Invisibility','Shatter','Silence','Suggestion','Zone of Truth'],
  'Cleric': ['Aid','Augury','Blindness/Deafness','Calm Emotions','Continual Flame','Enhance Ability','Find Traps','Gentle Repose','Hold Person','Lesser Restoration','Locate Object','Prayer of Healing','Protection from Poison','Silence','Spiritual Weapon','Warding Bond','Zone of Truth'],
  'Druid': ['Animal Messenger','Barkskin','Beast Sense','Darkvision','Enhance Ability','Find Traps','Flame Blade','Flaming Sphere','Gust of Wind','Heat Metal','Hold Person','Lesser Restoration','Locate Animals or Plants','Locate Object','Moonbeam','Pass without Trace','Protection from Poison','Spike Growth'],
  'Paladin': ['Aid','Branding Smite','Find Steed','Lesser Restoration','Locate Object','Magic Weapon','Protection from Poison','Zone of Truth'],
  'Ranger': ['Animal Messenger','Barkskin','Darkvision','Find Traps','Lesser Restoration','Locate Animals or Plants','Locate Object','Pass without Trace','Protection from Poison','Silence','Spike Growth'],
  'Sorcerer': ['Alter Self','Blindness/Deafness','Blur','Cloud of Daggers','Crown of Madness','Darkness','Darkvision','Detect Thoughts','Enhance Ability','Enlarge/Reduce','Gust of Wind','Hold Person','Invisibility','Knock','Levitate','Mirror Image','Misty Step','Phantasmal Force','Scorching Ray','See Invisibility','Shatter','Spider Climb','Suggestion','Web'],
  'Warlock': ['Cloud of Daggers','Crown of Madness','Darkness','Enthrall','Hold Person','Invisibility','Mirror Image','Misty Step','Ray of Enfeeblement','Shatter','Spider Climb','Suggestion'],
  'Wizard': ['Alter Self','Arcane Lock','Blindness/Deafness','Blur','Cloud of Daggers','Continual Flame','Crown of Madness','Darkness','Darkvision','Detect Thoughts','Enlarge/Reduce','Flaming Sphere','Gentle Repose','Gust of Wind','Hold Person','Invisibility','Knock','Levitate','Locate Object','Magic Mouth','Magic Weapon','Melf\'s Acid Arrow','Mirror Image','Misty Step','Nystul\'s Magic Aura','Phantasmal Force','Ray of Enfeeblement','Rope Trick','Scorching Ray','See Invisibility','Shatter','Spider Climb','Suggestion','Web'],
};

// ==========================================
// Class 3rd-Level Spell Lists (PHB)
// ==========================================
export const CLASS_SPELLS_3RD: Record<string, string[]> = {
  'Bard': ['Bestow Curse','Clairvoyance','Dispel Magic','Fear','Feign Death','Glyph of Warding','Hypnotic Pattern','Leomund\'s Tiny Hut','Major Image','Nondetection','Plant Growth','Sending','Speak with Dead','Speak with Plants','Stinking Cloud','Tongues'],
  'Cleric': ['Animate Dead','Beacon of Hope','Bestow Curse','Clairvoyance','Create Food and Water','Daylight','Dispel Magic','Feign Death','Glyph of Warding','Magic Circle','Mass Healing Word','Meld into Stone','Protection from Energy','Remove Curse','Revivify','Sending','Speak with Dead','Spirit Guardians','Tongues','Water Walk'],
  'Druid': ['Call Lightning','Conjure Animals','Daylight','Dispel Magic','Feign Death','Meld into Stone','Plant Growth','Protection from Energy','Sleet Storm','Speak with Plants','Water Breathing','Water Walk','Wind Wall'],
  'Paladin': ['Create Food and Water','Daylight','Dispel Magic','Elemental Weapon','Magic Circle','Remove Curse','Revivify'],
  'Ranger': ['Conjure Animals','Conjure Barrage','Daylight','Lightning Arrow','Nondetection','Plant Growth','Protection from Energy','Speak with Plants','Water Breathing','Water Walk','Wind Wall'],
  'Sorcerer': ['Blink','Clairvoyance','Counterspell','Daylight','Dispel Magic','Fear','Fireball','Fly','Gaseous Form','Haste','Hypnotic Pattern','Lightning Bolt','Major Image','Protection from Energy','Sleet Storm','Slow','Stinking Cloud','Tongues','Water Breathing','Water Walk'],
  'Warlock': ['Counterspell','Dispel Magic','Fear','Fly','Gaseous Form','Hunger of Hadar','Hypnotic Pattern','Magic Circle','Major Image','Remove Curse','Tongues','Vampiric Touch'],
  'Wizard': ['Animate Dead','Bestow Curse','Blink','Clairvoyance','Counterspell','Dispel Magic','Fear','Feign Death','Fireball','Fly','Gaseous Form','Glyph of Warding','Haste','Hypnotic Pattern','Leomund\'s Tiny Hut','Lightning Bolt','Magic Circle','Major Image','Nondetection','Phantom Steed','Protection from Energy','Remove Curse','Sending','Sleet Storm','Slow','Stinking Cloud','Tongues','Vampiric Touch','Water Breathing'],
};

// ==========================================
// Class 4th-Level Spell Lists (PHB)
// ==========================================
export const CLASS_SPELLS_4TH: Record<string, string[]> = {
  'Bard': ['Compulsion','Confusion','Dimension Door','Freedom of Movement','Greater Invisibility','Hallucinatory Terrain','Locate Creature','Polymorph'],
  'Cleric': ['Banishment','Control Water','Death Ward','Divination','Freedom of Movement','Guardian of Faith','Locate Creature','Stone Shape'],
  'Druid': ['Blight','Confusion','Conjure Minor Elementals','Conjure Woodland Beings','Control Water','Dominate Beast','Freedom of Movement','Giant Insect','Grasping Vine','Hallucinatory Terrain','Ice Storm','Locate Creature','Polymorph','Stone Shape','Stoneskin','Wall of Fire'],
  'Paladin': ['Banishment','Death Ward','Locate Creature','Staggering Smite'],
  'Ranger': ['Conjure Woodland Beings','Freedom of Movement','Grasping Vine','Locate Creature','Stoneskin'],
  'Sorcerer': ['Banishment','Blight','Confusion','Dimension Door','Dominate Beast','Greater Invisibility','Ice Storm','Polymorph','Stoneskin','Wall of Fire'],
  'Warlock': ['Banishment','Blight','Dimension Door','Hallucinatory Terrain'],
  'Wizard': ['Arcane Eye','Banishment','Blight','Confusion','Conjure Minor Elementals','Control Water','Dimension Door','Fabricate','Fire Shield','Greater Invisibility','Hallucinatory Terrain','Ice Storm','Leomund\'s Secret Chest','Locate Creature','Mordenkainen\'s Faithful Hound','Mordenkainen\'s Private Sanctum','Otiluke\'s Resilient Sphere','Phantasmal Killer','Polymorph','Stone Shape','Stoneskin','Wall of Fire'],
};

// ==========================================
// Class 5th-Level Spell Lists (PHB)
// ==========================================
export const CLASS_SPELLS_5TH: Record<string, string[]> = {
  'Bard': ['Animate Objects','Awaken','Dominate Person','Dream','Geas','Greater Restoration','Hold Monster','Legend Lore','Mass Cure Wounds','Mislead','Modify Memory','Planar Binding','Raise Dead','Scrying','Seeming','Teleportation Circle'],
  'Cleric': ['Commune','Contagion','Dispel Evil and Good','Flame Strike','Geas','Greater Restoration','Hallow','Insect Plague','Legend Lore','Mass Cure Wounds','Planar Binding','Raise Dead','Scrying'],
  'Druid': ['Antilife Shell','Awaken','Commune with Nature','Conjure Elemental','Contagion','Geas','Greater Restoration','Insect Plague','Mass Cure Wounds','Planar Binding','Reincarnate','Scrying','Tree Stride','Wall of Stone'],
  'Paladin': ['Banishing Smite','Circle of Power','Destructive Wave','Dispel Evil and Good','Geas','Raise Dead'],
  'Ranger': ['Commune with Nature','Conjure Volley','Swift Quiver','Tree Stride'],
  'Sorcerer': ['Animate Objects','Cloudkill','Cone of Cold','Creation','Dominate Person','Hold Monster','Insect Plague','Seeming','Telekinesis','Teleportation Circle','Wall of Stone'],
  'Warlock': ['Contact Other Plane','Dream','Hold Monster','Scrying'],
  'Wizard': ['Animate Objects','Bigby\'s Hand','Cloudkill','Cone of Cold','Conjure Elemental','Contact Other Plane','Creation','Dominate Person','Dream','Geas','Hold Monster','Legend Lore','Mislead','Modify Memory','Passwall','Planar Binding','Rary\'s Telepathic Bond','Scrying','Seeming','Telekinesis','Teleportation Circle','Wall of Force','Wall of Stone'],
};

// ==========================================
// Class 6th-Level Spell Lists (PHB)
// ==========================================
export const CLASS_SPELLS_6TH: Record<string, string[]> = {
  'Bard': ['Eyebite','Find the Path','Guards and Wards','Mass Suggestion','Otto\'s Irresistible Dance','Programmed Illusion','True Seeing'],
  'Cleric': ['Blade Barrier','Create Undead','Find the Path','Forbiddance','Harm','Heal','Heroes\' Feast','Planar Ally','True Seeing','Word of Recall'],
  'Druid': ['Conjure Fey','Find the Path','Heal','Heroes\' Feast','Move Earth','Sunbeam','Transport via Plants','Wall of Thorns','Wind Walk'],
  'Sorcerer': ['Chain Lightning','Circle of Death','Disintegrate','Eyebite','Globe of Invulnerability','Mass Suggestion','Move Earth','Sunbeam','True Seeing'],
  'Warlock': ['Arcane Gate','Circle of Death','Conjure Fey','Create Undead','Eyebite','Flesh to Stone','Mass Suggestion','True Seeing'],
  'Wizard': ['Arcane Gate','Chain Lightning','Circle of Death','Contingency','Create Undead','Disintegrate','Drawmij\'s Instant Summons','Eyebite','Flesh to Stone','Globe of Invulnerability','Guards and Wards','Magic Jar','Mass Suggestion','Move Earth','Otiluke\'s Freezing Sphere','Otto\'s Irresistible Dance','Programmed Illusion','Sunbeam','True Seeing','Wall of Ice'],
};

// ==========================================
// Class 7th-Level Spell Lists (PHB)
// ==========================================
export const CLASS_SPELLS_7TH: Record<string, string[]> = {
  'Bard': ['Etherealness','Forcecage','Mirage Arcane','Mordenkainen\'s Magnificent Mansion','Mordenkainen\'s Sword','Project Image','Regenerate','Resurrection','Symbol','Teleport'],
  'Cleric': ['Conjure Celestial','Divine Word','Etherealness','Fire Storm','Plane Shift','Regenerate','Resurrection','Symbol','Temple of the Gods'],
  'Druid': ['Fire Storm','Mirage Arcane','Plane Shift','Regenerate','Reverse Gravity'],
  'Sorcerer': ['Delayed Blast Fireball','Etherealness','Finger of Death','Fire Storm','Plane Shift','Prismatic Spray','Reverse Gravity','Teleport'],
  'Warlock': ['Etherealness','Finger of Death','Forcecage','Plane Shift'],
  'Wizard': ['Delayed Blast Fireball','Etherealness','Finger of Death','Forcecage','Mirage Arcane','Mordenkainen\'s Magnificent Mansion','Mordenkainen\'s Sword','Plane Shift','Prismatic Spray','Project Image','Reverse Gravity','Sequester','Simulacrum','Symbol','Teleport'],
};

// ==========================================
// Class 8th-Level Spell Lists (PHB)
// ==========================================
export const CLASS_SPELLS_8TH: Record<string, string[]> = {
  'Bard': ['Dominate Monster','Feeblemind','Glibness','Mind Blank','Power Word Stun'],
  'Cleric': ['Antimagic Field','Control Weather','Earthquake','Holy Aura'],
  'Druid': ['Animal Shapes','Antipathy/Sympathy','Control Weather','Earthquake','Feeblemind','Sunburst','Tsunami'],
  'Sorcerer': ['Dominate Monster','Earthquake','Incendiary Cloud','Power Word Stun','Sunburst'],
  'Warlock': ['Demiplane','Dominate Monster','Feeblemind','Glibness','Power Word Stun'],
  'Wizard': ['Antimagic Field','Antipathy/Sympathy','Clone','Control Weather','Demiplane','Dominate Monster','Feeblemind','Incendiary Cloud','Maze','Mind Blank','Power Word Stun','Sunburst','Telepathy'],
};

// ==========================================
// Class 9th-Level Spell Lists (PHB)
// ==========================================
export const CLASS_SPELLS_9TH: Record<string, string[]> = {
  'Bard': ['Foresight','Power Word Heal','Power Word Kill','True Polymorph'],
  'Cleric': ['Astral Projection','Gate','Mass Heal','True Resurrection'],
  'Druid': ['Foresight','Shapechange','Storm of Vengeance','True Resurrection'],
  'Sorcerer': ['Gate','Meteor Swarm','Power Word Kill','Time Stop','Wish'],
  'Warlock': ['Astral Projection','Foresight','Imprisonment','Power Word Kill','True Polymorph'],
  'Wizard': ['Astral Projection','Foresight','Gate','Imprisonment','Meteor Swarm','Power Word Kill','Prismatic Wall','Shapechange','Time Stop','True Polymorph','Weird','Wish'],
};

// ==========================================
// Unified Spell List Accessor
// ==========================================
const SPELL_LIST_BY_LEVEL: Record<number, Record<string, string[]>> = {
  1: CLASS_SPELLS_1ST, 2: CLASS_SPELLS_2ND, 3: CLASS_SPELLS_3RD, 4: CLASS_SPELLS_4TH,
  5: CLASS_SPELLS_5TH, 6: CLASS_SPELLS_6TH, 7: CLASS_SPELLS_7TH, 8: CLASS_SPELLS_8TH, 9: CLASS_SPELLS_9TH,
};
export const getClassSpellsForLevel = (className: string, spellLevel: number): string[] =>
  SPELL_LIST_BY_LEVEL[spellLevel]?.[className] || [];

export const getMaxSpellLevelForClass = (className: string, charLevel: number): number => {
  const cls = DND_CLASSES.find(c => c.name === className);
  if (!cls?.isCaster) return 0;
  if (className === 'Warlock') {
    const pact = WARLOCK_PACT_SLOTS[charLevel];
    if (!pact) return 0;
    // Warlock pact slots cap at 5th; Mystic Arcanum gives 6th-9th
    let max = pact.level;
    if (charLevel >= 17) max = 9; else if (charLevel >= 15) max = 8;
    else if (charLevel >= 13) max = 7; else if (charLevel >= 11) max = 6;
    return max;
  }
  const isHalf = className === 'Paladin' || className === 'Ranger';
  const table = isHalf ? HALF_CASTER_SLOTS : FULL_CASTER_SLOTS;
  const slots = table[charLevel] || [];
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i] > 0) return i + 1;
  }
  return 0;
};

// ==========================================
// Subclass Options (PHB)
// ==========================================
export const SUBCLASS_OPTIONS: Record<string, string[]> = {
  'Barbarian': ['Berserker', 'Totem Warrior'],
  'Bard': ['College of Lore', 'College of Valor'],
  'Cleric': ['Knowledge Domain', 'Life Domain', 'Light Domain', 'Nature Domain', 'Tempest Domain', 'Trickery Domain', 'War Domain'],
  'Druid': ['Circle of the Land', 'Circle of the Moon'],
  'Fighter': ['Champion', 'Battle Master', 'Eldritch Knight'],
  'Monk': ['Way of the Open Hand', 'Way of Shadow', 'Way of the Four Elements'],
  'Paladin': ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance'],
  'Ranger': ['Hunter', 'Beast Master'],
  'Rogue': ['Thief', 'Assassin', 'Arcane Trickster'],
  'Sorcerer': ['Draconic Bloodline', 'Wild Magic'],
  'Warlock': ['The Archfey', 'The Fiend', 'The Great Old One'],
  'Wizard': ['School of Abjuration', 'School of Conjuration', 'School of Divination', 'School of Enchantment', 'School of Evocation', 'School of Illusion', 'School of Necromancy', 'School of Transmutation'],
};

// ==========================================
// Subclass Feature Progression (PHB)
// ==========================================
export const SUBCLASS_FEATURES: Record<string, Record<string, Record<number, ClassFeatureEntry[]>>> = {
  'Barbarian': {
    'Berserker': {
      3: [{ name: 'Frenzy', description: 'While raging, you can make a single melee weapon attack as a bonus action each turn. When rage ends, suffer one level of exhaustion.' }],
      6: [{ name: 'Mindless Rage', description: 'You can\'t be charmed or frightened while raging. If charmed/frightened when entering rage, the effect is suspended.' }],
      10: [{ name: 'Intimidating Presence', description: 'Action: frighten one creature within 30 ft. WIS save DC = 8 + prof + CHA mod.' }],
      14: [{ name: 'Retaliation', description: 'When you take damage from a creature within 5 ft, you can use your reaction to make a melee weapon attack against that creature.' }],
    },
    'Totem Warrior': {
      3: [{ name: 'Totem Spirit', description: 'Choose Bear (resistance to all damage except psychic while raging), Eagle (opportunity attacks have disadvantage, Dash as bonus action while raging), or Wolf (allies have advantage on melee attacks vs creatures within 5 ft of you while raging).' }],
      6: [{ name: 'Aspect of the Beast', description: 'Choose Bear (carrying capacity doubled, advantage on STR checks to push/pull/lift), Eagle (see up to 1 mile clearly, dim light doesn\'t impose disadvantage on Perception), or Wolf (track at fast pace, move stealthily at normal pace).' }],
      10: [{ name: 'Spirit Walker', description: 'Cast Commune with Nature as a ritual.' }],
      14: [{ name: 'Totemic Attunement', description: 'Choose Bear (while raging, hostile creatures within 5 ft have disadvantage on attacks vs allies), Eagle (flying speed equal to walking speed while raging), or Wolf (bonus action to knock Large or smaller creature prone on melee hit while raging).' }],
    },
  },
  'Bard': {
    'College of Lore': {
      3: [{ name: 'Bonus Proficiencies', description: 'Gain proficiency with any three skills of your choice.' },
          { name: 'Cutting Words', description: 'Reaction: when a creature you can see within 60 ft makes an attack roll, ability check, or damage roll, expend one Bardic Inspiration die to subtract the result from their roll.' }],
      6: [{ name: 'Additional Magical Secrets', description: 'Learn two spells from any class. They count as bard spells for you.' }],
      14: [{ name: 'Peerless Skill', description: 'When you make an ability check, you can expend one Bardic Inspiration die and add it to the result.' }],
    },
    'College of Valor': {
      3: [{ name: 'Bonus Proficiencies', description: 'Gain proficiency with medium armor, shields, and martial weapons.' },
          { name: 'Combat Inspiration', description: 'Creatures using your Bardic Inspiration can also add the die to a weapon damage roll or to AC against one attack.' }],
      6: [{ name: 'Extra Attack', description: 'Attack twice per Attack action.' }],
      14: [{ name: 'Battle Magic', description: 'When you cast a bard spell as an action, you can make one weapon attack as a bonus action.' }],
    },
  },
  'Cleric': {
    'Knowledge Domain': {
      1: [{ name: 'Blessings of Knowledge', description: 'Proficiency and double proficiency in two of: Arcana, History, Nature, or Religion.' }],
      2: [{ name: 'Knowledge of the Ages', description: 'Channel Divinity: gain proficiency with one skill or tool for 10 minutes.' }],
      6: [{ name: 'Read Thoughts', description: 'Channel Divinity: read a creature\'s surface thoughts and cast Suggestion on it.' }],
      8: [{ name: 'Potent Spellcasting', description: 'Add WIS modifier to cleric cantrip damage.' }],
      17: [{ name: 'Visions of the Past', description: 'Meditate to receive visions about an object or area.' }],
    },
    'Life Domain': {
      1: [{ name: 'Bonus Proficiency', description: 'Gain proficiency with heavy armor.' },
          { name: 'Disciple of Life', description: 'Healing spells heal an additional 2 + spell level HP.' }],
      2: [{ name: 'Preserve Life', description: 'Channel Divinity: restore HP equal to 5 × cleric level, divided among creatures within 30 ft.' }],
      6: [{ name: 'Blessed Healer', description: 'When you cast a healing spell on another creature, you also regain 2 + spell level HP.' }],
      8: [{ name: 'Divine Strike', description: 'Once per turn, deal +1d8 radiant damage with a weapon attack. +2d8 at 14th level.' }],
      17: [{ name: 'Supreme Healing', description: 'Healing spells always heal maximum instead of rolling.' }],
    },
    'Light Domain': {
      1: [{ name: 'Bonus Cantrip', description: 'You gain the Light cantrip if you don\'t already know it.' },
          { name: 'Warding Flare', description: 'Reaction: impose disadvantage on an attack roll against you. WIS mod uses per long rest.' }],
      2: [{ name: 'Radiance of the Dawn', description: 'Channel Divinity: dispel magical darkness within 30 ft and deal 2d10 + cleric level radiant damage (CON save for half).' }],
      6: [{ name: 'Improved Flare', description: 'You can use Warding Flare when a creature attacks an ally within 30 ft.' }],
      8: [{ name: 'Potent Spellcasting', description: 'Add WIS modifier to cleric cantrip damage.' }],
      17: [{ name: 'Corona of Light', description: 'Action: emit bright light 60 ft. Enemies in it have disadvantage on saves vs fire/radiant spells.' }],
    },
    'Tempest Domain': {
      1: [{ name: 'Bonus Proficiencies', description: 'Gain proficiency with martial weapons and heavy armor.' },
          { name: 'Wrath of the Storm', description: 'Reaction: when hit by melee attack, deal 2d8 lightning or thunder damage (DEX save for half). WIS mod uses per long rest.' }],
      2: [{ name: 'Destructive Wrath', description: 'Channel Divinity: deal maximum damage on lightning or thunder damage rolls.' }],
      6: [{ name: 'Thunderbolt Strike', description: 'When you deal lightning damage to a Large or smaller creature, push it up to 10 ft away.' }],
      8: [{ name: 'Divine Strike', description: 'Once per turn, deal +1d8 thunder damage with a weapon attack. +2d8 at 14th level.' }],
      17: [{ name: 'Stormborn', description: 'You have a flying speed equal to your walking speed when outdoors.' }],
    },
    'Trickery Domain': {
      1: [{ name: 'Blessing of the Trickster', description: 'Touch a willing creature to give it advantage on Stealth checks for 1 hour.' }],
      2: [{ name: 'Invoke Duplicity', description: 'Channel Divinity: create an illusory double for 1 minute. Advantage on attacks against enemies within 5 ft of it.' }],
      6: [{ name: 'Cloak of Shadows', description: 'Channel Divinity: become invisible until end of next turn or until you attack or cast a spell.' }],
      8: [{ name: 'Divine Strike', description: 'Once per turn, deal +1d8 poison damage with a weapon attack. +2d8 at 14th level.' }],
      17: [{ name: 'Improved Duplicity', description: 'You can create up to four duplicates instead of one.' }],
    },
    'War Domain': {
      1: [{ name: 'Bonus Proficiencies', description: 'Gain proficiency with martial weapons and heavy armor.' },
          { name: 'War Priest', description: 'When you take the Attack action, make one weapon attack as a bonus action. WIS mod uses per long rest.' }],
      2: [{ name: 'Guided Strike', description: 'Channel Divinity: +10 to an attack roll.' }],
      6: [{ name: 'War God\'s Blessing', description: 'Channel Divinity: give a creature within 30 ft +10 to an attack roll (reaction).' }],
      8: [{ name: 'Divine Strike', description: 'Once per turn, deal +1d8 damage (same type as weapon) on a weapon attack. +2d8 at 14th level.' }],
      17: [{ name: 'Avatar of Battle', description: 'Resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.' }],
    },
    'Nature Domain': {
      1: [{ name: 'Acolyte of Nature', description: 'Learn one druid cantrip and gain proficiency in one of: Animal Handling, Nature, or Survival.' },
          { name: 'Bonus Proficiency', description: 'Gain proficiency with heavy armor.' }],
      2: [{ name: 'Charm Animals and Plants', description: 'Channel Divinity: charm all beasts and plant creatures within 30 ft (WIS save).' }],
      6: [{ name: 'Dampen Elements', description: 'Reaction: grant resistance to acid, cold, fire, lightning, or thunder damage to a creature within 30 ft.' }],
      8: [{ name: 'Divine Strike', description: 'Once per turn, deal +1d8 cold, fire, or lightning damage with a weapon attack. +2d8 at 14th level.' }],
      17: [{ name: 'Master of Nature', description: 'Command creatures charmed by your Charm Animals and Plants feature.' }],
    },
  },
  'Druid': {
    'Circle of the Land': {
      2: [{ name: 'Bonus Cantrip', description: 'Learn one additional druid cantrip.' },
          { name: 'Natural Recovery', description: 'Recover spell slots totaling up to half druid level (rounded up) during short rest. 1/long rest.' }],
      3: [{ name: 'Circle Spells', description: 'Choose a land type. Gain bonus spells at 3rd, 5th, 7th, and 9th level based on chosen terrain.' }],
      6: [{ name: 'Land\'s Stride', description: 'Moving through nonmagical difficult terrain costs no extra movement. Advantage on saves vs plants that impede movement.' }],
      10: [{ name: 'Nature\'s Ward', description: 'Immune to poison, disease, and being charmed or frightened by elementals or fey.' }],
      14: [{ name: 'Nature\'s Sanctuary', description: 'Beasts and plant creatures must make WIS save to attack you.' }],
    },
    'Circle of the Moon': {
      2: [{ name: 'Combat Wild Shape', description: 'Use Wild Shape as bonus action. Spend a spell slot to regain 1d8 HP per slot level in beast form.' },
          { name: 'Circle Forms', description: 'Wild Shape into beasts with CR up to 1 (CR increases at higher levels).' }],
      6: [{ name: 'Primal Strike', description: 'Attacks in beast form count as magical.' }],
      10: [{ name: 'Elemental Wild Shape', description: 'Expend two Wild Shape uses to transform into an elemental.' }],
      14: [{ name: 'Thousand Forms', description: 'Cast Alter Self at will.' }],
    },
  },
  'Fighter': {
    'Champion': {
      3: [{ name: 'Improved Critical', description: 'Your weapon attacks score a critical hit on a roll of 19 or 20.' }],
      7: [{ name: 'Remarkable Athlete', description: 'Add half proficiency bonus (rounded up) to any STR, DEX, or CON check that doesn\'t already use your proficiency bonus. Running long jump distance increases by STR modifier feet.' }],
      10: [{ name: 'Additional Fighting Style', description: 'Choose a second Fighting Style option.' }],
      15: [{ name: 'Superior Critical', description: 'Your weapon attacks score a critical hit on a roll of 18-20.' }],
      18: [{ name: 'Survivor', description: 'At the start of each turn, if you have no more than half your HP and at least 1 HP, regain 5 + CON modifier HP.' }],
    },
    'Battle Master': {
      3: [{ name: 'Combat Superiority', description: 'Learn 3 maneuvers and gain 4 superiority dice (d8). Regain all on short/long rest.' },
          { name: 'Student of War', description: 'Gain proficiency with one artisan\'s tool.' }],
      7: [{ name: 'Know Your Enemy', description: 'After 1 minute observing a creature, learn if it is equal, superior, or inferior in two characteristics.' }],
      10: [{ name: 'Improved Combat Superiority', description: 'Superiority dice become d10. Learn 2 additional maneuvers.' }],
      15: [{ name: 'Relentless', description: 'If you have no superiority dice on initiative, you regain 1.' }],
      18: [{ name: 'Improved Combat Superiority (d12)', description: 'Superiority dice become d12. Learn 2 additional maneuvers.' }],
    },
    'Eldritch Knight': {
      3: [{ name: 'Spellcasting', description: 'Learn 2 cantrips and 3 1st-level wizard spells (abjuration/evocation). INT-based. Use Fighter spell slot progression.' },
          { name: 'Weapon Bond', description: 'Bond with up to two weapons. Cannot be disarmed; summon bonded weapon as bonus action.' }],
      7: [{ name: 'War Magic', description: 'When you cast a cantrip, make one weapon attack as a bonus action.' }],
      10: [{ name: 'Eldritch Strike', description: 'When you hit with a weapon attack, target has disadvantage on next save vs your spell before end of your next turn.' }],
      15: [{ name: 'Arcane Charge', description: 'When you use Action Surge, you can teleport up to 30 ft to an unoccupied space before the extra action.' }],
      18: [{ name: 'Improved War Magic', description: 'When you cast a spell as an action, make one weapon attack as a bonus action.' }],
    },
  },
  'Monk': {
    'Way of the Open Hand': {
      3: [{ name: 'Open Hand Technique', description: 'When you hit with a Flurry of Blows attack, you can impose one effect: knock prone (DEX save), push 15 ft (STR save), or prevent reactions until end of your next turn.' }],
      6: [{ name: 'Wholeness of Body', description: 'Action: regain HP equal to 3 × monk level. 1/long rest.' }],
      11: [{ name: 'Tranquility', description: 'At end of long rest, gain effect of Sanctuary spell (WIS save DC = 8 + WIS mod + prof) until start of next long rest.' }],
      17: [{ name: 'Quivering Palm', description: '3 ki: set up vibrations in a creature. You can end the vibrations to either deal 10d10 necrotic damage or reduce to 0 HP (CON save).' }],
    },
    'Way of Shadow': {
      3: [{ name: 'Shadow Arts', description: '2 ki: cast Darkness, Darkvision, Pass without Trace, or Silence. Free: Minor Illusion cantrip.' }],
      6: [{ name: 'Shadow Step', description: 'Bonus action: teleport up to 60 ft from one dim light/darkness area to another. Advantage on first melee attack after teleporting.' }],
      11: [{ name: 'Cloak of Shadows', description: 'Action: become invisible in dim light or darkness until you make an attack or cast a spell.' }],
      17: [{ name: 'Opportunist', description: 'Reaction: when a creature within 5 ft is hit by an attack from someone else, you can make a melee attack against that creature.' }],
    },
    'Way of the Four Elements': {
      3: [{ name: 'Disciple of the Elements', description: 'Learn Elemental Attunement discipline and one other elemental discipline of your choice. Spend ki to cast associated spells.' }],
      6: [{ name: 'Extra Discipline', description: 'Learn one additional elemental discipline.' }],
      11: [{ name: 'Extra Discipline (2)', description: 'Learn one additional elemental discipline.' }],
      17: [{ name: 'Extra Discipline (3)', description: 'Learn one additional elemental discipline.' }],
    },
  },
  'Paladin': {
    'Oath of Devotion': {
      3: [{ name: 'Sacred Weapon', description: 'Channel Divinity: add CHA mod to attack rolls for 1 minute. Weapon emits bright light 20 ft.' },
          { name: 'Turn the Unholy', description: 'Channel Divinity: each fiend/undead within 30 ft must make WIS save or be turned for 1 minute.' }],
      7: [{ name: 'Aura of Devotion', description: 'You and friendly creatures within 10 ft can\'t be charmed.' }],
      15: [{ name: 'Purity of Spirit', description: 'You are always under the effects of Protection from Evil and Good.' }],
      20: [{ name: 'Holy Nimbus', description: 'Action: for 1 minute, emit bright light 30 ft, deal 10 radiant damage to enemies that start their turn in light. Advantage on saves vs fiend/undead spells.' }],
    },
    'Oath of the Ancients': {
      3: [{ name: 'Nature\'s Wrath', description: 'Channel Divinity: restrain a creature within 10 ft with spectral vines (STR/DEX save).' },
          { name: 'Turn the Faithless', description: 'Channel Divinity: turn fey and fiends within 30 ft (WIS save).' }],
      7: [{ name: 'Aura of Warding', description: 'You and friendly creatures within 10 ft have resistance to spell damage.' }],
      15: [{ name: 'Undying Sentinel', description: 'When reduced to 0 HP and not killed outright, drop to 1 HP instead. 1/long rest. No aging effects.' }],
      20: [{ name: 'Elder Champion', description: 'Action: for 1 minute, regain 10 HP at start of each turn, cast paladin spells as bonus action, enemies within 10 ft have disadvantage on saves vs your spells and Channel Divinity.' }],
    },
    'Oath of Vengeance': {
      3: [{ name: 'Abjure Enemy', description: 'Channel Divinity: one creature within 60 ft must make WIS save or be frightened and speed is 0. Fiends/undead have disadvantage.' },
          { name: 'Vow of Enmity', description: 'Channel Divinity: advantage on attack rolls against one creature within 10 ft for 1 minute.' }],
      7: [{ name: 'Relentless Avenger', description: 'When you hit with an opportunity attack, move up to half your speed immediately after without provoking opportunity attacks.' }],
      15: [{ name: 'Soul of Vengeance', description: 'Reaction: when your Vow of Enmity target makes an attack, you can make a melee weapon attack against it.' }],
      20: [{ name: 'Avenging Angel', description: 'Action: for 1 hour, sprout wings (60 ft fly speed), emit aura that frightens enemies within 30 ft (WIS save).' }],
    },
  },
  'Ranger': {
    'Hunter': {
      3: [{ name: 'Hunter\'s Prey', description: 'Choose Colossus Slayer (+1d8 to injured targets), Giant Killer (reaction attack when Large+ creature misses), or Horde Breaker (extra attack against adjacent creature).' }],
      7: [{ name: 'Defensive Tactics', description: 'Choose Escape the Horde (opportunity attacks have disadvantage), Multiattack Defense (+4 AC after being hit by multiattack), or Steel Will (advantage on saves vs frightened).' }],
      11: [{ name: 'Multiattack', description: 'Choose Volley (ranged attack against all creatures within 10 ft of a point in range) or Whirlwind Attack (melee attack against all creatures within 5 ft).' }],
      15: [{ name: 'Superior Hunter\'s Defense', description: 'Choose Evasion, Stand Against the Tide (redirect missed melee to another creature), or Uncanny Dodge.' }],
    },
    'Beast Master': {
      3: [{ name: 'Ranger\'s Companion', description: 'Gain a beast companion (CR 1/4 or lower, Medium or smaller). It obeys your commands, adds your proficiency bonus to AC/attacks/saves/damage.' }],
      7: [{ name: 'Exceptional Training', description: 'Bonus action: command companion to Dash, Disengage, Dodge, or Help. Its attacks count as magical.' }],
      11: [{ name: 'Bestial Fury', description: 'Your companion can make two attacks when you command it to Attack.' }],
      15: [{ name: 'Share Spells', description: 'When you cast a spell targeting yourself, it also affects your companion if within 30 ft.' }],
    },
  },
  'Rogue': {
    'Thief': {
      3: [{ name: 'Fast Hands', description: 'Cunning Action lets you also make Sleight of Hand checks, use thieves\' tools, or Use an Object.' },
          { name: 'Second-Story Work', description: 'Climbing costs no extra movement. Running jump distance increases by DEX modifier feet.' }],
      9: [{ name: 'Supreme Sneak', description: 'Advantage on Stealth checks if you move no more than half your speed.' }],
      13: [{ name: 'Use Magic Device', description: 'Ignore all class, race, and level requirements on magic items.' }],
      17: [{ name: 'Thief\'s Reflexes', description: 'Two turns during the first round of combat (second turn at initiative minus 10).' }],
    },
    'Assassin': {
      3: [{ name: 'Bonus Proficiencies', description: 'Gain proficiency with the disguise kit and poisoner\'s kit.' },
          { name: 'Assassinate', description: 'Advantage on attacks against creatures that haven\'t taken a turn. Hits against surprised creatures are critical hits.' }],
      9: [{ name: 'Infiltration Expertise', description: 'Spend 7 days and 25 gp to create a false identity with documentation and established persona.' }],
      13: [{ name: 'Impostor', description: 'Unerringly mimic another person\'s speech, writing, and behavior after 3 hours of study.' }],
      17: [{ name: 'Death Strike', description: 'When you hit a surprised creature, it must make a CON save (DC 8 + DEX mod + prof) or take double damage.' }],
    },
    'Arcane Trickster': {
      3: [{ name: 'Spellcasting', description: 'Learn 2 cantrips (Mage Hand + 1) and 3 1st-level wizard spells (enchantment/illusion). INT-based.' },
          { name: 'Mage Hand Legerdemain', description: 'Mage Hand is invisible. Use it to stash/retrieve objects, pick locks, and disarm traps at range.' }],
      9: [{ name: 'Magical Ambush', description: 'If you are hidden when you cast a spell, target has disadvantage on the save.' }],
      13: [{ name: 'Versatile Trickster', description: 'Bonus action: use Mage Hand to distract a creature within 5 ft of it, giving you advantage on attacks against that creature.' }],
      17: [{ name: 'Spell Thief', description: 'Reaction: when a creature casts a spell targeting you, make ability check vs DC 10 + spell level to steal it. Creature can\'t cast it for 8 hours, and you can cast it using your slots.' }],
    },
  },
  'Sorcerer': {
    'Draconic Bloodline': {
      1: [{ name: 'Dragon Ancestor', description: 'Choose a dragon type. You can speak Draconic. Double proficiency bonus on CHA checks with dragons.' },
          { name: 'Draconic Resilience', description: 'HP maximum increases by 1 per sorcerer level. Without armor, AC = 13 + DEX modifier.' }],
      6: [{ name: 'Elemental Affinity', description: 'When you cast a spell that deals your dragon type\'s damage, add CHA modifier to one damage roll. Spend 1 sorcery point to gain resistance to that damage type for 1 hour.' }],
      14: [{ name: 'Dragon Wings', description: 'Bonus action: sprout dragon wings, gaining flying speed equal to your current speed. Don\'t work if wearing armor you\'re not proficient with.' }],
      18: [{ name: 'Draconic Presence', description: '5 sorcery points: create a 60 ft aura of awe or fear for 1 minute (CHA save). Concentration.' }],
    },
    'Wild Magic': {
      1: [{ name: 'Wild Magic Surge', description: 'After casting a sorcerer spell of 1st level or higher, DM can have you roll d20. On 1, roll on Wild Magic Surge table.' },
          { name: 'Tides of Chaos', description: 'Gain advantage on one attack, ability check, or save. Recharges on long rest, or when DM triggers a Wild Magic Surge.' }],
      6: [{ name: 'Bend Luck', description: '2 sorcery points (reaction): add or subtract 1d4 from a creature\'s attack roll, ability check, or save.' }],
      14: [{ name: 'Controlled Chaos', description: 'When you roll on the Wild Magic Surge table, roll twice and use either result.' }],
      18: [{ name: 'Spell Bombardment', description: 'When you roll damage for a spell and roll the highest number on a die, reroll that die and add it to the damage. Once per turn.' }],
    },
  },
  'Warlock': {
    'The Archfey': {
      1: [{ name: 'Fey Presence', description: 'Action: charm or frighten creatures within 10 ft cube (WIS save). 1/short or long rest.' }],
      6: [{ name: 'Misty Escape', description: 'Reaction: when you take damage, turn invisible and teleport up to 60 ft. Invisible until start of next turn. 1/short or long rest.' }],
      10: [{ name: 'Beguiling Defenses', description: 'Immune to being charmed. Reaction: when a creature tries to charm you, turn the charm back on it (WIS save).' }],
      14: [{ name: 'Dark Delirium', description: 'Action: charm or frighten a creature for 1 minute (WIS save). Target thinks it\'s lost in a misty realm. Concentration. 1/short or long rest.' }],
    },
    'The Fiend': {
      1: [{ name: 'Dark One\'s Blessing', description: 'When you reduce a hostile creature to 0 HP, gain temporary HP equal to CHA modifier + warlock level.' }],
      6: [{ name: 'Dark One\'s Own Luck', description: 'Add 1d10 to an ability check or saving throw. 1/short or long rest.' }],
      10: [{ name: 'Fiendish Resilience', description: 'After a short or long rest, choose a damage type (not magical or silvered). You have resistance to it until you choose a different one.' }],
      14: [{ name: 'Hurl Through Hell', description: 'When you hit with an attack, send the creature through the lower planes. It takes 10d10 psychic damage. 1/long rest.' }],
    },
    'The Great Old One': {
      1: [{ name: 'Awakened Mind', description: 'Telepathically speak to any creature within 30 ft. No shared language needed.' }],
      6: [{ name: 'Entropic Ward', description: 'Reaction: impose disadvantage on an attack against you. If it misses, gain advantage on your next attack against the attacker. 1/short or long rest.' }],
      10: [{ name: 'Thought Shield', description: 'Thoughts can\'t be read by telepathy. Resistance to psychic damage. Creature that deals psychic damage to you takes the same amount.' }],
      14: [{ name: 'Create Thrall', description: 'Touch an incapacitated humanoid to charm it permanently. Telepathic bond across any distance on the same plane.' }],
    },
  },
  'Wizard': {
    'School of Abjuration': {
      2: [{ name: 'Abjuration Savant', description: 'Halved gold and time to copy abjuration spells into your spellbook.' },
          { name: 'Arcane Ward', description: 'When you cast an abjuration spell of 1st+, create a ward with HP = 2 × wizard level + INT mod. Absorbs damage for you.' }],
      6: [{ name: 'Projected Ward', description: 'Reaction: when a creature within 30 ft takes damage, your Arcane Ward absorbs the damage instead.' }],
      10: [{ name: 'Improved Abjuration', description: 'Add proficiency bonus to ability checks for abjuration spells (like Counterspell and Dispel Magic).' }],
      14: [{ name: 'Spell Resistance', description: 'Advantage on saves against spells. Resistance to damage from spells.' }],
    },
    'School of Conjuration': {
      2: [{ name: 'Conjuration Savant', description: 'Halved gold and time to copy conjuration spells.' },
          { name: 'Minor Conjuration', description: 'Action: conjure an inanimate object (up to 3 ft, 10 lbs) that lasts 1 hour.' }],
      6: [{ name: 'Benign Transposition', description: 'Action: teleport up to 30 ft, or swap places with a willing Small/Medium creature within 30 ft. 1/long rest or until you cast a conjuration spell.' }],
      10: [{ name: 'Focused Conjuration', description: 'Concentration on conjuration spells can\'t be broken by taking damage.' }],
      14: [{ name: 'Durable Summons', description: 'Creatures you summon with conjuration spells gain 30 temporary HP.' }],
    },
    'School of Divination': {
      2: [{ name: 'Divination Savant', description: 'Halved gold and time to copy divination spells.' },
          { name: 'Portent', description: 'After a long rest, roll 2d20 and record the results. You can replace any attack roll, saving throw, or ability check made by you or a creature you can see with one of these rolls.' }],
      6: [{ name: 'Expert Divination', description: 'When you cast a divination spell of 2nd+ using a spell slot, regain a lower-level spell slot.' }],
      10: [{ name: 'The Third Eye', description: 'Action: gain one of darkvision 60 ft, ethereal sight 60 ft, read any language, or see invisible creatures within 10 ft. Until short/long rest.' }],
      14: [{ name: 'Greater Portent', description: 'Roll 3d20 for Portent instead of 2.' }],
    },
    'School of Enchantment': {
      2: [{ name: 'Enchantment Savant', description: 'Halved gold and time to copy enchantment spells.' },
          { name: 'Hypnotic Gaze', description: 'Action: charm a creature within 5 ft (WIS save). Incapacitated and speed 0 while you maintain (action each turn). Lasts 1 minute.' }],
      6: [{ name: 'Instinctive Charm', description: 'Reaction: when attacked by a creature within 30 ft, redirect the attack to another creature (WIS save). 1/long rest.' }],
      10: [{ name: 'Split Enchantment', description: 'When you cast an enchantment spell of 1st+ targeting one creature, you can target a second creature.' }],
      14: [{ name: 'Alter Memories', description: 'When you charm a creature, erase its memory of being charmed. Also cast Modify Memory on a charmed target without using a spell slot.' }],
    },
    'School of Evocation': {
      2: [{ name: 'Evocation Savant', description: 'Halved gold and time to copy evocation spells.' },
          { name: 'Sculpt Spells', description: 'When you cast an evocation spell affecting others, choose 1 + spell level creatures that automatically succeed on saves and take no damage.' }],
      6: [{ name: 'Potent Cantrip', description: 'Creatures that succeed on saves against your cantrips still take half damage.' }],
      10: [{ name: 'Empowered Evocation', description: 'Add INT modifier to one damage roll of any wizard evocation spell.' }],
      14: [{ name: 'Overchannel', description: 'When you cast a wizard spell of 5th level or lower that deals damage, you can deal maximum damage. After first use between long rests, take 2d12 necrotic per spell level (increases each additional use).' }],
    },
    'School of Illusion': {
      2: [{ name: 'Illusion Savant', description: 'Halved gold and time to copy illusion spells.' },
          { name: 'Improved Minor Illusion', description: 'Learn Minor Illusion if you don\'t know it. You can create both a sound and an image with a single casting.' }],
      6: [{ name: 'Malleable Illusions', description: 'When you cast an illusion spell with duration of 1 minute+, you can use an action to change the nature of the illusion.' }],
      10: [{ name: 'Illusory Self', description: 'Reaction: when a creature attacks you, create an illusory duplicate that causes the attack to miss. 1/short or long rest.' }],
      14: [{ name: 'Illusory Reality', description: 'Bonus action: make one inanimate, nonmagical object in your illusion spell real for 1 minute.' }],
    },
    'School of Necromancy': {
      2: [{ name: 'Necromancy Savant', description: 'Halved gold and time to copy necromancy spells.' },
          { name: 'Grim Harvest', description: 'When you kill a creature with a spell of 1st+, regain HP = 2 × spell level (3 × for necromancy spells). Not from undead or constructs.' }],
      6: [{ name: 'Undead Thralls', description: 'Animate Dead adds extra HP (wizard level) and extra damage (proficiency bonus) to undead you create.' }],
      10: [{ name: 'Inured to Undeath', description: 'Resistance to necrotic damage. HP maximum can\'t be reduced.' }],
      14: [{ name: 'Command Undead', description: 'Action: target one undead (WIS save, INT 8+ gets advantage). On fail, it obeys your commands for 24 hours. 12+ INT undead can repeat saves.' }],
    },
    'School of Transmutation': {
      2: [{ name: 'Transmutation Savant', description: 'Halved gold and time to copy transmutation spells.' },
          { name: 'Minor Alchemy', description: 'Transform one nonmagical object (wood, stone, iron, copper, or silver) into one of the other materials. Duration: 1 hour per 10 minutes spent.' }],
      6: [{ name: 'Transmuter\'s Stone', description: 'Create a stone granting one benefit: darkvision 60 ft, +10 ft speed, proficiency in CON saves, or resistance to acid/cold/fire/lightning/thunder.' }],
      10: [{ name: 'Shapechanger', description: 'Add Polymorph to your spellbook if not there. Cast Polymorph on yourself without spending a spell slot. 1/short or long rest.' }],
      14: [{ name: 'Master Transmuter', description: 'Action: destroy your transmuter\'s stone to: transmute one nonmagical object into another, remove all curses/diseases/poisons, cast Raise Dead without a slot, or reduce apparent age by 3d10 years.' }],
    },
  },
};

// ==========================================
// Starting Gold by Level (DMG guidelines)
// ==========================================
export const STARTING_GOLD_BY_LEVEL: Record<number, number> = {
  1: 200, 2: 200, 3: 300, 4: 400,
  5: 500, 6: 600, 7: 750, 8: 900,
  9: 1100, 10: 1300, 11: 1700, 12: 2100,
  13: 2600, 14: 3200, 15: 3900, 16: 4700,
  17: 5600, 18: 6800, 19: 8200, 20: 10000,
};

// ==========================================
// Multi-Level Character Creation Helpers
// ==========================================
export const getAllFeaturesUpToLevel = (className: string, level: number): ClassFeatureEntry[] => {
  const classFeats = CLASS_FEATURES[className];
  if (!classFeats) return [];
  const result: ClassFeatureEntry[] = [];
  for (let l = 1; l <= level; l++) {
    if (classFeats[l]) result.push(...classFeats[l]);
  }
  return result;
};

export const getSubclassFeaturesUpToLevel = (className: string, subclass: string, level: number): ClassFeatureEntry[] => {
  const tree = SUBCLASS_FEATURES[className]?.[subclass];
  if (!tree) return [];
  const result: ClassFeatureEntry[] = [];
  for (let l = 1; l <= level; l++) {
    if (tree[l]) result.push(...tree[l]);
  }
  return result;
};

export const calculateMultiLevelHP = (hitDie: number, conMod: number, level: number, hpBonusPerLevel: number = 0): number => {
  if (level <= 0) return 1;
  // Level 1: max hit die + CON mod + racial bonus
  const level1HP = hitDie + conMod + hpBonusPerLevel;
  if (level === 1) return Math.max(1, level1HP);
  // Levels 2+: average hit die (die/2 + 1) + CON mod + racial bonus per level
  const avgPerLevel = Math.floor(hitDie / 2) + 1 + conMod + hpBonusPerLevel;
  return Math.max(1, level1HP + avgPerLevel * (level - 1));
};

export const getASILevelsUpTo = (className: string, level: number): number[] => {
  const cls = DND_CLASSES.find(c => c.name === className);
  if (!cls) return [];
  return cls.asiLevels.filter(l => l <= level);
};

export const getExpertiseLevelsUpTo = (className: string, level: number): number[] => {
  const cls = DND_CLASSES.find(c => c.name === className);
  if (!cls?.expertiseLevels) return [];
  return cls.expertiseLevels.filter(l => l <= level);
};

// ==========================================
// Helper Functions
// ==========================================
export const getClassFeatures = (className: string, level: number): ClassFeatureEntry[] =>
  CLASS_FEATURES[className]?.[level] || [];

export const isASILevel = (className: string, level: number): boolean => {
  const cls = DND_CLASSES.find(c => c.name === className);
  return cls?.asiLevels.includes(level) ?? false;
};

export const isExpertiseLevel = (className: string, level: number): boolean => {
  const cls = DND_CLASSES.find(c => c.name === className);
  return cls?.expertiseLevels?.includes(level) ?? false;
};

export const getSpellSlotsForLevel = (className: string, charLevel: number): { level: number; max: number }[] => {
  const cls = DND_CLASSES.find(c => c.name === className);
  if (!cls?.isCaster) return [];
  if (className === 'Warlock') {
    const pact = WARLOCK_PACT_SLOTS[charLevel];
    return pact ? [{ level: pact.level, max: pact.count }] : [];
  }
  const isHalf = className === 'Paladin' || className === 'Ranger';
  const table = isHalf ? HALF_CASTER_SLOTS : FULL_CASTER_SLOTS;
  const slots = table[charLevel] || [];
  return slots.map((max, i) => ({ level: i + 1, max })).filter(s => s.max > 0);
};

export const getCantripsKnownCount = (className: string, charLevel: number): number => {
  const table = CANTRIPS_KNOWN[className];
  if (!table) return 0;
  let count = 0;
  for (const [lvl, cnt] of Object.entries(table)) {
    if (charLevel >= parseInt(lvl)) count = cnt;
  }
  return count;
};

export const getSpellsKnownCount = (className: string, charLevel: number): number => {
  const table = SPELLS_KNOWN[className];
  if (!table) return 0;
  let count = 0;
  for (const [lvl, cnt] of Object.entries(table)) {
    if (charLevel >= parseInt(lvl)) count = cnt;
  }
  return count;
};

export const getSneakAttackDice = (rogueLevel: number): string =>
  `${Math.ceil(rogueLevel / 2)}d6`;

// ─── D&D 5e Conditions Reference ─────────────────────────────────────────────
// All 15 conditions from the PHB/SRD with mechanical effects for tooltips,
// initiative tracker, and condition management UI.

export interface ConditionData {
  name: string;
  description: string;
  /** Mechanical effects expressed as structured rules */
  effects: string[];
  /** Icon hint for UI rendering */
  icon: string;
}

export const CONDITIONS: Record<string, ConditionData> = {
  blinded: {
    name: 'Blinded',
    description: "A blinded creature can't see and automatically fails any ability check that requires sight.",
    effects: [
      'Automatically fails ability checks requiring sight',
      "Attack rolls against the creature have advantage",
      "The creature's attack rolls have disadvantage",
    ],
    icon: 'eye-off',
  },
  charmed: {
    name: 'Charmed',
    description: "A charmed creature can't attack the charmer or target the charmer with harmful abilities or magical effects.",
    effects: [
      "Can't attack the charmer",
      "Can't target the charmer with harmful abilities or magic",
      'The charmer has advantage on social ability checks against the creature',
    ],
    icon: 'heart',
  },
  deafened: {
    name: 'Deafened',
    description: "A deafened creature can't hear and automatically fails any ability check that requires hearing.",
    effects: [
      'Automatically fails ability checks requiring hearing',
    ],
    icon: 'ear-off',
  },
  frightened: {
    name: 'Frightened',
    description: 'A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.',
    effects: [
      'Disadvantage on ability checks while source of fear is visible',
      'Disadvantage on attack rolls while source of fear is visible',
      "Can't willingly move closer to the source of its fear",
    ],
    icon: 'alert-triangle',
  },
  grappled: {
    name: 'Grappled',
    description: "A grappled creature's speed becomes 0, and it can't benefit from any bonus to its speed.",
    effects: [
      'Speed becomes 0',
      "Can't benefit from bonuses to speed",
      'Ends if grappler is incapacitated or moved out of reach',
    ],
    icon: 'grip-horizontal',
  },
  incapacitated: {
    name: 'Incapacitated',
    description: "An incapacitated creature can't take actions or reactions.",
    effects: [
      "Can't take actions",
      "Can't take reactions",
    ],
    icon: 'ban',
  },
  invisible: {
    name: 'Invisible',
    description: "An invisible creature is impossible to see without the aid of magic or a special sense. The creature's location can be detected by noise or tracks.",
    effects: [
      'Impossible to see without magic or special senses',
      'Considered heavily obscured for hiding purposes',
      "Attack rolls against the creature have disadvantage",
      "The creature's attack rolls have advantage",
    ],
    icon: 'ghost',
  },
  paralyzed: {
    name: 'Paralyzed',
    description: 'A paralyzed creature is incapacitated and cannot move or speak.',
    effects: [
      "Can't move or speak",
      'Automatically fails STR and DEX saving throws',
      'Attack rolls against the creature have advantage',
      'Melee attacks within 5 ft are automatic critical hits',
    ],
    icon: 'zap-off',
  },
  petrified: {
    name: 'Petrified',
    description: 'A petrified creature is transformed into a solid inanimate substance. It is incapacitated, unaware of its surroundings, and its weight increases by a factor of ten.',
    effects: [
      "Can't move or speak; unaware of surroundings",
      'Attack rolls against the creature have advantage',
      'Automatically fails STR and DEX saving throws',
      'Resistance to all damage',
      'Immune to poison and disease (existing ones suspended)',
    ],
    icon: 'mountain',
  },
  poisoned: {
    name: 'Poisoned',
    description: 'A poisoned creature has disadvantage on attack rolls and ability checks.',
    effects: [
      'Disadvantage on attack rolls',
      'Disadvantage on ability checks',
    ],
    icon: 'skull',
  },
  prone: {
    name: 'Prone',
    description: 'A prone creature can only crawl. Standing up costs half of movement speed.',
    effects: [
      'Can only crawl (movement costs double)',
      'Disadvantage on attack rolls',
      'Melee attack rolls within 5 ft have advantage against the creature',
      'Ranged attack rolls have disadvantage against the creature',
      'Standing up costs half movement speed',
    ],
    icon: 'arrow-down',
  },
  restrained: {
    name: 'Restrained',
    description: "A restrained creature's speed becomes 0, and it can't benefit from any bonus to its speed.",
    effects: [
      'Speed becomes 0',
      'Attack rolls against the creature have advantage',
      "The creature's attack rolls have disadvantage",
      'Disadvantage on DEX saving throws',
    ],
    icon: 'link',
  },
  stunned: {
    name: 'Stunned',
    description: "A stunned creature is incapacitated, can't move, and can speak only falteringly.",
    effects: [
      "Can't move; can speak only falteringly",
      'Automatically fails STR and DEX saving throws',
      'Attack rolls against the creature have advantage',
    ],
    icon: 'star',
  },
  unconscious: {
    name: 'Unconscious',
    description: 'An unconscious creature is incapacitated, drops what it is holding, and falls prone.',
    effects: [
      "Can't move or speak; unaware of surroundings",
      'Drops what it is holding and falls prone',
      'Automatically fails STR and DEX saving throws',
      'Attack rolls against the creature have advantage',
      'Melee attacks within 5 ft are automatic critical hits',
    ],
    icon: 'moon',
  },
  exhaustion: {
    name: 'Exhaustion',
    description: 'Exhaustion is measured in six levels. Effects are cumulative.',
    effects: [
      'Level 1: Disadvantage on ability checks',
      'Level 2: Speed halved',
      'Level 3: Disadvantage on attack rolls and saving throws',
      'Level 4: HP maximum halved',
      'Level 5: Speed reduced to 0',
      'Level 6: Death',
    ],
    icon: 'battery-low',
  },
};

/** Get a condition by key name (case-insensitive) */
export function getCondition(name: string): ConditionData | undefined {
  return CONDITIONS[name.toLowerCase()];
}

/** List of all condition names for dropdowns / filter chips */
export const CONDITION_NAMES = Object.values(CONDITIONS).map(c => c.name);

// ─── Encounter Difficulty Thresholds (DMG p.82) ──────────────────────────────
// XP thresholds per character level for each difficulty category.
// To determine encounter difficulty:
// 1. Sum the XP thresholds for all party members at the appropriate difficulty
// 2. Sum the XP values of all monsters in the encounter
// 3. Apply the encounter multiplier based on monster count
// 4. Compare adjusted XP to party thresholds

export interface DifficultyThresholds {
  easy: number;
  medium: number;
  hard: number;
  deadly: number;
}

/** XP thresholds per character level (DMG p.82) */
export const ENCOUNTER_THRESHOLDS_BY_LEVEL: Record<number, DifficultyThresholds> = {
  1:  { easy: 25,    medium: 50,    hard: 75,    deadly: 100 },
  2:  { easy: 50,    medium: 100,   hard: 150,   deadly: 200 },
  3:  { easy: 75,    medium: 150,   hard: 225,   deadly: 400 },
  4:  { easy: 125,   medium: 250,   hard: 375,   deadly: 500 },
  5:  { easy: 250,   medium: 500,   hard: 750,   deadly: 1100 },
  6:  { easy: 300,   medium: 600,   hard: 900,   deadly: 1400 },
  7:  { easy: 350,   medium: 750,   hard: 1100,  deadly: 1700 },
  8:  { easy: 450,   medium: 900,   hard: 1400,  deadly: 2100 },
  9:  { easy: 550,   medium: 1100,  hard: 1600,  deadly: 2400 },
  10: { easy: 600,   medium: 1200,  hard: 1900,  deadly: 2800 },
  11: { easy: 800,   medium: 1600,  hard: 2400,  deadly: 3600 },
  12: { easy: 1000,  medium: 2000,  hard: 3000,  deadly: 4500 },
  13: { easy: 1100,  medium: 2200,  hard: 3400,  deadly: 5100 },
  14: { easy: 1250,  medium: 2500,  hard: 3800,  deadly: 5700 },
  15: { easy: 1400,  medium: 2800,  hard: 4300,  deadly: 6400 },
  16: { easy: 1600,  medium: 3200,  hard: 4800,  deadly: 7200 },
  17: { easy: 2000,  medium: 3900,  hard: 5900,  deadly: 8800 },
  18: { easy: 2100,  medium: 4200,  hard: 6300,  deadly: 9500 },
  19: { easy: 2400,  medium: 4900,  hard: 7300,  deadly: 10900 },
  20: { easy: 2800,  medium: 5700,  hard: 8500,  deadly: 12700 },
};

/** Encounter multiplier based on number of monsters (DMG p.82) */
export const ENCOUNTER_MULTIPLIERS: { maxMonsters: number; multiplier: number }[] = [
  { maxMonsters: 1,  multiplier: 1 },
  { maxMonsters: 2,  multiplier: 1.5 },
  { maxMonsters: 6,  multiplier: 2 },
  { maxMonsters: 10, multiplier: 2.5 },
  { maxMonsters: 14, multiplier: 3 },
  { maxMonsters: Infinity, multiplier: 4 },
];

/** Get the encounter multiplier for a given number of monsters */
export function getEncounterMultiplier(monsterCount: number): number {
  for (const { maxMonsters, multiplier } of ENCOUNTER_MULTIPLIERS) {
    if (monsterCount <= maxMonsters) return multiplier;
  }
  return 4;
}

export type EncounterDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly';

/**
 * Calculate encounter difficulty given party levels and total monster XP.
 * Returns the difficulty category and the adjusted XP.
 */
export function calculateEncounterDifficulty(
  partyLevels: number[],
  totalMonsterXP: number,
  monsterCount: number
): { difficulty: EncounterDifficulty; adjustedXP: number; thresholds: DifficultyThresholds } {
  // Sum thresholds for all party members
  const thresholds: DifficultyThresholds = { easy: 0, medium: 0, hard: 0, deadly: 0 };
  partyLevels.forEach(level => {
    const lvl = Math.max(1, Math.min(20, level));
    const t = ENCOUNTER_THRESHOLDS_BY_LEVEL[lvl];
    thresholds.easy += t.easy;
    thresholds.medium += t.medium;
    thresholds.hard += t.hard;
    thresholds.deadly += t.deadly;
  });

  const multiplier = getEncounterMultiplier(monsterCount);
  const adjustedXP = Math.round(totalMonsterXP * multiplier);

  let difficulty: EncounterDifficulty = 'trivial';
  if (adjustedXP >= thresholds.deadly) difficulty = 'deadly';
  else if (adjustedXP >= thresholds.hard) difficulty = 'hard';
  else if (adjustedXP >= thresholds.medium) difficulty = 'medium';
  else if (adjustedXP >= thresholds.easy) difficulty = 'easy';

  return { difficulty, adjustedXP, thresholds };
}

// ─── Monster HP Descriptors ──────────────────────────────────────────────────
// Used by the initiative tracker to show monster health to players without
// revealing exact numbers.

export type MonsterHealthDescriptor = 'Uninjured' | 'Barely Wounded' | 'Wounded' | 'Bloodied' | 'Near Death';

export function getMonsterHealthDescriptor(currentHp: number, maxHp: number): MonsterHealthDescriptor {
  if (maxHp <= 0) return 'Near Death';
  const pct = currentHp / maxHp;
  if (pct >= 1) return 'Uninjured';
  if (pct >= 0.75) return 'Barely Wounded';
  if (pct >= 0.5) return 'Wounded';
  if (pct >= 0.25) return 'Bloodied';
  return 'Near Death';
}

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
  inventory: { gold: 200, items: [], load: "Light" },
  journal: []
};