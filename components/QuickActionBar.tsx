import React from 'react';
import { CharacterData, Attack, StatKey } from '../types';
import { getClassTheme } from '../lib/themes';
import { DND_CLASSES } from '../constants';
import { Sword, Wand2, Crosshair, Sparkles } from 'lucide-react';

interface QuickActionBarProps {
  data: CharacterData;
  onRoll: (label: string, modifier: number, die: string) => void;
}

const QuickActionBar: React.FC<QuickActionBarProps> = ({ data, onRoll }) => {
  const theme = getClassTheme(data.class);

  // Build action chips from attacks, cantrips, and key features
  const actionChips: { label: string; subLabel: string; icon: React.ReactNode; onAction: () => void; variant: 'weapon' | 'spell' | 'feature' }[] = [];

  // Weapon attacks
  data.attacks.forEach((attack) => {
    actionChips.push({
      label: attack.name,
      subLabel: `+${attack.bonus} | ${attack.damage}`,
      icon: <Sword size={12} />,
      onAction: () => onRoll(`Attack (${attack.name})`, attack.bonus, '1d20'),
      variant: 'weapon',
    });
  });

  // Cantrips (level 0 spells)
  const profBonus = Math.ceil(data.level / 4) + 1;
  const classData = DND_CLASSES.find(c => c.name.toLowerCase() === data.class?.toLowerCase());
  const castingAbilityKey = classData?.spellcastingAbility as StatKey | undefined;
  const spellMod = castingAbilityKey ? (data.stats[castingAbilityKey]?.modifier ?? 0) : 0;
  const spellAttackBonus = profBonus + spellMod;

  data.spells.filter(s => s.level === 0).forEach((cantrip) => {
    const isAttackCantrip = cantrip.description?.toLowerCase().includes('attack roll') ||
                            cantrip.description?.toLowerCase().includes('spell attack');
    actionChips.push({
      label: cantrip.name,
      subLabel: isAttackCantrip ? `+${spellAttackBonus} atk` : 'At Will',
      icon: <Sparkles size={12} />,
      onAction: () => {
        if (isAttackCantrip) {
          onRoll(`${cantrip.name} (Attack)`, spellAttackBonus, '1d20');
        }
      },
      variant: 'spell',
    });
  });

  // Sneak Attack (scales with level)
  const sneakAttack = data.features.find(f => f.name === 'Sneak Attack');
  if (sneakAttack) {
    const sneakDice = Math.ceil(data.level / 2);
    actionChips.push({
      label: 'Sneak Attack',
      subLabel: `${sneakDice}d6`,
      icon: <Crosshair size={12} />,
      onAction: () => onRoll('Sneak Attack', 0, `${sneakDice}d6`),
      variant: 'feature',
    });
  }

  // Second Wind (Fighter)
  const secondWind = data.features.find(f => f.name === 'Second Wind');
  if (secondWind) {
    actionChips.push({
      label: 'Second Wind',
      subLabel: `1d10+${data.level}`,
      icon: <Wand2 size={12} />,
      onAction: () => onRoll('Second Wind', data.level, '1d10'),
      variant: 'feature',
    });
  }

  if (actionChips.length === 0) {
    return null;
  }

  const variantStyles = {
    weapon: 'border-orange-800/40 bg-orange-950/20 text-orange-300 hover:bg-orange-900/30 hover:border-orange-700/50',
    spell: 'border-cyan-800/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-900/30 hover:border-cyan-700/50',
    feature: 'border-purple-800/40 bg-purple-950/20 text-purple-300 hover:bg-purple-900/30 hover:border-purple-700/50',
  };

  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {actionChips.map((chip, idx) => (
          <button
            key={`${chip.label}-${idx}`}
            onClick={chip.onAction}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-xl border
              text-xs font-bold whitespace-nowrap shrink-0
              active:scale-95 transition-all duration-200
              ${variantStyles[chip.variant]}
            `}
          >
            {chip.icon}
            <span>{chip.label}</span>
            <span className="font-mono text-[10px] opacity-70">{chip.subLabel}</span>
          </button>
        ))}
      </div>

      {/* Fade hint on right edge */}
      {actionChips.length > 3 && (
        <div className="absolute top-0 right-0 bottom-1 w-8 bg-gradient-to-l from-obsidian to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default QuickActionBar;
