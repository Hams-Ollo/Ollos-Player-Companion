import React, { useState } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { Combatant } from '../types';
import { updateEncounter } from '../lib/campaigns';
import { Swords, SkipForward, XCircle, Plus, Minus, Shield, Heart, Loader2 } from 'lucide-react';

const TYPE_BADGE: Record<string, string> = {
  pc:      'bg-blue-900/30 text-blue-400 border-blue-500/20',
  npc:     'bg-amber-900/30 text-amber-400 border-amber-500/20',
  monster: 'bg-red-900/30 text-red-400 border-red-500/20',
};

const CombatTracker: React.FC = () => {
  const { activeEncounter, advanceTurn, endCombat } = useCampaign();

  const [confirmEnd, setConfirmEnd] = useState(false);
  const [ending, setEnding]         = useState(false);
  const [advancing, setAdvancing]   = useState(false);
  const [hpBusy, setHpBusy]         = useState<string | null>(null);

  if (!activeEncounter) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-600 gap-3">
        <Swords size={40} className="opacity-30" />
        <p className="text-sm">No active encounter.</p>
      </div>
    );
  }

  const combatants: Combatant[] = activeEncounter.combatants ?? [];
  const currentTurnIdx          = activeEncounter.currentTurnIndex ?? 0;

  const handleAdvanceTurn = async () => {
    if (advancing) return;
    setAdvancing(true);
    try { await advanceTurn(); } finally { setAdvancing(false); }
  };

  const handleEndCombat = async () => {
    if (!confirmEnd) { setConfirmEnd(true); return; }
    setEnding(true);
    try { await endCombat(); } finally { setEnding(false); setConfirmEnd(false); }
  };

  const handleHpChange = async (combatantId: string, delta: number) => {
    if (hpBusy) return;
    setHpBusy(combatantId);
    try {
      const updated = combatants.map(c =>
        c.id === combatantId
          ? { ...c, hp: Math.max(0, Math.min(c.maxHp, c.hp + delta)) }
          : c,
      );
      await updateEncounter(activeEncounter.campaignId, activeEncounter.id, { combatants: updated });
    } finally {
      setHpBusy(null);
    }
  };

  const hpColor = (hp: number, maxHp: number) => {
    const pct = maxHp > 0 ? hp / maxHp : 1;
    if (pct > 0.66) return 'text-green-400';
    if (pct > 0.33) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-black text-white">{activeEncounter.name}</h2>
          <span className="text-xs text-zinc-500">Round {activeEncounter.round}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAdvanceTurn}
            disabled={advancing}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 text-sm font-bold rounded-xl transition-colors border border-zinc-700"
          >
            {advancing ? <Loader2 size={14} className="animate-spin" /> : <SkipForward size={14} />}
            Next Turn
          </button>
          <button
            onClick={handleEndCombat}
            disabled={ending}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all border ${
              confirmEnd
                ? 'bg-red-700 hover:bg-red-600 text-white border-red-600 animate-pulse'
                : 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border-red-500/20'
            }`}
          >
            {ending ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
            {confirmEnd ? 'Confirm End' : 'End Combat'}
          </button>
        </div>
      </div>

      {/* Type legend */}
      <div className="flex gap-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500/50" />PC</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500/50" />NPC</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500/50" />Monster</span>
      </div>

      {/* Initiative order */}
      <div className="space-y-2">
        {combatants.length === 0 && (
          <p className="text-center text-zinc-600 text-sm py-8">No combatants in this encounter.</p>
        )}
        {combatants.map((c, i) => {
          const isCurrent = i === currentTurnIdx;
          const busy      = hpBusy === c.id;
          return (
            <div
              key={c.id ?? i}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-amber-900/20 border-amber-500/40 shadow-lg shadow-amber-900/10'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              {/* Initiative */}
              <div className="w-7 text-center shrink-0">
                <span className="font-mono text-sm font-bold text-zinc-400">{c.initiative}</span>
              </div>

              {/* Type badge */}
              <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${TYPE_BADGE[c.type] ?? TYPE_BADGE.monster}`}>
                {c.type}
              </span>

              {/* Name */}
              <span className={`flex-1 font-bold text-sm truncate ${isCurrent ? 'text-amber-300' : 'text-zinc-200'}`}>
                {c.name}
                {isCurrent && <span className="ml-2 text-[9px] font-black text-amber-500 uppercase tracking-widest">Active</span>}
              </span>

              {/* HP controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleHpChange(c.id, -1)}
                  disabled={busy || c.hp <= 0}
                  aria-label={`Decrease HP for ${c.name}`}
                  className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 hover:bg-red-900/50 text-zinc-500 hover:text-red-400 disabled:opacity-30 transition-colors"
                >
                  <Minus size={10} />
                </button>
                <div className="flex items-center gap-1 w-[4.5rem] justify-center">
                  <Heart size={10} className={hpColor(c.hp, c.maxHp)} />
                  <span className={`text-xs font-bold ${hpColor(c.hp, c.maxHp)}`}>{c.hp}</span>
                  <span className="text-zinc-600 text-xs">/{c.maxHp}</span>
                </div>
                <button
                  onClick={() => handleHpChange(c.id, 1)}
                  disabled={busy || c.hp >= c.maxHp}
                  aria-label={`Increase HP for ${c.name}`}
                  className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 hover:bg-green-900/50 text-zinc-500 hover:text-green-400 disabled:opacity-30 transition-colors"
                >
                  <Plus size={10} />
                </button>
              </div>

              {/* AC */}
              <div className="flex items-center gap-1 text-xs text-zinc-500 shrink-0">
                <Shield size={10} />
                {c.ac}
              </div>

              {/* Conditions */}
              {c.conditions?.length > 0 && (
                <span className="text-[9px] text-amber-400 font-bold shrink-0 truncate max-w-[80px]">
                  {c.conditions.join(', ')}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Cancel end-combat confirm */}
      {confirmEnd && !ending && (
        <button
          onClick={() => setConfirmEnd(false)}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors w-full text-center pt-1"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default CombatTracker;
