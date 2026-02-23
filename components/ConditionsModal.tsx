import React, { useState } from 'react';
import { CharacterData } from '../types';
import { X, Activity } from 'lucide-react';

const CONDITIONS = [
  'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled',
  'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
  'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious',
] as const;

const CONDITION_COLOURS: Record<string, string> = {
  Blinded:       'bg-zinc-800 border-zinc-600 text-zinc-300',
  Charmed:       'bg-pink-900/30 border-pink-500/40 text-pink-300',
  Deafened:      'bg-zinc-800 border-zinc-600 text-zinc-300',
  Frightened:    'bg-purple-900/30 border-purple-500/40 text-purple-300',
  Grappled:      'bg-orange-900/30 border-orange-500/40 text-orange-300',
  Incapacitated: 'bg-red-900/30 border-red-500/40 text-red-300',
  Invisible:     'bg-sky-900/30 border-sky-500/40 text-sky-300',
  Paralyzed:     'bg-red-900/40 border-red-500/60 text-red-200',
  Petrified:     'bg-stone-800 border-stone-600 text-stone-300',
  Poisoned:      'bg-green-900/30 border-green-500/40 text-green-300',
  Prone:         'bg-amber-900/30 border-amber-500/40 text-amber-300',
  Restrained:    'bg-orange-900/40 border-orange-500/50 text-orange-300',
  Stunned:       'bg-yellow-900/30 border-yellow-500/40 text-yellow-300',
  Unconscious:   'bg-red-950/40 border-red-600/60 text-red-200',
};

interface ConditionsModalProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
  onClose: () => void;
}

const ConditionsModal: React.FC<ConditionsModalProps> = ({ data, onUpdate, onClose }) => {
  const [active, setActive]    = useState<string[]>(data.activeConditions ?? []);
  const [exhaustion, setExh]   = useState<number>(data.exhaustionLevel ?? 0);

  const toggle = (condition: string) => {
    setActive(prev =>
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition],
    );
  };

  const save = () => {
    onUpdate({ activeConditions: active, exhaustionLevel: exhaustion });
    onClose();
  };

  const clearAll = () => {
    setActive([]);
    setExh(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-red-400" />
            <h2 className="font-black text-white">Conditions</h2>
          </div>
          <button onClick={onClose} title="Close" className="p-1.5 text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-5">
          {/* Conditions grid */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Status Conditions</h3>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map(c => {
                const isActive = active.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggle(c)}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-bold text-left transition-all ${
                      isActive
                        ? CONDITION_COLOURS[c]
                        : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exhaustion */}
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
              Exhaustion <span className="text-zinc-600 normal-case tracking-normal font-normal">(level {exhaustion}/6)</span>
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setExh(0)}
                className={`w-10 h-10 rounded-xl border text-sm font-bold transition-all ${
                  exhaustion === 0
                    ? 'bg-zinc-600 border-zinc-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'
                }`}
              >
                0
              </button>
              {[1, 2, 3, 4, 5, 6].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setExh(lvl)}
                  className={`w-10 h-10 rounded-xl border text-sm font-bold transition-all ${
                    exhaustion === lvl
                      ? lvl >= 5 ? 'bg-red-700 border-red-600 text-white'
                        : lvl >= 3 ? 'bg-orange-700 border-orange-600 text-white'
                        : 'bg-amber-700 border-amber-600 text-white'
                      : exhaustion >= lvl
                        ? 'bg-amber-900/20 border-amber-700/40 text-amber-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            {exhaustion > 0 && (
              <p className="text-xs text-zinc-500 mt-2">
                {exhaustion === 1 && 'Disadvantage on ability checks'}
                {exhaustion === 2 && 'Speed halved'}
                {exhaustion === 3 && 'Disadvantage on attack rolls and saving throws'}
                {exhaustion === 4 && 'Hit point maximum halved'}
                {exhaustion === 5 && 'Speed reduced to 0'}
                {exhaustion === 6 && 'Death'}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-zinc-800 shrink-0">
          <button
            onClick={clearAll}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-sm font-bold rounded-xl transition-colors border border-zinc-800"
          >
            Clear All
          </button>
          <button
            onClick={save}
            className="flex-1 px-4 py-2.5 bg-red-700 hover:bg-red-600 text-white text-sm font-black rounded-xl transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConditionsModal;
