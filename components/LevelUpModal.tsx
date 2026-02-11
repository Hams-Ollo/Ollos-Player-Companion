import React, { useState } from 'react';
import { CharacterData, Feature, Spell, StatKey } from '../types';
import { X, ArrowUpCircle, Sparkles, Loader2, Check, BookOpen, Crown, Zap, Activity, ChevronDown } from 'lucide-react';
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
        label: string; // e.g., "Choose 2 Spells", "Feat or ASI"
        type: 'spell' | 'feat' | 'language' | 'asi' | 'other';
        count: number;
        suggestions?: string[]; // AI suggested options
    }[];
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ data, onUpdate, onClose }) => {
  const [step, setStep] = useState<'intro' | 'analyzing' | 'deciding' | 'finalizing'>('intro');
  const [plan, setPlan] = useState<LevelUpPlan | null>(null);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [loadingText, setLoadingText] = useState("");
  
  const nextLevel = data.level + 1;
  const STAT_KEYS: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  // 1. Analyze Step: Ask AI what happens
  const handleStartLevelUp = async () => {
    if (!process.env.API_KEY) {
        alert("API Key required.");
        return;
    }
    
    checkRateLimit();
    setStep('analyzing');
    setLoadingText("Consulting the Weave for guidance...");

    try {
        const prompt = `
            My D&D 5e character is a Level ${data.level} ${data.race} ${data.class}. 
            They are leveling up to Level ${nextLevel}.
            
            Using the official class progression table from the reference documents, return a JSON object describing the level up gains. 
            Format:
            {
              "hpAverage": number (class average + CON mod ${data.stats.CON.modifier}),
              "newFeatures": [{ "name": "Feature Name", "description": "Short summary" }],
              "choices": [
                 { 
                   "id": "c1", 
                   "label": "Select New Spell", 
                   "type": "spell", 
                   "count": 1, 
                   "suggestions": ["Fireball", "Fly", "Haste"] 
                 }
              ]
            }
            CRITICAL INSTRUCTIONS FOR FEATS & ASI:
            - If this level grants an Ability Score Improvement (ASI), you MUST provide TWO mutually exclusive choice paths in the "choices" array.
            - Path 1: "Ability Score Improvement (Optional if Feat taken)", type: "asi", count: 2.
            - Path 2: "Select a Feat (Optional if ASI taken)", type: "feat", count: 1, with a list of "suggestions" (e.g., Great Weapon Master, Sentinel, Fey Touched, etc.).
            - If a choice is conditional on an archetype selection, label it clearly like "Select Spells (If Arcane Trickster)".
            - If no choices are needed, choices should be empty array.
            - Cite the PHB page number for each new feature if possible.
        `;

        const responseText = await generateWithContext(prompt, {
            responseMimeType: 'application/json',
        });
        
        const result = JSON.parse(responseText || '{}');
        setPlan(result);
        setStep('deciding');

    } catch (e) {
        console.error(e);
        alert("The spirits are silent. Please try again.");
        setStep('intro');
    }
  };

  // 2. Finalize Step: Get details for choices
  const handleFinalize = async () => {
    if (!plan) return;
    
    // Validate selections
    // We allow skipping if label contains "(if ", "optional", or "instead of"
    const skipKeywords = ['(if ', 'optional', 'instead of'];
    
    // Complex validation: if both ASI and Feat are present and optional, at least one must be filled.
    const optionalChoices = plan.choices.filter(c => skipKeywords.some(k => c.label.toLowerCase().includes(k)));
    const mandatoryChoices = plan.choices.filter(c => !skipKeywords.some(k => c.label.toLowerCase().includes(k)));

    for (const choice of mandatoryChoices) {
        const userSelected = (selections[choice.id] || []).filter(s => s && s.trim() !== "" && s !== 'custom');
        if (userSelected.length < choice.count) {
            alert(`Please complete selection: ${choice.label}`);
            return;
        }
    }

    // Special check: If there are choices containing "ASI" and "Feat" and both are optional, ensure one is picked.
    const hasAsiOption = plan.choices.find(c => c.label.includes('ASI') || c.label.includes('Ability Score'));
    const hasFeatOption = plan.choices.find(c => c.label.includes('Feat'));
    
    if (hasAsiOption && hasFeatOption) {
        const asiFilled = (selections[hasAsiOption.id] || []).filter(s => s && s.trim() !== "").length === hasAsiOption.count;
        const featFilled = (selections[hasFeatOption.id] || []).filter(s => s && s.trim() !== "" && s !== 'custom').length === hasFeatOption.count;
        
        if (!asiFilled && !featFilled) {
            alert("This level grants an Ability Score Improvement or a Feat. Please choose one of the two paths.");
            return;
        }
    }

    setStep('analyzing'); // Reuse loading state
    setLoadingText("Inscribing new powers into your sheet...");

    try {
        // Calculate new stats first if ASI was chosen
        let updatedStats = { ...data.stats };
        
        plan.choices.forEach(choice => {
            if (choice.type === 'asi') {
                const userChoices = selections[choice.id] || [];
                // Only apply if fully filled
                if (userChoices.filter(s => s && s.trim() !== "").length === choice.count) {
                    userChoices.forEach(stat => {
                        if (updatedStats[stat as StatKey]) {
                            const newScore = updatedStats[stat as StatKey].score + 1;
                            const newMod = Math.floor((newScore - 10) / 2);
                            const oldSave = updatedStats[stat as StatKey].save;
                            const oldMod = updatedStats[stat as StatKey].modifier;
                            const saveDiff = newMod - oldMod;
                            
                            updatedStats[stat as StatKey] = {
                                ...updatedStats[stat as StatKey],
                                score: newScore,
                                modifier: newMod,
                                save: oldSave + saveDiff
                            };
                        }
                    });
                }
            }
        });

        // Filter out ASI selections and conditional selections that weren't filled
        const nonAsiChoices = plan.choices.filter(c => c.type !== 'asi');
        const featsToFetch = plan.newFeatures.map(f => f.name);
        
        // Flatten all selections, excluding "custom" markers and empty strings
        const choicesToFetch = nonAsiChoices.flatMap(c => {
            const sels = selections[c.id] || [];
            return sels.filter(s => s && s.trim() !== "" && s !== 'custom');
        });
        
        let result = { features: [], spells: [] };

        // Only ask AI if there are text-based things to fetch
        if (featsToFetch.length > 0 || choicesToFetch.length > 0) {
            const prompt = `
                Provide detailed D&D 5e rules text for the following features/spells/feats, using the reference documents as your source:
                ${JSON.stringify([...featsToFetch, ...choicesToFetch])}
                
                Return JSON:
                {
                    "features": [{ "name": "", "source": "Class/Race/Feat", "description": "Short", "fullText": "Long rules text from the book" }],
                    "spells": [{ "name": "", "level": 1, "school": "", "description": "", "castingTime": "", "range": "", "duration": "", "components": "" }]
                }
            `;

            const responseText = await generateWithContext(prompt, {
                responseMimeType: 'application/json',
            });

            result = JSON.parse(responseText || '{}');
        }
        
        // Merge Data
        const updatedFeatures = [...data.features, ...(result.features || [])];
        const updatedSpells = [...(data.spells || []), ...(result.spells || [])];
        
        const tempChar: CharacterData = {
            ...data,
            level: nextLevel,
            stats: updatedStats,
            hp: {
                current: data.hp.current + plan.hpAverage,
                max: data.hp.max + plan.hpAverage
            },
            features: updatedFeatures,
            spells: updatedSpells
        };

        const finalChar = recalculateCharacterStats(tempChar);

        onUpdate(finalChar);
        setStep('finalizing');

    } catch (e) {
        console.error(e);
        alert("Failed to transcribe features.");
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
                        <p className="text-zinc-400 text-sm">
                            The Dungeon Master AI will analyze your class path and guide you through selecting new spells, feats, or abilities.
                        </p>
                    </div>

                    <button 
                        onClick={handleStartLevelUp}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3"
                    >
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
                    {/* Fixed Gains */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg border border-zinc-700">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-900/30 p-2 rounded text-red-400"><ArrowUpCircle size={18} /></div>
                                <span className="font-bold text-zinc-200">Max HP</span>
                            </div>
                            <span className="text-xl font-bold text-green-400">+{plan.hpAverage}</span>
                        </div>

                        {plan.newFeatures.map((f, i) => (
                            <div key={i} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 flex gap-3">
                                <div className="mt-1 text-purple-400 shrink-0"><Crown size={18} /></div>
                                <div>
                                    <h4 className="font-bold text-white">{f.name}</h4>
                                    <p className="text-xs text-zinc-400 mt-1">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Choices */}
                    {plan.choices.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-amber-900/30 pb-2">Decisions Required</h4>
                            {plan.choices.map((choice) => (
                                <div key={choice.id} className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <label className="text-sm font-bold text-zinc-300 block">{choice.label}</label>
                                        {(choice.label.toLowerCase().includes('(if ') || choice.label.toLowerCase().includes('optional')) && (
                                            <span className="text-[10px] text-zinc-500 uppercase font-bold">Optional Choice</span>
                                        )}
                                    </div>
                                    
                                    {choice.type === 'asi' ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {Array.from({ length: choice.count }).map((_, i) => (
                                                <select
                                                    key={i}
                                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none appearance-none cursor-pointer"
                                                    onChange={(e) => handleSelectionChange(choice.id, e.target.value, i)}
                                                    value={selections[choice.id]?.[i] || ""}
                                                    aria-label={`Ability score improvement ${i + 1}`}
                                                >
                                                    <option value="">Select Stat...</option>
                                                    {STAT_KEYS.map(stat => (
                                                        <option key={stat} value={stat}>{stat} (Current: {data.stats[stat].score})</option>
                                                    ))}
                                                </select>
                                            ))}
                                            <p className="col-span-2 text-[10px] text-zinc-500 italic">Increases stats by 1. Select the same stat twice for +2.</p>
                                        </div>
                                    ) : (
                                        Array.from({ length: choice.count }).map((_, i) => (
                                            <div key={i} className="relative">
                                                {choice.suggestions && choice.suggestions.length > 0 ? (
                                                    <select
                                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none appearance-none cursor-pointer pr-10"
                                                        onChange={(e) => handleSelectionChange(choice.id, e.target.value, i)}
                                                        value={selections[choice.id]?.[i] || ""}
                                                        aria-label={`${choice.label} option ${i + 1}`}
                                                    >
                                                        <option value="">Select option {i + 1}...</option>
                                                        {choice.suggestions.map(s => <option key={s} value={s}>{s}</option>)}
                                                        <option value="custom">-- Custom Entry --</option>
                                                    </select>
                                                ) : (
                                                    <input 
                                                        type="text"
                                                        placeholder={`Enter selection ${i + 1}...`}
                                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                                                        onChange={(e) => handleSelectionChange(choice.id, e.target.value, i)}
                                                        value={selections[choice.id]?.[i] || ""}
                                                    />
                                                )}
                                                
                                                <div className="absolute right-3 top-3.5 text-zinc-600 pointer-events-none">
                                                    {choice.suggestions && choice.suggestions.length > 0 ? (
                                                        <ChevronDown size={16} />
                                                    ) : (
                                                        choice.type === 'spell' ? <BookOpen size={16} /> : <Zap size={16} />
                                                    )}
                                                </div>
                                                
                                                {(selections[choice.id]?.[i] === 'custom') && (
                                                    <input 
                                                        type="text"
                                                        autoFocus
                                                        placeholder="Type custom name..."
                                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none mt-2 animate-in slide-in-from-top-1"
                                                        onChange={(e) => handleSelectionChange(choice.id, e.target.value, i)}
                                                    />
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button 
                        onClick={handleFinalize}
                        className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-green-900/20"
                    >
                        <Check size={20} /> Confirm Level Up
                    </button>
                </div>
            )}

            {step === 'finalizing' && (
                <div className="text-center py-10 space-y-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-black shadow-[0_0_40px_rgba(34,197,94,0.6)]">
                        <Check size={48} strokeWidth={4} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Level {nextLevel} Reached!</h2>
                        <p className="text-zinc-400">Your stats have been updated and new powers transcribed.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
                    >
                        Return to Sheet
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;