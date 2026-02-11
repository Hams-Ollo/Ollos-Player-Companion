
import React, { useState } from 'react';
import { CharacterData, Campaign } from '../types';
import { Plus, Play, Trash2, Scroll, Heart, Shield, Crown, Users, LogOut, User, Lock, Dices, AlertTriangle } from 'lucide-react';
import CharacterCreationWizard from './CharacterCreationWizard';
import QuickRollModal from './QuickRollModal';
import CampaignManager from './CampaignManager';
import ErrorBoundary from './ErrorBoundary';
import { useAuth } from '../contexts/AuthContext';

interface CharacterSelectionProps {
  characters: CharacterData[];
  campaigns: Campaign[];
  onUpdateCampaigns: (camps: Campaign[]) => void;
  onSelect: (id: string) => void;
  onCreate: (data: CharacterData) => void;
  onDelete: (id: string) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ 
  characters, 
  campaigns, 
  onUpdateCampaigns, 
  onSelect, 
  onCreate, 
  onDelete 
}) => {
  const [showWizard, setShowWizard] = useState(false);
  const [showQuickRoll, setShowQuickRoll] = useState(false);
  const [activeTab, setActiveTab] = useState<'heroes' | 'campaigns'>('heroes');
  const { user, logout } = useAuth();

  const handleCreate = (newChar: CharacterData) => {
    onCreate(newChar);
    setShowWizard(false);
    setShowQuickRoll(false);
  };

  const isAtLimit = (characters || []).length >= 20;

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center relative overflow-hidden selection:bg-amber-500/30">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-[#09090b] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />

      {/* User Bar */}
      <div className="absolute top-0 right-0 p-4 z-50 flex items-center gap-4">
         <div className="flex items-center gap-2 text-zinc-400 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800/50 backdrop-blur-md">
            <User size={14} />
            <span className="text-xs font-bold">{user?.displayName || 'Guest'}</span>
         </div>
         <button 
            onClick={logout}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-full transition-colors"
            title="Log Out"
         >
             <LogOut size={18} />
         </button>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <header className="flex flex-col items-center mb-12 text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="p-3 bg-zinc-900/50 rounded-full border border-zinc-800 backdrop-blur-sm mb-2 shadow-2xl ring-1 ring-white/5">
              <Crown className="text-amber-500 w-8 h-8" strokeWidth={1.5} />
           </div>
           <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 tracking-tight drop-shadow-sm text-center">
             Adventurer's Hall
           </h1>
           <p className="text-zinc-500 text-sm font-medium">
             {(characters || []).length} / 20 Heroes Forged
           </p>
           
           {/* Navigation Tabs */}
           <div className="flex p-1 bg-zinc-900/80 rounded-xl border border-zinc-800 backdrop-blur-md mt-6">
                <button 
                    onClick={() => setActiveTab('heroes')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'heroes' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    My Heroes
                </button>
                <button 
                    onClick={() => setActiveTab('campaigns')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'campaigns' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Users size={14} /> Campaigns
                </button>
           </div>
        </header>

        {activeTab === 'heroes' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Action Group for creation */}
            <div className="flex flex-col gap-4">
                <button 
                    onClick={() => !isAtLimit && setShowWizard(true)}
                    disabled={isAtLimit}
                    className={`group relative h-[200px] w-full bg-zinc-900/40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 ${
                    isAtLimit 
                    ? 'border-zinc-800 cursor-not-allowed opacity-60' 
                    : 'border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900/60 hover:shadow-2xl hover:-translate-y-1'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 border ${
                    isAtLimit 
                    ? 'bg-zinc-800 text-zinc-600 border-zinc-700' 
                    : 'bg-zinc-800/80 group-hover:bg-amber-500 group-hover:text-black border-zinc-700'
                    }`}>
                    {isAtLimit ? <Lock size={20} /> : <Plus size={24} strokeWidth={3} />}
                    </div>
                    <span className={`font-display font-bold text-lg tracking-wide ${isAtLimit ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-white'}`}>
                    Forge New Hero
                    </span>
                    <span className="text-zinc-600 text-xs mt-1">Manual wizard</span>
                </button>

                <button 
                    onClick={() => !isAtLimit && setShowQuickRoll(true)}
                    disabled={isAtLimit}
                    className={`group relative h-[200px] w-full bg-zinc-900/40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 ${
                    isAtLimit 
                    ? 'border-zinc-800 cursor-not-allowed opacity-60' 
                    : 'border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900/60 hover:shadow-2xl hover:-translate-y-1'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 border ${
                    isAtLimit 
                    ? 'bg-zinc-800 text-zinc-600 border-zinc-700' 
                    : 'bg-zinc-800/80 group-hover:bg-indigo-600 group-hover:text-white border-zinc-700'
                    }`}>
                    {isAtLimit ? <Lock size={20} /> : <Dices size={24} strokeWidth={2.5} />}
                    </div>
                    <span className={`font-display font-bold text-lg tracking-wide ${isAtLimit ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-white'}`}>
                    Quick AI Roll
                    </span>
                    <span className="text-zinc-600 text-xs mt-1 text-center px-4">AI generated guest character</span>
                </button>
            </div>

            {/* Existing Characters */}
            {(characters || []).map((char) => {
                const isBroken = !char || !char.id || !char.name;
                return (
                  <ErrorBoundary key={char?.id || Math.random()} fallbackTitle="Hero failed to manifest">
                    <div 
                    className="group relative h-[420px] w-full bg-zinc-950 rounded-3xl overflow-hidden ring-1 ring-white/10 hover:ring-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-2 cursor-pointer"
                    onClick={() => char?.id && onSelect(char.id)}
                    >
                    {isBroken ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                            <AlertTriangle className="text-red-500" size={48} />
                            <h3 className="text-white font-bold">Corrupted Hero</h3>
                            <p className="text-zinc-500 text-xs">This data is incomplete and cannot be rendered.</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); char?.id && onDelete(char.id); }}
                                className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg border border-red-500/30 text-xs font-bold"
                            >
                                Release Spirit
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-zinc-900">
                                {char.portraitUrl ? (
                                    <img 
                                        src={char.portraitUrl} 
                                        alt={char.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-700">
                                        <User size={64} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent opacity-90 transition-opacity duration-500" />
                            </div>

                            <div className="absolute top-4 right-4 z-30">
                                <button 
                                onClick={(e) => { 
                                    e.preventDefault(); 
                                    e.stopPropagation(); 
                                    onDelete(char.id); 
                                }}
                                className="p-2.5 bg-black/40 text-zinc-400 hover:text-red-400 hover:bg-black/80 rounded-full transition-all border border-white/5 hover:border-red-500/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Delete Character"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-2xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        <Play size={28} fill="currentColor" className="ml-1" />
                                    </div>
                                </div>

                                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                                    <div className="flex items-baseline justify-between mb-1">
                                    <span className="text-amber-500 font-bold text-xs uppercase tracking-widest">{char.class || 'Class'}</span>
                                    <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Lvl {char.level || 1}</span>
                                    </div>
                                    
                                    <h3 className="text-3xl font-display font-bold text-white leading-tight mb-1 truncate drop-shadow-md">{char.name}</h3>
                                    <p className="text-zinc-400 font-medium text-sm mb-4 truncate">{char.race || 'Race'}</p>

                                    <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 mt-2">
                                    <div className="flex items-center gap-2 text-zinc-300 bg-white/5 p-2 rounded-lg backdrop-blur-sm border border-white/5 group-hover:bg-white/10 transition-colors">
                                        <Heart size={14} className="text-red-500 fill-red-500/20" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-500 uppercase font-bold leading-none mb-0.5">HP</span>
                                            <span className="font-mono font-bold text-sm leading-none">{char.hp?.current ?? 0}/{char.hp?.max ?? 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-300 bg-white/5 p-2 rounded-lg backdrop-blur-sm border border-white/5 group-hover:bg-white/10 transition-colors">
                                        <Shield size={14} className="text-blue-500 fill-blue-500/20" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-500 uppercase font-bold leading-none mb-0.5">AC</span>
                                            <span className="font-mono font-bold text-sm leading-none">{char.ac ?? 10}</span>
                                        </div>
                                    </div>
                                    </div>
                                    
                                    {char.campaign && (
                                        <div className="mt-4 flex items-center gap-2 text-zinc-500 text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Scroll size={12} />
                                            <span className="truncate max-w-[200px]">{char.campaign}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    </div>
                  </ErrorBoundary>
                );
            })}
            </div>
        ) : (
            user && (
              <CampaignManager 
                user={user} 
                campaigns={campaigns} 
                onUpdateCampaigns={onUpdateCampaigns as any} 
              />
            )
        )}
      </div>

      {showWizard && (
        <CharacterCreationWizard
          campaigns={campaigns}
          onCreate={handleCreate}
          onClose={() => setShowWizard(false)}
        />
      )}

      {showQuickRoll && (
        <QuickRollModal
          onCreate={handleCreate}
          onClose={() => setShowQuickRoll(false)}
        />
      )}
    </div>
  );
};

export default CharacterSelection;
