/**
 * Class Theme System
 * Maps each D&D class to a cohesive Tailwind color palette for the character UI.
 * Inspired by the physical D&D Starter Set character boards.
 */

export interface ClassTheme {
  /** Primary accent — used for borders, text highlights, and interactive elements */
  accent: string;
  /** Dark background variant — for subtle card backgrounds */
  accentDark: string;
  /** Card border class */
  border: string;
  /** Glow/shadow on hover */
  glow: string;
  /** Header gradient (top of dashboard) */
  headerGradient: string;
  /** DetailOverlay header */
  overlayHeader: string;
  /** Text accent color class */
  text: string;
  /** Ring/focus color */
  ring: string;
  /** Badge/pill bg */
  badge: string;
  /** HP-bar or progress accent — some classes override the default green */
  progressAccent?: string;
}

export const CLASS_THEMES: Record<string, ClassTheme> = {
  Barbarian: {
    accent: 'orange-500',
    accentDark: 'orange-950',
    border: 'border-orange-600',
    glow: 'shadow-orange-500/10',
    headerGradient: 'from-orange-900/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-orange-950/80 border-b-orange-900/50 text-orange-100',
    text: 'text-orange-400',
    ring: 'ring-orange-500/50',
    badge: 'bg-orange-900/30 text-orange-300 border-orange-700/40',
  },
  Bard: {
    accent: 'violet-500',
    accentDark: 'violet-950',
    border: 'border-violet-600',
    glow: 'shadow-violet-500/10',
    headerGradient: 'from-violet-900/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-violet-950/80 border-b-violet-900/50 text-violet-100',
    text: 'text-violet-400',
    ring: 'ring-violet-500/50',
    badge: 'bg-violet-900/30 text-violet-300 border-violet-700/40',
  },
  Cleric: {
    accent: 'sky-500',
    accentDark: 'sky-950',
    border: 'border-sky-600',
    glow: 'shadow-sky-500/10',
    headerGradient: 'from-sky-900/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-sky-950/80 border-b-sky-900/50 text-sky-100',
    text: 'text-sky-400',
    ring: 'ring-sky-500/50',
    badge: 'bg-sky-900/30 text-sky-300 border-sky-700/40',
  },
  Druid: {
    accent: 'emerald-500',
    accentDark: 'emerald-950',
    border: 'border-emerald-600',
    glow: 'shadow-emerald-500/10',
    headerGradient: 'from-emerald-900/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-emerald-950/80 border-b-emerald-900/50 text-emerald-100',
    text: 'text-emerald-400',
    ring: 'ring-emerald-500/50',
    badge: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/40',
  },
  Fighter: {
    accent: 'red-500',
    accentDark: 'red-950',
    border: 'border-red-700',
    glow: 'shadow-red-500/10',
    headerGradient: 'from-red-900/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-red-950/80 border-b-red-900/50 text-red-100',
    text: 'text-red-400',
    ring: 'ring-red-500/50',
    badge: 'bg-red-900/30 text-red-300 border-red-700/40',
  },
  Monk: {
    accent: 'teal-500',
    accentDark: 'teal-950',
    border: 'border-teal-600',
    glow: 'shadow-teal-500/10',
    headerGradient: 'from-teal-900/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-teal-950/80 border-b-teal-900/50 text-teal-100',
    text: 'text-teal-400',
    ring: 'ring-teal-500/50',
    badge: 'bg-teal-900/30 text-teal-300 border-teal-700/40',
  },
  Paladin: {
    accent: 'amber-500',
    accentDark: 'amber-950',
    border: 'border-amber-600',
    glow: 'shadow-amber-500/10',
    headerGradient: 'from-amber-900/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-amber-950/80 border-b-amber-900/50 text-amber-100',
    text: 'text-amber-400',
    ring: 'ring-amber-500/50',
    badge: 'bg-amber-900/30 text-amber-300 border-amber-700/40',
  },
  Ranger: {
    accent: 'green-500',
    accentDark: 'green-950',
    border: 'border-green-600',
    glow: 'shadow-green-500/10',
    headerGradient: 'from-green-900/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-green-950/80 border-b-green-900/50 text-green-100',
    text: 'text-green-400',
    ring: 'ring-green-500/50',
    badge: 'bg-green-900/30 text-green-300 border-green-700/40',
  },
  Rogue: {
    accent: 'slate-400',
    accentDark: 'slate-950',
    border: 'border-slate-500',
    glow: 'shadow-slate-400/10',
    headerGradient: 'from-slate-800/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-slate-900/80 border-b-slate-700/50 text-slate-100',
    text: 'text-slate-300',
    ring: 'ring-slate-400/50',
    badge: 'bg-slate-800/30 text-slate-300 border-slate-600/40',
  },
  Sorcerer: {
    accent: 'rose-500',
    accentDark: 'rose-950',
    border: 'border-rose-600',
    glow: 'shadow-rose-500/10',
    headerGradient: 'from-rose-900/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-rose-950/80 border-b-rose-900/50 text-rose-100',
    text: 'text-rose-400',
    ring: 'ring-rose-500/50',
    badge: 'bg-rose-900/30 text-rose-300 border-rose-700/40',
  },
  Warlock: {
    accent: 'purple-500',
    accentDark: 'purple-950',
    border: 'border-purple-600',
    glow: 'shadow-purple-500/10',
    headerGradient: 'from-purple-900/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-purple-950/80 border-b-purple-900/50 text-purple-100',
    text: 'text-purple-400',
    ring: 'ring-purple-500/50',
    badge: 'bg-purple-900/30 text-purple-300 border-purple-700/40',
  },
  Wizard: {
    accent: 'blue-500',
    accentDark: 'blue-950',
    border: 'border-blue-600',
    glow: 'shadow-blue-500/10',
    headerGradient: 'from-blue-900/20 via-obsidian/50 to-obsidian',
    overlayHeader: 'bg-blue-950/80 border-b-blue-900/50 text-blue-100',
    text: 'text-blue-400',
    ring: 'ring-blue-500/50',
    badge: 'bg-blue-900/30 text-blue-300 border-blue-700/40',
  },
};

/** Default neutral theme for unknown/missing classes */
const DEFAULT_THEME: ClassTheme = {
  accent: 'zinc-500',
  accentDark: 'zinc-950',
  border: 'border-zinc-600',
  glow: 'shadow-zinc-500/10',
  headerGradient: 'from-zinc-800/20 via-obsidian/50 to-obsidian',
  overlayHeader: 'bg-zinc-900/80 border-b-zinc-700/50 text-zinc-100',
  text: 'text-zinc-400',
  ring: 'ring-zinc-500/50',
  badge: 'bg-zinc-800/30 text-zinc-300 border-zinc-600/40',
};

/**
 * Resolve a class name to its theme. Case-insensitive, handles subclass prefixes.
 */
export function getClassTheme(className: string | undefined): ClassTheme {
  if (!className) return DEFAULT_THEME;
  // Try exact match first, then title-case
  const normalized = className.charAt(0).toUpperCase() + className.slice(1).toLowerCase();
  return CLASS_THEMES[normalized] || CLASS_THEMES[className] || DEFAULT_THEME;
}

/**
 * Map between overlay section types and their accent colors for DetailOverlay.
 */
export const SECTION_COLORS: Record<string, string> = {
  vitals: 'red',
  combat: 'orange',
  skills: 'blue',
  features: 'purple',
  spells: 'cyan',
  inventory: 'amber',
  journal: 'purple',
  party: 'green',
};
