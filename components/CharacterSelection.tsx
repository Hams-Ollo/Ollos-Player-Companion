import React, { useState } from 'react';
import { CharacterData } from '../types';
import { createNewCharacter } from '../constants';
import { Plus, Play, Trash2, Scroll, Dices } from 'lucide-react';

interface CharacterSelectionProps {
  characters: CharacterData[];
  onSelect: (id: string) => void;
  onCreate: (data: CharacterData) => void;
  onDelete: (id: string) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ characters, onSelect, onCreate, onDelete }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRace, setNewRace] = useState('');
  const [newClass, setNewClass] = useState('');

  const handleCreate = () => {
    const newChar = createNewCharacter(newName, newRace, newClass);
    // Auto-roll generic stats for flavor
    const stats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;
    const rolls = [15, 14, 13, 12, 10, 8]; // Standard Array shuffled
    const shuffled = rolls.sort(() => Math.random() - 0.5);
    
    stats.forEach((stat, idx) => {
       const score = shuffled[idx];
       const mod = Math.floor((score - 10) / 2);
       newChar.stats[stat] = {
         score: score,
         modifier: mod,
         save: mod, // simplified
         proficientSave: false
       };
    });

    // Simple HP calc
    const conMod = newChar.stats.CON.modifier;
    newChar.hp.max = 8 + conMod; // Average d8 class
    newChar.hp.current = newChar.hp.max;
    newChar.initiative = newChar.stats.DEX.modifier;
    newChar.ac = 10 + newChar.stats.DEX.modifier;

    onCreate(newChar);
    setNewName('');
    setNewRace('');
    setNewClass('');
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-[#111] p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="flex flex-col items-center mb-12 mt-8">
           <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 mb-2">Adventurer's Hall</h1>
           <p className="text-zinc-500">Select a hero or forge a new destiny</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card */}
          <button 
            onClick={() => setShowCreate(true)}
            className="group relative h-64 bg-zinc-900/50 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center hover:bg-zinc-800/50 hover:border-amber-500/50 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-amber-900/20 group-hover:text-amber-500 transition-colors text-zinc-500">
               <Plus size={32} />
            </div>
            <span className="font-display font-bold text-zinc-400 group-hover:text-amber-500 transition-colors">Create New Character</span>
          </button>

          {/* Existing Characters */}
          {characters.map((char) => (
            <div key={char.id} className="group relative h-64 bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden hover:ring-2 hover:ring-amber-500/50 transition-all shadow-xl">
              {/* Background Image Effect */}
              <div className="absolute inset-0">
                 <img src={char.portraitUrl} alt={char.name} className="w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity blur-sm scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
              </div>

              <div className="absolute top-4 right-4">
                 <button 
                   onClick={(e) => { e.stopPropagation(); onDelete(char.id); }}
                   className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                   title="Delete Character"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 cursor-pointer" onClick={() => onSelect(char.id)}>
                 <div className="flex items-end justify-between mb-4">
                    <div className="w-20 h-20 rounded-full border-2 border-zinc-600 overflow-hidden shadow-lg bg-black">
                       <img src={char.portraitUrl} alt={char.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-right">
                       <span className="block text-4xl font-display font-bold text-white">{char.level}</span>
                       <span className="text-xs text-zinc-500 uppercase tracking-widest">Level</span>
                    </div>
                 </div>
                 
                 <div>
                    <h3 className="text-2xl font-display font-bold text-white leading-tight truncate">{char.name}</h3>
                    <p className="text-amber-500/80 font-medium text-sm">{char.race} {char.class}</p>
                    {char.campaign && (
                      <div className="mt-3 inline-flex items-center gap-2 px-2 py-1 bg-zinc-800/80 rounded border border-zinc-700/50">
                         <Scroll size={12} className="text-zinc-500" />
                         <span className="text-xs text-zinc-400 truncate max-w-[150px]">{char.campaign}</span>
                      </div>
                    )}
                 </div>

                 <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0 translate-x-4">
                    <div className="bg-amber-600 text-white p-3 rounded-full shadow-lg shadow-amber-900/20">
                       <Play size={24} fill="currentColor" />
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creation Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                 <Dices className="text-amber-500" />
                 Roll New Character
              </h2>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Name</label>
                    <input 
                      autoFocus
                      type="text" 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 mt-1" 
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Valeros"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Race</label>
                        <input 
                          type="text" 
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 mt-1" 
                          value={newRace}
                          onChange={e => setNewRace(e.target.value)}
                          placeholder="e.g. Human"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Class</label>
                        <input 
                          type="text" 
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 mt-1" 
                          value={newClass}
                          onChange={e => setNewClass(e.target.value)}
                          placeholder="e.g. Fighter"
                        />
                    </div>
                 </div>
                 
                 <div className="p-3 bg-zinc-800/50 rounded-lg text-xs text-zinc-500 italic">
                    Stats (STR, DEX, etc.) will be rolled using Standard Array method automatically. You can edit them later in settings.
                 </div>
              </div>

              <div className="flex gap-3 mt-8">
                 <button 
                   onClick={() => setShowCreate(false)}
                   className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleCreate}
                   disabled={!newName || !newRace || !newClass}
                   className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Roll Stats & Create
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSelection;
