import React, { useState } from 'react';
import { CharacterData, StatKey } from '../types';
import { getClassTheme } from '../lib/themes';
import { DND_CLASSES } from '../constants';
import { Heart, Shield, Zap, Wind, Wand2, Minus, Plus, X } from 'lucide-react';

interface CombatStripProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
  onRollInitiative: () => void;
  isCaster: boolean;
}

const CombatStrip: React.FC<CombatStripProps> = ({ data, onUpdate, onRollInitiative, isCaster }) => {
  const theme = getClassTheme(data.class);
  const [hpInput, setHpInput] = useState<{ mode: 'damage' | 'heal'; value: string } | null>(null);
  const hpPercent = Math.max(0, Math.min(100, (data.hp.current / data.hp.max) * 100));

  const handleHealthChange = (amount: number) => {
    const newCurrent = Math.min(data.hp.max, Math.max(0, data.hp.current + amount));
    onUpdate({ hp: { ...data.hp, current: newCurrent } });
  };

  const applyHpChange = () => {
    if (!hpInput) return;
    const amount = parseInt(hpInput.value);
    if (isNaN(amount) || amount <= 0) { setHpInput(null); return; }
    handleHealthChange(hpInput.mode === 'damage' ? -amount : amount);
    setHpInput(null);
  };

  // Spell DC & attack for casters — look up ability from class definition
  const classData = DND_CLASSES.find(c => c.name.toLowerCase() === data.class?.toLowerCase());
  const castingAbilityKey = classData?.spellcastingAbility as StatKey | undefined;
  const castingStat = castingAbilityKey ? data.stats[castingAbilityKey] : null;
  const profBonus = Math.ceil(data.level / 4) + 1;
  const spellDC = castingStat ? 8 + profBonus + castingStat.modifier : null;
  const spellAttack = castingStat ? profBonus + castingStat.modifier : null;

  return (
    <div className="relative">
      {/* Inline HP input overlay */}
      {hpInput && (
        <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-3 px-4">
          <span className={`text-sm font-bold ${hpInput.mode === 'damage' ? 'text-red-400' : 'text-green-400'}`}>
            {hpInput.mode === 'damage' ? 'Damage' : 'Heal'}
          </span>
          <input
            type="number"
            autoFocus
            min="0"
            value={hpInput.value}
            onChange={(e) => setHpInput({ ...hpInput, value: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') applyHpChange(); if (e.key === 'Escape') setHpInput(null); }}
            className="w-20 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-center text-white font-mono font-bold text-lg focus:outline-none focus:border-zinc-400"
            placeholder="0"
          />
          <button
            onClick={applyHpChange}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              hpInput.mode === 'damage'
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            Apply
          </button>
          <button onClick={() => setHpInput(null)} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      <div className={`grid ${isCaster ? 'grid-cols-5' : 'grid-cols-4'} gap-2 sm:gap-3`}>
        {/* HP Cell */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 sm:p-4 relative overflow-hidden group">
          {/* HP progress bar background */}
          <div
            className={`absolute bottom-0 left-0 h-1 transition-all duration-500 rounded-b-xl ${
              hpPercent > 50 ? 'bg-green-500/40' : hpPercent > 25 ? 'bg-yellow-500/40' : 'bg-red-500/40'
            }`}
            style={{ width: `${hpPercent}%` }}
          />

          <div className="flex items-center gap-1.5 mb-1">
            <Heart size={12} className={`${hpPercent > 50 ? 'text-green-500' : hpPercent > 25 ? 'text-yellow-500' : 'text-red-500'} fill-current`} />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">HP</span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className={`text-xl sm:text-2xl font-mono font-black ${
              hpPercent > 50 ? 'text-green-400' : hpPercent > 25 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {data.hp.current}
            </span>
            <span className="text-xs text-zinc-600 font-bold">/ {data.hp.max}</span>
          </div>

          {/* Damage/Heal buttons */}
          <div className="flex gap-1 mt-2">
            <button
              onClick={() => setHpInput({ mode: 'damage', value: '' })}
              className="flex-1 py-1 bg-red-950/30 border border-red-900/30 rounded text-[9px] font-bold text-red-400 hover:bg-red-900/40 transition-colors flex items-center justify-center gap-0.5"
            >
              <Minus size={10} /> DMG
            </button>
            <button
              onClick={() => setHpInput({ mode: 'heal', value: '' })}
              className="flex-1 py-1 bg-green-950/30 border border-green-900/30 rounded text-[9px] font-bold text-green-400 hover:bg-green-900/40 transition-colors flex items-center justify-center gap-0.5"
            >
              <Plus size={10} /> HEAL
            </button>
          </div>
        </div>

        {/* AC Cell */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 sm:p-4 text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Shield size={12} className="text-blue-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">AC</span>
          </div>
          <span className="text-2xl sm:text-3xl font-display font-black text-white">{data.ac}</span>
        </div>

        {/* Initiative Cell */}
        <button
          onClick={onRollInitiative}
          className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 sm:p-4 text-center flex flex-col justify-center hover:bg-zinc-800/80 hover:border-zinc-700 active:scale-95 transition-all"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Zap size={12} className="text-yellow-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">INIT</span>
          </div>
          <span className="text-2xl sm:text-3xl font-display font-black text-orange-400">
            {data.initiative >= 0 ? '+' : ''}{data.initiative}
          </span>
          <span className="text-[8px] text-zinc-600 font-bold uppercase mt-0.5">Tap to Roll</span>
        </button>

        {/* Speed Cell */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 sm:p-4 text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Wind size={12} className="text-zinc-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">SPEED</span>
          </div>
          <span className="text-2xl sm:text-3xl font-display font-black text-white">{data.speed}</span>
          <span className="text-[8px] text-zinc-600 font-bold uppercase mt-0.5">ft</span>
        </div>

        {/* Spell DC / Attack (casters only) */}
        {isCaster && spellDC && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 sm:p-4 text-center flex flex-col justify-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Wand2 size={12} className="text-cyan-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">SPELL</span>
            </div>
            <span className="text-2xl sm:text-3xl font-display font-black text-cyan-400">{spellDC}</span>
            <span className="text-[8px] text-zinc-600 font-bold uppercase mt-0.5">DC &middot; +{spellAttack} atk</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombatStrip;
