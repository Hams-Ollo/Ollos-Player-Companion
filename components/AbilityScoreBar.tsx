import React from 'react';
import { CharacterData, StatKey, RollMode } from '../types';
import { getClassTheme } from '../lib/themes';

interface AbilityScoreBarProps {
  data: CharacterData;
  onRoll: (label: string, modifier: number, die: string) => void;
}

const STAT_LABELS: Record<StatKey, string> = {
  STR: 'Strength',
  DEX: 'Dexterity',
  CON: 'Constitution',
  INT: 'Intelligence',
  WIS: 'Wisdom',
  CHA: 'Charisma',
};

const STAT_ORDER: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

const AbilityScoreBar: React.FC<AbilityScoreBarProps> = ({ data, onRoll }) => {
  const theme = getClassTheme(data.class);

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3">
      {STAT_ORDER.map((key) => {
        const stat = data.stats[key];
        if (!stat) return null;
        const isProficient = stat.proficientSave;

        return (
          <button
            key={key}
            onClick={() => onRoll(`${STAT_LABELS[key]} Check`, stat.modifier, '1d20')}
            className={`
              relative bg-zinc-900/80 border border-zinc-800 rounded-xl p-2 sm:p-3
              hover:bg-zinc-800/80 hover:border-zinc-700 active:scale-95
              transition-all duration-200 group text-center
            `}
            title={`${STAT_LABELS[key]}: Roll 1d20${stat.modifier >= 0 ? '+' : ''}${stat.modifier}`}
          >
            {/* Stat abbreviation */}
            <span className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
              {key}
            </span>

            {/* Large modifier */}
            <span className={`block text-xl sm:text-2xl font-display font-black ${theme.text} leading-tight`}>
              {stat.modifier >= 0 ? '+' : ''}{stat.modifier}
            </span>

            {/* Raw score pill */}
            <span className="block text-[9px] sm:text-[10px] font-mono text-zinc-600 mt-0.5">
              {stat.score}
            </span>

            {/* Saving throw proficiency dot */}
            {isProficient && (
              <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-${theme.accent}`} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AbilityScoreBar;
