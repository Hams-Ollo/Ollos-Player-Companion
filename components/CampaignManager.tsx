import React, { useState } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { useAuth } from '../contexts/AuthContext';
import { Users, Plus, Hash, Copy, Crown, ChevronRight, LogOut, Loader2, Check, AlertTriangle, Mail, X, Shield, Trash2 } from 'lucide-react';

const CampaignManager: React.FC = () => {
  const { user } = useAuth();
  const {
    campaigns,
    activeCampaign,
    setActiveCampaignId,
    members,
    myRole,
    isDM,
    pendingInvites,
    isLoading,
    createCampaign,
    joinByCode,
    leaveCampaign,
    archiveCampaign,
    deleteCampaign,
    acceptInvite,
    declineInvite,
  } = useCampaign();

  const [showCreate, setShowCreate] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newCampaignName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await createCampaign(newCampaignName.trim(), newCampaignDesc.trim() || undefined);
      setNewCampaignName('');
      setNewCampaignDesc('');
      setShowCreate(false);
    } catch (e: any) {
      setError(e.message || 'Failed to create campaign');
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCodeInput.trim()) return;
    setJoining(true);
    setError(null);
    try {
      const campaign = await joinByCode(joinCodeInput.trim());
      if (!campaign) {
        setError('No campaign found with that code. Check the code and try again.');
      } else {
        setJoinCodeInput('');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to join campaign');
    } finally {
      setJoining(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleLeaveCampaign = async () => {
    if (!confirm('Are you sure you want to leave this campaign?')) return;
    try {
      await leaveCampaign();
    } catch (e: any) {
      setError(e.message || 'Failed to leave campaign');
    }
  };

  const handleArchiveCampaign = async () => {
    if (!confirm('Archive this campaign? It will no longer be active for any members.')) return;
    try {
      await archiveCampaign();
    } catch (e: any) {
      setError(e.message || 'Failed to archive campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId: string, campaignName: string) => {
    if (!confirm(`Permanently delete "${campaignName}"? This cannot be undone.`)) return;
    try {
      await deleteCampaign(campaignId);
    } catch (e: any) {
      setError(e.message || 'Failed to delete campaign');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="animate-spin text-amber-500 mx-auto" size={32} />
        <p className="text-zinc-500 text-sm mt-3">Loading campaigns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-sm animate-in fade-in duration-300">
          <AlertTriangle size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest pl-1 flex items-center gap-2">
            <Mail size={12} /> Pending Invites ({pendingInvites.length})
          </h3>
          {pendingInvites.map(invite => (
            <div key={invite.id} className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">{invite.campaignName}</h4>
                <p className="text-xs text-zinc-500">Invited as {invite.role}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => acceptInvite(invite.id)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => declineInvite(invite.id)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-bold rounded-lg transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Join Grid */}
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
                maxLength={60}
              />
              <textarea
                placeholder="Short description (optional)..."
                value={newCampaignDesc}
                onChange={e => setNewCampaignDesc(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                rows={2}
                maxLength={200}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={creating || !newCampaignName.trim()}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {creating ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : 'Create'}
                </button>
                <button onClick={() => { setShowCreate(false); setError(null); }} className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm font-bold rounded-lg">
                  Cancel
                </button>
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
                  value={joinCodeInput}
                  onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-3 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono tracking-wider"
                  maxLength={6}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                />
              </div>
              <button
                onClick={handleJoin}
                disabled={joining || !joinCodeInput.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                {joining ? <Loader2 size={14} className="animate-spin" /> : 'Join'}
              </button>
            </div>
            <p className="text-[10px] text-zinc-600">Ask your DM for the 6-character code</p>
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Your Campaigns</h3>
        {campaigns.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
            <p className="text-zinc-600 italic">No campaigns yet. Create one or join with a code!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {campaigns.map(camp => {
              const isActive = camp.id === activeCampaign?.id;
              const userIsDM = camp.dmId === user?.uid;
              return (
                <div
                  key={camp.id}
                  className={`bg-zinc-900 border p-4 rounded-xl flex items-center justify-between group transition-all duration-200 ${
                    isActive ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-lg flex items-center gap-2 truncate">
                      {camp.name}
                      {userIsDM && (
                        <span className="text-[10px] bg-amber-900/30 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded shrink-0">DM</span>
                      )}
                      {!userIsDM && (
                        <span className="text-[10px] bg-blue-900/30 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded shrink-0">Player</span>
                      )}
                      {camp.status === 'archived' && (
                        <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded shrink-0">Archived</span>
                      )}
                    </h4>
                    {camp.description && (
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">{camp.description}</p>
                    )}
                    <p className="text-xs text-zinc-600 mt-1">
                      Session #{camp.currentSessionNumber || 1} &middot; Created {new Date(camp.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {/* Join Code */}
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">Code</span>
                      <button
                        className="flex items-center gap-1 text-sm font-mono font-bold text-zinc-300 hover:text-white transition-colors"
                        onClick={() => handleCopyCode(camp.joinCode)}
                        title="Copy join code"
                      >
                        {camp.joinCode}
                        {copiedCode === camp.joinCode ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="h-8 w-px bg-zinc-800" />

                    {/* Actions */}
                    {isActive ? (
                      <div className="flex items-center gap-2">
                        {!userIsDM && (
                          <button
                            onClick={handleLeaveCampaign}
                            className="p-2 bg-zinc-800 rounded-full text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors"
                            title="Leave campaign"
                          >
                            <LogOut size={16} />
                          </button>
                        )}
                        {userIsDM && (
                          <button
                            onClick={() => handleDeleteCampaign(camp.id, camp.name)}
                            className="p-2 bg-zinc-800 rounded-full text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors"
                            title="Delete campaign"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setActiveCampaignId(null)}
                          className="px-3 py-1.5 bg-amber-600/20 text-amber-500 text-xs font-bold rounded-lg border border-amber-500/30"
                        >
                          Active
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {userIsDM && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteCampaign(camp.id, camp.name); }}
                            className="p-2 bg-zinc-800 rounded-full text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete campaign"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setActiveCampaignId(camp.id)}
                          className="p-2 bg-zinc-800 rounded-full text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white transition-colors"
                          aria-label="Enter campaign"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignManager;