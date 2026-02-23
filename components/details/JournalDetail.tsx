import React, { useState } from 'react';
import { CharacterData, JournalEntry } from '../../types';
import { Plus, PenTool, MapPin, User, FileText, Sparkles, Loader2, Trash2, Heart, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { checkRateLimit } from '../../utils';
import { generateWithContext } from '../../lib/gemini';

interface JournalDetailProps {
  data: CharacterData;
  onUpdate: (newData: Partial<CharacterData>) => void;
}

const JournalDetail: React.FC<JournalDetailProps> = ({ data, onUpdate }) => {
  const [newEntry, setNewEntry] = useState('');
  const [entryType, setEntryType] = useState<JournalEntry['type']>('note');
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const addEntry = () => {
    if (!newEntry.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type: entryType,
      content: newEntry
    };
    const updatedJournal = [...(data.journal || []), entry];
    onUpdate({ journal: updatedJournal });
    setNewEntry('');
  };

  const deleteEntry = (id: string) => {
    const updatedJournal = (data.journal || []).filter(e => e.id !== id);
    onUpdate({ journal: updatedJournal });
  };

  const handleSummarize = async () => {
    if (!data.journal || data.journal.length === 0) return;
    
    setSummarizing(true);
    setSummary(null);

    try {
        checkRateLimit(); // Enforce rate limit

        const notesText = data.journal.map(e => `[${e.type.toUpperCase()}] ${e.content}`).join('\n');
        
        const responseText = await generateWithContext(
            `Summarize the following D&D session notes into a coherent narrative chronicle. Format with Markdown.\n\n${notesText}`
        );

        setSummary(responseText || null);
    } catch (e: any) {
        console.error(e);
        alert(e.message || "Failed to summarize");
    } finally {
        setSummarizing(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
        case 'npc': return <User size={16} className="text-purple-400" />;
        case 'location': return <MapPin size={16} className="text-green-400" />;
        case 'summary': return <FileText size={16} className="text-amber-400" />;
        default: return <PenTool size={16} className="text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Character Background — motivations & key NPCs from wizard */}
      {(data.motivations || data.keyNPCs) && (
        <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Character Background</h3>
          {data.motivations && (
            <div className="flex gap-3">
              <Heart size={14} className="text-rose-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Motivations</span>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{data.motivations}</p>
              </div>
            </div>
          )}
          {data.keyNPCs && (
            <div className="flex gap-3">
              <Users size={14} className="text-indigo-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Key NPCs</span>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{data.keyNPCs}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Record your adventure..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none h-24 mb-3"
        />
        <div className="flex justify-between items-center">
            <div className="flex gap-2">
                {(['note', 'npc', 'location'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setEntryType(t)}
                        className={`p-2 rounded-lg border transition-colors ${entryType === t ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}
                        title={`Add ${t}`}
                    >
                        {getIcon(t)}
                    </button>
                ))}
            </div>
            <button
                onClick={addEntry}
                disabled={!newEntry.trim()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Plus size={16} />
                Add Entry
            </button>
        </div>
      </div>

      {/* AI Actions */}
      <div className="flex justify-end">
         <button 
           onClick={handleSummarize}
           disabled={summarizing || !data.journal?.length}
           className="flex items-center gap-2 text-xs font-bold text-amber-500 hover:text-amber-400 disabled:opacity-50"
         >
            {summarizing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Summarize Chronicle
         </button>
      </div>

      {/* Summary View */}
      {summary && (
          <div className="bg-amber-900/10 border border-amber-600/30 rounded-xl p-4 animate-in fade-in">
              <h3 className="text-amber-500 font-display font-bold mb-2 flex items-center gap-2">
                  <FileText size={18} /> Chronicle Summary
              </h3>
              <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
          </div>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        {(data.journal || []).slice().reverse().map((entry) => (
            <div key={entry.id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3 flex gap-3 group hover:border-zinc-600 transition-colors">
                <div className="mt-1 shrink-0">{getIcon(entry.type)}</div>
                <div className="flex-grow min-w-0">
                    <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                    <span className="text-[10px] text-zinc-600 mt-2 block">{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all self-start"
                  aria-label="Delete entry"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        ))}
        {(!data.journal || data.journal.length === 0) && (
            <div className="text-center py-8 text-zinc-600 italic">
                The pages of your journal are empty...
            </div>
        )}
      </div>
    </div>
  );
};

export default JournalDetail;