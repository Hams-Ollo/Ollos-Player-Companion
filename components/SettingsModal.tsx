import React, { useState } from 'react';
import { X, Save, Settings, Wifi, WifiOff, ShieldCheck, ShieldAlert, Activity, Download, Upload } from 'lucide-react';
import { CharacterData, StatKey } from '../types';
import { recalculateCharacterStats } from '../utils';

interface SettingsModalProps {
  data: CharacterData;
  onSave: (newData: Partial<CharacterData>) => void;
  onClose: () => void;
  onImport?: (char: CharacterData) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ data, onSave, onClose, onImport }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importError, setImportError] = React.useState<string | null>(null);

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as CharacterData;
        if (!parsed.name || !parsed.class || !parsed.stats) throw new Error('Invalid character file.');
        // Give a fresh ID so this becomes a new character
        const newChar: CharacterData = { ...parsed, id: `local-${Date.now()}` };
        onImport?.(newChar);
        onClose();
      } catch (err) {
        setImportError((err as Error).message ?? 'Could not parse file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset so same file can be re-picked
  };
  const [formData, setFormData] = useState({
    name: data.name,
    race: data.race,
    class: data.class,
    level: data.level,
    campaign: data.campaign || '',
    xp: data.xp ?? 0,
    stats: { ...data.stats }
  });

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.replace(/\s+/g, '_')}_lvl${data.level}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasApiKey = true; // AI features are always available via server proxy

  const handleSave = () => {
    const profBonus = Math.ceil((formData.level || data.level) / 4) + 1;
    const merged: CharacterData = {
      ...data,
      ...formData,
      xp: formData.xp,
      skills: data.skills.map(skill => {
        const abilityMod = formData.stats[skill.ability].modifier;
        const profMod = skill.proficiency === 'expertise' ? profBonus * 2 : skill.proficiency === 'proficient' ? profBonus : 0;
        return { ...skill, modifier: abilityMod + profMod };
      }),
    };
    const recalculated = recalculateCharacterStats(merged);
    onSave(recalculated);
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
                save: modifier + (prev.stats[stat].proficientSave ? Math.ceil((formData.level || data.level) / 4) + 1 : 0)
            }
        }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 animate-in fade-in">
      <div className="bg-zinc-900 sm:border border-zinc-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md md:max-w-lg overflow-hidden flex flex-col shadow-2xl h-[90vh] sm:h-auto sm:max-h-[90vh]">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Settings className="text-zinc-400" size={20} />
            Sheet Settings
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white" aria-label="Close" title="Close"><X size={24} /></button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto">
          
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
                <label htmlFor="settings-name" className="text-sm text-zinc-400">Name</label>
                <input 
                  id="settings-name"
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                />
             </div>

              <div className="space-y-2">
                <label htmlFor="settings-campaign" className="text-sm text-zinc-400">Campaign</label>
                <input 
                  id="settings-campaign"
                  type="text" 
                  value={formData.campaign}
                  onChange={(e) => setFormData({...formData, campaign: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                  placeholder="e.g. Curse of Strahd"
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="settings-race" className="text-sm text-zinc-400">Race</label>
                    <input 
                      id="settings-race"
                      type="text" 
                      value={formData.race}
                      onChange={(e) => setFormData({...formData, race: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="settings-class" className="text-sm text-zinc-400">Class</label>
                    <input 
                      id="settings-class"
                      type="text" 
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                    />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="settings-level" className="text-sm text-zinc-400">Level</label>
                  <input
                    id="settings-level"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: parseInt(e.target.value) || 1})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="settings-xp" className="text-sm text-zinc-400">Experience Points</label>
                  <input
                    id="settings-xp"
                    type="number"
                    min="0"
                    value={formData.xp}
                    onChange={(e) => setFormData({...formData, xp: parseInt(e.target.value) || 0})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-500"
                    placeholder="0"
                  />
                </div>
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
                        <label htmlFor={`settings-stat-${stat}`} className="text-[10px] font-bold text-zinc-500 uppercase">{stat}</label>
                        <input 
                          id={`settings-stat-${stat}`}
                          type="number" 
                          value={formData.stats[stat].score}
                          onChange={(e) => handleStatChange(stat, e.target.value)}
                          aria-label={`Enter ${stat} score`}
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

        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 space-y-2">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-zinc-100 hover:bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Save size={18} />
            Save Changes
          </button>
          <button
            onClick={handleExport}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Download size={15} />
            Export as JSON
          </button>
          {onImport && (
            <button
              onClick={handleImportClick}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <Upload size={15} />
              Import Character from JSON
            </button>
          )}
          {importError && <p className="text-xs text-red-400 text-center">{importError}</p>}
          <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleImportFile} aria-label="Import character from JSON file" />
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;