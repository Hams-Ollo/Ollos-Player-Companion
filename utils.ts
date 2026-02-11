import { CharacterData, StatKey, Attack } from './types';

let lastCall = 0;
export const checkRateLimit = () => {
  const now = Date.now();
  if (now - lastCall < 2000) throw new Error("Slow down, adventurer! The Weave needs a moment to settle.");
  lastCall = now;
};

export const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

export const recalculateCharacterStats = (data: CharacterData): CharacterData => {
  const profBonus = Math.ceil(data.level / 4) + 1;
  
  // 1. Update AC based on equipped gear
  let ac = 10 + data.stats.DEX.modifier;
  const armor = data.inventory.items.find(i => i.type === 'Armor' && i.equipped && i.name !== 'Shield');
  const shield = data.inventory.items.find(i => i.name === 'Shield' && i.equipped);
  
  if (armor) {
    if (armor.name.includes("Leather")) ac = 11 + data.stats.DEX.modifier;
    if (armor.name.includes("Studded")) ac = 12 + data.stats.DEX.modifier;
    if (armor.name.includes("Chain Shirt")) ac = 13 + Math.min(2, data.stats.DEX.modifier);
    if (armor.name.includes("Scale Mail")) ac = 14 + Math.min(2, data.stats.DEX.modifier);
    if (armor.name.includes("Plate")) ac = 18;
  }
  if (shield) ac += 2;

  // 2. Update Attacks based on equipped weapons
  // Fix: Explicitly typing as Attack[] prevents issues when pushing objects with optional fields missing
  const attacks: Attack[] = data.inventory.items
    .filter(i => i.type === 'Weapon' && i.equipped)
    .map(w => {
        const isFinesse = w.notes?.toLowerCase().includes('finesse');
        const isRanged = w.notes?.toLowerCase().includes('range') || w.name.includes('Bow') || w.name.includes('Crossbow');
        const ability = (isFinesse || isRanged) ? 'DEX' : 'STR';
        const mod = data.stats[ability].modifier;
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
      attacks.push({ name: "Unarmed Strike", bonus: data.stats.STR.modifier + profBonus, damage: `1${data.stats.STR.modifier >= 0 ? '+' : ''}${data.stats.STR.modifier}`, type: "Bludgeoning" });
  }

  // 3. Update Passive Perception
  const perceptionSkill = data.skills.find(s => s.name === 'Perception');
  const passivePerception = 10 + (perceptionSkill?.modifier || data.stats.WIS.modifier);

  return {
    ...data,
    ac,
    attacks,
    passivePerception,
    initiative: data.stats.DEX.modifier
  };
};