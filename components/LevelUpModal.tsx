
import React, { useState } from 'react';
import { CharacterData, Feature, Spell, StatKey, Skill, ProficiencyLevel } from '../types';
import { X, ArrowUpCircle, Sparkles, Loader2, Check, BookOpen, Crown, Zap, Activity, ChevronDown, Star } from 'lucide-react';
import { checkRateLimit, recalculateCharacterStats } from '../utils';
import { generateWithContext } from '../lib/gemini';

interface LevelUpModalProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
  onClose: () => void;
}

interface LevelUpPlan {
    hpAverage: number;
    newFeatures: { name: string; description: string }[];
    choices: {
        id: string;
        label: string; 
        type: 'spell' | 'feat' | 'language' | 'asi' | 'expertise' | 'other';
        count: number;
        suggestions?: string[];
    }[];
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ data, onUpdate, onClose }) => {
  const [step, setStep] = useState<'intro' | 'analyzing' | 'deciding' | 'finalizing'>('intro');
  const [plan, setPlan] = useState<LevelUpPlan | null>(null);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [loadingText, setLoadingText] = useState("");
  const [targetLevel, setTargetLevel] = useState(data.level + 1);
  
  const nextLevel = data.level + 1;
  const STAT_KEYS: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  const handleStartLevelUp = async () => {
    checkRateLimit();
    setTargetLevel(nextLevel);
    setStep('analyzing');
    setLoadingText("Consulting the Weave for guidance...");

    try {
        const prompt = `
            My D&D 5e character is a Level ${data.level} ${data.race} ${data.class}. 
            They are leveling up to Level ${nextLevel}.
            
            Return a JSON object describing the level up gains. 
            Format:
            {
              "hpAverage": number,
              "newFeatures": [{ "name": "Feature Name", "description": "Short summary" }],
              "choices": [
                 { 
                   "id": "c1", 
                   "label": "Expertise Choice", 
                   "type": "expertise", 
                   "count": 2, 
                   "suggestions": ["Stealth", "Perception"] 
                 }
              ]
            }
            CRITICAL: Detect if Level ${nextLevel} grants "Expertise" or "Extra Attack" or "ASI/Feat".
            If Expertise is granted, set type: "expertise" and suggestions should be current proficient skills.
        `;

        const responseText = await generateWithContext(prompt, {
            responseMimeType: 'application/json',
        });
        
        const result = JSON.parse(responseText || '{}');
        setPlan(result);
        setStep('deciding');

    } catch (e) {
        console.error(e);
        setStep('intro');
    }
  };

  const handleFinalize = async () => {
    if (!plan) return;
    
    setStep('analyzing');
    setLoadingText("Inscribing new powers into your sheet...");

    try {
        let updatedStats = { ...data.stats };
        let updatedSkills = [...data.skills];
        let profBonus = Math.ceil(nextLevel / 4) + 1;

        // Apply Choices
        plan.choices.forEach(choice => {
            const userChoices = selections[choice.id] || [];
            if (userChoices.length === 0) return;

            if (choice.type === 'asi' || choice.type.includes('asi')) {
                userChoices.forEach(stat => {
                    if (updatedStats[stat as StatKey]) {
                        updatedStats[stat as StatKey].score += 1;
                    }
                });
            } else if (choice.type === 'expertise') {
                updatedSkills = updatedSkills.map(s => {
                    if (userChoices.includes(s.name)) {
                        return { ...s, proficiency: 'expertise' as ProficiencyLevel };
                    }
                    return s;
                });
            }
        });

        const featsToFetch = plan.newFeatures.map(f => f.name);
        const choicesToFetch = plan.choices
            .filter(c => c.type === 'spell' || c.type === 'feat')
            .flatMap(c => selections[c.id] || [])
            .filter(s => s && s !== 'custom');
        
        let result = { features: [], spells: [] };

        if (featsToFetch.length > 0 || choicesToFetch.length > 0) {
            const prompt = `Provide detailed rules text for: ${[...featsToFetch, ...choicesToFetch].join(', ')}. Return JSON: { "features": [...], "spells": [...] }`;
            const responseText = await generateWithContext(prompt, { responseMimeType: 'application/json' });
            result = JSON.parse(responseText || '{}');
        }

        // Recalculate skill modifiers with new prof bonus and expertise
        updatedSkills = updatedSkills.map(s => {
            const baseMod = updatedStats[s.ability].modifier;
            const multiplier = s.proficiency === 'expertise' ? 2 : (s.proficiency === 'proficient' ? 1 : 0);
            return { ...s, modifier: baseMod + (profBonus * multiplier) };
        });
        
        const tempChar: CharacterData = {
            ...data,
            level: nextLevel,
            stats: updatedStats,
            skills: updatedSkills,
            hp: {
                current: data.hp.current + plan.hpAverage,
                max: data.hp.max + plan.hpAverage
            },
            features: [...data.features, ...(result.features || [])],
            spells: [...data.spells, ...(result.spells || [])]
        };

        onUpdate(recalculateCharacterStats(tempChar));
        setStep('finalizing');

    } catch (e) {
        console.error(e);
        setStep('deciding');
    }
  };

  const handleSelectionChange = (choiceId: string, val: string, index: number) => {
      setSelections(prev => {
          const current = prev[choiceId] || [];
          const newArr = [...current];
          newArr[index] = val;
          return { ...prev, [choiceId]: newArr };
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <ArrowUpCircle className="text-green-500" size={20} />
            Level Up Wizard
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white" aria-label="Close"><X size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto">
            {step === 'intro' && (
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-green-900/20 rounded-full flex items-center justify-center mx-auto border-4 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)] animate-pulse">
                        <span className="font-display font-bold text-5xl text-green-400">{nextLevel}</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">Ascend to Level {nextLevel}</h2>
                        <p className="text-zinc-400 text-sm">Update your hero with new abilities, spells, and increased proficiency.</p>
                    </div>
                    <button onClick={handleStartLevelUp} className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3">
                        <Sparkles size={20} /> Begin Ascension
                    </button>
                </div>
            )}

            {step === 'analyzing' && (
                <div className="py-20 text-center">
                    <Loader2 size={48} className="animate-spin text-green-500 mx-auto mb-6" />
                    <p className="text-lg text-zinc-300 font-display animate-pulse">{loadingText}</p>
                </div>
            )}

            {step === 'deciding' && plan && (
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg border border-zinc-700">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-900/30 p-2 rounded text-red-400"><ArrowUpCircle size={18} /></div>
                                <span className="font-bold text-zinc-200">HP Gain</span>
                            </div>
                            <span className="text-xl font-bold text-green-400">+{plan.hpAverage}</span>
                        </div>
                        {plan.newFeatures.map((f, i) => (
                            <div key={i} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 flex gap-3">
                                <div className="mt-1 text-purple-400 shrink-0"><Crown size={18} /></div>
                                <div><h4 className="font-bold text-white">{f.name}</h4><p className="text-xs text-zinc-400 mt-1">{f.description}</p></div>
                            </div>
                        ))}
                    </div>

                    {plan.choices.map((choice) => (
                        <div key={choice.id} className="space-y-2">
                            <label className="text-sm font-bold text-zinc-300 block">{choice.label}</label>
                            {Array.from({ length: choice.count }).map((_, i) => (
                                <div key={i} className="relative">
                                    <select
                                        aria-label={`${choice.label} ${choice.count > 1 ? i + 1 : ''}`}
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none appearance-none cursor-pointer pr-10"
                                        onChange={(e) => handleSelectionChange(choice.id, e.target.value, i)}
                                        value={selections[choice.id]?.[i] || ""}
                                    >
                                        <option value="">Select {choice.label || choice.type}{choice.count > 1 ? ` ${i+1}` : ''}...</option>
                                        {choice.type === 'expertise' 
                                            ? data.skills.filter(s => s.proficiency === 'proficient').map(s => <option key={s.name} value={s.name}>{s.name}</option>)
                                            : choice.type.includes('asi')
                                              ? STAT_KEYS.map(s => <option key={s} value={s}>{s} (Current: {data.stats[s].score})</option>)
                                              : choice.suggestions?.map(s => <option key={s} value={s}>{s}</option>)
                                        }
                                        <option value="custom">-- Custom --</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-3.5 text-zinc-600 pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    ))}
                    <button onClick={handleFinalize} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-green-900/20">
                        <Check size={20} /> Confirm Ascension
                    </button>
                </div>
            )}

            {step === 'finalizing' && (
                <div className="text-center py-10 space-y-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-black shadow-[0_0_40px_rgba(34,197,94,0.6)]">
                        <Check size={48} strokeWidth={4} />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Level {targetLevel} Reached!</h2>
                    <button onClick={onClose} className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors">Return to Hall</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
