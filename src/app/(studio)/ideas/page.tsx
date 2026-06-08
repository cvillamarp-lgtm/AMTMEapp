'use client';

import { useEffect, useState, useMemo } from 'react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { getIdeas, createIdea, updateIdea, deleteIdea } from '@/lib/database';
import type { Idea, IdeaCategory, IdeaStatus } from '@/types/database';
import { toast } from 'sonner';

const CATEGORIES: { value: IdeaCategory; label: string }[] = [
  { value: 'amor-propio', label: 'Amor propio' },
  { value: 'relaciones', label: 'Relaciones' },
  { value: 'ruptura', label: 'Ruptura' },
  { value: 'apego', label: 'Apego' },
  { value: 'limites', label: 'Límites' },
  { value: 'tarot-terapeutico', label: 'Tarot terapéutico' },
  { value: 'sanacion-emocional', label: 'Sanación emocional' },
  { value: 'identidad', label: 'Identidad' },
  { value: 'proposito', label: 'Propósito' },
  { value: 'sombra', label: 'Sombra' },
  { value: 'renacimiento', label: 'Renacimiento' },
];

const STATUSES: { value: IdeaStatus; label: string }[] = [
  { value: 'nueva', label: 'Nueva' },
  { value: 'en-desarrollo', label: 'En desarrollo' },
  { value: 'lista', label: 'Lista' },
  { value: 'usada', label: 'Usada' },
  { value: 'archivada', label: 'Archivada' },
];

const PRIORITIES = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
];

const STATUS_TONE: Record<IdeaStatus, 'good' | 'accent' | 'warning' | 'neutral'> = {
  lista: 'good',
  'en-desarrollo': 'accent',
  nueva: 'warning',
  usada: 'neutral',
  archivada: 'neutral',
};

const PRIORITY_TONE: Record<string, 'good' | 'accent' | 'warning' | 'neutral'> = {
  alta: 'warning',
  media: 'accent',
  baja: 'neutral',
};

const EMPTY: Omit<Idea, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
  title: '',
  category: 'amor-propio',
  priority: 'media',
  emotional_state: '',
  theme: '',
  episode_id: null,
  viral_potential: null,
  therapeutic_potential: null,
  notes: '',
  status: 'nueva',
};

