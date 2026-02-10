import React from 'react';
import { CharacterData, StatKey } from '../../types';
import { Check, CheckCheck } from 'lucide-react';

interface SkillsDetailProps {
  data: CharacterData;
  onRoll: (label: string, modifier: number, die: string) => void;
}

const SkillsDetail: React.FC<SkillsDetailProps> = ({ data, onRoll }) => {
  const statOrder: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  return (
    <div className="space-y-6">
      {/* Ability Scores Grid */}
      <div className="grid grid-cols-3 gap-2">
        {statOrder.map((stat) => {
          const info = data.stats[stat];
          const modString = info.modifier >= 0 ? `+${info.modifier}` : `${info.modifier}`;
          return (
            <button 
              key={stat}
              onClick={() => onRoll(`${stat} Check`, info.modifier, '1d20')}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 flex flex-col items-center hover:bg-zinc-700 hover:border-blue-500/50 transition-all group"
            >
              <span className="text-xs font-bold text-zinc-500 mb-1">{stat}</span>
              <span className="text-2xl font-display font-bold text-white group-hover:text-blue-400">{modString}</span>
              <span className="text-[10px] text-zinc-600 bg-black/30 px-1.5 rounded-full mt-1">{info.score}</span>
            </button>
          );
        })}
      </div>

      {/* Saving Throws */}
      <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
        <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-700 text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Saving Throws
        </div>
        <div className="p-2 grid grid-cols-2 gap-2">
          {statOrder.map(stat => {
            const info = data.stats[stat];
            const saveMod = info.save >= 0 ? `+${info.save}` : `${info.save}`;
            return (
              <button 
                key={stat}
                onClick={() => onRoll(`${stat} Save`, info.save, '1d20')}
                className={`flex items-center justify-between p-2 rounded hover:bg-zinc-700/50 transition-colors ${info.proficientSave ? 'bg-blue-900/10' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${info.proficientSave ? 'bg-blue-500 text-white' : 'bg-zinc-700'}`}>
                    {info.proficientSave && <Check size={10} strokeWidth={4} />}
                  </div>
                  <span className={`text-sm font-bold ${info.proficientSave ? 'text-blue-200' : 'text-zinc-400'}`}>{stat}</span>
                </div>
                <span className="font-mono text-white">{saveMod}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Skills List */}
      <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
         <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-700 flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Skills</span>
            <span className="text-[10px] text-zinc-600">Tap to roll</span>
         </div>
         <div className="divide-y divide-zinc-700/50">
           {data.skills.map((skill) => {
             const modString = skill.modifier >= 0 ? `+${skill.modifier}` : `${skill.modifier}`;
             const isProf = skill.proficiency === 'proficient';
             const isExp = skill.proficiency === 'expertise';
             
             return (
               <button 
                key={skill.name}
                onClick={() => onRoll(`${skill.name} Check`, skill.modifier, '1d20')}
                className={`w-full flex items-center justify-between p-3 hover:bg-zinc-700 transition-colors text-left group ${isExp || isProf ? 'bg-blue-900/5' : ''}`}
               >
                 <div className="flex items-center gap-3">
                    <div className="w-5 flex justify-center text-blue-500">
                      {isExp ? <CheckCheck size={16} /> : isProf ? <Check size={16} /> : <div className="w-4 h-4 rounded-sm border border-zinc-700" />}
                    </div>
                    <div>
                      <span className={`block font-medium ${isExp || isProf ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                        {skill.name}
                      </span>
                      <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{skill.ability}</span>
                    </div>
                 </div>
                 <span className={`font-mono text-lg font-bold ${isExp ? 'text-blue-400' : isProf ? 'text-blue-200' : 'text-zinc-500'}`}>
                   {modString}
                 </span>
               </button>
             );
           })}
         </div>
      </div>
    </div>
  );
};

export default SkillsDetail;
