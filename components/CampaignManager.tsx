import React, { useState } from 'react';
import { Campaign, UserProfile } from '../types';
import { Users, Plus, Hash, Copy, Crown, ChevronRight } from 'lucide-react';

interface CampaignManagerProps {
  user: UserProfile;
  campaigns: Campaign[];
  onUpdateCampaigns: (newCamps: Campaign[]) => void;
}

const CampaignManager: React.FC<CampaignManagerProps> = ({ user, campaigns, onUpdateCampaigns }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const handleCreate = () => {
    if (!newCampaignName) return;
    
    const newCampaign: Campaign = {
        id: Math.random().toString(36).substring(2, 9),
        name: newCampaignName,
        dmId: user.uid,
        description: "A new adventure begins...",
        joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        members: [{ uid: user.uid, name: user.displayName || 'DM' }],
        createdAt: Date.now()
    };

    onUpdateCampaigns([...campaigns, newCampaign]);
    setNewCampaignName('');
    setShowCreate(false);
  };

  const handleJoin = () => {
     if (!joinCode) return;
     // SIMULATION
     alert(`Feature coming soon: code "${joinCode}" will connect you to shared Firestore campaigns!`);
     setJoinCode('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Create Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/50 transition-colors group">
                {!showCreate ? (
                    <button onClick={() => setShowCreate(true)} className="w-full h-full flex flex-col items-center justify-center py-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 group-hover:bg-amber-500 flex items-center justify-center text-zinc-400 group-hover:text-black mb-3 transition-colors">
                            <Plus size={24} />
                        </div>
                        <h3 className="font-bold text-white">Create Campaign</h3>
                        <p className="text-xs text-zinc-500 mt-1">Become the Dungeon Master</p>
                    </button>
                ) : (
                    <div className="space-y-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Crown size={16} className="text-amber-500" /> New Campaign
                        </h3>
                        <input 
                           type="text" 
                           placeholder="Campaign Name..."
                           value={newCampaignName}
                           onChange={e => setNewCampaignName(e.target.value)}
                           className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                        <div className="flex gap-2">
                            <button onClick={handleCreate} className="flex-1 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold py-2 rounded-lg transition-colors">Create</button>
                            <button onClick={() => setShowCreate(false)} className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm font-bold rounded-lg">Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Join Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                     <div className="flex items-center gap-2 text-zinc-200 font-bold">
                        <Users size={20} className="text-blue-500" /> Join a Party
                     </div>
                     <div className="flex w-full gap-2">
                         <div className="relative flex-grow">
                             <Hash size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                             <input 
                                type="text"
                                placeholder="Enter Join Code"
                                value={joinCode}
                                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-3 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono tracking-wider"
                                maxLength={6}
                             />
                         </div>
                         <button onClick={handleJoin} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 rounded-lg transition-colors">Join</button>
                     </div>
                     <p className="text-[10px] text-zinc-600">Ask your DM for the 6-character code</p>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Your Campaigns</h3>
            {campaigns.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30"><p className="text-zinc-600 italic">No campaigns found.</p></div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {campaigns.map(camp => (
                        <div key={camp.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-colors">
                            <div>
                                <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                    {camp.name}
                                    {camp.dmId === user.uid && <span className="text-[10px] bg-amber-900/30 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded">DM</span>}
                                </h4>
                                <p className="text-xs text-zinc-500 mt-1">{camp.members.length} Members &middot; Created {new Date(camp.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Join Code</span>
                                    <button 
                                        className="flex items-center gap-1 text-sm font-mono font-bold text-zinc-300 hover:text-white"
                                        onClick={() => navigator.clipboard.writeText(camp.joinCode)}
                                        title="Copy Code"
                                    >
                                        {camp.joinCode} <Copy size={12} />
                                    </button>
                                </div>
                                <div className="h-8 w-px bg-zinc-800"></div>
                                <button className="p-2 bg-zinc-800 rounded-full text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white transition-colors" aria-label="View campaign">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default CampaignManager;