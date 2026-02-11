
import React, { useState, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, Dices, User, BookOpen, Sparkles, Loader2, Plus, Minus, ShieldCheck, Zap, Star, Info } from 'lucide-react';
import { CharacterData, StatKey, Campaign, Skill, Stat } from '../types';
import TranscriptionButton from './TranscriptionButton';
import {
  generateId,
  getAllRaceOptions,
  DND_CLASSES,
  DND_BACKGROUNDS,
  DND_ALIGNMENTS,
  DND_SKILLS,
  getClassData,
  getRaceSpeed,
  getRacialBonus,
  getRacialBonusDisplay,
  POINT_BUY_COSTS,
  POINT_BUY_TOTAL,
  POINT_BUY_MIN,
  POINT_BUY_MAX,
  CLASS_CANTRIPS,
  CLASS_SPELLS_1ST,
  getCantripsKnownCount,
  getSpellsKnownCount,
  getSpellSlotsForLevel,
  getRaceTraits,
} from '../constants';
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit, recalculateCharacterStats, calculateModifier } from '../utils';

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
  campaign: string;
  halfElfBonuses: StatKey[];
  // Step 2: Ability Scores
  statMethod: StatMethod;
  baseStats: Record<StatKey, number>;
  standardAssignment: Record<StatKey, number | null>;
  // Step 3: Skills & Proficiencies
  selectedSkills: string[];
  selectedTools: string[];
  // Step 4: Initial Spells & Powers
  selectedPowers: string[];
  // Step 5: Character Concept
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
  campaign: '',
  halfElfBonuses: [],
  statMethod: 'standard',
  baseStats: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
  standardAssignment: { STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null },
  selectedSkills: [],
  selectedTools: [],
  selectedPowers: [],
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
  { label: 'Proficiencies', icon: ShieldCheck },
  { label: 'Spells & Powers', icon: Zap },
  { label: 'Concept', icon: BookOpen },
  { label: 'Review', icon: Sparkles },
];

interface WizardProps {
  campaigns: Campaign[];
  onCreate: (data: CharacterData) => void;
  onClose: () => void;
}

