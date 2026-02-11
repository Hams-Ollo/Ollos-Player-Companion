import React, { useState, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, Dices, User, BookOpen, Sparkles, Loader2, Wand2, Plus, Minus } from 'lucide-react';
import { CharacterData, StatKey, Skill } from '../types';
import {
  generateId,
  getAllRaceOptions,
  DND_CLASSES,
  DND_BACKGROUNDS,
  DND_ALIGNMENTS,
  getClassData,
  getRaceSpeed,
  getRacialBonus,
  getRacialBonusDisplay,
  POINT_BUY_COSTS,
  POINT_BUY_TOTAL,
  POINT_BUY_MIN,
  POINT_BUY_MAX,
} from '../constants';
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit } from '../utils';

// ==========================================
// Types
// ==========================================

type StatMethod = 'standard' | 'pointbuy' | 'manual';

interface WizardState {
  // Step 1: Identity
  name: string;
  race: string;
  charClass: string;
  background: string;
  alignment: string;
  // Half-Elf bonus choices
  halfElfBonuses: StatKey[];
  // Step 2: Ability Scores
  statMethod: StatMethod;
  baseStats: Record<StatKey, number>;
  standardAssignment: Record<StatKey, number | null>;
  // Step 3: Character Concept
  appearance: string;
  backstory: string;
  motivations: string;
  keyNPCs: string;
}

const INITIAL_STATE: WizardState = {
  name: '',
  race: '',
  charClass: '',
  background: '',
  alignment: '',
  halfElfBonuses: [],
  statMethod: 'standard',
  baseStats: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
  standardAssignment: { STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null },
  appearance: '',
  backstory: '',
  motivations: '',
  keyNPCs: '',
};

const STAT_KEYS: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const STEPS = [
  { label: 'Identity', icon: User },
  { label: 'Ability Scores', icon: Dices },
  { label: 'Character Concept', icon: BookOpen },
  { label: 'Review & Forge', icon: Sparkles },
];

interface WizardProps {
  onCreate: (data: CharacterData) => void;
  onClose: () => void;
}

