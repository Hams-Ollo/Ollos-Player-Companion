import React from 'react';
import { Heart, Shield, Zap, Eye, Wind, Minus, Plus } from 'lucide-react';
import { CharacterData } from '../../types';

interface VitalsDetailProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
}

const VitalsDetail: React.FC<VitalsDetailProps> = ({ data, onUpdate }) => {
  const hpPercent = (data.hp.current / data.hp.max) * 100;

  const handleHealthChange = (amount: number) => {
    const newCurrent = Math.min(data.hp.max, Math.max(0, data.hp.current + amount));
    onUpdate({
      hp: {
        ...data.hp,
        current: newCurrent
      }
    });
  };

  const handleManualEntry = (type: 'damage' | 'heal') => {
    const input = window.prompt(`Enter amount to ${type}:`);
    if (!input) return;
    const amount = parseInt(input);
    if (isNaN(amount)) return;
    
    handleHealthChange(type === 'damage' ? -amount : amount);
  };

  return (
    <div className="space-y-4">
      {/* HP Card */}
      <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-green-400">
            <Heart className="fill-current" />
            <span className="font-display font-bold text-lg">Hit Points</span>
          </div>
          <span className="text-2xl font-mono text-white">{data.hp.current} <span className="text-zinc-500 text-lg">/ {data.hp.max}</span></span>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-4 overflow-hidden border border-zinc-700">
          <div 
            className="bg-green-500 h-full transition-all duration-500" 
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-4 gap-2">
          <button 
            onClick={() => handleManualEntry('damage')}
            className="flex-1 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-200 border border-red-900/50 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Minus size={16} /> Damage
          </button>
          <button 
            onClick={() => handleManualEntry('heal')}
            className="flex-1 py-3 bg-green-900/20 hover:bg-green-900/40 text-green-200 border border-green-900/50 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Heal
          </button>
        </div>
      </div>

      {/* AC & Speed Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 flex flex-col items-center justify-center">
          <Shield className="text-zinc-400 mb-1" size={24} />
          <span className="text-4xl font-display font-bold text-white mb-1">{data.ac}</span>
          <span className="text-xs uppercase tracking-widest text-zinc-500">Armor Class</span>
          <span className="text-xs text-zinc-600 mt-1">Leather + Dex</span>
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
        <span className="text-4xl font-display font-bold text-white">+{data.initiative}</span>
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