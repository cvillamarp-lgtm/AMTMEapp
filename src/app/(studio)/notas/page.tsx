'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { Pin, Trash2, Plus, Save, X, Zap, BookOpen, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type Note = {
  id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  category: string;
  status: string;
  pinned: boolean;
};

const CATEGORIES = ['general', 'episodio', 'estrategia', 'monetizacion', 'tecnico', 'reflexion'];
const STATUS_OPTIONS = ['activa', 'archivada', 'pendiente'];

const MODOS_BAJA_ENERGIA = [
  'Escucha un episodio propio. Anotalo sin presion.',
  'Escribe tres lineas sobre lo que sientes. No tiene que ser contenido.',
  'Revisa el ultimo guion. Solo leer, no editar.',
  'Graba un memo de voz de 2 minutos. No lo edites.',
];

const PLAN_MINIMO_VIABLE = [
  'Publica una sola frase en historia. Algo que sientas verdad hoy.',
  'Responde un DM con atencion real. Uno solo.',
  'Escribe el hook del proximo episodio. Solo el hook.',
  'Registra una idea en Notas. Sin estructura.',
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

async function getNotes(): Promise<Note[]> {
  const sb = getSupabaseBrowserClient() as SupabaseClient;
  if (!sb) return [];
  const { data, error } = await sb
    .from('notes')
    .select('*')
    .is('user_id', null)
    .order('pinned', { ascending: false })
    .order('updated_at', { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    user_id: r.user_id as string | null,
    created_at: r.created_at as string,
    updated_at: r.updated_at as string,
    ...(r.payload as Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>),
  }));
}

