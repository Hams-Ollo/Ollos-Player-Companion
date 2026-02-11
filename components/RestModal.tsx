import React, { useState } from 'react';
import { CharacterData } from '../types';
import { X, Moon, Sunrise, Dices, Heart, RotateCcw } from 'lucide-react';

interface RestModalProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
  onClose: () => void;
}

const RestModal: React.FC<RestModalProps> = ({ data, onUpdate, onClose }) => {
  const [restType, setRestType] = useState<'short' | 'long'>('short');
  const [rollResult, setRollResult] = useState<{ roll: number, total: number } | null>(null);

  // Short Rest: Roll Hit Die
  const handleSpendHitDie = () => {
    if (data.hitDice.current <= 0 || data.hp.current >= data.hp.max) return;

    // Parse Hit Die (e.g., "1d8")
    const match = data.hitDice.die.match(/d(\d+)/);
    const sides = match ? parseInt(match[1]) : 8;
    const roll = Math.floor(Math.random() * sides) + 1;
    const conMod = data.stats.CON.modifier;
    const healAmount = Math.max(0, roll + conMod);

    const newHp = Math.min(data.hp.max, data.hp.current + healAmount);
    
    setRollResult({ roll, total: healAmount });

    onUpdate({
        hp: { ...data.hp, current: newHp },
        hitDice: { ...data.hitDice, current: data.hitDice.current - 1 }
    });
  };

  // Long Rest: Full Reset
  const handleLongRest = () => {
    // Regain half max hit dice (min 1)
    const regainedHD = Math.max(1, Math.floor(data.hitDice.max / 2));
    const newHD = Math.min(data.hitDice.max, data.hitDice.current + regainedHD);

    // Reset Spell Slots
    const newSpellSlots = data.spellSlots.map(s => ({ ...s, current: s.max }));

    onUpdate({
        hp: { ...data.hp, current: data.hp.max },
        hitDice: { ...data.hitDice, current: newHD },
        spellSlots: newSpellSlots
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Moon className="text-indigo-400" size={20} />
            Take a Rest
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white" aria-label="Close"><X size={24} /></button>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-900 p-2 gap-2 border-b border-zinc-800">
            <button 
                onClick={() => setRestType('short')}
                className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${restType === 'short' ? 'bg-indigo-900/30 text-indigo-300 border border-indigo-500/30' : 'bg-zinc-800 text-zinc-500'}`}
            >
                <Moon size={16} /> Short Rest
            </button>
            <button 
                onClick={() => setRestType('long')}
                className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${restType === 'long' ? 'bg-amber-900/30 text-amber-300 border border-amber-500/30' : 'bg-zinc-800 text-zinc-500'}`}
            >
                <Sunrise size={16} /> Long Rest
            </button>
        </div>

        <div className="p-6">
            {restType === 'short' && (
                <div className="space-y-6 text-center">
                    <p className="text-zinc-400 text-sm">Spend Hit Dice to regain health. <br/> (Constitution Modifier: {data.stats.CON.modifier >= 0 ? '+' : ''}{data.stats.CON.modifier})</p>
                    
                    <div className="flex justify-center items-center gap-4">
                        <div className="flex flex-col items-center p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                            <span className="text-xs text-zinc-500 uppercase font-bold">Available</span>
                            <span className="text-3xl font-display font-bold text-white">{data.hitDice.current}</span>
                            <span className="text-xs text-zinc-500">d{data.hitDice.die.split('d')[1]}</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                            <span className="text-xs text-zinc-500 uppercase font-bold">Current HP</span>
                            <span className="text-3xl font-display font-bold text-green-400">{data.hp.current}</span>
                            <span className="text-xs text-zinc-500">/ {data.hp.max}</span>
                        </div>
                    </div>

                    {rollResult && (
                        <div className="animate-in zoom-in duration-200 p-2 bg-green-900/20 rounded-lg text-green-300 text-sm font-bold border border-green-500/30">
                            Rolled {rollResult.roll} + {data.stats.CON.modifier} = +{rollResult.total} HP
                        </div>
                    )}

                    <button 
                        onClick={handleSpendHitDie}
                        disabled={data.hitDice.current <= 0 || data.hp.current >= data.hp.max}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
                    >
                        <Dices size={20} /> Roll Hit Die
                    </button>
                </div>
            )}

            {restType === 'long' && (
                <div className="space-y-6 text-center">
                    <div className="p-4 bg-amber-900/10 border border-amber-600/20 rounded-xl text-left space-y-2">
                        <h4 className="text-amber-500 font-bold text-sm flex items-center gap-2">
                            <Heart size={14} /> Full Recovery
                        </h4>
                        <p className="text-zinc-400 text-xs">Restores Hit Points to maximum.</p>
                        <div className="h-px bg-amber-900/30"></div>
                        
                        <h4 className="text-amber-500 font-bold text-sm flex items-center gap-2">
                            <RotateCcw size={14} /> Regain Resources
                        </h4>
                        <p className="text-zinc-400 text-xs">Recover all Spell Slots and half of total Hit Dice.</p>
                    </div>

                    <button 
                        onClick={handleLongRest}
                        className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-900/20"
                    >
                        <Sunrise size={20} /> Sleep (Long Rest)
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RestModal;