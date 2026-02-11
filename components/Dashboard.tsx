import React, { useState } from 'react';
import { CharacterData, StackType, RollResult, Item, Feature, Spell, RollMode, DiceGroup } from '../types';
import CardStack from './CardStack';
import DetailOverlay from './DetailOverlay';
import VitalsDetail from './details/VitalsDetail';
import CombatDetail from './details/CombatDetail';
import SkillsDetail from './details/SkillsDetail';
import FeaturesDetail from './details/FeaturesDetail';
import InventoryDetail from './details/InventoryDetail';
import JournalDetail from './details/JournalDetail';
import SpellsDetail from './details/SpellsDetail';
import DiceRollModal from './DiceRollModal';
import PortraitGenerator from './PortraitGenerator';
import AskDMModal from './AskDMModal';
import SettingsModal from './SettingsModal';
import ShopModal from './ShopModal';
import LevelUpModal from './LevelUpModal';
import ItemDetailModal from './ItemDetailModal';
import RestModal from './RestModal';
import ErrorBoundary from './ErrorBoundary';
import { Heart, Sword, Brain, Sparkles, Backpack, Edit2, MessageSquare, Settings, LogOut, Book, ShoppingBag, Wand2, ChevronDown } from 'lucide-react';

interface DashboardProps {
  data: CharacterData;
  onUpdatePortrait: (url: string) => void;
  onUpdateData: (newData: Partial<CharacterData>) => void;
  onExit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onUpdatePortrait, onUpdateData, onExit }) => {
  const [activeStack, setActiveStack] = useState<StackType | null>(null);
  const [rollResult, setRollResult] = useState<RollResult | null>(null);
  const [rollMode, setRollMode] = useState<RollMode>('normal');
  const [showPortraitGen, setShowPortraitGen] = useState(false);
  const [showAskDM, setShowAskDM] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<Item | Feature | Spell | null>(null);

  const handleRoll = (label: string, baseModifier: number, expression: string) => {
    // Regex to find all dice groups and flat modifiers
    const parts = expression.replace(/\s+/g, '').split(/(?=[+-])/);
    const diceGroups: DiceGroup[] = [];
    let total = 0;
    let finalModifier = baseModifier;

    parts.forEach(part => {
      const diceMatch = part.match(/^([+-]?\d+)?d(\d+)$/i);
      const modMatch = part.match(/^([+-]\d+)$/);

      if (diceMatch) {
        const sign = part.startsWith('-') ? -1 : 1;
        const numDice = Math.abs(parseInt(diceMatch[1])) || 1;
        const sides = parseInt(diceMatch[2]);
        const rolls: number[] = [];

        if (sides === 20 && numDice === 1 && rollMode !== 'normal') {
          const r1 = Math.floor(Math.random() * 20) + 1;
          const r2 = Math.floor(Math.random() * 20) + 1;
          
          if (rollMode === 'advantage') {
            const high = Math.max(r1, r2);
            const low = Math.min(r1, r2);
            rolls.push(high);
            total += high * sign;
            diceGroups.push({ sides, rolls: [high], dropped: low });
          } else {
            const high = Math.max(r1, r2);
            const low = Math.min(r1, r2);
            rolls.push(low);
            total += low * sign;
            diceGroups.push({ sides, rolls: [low], dropped: high });
          }
        } else {
          for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll * sign;
          }
          diceGroups.push({ sides, rolls });
        }
      } else if (modMatch) {
        finalModifier += parseInt(modMatch[1]);
      } else if (!part.includes('d')) {
        const val = parseInt(part);
        if (!isNaN(val)) finalModifier += val;
      }
    });

    total += finalModifier;

    setRollResult({
      label,
      total,
      expression,
      diceGroups,
      modifier: finalModifier,
      mode: rollMode
    });
  };

  const totalSlots = data.spellSlots.reduce((sum, s) => sum + s.max, 0);
  const currentSlots = data.spellSlots.reduce((sum, s) => sum + s.current, 0);

  return (
    <div className="min-h-screen bg-obsidian text-zinc-300 pb-20 selection:bg-indigo-500/30">
       <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/10 via-obsidian/50 to-obsidian pointer-events-none" />

       <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 lg:pt-12 relative z-10">
         {/* Character Header */}
         <header className="flex flex-wrap items-center gap-4 lg:gap-8 mb-10 lg:mb-16">
            <button onClick={onExit} className="p-2 text-zinc-600 hover:text-white transition-colors">
                <LogOut size={22} className="rotate-180" />
            </button>
            
            <div className="relative group cursor-pointer" onClick={() => setShowPortraitGen(true)}>
              <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-3xl overflow-hidden border-2 border-white/5 shadow-2xl ring-1 ring-white/10 group-hover:ring-amber-500/50 transition-all duration-500">
                 <img src={data.portraitUrl} alt={data.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 size={20} className="text-white" />
                 </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-obsidian text-[10px] font-black px-2 py-1 rounded-lg border border-zinc-800 shadow-xl text-amber-500 tracking-tighter">
                LVL {data.level}
              </div>
            </div>

            <div className="flex-grow min-w-0">
              <h1 className="text-3xl lg:text-5xl font-display font-black text-white leading-none tracking-tight truncate drop-shadow-md">{data.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{data.race} &bull; {data.class}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto sm:justify-end">
                {/* Roll Mode Selector */}
                <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
                   {(['advantage', 'normal', 'disadvantage'] as RollMode[]).map((mode) => (
                     <button
                        key={mode}
                        onClick={() => setRollMode(mode)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                          rollMode === mode 
                          ? mode === 'advantage' ? 'bg-green-600 text-white shadow-lg shadow-green-900/40' :
                            mode === 'disadvantage' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' :
                            'bg-zinc-700 text-white'
                          : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                     >
                       {mode === 'normal' ? 'Norm' : mode === 'advantage' ? 'Adv' : 'Dis'}
                     </button>
                   ))}
                </div>

                <div className="h-10 w-px bg-zinc-800 mx-2" />

                <button onClick={() => setShowAskDM(true)} className="p-3 bg-amber-950/20 text-amber-500 border border-amber-500/20 rounded-xl hover:bg-amber-900/40 transition-all">
                    <MessageSquare size={20} className="mx-auto" />
                </button>
                <button onClick={() => setShowSettings(true)} className="p-3 bg-zinc-900 text-zinc-500 border border-zinc-800 rounded-xl hover:text-white transition-all">
                    <Settings size={20} className="mx-auto" />
                </button>
            </div>
         </header>

         {/* Grid Layout */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            
            {/* Vitals - Large span */}
            <div className="col-span-2 h-44">
                <CardStack type="vitals" title="Vitality" color="red" onClick={() => setActiveStack('vitals')} icon={<Heart size={18} />}>
                    <div className="flex items-center justify-around h-full">
                        <div className="text-center">
                            <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Health Points</span>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-mono text-green-400 font-black">{data.hp.current}</span>
                                <span className="text-lg text-zinc-600 font-bold">/ {data.hp.max}</span>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-zinc-800" />
                        <div className="text-center">
                            <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Defense</span>
                            <span className="text-4xl font-display font-black text-white">{data.ac}</span>
                        </div>
                    </div>
                </CardStack>
            </div>

            {/* Initiative */}
            <div className="h-44">
                <CardStack type="combat" title="Initiative" color="orange" onClick={() => handleRoll('Initiative', data.initiative, '1d20')} icon={<Sword size={18} />}>
                    <div className="text-center">
                        <span className="text-5xl font-display font-black text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.2)]">
                            {data.initiative >= 0 ? '+' : ''}{data.initiative}
                        </span>
                        <p className="text-[9px] text-zinc-600 font-bold uppercase mt-2">Tap to Roll</p>
                    </div>
                </CardStack>
            </div>

            {/* Proficiency */}
            <div className="h-44">
                <CardStack type="skills" title="Talents" color="blue" onClick={() => setActiveStack('skills')} icon={<Brain size={18} />}>
                    <div className="text-center space-y-1">
                        <span className="text-4xl font-display font-black text-blue-400">
                            +{Math.ceil(data.level / 4) + 1}
                        </span>
                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">Proficiency Bonus</p>
                    </div>
                </CardStack>
            </div>

            {/* row 2 */}
            <div className="col-span-2 h-40">
                 <CardStack type="spells" title="Grimoire" color="cyan" onClick={() => setActiveStack('spells')} icon={<Wand2 size={18} />}>
                    <div className="flex justify-between items-center px-2">
                        <div className="space-y-1">
                            <span className="block text-2xl font-mono text-cyan-400 font-black">{currentSlots}/{totalSlots}</span>
                            <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Slots Available</span>
                        </div>
                        <div className="text-right">
                             <span className="block text-sm font-bold text-white truncate max-w-[120px]">{data.spells[0]?.name || "N/A"}</span>
                             <span className="text-[9px] text-zinc-600 uppercase font-black">Top spell</span>
                        </div>
                    </div>
                </CardStack>
            </div>

            <div className="h-40">
                <CardStack type="inventory" title="Inventory" color="amber" onClick={() => setActiveStack('inventory')} icon={<ShoppingBag size={18} />}>
                    <div className="text-center">
                         <span className="block text-xl font-mono font-black text-amber-400">{data.inventory.gold.toFixed(0)} GP</span>
                         <p className="text-[9px] text-zinc-600 uppercase font-black mt-1">Currency</p>
                    </div>
                </CardStack>
            </div>

            <div className="h-40">
                <CardStack type="journal" title="Journal" color="purple" onClick={() => setActiveStack('journal')} icon={<Book size={18} />}>
                    <div className="text-center opacity-50 px-2 overflow-hidden">
                        <p className="text-[10px] italic leading-tight line-clamp-3">
                           {data.journal[0]?.content || "Your legend begins here..."}
                        </p>
                    </div>
                </CardStack>
            </div>
         </div>
       </div>

       {/* Overlays */}
       {activeStack && (
         <DetailOverlay isOpen={!!activeStack} onClose={() => setActiveStack(null)} type={activeStack} title={activeStack.toUpperCase()} color="indigo">
            {activeStack === 'vitals' && <VitalsDetail data={data} onUpdate={onUpdateData} onLevelUp={() => setShowLevelUp(true)} onRest={() => setShowRest(true)} />}
            {activeStack === 'combat' && <CombatDetail data={data} onRoll={handleRoll} />}
            {activeStack === 'skills' && <SkillsDetail data={data} onRoll={handleRoll} />}
            {activeStack === 'spells' && <SpellsDetail data={data} onUpdate={onUpdateData} onInspect={setSelectedItemForDetail} />}
            {activeStack === 'features' && <FeaturesDetail data={data} onInspect={setSelectedItemForDetail} />}
            {activeStack === 'inventory' && <InventoryDetail data={data} onShop={() => setShowShop(true)} onInspect={setSelectedItemForDetail} onUpdate={onUpdateData} />}
            {activeStack === 'journal' && <JournalDetail data={data} onUpdate={onUpdateData} />}
         </DetailOverlay>
       )}

       {/* Utility Modals */}
       <DiceRollModal result={rollResult} onClose={() => setRollResult(null)} />
       {showPortraitGen && <PortraitGenerator currentPortrait={data.portraitUrl} onUpdate={onUpdatePortrait} onClose={() => setShowPortraitGen(false)} characterDescription={`${data.race} ${data.class}`} />}
       {showAskDM && <AskDMModal onClose={() => setShowAskDM(false)} />}
       {showSettings && <SettingsModal data={data} onSave={onUpdateData} onClose={() => setShowSettings(false)} />}
       {showShop && <ShopModal data={data} onUpdate={onUpdateData} onClose={() => setShowShop(false)} />}
       {showLevelUp && <LevelUpModal data={data} onUpdate={onUpdateData} onClose={() => setShowLevelUp(false)} />}
       {showRest && <RestModal data={data} onUpdate={onUpdateData} onClose={() => setShowRest(false)} />}
       {selectedItemForDetail && <ItemDetailModal item={selectedItemForDetail} onClose={() => setSelectedItemForDetail(null)} />}
    </div>
  );
};

export default Dashboard;