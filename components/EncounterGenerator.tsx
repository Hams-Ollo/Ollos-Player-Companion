import React, { useState } from 'react';
import { CharacterData, Combatant } from '../types';
import { Swords, Wand2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { generateEncounter } from '../lib/gemini';
import { useCampaign } from '../contexts/CampaignContext';

interface EncounterGeneratorProps {
  partyCharacters: Map<string, CharacterData>;
  onCombatStarted?: () => void;
}

const DIFFICULTIES = ['easy', 'medium', 'hard', 'deadly'] as const;
type Difficulty = typeof DIFFICULTIES[number];

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy:   'bg-green-900/30 text-green-400 border-green-500/20',
  medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/20',
  hard:   'bg-orange-900/30 text-orange-400 border-orange-500/20',
  deadly: 'bg-red-900/30 text-red-400 border-red-500/20',
};

const EncounterGenerator: React.FC<EncounterGeneratorProps> = ({ partyCharacters, onCombatStarted }) => {
  const { startCombat } = useCampaign();
  const [description, setDescription] = useState('');
  const [environment, setEnvironment] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [loading, setLoading] = useState(false);
  const [launchingCombat, setLaunchingCombat] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedCreature, setExpandedCreature] = useState<number | null>(null);

  const partyMembers = Array.from(partyCharacters.values());
  const partyLevels = partyMembers.map(c => c.level ?? 1);
  const partyClasses = partyMembers.map(c => c.class).filter(Boolean) as string[];
  const partySize = partyLevels.length || 4;
  const avgLevel = partySize > 0
    ? Math.round(partyLevels.reduce((a, b) => a + b, 0) / partyLevels.length)
    : 1;

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateEncounter({
        scenarioDescription: description.trim(),
        partyLevels: partyLevels.length > 0 ? partyLevels : Array(4).fill(1),
        partyClasses: partyClasses.length > 0 ? partyClasses : undefined,
        difficulty,
        environment: environment.trim() || undefined,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to generate encounter.');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchCombat = async () => {
    if (!result) return;
    setLaunchingCombat(true);
    setError(null);
    try {
      // Expand each creature by count into individual Combatants
      const monsterCombatants: Combatant[] = (result.creatures ?? []).flatMap((c: any) => {
        const sb = c.statBlock;
        const dexScore = sb?.abilityScores?.DEX ?? 10;
        const dexMod = Math.floor((dexScore - 10) / 2);
        const count = c.count ?? 1;
        return Array.from({ length: count }, (_, i) => ({
          id: crypto.randomUUID(),
          name: count > 1 ? `${c.name} ${i + 1}` : c.name,
          initiative: Math.floor(Math.random() * 20) + 1 + dexMod,
          hp: sb?.hp ?? 10,
          maxHp: sb?.hp ?? 10,
          ac: sb?.ac ?? 10,
          type: 'monster' as const,
          conditions: [],
          statBlock: sb ?? undefined,
        }));
      });

      // One Combatant per linked PC
      const pcCombatants: Combatant[] = Array.from(partyCharacters.values()).map((char) => ({
        id: crypto.randomUUID(),
        name: char.name,
        initiative: Math.floor(Math.random() * 20) + 1 + (char.initiative ?? 0),
        hp: char.hp?.current ?? char.hp?.max ?? 1,
        maxHp: char.hp?.max ?? 1,
        ac: char.ac ?? 10,
        type: 'pc' as const,
        characterId: char.id,
        conditions: char.activeConditions ?? [],
      }));

      const allCombatants = [...monsterCombatants, ...pcCombatants].sort(
        (a, b) => b.initiative - a.initiative,
      );

      await startCombat(result.name ?? 'Encounter', allCombatants);
      onCombatStarted?.();
    } catch (err: any) {
      setError(err.message ?? 'Failed to start combat.');
    } finally {
      setLaunchingCombat(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-white mb-1">Encounter Generator</h2>
        <p className="text-xs text-zinc-500">
          Party: {partySize} adventurer{partySize !== 1 ? 's' : ''}
          {partyMembers.length > 0 ? `, avg level ${avgLevel}` : ' (no characters linked yet)'}
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Scenario</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Ambush by goblin raiders on a foggy forest road at dusk…"
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-40">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Environment</label>
            <input
              value={environment}
              onChange={e => setEnvironment(e.target.value)}
              placeholder="Forest, dungeon, city…"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Difficulty</label>
            <div className="flex gap-1">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border capitalize transition-all ${
                    difficulty === d ? DIFFICULTY_STYLES[d] : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !description.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-black rounded-xl transition-colors"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
          {loading ? 'Generating…' : 'Generate Encounter'}
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-black text-white text-lg">{result.name ?? 'Generated Encounter'}</h3>
              {result.narrativeHook && (
                <p className="text-sm text-zinc-400 mt-1 italic leading-relaxed">{result.narrativeHook}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={`text-xs font-bold px-2 py-0.5 rounded border capitalize ${
                DIFFICULTY_STYLES[result.difficultyRating as Difficulty] ?? DIFFICULTY_STYLES.medium
              }`}>
                {result.difficultyRating ?? difficulty}
              </span>
              {result.totalXP && (
                <span className="text-xs text-zinc-600">{result.totalXP.toLocaleString()} XP</span>
              )}
            </div>
          </div>

          {result.terrainFeatures?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Terrain</h4>
              <ul className="text-xs text-zinc-400 space-y-1">
                {result.terrainFeatures.map((t: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5"><span className="text-amber-600 mt-0.5">▸</span>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {result.creatures?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Creatures</h4>
              <div className="space-y-2">
                {result.creatures.map((c: any, i: number) => {
                  const sb = c.statBlock;
                  const isExpanded = expandedCreature === i;
                  return (
                    <div key={i} className="border border-zinc-800 rounded-xl overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between p-3 bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-left"
                        onClick={() => setExpandedCreature(isExpanded ? null : i)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-zinc-200">{c.name}</span>
                          {c.count > 1 && (
                            <span className="text-xs font-bold text-amber-500 bg-amber-900/20 px-1.5 py-0.5 rounded">×{c.count}</span>
                          )}
                          {sb?.cr && <span className="text-xs text-zinc-500">CR {sb.cr}</span>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          {sb?.hp && <span>HP {sb.hp}</span>}
                          {sb?.ac && <span>AC {sb.ac}</span>}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      </button>
                      {isExpanded && sb && (
                        <div className="p-4 space-y-3 text-xs border-t border-zinc-800">
                          {c.tacticsNotes && (
                            <p className="text-zinc-400 italic">{c.tacticsNotes}</p>
                          )}
                          {sb.abilityScores && (
                            <div className="grid grid-cols-6 gap-1 text-center">
                              {Object.entries(sb.abilityScores).map(([stat, val]: [string, any]) => (
                                <div key={stat} className="bg-zinc-800 rounded p-1">
                                  <div className="text-zinc-500 font-bold">{stat}</div>
                                  <div className="text-zinc-200 font-black">{val}</div>
                                  <div className="text-zinc-600">{val >= 10 ? '+' : ''}{Math.floor((val - 10) / 2)}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {sb.traits?.length > 0 && (
                            <div className="space-y-1">
                              {sb.traits.map((t: any, j: number) => (
                                <p key={j}><span className="font-bold text-zinc-300">{t.name}.</span>{' '}<span className="text-zinc-400">{t.description}</span></p>
                              ))}
                            </div>
                          )}
                          {sb.attacks?.length > 0 && (
                            <div className="space-y-1">
                              <p className="font-bold text-zinc-500 uppercase tracking-widest mb-1">Actions</p>
                              {sb.attacks.map((a: any, j: number) => (
                                <p key={j}>
                                  <span className="font-bold text-zinc-300">{a.name}.</span>{' '}
                                  <span className="text-zinc-400">
                                    {a.attackBonus !== undefined ? `+${a.attackBonus} to hit, ` : ''}
                                    {a.reach ? `reach ${a.reach}, ` : ''}
                                    {a.targets ? `${a.targets}. ` : ''}
                                    {a.damageExpression ? `${a.damageExpression} ${a.damageType ?? ''} damage.` : ''}
                                    {a.additionalEffects ? ` ${a.additionalEffects}` : ''}
                                  </span>
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleLaunchCombat}
            disabled={launchingCombat}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-900/20 hover:bg-red-900/40 disabled:opacity-40 disabled:cursor-not-allowed text-red-400 text-sm font-bold rounded-xl transition-colors border border-red-500/20">
            {launchingCombat ? <Loader2 size={14} className="animate-spin" /> : <Swords size={14} />}
            {launchingCombat ? 'Starting…' : 'Launch Combat'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EncounterGenerator;