import React, { useState } from 'react';
import { CharacterData, StackType, RollResult, Item, Feature, Spell, RollMode } from '../types';
import { DND_CLASSES } from '../constants';
import { rollDice } from '../lib/dice';
import { getClassTheme, SECTION_COLORS } from '../lib/themes';
import CardStack from './CardStack';
import DetailOverlay from './DetailOverlay';
import AbilityScoreBar from './AbilityScoreBar';
import CombatStrip from './CombatStrip';
import QuickActionBar from './QuickActionBar';
import VitalsDetail from './details/VitalsDetail';
import CombatDetail from './details/CombatDetail';
import SkillsDetail from './details/SkillsDetail';
import FeaturesDetail from './details/FeaturesDetail';
import InventoryDetail from './details/InventoryDetail';
import JournalDetail from './details/JournalDetail';
import SpellsDetail from './details/SpellsDetail';
import DiceRollModal from './DiceRollModal';
import PortraitGenerator from './PortraitGenerator';
import PortraitLightbox from './PortraitLightbox';
import AskDMModal from './AskDMModal';
import SettingsModal from './SettingsModal';
import ShopModal from './ShopModal';
import LevelUpModal from './LevelUpModal';
import ItemDetailModal from './ItemDetailModal';
import RestModal from './RestModal';
import ConditionsModal from './ConditionsModal';
import PartyRoster from './PartyRoster';
import ErrorBoundary from './ErrorBoundary';
import { useCampaign } from '../contexts/CampaignContext';
import { Heart, Sword, Brain, Edit2, MessageSquare, Settings, LogOut, Book, ShoppingBag, Wand2, Users, Swords, Scroll, Shield, Moon, ArrowUpCircle, Store, Stethoscope, Sparkles, Activity, Crown } from 'lucide-react';

