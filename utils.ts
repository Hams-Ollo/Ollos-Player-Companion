import { CharacterData, Item, Attack } from './types';

// ==========================================
// Rate Limiter — Multi-layer Client-side Protection
// ==========================================
// Obfuscated storage keys to discourage casual tampering
const _RL_MINUTE_KEY = '_app_rl_m';
const _RL_DAILY_KEY = '_app_rl_d';
const _RL_SESSION_KEY = '_app_rl_s';

// Limits
const MINUTE_WINDOW_MS = 60000;
const MAX_PER_MINUTE = 10;
const MAX_PER_DAY = 300;

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

export const checkRateLimit = (): void => {
  const now = Date.now();
  const today = getToday();

  // --- Layer 1: Per-minute sliding window ---
  let timestamps: number[] = safeJsonParse(localStorage.getItem(_RL_MINUTE_KEY), []);
  timestamps = timestamps.filter(t => now - t < MINUTE_WINDOW_MS);

  if (timestamps.length >= MAX_PER_MINUTE) {
    const oldest = timestamps[0];
    const waitTime = Math.ceil((MINUTE_WINDOW_MS - (now - oldest)) / 1000);
    throw new Error(`Rate limit reached. Please wait ${waitTime} seconds before trying again.`);
  }

  // --- Layer 2: Daily cap ---
  let daily: { date: string; count: number } = safeJsonParse(
    localStorage.getItem(_RL_DAILY_KEY),
    { date: today, count: 0 }
  );

  if (daily.date !== today) {
    daily = { date: today, count: 0 };
  }

  if (daily.count >= MAX_PER_DAY) {
    throw new Error('Daily request limit reached. Limits reset at midnight. Please try again tomorrow.');
  }

  // --- Layer 3: Session tamper detection ---
  const sessionCount: number = safeJsonParse(sessionStorage.getItem(_RL_SESSION_KEY), 0);
  if (sessionCount > daily.count + 5) {
    throw new Error('Rate limit error. Please reload the page.');
  }

  // --- All checks passed — record the request ---
  timestamps.push(now);
  daily.count += 1;

  localStorage.setItem(_RL_MINUTE_KEY, JSON.stringify(timestamps));
  localStorage.setItem(_RL_DAILY_KEY, JSON.stringify(daily));
  sessionStorage.setItem(_RL_SESSION_KEY, JSON.stringify(sessionCount + 1));
};

/**
 * Returns current rate limit status for UI display.
 */
export const getRateLimitStatus = (): { minuteUsed: number; dailyUsed: number; dailyMax: number } => {
  const now = Date.now();
  const today = getToday();
  const timestamps: number[] = safeJsonParse(localStorage.getItem(_RL_MINUTE_KEY), []);
  const minuteUsed = timestamps.filter(t => now - t < MINUTE_WINDOW_MS).length;
  const daily: { date: string; count: number } = safeJsonParse(
    localStorage.getItem(_RL_DAILY_KEY),
    { date: today, count: 0 }
  );
  return {
    minuteUsed,
    dailyUsed: daily.date === today ? daily.count : 0,
    dailyMax: MAX_PER_DAY,
  };
};

// ==========================================
// Game Logic Utilities
// ==========================================

/**
 * Recalculates Derived Stats (AC, Attacks) based on stats and equipment
 */
export const recalculateCharacterStats = (char: CharacterData): CharacterData => {
  const newData = { ...char };
  const { DEX, STR } = char.stats;
  const profBonus = Math.ceil(1 + (char.level / 4));

  // 1. Calculate AC
  let baseAC = 10;
  let dexBonus = DEX.modifier;
  let shieldBonus = 0;
  let armorName = "Unarmored";

  const armor = char.inventory.items.find(i => i.equipped && i.type === 'Armor' && i.name !== 'Shield');
  const shield = char.inventory.items.find(i => i.equipped && i.name === 'Shield');

  if (shield) shieldBonus = 2;

  if (armor) {
    armorName = armor.name.toLowerCase();
    // Rudimentary Armor Type Detection based on SRD names
    if (armorName.includes('leather') || armorName.includes('padded')) {
      // Light Armor: AC + Dex
      baseAC = armor.armorClass || (armorName.includes('studded') ? 12 : 11);
    } else if (armorName.includes('hide') || armorName.includes('chain shirt') || armorName.includes('scale') || armorName.includes('breastplate') || armorName.includes('half')) {
      // Medium Armor: AC + Dex (max 2)
      baseAC = armor.armorClass || (armorName.includes('hide') ? 12 : armorName.includes('half') ? 15 : 14);
      dexBonus = Math.min(2, DEX.modifier);
    } else if (armorName.includes('ring') || armorName.includes('chain') || armorName.includes('splint') || armorName.includes('plate')) {
      // Heavy Armor: Flat AC
      baseAC = armor.armorClass || (armorName.includes('plate') ? 18 : armorName.includes('chain') ? 16 : 14);
      dexBonus = 0;
    }
  } else {
    // Unarmored Defense checks (Monk/Barbarian) could go here
    if (char.class === 'Barbarian') dexBonus += char.stats.CON.modifier;
    if (char.class === 'Monk') dexBonus += char.stats.WIS.modifier;
  }

  newData.ac = baseAC + dexBonus + shieldBonus;

  // 2. Generate Attacks from Equipped Weapons
  const newAttacks: Attack[] = [];
  
  // Always add Unarmed Strike
  const unarmedDmg = 1 + STR.modifier;
  newAttacks.push({
    name: "Unarmed Strike",
    bonus: STR.modifier + profBonus,
    damage: `${Math.max(1, unarmedDmg)}`,
    type: "Bludgeoning",
    range: "5",
    properties: []
  });

  // Equipped Weapons
  char.inventory.items.filter(i => i.equipped && i.type === 'Weapon').forEach(w => {
    const isFinesse = w.notes?.toLowerCase().includes('finesse');
    const isRanged = w.notes?.toLowerCase().includes('range') || w.name.includes('bow') || w.name.includes('crossbow');
    
    // Determine Stat: Dex if Finesse/Ranged AND Dex > Str
    const useDex = isRanged || (isFinesse && DEX.score > STR.score);
    const mod = useDex ? DEX.modifier : STR.modifier;
    
    // Parse Damage (Assume it's in notes like "1d8 slashing")
    // Simple regex to extract "1d8" or "2d6"
    const dmgMatch = w.notes?.match(/(\d+d\d+)/);
    const baseDmg = dmgMatch ? dmgMatch[0] : "1d4"; // Default fallback
    
    const dmgTypeMatch = w.notes?.match(/(slashing|piercing|bludgeoning)/i);
    const dmgType = dmgTypeMatch ? dmgTypeMatch[0] : "Damage";

    newAttacks.push({
      name: w.name,
      bonus: mod + profBonus, // Assuming proficiency with equipped weapons
      damage: `${baseDmg}${mod >= 0 ? '+' : ''}${mod}`,
      type: dmgType,
      range: isRanged ? "80/320" : "5", // Simplified
      properties: w.notes ? [w.notes] : []
    });
  });

  newData.attacks = newAttacks;

  return newData;
};