// ==========================================
// Components
// ==========================================

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-1 px-6 py-4 border-b border-zinc-800 bg-zinc-950/50 overflow-x-auto no-scrollbar">
    {STEPS.map((step, idx) => {
      const Icon = step.icon;
      const isActive = idx === currentStep;
      const isDone = idx < currentStep;
      return (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <div className={`h-px w-6 shrink-0 ${isDone ? 'bg-amber-500' : 'bg-zinc-700'}`} />
          )}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 ${
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

const StepIdentity: React.FC<{
  state: WizardState;
  campaigns: Campaign[];
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, campaigns, onChange }) => {
  const races = getAllRaceOptions();
  
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Identity</h2>
        <p className="text-zinc-500 text-sm mt-1">Tell us about your adventurer</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="wizard-name" className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Character Name</label>
          <input 
            id="wizard-name"
            type="text" 
            value={state.name}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="Enter name..."
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="wizard-race" className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Race</label>
            <select 
              id="wizard-race"
              value={state.race}
              onChange={e => onChange({ race: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Select Race...</option>
              {races.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="wizard-class" className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Class</label>
            <select 
              id="wizard-class"
              value={state.charClass}
              onChange={e => onChange({ charClass: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Select Class...</option>
              {DND_CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="wizard-background" className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Background</label>
            <select 
              id="wizard-background"
              value={state.background}
              onChange={e => onChange({ background: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Select Background...</option>
              {DND_BACKGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="wizard-alignment" className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Alignment</label>
            <select 
              id="wizard-alignment"
              value={state.alignment}
              onChange={e => onChange({ alignment: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Select Alignment...</option>
              {DND_ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="wizard-campaign" className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Campaign</label>
          <select 
            id="wizard-campaign"
            value={state.campaign}
            onChange={e => onChange({ campaign: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Select Campaign...</option>
            {campaigns.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            <option value="Solo Adventure">Solo Adventure</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const StepAbilityScores: React.FC<{
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, onChange }) => {
  const pointsSpent = useMemo(() => {
    if (state.statMethod !== 'pointbuy') return 0;
    return STAT_KEYS.reduce((sum, key) => sum + (POINT_BUY_COSTS[state.baseStats[key]] || 0), 0);
  }, [state.baseStats, state.statMethod]);

  const pointsRemaining = POINT_BUY_TOTAL - pointsSpent;

  const handlePointBuyChange = (key: StatKey, increment: boolean) => {
    const currentScore = state.baseStats[key];
    const nextScore = increment ? currentScore + 1 : currentScore - 1;
    
    if (nextScore < POINT_BUY_MIN || nextScore > POINT_BUY_MAX) return;

    const currentCost = POINT_BUY_COSTS[currentScore];
    const nextCost = POINT_BUY_COSTS[nextScore];
    const costDiff = nextCost - currentCost;

    if (increment && pointsRemaining < costDiff) return;

    onChange({ baseStats: { ...state.baseStats, [key]: nextScore } });
  };

  const handleManualStatChange = (key: StatKey, value: string) => {
    const score = Math.min(20, Math.max(1, parseInt(value) || 0));
    onChange({ baseStats: { ...state.baseStats, [key]: score } });
  };

  const handleStandardAssignment = (key: StatKey, value: number | null) => {
    const updated = { ...state.standardAssignment, [key]: value };
    onChange({ standardAssignment: updated });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Ability Scores</h2>
        <p className="text-zinc-500 text-sm mt-1">Determine your raw potential</p>
        
        <div className="flex justify-center gap-2 mt-4">
          {(['standard', 'pointbuy', 'manual'] as StatMethod[]).map(m => (
            <button
              key={m}
              onClick={() => onChange({ statMethod: m })}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-full border uppercase tracking-widest transition-all ${
                state.statMethod === m 
                ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/20' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {state.statMethod === 'pointbuy' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${pointsRemaining >= 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                <Info size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Points Remaining</span>
                <span className={`text-xl font-mono font-bold ${pointsRemaining < 0 ? 'text-red-500' : 'text-amber-500'}`}>
                  {pointsRemaining} / {POINT_BUY_TOTAL}
                </span>
              </div>
           </div>
           <div className="text-right">
              <span className="text-[10px] text-zinc-600 font-bold uppercase block">Max Base: 15</span>
              <span className="text-[10px] text-zinc-600 font-bold uppercase block">Min Base: 8</span>
           </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {STAT_KEYS.map(key => {
          const racialBonus = getRacialBonus(state.race, key);
          const baseScore = state.statMethod === 'standard' 
            ? (state.standardAssignment[key] ?? 8) 
            : state.baseStats[key];
          const totalScore = baseScore + racialBonus;
          const mod = calculateModifier(totalScore);

          return (
            <div key={key} className="bg-zinc-800 p-4 rounded-2xl border border-zinc-700 shadow-xl relative group hover:border-zinc-500 transition-all">
              <label className="text-[10px] font-bold text-zinc-500 uppercase block text-center mb-2 tracking-widest">{key}</label>
              
              <div className="flex flex-col items-center justify-center space-y-2">
                {state.statMethod === 'standard' ? (
                  <select
                    aria-label={`Select score for ${key}`}
                    value={state.standardAssignment[key] ?? ''}
                    onChange={e => handleStandardAssignment(key, e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2 text-sm font-bold text-white focus:outline-none focus:border-amber-500 text-center"
                  >
                    <option value="">--</option>
                    {STANDARD_ARRAY.map(val => {
                      const isUsedByOther = Object.entries(state.standardAssignment).some(([k, v]) => v === val && k !== key);
                      return (
                        <option key={val} value={val} disabled={isUsedByOther}>
                          {val} {isUsedByOther ? '(Used)' : ''}
                        </option>
                      );
                    })}
                  </select>
                ) : state.statMethod === 'pointbuy' ? (
                  <div className="flex items-center justify-between w-full">
                    <button 
                      onClick={() => handlePointBuyChange(key, false)}
                      className="p-1.5 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                      disabled={baseScore <= POINT_BUY_MIN}
                    >
                      <Minus size={14} />
                    </button>
                    <div className="text-center">
                        <span className="text-2xl font-display font-bold text-white">{baseScore}</span>
                        <div className="text-[9px] text-zinc-500 font-bold uppercase">Cost: {POINT_BUY_COSTS[baseScore]}</div>
                    </div>
                    <button 
                      onClick={() => handlePointBuyChange(key, true)}
                      className="p-1.5 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                      disabled={baseScore >= POINT_BUY_MAX || pointsRemaining < (POINT_BUY_COSTS[baseScore + 1] - POINT_BUY_COSTS[baseScore])}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ) : (
                   <input 
                      type="number"
                      value={baseScore}
                      onChange={(e) => handleManualStatChange(key, e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2 text-xl font-display font-bold text-white focus:outline-none focus:border-amber-500 text-center"
                   />
                )}

                <div className="flex items-center gap-2 pt-1">
                   <div className="text-xs bg-zinc-950 px-2 py-0.5 rounded text-zinc-400 font-bold">
                      MOD {mod >= 0 ? '+' : ''}{mod}
                   </div>
                   {racialBonus !== 0 && (
                     <div className="text-[10px] text-amber-500 font-bold">
                        +{racialBonus} Race
                     </div>
                   )}
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t border-zinc-700/50 flex justify-between items-center">
                <span className="text-[9px] font-bold text-zinc-500 uppercase">Total</span>
                <span className="text-sm font-display font-bold text-amber-400">{totalScore}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex gap-3 items-start">
        <Star size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500 leading-relaxed italic">
          Total Score = Base Score + Racial Bonus. Your Proficiency Bonus (+2) will be added to your skills and saves in the next step.
        </p>
      </div>
    </div>
  );
};

const StepSkills: React.FC<{
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, onChange }) => {
  const classData = getClassData(state.charClass);
  const skillLimit = classData?.skillsToPick || 2;

  const toggleSkill = (skill: string) => {
    const current = [...state.selectedSkills];
    const idx = current.indexOf(skill);
    if (idx >= 0) current.splice(idx, 1);
    else if (current.length < skillLimit) current.push(skill);
    onChange({ selectedSkills: current });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Talents & Training</h2>
        <p className="text-zinc-500 text-sm mt-1">Select {skillLimit} skills proficient to your class</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {classData?.name} Skill Proficiencies
          </span>
          <span className={`text-xs font-bold ${state.selectedSkills.length === skillLimit ? 'text-green-500' : 'text-amber-500'}`}>
            {state.selectedSkills.length} / {skillLimit}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DND_SKILLS
            .filter(skill => classData?.skillChoices.includes(skill.name))
            .map(skill => (
            <button
              key={skill.name}
              onClick={() => toggleSkill(skill.name)}
              className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-left flex items-center justify-between ${
                state.selectedSkills.includes(skill.name)
                ? 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-lg'
                : 'bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:border-zinc-500'
              }`}
            >
              <span>{skill.name}</span>
              {state.selectedSkills.includes(skill.name) && <Star size={10} className="fill-blue-400" />}
            </button>
          ))}
        </div>
        {classData?.name === 'Bard' && (
          <p className="text-[10px] text-amber-400/70 italic px-1">Bards can choose from any skill.</p>
        )}
      </div>
    </div>
  );
};

const StepPowers: React.FC<{
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, onChange }) => {
  const classData = getClassData(state.charClass);
  const isCaster = classData?.isCaster ?? false;
  const cantrips = CLASS_CANTRIPS[state.charClass] || [];
  const spells1st = CLASS_SPELLS_1ST[state.charClass] || [];
  const cantripsNeeded = getCantripsKnownCount(state.charClass, 1);
  const spellsNeeded = getSpellsKnownCount(state.charClass, 1);
  const raceTraits = getRaceTraits(state.race);
  const racialSpellNames = (raceTraits?.racialSpells || []).filter(s => s.minCharLevel <= 1).map(s => s.name);

  const selectedCantrips = state.selectedPowers.filter(p => cantrips.includes(p) || racialSpellNames.includes(p));
  const selectedSpells = state.selectedPowers.filter(p => spells1st.includes(p));

  const togglePower = (powerName: string) => {
    const current = [...state.selectedPowers];
    const idx = current.indexOf(powerName);
    if (idx >= 0) { current.splice(idx, 1); }
    else {
      const isCantrip = cantrips.includes(powerName);
      if (isCantrip && selectedCantrips.length >= cantripsNeeded) return;
      if (!isCantrip && spells1st.includes(powerName) && spellsNeeded > 0 && selectedSpells.length >= spellsNeeded) return;
      current.push(powerName);
    }
    onChange({ selectedPowers: current });
  };

  if (!isCaster && racialSpellNames.length === 0) {
    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Martial Focus</h2>
          <p className="text-zinc-500 text-sm mt-1">{state.charClass}s rely on steel and skill, not spells.</p>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 text-center space-y-3">
          <Zap size={32} className="mx-auto text-zinc-600" />
          <p className="text-zinc-400 text-sm">No spells to select at Level 1. You may gain spellcasting through your subclass at Level {classData?.subclassLevel || 3} (e.g., Eldritch Knight, Arcane Trickster).</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Spells & Cantrips</h2>
        <p className="text-zinc-500 text-sm mt-1">Choose from the {state.charClass} spell list</p>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Selected</h4>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {state.selectedPowers.map(p => (
              <span key={p} className={`${cantrips.includes(p) ? 'bg-cyan-900/30 text-cyan-200 border-cyan-500/30' : 'bg-purple-900/30 text-purple-200 border-purple-500/30'} border px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2`}>
                {p} <button aria-label={`Remove ${p}`} onClick={() => togglePower(p)}><X size={12} /></button>
              </span>
            ))}
            {state.selectedPowers.length === 0 && <span className="text-zinc-700 italic text-sm">Tap spells below to add...</span>}
          </div>
        </div>

        {cantripsNeeded > 0 && cantrips.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">Cantrips</span>
              <span className={`text-xs font-bold ${selectedCantrips.filter(c => cantrips.includes(c)).length >= cantripsNeeded ? 'text-green-500' : 'text-amber-500'}`}>
                {selectedCantrips.filter(c => cantrips.includes(c)).length} / {cantripsNeeded}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {cantrips.map(name => (
                <button key={name} onClick={() => togglePower(name)}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all text-left ${
                    state.selectedPowers.includes(name)
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-200'
                    : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-cyan-600'
                  }`}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {spellsNeeded > 0 && spells1st.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">1st-Level Spells</span>
              <span className={`text-xs font-bold ${selectedSpells.length >= spellsNeeded ? 'text-green-500' : 'text-amber-500'}`}>
                {selectedSpells.length} / {spellsNeeded}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {spells1st.map(name => (
                <button key={name} onClick={() => togglePower(name)}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all text-left ${
                    state.selectedPowers.includes(name)
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                    : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-purple-600'
                  }`}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {racialSpellNames.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest px-1">Racial Spells ({state.race})</span>
            <div className="grid grid-cols-2 gap-2">
              {racialSpellNames.map(name => (
                <div key={name} className="p-2 rounded-lg border border-amber-700/40 bg-amber-900/10 text-xs font-bold text-amber-300">
                  {name} <span className="text-amber-600 font-normal">(automatic)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StepConcept: React.FC<{
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}> = ({ state, onChange }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">Character Concept</h2>
        <p className="text-zinc-500 text-sm mt-1">Flesh out your hero's story</p>
      </div>

      <div className="space-y-4">
        {[
          { id: 'appearance', label: 'Appearance', placeholder: 'Describe your physical features...' },
          { id: 'backstory', label: 'Backstory', placeholder: 'Where do you come from? What led you to adventure?' },
          { id: 'motivations', label: 'Motivations', placeholder: 'What drives your character?' },
          { id: 'keyNPCs', label: 'Key NPCs', placeholder: 'Friends, rivals, or mentors...' },
        ].map(field => (
          <div key={field.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{field.label}</label>
              <TranscriptionButton onTranscription={(text) => onChange({ [field.id]: (state as any)[field.id] + ' ' + text })} />
            </div>
            <textarea
              value={(state as any)[field.id]}
              onChange={e => onChange({ [field.id]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 h-24 resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const StepReview: React.FC<{
  state: WizardState;
  forging: boolean;
  forgeError: string | null;
}> = ({ state, forging, forgeError }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">The Grand Review</h2>
        <p className="text-zinc-500 text-sm mt-1">Confirm your choices before the ritual begins</p>
      </div>

      <div className="bg-zinc-800 rounded-2xl border border-zinc-700 overflow-hidden divide-y divide-zinc-700/50">
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase block tracking-widest">Name</span>
            <span className="text-white font-bold">{state.name}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase block tracking-widest">Lineage & Calling</span>
            <span className="text-white font-bold">{state.race} {state.charClass}</span>
          </div>
        </div>
        <div className="p-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1 tracking-widest">Proficiencies</span>
          <div className="flex flex-wrap gap-1">
            {state.selectedSkills.map(s => (
              <span key={s} className="bg-blue-900/30 text-blue-300 text-[10px] px-2 py-0.5 rounded border border-blue-500/30 font-bold uppercase">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {forging && (
        <div className="py-8 text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse" />
            <Loader2 size={48} className="animate-spin text-amber-500 mx-auto relative" />
          </div>
          <p className="text-amber-500 font-display animate-pulse uppercase tracking-[0.2em] text-sm">Forging Destiny...</p>
        </div>
      )}

      {forgeError && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
          <span className="font-bold">The ritual failed:</span> {forgeError}
        </div>
      )}
    </div>
  );
};

const CharacterCreationWizard: React.FC<WizardProps> = ({ campaigns, onCreate, onClose }) => {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>({ ...INITIAL_STATE });
  const [forging, setForging] = useState(false);
  const [forgeError, setForgeError] = useState<string | null>(null);

  const handleChange = (updates: Partial<WizardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const classData = getClassData(state.charClass);

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0: return !!(state.name && state.race && state.charClass && state.background && state.alignment);
      case 1: 
        if (state.statMethod === 'standard') return Object.values(state.standardAssignment).every(v => v !== null);
        if (state.statMethod === 'pointbuy') {
            const spent = STAT_KEYS.reduce((sum, key) => sum + (POINT_BUY_COSTS[state.baseStats[key]] || 0), 0);
            return spent === POINT_BUY_TOTAL;
        }
        return true;
      case 2: return state.selectedSkills.length >= (classData?.skillsToPick || 2);
      case 3: return true;
      case 4: return true;
      case 5: return !forging;
      default: return false;
    }
  }, [step, state, forging, classData]);

  const handleForge = async () => {
    setForging(true);
    setForgeError(null);

    let portraitUrl = 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=800&auto=format&fit=crop';
    let detailedResult: { features: any[]; spells: any[] } = { features: [], spells: [] };

    try {
      // --- AI enrichment (portrait + rules text) ---
      try {
        if (!process.env.API_KEY) throw new Error("API Key missing — skipping AI enrichment");
        checkRateLimit();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const portraitPrompt = `High fantasy D&D Character Portrait: ${state.race} ${state.charClass}. Appearance: ${state.appearance || 'Mysterious adventurer'}. Cinematic lighting.`;
        const portraitResponse = await Promise.race([
          ai.models.generateContent({ model: 'gemini-2.5-flash-image', contents: { parts: [{ text: portraitPrompt }] } }),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Portrait generation timed out')), 60000))
        ]);
        if (portraitResponse.candidates?.[0]?.content?.parts) {
          for (const part of portraitResponse.candidates[0].content.parts) {
            if (part.inlineData) { portraitUrl = `data:image/png;base64,${part.inlineData.data}`; break; }
          }
        }

        if (state.selectedPowers.length > 0) {
          const rulesPrompt = `Provide full D&D 5e rules text for these abilities: ${state.selectedPowers.join(', ')}.
          Return a JSON object with two arrays: "features" and "spells".
          Ensure cantrips have level 0.
          Format: { "features": [{ "name": "...", "source": "...", "description": "...", "fullText": "..." }], "spells": [{ "name": "...", "level": 0, "school": "...", "description": "...", "castingTime": "...", "range": "...", "duration": "...", "components": "..." }] }`;

          const rulesResponse = await Promise.race([
            ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: rulesPrompt, config: { responseMimeType: 'application/json' } }),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Rules lookup timed out')), 30000))
          ]);

          try {
            const parsed = JSON.parse(rulesResponse.text || '{}');
            detailedResult = {
              features: Array.isArray(parsed.features) ? parsed.features : [],
              spells: Array.isArray(parsed.spells) ? parsed.spells : []
            };
          } catch (pErr) {
            console.warn("Could not parse AI rules JSON", pErr);
          }
        }
      } catch (aiErr: any) {
        console.error("AI enrichment failed (character will still be created):", aiErr);
        setForgeError(aiErr.message);
      }

      // --- Build character (always runs even if AI fails) ---
      const hitDie = classData?.hitDie ?? 8;
      const stats: Record<StatKey, Stat> = {} as any;
      STAT_KEYS.forEach(stat => {
        let base = state.statMethod === 'standard' ? (state.standardAssignment[stat] ?? 8) : state.baseStats[stat];
        let score = base + getRacialBonus(state.race, stat);
        let mod = Math.floor((score - 10) / 2);
        stats[stat] = {
          score,
          modifier: mod,
          save: mod,
          proficientSave: classData?.savingThrows.includes(stat) ?? false
        };
      });

      const character: CharacterData = {
        id: generateId(),
        campaign: state.campaign || 'Solo Adventure',
        name: state.name || 'Unnamed Adventurer',
        race: state.race,
        class: state.charClass,
        background: state.background,
        alignment: state.alignment,
        level: 1,
        portraitUrl,
        stats,
        hp: { current: hitDie + stats.CON.modifier, max: hitDie + stats.CON.modifier },
        hitDice: { current: 1, max: 1, die: `1d${hitDie}` },
        ac: 10 + stats.DEX.modifier,
        initiative: stats.DEX.modifier,
        speed: getRaceSpeed(state.race),
        passivePerception: 10 + stats.WIS.modifier,
        skills: DND_SKILLS.map(s => ({
          name: s.name,
          ability: s.ability,
          modifier: stats[s.ability].modifier + (state.selectedSkills.includes(s.name) ? 2 : 0),
          proficiency: state.selectedSkills.includes(s.name) ? 'proficient' : 'none'
        })),
        attacks: [],
        features: detailedResult.features || [],
        spells: detailedResult.spells || [],
        spellSlots: getSpellSlotsForLevel(state.charClass, 1).map(s => ({ level: s.level, current: s.max, max: s.max })),
        inventory: { gold: 150, items: [], load: "Light" },
        journal: [{ id: 'creation', timestamp: Date.now(), type: 'note', content: `Created ${state.name}, the ${state.race} ${state.charClass}. Background: ${state.background}.` }]
      };

      onCreate(recalculateCharacterStats(character));

    } catch (err: any) {
      console.error("Fatal forge error:", err);
      setForgeError(err.message || "An unexpected error occurred during character creation.");
    } finally {
      setForging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 animate-in fade-in">
      <div className="bg-zinc-900 sm:border border-zinc-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl md:max-w-2xl overflow-hidden flex flex-col shadow-2xl h-[95vh] sm:h-auto sm:max-h-[90vh]">
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-lg sm:text-xl font-display font-bold text-amber-500 flex items-center gap-2">
            <Star size={20} /> Forge New Character
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1" aria-label="Close"><X size={24} /></button>
        </div>

        <StepIndicator currentStep={step} />

        <div className="flex-grow overflow-y-auto">
          {step === 0 && <StepIdentity state={state} campaigns={campaigns} onChange={handleChange} />}
          {step === 1 && <StepAbilityScores state={state} onChange={handleChange} />}
          {step === 2 && <StepSkills state={state} onChange={handleChange} />}
          {step === 3 && <StepPowers state={state} onChange={handleChange} />}
          {step === 4 && <StepConcept state={state} onChange={handleChange} />}
          {step === 5 && <StepReview state={state} forging={forging} forgeError={forgeError} />}
        </div>

        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/50 flex gap-3 shrink-0">
          {step > 0 && !forging && (
            <button onClick={() => setStep(s => s - 1)} className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl flex items-center gap-1 transition-all">
              <ChevronLeft size={18} /> Back
            </button>
          )}
          <div className="flex-grow" />
          {step < 5 && (
            <button 
                onClick={() => setStep(s => s + 1)} 
                disabled={!canAdvance} 
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center gap-1 disabled:opacity-30 transition-all shadow-lg shadow-amber-900/20"
            >
              Next <ChevronRight size={18} />
            </button>
          )}
          {step === 5 && !forging && (
            <button onClick={handleForge} className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-orange-900/40 active:scale-95">
              <Sparkles size={18} /> Forge Character
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationWizard;