interface DashboardProps {
  data: CharacterData;
  onUpdatePortrait: (url: string) => void;
  onUpdateData: (newData: Partial<CharacterData>) => void;
  onExit: () => void;
  onSwitchToDM?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onUpdatePortrait, onUpdateData, onExit, onSwitchToDM }) => {
  const { activeCampaign, members, isDM, activeEncounter } = useCampaign();
  const [activeStack, setActiveStack] = useState<StackType | null>(null);
  const [rollResult, setRollResult] = useState<RollResult | null>(null);
  const [rollMode, setRollMode] = useState<RollMode>('normal');
  const [showPortraitLightbox, setShowPortraitLightbox] = useState(false);
  const [showPortraitGen, setShowPortraitGen] = useState(false);
  const [portraitGenInitialTab, setPortraitGenInitialTab] = useState<'text' | 'image'>('text');
  const [showAskDM, setShowAskDM] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<Item | Feature | Spell | null>(null);

  const theme = getClassTheme(data.class);
  const classData = DND_CLASSES.find(c => c.name.toLowerCase() === data.class?.toLowerCase());
  const isCaster = classData?.isCaster ?? false;

  const handleRoll = (label: string, baseModifier: number, expression: string) => {
    const result = rollDice(expression, baseModifier, rollMode);
    setRollResult({ ...result, label });
  };

  const totalSlots = data.spellSlots.reduce((sum, s) => sum + s.max, 0);
  const currentSlots = data.spellSlots.reduce((sum, s) => sum + s.current, 0);
  const equippedCount = data.inventory.items.filter(i => i.equipped).length;
  const profBonus = Math.ceil(data.level / 4) + 1;

  // Top 3 skills sorted by modifier
  const topSkills = [...data.skills].sort((a, b) => b.modifier - a.modifier).slice(0, 3);

  // Overlay color — derive from activeStack section
  const overlayColor = activeStack ? (SECTION_COLORS[activeStack] || 'red') : 'red';

  // Overlay title — nicer labels than raw type names
  const overlayTitles: Record<string, string> = {
    vitals: 'Vitals',
    combat: 'Combat',
    skills: 'Skills & Saves',
    features: 'Class Features',
    spells: 'Spellbook',
    inventory: 'Inventory',
    journal: 'Journal',
    party: 'Party',
  };

  return (
    <div className="min-h-screen bg-obsidian text-zinc-300 pb-20 selection:bg-indigo-500/30">
       {/* Class-themed gradient backdrop */}
       <div className={`absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b ${theme.headerGradient} pointer-events-none`} />

       <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 lg:pt-10 relative z-10 space-y-5">

         {/* ═══════════════════ HERO HEADER ═══════════════════ */}
         <header className="flex flex-wrap items-center gap-4 lg:gap-6">
            <button onClick={onExit} className="p-2 text-zinc-600 hover:text-white transition-colors" title="Exit to Hall">
                <LogOut size={22} className="rotate-180" />
            </button>

            {/* Portrait — click opens fullscreen lightbox */}
            <div className="relative group cursor-pointer" onClick={() => setShowPortraitLightbox(true)}>
              <div className={`w-18 h-18 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border-2 border-white/5 shadow-2xl ring-1 ${theme.ring} group-hover:ring-2 transition-all duration-500`}>
                 <img src={data.portraitUrl} alt={data.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 size={18} className="text-white" />
                 </div>
              </div>
              <div className={`absolute -bottom-1.5 -right-1.5 ${theme.badge} border text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xl tracking-tighter`}>
                LVL {data.level}
              </div>
            </div>

            {/* Name / Class / Subclass */}
            <div className="flex-grow min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white leading-none tracking-tight truncate drop-shadow-md">{data.name}</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{data.race}</span>
                <span className="text-zinc-700">&bull;</span>
                <span className={`font-bold text-xs uppercase tracking-widest ${theme.text}`}>{data.class}</span>
                {data.subclass && (
                  <>
                    <span className="text-zinc-700">&bull;</span>
                    <span className="text-zinc-600 text-xs uppercase tracking-widest">{data.subclass}</span>
                  </>
                )}
              </div>
            </div>

            {/* Roll Mode + Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto sm:justify-end">
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
                <div className="h-10 w-px bg-zinc-800 mx-1" />
                <button
                  onClick={() => onUpdateData({ heroicInspiration: !data.heroicInspiration })}
                  title={data.heroicInspiration ? 'Heroic Inspiration: Active — click to use' : 'Heroic Inspiration: Inactive'}
                  className={`p-2.5 rounded-xl border transition-all ${
                    data.heroicInspiration
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-lg shadow-amber-900/30 animate-pulse'
                      : 'bg-zinc-900 text-zinc-600 border-zinc-800 hover:text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Sparkles size={18} />
                </button>
                <button onClick={() => setShowAskDM(true)} className="p-2.5 bg-amber-950/20 text-amber-500 border border-amber-500/20 rounded-xl hover:bg-amber-900/40 transition-all" title="Ask the DM">
                    <MessageSquare size={18} />
                </button>
                <button onClick={() => setShowSettings(true)} className="p-2.5 bg-zinc-900 text-zinc-500 border border-zinc-800 rounded-xl hover:text-white transition-all" title="Settings">
                    <Settings size={18} />
                </button>
                {onSwitchToDM && (
                  <>
                    <div className="h-10 w-px bg-zinc-800 mx-1" />
                    <button
                      onClick={onSwitchToDM}
                      className="p-2.5 bg-amber-950/20 text-amber-600 border border-amber-500/20 rounded-xl hover:bg-amber-900/40 hover:text-amber-400 transition-all"
                      title="Switch to DM Screen"
                    >
                      <Crown size={18} />
                    </button>
                  </>
                )}
            </div>
         </header>

         {/* ═══════════════════ ABILITY SCORE BAR ═══════════════════ */}
         <AbilityScoreBar data={data} onRoll={handleRoll} />

         {/* ═══════════════════ COMBAT STRIP ═══════════════════ */}
         <CombatStrip
           data={data}
           onUpdate={onUpdateData}
           onRollInitiative={() => handleRoll('Initiative', data.initiative, '1d20')}
           isCaster={isCaster}
         />

         {/* ═══════════════════ ACTIVE CONDITIONS STRIP ═══════════════════ */}
         {((data.activeConditions?.length ?? 0) > 0 || (data.exhaustionLevel ?? 0) > 0) && (
           <button
             onClick={() => setShowConditions(true)}
             className="w-full flex items-center gap-2 flex-wrap px-3.5 py-2.5 bg-red-950/20 border border-red-900/30 rounded-xl hover:bg-red-950/30 transition-colors text-left"
           >
             <Activity size={12} className="text-red-400 shrink-0" />
             <span className="text-[10px] font-black uppercase tracking-widest text-red-400 shrink-0 mr-1">Active</span>
             {data.activeConditions?.map(c => (
               <span key={c} className="text-[10px] px-2 py-0.5 rounded-full border bg-red-900/30 border-red-700/40 text-red-300 font-bold">{c}</span>
             ))}
             {(data.exhaustionLevel ?? 0) > 0 && (
               <span className="text-[10px] px-2 py-0.5 rounded-full border bg-amber-900/30 border-amber-700/40 text-amber-300 font-bold">Exhaustion {data.exhaustionLevel}</span>
             )}
           </button>
         )}

         {/* ═══════════════════ UTILITY ACTION BAR ═══════════════════ */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar">
           <button
             onClick={() => setShowRest(true)}
             className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-800/40 bg-indigo-950/20 text-indigo-300 hover:bg-indigo-900/30 hover:border-indigo-700/50 text-xs font-bold whitespace-nowrap shrink-0 active:scale-95 transition-all duration-200"
           >
             <Moon size={14} />
             <span>Rest</span>
           </button>
           <button
             onClick={() => setShowLevelUp(true)}
             className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-800/40 bg-amber-950/20 text-amber-300 hover:bg-amber-900/30 hover:border-amber-700/50 text-xs font-bold whitespace-nowrap shrink-0 active:scale-95 transition-all duration-200"
           >
             <ArrowUpCircle size={14} />
             <span>Level Up</span>
           </button>
           <button
             onClick={() => setShowShop(true)}
             className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-800/40 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-900/30 hover:border-emerald-700/50 text-xs font-bold whitespace-nowrap shrink-0 active:scale-95 transition-all duration-200"
           >
             <Store size={14} />
             <span>Shop</span>
           </button>
           <button
             onClick={() => setActiveStack('vitals')}
             className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-800/40 bg-red-950/20 text-red-300 hover:bg-red-900/30 hover:border-red-700/50 text-xs font-bold whitespace-nowrap shrink-0 active:scale-95 transition-all duration-200"
           >
             <Stethoscope size={14} />
             <span>Vitals</span>
           </button>
           <button
             onClick={() => setShowConditions(true)}
             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap shrink-0 active:scale-95 transition-all duration-200 ${
               (data.activeConditions?.length ?? 0) > 0 || (data.exhaustionLevel ?? 0) > 0
                 ? 'border-red-700/60 bg-red-950/30 text-red-300 hover:bg-red-900/40 hover:border-red-600/60'
                 : 'border-zinc-800/60 bg-zinc-900/20 text-zinc-500 hover:bg-zinc-800/30 hover:text-zinc-300 hover:border-zinc-700/60'
             }`}
           >
             <Activity size={14} />
             <span>Conditions</span>
             {((data.activeConditions?.length ?? 0) + ((data.exhaustionLevel ?? 0) > 0 ? 1 : 0)) > 0 && (
               <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                 {(data.activeConditions?.length ?? 0) + ((data.exhaustionLevel ?? 0) > 0 ? 1 : 0)}
               </span>
             )}
           </button>
         </div>

         {/* ═══════════════════ QUICK ACTION BAR ═══════════════════ */}
         <QuickActionBar data={data} onRoll={handleRoll} />

         {/* ═══════════════════ SECTION CARDS ═══════════════════ */}
         <div className="grid grid-cols-2 gap-3 lg:gap-4">

            {/* Skills & Saves */}
            <div className="h-36">
                <CardStack type="skills" title="Skills & Saves" color="blue" onClick={() => setActiveStack('skills')} icon={<Brain size={16} />}>
                    <div className="space-y-1">
                      {topSkills.map(s => (
                        <div key={s.name} className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500 truncate">{s.name}</span>
                          <span className="font-mono font-bold text-blue-400">{s.modifier >= 0 ? '+' : ''}{s.modifier}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800">
                        <span className="text-zinc-600 text-[10px] uppercase tracking-wider">Prof. Bonus</span>
                        <span className="font-mono font-bold text-zinc-400">+{profBonus}</span>
                      </div>
                    </div>
                </CardStack>
            </div>

            {/* Class Features */}
            <div className="h-36">
                <CardStack type="features" title="Features" color="purple" onClick={() => setActiveStack('features')} icon={<Scroll size={16} />}>
                    <div className="text-center space-y-1">
                      <span className="text-2xl font-display font-black text-purple-400">{data.features.length}</span>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">
                        {data.features[0]?.name || 'No features yet'}
                      </p>
                    </div>
                </CardStack>
            </div>

            {/* Spellbook — only for casters */}
            {isCaster && (
              <div className="h-36">
                <CardStack type="spells" title="Spellbook" color="cyan" onClick={() => setActiveStack('spells')} icon={<Wand2 size={16} />}>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-mono text-cyan-400 font-black">{currentSlots}</span>
                        <span className="text-sm text-zinc-600 font-bold">/ {totalSlots}</span>
                      </div>
                      <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Spell Slots</p>
                    </div>
                </CardStack>
              </div>
            )}

            {/* Inventory */}
            <div className="h-36">
                <CardStack type="inventory" title="Inventory" color="amber" onClick={() => setActiveStack('inventory')} icon={<ShoppingBag size={16} />}>
                    <div className="space-y-1">
                      <span className="block text-lg font-mono font-black text-amber-400">{data.inventory.gold.toFixed(0)} GP</span>
                      <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">
                        {equippedCount} items equipped
                      </p>
                    </div>
                </CardStack>
            </div>

            {/* Combat (Attacks detail) */}
            <div className="h-36">
                <CardStack type="combat" title="Combat" color="orange" onClick={() => setActiveStack('combat')} icon={<Sword size={16} />}>
                    <div className="space-y-1">
                      <span className="text-2xl font-display font-black text-orange-400">{data.attacks.length}</span>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider truncate">
                        {data.attacks[0]?.name || 'No weapons'}
                      </p>
                    </div>
                </CardStack>
            </div>

            {/* Journal */}
            <div className="h-36">
                <CardStack type="journal" title="Journal" color="purple" onClick={() => setActiveStack('journal')} icon={<Book size={16} />}>
                    <div className="text-center opacity-60 px-1 overflow-hidden">
                        <p className="text-[10px] italic leading-tight line-clamp-3">
                           {data.journal[0]?.content || "Your legend begins here..."}
                        </p>
                    </div>
                </CardStack>
            </div>

            {/* Party Card — campaign only */}
            {activeCampaign && (
              <div className="col-span-2 h-32">
                <CardStack type="party" title="Party" color="green" onClick={() => setActiveStack('party')} icon={<Users size={16} />}>
                  <div className="flex justify-between items-center px-1">
                    <div className="space-y-1">
                      <span className="block text-base font-bold text-green-400 truncate max-w-[160px]">{activeCampaign.name}</span>
                      <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">
                        {members.length} Member{members.length !== 1 ? 's' : ''} &middot; {isDM ? 'DM' : 'Player'}
                      </span>
                    </div>
                    <div className="text-right">
                      {activeEncounter ? (
                        <div className="flex items-center gap-2">
                          <Swords size={14} className="text-red-400 animate-pulse" />
                          <span className="text-xs font-bold text-red-400">In Combat</span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-600">Session #{activeCampaign.currentSessionNumber || 1}</span>
                      )}
                    </div>
                  </div>
                </CardStack>
              </div>
            )}
         </div>
       </div>

       {/* ═══════════════════ OVERLAYS ═══════════════════ */}
       {activeStack && (
         <DetailOverlay isOpen={!!activeStack} onClose={() => setActiveStack(null)} type={activeStack} title={overlayTitles[activeStack] || activeStack.toUpperCase()} color={overlayColor}>
            {activeStack === 'vitals' && <VitalsDetail data={data} onUpdate={onUpdateData} onLevelUp={() => setShowLevelUp(true)} onRest={() => setShowRest(true)} />}
            {activeStack === 'combat' && <CombatDetail data={data} onRoll={handleRoll} />}
            {activeStack === 'skills' && <SkillsDetail data={data} onRoll={handleRoll} />}
            {activeStack === 'spells' && <SpellsDetail data={data} onUpdate={onUpdateData} onInspect={setSelectedItemForDetail} />}
            {activeStack === 'features' && <FeaturesDetail data={data} onInspect={setSelectedItemForDetail} />}
            {activeStack === 'inventory' && <InventoryDetail data={data} onShop={() => setShowShop(true)} onInspect={setSelectedItemForDetail} onUpdate={onUpdateData} />}
            {activeStack === 'journal' && <JournalDetail data={data} onUpdate={onUpdateData} />}
            {activeStack === 'party' && <PartyRoster onClose={() => setActiveStack(null)} />}
         </DetailOverlay>
       )}

       {/* ═══════════════════ UTILITY MODALS ═══════════════════ */}
       <DiceRollModal result={rollResult} onClose={() => setRollResult(null)} />

       {/* Portrait lightbox — fullscreen view with edit CTAs */}
       {showPortraitLightbox && (
         <PortraitLightbox
           portraitUrl={data.portraitUrl}
           characterName={data.name}
           onClose={() => setShowPortraitLightbox(false)}
           onEdit={(tab) => {
             setPortraitGenInitialTab(tab);
             setShowPortraitLightbox(false);
             setShowPortraitGen(true);
           }}
         />
       )}

       {showPortraitGen && (
         <PortraitGenerator
           currentPortrait={data.portraitUrl}
           onUpdate={onUpdatePortrait}
           onClose={() => setShowPortraitGen(false)}
           initialTab={portraitGenInitialTab}
           characterDescription={[
             `${data.race} ${data.class}`,
             data.subclass ? `(${data.subclass})` : null,
             data.background ? `${data.background} background` : null,
           ].filter(Boolean).join(', ')}
         />
       )}
       {showAskDM && <AskDMModal onClose={() => setShowAskDM(false)} />}
       {showSettings && <SettingsModal data={data} onSave={onUpdateData} onClose={() => setShowSettings(false)} />}
       {showShop && <ShopModal data={data} onUpdate={onUpdateData} onClose={() => setShowShop(false)} />}
       {showLevelUp && <LevelUpModal data={data} onUpdate={onUpdateData} onClose={() => setShowLevelUp(false)} />}
       {showRest && <RestModal data={data} onUpdate={onUpdateData} onClose={() => setShowRest(false)} />}
       {showConditions && <ConditionsModal data={data} onUpdate={onUpdateData} onClose={() => setShowConditions(false)} />}
       {selectedItemForDetail && <ItemDetailModal item={selectedItemForDetail} onClose={() => setSelectedItemForDetail(null)} />}
    </div>
  );
};

export default Dashboard;