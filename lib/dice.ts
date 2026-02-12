/**
 * Shared dice rolling utility module.
 * Extracted from Dashboard.handleRoll() and RestModal.handleSpendHitDie()
 * to provide a single reusable API for all dice operations.
 */

import { DiceGroup, RollResult, RollMode } from '../types';

// ─── Parsing ─────────────────────────────────────────────────────────────────

export interface ParsedDicePart {
  type: 'dice' | 'modifier';
  /** Number of dice (for type 'dice') */
  count?: number;
  /** Die sides (for type 'dice') */
  sides?: number;
  /** Sign multiplier: 1 or -1 */
  sign: number;
  /** Flat modifier value (for type 'modifier') */
  value?: number;
}

/**
 * Tokenises a dice expression like "2d6+1d4+2" or "1d20-3" into structured parts.
 * Handles expressions with implicit leading positive sign.
 */
export function parseDiceExpression(expression: string): ParsedDicePart[] {
  const cleaned = expression.replace(/\s+/g, '');
  const tokens = cleaned.split(/(?=[+-])/);
  const parts: ParsedDicePart[] = [];

  tokens.forEach(token => {
    const diceMatch = token.match(/^([+-]?\d+)?d(\d+)$/i);
    const modMatch = token.match(/^([+-]\d+)$/);

    if (diceMatch) {
      const sign = token.startsWith('-') ? -1 : 1;
      const count = Math.abs(parseInt(diceMatch[1])) || 1;
      const sides = parseInt(diceMatch[2]);
      parts.push({ type: 'dice', count, sides, sign });
    } else if (modMatch) {
      parts.push({ type: 'modifier', sign: 1, value: parseInt(modMatch[1]) });
    } else if (!token.includes('d')) {
      const val = parseInt(token);
      if (!isNaN(val)) {
        parts.push({ type: 'modifier', sign: 1, value: val });
      }
    }
  });

  return parts;
}

// ─── Rolling ─────────────────────────────────────────────────────────────────

/** Roll a single die returning a value between 1 and `sides` inclusive. */
export function rollSingleDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll a full dice expression (e.g. "2d6+1d4+2") with an optional base modifier
 * and advantage/disadvantage mode (applies to d20 rolls only).
 */
export function rollDice(
  expression: string,
  baseModifier: number = 0,
  mode: RollMode = 'normal'
): RollResult {
  const parts = parseDiceExpression(expression);
  const diceGroups: DiceGroup[] = [];
  let total = 0;
  let finalModifier = baseModifier;

  parts.forEach(part => {
    if (part.type === 'dice') {
      const { count = 1, sides = 6, sign } = part;
      const rolls: number[] = [];

      // Advantage / disadvantage only applies to a single d20
      if (sides === 20 && count === 1 && mode !== 'normal') {
        const r1 = rollSingleDie(20);
        const r2 = rollSingleDie(20);

        if (mode === 'advantage') {
          const high = Math.max(r1, r2);
          const low = Math.min(r1, r2);
          rolls.push(high);
          total += high * sign;
          diceGroups.push({ sides, rolls: [high], dropped: low });
        } else {
          // disadvantage
          const high = Math.max(r1, r2);
          const low = Math.min(r1, r2);
          rolls.push(low);
          total += low * sign;
          diceGroups.push({ sides, rolls: [low], dropped: high });
        }
      } else {
        for (let i = 0; i < count; i++) {
          const roll = rollSingleDie(sides);
          rolls.push(roll);
          total += roll * sign;
        }
        diceGroups.push({ sides, rolls });
      }
    } else if (part.type === 'modifier' && part.value !== undefined) {
      finalModifier += part.value;
    }
  });

  total += finalModifier;

  return {
    label: '',
    total,
    expression,
    diceGroups,
    modifier: finalModifier,
    mode,
  };
}

/**
 * Roll a single hit die (e.g. "d8") and return the raw roll and total with CON modifier.
 * Used by short rest hit die spending.
 */
export function rollHitDie(dieSides: number, conModifier: number): { roll: number; total: number } {
  const roll = rollSingleDie(dieSides);
  const total = Math.max(0, roll + conModifier);
  return { roll, total };
}

// ─── Batch Rolling ───────────────────────────────────────────────────────────

export interface BatchRollEntry {
  label: string;
  expression: string;
  baseModifier?: number;
  mode?: RollMode;
}

/**
 * Roll multiple dice expressions at once. Used for batch initiative rolling
 * (e.g. rolling initiative for all monsters in an encounter).
 */
export function rollBatch(entries: BatchRollEntry[]): RollResult[] {
  return entries.map(entry => {
    const result = rollDice(
      entry.expression,
      entry.baseModifier ?? 0,
      entry.mode ?? 'normal'
    );
    return { ...result, label: entry.label };
  });
}
