
import React, { useState } from 'react';
import { CharacterData, Spell } from '../../types';
import { Sparkles, Wand2, Book, ChevronRight, Zap, Check, Flame, MessageSquare, AlertCircle } from 'lucide-react';

interface SpellsDetailProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
  onInspect?: (spell: Spell) => void;
}

const SpellsDetail: React.FC<SpellsDetailProps> = ({ data, onUpdate, onInspect }) => {
  const [castingSpell, setCastingSpell] = useState<Spell | null>(null);

  const toggleSlot = (level: number, index: number) => {
    const newSlots = data.spellSlots.map(s => {
      if (s.level === level) {
        const isCurrentlyAvailable = index < s.current;
        const newCurrent = isCurrentlyAvailable ? index : index + 1;
        return { ...s, current: Math.min(s.max, Math.max(0, newCurrent)) };
      }
      return s;
    });
    onUpdate({ spellSlots: newSlots });
  };

  const handleCast = (level: number) => {
    if (!castingSpell) return;
    const newSlots = data.spellSlots.map(s => {
      if (s.level === level) return { ...s, current: Math.max(0, s.current - 1) };
      return s;
    });
    onUpdate({ spellSlots: newSlots });
    setCastingSpell(null);
  };

  const sortedSpells = [...data.spells].sort((a, b) => a.level - b.level);
  const totalSlots = data.spellSlots.reduce((sum, s) => sum + s.max, 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
      
      {/* CASTING INTERFACE */}
      {castingSpell && (
        <div className="bg-indigo-950/40 border-2 border-indigo-500/50 rounded-2xl p-6 animate-in zoom-in-95 duration-200">
           <div className="flex justify-between items-start mb-4">
              <div>
                  <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">Casting: {castingSpell.name}</h3>
                  <p className="text-indigo-400 text-xs font-bold uppercase">Level {castingSpell.level} {castingSpell.school}</p>
              </div>
              <button onClick={() => setCastingSpell(null)} className="text-zinc-500 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
           </div>
           
           <div className="space-y-4">
              <p className="text-sm text-zinc-300 leading-relaxed italic border-l-2 border-indigo-500/30 pl-3">
                {castingSpell.atHigherLevels || "This spell does not have additional effects when upcast."}
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Slot Level to Burn</p>
                 {data.spellSlots.filter(s => s.level >= castingSpell.level && s.max > 0).map(slot => (
                    <button
                        key={slot.level}
                        disabled={slot.current <= 0}
                        onClick={() => handleCast(slot.level)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                            slot.current > 0 
                            ? 'bg-zinc-800 border-zinc-700 hover:border-indigo-500 text-white' 
                            : 'bg-zinc-900 border-zinc-800 text-zinc-600 opacity-50'
                        }`}
                    >
                        <span className="font-bold">Level {slot.level} Slot</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono">{slot.current}/{slot.max} available</span>
                            <Flame size={16} className={slot.current > 0 ? "text-orange-500" : "text-zinc-700"} />
                        </div>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* SPELL SLOTS */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 border-l-2 border-indigo-500">The Weave (Spell Slots)</h3>
        {totalSlots === 0 ? (
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6 text-center">
            <p className="text-zinc-500 text-sm italic">You possess no spell slots. Unlock magic through levelling or archetypes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.spellSlots.filter(s => s.max > 0).map((slotInfo) => (
              <div key={slotInfo.level} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Level {slotInfo.level}</span>
                  <span className="text-[10px] text-zinc-600 font-mono">{slotInfo.current} / {slotInfo.max}</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {Array.from({ length: slotInfo.max }).map((_, idx) => {
                    const isAvailable = idx < slotInfo.current;
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleSlot(slotInfo.level, idx)}
                        className={`w-7 h-9 rounded-lg border-2 transition-all ${
                          isAvailable 
                            ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] text-indigo-400' 
                            : 'bg-zinc-950 border-zinc-800 text-zinc-800'
                        }`}
                      >
                        <Zap size={12} fill={isAvailable ? "currentColor" : "none"} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* GRIMOIRE */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 border-l-2 border-purple-500">Grimoire</h3>
        
        {sortedSpells.length === 0 ? (
            <div className="bg-zinc-800/30 border border-dashed border-zinc-700 rounded-2xl p-10 text-center space-y-4">
                <div className="p-3 bg-zinc-900 rounded-full w-fit mx-auto">
                    <AlertCircle className="text-zinc-600" size={32} />
                </div>
                <div>
                    <h4 className="text-white font-bold">Empty Grimoire</h4>
                    <p className="text-zinc-500 text-xs mt-1 max-w-[240px] mx-auto leading-relaxed">
                        This hero has not scribed any spells yet. Use 'Ask the DM' to learn about your class's magical potential.
                    </p>
                </div>
            </div>
        ) : (
            <div className="space-y-2">
                {sortedSpells.map((spell, idx) => (
                    <div 
                    key={idx} 
                    className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group"
                    >
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 cursor-pointer flex-grow" onClick={() => onInspect?.(spell)}>
                        <div className={`w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center ${spell.level === 0 ? 'text-amber-500' : 'text-purple-400'}`}>
                            {spell.level === 0 ? <Sparkles size={18} /> : <Wand2 size={18} />}
                        </div>
                        <div>
                            <h4 className="font-display font-bold text-zinc-100">{spell.name}</h4>
                            <div className="flex gap-2 text-[10px] text-zinc-500 uppercase font-bold">
                            <span className={spell.level === 0 ? 'text-amber-600' : 'text-purple-500'}>
                                {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
                            </span>
                            <span>&middot;</span>
                            <span>{spell.school}</span>
                            </div>
                        </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                        <button 
                            onClick={() => spell.level === 0 ? alert("Cantrips do not consume slots.") : setCastingSpell(spell)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                                spell.level === 0 
                                ? 'bg-zinc-900 text-zinc-500 cursor-help' 
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 active:scale-95'
                            }`}
                        >
                            <Zap size={14} fill={spell.level > 0 ? "white" : "none"} />
                            {spell.level === 0 ? 'At Will' : 'Cast'}
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
            </div>
        )}
      </section>

      <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-start gap-3">
        <Book size={18} className="text-zinc-500 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          Leveled spells (1st+) require burning a <span className="text-indigo-400 font-bold">Spell Slot</span>. 
          Wizard characters add 2 new spells to their book every level.
        </p>
      </div>
    </div>
  );
};

export default SpellsDetail;
