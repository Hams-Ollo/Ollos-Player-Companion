import React from 'react';
import { CharacterData, Spell } from '../../types';
import { Sparkles, Wand2, Book, ChevronRight, Zap } from 'lucide-react';

interface SpellsDetailProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
  onInspect?: (spell: Spell) => void;
}

const SpellsDetail: React.FC<SpellsDetailProps> = ({ data, onUpdate, onInspect }) => {
  const toggleSlot = (level: number, index: number) => {
    const newSlots = data.spellSlots.map(s => {
      if (s.level === level) {
        // If the slot index is less than the current available, we're using it (current goes down)
        // If we click an empty slot, we're regaining it (current goes up)
        // More intuitive: clicking a filled slot consumes it. Clicking an empty slot refills it.
        const isCurrentlyAvailable = index < s.current;
        const newCurrent = isCurrentlyAvailable ? index : index + 1;
        return { ...s, current: Math.min(s.max, Math.max(0, newCurrent)) };
      }
      return s;
    });

    onUpdate({ spellSlots: newSlots });
  };

  const getSpellSlotsByLevel = (level: number) => {
    return data.spellSlots.find(s => s.level === level);
  };

  const sortedSpells = [...data.spells].sort((a, b) => a.level - b.level);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
      {/* Spell Slots Grid */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 border-l-2 border-indigo-500">Spell Slots</h3>
        
        {data.spellSlots.length === 0 ? (
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6 text-center">
            <p className="text-zinc-500 text-sm italic">You have no spell slots. Level up or choose a magical archetype to unlock the Weave.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.spellSlots.filter(s => s.max > 0).map((slotInfo) => (
              <div key={slotInfo.level} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Level {slotInfo.level}</span>
                  <span className="text-xs text-zinc-500 font-mono">{slotInfo.current} / {slotInfo.max}</span>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: slotInfo.max }).map((_, idx) => {
                    const isAvailable = idx < slotInfo.current;
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleSlot(slotInfo.level, idx)}
                        className={`w-8 h-10 rounded-lg border-2 transition-all transform active:scale-95 flex items-center justify-center ${
                          isAvailable 
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-700'
                        }`}
                        title={isAvailable ? "Use Spell Slot" : "Refill Spell Slot"}
                      >
                        <Zap size={14} fill={isAvailable ? "currentColor" : "none"} className={isAvailable ? "animate-pulse" : ""} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Spells Known */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 border-l-2 border-purple-500">Grimoire</h3>
        
        {sortedSpells.length === 0 ? (
          <div className="text-center py-8 text-zinc-600 italic border border-dashed border-zinc-800 rounded-xl">
            Your spellbook is empty.
          </div>
        ) : (
          <div className="space-y-2">
            {sortedSpells.map((spell, idx) => (
              <div 
                key={idx} 
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex items-center justify-between hover:border-purple-500/50 transition-colors group cursor-pointer"
                onClick={() => onInspect && onInspect(spell)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors">
                    {spell.level === 0 ? <Sparkles size={18} /> : <Wand2 size={18} />}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-zinc-100 group-hover:text-white transition-colors">{spell.name}</h4>
                    <div className="flex gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                      <span>{spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}</span>
                      <span>&middot;</span>
                      <span>{spell.school}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-[10px] text-zinc-600 uppercase font-bold">Casting Time</span>
                    <span className="text-xs text-zinc-400">{spell.castingTime}</span>
                  </div>
                  <ChevronRight size={18} className="text-zinc-600 group-hover:text-purple-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-start gap-3">
        <Book size={18} className="text-zinc-500 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          Tapping a <span className="text-indigo-400 font-bold">Spell Slot pip</span> will consume it. 
          Use <span className="text-amber-500 font-bold">Long Rest</span> in the Vitals menu to regain all slots at once.
        </p>
      </div>
    </div>
  );
};

export default SpellsDetail;