'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import {
  getMasterSections,
  createMasterSection,
  updateMasterSection,
  deleteMasterSection,
} from '@/lib/database';
import type { MasterSection } from '@/types/database';

const STATUS_OPTIONS: MasterSection['status'][] = [
  'vigente',
  'pendiente',
  'historico',
  'requiere-decision',
];
const PRIORITY_OPTIONS: MasterSection['priority'][] = ['alta', 'media', 'baja'];

const STATUS_TONE: Record<MasterSection['status'], 'good' | 'warning' | 'neutral'> = {
  vigente: 'good',
  'requiere-decision': 'warning',
  pendiente: 'neutral',
  historico: 'neutral',
};

const EMPTY: Omit<MasterSection, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'version'> = {
  title: '',
  content: '',
  status: 'pendiente',
  priority: 'media',
  responsible: null,
  notes: null,
  last_reviewed_at: null,
};

export default function DocumentoMaestroPage() {
  const [sections, setSections] = useState<MasterSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MasterSection | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const [newForm, setNewForm] = useState({ ...EMPTY });

  useEffect(() => {
    getMasterSections()
      .then((data) => {
        setSections(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
          setDraft(data[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      sections.filter((s) => `${s.title} ${s.content}`.toLowerCase().includes(query.toLowerCase())),
    [sections, query]
  );

  function selectSection(s: MasterSection) {
    setSelectedId(s.id);
    setDraft({ ...s });
  }

  async function saveSection() {
    if (!draft) return;
    setSaving(true);
    try {
      const updated = await updateMasterSection(draft.id, {
        title: draft.title,
        content: draft.content,
        status: draft.status,
        priority: draft.priority,
        responsible: draft.responsible,
        notes: draft.notes,
        last_reviewed_at: draft.last_reviewed_at,
      });
      setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setDraft(updated);
    } finally {
      setSaving(false);
    }
  }

  async function markReviewed() {
    if (!draft) return;
    const today = new Date().toISOString().split('T')[0];
    setSaving(true);
    try {
      const updated = await updateMasterSection(draft.id, {
        status: 'vigente',
        last_reviewed_at: today,
      });
      setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setDraft(updated);
    } finally {
      setSaving(false);
    }
  }

  async function createNew() {
    if (!newForm.title.trim()) return;
    setSaving(true);
    try {
      const created = await createMasterSection({ ...newForm, version: 1 } as Omit<
        MasterSection,
        'id' | 'created_at' | 'updated_at' | 'user_id'
      >);
      setSections((prev) => [created, ...prev]);
      setSelectedId(created.id);
      setDraft(created);
      setNewOpen(false);
      setNewForm({ ...EMPTY });
    } finally {
      setSaving(false);
    }
  }

  async function removeSection(id: string) {
    await deleteMasterSection(id);
    setSections((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (selectedId === id && next.length > 0) {
        setSelectedId(next[0].id);
        setDraft(next[0]);
      } else if (next.length === 0) {
        setSelectedId(null);
        setDraft(null);
      }
      return next;
    });
  }

  const setNew = (k: keyof typeof newForm) => (v: string) => setNewForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      {/* Panel izquierdo — lista */}
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">
              Documento Maestro
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-amtme-navy">
              Materia prima editorial
            </h2>
            <p className="mt-0.5 text-xs text-black/40">
              Ideas, heridas y temas que esperan convertirse en episodio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="accent">{sections.length} secciones</Badge>
            <Button onClick={() => setNewOpen(true)}>+ Nueva</Button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar sección..."
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#0C1F36]/20"
          />

          {loading ? (
            <p className="text-sm text-black/40">Cargando secciones...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-black/40 py-8">
              {query ? 'Sin resultados.' : 'No hay secciones. Crea la primera.'}
            </p>
          ) : (
            <div className="max-h-[580px] space-y-2 overflow-auto pr-1">
              {filtered.map((section) => (
                <button
                  key={section.id}
                  onClick={() => selectSection(section)}
                  className={`w-full rounded-3xl border px-4 py-4 text-left transition ${selectedId === section.id ? 'border-[#0C1F36] bg-amtme-navy text-white shadow-[0_12px_30px_rgba(0,31,54,0.18)]' : 'border-black/8 bg-amtme-cream text-amtme-navy hover:bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold">{section.title}</div>
                      <div
                        className={`mt-0.5 text-xs uppercase tracking-[0.18em] ${selectedId === section.id ? 'text-white/60' : 'text-black/38'}`}
                      >
                        {section.status} · {section.priority}
                      </div>
                    </div>
                    {section.last_reviewed_at && (
                      <span
                        className={`shrink-0 text-xs ${selectedId === section.id ? 'text-white/60' : 'text-black/40'}`}
                      >
                        {section.last_reviewed_at}
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-2 line-clamp-2 text-sm leading-5 ${selectedId === section.id ? 'text-white/80' : 'text-black/60'}`}
                  >
                    {section.content}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Panel derecho — editor */}
      <Card>
        {draft ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-black/40">
                  Sección activa
                </div>
                <h3 className="mt-1 text-xl font-semibold text-amtme-navy">{draft.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={STATUS_TONE[draft.status]}>{draft.status}</Badge>
                <button
                  onClick={() => removeSection(draft.id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Título">
                <Input
                  value={draft.title}
                  onChange={(e) => setDraft((d) => (d ? { ...d, title: e.target.value } : d))}
                />
              </Field>
              <Field label="Estado">
                <Select
                  value={draft.status}
                  onChange={(e) =>
                    setDraft((d) =>
                      d ? { ...d, status: e.target.value as MasterSection['status'] } : d
                    )
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Prioridad">
                <Select
                  value={draft.priority}
                  onChange={(e) =>
                    setDraft((d) =>
                      d ? { ...d, priority: e.target.value as MasterSection['priority'] } : d
                    )
                  }
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Responsable">
                <Input
                  value={draft.responsible ?? ''}
                  onChange={(e) => setDraft((d) => (d ? { ...d, responsible: e.target.value } : d))}
                  placeholder="¿Quién gestiona esto?"
                />
              </Field>
              <Field label="Última revisión">
                <Input
                  type="date"
                  value={draft.last_reviewed_at ?? ''}
                  onChange={(e) =>
                    setDraft((d) => (d ? { ...d, last_reviewed_at: e.target.value } : d))
                  }
                />
              </Field>
            </div>

            <Field label="Contenido">
              <Textarea
                rows={14}
                value={draft.content}
                onChange={(e) => setDraft((d) => (d ? { ...d, content: e.target.value } : d))}
                placeholder="Contenido de esta sección del documento maestro..."
              />
            </Field>

            <Field label="Notas internas">
              <Textarea
                rows={3}
                value={draft.notes ?? ''}
                onChange={(e) => setDraft((d) => (d ? { ...d, notes: e.target.value } : d))}
                placeholder="Notas internas, contexto, próximas decisiones..."
              />
            </Field>

            <div className="flex flex-wrap gap-2">
              <Button onClick={saveSection} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar sección'}
              </Button>
              <Button variant="secondary" onClick={markReviewed} disabled={saving}>
                Marcar revisada hoy
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  const orig = sections.find((s) => s.id === draft.id);
                  if (orig) setDraft(orig);
                }}
              >
                Revertir
              </Button>
            </div>

            {/* Destino editorial */}
            <div className="rounded-2xl border border-[#0C1F36]/10 bg-amtme-cream p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-black/40 mb-3">
                Destino editorial
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/studio/episodios"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#0C1F36]/20 bg-white px-3 py-1.5 text-xs font-medium text-amtme-navy hover:bg-amtme-navy hover:text-white transition-colors"
                >
                  → Convertir en episodio
                </Link>
                <Link
                  href="/guiones"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#0C1F36]/20 bg-white px-3 py-1.5 text-xs font-medium text-amtme-navy hover:bg-amtme-navy hover:text-white transition-colors"
                >
                  → Ir a guiones
                </Link>
              </div>
              <p className="mt-2 text-xs text-black/40">
                Esta sección puede ser el punto de partida de un episodio, un reel o una reflexión
                futura.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-20 text-center">
            <p className="text-sm text-black/40">Selecciona una sección para editarla.</p>
            <div className="flex gap-2">
              <Link
                href="/studio/episodios"
                className="rounded-xl border border-black/10 bg-amtme-cream px-3 py-1.5 text-xs font-medium text-amtme-navy hover:bg-white transition-colors"
              >
                Ver episodios
              </Link>
              <Link
                href="/guiones"
                className="rounded-xl border border-black/10 bg-amtme-cream px-3 py-1.5 text-xs font-medium text-amtme-navy hover:bg-white transition-colors"
              >
                Ver guiones
              </Link>
            </div>
          </div>
        )}
      </Card>

      {/* Modal nueva sección */}
      {newOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-amtme-navy">Nueva sección</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Título *">
                <Input
                  value={newForm.title}
                  onChange={(e) => setNew('title')(e.target.value)}
                  placeholder="Nombre de la sección"
                />
              </Field>
              <Field label="Estado">
                <Select value={newForm.status} onChange={(e) => setNew('status')(e.target.value)}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Prioridad">
                <Select
                  value={newForm.priority}
                  onChange={(e) => setNew('priority')(e.target.value)}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Responsable">
                <Input
                  value={newForm.responsible ?? ''}
                  onChange={(e) => setNew('responsible')(e.target.value)}
                  placeholder="Responsable de esta sección"
                />
              </Field>
              <Field label="Contenido">
                <Textarea
                  value={newForm.content}
                  onChange={(e) => setNew('content')(e.target.value)}
                  rows={5}
                  placeholder="Contenido inicial..."
                />
              </Field>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setNewOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-black/10 rounded-xl hover:bg-black/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={createNew}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium bg-amtme-navy text-white rounded-xl hover:bg-amtme-navy/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Creando...' : 'Crear sección'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