// ==========================================
// Step Indicator
// ==========================================

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-1 px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
    {STEPS.map((step, idx) => {
      const Icon = step.icon;
      const isActive = idx === currentStep;
      const isDone = idx < currentStep;
      return (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <div className={`h-px w-8 ${isDone ? 'bg-amber-500' : 'bg-zinc-700'}`} />
          )}
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold transition-colors ${
            isActive ? 'bg-amber-600/20 text-amber-400 border border-amber-600/40' :
            isDone ? 'text-amber-500' : 'text-zinc-600'
          }`}>
            <Icon size={14} />
            <span className="hidden sm:inline">{step.label}</span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

// ==========================================
// Step 1: Identity
// ==========================================

const StepIdentity: React.FC<{
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, onChange }) => {
  const raceOptions = getAllRaceOptions();
  const selectedClassData = state.charClass ? getClassData(state.charClass) : null;
  const racialDisplay = state.race ? getRacialBonusDisplay(state.race) : '';

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Who Are You?</h2>
        <p className="text-zinc-500 text-sm mt-1">Define your hero's identity</p>
      </div>

      <div>
        <label htmlFor="wizard-name" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Name</label>
        <input
          id="wizard-name"
          autoFocus
          type="text"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 md:p-4 text-white text-sm md:text-base focus:outline-none focus:border-amber-500 mt-1"
          value={state.name}
          onChange={e => onChange({ name: e.target.value })}
          placeholder="e.g. Valeros the Bold"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="wizard-race" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Race</label>
          <select
            id="wizard-race"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 mt-1 appearance-none cursor-pointer"
            value={state.race}
            onChange={e => onChange({ race: e.target.value, halfElfBonuses: [] })}
          >
            <option value="" disabled>Select race...</option>
            {raceOptions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {state.race && (
            <div className="mt-1.5 text-xs text-amber-400/80">
              {racialDisplay}
              {state.race === 'Half-Elf' && <span className="text-zinc-500"> + 1 to two others</span>}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="wizard-class" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Class</label>
          <select
            id="wizard-class"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 mt-1 appearance-none cursor-pointer"
            value={state.charClass}
            onChange={e => onChange({ charClass: e.target.value })}
          >
            <option value="" disabled>Select class...</option>
            {DND_CLASSES.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
          {selectedClassData && (
            <div className="mt-1.5 text-xs text-amber-400/80">
              d{selectedClassData.hitDie} HD &middot; Saves: {selectedClassData.savingThrows.join(', ')}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="wizard-background" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Background</label>
          <select
            id="wizard-background"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 mt-1 appearance-none cursor-pointer"
            value={state.background}
            onChange={e => onChange({ background: e.target.value })}
          >
            <option value="" disabled>Select background...</option>
            {DND_BACKGROUNDS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="wizard-alignment" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Alignment</label>
          <select
            id="wizard-alignment"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 mt-1 appearance-none cursor-pointer"
            value={state.alignment}
            onChange={e => onChange({ alignment: e.target.value })}
          >
            <option value="" disabled>Select alignment...</option>
            {DND_ALIGNMENTS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Step 2: Ability Scores
// ==========================================

const StepAbilityScores: React.FC<{
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, onChange }) => {
  const { statMethod, baseStats, standardAssignment, race, halfElfBonuses } = state;

  // Point buy: calculate points spent
  const pointsSpent = useMemo(() => {
    if (statMethod !== 'pointbuy') return 0;
    return STAT_KEYS.reduce((sum, key) => sum + (POINT_BUY_COSTS[baseStats[key]] ?? 0), 0);
  }, [statMethod, baseStats]);

  const pointsRemaining = POINT_BUY_TOTAL - pointsSpent;

  // Standard array: unassigned values
  const assignedValues = Object.values(standardAssignment).filter(v => v !== null) as number[];
  const availableValues = STANDARD_ARRAY.filter(v => {
    const usedCount = assignedValues.filter(a => a === v).length;
    const totalCount = STANDARD_ARRAY.filter(s => s === v).length;
    return usedCount < totalCount;
  });

  // Get final score for a stat (base + racial)
  const getFinalScore = (stat: StatKey): number => {
    let base = 8;
    if (statMethod === 'standard') {
      base = standardAssignment[stat] ?? 8;
    } else {
      base = baseStats[stat];
    }
    let racialBonus = getRacialBonus(race, stat);
    if (race === 'Half-Elf' && halfElfBonuses.includes(stat)) {
      racialBonus += 1;
    }
    return base + racialBonus;
  };

  const getModifier = (score: number) => Math.floor((score - 10) / 2);
  const formatMod = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;

  // Point buy handlers
  const handlePointBuyChange = (stat: StatKey, delta: number) => {
    const current = baseStats[stat];
    const next = current + delta;
    if (next < POINT_BUY_MIN || next > POINT_BUY_MAX) return;
    const costDelta = (POINT_BUY_COSTS[next] ?? 0) - (POINT_BUY_COSTS[current] ?? 0);
    if (costDelta > pointsRemaining) return;
    onChange({ baseStats: { ...baseStats, [stat]: next } });
  };

  // Standard array handler
  const handleStandardAssign = (stat: StatKey, value: string) => {
    const numVal = value === '' ? null : parseInt(value);
    onChange({ standardAssignment: { ...standardAssignment, [stat]: numVal } });
  };

  // Manual entry handler
  const handleManualChange = (stat: StatKey, value: string) => {
    const num = parseInt(value) || 3;
    const clamped = Math.max(3, Math.min(20, num));
    onChange({ baseStats: { ...baseStats, [stat]: clamped } });
  };

  // Half-elf bonus toggle
  const toggleHalfElfBonus = (stat: StatKey) => {
    if (stat === 'CHA') return; // CHA already gets +2
    const current = [...halfElfBonuses];
    const idx = current.indexOf(stat);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else if (current.length < 2) {
      current.push(stat);
    }
    onChange({ halfElfBonuses: current });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Roll Your Fate</h2>
        <p className="text-zinc-500 text-sm mt-1">Choose how to determine your abilities</p>
      </div>

      {/* Method tabs */}
      <div className="flex gap-2">
        {(['standard', 'pointbuy', 'manual'] as StatMethod[]).map(method => (
          <button
            key={method}
            onClick={() => onChange({
              statMethod: method,
              baseStats: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
              standardAssignment: { STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null },
            })}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              statMethod === method
                ? 'bg-amber-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {method === 'standard' ? 'Standard Array' : method === 'pointbuy' ? 'Point Buy' : 'Manual Roll'}
          </button>
        ))}
      </div>

      {/* Point buy budget */}
      {statMethod === 'pointbuy' && (
        <div className={`p-3 rounded-lg border text-center text-sm font-bold ${
          pointsRemaining === 0 ? 'bg-green-900/10 border-green-900/50 text-green-400' :
          pointsRemaining < 0 ? 'bg-red-900/10 border-red-900/50 text-red-400' :
          'bg-amber-900/10 border-amber-900/30 text-amber-300'
        }`}>
          {pointsRemaining} / {POINT_BUY_TOTAL} points remaining
        </div>
      )}

      {/* Standard array available values */}
      {statMethod === 'standard' && (
        <div className="flex gap-2 justify-center flex-wrap">
          {STANDARD_ARRAY.map((val, idx) => {
            const isUsed = assignedValues.filter(a => a === val).length >
              STANDARD_ARRAY.slice(0, idx).filter(s => s === val).length
              ? false
              : assignedValues.includes(val) && assignedValues.filter(a => a === val).length >=
                STANDARD_ARRAY.filter(s => s === val).length;
            return (
              <span key={idx} className={`px-3 py-1 rounded-full text-sm font-bold border ${
                assignedValues.filter(a => a === val).length >= STANDARD_ARRAY.filter(s => s === val).length
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-600 line-through'
                  : 'bg-amber-900/20 border-amber-600/40 text-amber-400'
              }`}>
                {val}
              </span>
            );
          })}
        </div>
      )}

      {/* Half-Elf bonus picker */}
      {race === 'Half-Elf' && (
        <div className="p-3 bg-purple-900/10 border border-purple-900/30 rounded-lg">
          <p className="text-xs font-bold text-purple-400 mb-2">Half-Elf: Choose 2 abilities for +1 bonus (CHA already gets +2)</p>
          <div className="flex gap-2 flex-wrap">
            {STAT_KEYS.filter(s => s !== 'CHA').map(stat => (
              <button
                key={stat}
                onClick={() => toggleHalfElfBonus(stat)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  halfElfBonuses.includes(stat)
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-purple-500'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stat rows */}
      <div className="space-y-2">
        {STAT_KEYS.map(stat => {
          const finalScore = getFinalScore(stat);
          const mod = getModifier(finalScore);
          let racialBonus = getRacialBonus(race, stat);
          if (race === 'Half-Elf' && halfElfBonuses.includes(stat)) racialBonus += 1;

          return (
            <div key={stat} className="flex items-center gap-3 bg-zinc-800/50 rounded-lg p-3">
              <span className="w-10 text-sm font-bold text-zinc-300">{stat}</span>

              {/* Input area depends on method */}
              {statMethod === 'standard' && (
                <select
                  className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500 appearance-none cursor-pointer text-center"
                  value={standardAssignment[stat] ?? ''}
                  onChange={e => handleStandardAssign(stat, e.target.value)}
                  aria-label={`Assign score for ${stat}`}
                >
                  <option value="">—</option>
                  {STANDARD_ARRAY.filter(v => {
                    // Show values that are either unassigned or already assigned to THIS stat
                    const currentVal = standardAssignment[stat];
                    if (currentVal === v) return true;
                    return availableValues.includes(v);
                  }).sort((a, b) => b - a).map((v, i) => (
                    <option key={`${v}-${i}`} value={v}>{v}</option>
                  ))}
                </select>
              )}

              {statMethod === 'pointbuy' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePointBuyChange(stat, -1)}
                    disabled={baseStats[stat] <= POINT_BUY_MIN}
                    className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Decrease ${stat}`}
                    title={`Decrease ${stat}`}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-white">{baseStats[stat]}</span>
                  <button
                    onClick={() => handlePointBuyChange(stat, 1)}
                    disabled={baseStats[stat] >= POINT_BUY_MAX || pointsRemaining <= 0}
                    className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Increase ${stat}`}
                    title={`Increase ${stat}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}

              {statMethod === 'manual' && (
                <input
                  type="number"
                  min={3}
                  max={20}
                  className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-amber-500 text-center"
                  value={baseStats[stat]}
                  onChange={e => handleManualChange(stat, e.target.value)}
                  aria-label={`${stat} score`}
                />
              )}

              {/* Racial bonus */}
              {racialBonus > 0 && (
                <span className="text-xs text-amber-400 font-bold">+{racialBonus}</span>
              )}

              {/* Arrow */}
              <ChevronRight size={14} className="text-zinc-600" />

              {/* Final score + modifier */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-lg font-bold text-white w-8 text-center">{finalScore}</span>
                <span className={`text-sm font-bold w-8 text-center ${mod >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatMod(mod)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// Step 3: Character Concept
// ==========================================

const StepConcept: React.FC<{
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, onChange }) => (
  <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
    <div className="text-center mb-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Tell Your Story</h2>
      <p className="text-zinc-500 text-sm mt-1">Flesh out your character — these power AI portrait & DM features</p>
    </div>

    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Appearance</label>
      <textarea
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 mt-1 resize-none h-20"
        value={state.appearance}
        onChange={e => onChange({ appearance: e.target.value })}
        placeholder="Silver hair in a loose braid, pale violet eyes, dark leather armor with spider-silk embroidery..."
      />
      <p className="text-xs text-zinc-600 mt-1">Used to generate your character portrait</p>
    </div>

    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Backstory</label>
      <textarea
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 mt-1 resize-none h-28"
        value={state.backstory}
        onChange={e => onChange({ backstory: e.target.value })}
        placeholder="Raised in the Underdark, exiled for refusing to serve Lolth. Found sanctuary with surface elves..."
      />
    </div>

    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Motivations & Bonds</label>
      <textarea
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 mt-1 resize-none h-20"
        value={state.motivations}
        onChange={e => onChange({ motivations: e.target.value })}
        placeholder="Seeking redemption on the surface. Loyal to those who show trust. Fears returning to the dark..."
      />
    </div>

    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Key NPCs</label>
      <textarea
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 mt-1 resize-none h-20"
        value={state.keyNPCs}
        onChange={e => onChange({ keyNPCs: e.target.value })}
        placeholder="Mentor: Kael, a blind surface elf ranger. Rival: Zarra, a Drow priestess..."
      />
    </div>

    <div className="p-3 bg-zinc-800/50 rounded-lg text-xs text-zinc-500 italic">
      All fields are optional — you can fill them in later. But the more detail you provide, the richer your AI-generated portrait and DM interactions will be.
    </div>
  </div>
);

// ==========================================
// Step 4: Review & Forge
// ==========================================

const StepReview: React.FC<{
  state: WizardState;
  forging: boolean;
  forgeError: string | null;
}> = ({ state, forging, forgeError }) => {
  const classData = getClassData(state.charClass);

  const getFinalScore = (stat: StatKey): number => {
    let base = 8;
    if (state.statMethod === 'standard') {
      base = state.standardAssignment[stat] ?? 8;
    } else {
      base = state.baseStats[stat];
    }
    let racialBonus = getRacialBonus(state.race, stat);
    if (state.race === 'Half-Elf' && state.halfElfBonuses.includes(stat)) racialBonus += 1;
    return base + racialBonus;
  };

  const getModifier = (score: number) => Math.floor((score - 10) / 2);
  const formatMod = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">
          {forging ? 'Forging Your Destiny...' : 'Review & Forge'}
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          {forging ? 'The Artificer is conjuring your portrait...' : 'Verify your character before creation'}
        </p>
      </div>

      {forging && (
        <div className="flex flex-col items-center py-10 gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-amber-900/20 border-2 border-amber-600/40 flex items-center justify-center animate-pulse">
              <Wand2 size={32} className="text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <p className="text-amber-400 font-display font-bold text-lg">Conjuring Portrait...</p>
          <p className="text-zinc-500 text-xs">This may take a moment</p>
        </div>
      )}

      {forgeError && (
        <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-xs">
          {forgeError} — Character will be created with a default portrait.
        </div>
      )}

      {!forging && (
        <>
          {/* Identity summary */}
          <div className="bg-zinc-800/50 rounded-xl p-4 space-y-2">
            <h3 className="font-display font-bold text-amber-400 text-lg">{state.name || 'Unnamed Hero'}</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-zinc-900 rounded-full text-zinc-300 border border-zinc-700">{state.race}</span>
              <span className="px-2 py-1 bg-zinc-900 rounded-full text-zinc-300 border border-zinc-700">{state.charClass}</span>
              <span className="px-2 py-1 bg-zinc-900 rounded-full text-zinc-300 border border-zinc-700">{state.background}</span>
              <span className="px-2 py-1 bg-zinc-900 rounded-full text-zinc-300 border border-zinc-700">{state.alignment}</span>
            </div>
            {classData && (
              <p className="text-xs text-zinc-500">d{classData.hitDie} Hit Die &middot; Speed: {getRaceSpeed(state.race)}ft</p>
            )}
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-6 gap-2">
            {STAT_KEYS.map(stat => {
              const score = getFinalScore(stat);
              const mod = getModifier(score);
              return (
                <div key={stat} className="bg-zinc-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs font-bold text-zinc-500">{stat}</div>
                  <div className="text-lg font-bold text-white">{score}</div>
                  <div className={`text-xs font-bold ${mod >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatMod(mod)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Concept summary */}
          {(state.appearance || state.backstory || state.motivations || state.keyNPCs) && (
            <div className="bg-zinc-800/50 rounded-xl p-4 space-y-3">
              {state.appearance && (
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Appearance</span>
                  <p className="text-sm text-zinc-300 mt-1">{state.appearance}</p>
                </div>
              )}
              {state.backstory && (
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Backstory</span>
                  <p className="text-sm text-zinc-300 mt-1 line-clamp-3">{state.backstory}</p>
                </div>
              )}
              {state.motivations && (
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Motivations</span>
                  <p className="text-sm text-zinc-300 mt-1">{state.motivations}</p>
                </div>
              )}
              {state.keyNPCs && (
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Key NPCs</span>
                  <p className="text-sm text-zinc-300 mt-1">{state.keyNPCs}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ==========================================
// Main Wizard Component
// ==========================================

const CharacterCreationWizard: React.FC<WizardProps> = ({ onCreate, onClose }) => {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>({ ...INITIAL_STATE });
  const [forging, setForging] = useState(false);
  const [forgeError, setForgeError] = useState<string | null>(null);

  const handleChange = (updates: Partial<WizardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Validation per step
  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return !!(state.name && state.race && state.charClass && state.background && state.alignment);
      case 1: {
        if (state.statMethod === 'standard') {
          return STAT_KEYS.every(k => state.standardAssignment[k] !== null);
        }
        if (state.statMethod === 'pointbuy') {
          const spent = STAT_KEYS.reduce((s, k) => s + (POINT_BUY_COSTS[state.baseStats[k]] ?? 0), 0);
          return spent <= POINT_BUY_TOTAL;
        }
        return true; // manual is always valid
      }
      case 2:
        return true; // concept is optional
      case 3:
        return !forging;
      default:
        return false;
    }
  }, [step, state, forging]);

  // Half-Elf validation for step 1 (Ability Scores)
  const halfElfValid = state.race !== 'Half-Elf' || state.halfElfBonuses.length === 2;

  // Build final scores helper
  const getFinalScore = (stat: StatKey): number => {
    let base = 8;
    if (state.statMethod === 'standard') {
      base = state.standardAssignment[stat] ?? 8;
    } else {
      base = state.baseStats[stat];
    }
    let racialBonus = getRacialBonus(state.race, stat);
    if (state.race === 'Half-Elf' && state.halfElfBonuses.includes(stat)) racialBonus += 1;
    return base + racialBonus;
  };

  // Generate portrait via Gemini
  const generatePortrait = async (): Promise<string> => {
    checkRateLimit(); // Enforce rate limit
    if (!process.env.API_KEY) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const promptText = [
      `A high quality, high fantasy digital art portrait of a D&D character:`,
      `${state.race} ${state.charClass}.`,
      state.appearance ? state.appearance : '',
      `Aspect ratio 1:1. Dramatic lighting, detailed, painterly style.`
    ].filter(Boolean).join(' ');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: promptText }] },
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image generated");
  };

  // Forge the character
  const handleForge = async () => {
    setForging(true);
    setForgeError(null);

    let portraitUrl = 'https://picsum.photos/400/400?grayscale';

    // Try to generate portrait
    try {
      portraitUrl = await generatePortrait();
    } catch (err: any) {
      console.error("Portrait generation failed:", err);
      setForgeError(err.message || "Portrait generation failed");
    }

    // Build the character data
    const classData = getClassData(state.charClass);
    const hitDie = classData?.hitDie ?? 8;
    const speed = getRaceSpeed(state.race);
    const proficientSaves = classData?.savingThrows ?? ['STR', 'CON'];
    const profBonus = 2;

    const stats: Record<StatKey, { score: number; modifier: number; save: number; proficientSave: boolean }> = {} as any;
    STAT_KEYS.forEach(stat => {
      const score = getFinalScore(stat);
      const mod = Math.floor((score - 10) / 2);
      const isProficient = proficientSaves.includes(stat);
      stats[stat] = {
        score,
        modifier: mod,
        save: isProficient ? mod + profBonus : mod,
        proficientSave: isProficient,
      };
    });

    const conMod = stats.CON.modifier;
    const defaultSkills: Skill[] = [
      { name: "Acrobatics", ability: "DEX", modifier: stats.DEX.modifier, proficiency: "none" },
      { name: "Animal Handling", ability: "WIS", modifier: stats.WIS.modifier, proficiency: "none" },
      { name: "Arcana", ability: "INT", modifier: stats.INT.modifier, proficiency: "none" },
      { name: "Athletics", ability: "STR", modifier: stats.STR.modifier, proficiency: "none" },
      { name: "Deception", ability: "CHA", modifier: stats.CHA.modifier, proficiency: "none" },
      { name: "History", ability: "INT", modifier: stats.INT.modifier, proficiency: "none" },
      { name: "Insight", ability: "WIS", modifier: stats.WIS.modifier, proficiency: "none" },
      { name: "Intimidation", ability: "CHA", modifier: stats.CHA.modifier, proficiency: "none" },
      { name: "Investigation", ability: "INT", modifier: stats.INT.modifier, proficiency: "none" },
      { name: "Medicine", ability: "WIS", modifier: stats.WIS.modifier, proficiency: "none" },
      { name: "Nature", ability: "INT", modifier: stats.INT.modifier, proficiency: "none" },
      { name: "Perception", ability: "WIS", modifier: stats.WIS.modifier, proficiency: "none" },
      { name: "Performance", ability: "CHA", modifier: stats.CHA.modifier, proficiency: "none" },
      { name: "Persuasion", ability: "CHA", modifier: stats.CHA.modifier, proficiency: "none" },
      { name: "Religion", ability: "INT", modifier: stats.INT.modifier, proficiency: "none" },
      { name: "Sleight of Hand", ability: "DEX", modifier: stats.DEX.modifier, proficiency: "none" },
      { name: "Stealth", ability: "DEX", modifier: stats.DEX.modifier, proficiency: "none" },
      { name: "Survival", ability: "WIS", modifier: stats.WIS.modifier, proficiency: "none" },
    ];

    const character: CharacterData = {
      id: generateId(),
      campaign: "New Campaign",
      name: state.name || "Unknown Hero",
      nickname: "",
      race: state.race || "Human",
      class: state.charClass || "Fighter",
      background: state.background || undefined,
      alignment: state.alignment || undefined,
      level: 1,
      portraitUrl,
      stats,
      hp: { current: hitDie + conMod, max: hitDie + conMod },
      ac: 10 + stats.DEX.modifier,
      initiative: stats.DEX.modifier,
      speed,
      passivePerception: 10 + stats.WIS.modifier,
      skills: defaultSkills,
      attacks: [
        { name: "Unarmed Strike", bonus: stats.STR.modifier + profBonus, damage: "1", type: "Bludgeoning" }
      ],
      features: [],
      inventory: {
        gold: 0,
        items: [],
        load: "Light",
      },
      journal: [],
    };

    setForging(false);
    onCreate(character);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 animate-in fade-in">
      <div className="bg-zinc-900 sm:border border-zinc-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-hidden flex flex-col shadow-2xl h-[95vh] sm:h-auto sm:max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-amber-500 flex items-center gap-2">
            <Dices size={20} className="sm:w-6 sm:h-6" />
            Forge New Character
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1" aria-label="Close" title="Close"><X size={24} /></button>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Step Content */}
        <div className="flex-grow overflow-y-auto">
          {step === 0 && <StepIdentity state={state} onChange={handleChange} />}
          {step === 1 && <StepAbilityScores state={state} onChange={handleChange} />}
          {step === 2 && <StepConcept state={state} onChange={handleChange} />}
          {step === 3 && <StepReview state={state} forging={forging} forgeError={forgeError} />}
        </div>

        {/* Navigation */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/50 flex gap-3">
          {step > 0 && !forging && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          )}
          <div className="flex-grow" />
          {step < 3 && (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance || (step === 1 && !halfElfValid)}
              className="flex items-center gap-1 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={18} />
            </button>
          )}
          {step === 3 && !forging && (
            <button
              onClick={handleForge}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-900/20"
            >
              <Sparkles size={18} />
              Forge Character
            </button>
          )}
          {forging && (
            <div className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-amber-400 font-bold rounded-xl">
              <Loader2 className="animate-spin" size={18} />
              Forging...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationWizard;