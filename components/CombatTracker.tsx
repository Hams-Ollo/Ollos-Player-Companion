import React from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { Swords, SkipForward, XCircle } from 'lucide-react';

const CombatTracker: React.FC = () => {
  const { activeEncounter } = useCampaign();

  if (!activeEncounter) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-600 gap-3">
        <Swords size={40} className="opacity-30" />
        <p className="text-sm">No active encounter.</p>
      </div>
    );
  }

  const combatants = activeEncounter.combatants ?? [];
  const currentTurnIdx = activeEncounter.currentTurnIndex ?? 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">{activeEncounter.name}</h2>
          <span className="text-xs text-zinc-500">Round {activeEncounter.round}</span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-colors border border-zinc-700">
            <SkipForward size={14} />
            Next Turn
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-bold rounded-xl transition-colors border border-red-500/20">
            <XCircle size={14} />
            End Combat
          </button>
        </div>
      </div>

      {/* Initiative Order */}
      <div className="space-y-2">
        {combatants.length === 0 && (
          <p className="text-center text-zinc-600 text-sm py-8">No combatants in this encounter.</p>
        )}
        {combatants.map((c: any, i: number) => {
          const isCurrent = i === currentTurnIdx;
          return (
            <div
              key={c.id ?? i}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-amber-900/20 border-amber-500/40 shadow-lg'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <span className="w-8 text-center font-mono text-sm font-bold text-zinc-500">{c.initiative ?? '—'}</span>
              <span className={`flex-1 font-bold text-sm ${isCurrent ? 'text-amber-300' : 'text-zinc-200'}`}>
                {c.name ?? 'Unknown'}
              </span>
              <span className="text-xs text-zinc-500">
                HP: <span className="text-zinc-300 font-bold">{c.currentHp ?? '?'}</span>
                {c.maxHp ? <span className="text-zinc-600"> / {c.maxHp}</span> : null}
              </span>
              {c.conditions?.length > 0 && (
                <span className="text-xs text-amber-400 font-bold">{c.conditions.join(', ')}</span>
              )}
              {isCurrent && (
                <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Active</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CombatTracker;
