import React, { useState } from 'react';
import { useCampaign } from '../contexts/CampaignContext';
import { DMNote, DMNoteType } from '../types';
import { BookOpen, Plus, Tag, ChevronDown, ChevronUp, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';

const NOTE_TYPE_STYLES: Record<DMNoteType, string> = {
  session:  'bg-blue-900/30 text-blue-400 border-blue-500/20',
  event:    'bg-purple-900/30 text-purple-400 border-purple-500/20',
  npc:      'bg-amber-900/30 text-amber-400 border-amber-500/20',
  location: 'bg-green-900/30 text-green-400 border-green-500/20',
  lore:     'bg-zinc-800 text-zinc-400 border-zinc-700',
  quest:    'bg-red-900/30 text-red-400 border-red-500/20',
};

const ALL_TYPES: DMNoteType[] = ['session', 'event', 'npc', 'location', 'lore', 'quest'];

const EMPTY_FORM = { title: '', content: '', type: 'session' as DMNoteType, tags: '', sessionNumber: '' };

const DMNotesPanel: React.FC = () => {
  const { notes, createNote, updateNote, deleteNote } = useCampaign();

  const [filterType, setFilterType]   = useState<DMNoteType | 'all'>('all');
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [editingNote, setEditingNote] = useState<DMNote | null>(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [deleting, setDeleting]       = useState(false);

  const filteredNotes = (notes ?? []).filter(
    n => filterType === 'all' || n.type === filterType,
  );

  const openCreate = () => {
    setEditingNote(null);
    setForm(EMPTY_FORM);
    setDrawerOpen(true);
  };

  const openEdit = (note: DMNote) => {
    setEditingNote(note);
    setForm({
      title:         note.title,
      content:       note.content,
      type:          note.type,
      tags:          (note.tags ?? []).join(', '),
      sessionNumber: note.sessionNumber != null ? String(note.sessionNumber) : '',
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => { setDrawerOpen(false); setEditingNote(null); };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title:         form.title.trim(),
        content:       form.content.trim(),
        type:          form.type,
        tags:          form.tags.split(',').map(t => t.trim()).filter(Boolean),
        sessionNumber: form.sessionNumber ? parseInt(form.sessionNumber, 10) : undefined,
      };
      if (editingNote) {
        await updateNote(editingNote.id, payload);
      } else {
        await createNote(payload as any);
      }
      closeDrawer();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (deleteId !== noteId) { setDeleteId(noteId); return; }
    setDeleting(true);
    try {
      await deleteNote(noteId);
      setDeleteId(null);
      if (expandedId === noteId) setExpandedId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">DM Notes</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-xl transition-colors"
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
            const pendingDelete = deleteId === note.id;
            return (
              <div key={note.id} className="border border-zinc-800 rounded-xl overflow-hidden">
                {/* Card header row */}
                <div className="flex items-center bg-zinc-900">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : note.id)}
                    className="flex-1 flex items-center gap-3 p-3 hover:bg-zinc-800/70 transition-colors text-left min-w-0"
                  >
                    <span className={`shrink-0 px-2 py-0.5 rounded border text-xs font-bold capitalize ${NOTE_TYPE_STYLES[note.type]}`}>
                      {note.type}
                    </span>
                    <span className="text-sm font-bold text-zinc-200 truncate">{note.title}</span>
                    {note.sessionNumber != null && (
                      <span className="text-xs text-zinc-600 shrink-0">S{note.sessionNumber}</span>
                    )}
                    <div className="flex items-center gap-2 ml-auto shrink-0 text-zinc-600">
                      {note.tags?.length > 0 && <Tag size={12} />}
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </button>

                  {/* Edit / Delete */}
                  <div className="flex items-center gap-1 pr-2 shrink-0">
                    <button
                      onClick={() => openEdit(note)}
                      aria-label="Edit note"
                      className="w-7 h-7 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      disabled={deleting && pendingDelete}
                      aria-label={pendingDelete ? 'Confirm delete' : 'Delete note'}
                      className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                        pendingDelete
                          ? 'text-red-400 bg-red-900/30 hover:bg-red-900/50 animate-pulse'
                          : 'text-zinc-600 hover:text-red-400 hover:bg-zinc-800'
                      }`}
                    >
                      {deleting && pendingDelete
                        ? <Loader2 size={12} className="animate-spin" />
                        : <Trash2 size={12} />
                      }
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 py-3 border-t border-zinc-800 space-y-2">
                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                    {note.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {note.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-xs rounded-full border border-zinc-700">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Delete confirm cancel */}
                {pendingDelete && !deleting && (
                  <div className="flex items-center justify-end gap-3 px-3 py-1.5 border-t border-red-900/30 bg-red-900/10">
                    <span className="text-xs text-red-400">Tap trash again to confirm delete</span>
                    <button
                      onClick={() => setDeleteId(null)}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-in Drawer */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={closeDrawer}
          />
          {/* Drawer panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col shadow-2xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <h3 className="text-base font-black text-white">
                {editingNote ? 'Edit Note' : 'New Note'}
              </h3>
              <button onClick={closeDrawer} aria-label="Close drawer" className="text-zinc-600 hover:text-zinc-300 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Note title…"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm(f => ({ ...f, type: e.target.value as DMNoteType }))}
                  aria-label="Note type"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50"
                >
                  {ALL_TYPES.map((t) => (
                    <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Session # (only for session type) */}
              {form.type === 'session' && (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Session #</label>
                  <input
                    type="number"
                    min="1"
                    value={form.sessionNumber}
                    onChange={e => setForm(f => ({ ...f, sessionNumber: e.target.value }))}
                    placeholder="e.g. 3"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              )}

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Content</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Write your note here…"
                  rows={6}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Tags</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="dragon, tavern, mystery (comma-separated)"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* Drawer footer */}
            <div className="flex gap-3 px-5 py-4 border-t border-zinc-800">
              <button
                onClick={closeDrawer}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-colors"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {editingNote ? 'Save Changes' : 'Create Note'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DMNotesPanel;