function PotentialDots({ value, max = 5 }: { value: number | null; max?: number }) {
  if (value === null) return <span className="text-black/30">—</span>;
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${i < value ? 'bg-[#0C1F36]' : 'bg-black/12'}`}
        />
      ))}
    </span>
  );
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Idea | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<IdeaStatus | 'todas'>('todas');
  const [filterCategory, setFilterCategory] = useState<IdeaCategory | 'todas'>('todas');
  const [filterPriority, setFilterPriority] = useState<'alta' | 'media' | 'baja' | 'todas'>('todas');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    getIdeas()
      .then(setIdeas)
      .catch(() => toast.error('Error cargando ideas'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return ideas.filter((idea) => {
      if (filterStatus !== 'todas' && idea.status !== filterStatus) return false;
      if (filterCategory !== 'todas' && idea.category !== filterCategory) return false;
      if (filterPriority !== 'todas' && idea.priority !== filterPriority) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          idea.title.toLowerCase().includes(q) ||
          (idea.theme ?? '').toLowerCase().includes(q) ||
          (idea.notes ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [ideas, filterStatus, filterCategory, filterPriority, search]);

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY });
    setOpen(true);
  }

  function openEdit(idea: Idea) {
    setEditing(idea);
    setForm({
      title: idea.title,
      category: idea.category,
      priority: idea.priority,
      emotional_state: idea.emotional_state ?? '',
      theme: idea.theme ?? '',
      episode_id: idea.episode_id,
      viral_potential: idea.viral_potential,
      therapeutic_potential: idea.therapeutic_potential,
      notes: idea.notes ?? '',
      status: idea.status,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        viral_potential: form.viral_potential ? Number(form.viral_potential) : null,
        therapeutic_potential: form.therapeutic_potential
          ? Number(form.therapeutic_potential)
          : null,
      };
      if (editing) {
        const updated = await updateIdea(editing.id, payload);
        setIdeas((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        toast.success('Idea actualizada');
      } else {
        const created = await createIdea(payload);
        setIdeas((prev) => [created, ...prev]);
        toast.success('Idea creada');
      }
      setOpen(false);
    } catch {
      toast.error('Error guardando idea');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    try {
      await deleteIdea(id);
      setIdeas((prev) => prev.filter((i) => i.id !== id));
      setConfirmDelete(null);
      toast.success('Idea eliminada');
    } catch {
      toast.error('Error eliminando idea');
    }
  }

  const set = (k: keyof typeof form) => (v: string | number | null) =>
    setForm((f) => ({ ...f, [k]: v }));

  const nuevas = ideas.filter((i) => i.status === 'nueva').length;
  const listas = ideas.filter((i) => i.status === 'lista').length;
  const enDesarrollo = ideas.filter((i) => i.status === 'en-desarrollo').length;

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Banco de ideas</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">Ideas</h2>
            <p className="mt-1 text-sm text-black/50">
              Captura, clasifica y prioriza ideas para episodios y contenido
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="warning">{nuevas} nuevas</Badge>
            <Badge tone="accent">{enDesarrollo} en desarrollo</Badge>
            <Badge tone="good">{listas} listas</Badge>
            <Badge tone="neutral">{ideas.length} total</Badge>
            <Button onClick={openNew}>+ Nueva idea</Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-5 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Buscar ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-xl border border-black/12 bg-white px-3 text-sm placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-[#0C1F36]/20 min-w-[180px]"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as IdeaStatus | 'todas')}
            className="h-9 rounded-xl border border-black/12 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C1F36]/20"
          >
            <option value="todas">Todos los estados</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as IdeaCategory | 'todas')}
            className="h-9 rounded-xl border border-black/12 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C1F36]/20"
          >
            <option value="todas">Todas las categorías</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) =>
              setFilterPriority(e.target.value as 'alta' | 'media' | 'baja' | 'todas')
            }
            className="h-9 rounded-xl border border-black/12 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C1F36]/20"
          >
            <option value="todas">Todas las prioridades</option>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lista */}
        {loading ? (
          <p className="mt-8 text-sm text-black/40">Cargando ideas...</p>
        ) : filtered.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-sm text-black/40">
              {ideas.length === 0 ? 'No hay ideas registradas.' : 'No hay ideas con estos filtros.'}
            </p>
            {ideas.length === 0 && (
              <button
                onClick={openNew}
                className="mt-2 text-[#0C1F36] underline underline-offset-2 text-sm"
              >
                Capturar primera idea
              </button>
            )}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {filtered.map((idea) => {
              const categoryLabel =
                CATEGORIES.find((c) => c.value === idea.category)?.label ?? idea.category;
              return (
                <div
                  key={idea.id}
                  className="rounded-3xl border border-black/8 bg-[#F5F2EA] p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold leading-snug text-[#0C1F36] truncate">
                        {idea.title}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <Badge tone={STATUS_TONE[idea.status]}>
                          {STATUSES.find((s) => s.value === idea.status)?.label ?? idea.status}
                        </Badge>
                        <Badge tone={PRIORITY_TONE[idea.priority]}>{idea.priority}</Badge>
                        <span className="rounded-full border border-black/12 bg-white px-2.5 py-0.5 text-xs font-medium text-black/60">
                          {categoryLabel}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => openEdit(idea)}
                        className="text-xs text-black/40 hover:text-black/70 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(idea.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {idea.theme && (
                    <p className="mt-2 text-sm text-black/60">
                      <span className="font-medium text-black/70">Tema:</span> {idea.theme}
                    </p>
                  )}

                  {(idea.viral_potential !== null || idea.therapeutic_potential !== null) && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-black/45 mb-1">Potencial viral</p>
                        <PotentialDots value={idea.viral_potential} />
                      </div>
                      <div>
                        <p className="text-xs text-black/45 mb-1">Potencial terapéutico</p>
                        <PotentialDots value={idea.therapeutic_potential} />
                      </div>
                    </div>
                  )}

                  {idea.emotional_state && (
                    <p className="mt-2 text-xs text-black/50">
                      <span className="font-medium">Estado emocional:</span> {idea.emotional_state}
                    </p>
                  )}

                  {idea.notes && (
                    <p className="mt-2 text-sm text-black/55 leading-6 line-clamp-2">{idea.notes}</p>
                  )}

                  <p className="mt-3 text-xs text-black/35">
                    {new Date(idea.created_at).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal crear/editar */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="my-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#0C1F36]">
              {editing ? 'Editar idea' : 'Nueva idea'}
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Título *" className="sm:col-span-2">
                <Input
                  value={form.title}
                  onChange={(e) => set('title')(e.target.value)}
                  placeholder="¿Cuál es la idea?"
                />
              </Field>
              <Field label="Categoría">
                <Select
                  value={form.category}
                  onChange={(e) => set('category')(e.target.value as IdeaCategory)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Estado">
                <Select
                  value={form.status}
                  onChange={(e) => set('status')(e.target.value as IdeaStatus)}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Prioridad">
                <Select
                  value={form.priority}
                  onChange={(e) =>
                    set('priority')(e.target.value as 'alta' | 'media' | 'baja')
                  }
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Tema">
                <Input
                  value={form.theme ?? ''}
                  onChange={(e) => set('theme')(e.target.value)}
                  placeholder="Tema central de la idea"
                />
              </Field>
              <Field label="Estado emocional">
                <Input
                  value={form.emotional_state ?? ''}
                  onChange={(e) => set('emotional_state')(e.target.value)}
                  placeholder="Ej: vulnerabilidad, esperanza..."
                />
              </Field>
              <Field label="Potencial viral (1-5)">
                <Select
                  value={form.viral_potential?.toString() ?? ''}
                  onChange={(e) =>
                    set('viral_potential')(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">Sin evaluar</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Potencial terapéutico (1-5)">
                <Select
                  value={form.therapeutic_potential?.toString() ?? ''}
                  onChange={(e) =>
                    set('therapeutic_potential')(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">Sin evaluar</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Notas" className="sm:col-span-2">
                <Textarea
                  value={form.notes ?? ''}
                  onChange={(e) => set('notes')(e.target.value)}
                  placeholder="Notas, contexto, desarrollo inicial..."
                  rows={3}
                />
              </Field>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-black/10 rounded-xl hover:bg-black/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium bg-[#0C1F36] text-white rounded-xl hover:bg-[#0C1F36]/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear idea'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación de eliminación */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-[#0C1F36]">Eliminar idea</h3>
            <p className="mt-2 text-sm text-black/60">
              Esta acción no se puede deshacer. La idea se eliminará permanentemente.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm font-medium border border-black/10 rounded-xl hover:bg-black/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => remove(confirmDelete)}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
