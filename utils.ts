
import { CharacterData, StatKey, Attack, ProficiencyLevel, Skill, Stat } from './types';
import { DND_SKILLS, getSpellSlotsForLevel } from './constants';

let lastCall = 0;
export const checkRateLimit = () => {
  const now = Date.now();
  if (now - lastCall < 2000) throw new Error("Slow down, adventurer! The Weave needs a moment to settle.");
  lastCall = now;
};

export const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

/**
 * Recomputes all derived stats for a character sheet.
 * Use this after stat changes, level ups, or AI generation.
 * This function also acts as a "Sanitizer" to ensure data integrity.
 */
export const recalculateCharacterStats = (data: CharacterData): CharacterData => {
  if (!data) return data;
  
  // SANITY CHECK: Ensure basic structure exists
  const level = Number(data.level) || 1;
  const profBonus = Math.ceil(level / 4) + 1;
  
  // 1. Update individual Stat Modifiers and Saving Throws
  const stats: Record<StatKey, Stat> = data.stats || {} as any;
  const statKeys: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  
  statKeys.forEach(k => {
    if (!stats[k]) {
        stats[k] = { score: 10, modifier: 0, save: 0, proficientSave: false };
    }
    const score = Number(stats[k].score) || 10;
    const mod = calculateModifier(score);
    stats[k].score = score;
    stats[k].modifier = mod;
    stats[k].save = mod + (stats[k].proficientSave ? profBonus : 0);
  });

  // 2. Update Skill Modifiers and Abilities
  const skills: Skill[] = (data.skills || []).map(skill => {
    const standardSkill = DND_SKILLS.find(s => s.name.toLowerCase() === skill.name.toLowerCase());
    const ability = standardSkill ? standardSkill.ability : (skill.ability || 'STR');
    const baseMod = stats[ability]?.modifier || 0;
    
    let totalMod = baseMod;
    if (skill.proficiency === 'proficient') totalMod += profBonus;
    if (skill.proficiency === 'expertise') totalMod += (profBonus * 2);

    return {
      name: skill.name || 'Unnamed Skill',
      ability,
      proficiency: skill.proficiency || 'none',
      modifier: totalMod
    };
  });

  // 3. Inventory & AC
  const inventory = data.inventory || { gold: 0, items: [], load: 'Light' };
  inventory.gold = Number(inventory.gold) || 0;
  inventory.items = Array.isArray(inventory.items) ? inventory.items : [];

  let ac = 10 + stats.DEX.modifier;
  const armor = inventory.items.find(i => i.type === 'Armor' && i.equipped && i.name !== 'Shield');
  const shield = inventory.items.find(i => i.name === 'Shield' && i.equipped);
  
  if (armor) {
    if (armor.name.includes("Leather")) ac = 11 + stats.DEX.modifier;
    else if (armor.name.includes("Studded")) ac = 12 + stats.DEX.modifier;
    else if (armor.name.includes("Chain Shirt")) ac = 13 + Math.min(2, stats.DEX.modifier);
    else if (armor.name.includes("Scale Mail")) ac = 14 + Math.min(2, stats.DEX.modifier);
    else if (armor.name.includes("Plate")) ac = 18;
  }
  if (shield) ac += 2;

  // 4. Update Attacks based on equipped weapons
  const attacks: Attack[] = inventory.items
    .filter(i => i.type === 'Weapon' && i.equipped)
    .map(w => {
        const isFinesse = w.notes?.toLowerCase().includes('finesse');
        const isRanged = w.notes?.toLowerCase().includes('range') || w.name.includes('Bow') || w.name.includes('Crossbow');
        const ability = (isFinesse || isRanged) ? 'DEX' : 'STR';
        const mod = stats[ability]?.modifier || 0;
        const damageMatch = w.notes?.match(/(\d+d\d+)/);
        const damageDice = damageMatch ? damageMatch[1] : '1d4';
        
        return {
            name: w.name,
            bonus: mod + profBonus,
            damage: `${damageDice}${mod >= 0 ? '+' : ''}${mod}`,
            type: w.notes?.split(' ')[1] || 'Physical',
            range: w.notes?.match(/Range (\d+\/\d+)/)?.[1],
            properties: w.notes?.split(', ')
        };
    });

  if (attacks.length === 0) {
      attacks.push({ 
        name: "Unarmed Strike", 
        bonus: (stats.STR?.modifier || 0) + profBonus, 
        damage: `1${(stats.STR?.modifier || 0) >= 0 ? '+' : ''}${(stats.STR?.modifier || 0)}`, 
        type: "Bludgeoning" 
      });
  }

  // 5. Update Spell Slots
  let spellSlots = Array.isArray(data.spellSlots) ? data.spellSlots : [];
  if (spellSlots.length === 0 && data.class) {
      spellSlots = getSpellSlotsForLevel(data.class, level).map(s => ({
          level: s.level,
          max: s.max,
          current: s.max
      }));
  }

  // 6. Final Vitals
  const perceptionSkill = skills.find(s => s.name === 'Perception');
  const passivePerception = 10 + (perceptionSkill?.modifier || stats.WIS?.modifier || 0);
  
  const currentHp = Number(data.hp?.current) || 10;
  const maxHp = Number(data.hp?.max) || 10;

  return {
    ...data,
    level,
    stats,
    skills,
    ac,
    attacks,
    spellSlots,
    inventory,
    passivePerception,
    hp: { current: currentHp, max: maxHp },
    hitDice: data.hitDice || { current: 1, max: 1, die: '1d8' },
    initiative: stats.DEX?.modifier || 0,
    journal: Array.isArray(data.journal) ? data.journal : [],
    features: Array.isArray(data.features) ? data.features : [],
    spells: Array.isArray(data.spells) ? data.spells : [],
  };
};
