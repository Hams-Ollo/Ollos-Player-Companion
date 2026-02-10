import React, { useState } from 'react';
import { Sword, Crosshair, HelpCircle } from 'lucide-react';
import { CharacterData, Attack } from '../../types';

interface CombatDetailProps {
  data: CharacterData;
  onRoll: (label: string, modifier: number, die: string) => void;
}

const CombatDetail: React.FC<CombatDetailProps> = ({ data, onRoll }) => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const sneakAttack = data.features.find(f => f.name === 'Sneak Attack');

  const handleRollAttack = (attack: Attack) => {
    onRoll(`Attack (${attack.name})`, attack.bonus, '1d20');
  };

  const handleRollDamage = (attack: Attack) => {
    // Parsing basic damage dice string for demo 
    // In a real app, this would be more robust
    onRoll(`Damage (${attack.name})`, 0, attack.damage);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-widest text-zinc-500 font-bold mb-2">Weapons</h3>
        {data.attacks.map((attack, idx) => (
          <div key={idx} className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
            <div className="p-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                   <h4 className="font-display font-bold text-lg text-white">{attack.name}</h4>
                   <span className="text-xs bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">{attack.type}</span>
                </div>
                <div className="flex gap-2 text-xs text-zinc-500 mt-1">
                   {attack.range && <span>Range: {attack.range}ft</span>}
                   {attack.properties?.map(p => <span key={p}>| {p}</span>)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 divide-x divide-zinc-700 bg-zinc-900/50">
              <button 
                onClick={() => handleRollAttack(attack)}
                className="p-3 hover:bg-zinc-700 transition-colors flex flex-col items-center group"
              >
                <span className="text-xs uppercase text-zinc-500 mb-1">To Hit</span>
                <span className="font-display font-bold text-xl text-orange-400 group-hover:text-orange-300">+{attack.bonus}</span>
              </button>
              <button 
                onClick={() => handleRollDamage(attack)}
                className="p-3 hover:bg-zinc-700 transition-colors flex flex-col items-center group"
              >
                <span className="text-xs uppercase text-zinc-500 mb-1">Damage</span>
                <span className="font-mono font-bold text-lg text-zinc-300 group-hover:text-white">{attack.damage}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-widest text-zinc-500 font-bold mb-2">Class Features</h3>
        
        {sneakAttack && (
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl overflow-hidden">
             <div 
               className="p-4 cursor-pointer hover:bg-indigo-900/30 transition-colors"
               onClick={() => setExpandedFeature(expandedFeature === 'sneak' ? null : 'sneak')}
             >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-display font-bold text-indigo-300 flex items-center gap-2">
                    <Crosshair size={18} />
                    {sneakAttack.name}
                  </h4>
                  <span className="font-mono font-bold text-white bg-indigo-600 px-2 py-1 rounded text-sm">1d6</span>
                </div>
                <p className="text-sm text-indigo-200/70 truncate">
                  {expandedFeature === 'sneak' ? '' : sneakAttack.description}
                </p>
             </div>
             
             {/* Simple dice button for sneak attack damage */}
             <div className="bg-indigo-950/50 p-2 flex justify-end border-t border-indigo-500/20">
                <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     onRoll("Sneak Attack", 0, "1d6");
                   }}
                   className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
                >
                  Roll Damage
                </button>
             </div>

             {expandedFeature === 'sneak' && (
               <div className="p-4 bg-black/20 text-sm text-indigo-100 border-t border-indigo-500/20 leading-relaxed whitespace-pre-wrap">
                 {sneakAttack.fullText}
               </div>
             )}
          </div>
        )}
      </div>

      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 flex items-start gap-3">
        <HelpCircle className="text-zinc-500 shrink-0 mt-0.5" size={16} />
        <div className="text-xs text-zinc-500">
          <p className="mb-1"><span className="text-zinc-300 font-bold">Dual Wielding:</span> When you take the Attack action and attack with a light melee weapon that you're holding in one hand, you can use a bonus action to attack with a different light melee weapon that you're holding in the other hand.</p>
          <p>Don't add your ability modifier to the damage of the bonus attack, unless that modifier is negative.</p>
        </div>
      </div>
    </div>
  );
};

export default CombatDetail;
