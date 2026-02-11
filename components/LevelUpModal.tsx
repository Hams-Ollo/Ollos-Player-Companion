import React, { useState } from 'react';
import { CharacterData, Feature } from '../types';
import { X, ArrowUpCircle, Sparkles, Loader2, Check } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit } from '../utils';

interface LevelUpModalProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ data, onUpdate, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'confirm' | 'fetching' | 'review'>('confirm');
  const [newFeatures, setNewFeatures] = useState<Feature[]>([]);
  const [hpIncrease, setHpIncrease] = useState(0);

  const nextLevel = data.level + 1;

  const handleFetchLevelUp = async () => {
    if (!process.env.API_KEY) {
        alert("API Key required for Level Up Wizard");
        return;
    }

    setLoading(true);
    setStep('fetching');

    try {
        checkRateLimit(); // Enforce rate limit

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            My D&D 5e character is a Level ${data.level} ${data.race} ${data.class}. 
            I am leveling up to Level ${nextLevel}.
            Provide a JSON object with the following fields:
            - "hp_increase": number (use the class average + CON mod ${data.stats.CON.modifier})
            - "new_features": array of objects with "name", "source" (Class/Race), "description" (short summary), and "fullText" (detailed rules).
            
            Only include features gained EXACTLY at level ${nextLevel}.
            Do not wrap in markdown code blocks. Just raw JSON.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        const result = JSON.parse(response.text || '{}');
        
        setHpIncrease(result.hp_increase || 5);
        setNewFeatures(result.new_features || []);
        setStep('review');

    } catch (e: any) {
        console.error(e);
        alert(e.message || "The spirits failed to guide your ascension. Try again.");
        setStep('confirm');
    } finally {
        setLoading(false);
    }
  };

  const handleApply = () => {
    onUpdate({
        level: nextLevel,
        hp: {
            current: data.hp.current + hpIncrease,
            max: data.hp.max + hpIncrease
        },
        features: [...data.features, ...newFeatures]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <ArrowUpCircle className="text-green-500" size={20} />
            Level Up
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-6 text-center">
            {step === 'confirm' && (
                <div className="space-y-4">
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto border-4 border-zinc-700">
                        <span className="font-display font-bold text-4xl text-white">{data.level}</span>
                    </div>
                    <div className="flex justify-center">
                        <ArrowUpCircle className="text-zinc-600 animate-bounce" size={24} />
                    </div>
                    <div className="w-24 h-24 bg-green-900/20 rounded-full flex items-center justify-center mx-auto border-4 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                        <span className="font-display font-bold text-5xl text-green-400">{nextLevel}</span>
                    </div>
                    
                    <p className="text-zinc-400 text-sm">
                        Ready to ascend to Level {nextLevel}? <br/>
                        The AI Dungeon Master will calculate your new HP and unlock class features.
                    </p>

                    <button 
                        onClick={handleFetchLevelUp}
                        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Sparkles size={18} /> Begin Ascension
                    </button>
                </div>
            )}

            {step === 'fetching' && (
                <div className="py-10">
                    <Loader2 size={48} className="animate-spin text-green-500 mx-auto mb-4" />
                    <p className="text-zinc-300 font-display">Consulting the Weave...</p>
                </div>
            )}

            {step === 'review' && (
                <div className="text-left space-y-4">
                    <div className="bg-zinc-800 p-3 rounded-lg flex justify-between items-center border border-zinc-700">
                        <span className="text-zinc-400 font-bold">Max HP Increase</span>
                        <span className="text-green-400 font-bold text-xl">+{hpIncrease}</span>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">New Features</h4>
                        {newFeatures.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {newFeatures.map((f, i) => (
                                    <div key={i} className="bg-zinc-800 p-3 rounded-lg border border-zinc-700">
                                        <div className="font-bold text-purple-300 text-sm">{f.name}</div>
                                        <div className="text-xs text-zinc-400 mt-1">{f.description}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-zinc-500 italic text-center py-2">No new features this level.</div>
                        )}
                    </div>

                    <button 
                        onClick={handleApply}
                        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                        <Check size={18} /> Apply Changes
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;