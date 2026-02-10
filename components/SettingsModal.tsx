import React, { useState } from 'react';
import { X, Save, Settings, Wifi, WifiOff, ShieldCheck, ShieldAlert, Activity } from 'lucide-react';
import { CharacterData, StatKey } from '../types';

interface SettingsModalProps {
  data: CharacterData;
  onSave: (newData: Partial<CharacterData>) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ data, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: data.name,
    race: data.race,
    class: data.class,
    level: data.level,
    campaign: data.campaign || '',
    stats: { ...data.stats }
  });

  const hasApiKey = !!process.env.API_KEY;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleStatChange = (stat: StatKey, value: string) => {
    const score = parseInt(value) || 10;
    const modifier = Math.floor((score - 10) / 2);
    
    setFormData(prev => ({
        ...prev,
        stats: {
            ...prev.stats,
            [stat]: {
                ...prev.stats[stat],
                score,
                modifier,
                save: modifier // Simplified save logic (doesn't account for proficiency here but keeps it synced)
            }
        }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Settings className="text-zinc-400" size={20} />
            Sheet Settings
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto">
          
          {/* API Status Section */}
          <div className={`p-4 rounded-xl border ${hasApiKey ? 'bg-green-900/10 border-green-900/50' : 'bg-red-900/10 border-red-900/50'}`}>
             <div className="flex items-center gap-3 mb-1">
                {hasApiKey ? <Wifi size={20} className="text-green-500" /> : <WifiOff size={20} className="text-red-500" />}
                <span className={`font-bold ${hasApiKey ? 'text-green-400' : 'text-red-400'}`}>
                    {hasApiKey ? 'Neural Link Active' : 'Neural Link Severed'}
                </span>
             </div>
             <div className="flex items-center gap-2 text-xs text-zinc-500 ml-8">
                {hasApiKey ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                <span>{hasApiKey ? 'Secure API Key detected in environment.' : 'API Key missing. AI features disabled.'}</span>
             </div>
          </div>

          {/* Character Config */}
          <div className="space-y-4">
             <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Character Details</h4>
             
             <div className="space-y-2">
                <label className="text-sm text-zinc-400">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                />
             </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Campaign</label>
                <input 
                  type="text" 
                  value={formData.campaign}
                  onChange={(e) => setFormData({...formData, campaign: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                  placeholder="e.g. Curse of Strahd"
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Race</label>
                    <input 
                      type="text" 
                      value={formData.race}
                      onChange={(e) => setFormData({...formData, race: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Class</label>
                    <input 
                      type="text" 
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                    />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-sm text-zinc-400">Level</label>
                <input 
                  type="number" 
                  min="1"
                  max="20"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: parseInt(e.target.value) || 1})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                />
             </div>
          </div>

          {/* Stats Config */}
          <div className="space-y-4">
             <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
                 <Activity size={14} />
                 Ability Scores
             </h4>
             <div className="grid grid-cols-3 gap-3">
                {(Object.keys(formData.stats) as StatKey[]).map((stat) => (
                    <div key={stat} className="bg-zinc-800 p-2 rounded-lg border border-zinc-700 flex flex-col items-center">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">{stat}</label>
                        <input 
                          type="number" 
                          value={formData.stats[stat].score}
                          onChange={(e) => handleStatChange(stat, e.target.value)}
                          className="w-full bg-transparent text-center font-display font-bold text-xl text-white focus:outline-none mt-1"
                        />
                        <span className="text-xs text-zinc-500">
                            {formData.stats[stat].modifier >= 0 ? '+' : ''}{formData.stats[stat].modifier}
                        </span>
                    </div>
                ))}
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-zinc-100 hover:bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;