async function saveNote(id: string | null, data: Partial<Note>): Promise<Note> {
  const sb = getSupabaseBrowserClient() as SupabaseClient;
  const payload = {
    title: data.title,
    content: data.content,
    category: data.category,
    status: data.status,
    pinned: data.pinned ?? false,
  };
  if (id) {
    const { data: row, error } = await sb
      .from('notes')
      .update({ payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return {
      id: row.id,
      user_id: row.user_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      ...row.payload,
    };
  } else {
    const { data: row, error } = await sb
      .from('notes')
      .insert([{ user_id: null, payload }])
      .select()
      .single();
    if (error) throw error;
    return {
      id: row.id,
      user_id: row.user_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      ...row.payload,
    };
  }
}

async function deleteNote(id: string) {
  const sb = getSupabaseBrowserClient() as SupabaseClient;
  const { error } = await sb.from('notes').delete().eq('id', id);
  if (error) throw error;
}

export default function NotasPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Note | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [energiaMode, setEnergiaMode] = useState(false);
  const [draft, setDraft] = useState({
    title: '',
    content: '',
    category: 'general',
    status: 'activa',
    pinned: false,
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch {
      toast.error('Error al cargar notas');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(
    () =>
      notes.filter((n) => {
        const matchQ =
          !search ||
          n.title?.toLowerCase().includes(search.toLowerCase()) ||
          n.content?.toLowerCase().includes(search.toLowerCase());
        const matchCat = categoryFilter === 'all' || n.category === categoryFilter;
        return matchQ && matchCat;
      }),
    [notes, search, categoryFilter]
  );

  function select(n: Note) {
    setSelected(n);
    setDraft({
      title: n.title || '',
      content: n.content || '',
      category: n.category || 'general',
      status: n.status || 'activa',
      pinned: n.pinned || false,
    });
    setEditing(false);
  }

  async function handleNew() {
    const newDraft = {
      title: 'Nueva nota',
      content: '',
      category: 'general',
      status: 'activa',
      pinned: false,
    };
    setSaving(true);
    try {
      const created = await saveNote(null, newDraft);
      setNotes((prev) => [created, ...prev]);
      setSelected(created);
      setDraft(newDraft);
      setEditing(true);
    } catch {
      toast.error('Error al crear nota');
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      const updated = await saveNote(selected.id, draft);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setSelected(updated);
      setEditing(false);
      toast.success('Nota guardada');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta nota?')) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Nota eliminada');
    } catch {
      toast.error('Error al eliminar');
    }
  }

  async function togglePin(note: Note) {
    try {
      const updated = await saveNote(note.id, { ...note, pinned: !note.pinned });
      setNotes((prev) =>
        prev
          .map((n) => (n.id === updated.id ? updated : n))
          .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
      );
      if (selected?.id === note.id) setSelected(updated);
    } catch {
      toast.error('Error al fijar nota');
    }
  }

  const diaIndex = new Date().getDay();

  const fmt = (s: string) =>
    new Date(s).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4 overflow-hidden pb-4 p-6 md:p-8">
      {/* Panel izquierdo */}
      <div className="flex w-72 shrink-0 flex-col gap-3">
        {/* Modo energia */}
        <div className="rounded-xl border border-[#e8ff40]/40 bg-[#e8ff40]/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#0c1f36]" />
              <span className="text-xs font-semibold text-[#0c1f36]">Energia creativa</span>
            </div>
            <button
              className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                energiaMode
                  ? 'bg-[#0c1f36] text-white'
                  : 'bg-white border border-[#0c1f36]/20 text-[#0c1f36]'
              }`}
              onClick={() => setEnergiaMode((v) => !v)}
            >
              {energiaMode ? 'Baja' : 'Normal'}
            </button>
          </div>
          {energiaMode ? (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">Modo baja energia:</p>
              <p className="text-xs text-[#0c1f36] leading-relaxed">
                {MODOS_BAJA_ENERGIA[diaIndex % MODOS_BAJA_ENERGIA.length]}
              </p>
              <p className="text-xs text-muted-foreground font-medium mt-2">Plan minimo viable:</p>
              <p className="text-xs text-[#0c1f36] leading-relaxed">
                {PLAN_MINIMO_VIABLE[diaIndex % PLAN_MINIMO_VIABLE.length]}
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Activa si hoy tienes poca energia para producir.</p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Buscar notas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm"
          />
          <Button
            onClick={handleNew}
            disabled={saving}
            className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
          <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <p className="text-xs text-center text-muted-foreground py-4">Cargando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-center text-muted-foreground py-8">Sin notas</p>
          ) : (
            filtered.map((n) => (
              <button
                key={n.id}
                onClick={() => select(n)}
                className={`w-full rounded-2xl border p-3 text-left transition-all ${selected?.id === n.id ? 'border-[#0c1f36] bg-[#0c1f36] text-white' : 'border-black/7 bg-white hover:bg-[#F5F1E8]'}`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span
                    className={`truncate text-sm font-semibold ${selected?.id === n.id ? 'text-white' : 'text-[#0c1f36]'}`}
                  >
                    {n.title || 'Sin titulo'}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {n.pinned && <Pin className="h-3 w-3 mt-0.5" />}
                    {n.category === 'reflexion' ? (
                      <Lock className="h-3 w-3 mt-0.5 text-muted-foreground" />
                    ) : (
                      <BookOpen className="h-3 w-3 mt-0.5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <p
                  className={`mt-1 truncate text-xs ${selected?.id === n.id ? 'text-white/60' : 'text-muted-foreground'}`}
                >
                  {n.content || 'Sin contenido'}
                </p>
                <p
                  className={`mt-1 text-xs ${selected?.id === n.id ? 'text-white/40' : 'text-muted-foreground/60'}`}
                >
                  {n.category === 'reflexion' ? 'privada' : 'publicable'} · {fmt(n.updated_at)}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Panel derecho — editor */}
      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        {selected ? (
          <>
            <div className="flex items-center justify-between border-b px-5 py-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{fmt(selected.updated_at)}</span>
                {selected.category === 'reflexion' ? (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Privada
                  </span>
                ) : (
                  <span className="text-xs bg-[#e8ff40]/20 px-2 py-0.5 rounded-full text-[#0c1f36] flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> Publicable
                  </span>
                )}
              </div>
              <div className="flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => togglePin(selected)}>
                  <Pin className={`h-4 w-4 ${selected.pinned ? 'fill-current' : ''}`} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(selected.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                {editing ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        select(selected);
                        setEditing(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-[#0c1f36] text-white"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {saving ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setEditing(true)}
                    className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]"
                  >
                    Editar
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {editing ? (
                <div className="space-y-4">
                  <Input
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    className="border-0 bg-transparent px-0 text-2xl font-bold text-[#0c1f36] focus-visible:ring-0 shadow-none"
                    placeholder="Título"
                  />
                  <div className="flex gap-3">
                    <Select
                      value={draft.category}
                      onValueChange={(v) => setDraft((d) => ({ ...d, category: v }))}
                    >
                      <SelectTrigger className="w-40 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={draft.status}
                      onValueChange={(v) => setDraft((d) => ({ ...d, status: v }))}
                    >
                      <SelectTrigger className="w-36 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={draft.content}
                    onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                    className="min-h-[400px] border-0 bg-transparent px-0 text-sm focus-visible:ring-0 shadow-none resize-none"
                    placeholder="Escribe aquí..."
                  />
                </div>
              ) : (
                <div className="cursor-text" onClick={() => setEditing(true)}>
                  <h1 className="text-2xl font-bold tracking-tight text-[#0c1f36]">
                    {selected.title}
                  </h1>
                  <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                    <span>{selected.category}</span>
                    <span>·</span>
                    <span>{selected.status}</span>
                  </div>
                  <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#0c1f36]">
                    {selected.content || (
                      <span className="italic text-muted-foreground">Haz clic para editar</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground p-8">
            <p className="text-lg font-semibold text-[#0c1f36]">Selecciona una nota</p>
            <p className="text-sm mt-1">o crea una nueva</p>
            <Button
              className="mt-4 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]"
              onClick={handleNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva nota
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
