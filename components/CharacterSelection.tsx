import React, { useState } from 'react';
import { CharacterData } from '../types';
import { Plus, Play, Trash2, Scroll } from 'lucide-react';
import CharacterCreationWizard from './CharacterCreationWizard';

interface CharacterSelectionProps {
  characters: CharacterData[];
  onSelect: (id: string) => void;
  onCreate: (data: CharacterData) => void;
  onDelete: (id: string) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ characters, onSelect, onCreate, onDelete }) => {
  const [showWizard, setShowWizard] = useState(false);

  const handleCreate = (newChar: CharacterData) => {
    onCreate(newChar);
    setShowWizard(false);
  };

  return (
    <div className="min-h-screen bg-[#111] p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">
        <header className="flex flex-col items-center mb-8 sm:mb-12 lg:mb-16 mt-6 sm:mt-8 lg:mt-12">
           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 mb-2">Adventurer's Hall</h1>
           <p className="text-zinc-500 text-sm sm:text-base">Select a hero or forge a new destiny</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Create New Card */}
          <button 
            onClick={() => setShowWizard(true)}
            className="group relative h-52 sm:h-64 lg:h-72 bg-zinc-900/50 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center hover:bg-zinc-800/50 hover:border-amber-500/50 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-amber-900/20 group-hover:text-amber-500 transition-colors text-zinc-500">
               <Plus size={32} />
            </div>
            <span className="font-display font-bold text-zinc-400 group-hover:text-amber-500 transition-colors">Create New Character</span>
          </button>

          {/* Existing Characters */}
          {characters.map((char) => (
            <div key={char.id} className="group relative h-52 sm:h-64 lg:h-72 bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden hover:ring-2 hover:ring-amber-500/50 transition-all shadow-xl">
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
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight truncate">{char.name}</h3>
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

      {/* Character Creation Wizard */}
      {showWizard && (
        <CharacterCreationWizard
          onCreate={handleCreate}
          onClose={() => setShowWizard(false)}
        />
      )}
    </div>
  );
};

export default CharacterSelection;
