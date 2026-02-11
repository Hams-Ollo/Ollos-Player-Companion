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
      // Auto close after 3 seconds roughly if not interacting, but let's keep it persistent for now until clicked
    } else {
      setVisible(false);
    }
  }, [result]);

  if (!result || !visible) return null;

  const isD20 = result.die === '1d20';
  const isCrit = isD20 && result.rolls[0] === 20;
  const isFail = isD20 && result.rolls[0] === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full transform scale-100 transition-all text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
          aria-label="Close"
          title="Close"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-zinc-600">
            <Dices size={32} className="text-zinc-300" />
          </div>
        </div>

        <h3 className="text-sm text-zinc-400 font-display mb-2 uppercase tracking-widest">{result.label}</h3>
        
        <div className="flex items-center justify-center gap-2 mb-2">
           <span className="text-zinc-500 text-lg">{result.die} ({result.rolls.join(' + ')}){result.modifier !== 0 ? ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}` : ''}</span>
        </div>

        <div className={`text-6xl font-bold font-display mb-4 ${
          isCrit ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 
          isFail ? 'text-red-500' : 'text-white'
        }`}>
          {result.total}
        </div>

        {isCrit && <div className="text-green-400 font-bold tracking-widest uppercase mb-4 animate-pulse">Critical Success!</div>}
        {isFail && <div className="text-red-500 font-bold tracking-widest uppercase mb-4">Critical Fail</div>}

        <p className="text-xs text-zinc-600">Tap anywhere to close</p>
      </div>
    </div>
  );
};

export default DiceRollModal;
