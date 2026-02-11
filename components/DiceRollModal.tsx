
import React, { useEffect, useState } from 'react';
import { X, Dices } from 'lucide-react';
import { RollResult } from '../types';

interface DiceRollModalProps {
  result: RollResult | null;
  onClose: () => void;
}

const DiceRollModal: React.FC<DiceRollModalProps> = ({ result, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [result]);

  if (!result || !visible) return null;

  const isD20Roll = result.diceGroups.some(g => g.sides === 20 && g.rolls.length > 0);
  const firstD20Group = result.diceGroups.find(g => g.sides === 20);
  const mainD20 = firstD20Group?.rolls[0];
  
  const isCrit = isD20Roll && mainD20 === 20;
  const isFail = isD20Roll && mainD20 === 1;

  const getModeLabel = () => {
    if (result.mode === 'advantage') return "with Advantage";
    if (result.mode === 'disadvantage') return "with Disadvantage";
    return "";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-zinc-900 border border-zinc-700 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full transform scale-100 transition-all text-center relative ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-2 shadow-2xl transition-all duration-500 ${
            isCrit ? 'bg-green-500/20 border-green-500 text-green-400' :
            isFail ? 'bg-red-500/20 border-red-500 text-red-400' :
            'bg-zinc-800 border-zinc-600 text-zinc-300'
          }`}>
            <Dices size={40} />
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <h3 className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">{result.label}</h3>
          <p className="text-zinc-400 text-sm font-medium">{getModeLabel()}</p>
        </div>
        
        {/* Dice Pool Display */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
           {result.diceGroups.map((group, gIdx) => (
             <React.Fragment key={gIdx}>
               {group.rolls.map((roll, rIdx) => (
                 <div key={`roll-${gIdx}-${rIdx}`} className={`px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm font-mono font-bold ${
                   group.sides === 20 ? (roll === 20 ? 'text-green-400' : roll === 1 ? 'text-red-400' : 'text-white') : 'text-zinc-300'
                 }`}>
                   {roll}
                   <span className="text-[10px] opacity-40 ml-1">d{group.sides}</span>
                 </div>
               ))}
               {group.dropped !== undefined && (
                 <div className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm font-mono font-bold text-zinc-600 line-through opacity-50 italic">
                   {group.dropped}
                   <span className="text-[8px] opacity-40 ml-1">dropped</span>
                 </div>
               )}
             </React.Fragment>
           ))}
           {result.modifier !== 0 && (
             <div className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-mono font-bold text-zinc-500">
               {result.modifier >= 0 ? '+' : ''}{result.modifier}
             </div>
           )}
        </div>

        <div className={`text-8xl font-display font-black mb-4 transition-all duration-500 ${
          isCrit ? 'text-green-400 drop-shadow-[0_0_30px_rgba(74,222,128,0.4)]' : 
          isFail ? 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 
          'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]'
        }`}>
          {result.total}
        </div>

        <div className="h-8">
          {isCrit && <div className="text-green-400 font-display font-bold tracking-widest uppercase animate-bounce">Critical Success!</div>}
          {isFail && <div className="text-red-500 font-display font-bold tracking-widest uppercase">Critical Failure</div>}
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-[10px]"
            >
              Close Ritual
            </button>
        </div>
      </div>
    </div>
  );
};

export default DiceRollModal;
