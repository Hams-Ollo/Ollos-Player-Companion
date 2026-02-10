import React, { useState } from 'react';
import { CharacterData, StackType, RollResult } from '../types';
import CardStack from './CardStack';
import DetailOverlay from './DetailOverlay';
import VitalsDetail from './details/VitalsDetail';
import CombatDetail from './details/CombatDetail';
import SkillsDetail from './details/SkillsDetail';
import FeaturesDetail from './details/FeaturesDetail';
import InventoryDetail from './details/InventoryDetail';
import DiceRollModal from './DiceRollModal';
import PortraitGenerator from './PortraitGenerator';
import AskDMModal from './AskDMModal';
import SettingsModal from './SettingsModal';
import { Heart, Sword, Brain, Sparkles, Backpack, Edit2, MessageSquare, Settings, LogOut } from 'lucide-react';

interface DashboardProps {
  data: CharacterData;
  onUpdatePortrait: (url: string) => void;
  onUpdateData: (newData: Partial<CharacterData>) => void;
  onExit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onUpdatePortrait, onUpdateData, onExit }) => {
  const [activeStack, setActiveStack] = useState<StackType | null>(null);
  const [rollResult, setRollResult] = useState<RollResult | null>(null);
  const [showPortraitGen, setShowPortraitGen] = useState(false);
  const [showAskDM, setShowAskDM] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleRoll = (label: string, modifier: number, die: string) => {
    // Simple dice logic
    const sides = parseInt(die.split('d')[1]);
    const numDice = parseInt(die.split('d')[0]) || 1;
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }
    
    total += modifier;

    setRollResult({
        label,
        total,
        die,
        rolls,
        modifier
    });
  };

  return (
    <div className="min-h-screen bg-[#111] pb-8 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />

       <div className="max-w-md mx-auto px-4 pt-6 relative z-10">
         {/* Top Banner */}
         <header className="flex items-center gap-3 mb-8">
            <button 
                onClick={onExit}
                className="p-2 text-zinc-500 hover:text-white transition-colors mr-1"
                title="Switch Character"
            >
                <LogOut size={20} className="transform rotate-180" />
            </button>
            <div className="relative group cursor-pointer shrink-0" onClick={() => setShowPortraitGen(true)}>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-600 shadow-xl ring-2 ring-black/50 relative">
                 <img src={data.portraitUrl} alt={data.name} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 size={16} className="text-white" />
                 </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-zinc-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-zinc-700">
                Lvl {data.level}
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <h1 className="text-2xl font-display font-bold text-white leading-none mb-1 truncate">{data.name}</h1>
              <p className="text-zinc-400 font-medium text-xs truncate">{data.race} / {data.class}</p>
              {data.campaign && <p className="text-[10px] text-amber-500/80 uppercase tracking-wider truncate mt-1">{data.campaign}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
                <button 
                    onClick={() => setShowAskDM(true)}
                    className="p-2.5 bg-amber-900/20 text-amber-500 border border-amber-500/30 rounded-full hover:bg-amber-900/40 transition-colors"
                >
                    <MessageSquare size={18} />
                </button>
                <button 
                    onClick={() => setShowSettings(true)}
                    className="p-2.5 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-full hover:bg-zinc-700 hover:text-white transition-colors"
                >
                    <Settings size={18} />
                </button>
            </div>
         </header>

         {/* Stacks Grid */}
         <div className="space-y-4">
            
            {/* Row 1: Vitals (Full Width) */}
            <div className="h-32">
                <CardStack 
                    type="vitals" 
                    title="Vitals & Stats" 
                    color="red" 
                    onClick={() => setActiveStack('vitals')}
                    icon={<Heart size={20} />}
                >
                    <div className="flex items-center justify-between h-full px-2">
                        <div className="flex flex-col">
                            <span className="text-xs text-zinc-500 uppercase font-bold">Health</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-mono text-green-400 font-bold">{data.hp.current}</span>
                                <span className="text-sm text-zinc-600">/ {data.hp.max}</span>
                            </div>
                            <div className="w-24 h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-green-500 w-full"></div>
                            </div>
                        </div>

                        <div className="h-10 w-[1px] bg-zinc-800 mx-2"></div>

                        <div className="flex flex-col items-center">
                            <span className="text-xs text-zinc-500 uppercase font-bold">AC</span>
                            <span className="text-2xl font-display font-bold text-white">{data.ac}</span>
                        </div>

                        <div className="h-10 w-[1px] bg-zinc-800 mx-2"></div>

                        <div className="flex flex-col items-center">
                            <span className="text-xs text-zinc-500 uppercase font-bold">Init</span>
                            <span className="text-2xl font-display font-bold text-yellow-500">+{data.initiative}</span>
                        </div>
                    </div>
                </CardStack>
            </div>

            {/* Row 2: Combat & Skills */}
            <div className="grid grid-cols-2 gap-4 h-40">
                <CardStack 
                    type="combat" 
                    title="Combat" 
                    color="orange" 
                    onClick={() => setActiveStack('combat')}
                    icon={<Sword size={20} />}
                >
                    <div className="space-y-2 mt-1">
                        {data.attacks.length > 0 ? data.attacks.slice(0, 2).map((atk, i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-zinc-800/50 pb-1 last:border-0">
                                <span className="text-zinc-300 font-medium truncate w-16">{atk.name}</span>
                                <div className="flex gap-2 text-xs">
                                    <span className="text-orange-400 font-bold">+{atk.bonus}</span>
                                    <span className="text-zinc-500">{atk.damage}</span>
                                </div>
                            </div>
                        )) : <div className="text-zinc-600 text-xs text-center mt-4 italic">No attacks configured</div>}
                    </div>
                </CardStack>

                <CardStack 
                    type="skills" 
                    title="Skills" 
                    color="blue" 
                    onClick={() => setActiveStack('skills')}
                    icon={<Brain size={20} />}
                >
                    <div className="flex flex-col justify-between h-full py-1">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-500">Dex Check</span>
                            <span className="text-lg font-bold text-blue-400">+{data.stats.DEX.modifier}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-xs text-zinc-500">Wis Check</span>
                            <span className="text-lg font-bold text-zinc-400">+{data.stats.WIS.modifier}</span>
                        </div>
                        <div className="mt-2 text-xs text-blue-200/80">
                             <div className="flex justify-between"><span>Stealth</span> <span>+{data.skills.find(s=>s.name === 'Stealth')?.modifier || 0}</span></div>
                             <div className="flex justify-between"><span>Perception</span> <span>+{data.skills.find(s=>s.name === 'Perception')?.modifier || 0}</span></div>
                        </div>
                    </div>
                </CardStack>
            </div>

            {/* Row 3: Features & Inventory */}
            <div className="grid grid-cols-2 gap-4 h-32">
                 <CardStack 
                    type="features" 
                    title="Traits" 
                    color="purple" 
                    onClick={() => setActiveStack('features')}
                    icon={<Sparkles size={20} />}
                >
                    <div className="flex flex-wrap gap-1 mt-1">
                        {data.features.length > 0 ? (
                            data.features.slice(0,3).map((f, i) => (
                                <span key={i} className="text-[10px] bg-purple-900/30 text-purple-200 px-1.5 py-0.5 rounded border border-purple-500/20 truncate max-w-full">{f.name}</span>
                            ))
                        ) : <span className="text-[10px] text-zinc-600 italic">No features</span>}
                    </div>
                </CardStack>

                <CardStack 
                    type="inventory" 
                    title="Bag" 
                    color="amber" 
                    onClick={() => setActiveStack('inventory')}
                    icon={<Backpack size={20} />}
                >
                     <div className="flex flex-col justify-center h-full gap-1">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                             <span className="text-sm font-bold text-amber-100">{data.inventory.gold} gp</span>
                        </div>
                         <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                             <span className="text-xs text-zinc-400 truncate">
                                {data.inventory.items[0]?.name || "Empty"}
                             </span>
                        </div>
                     </div>
                </CardStack>
            </div>
         </div>
       </div>

       {/* Overlays */}
       <DetailOverlay 
          isOpen={activeStack === 'vitals'} 
          onClose={() => setActiveStack(null)} 
          type="vitals" 
          title="Vitals & Stats"
          color="red"
        >
          <VitalsDetail data={data} onUpdate={onUpdateData} />
       </DetailOverlay>

       <DetailOverlay 
          isOpen={activeStack === 'combat'} 
          onClose={() => setActiveStack(null)} 
          type="combat" 
          title="Actions & Combat"
          color="orange"
        >
          <CombatDetail data={data} onRoll={handleRoll} />
       </DetailOverlay>
       
       <DetailOverlay 
          isOpen={activeStack === 'skills'} 
          onClose={() => setActiveStack(null)} 
          type="skills" 
          title="Skills & Checks"
          color="blue"
        >
          <SkillsDetail data={data} onRoll={handleRoll} />
       </DetailOverlay>

        <DetailOverlay 
          isOpen={activeStack === 'features'} 
          onClose={() => setActiveStack(null)} 
          type="features" 
          title="Features & Traits"
          color="purple"
        >
          <FeaturesDetail data={data} />
       </DetailOverlay>

        <DetailOverlay 
          isOpen={activeStack === 'inventory'} 
          onClose={() => setActiveStack(null)} 
          type="inventory" 
          title="Inventory"
          color="amber"
        >
          <InventoryDetail data={data} />
       </DetailOverlay>

       <DiceRollModal result={rollResult} onClose={() => setRollResult(null)} />
       
       {showPortraitGen && (
         <PortraitGenerator 
            currentPortrait={data.portraitUrl}
            onUpdate={onUpdatePortrait}
            onClose={() => setShowPortraitGen(false)}
            characterDescription={`${data.race} ${data.class} named ${data.name}.`}
         />
       )}

       {showAskDM && (
         <AskDMModal onClose={() => setShowAskDM(false)} />
       )}

       {showSettings && (
         <SettingsModal 
            data={data} 
            onSave={onUpdateData} 
            onClose={() => setShowSettings(false)} 
         />
       )}
    </div>
  );
};

export default Dashboard;