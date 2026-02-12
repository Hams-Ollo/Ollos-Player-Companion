import React, { useState, useEffect } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { useAuth } from '../contexts/AuthContext';
import { CharacterData, CampaignMember } from '../types';
import { Crown, Users, Eye, Swords, ScrollText, Settings, LogOut, Hash, Copy, Check, Loader2 } from 'lucide-react';
import DMPartyOverview from './DMPartyOverview';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firestore';

interface DMDashboardProps {
  onExit: () => void;
}

const DMDashboard: React.FC<DMDashboardProps> = ({ onExit }) => {
  const { user } = useAuth();
  const {
    activeCampaign,
    members,
    isDM,
    activeEncounter,
    notes,
    updateCampaign,
    archiveCampaign,
    setActiveCampaignId,
  } = useCampaign();

  const [activeTab, setActiveTab] = useState<'overview' | 'combat' | 'notes' | 'settings'>('overview');
  const [partyCharacters, setPartyCharacters] = useState<Map<string, CharacterData>>(new Map());
  const [loadingChars, setLoadingChars] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  // Fetch all party characters
  useEffect(() => {
    if (!members.length) {
      setPartyCharacters(new Map());
      setLoadingChars(false);
      return;
    }

    setLoadingChars(true);
    const charMap = new Map<string, CharacterData>();
    let loaded = 0;
    const total = members.filter(m => m.characterId).length;

    if (total === 0) {
      setLoadingChars(false);
      return;
    }

    members.forEach(async (member) => {
      if (!member.characterId) return;
      try {
        const charDoc = await getDoc(doc(db, 'characters', member.characterId));
        if (charDoc.exists()) {
          charMap.set(member.uid, { id: charDoc.id, ...charDoc.data() } as CharacterData);
        }
      } catch {
        // skip
      } finally {
        loaded++;
        if (loaded >= total) {
          setPartyCharacters(new Map(charMap));
          setLoadingChars(false);
        }
      }
    });
  }, [members]);

  const handleCopyCode = () => {
    if (activeCampaign?.joinCode) {
      navigator.clipboard.writeText(activeCampaign.joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (!activeCampaign) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500">
        <p>No campaign selected.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Eye },
    { id: 'combat' as const, label: 'Combat', icon: Swords },
    { id: 'notes' as const, label: 'Notes', icon: ScrollText },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 selection:bg-amber-500/30">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-amber-900/5 via-[#09090b]/50 to-[#09090b] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 relative z-10">
        {/* DM Header */}
        <header className="flex flex-wrap items-center gap-4 mb-8">
          <button onClick={onExit} className="p-2 text-zinc-600 hover:text-white transition-colors" title="Back to hall">
            <LogOut size={22} className="rotate-180" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-900/20 border border-amber-500/30 flex items-center justify-center">
              <Crown size={24} className="text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-black text-white leading-none tracking-tight">
                {activeCampaign.name}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Dungeon Master</span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-600 text-xs">Session #{activeCampaign.currentSessionNumber || 1}</span>
                <span className="text-zinc-700">|</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
                  title="Copy join code"
                >
                  <Hash size={10} />
                  {activeCampaign.joinCode}
                  {copiedCode ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Users size={14} />
            <span>{members.length} member{members.length !== 1 ? 's' : ''}</span>
          </div>
        </header>

        {/* Active Encounter Banner */}
        {activeEncounter && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-xl animate-pulse">
            <Swords size={20} className="text-red-400" />
            <div className="flex-1">
              <span className="text-sm font-bold text-red-300">Combat Active: {activeEncounter.name}</span>
              <span className="text-xs text-red-500 ml-3">Round {activeEncounter.round}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex p-1 bg-zinc-900/80 rounded-xl border border-zinc-800 backdrop-blur-md mb-8 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-zinc-800 text-white shadow-lg'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="pb-20">
          {activeTab === 'overview' && (
            <DMPartyOverview
              members={members}
              partyCharacters={partyCharacters}
              loadingChars={loadingChars}
            />
          )}

          {activeTab === 'combat' && (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
              <Swords size={40} className="text-zinc-700 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Initiative Tracker</h3>
              <p className="text-zinc-600 text-sm">Coming in Phase 2 — Combat & Initiative Tracker</p>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
              <ScrollText size={40} className="text-zinc-700 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">DM Notes</h3>
              <p className="text-zinc-600 text-sm">Coming in Phase 3 — DM Notes & Campaign Management</p>
              {notes.length > 0 && (
                <p className="text-zinc-500 text-xs mt-2">{notes.length} note{notes.length !== 1 ? 's' : ''} synced</p>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-lg mx-auto space-y-6">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Campaign Settings</h3>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Campaign Name</label>
                  <p className="text-white font-bold">{activeCampaign.name}</p>
                </div>
                {activeCampaign.description && (
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Description</label>
                    <p className="text-zinc-400 text-sm">{activeCampaign.description}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Join Code</label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-500 font-bold text-lg">{activeCampaign.joinCode}</span>
                    <button onClick={handleCopyCode} className="text-zinc-500 hover:text-white transition-colors">
                      {copiedCode ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Status</label>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    activeCampaign.status === 'active' ? 'bg-green-900/30 text-green-400 border border-green-500/20' :
                    'bg-zinc-800 text-zinc-500'
                  }`}>
                    {activeCampaign.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const newSession = (activeCampaign.currentSessionNumber || 1) + 1;
                    updateCampaign({ currentSessionNumber: newSession });
                  }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold py-3 rounded-xl transition-colors"
                >
                  Advance to Session #{(activeCampaign.currentSessionNumber || 1) + 1}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DMDashboard;
