import React, { useState } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { DMNote, DMNoteType } from '../types';
import { BookOpen, Plus, Tag, ChevronDown, ChevronUp } from 'lucide-react';

const NOTE_TYPE_STYLES: Record<DMNoteType, string> = {
  session:  'bg-blue-900/30 text-blue-400 border-blue-500/20',
  event:    'bg-purple-900/30 text-purple-400 border-purple-500/20',
  npc:      'bg-amber-900/30 text-amber-400 border-amber-500/20',
  location: 'bg-green-900/30 text-green-400 border-green-500/20',
  lore:     'bg-zinc-800 text-zinc-400 border-zinc-700',
  quest:    'bg-red-900/30 text-red-400 border-red-500/20',
};

const ALL_TYPES: DMNoteType[] = ['session', 'event', 'npc', 'location', 'lore', 'quest'];

const DMNotesPanel: React.FC = () => {
  const { notes } = useCampaign();
  const [filterType, setFilterType] = useState<DMNoteType | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredNotes = (notes ?? []).filter(
    n => filterType === 'all' || n.type === filterType,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">DM Notes</h2>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-xl transition-colors"
          title="Coming soon"
        >
          <Plus size={12} />
          New Note
        </button>
      </div>

      {/* Type filter */}
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
            filterType === 'all'
              ? 'bg-zinc-600 text-white border-zinc-500'
              : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
          }`}
        >
          All
        </button>
        {ALL_TYPES.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border capitalize transition-all ${
              filterType === t ? NOTE_TYPE_STYLES[t] : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Notes list */}
      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-3">
          <BookOpen size={40} className="opacity-30" />
          <p className="text-sm">
            {filterType === 'all' ? 'No notes yet.' : `No ${filterType} notes.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotes.map((note: DMNote) => {
            const isExpanded = expandedId === note.id;
            return (
              <div
                key={note.id}
                className="border border-zinc-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : note.id)}
                  className="w-full flex items-center justify-between gap-3 p-3 bg-zinc-900 hover:bg-zinc-800/70 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`shrink-0 px-2 py-0.5 rounded border text-xs font-bold capitalize ${NOTE_TYPE_STYLES[note.type]}`}>
                      {note.type}
                    </span>
                    <span className="text-sm font-bold text-zinc-200 truncate">{note.title}</span>
                    {note.sessionNumber && (
                      <span className="text-xs text-zinc-600 shrink-0">Session {note.sessionNumber}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-zinc-600">
                    {note.tags?.length > 0 && <Tag size={12} />}
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 py-3 border-t border-zinc-800 space-y-2">
                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                    {note.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {note.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-xs rounded-full border border-zinc-700"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DMNotesPanel;
