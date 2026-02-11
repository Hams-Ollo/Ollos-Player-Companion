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
 * This function also acts as a "Sanitizer" to ensure data integrity and prevent crashes.
 */
export const recalculateCharacterStats = (data: CharacterData): CharacterData => {
  if (!data) return data;
  
  // 1. Level & Proficiency
  const level = Math.max(1, Number(data.level) || 1);
  const profBonus = Math.ceil(level / 4) + 1;
  
  // 2. Stats & Saves - Ensure stats object exists
  const stats: Record<StatKey, Stat> = {} as any;
  const statKeys: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  
  statKeys.forEach(k => {
    const sourceStat = (data.stats && data.stats[k]) ? data.stats[k] : { score: 10, proficientSave: false };
    const score = Number(sourceStat.score) || 10;
    const mod = calculateModifier(score);
    stats[k] = {
        score,
        modifier: mod,
        proficientSave: !!sourceStat.proficientSave,
        save: mod + (sourceStat.proficientSave ? profBonus : 0)
    };
  });

  // 3. Skills - Ensure skills array exists
  const skills: Skill[] = (Array.isArray(data.skills) ? data.skills : []).map(skill => {
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

  // 4. Inventory, Gold & AC
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

  // 5. Attacks
  const attacks: Attack[] = inventory.items
    .filter(i => i.type === 'Weapon' && i.equipped)
    .map(w => {
        const isFinesse = w.notes?.toLowerCase().includes('finesse');
        const isRanged = w.notes?.toLowerCase().includes('range') || w.name.includes('Bow') || w.name.includes('Crossbow');
        const ability = (isFinesse || isRanged) ? 'DEX' : 'STR';
        const mod = stats[ability]?.modifier || 0;
        const damageDice = w.notes?.match(/(\d+d\d+)/)?.[1] || '1d4';
        
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
        bonus: stats.STR.modifier + profBonus, 
        damage: `1${stats.STR.modifier >= 0 ? '+' : ''}${stats.STR.modifier}`, 
        type: "Bludgeoning" 
      });
  }

  // 6. Spell Slots
  let spellSlots = Array.isArray(data.spellSlots) ? data.spellSlots : [];
  if ((spellSlots.length === 0 || spellSlots.every(s => s.max === 0)) && data.class) {
      spellSlots = getSpellSlotsForLevel(data.class, level).map(s => ({
          level: s.level,
          max: s.max,
          current: s.max
      }));
  }

  // 7. Vitals
  const perceptionSkill = skills.find(s => s.name === 'Perception');
  const passivePerception = 10 + (perceptionSkill?.modifier || stats.WIS.modifier);
  
  const hp = {
    current: Number(data.hp?.current) ?? 10,
    max: Number(data.hp?.max) ?? 10
  };

  return {
    ...data,
    id: data.id || `char-${Date.now()}`,
    name: data.name || 'Unknown Hero',
    level,
    stats,
    skills,
    ac: Number(ac) || 10,
    attacks,
    spellSlots,
    inventory,
    passivePerception,
    hp,
    hitDice: data.hitDice || { current: 1, max: 1, die: '1d8' },
    initiative: stats.DEX.modifier,
    journal: Array.isArray(data.journal) ? data.journal : [],
    features: Array.isArray(data.features) ? data.features : [],
    spells: Array.isArray(data.spells) ? data.spells : [],
  };
};