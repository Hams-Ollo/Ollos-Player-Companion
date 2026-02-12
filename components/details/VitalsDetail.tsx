import React, { useState } from 'react';
import { Heart, Shield, Zap, Eye, Wind, Minus, Plus, ArrowUpCircle, Moon, X } from 'lucide-react';
import { CharacterData } from '../../types';

interface VitalsDetailProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
  onLevelUp?: () => void;
  onRest?: () => void;
}

const VitalsDetail: React.FC<VitalsDetailProps> = ({ data, onUpdate, onLevelUp, onRest }) => {
  const hpPercent = (data.hp.current / data.hp.max) * 100;
  const [hpInput, setHpInput] = useState<{ mode: 'damage' | 'heal'; value: string } | null>(null);

  const handleHealthChange = (amount: number) => {
    const newCurrent = Math.min(data.hp.max, Math.max(0, data.hp.current + amount));
    onUpdate({
      hp: {
        ...data.hp,
        current: newCurrent
      }
    });
  };

  const applyHpChange = () => {
    if (!hpInput) return;
    const amount = parseInt(hpInput.value);
    if (isNaN(amount) || amount <= 0) { setHpInput(null); return; }
    handleHealthChange(hpInput.mode === 'damage' ? -amount : amount);
    setHpInput(null);
  };

  return (
    <div className="space-y-4">
      
      {/* Level Header */}
      <div className="flex items-center justify-between bg-zinc-800 rounded-xl p-3 border border-zinc-700">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center font-display font-bold text-white border border-zinc-600">
                 {data.level}
             </div>
             <div>
                 <span className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Level</span>
                 <span className="text-zinc-300 text-sm font-medium">{data.class}</span>
             </div>
         </div>
         <div className="flex gap-2">
            {onRest && (
                <button 
                    onClick={onRest}
                    className="px-3 py-1.5 bg-indigo-900/20 text-indigo-400 border border-indigo-600/30 rounded-lg text-xs font-bold hover:bg-indigo-900/40 transition-colors flex items-center gap-1.5"
                >
                    <Moon size={14} /> Rest
                </button>
            )}
            {onLevelUp && (
                <button 
                    onClick={onLevelUp}
                    className="px-3 py-1.5 bg-green-900/20 text-green-400 border border-green-600/30 rounded-lg text-xs font-bold hover:bg-green-900/40 transition-colors flex items-center gap-1.5"
                >
                    <ArrowUpCircle size={14} /> Level Up
                </button>
            )}
         </div>
      </div>

      {/* HP Card */}
      <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 shadow-md relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-green-400">
            <Heart className="fill-current" />
            <span className="font-display font-bold text-lg">Hit Points</span>
          </div>
          <span className="text-2xl font-mono text-white">{data.hp.current} <span className="text-zinc-500 text-lg">/ {data.hp.max}</span></span>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-4 overflow-hidden border border-zinc-700">
          <div 
            className={`h-full transition-all duration-500 ${hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        {/* Inline HP input */}
        {hpInput ? (
          <div className="flex items-center gap-2 mt-4">
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
              className="flex-1 bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-center text-white font-mono font-bold text-lg focus:outline-none focus:border-zinc-400"
              placeholder="0"
            />
            <button
              onClick={applyHpChange}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                hpInput.mode === 'damage' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'
              }`}
            >
              Apply
            </button>
            <button onClick={() => setHpInput(null)} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex justify-between mt-4 gap-2">
            <button 
              onClick={() => setHpInput({ mode: 'damage', value: '' })}
              className="flex-1 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-200 border border-red-900/50 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Minus size={16} /> Damage
            </button>
            <button 
              onClick={() => setHpInput({ mode: 'heal', value: '' })}
              className="flex-1 py-3 bg-green-900/20 hover:bg-green-900/40 text-green-200 border border-green-900/50 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Heal
            </button>
          </div>
        )}
      </div>

      {/* AC & Speed Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 flex flex-col items-center justify-center">
          <Shield className="text-zinc-400 mb-1" size={24} />
          <span className="text-4xl font-display font-bold text-white mb-1">{data.ac}</span>
          <span className="text-xs uppercase tracking-widest text-zinc-500">Armor Class</span>
          <span className="text-xs text-zinc-600 mt-1">Calculated from Gear</span>
        </div>
        
        <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 flex flex-col items-center justify-center">
          <Wind className="text-zinc-400 mb-1" size={24} />
          <span className="text-4xl font-display font-bold text-white mb-1">{data.speed}</span>
          <span className="text-xs uppercase tracking-widest text-zinc-500">Speed (ft)</span>
          <span className="text-xs text-zinc-600 mt-1">Walking</span>
        </div>
      </div>

      {/* Initiative */}
      <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 flex items-center justify-between hover:border-zinc-500 transition-colors cursor-pointer group">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-zinc-900 rounded-lg group-hover:bg-zinc-700 transition-colors">
            <Zap className="text-yellow-500" size={28} />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-white group-hover:text-yellow-400 transition-colors">Initiative</h3>
            <p className="text-zinc-500 text-sm">Dexterity Modifier</p>
          </div>
        </div>
        <span className="text-4xl font-display font-bold text-white">{data.initiative >= 0 ? '+' : ''}{data.initiative}</span>
      </div>

      {/* Passive Perception */}
      <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 flex items-center gap-4 opacity-80">
        <Eye className="text-blue-400" />
        <div className="flex-grow">
          <span className="block font-bold text-white">Passive Perception</span>
          <span className="text-xs text-zinc-400">10 + Perception Modifier</span>
        </div>
        <span className="font-mono text-xl font-bold">{data.passivePerception}</span>
      </div>
    </div>
  );
};

export default VitalsDetail;