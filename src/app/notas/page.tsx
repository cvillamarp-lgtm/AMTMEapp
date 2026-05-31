'use client';

import { useState, useMemo } from 'react';
import { Card, Button, Input, Textarea } from '@/components/ui';
import { joinClasses } from '@/lib/studio-utils';

type Note = { id: string; title: string; content: string; pinned: boolean; updatedAt: number };

function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('amtme-notes') || '[]'); } catch { return []; }
  });

  const save = (next: Note[]) => {
    setNotes(next);
    localStorage.setItem('amtme-notes', JSON.stringify(next));
  };

  const create = () => {
    const n: Note = { id: Date.now().toString(), title: 'Nueva nota', content: '', pinned: false, updatedAt: Date.now() };
    save([n, ...notes]);
    return n;
  };

  const update = (id: string, patch: Partial<Note>) =>
    save(notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)));

  const remove = (id: string) => save(notes.filter((n) => n.id !== id));
  const togglePin = (id: string) => update(id, { pinned: !notes.find((n) => n.id === id)?.pinned });

  return { notes, create, update, remove, togglePin };
}

export default function NotasPage() {
  const { notes, create, update, remove, togglePin } = useNotes();
  const [selected, setSelected] = useState<Note | null>(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: '', content: '' });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...notes]
      .filter((n) => !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt - a.updatedAt);
  }, [notes, search]);

  const select = (n: Note) => { setSelected(n); setDraft({ title: n.title, content: n.content }); setEditing(false); };

  const handleCreate = () => {
    const n = create();
    setSelected(n);
    setDraft({ title: n.title, content: '' });
    setEditing(true);
  };

  const handleSave = () => {
    if (!selected) return;
    update(selected.id, { title: draft.title || 'Sin título', content: draft.content });
    setSelected((prev) => prev ? { ...prev, title: draft.title || 'Sin título', content: draft.content } : null);
    setEditing(false);
  };

  const fmt = (ts: number) => new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(ts));

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4 overflow-hidden pb-4">
      {/* Sidebar de notas */}
      <div className="flex w-72 shrink-0 flex-col gap-3">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar notas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleCreate} variant="primary">+</Button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center text-[#6B7B8C]">
              <div className="text-3xl">📝</div>
              <p className="mt-2 text-[13px]">Sin notas</p>
            </div>
          ) : (
            filtered.map((n) => (
              <button
                key={n.id}
                onClick={() => select(n)}
                className={joinClasses(
                  'w-full rounded-2xl border p-3 text-left transition-all',
                  selected?.id === n.id
                    ? 'border-[#0C1F36] bg-[#0C1F36] text-white'
                    : 'border-black/[0.07] bg-white hover:bg-[#F5F1E8]'
                )}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className={joinClasses('truncate text-[13px] font-semibold', selected?.id === n.id ? 'text-white' : 'text-[#0C1F36]')}>
                    {n.title}
                  </span>
                  {n.pinned && <span className="shrink-0 text-[10px]">📌</span>}
                </div>
                <p className={joinClasses('mt-1 truncate text-[11px]', selected?.id === n.id ? 'text-white/60' : 'text-[#6B7B8C]')}>
                  {n.content || 'Sin contenido'}
                </p>
                <p className={joinClasses('mt-1 text-[10px]', selected?.id === n.id ? 'text-white/40' : 'text-[#6B7B8C]/60')}>
                  {fmt(n.updatedAt)}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <Card className="flex flex-1 flex-col overflow-hidden !p-0">
        {selected ? (
          <>
            <div className="flex items-center justify-between border-b border-black/[0.07] px-5 py-3">
              <span className="text-[11px] text-[#6B7B8C]">{fmt(selected.updatedAt)}</span>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => togglePin(selected.id)}>
                  {notes.find((n) => n.id === selected.id)?.pinned ? '📌 Desanclar' : '📌 Anclar'}
                </Button>
                <Button variant="ghost" onClick={() => { remove(selected.id); setSelected(null); }}>
                  🗑 Eliminar
                </Button>
                {editing ? (
                  <>
                    <Button variant="secondary" onClick={() => { setDraft({ title: selected.title, content: selected.content }); setEditing(false); }}>
                      Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>Guardar</Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={() => setEditing(true)}>Editar</Button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {editing ? (
                <div className="space-y-4">
                  <Input
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    className="!rounded-xl !border-0 !bg-transparent !px-0 !text-[24px] !font-bold !text-[#0C1F36] focus:!shadow-none"
                    placeholder="Título"
                  />
                  <Textarea
                    value={draft.content}
                    onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                    className="!min-h-[400px] !rounded-xl !border-0 !bg-transparent !px-0 !text-[14px] focus:!shadow-none"
                    placeholder="Escribe aquí..."
                  />
                </div>
              ) : (
                <div className="cursor-text" onClick={() => setEditing(true)}>
                  <h1 className="text-[24px] font-bold tracking-tight text-[#0C1F36]">{selected.title}</h1>
                  <div className="mt-4 whitespace-pre-wrap text-[14px] leading-relaxed text-[#0C1F36]">
                    {selected.content || <span className="italic text-[#6B7B8C]">Haz clic para editar</span>}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-[#6B7B8C]">
            <div className="text-5xl">📝</div>
            <p className="mt-3 text-[15px] font-semibold text-[#0C1F36]">Selecciona una nota</p>
            <p className="mt-1 text-[13px]">o crea una nueva</p>
            <Button className="mt-4" onClick={handleCreate}>Nueva nota</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
