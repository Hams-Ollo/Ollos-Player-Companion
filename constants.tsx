import { CharacterData, StatKey, Skill } from './types';

// Helper to generate a unique ID
export const generateId = () => Math.random().toString(36).substr(2, 9);

export const VESPER_DATA: CharacterData = {
  id: "vesper-default",
  campaign: "The Underdark Saga",
  name: "Vesper",
  nickname: "The Whisper",
  race: "Drow Elf",
  class: "Rogue",
  level: 1,
  portraitUrl: "https://picsum.photos/id/1062/400/400",
  stats: {
    STR: { score: 8, modifier: -1, save: -1, proficientSave: false },
    DEX: { score: 18, modifier: +4, save: +6, proficientSave: true },
    CON: { score: 14, modifier: +2, save: +2, proficientSave: false },
    INT: { score: 12, modifier: +1, save: +3, proficientSave: true },
    WIS: { score: 10, modifier: +0, save: +0, proficientSave: false },
    CHA: { score: 15, modifier: +2, save: +2, proficientSave: false },
  },
  hp: { current: 10, max: 10 },
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
  inventory: {
    gold: 15,
    items: [
      { name: "Leather Armor", quantity: 1, notes: "AC 11 + Dex" },
      { name: "Thieves' Tools", quantity: 1 },
      { name: "Dagger", quantity: 2 },
      { name: "Shortbow", quantity: 1 },
      { name: "Arrows", quantity: 20 },
      { name: "Burglar's Pack", quantity: 1 },
    ],
    load: "Light"
  }
};

export const createNewCharacter = (name: string, race: string, charClass: string): CharacterData => {
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

  return {
    id: generateId(),
    campaign: "New Campaign",
    name: name || "Unknown Hero",
    nickname: "",
    race: race || "Human",
    class: charClass || "Fighter",
    level: 1,
    portraitUrl: "https://picsum.photos/400/400?grayscale", // Default grayscale until generated
    stats: {
      STR: { score: 10, modifier: 0, save: 0, proficientSave: false },
      DEX: { score: 10, modifier: 0, save: 0, proficientSave: false },
      CON: { score: 10, modifier: 0, save: 0, proficientSave: false },
      INT: { score: 10, modifier: 0, save: 0, proficientSave: false },
      WIS: { score: 10, modifier: 0, save: 0, proficientSave: false },
      CHA: { score: 10, modifier: 0, save: 0, proficientSave: false },
    },
    hp: { current: 10, max: 10 },
    ac: 10,
    initiative: 0,
    speed: 30,
    passivePerception: 10,
    skills: defaultSkills,
    attacks: [
      { name: "Unarmed Strike", bonus: 2, damage: "1", type: "Bludgeoning" }
    ],
    features: [],
    inventory: {
      gold: 0,
      items: [],
      load: "Light"
    }
  };
};
