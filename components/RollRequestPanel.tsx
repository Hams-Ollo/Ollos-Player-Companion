import React, { useState } from 'react';
import { CampaignMember } from '../types';
import { Dice6, Send, CheckCircle, Clock, Users } from 'lucide-react';

interface RollRequestPanelProps {
  members: CampaignMember[];
}

const ROLL_TYPES = [
  'Perception', 'Stealth', 'Investigation', 'Insight',
  'Persuasion', 'Deception', 'Intimidation',
  'Saving Throw', 'Initiative', 'Custom',
] as const;

const RollRequestPanel: React.FC<RollRequestPanelProps> = ({ members }) => {
  const [rollType, setRollType] = useState('Perception');
  const [dc, setDc] = useState('');
  const [selectedUids, setSelectedUids] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const players = members.filter(m => m.role === 'player');

  const toggleMember = (uid: string) => {
    setSelectedUids(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid],
    );
  };

  const selectAll = () => setSelectedUids(players.map(m => m.uid));
  const clearAll  = () => setSelectedUids([]);

  const handleSend = () => {
    if (selectedUids.length === 0) return;
    // TODO: wire to Firestore rollRequests collection via CampaignContext
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Roll Requests</h2>
        <span className="text-xs text-zinc-600 flex items-center gap-1">
          <Users size={11} />
          {players.length} player{players.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        {/* Roll type */}
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
            Roll Type
          </label>
          <div className="flex flex-wrap gap-1">
            {ROLL_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setRollType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  rollType === t
                    ? 'bg-amber-900/30 text-amber-400 border-amber-500/30'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* DC */}
        <div className="flex gap-3 items-end">
          <div className="w-28">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">DC</label>
            <input
              type="number"
              min={1}
              max={30}
              value={dc}
              onChange={e => setDc(e.target.value)}
              placeholder="—"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Target selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Targets</label>
            <div className="flex gap-2">
              <button onClick={selectAll} className="text-xs text-zinc-500 hover:text-amber-400 transition-colors">All</button>
              <span className="text-zinc-700">·</span>
              <button onClick={clearAll}  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">None</button>
            </div>
          </div>
          {players.length === 0 ? (
            <p className="text-xs text-zinc-600">No players have joined yet.</p>
          ) : (
            <div className="space-y-1">
              {players.map(m => {
                const selected = selectedUids.includes(m.uid);
                return (
                  <button
                    key={m.uid}
                    onClick={() => toggleMember(m.uid)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      selected
                        ? 'bg-amber-900/20 border-amber-500/30 text-amber-300'
                        : 'bg-zinc-800/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      selected ? 'bg-amber-600 border-amber-500' : 'border-zinc-600'
                    }`}>
                      {selected && <CheckCircle size={10} className="text-black" />}
                    </span>
                    <span className="text-sm font-bold">{m.displayName}</span>
                    {m.lastSeen && (
                      <span className="ml-auto text-xs text-zinc-600">
                        last seen {new Date(m.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={selectedUids.length === 0 || sent}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-black rounded-xl transition-colors"
        >
          {sent ? <CheckCircle size={14} /> : <Send size={14} />}
          {sent ? 'Sent!' : `Request ${rollType}${dc ? ` (DC ${dc})` : ''}`}
        </button>
      </div>

      {/* Pending / history placeholder */}
      <div className="flex flex-col items-center justify-center py-12 text-zinc-700 gap-2">
        <Clock size={28} className="opacity-30" />
        <p className="text-xs">Live roll responses coming soon.</p>
      </div>
    </div>
  );
};

export default RollRequestPanel;
