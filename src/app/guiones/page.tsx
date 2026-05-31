'use client';

import { useState, useMemo } from 'react';
import { Card, Badge, Button, Input, Textarea, Select, Field } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { joinClasses } from '@/lib/studio-utils';

const SECTIONS = [
  { key: 'opening', label: 'Apertura' },
  { key: 'threshold', label: 'Umbral' },
  { key: 'wound', label: 'Herida' },
  { key: 'symbol', label: 'Símbolo' },
  { key: 'truth', label: 'Verdad' },
  { key: 'bridge', label: 'Puente' },
  { key: 'action', label: 'Acción' },
  { key: 'closing', label: 'Cierre' },
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

type Script = {
  id: string;
  title: string;
  episodeId: string;
  status: 'borrador' | 'revision' | 'listo-grabar' | 'grabado' | 'archivado';
  cta: string;
  voiceNotes: string;
  sections: Record<SectionKey, string>;
  createdAt: number;
  updatedAt: number;
};

const STATUSES: Record<Script['status'], { label: string; tone: 'neutral' | 'warning' | 'good' | 'accent' | 'danger' }> = {
  borrador: { label: 'Borrador', tone: 'neutral' },
  revision: { label: 'En revisión', tone: 'warning' },
  'listo-grabar': { label: 'Listo para grabar', tone: 'good' },
  grabado: { label: 'Grabado', tone: 'accent' },
  archivado: { label: 'Archivado', tone: 'neutral' },
};

const emptySections = (): Record<SectionKey, string> =>
  Object.fromEntries(SECTIONS.map((s) => [s.key, ''])) as Record<SectionKey, string>;

function useScripts() {
  const [scripts, setScripts] = useState<Script[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('amtme-scripts') || '[]'); } catch { return []; }
  });

  const save = (next: Script[]) => {
    setScripts(next);
    localStorage.setItem('amtme-scripts', JSON.stringify(next));
  };

  const create = (data: Omit<Script, 'id' | 'createdAt' | 'updatedAt'>) => {
    const s: Script = { ...data, id: Date.now().toString(), createdAt: Date.now(), updatedAt: Date.now() };
    save([s, ...scripts]);
    return s;
  };

  const update = (id: string, patch: Partial<Script>) =>
    save(scripts.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: Date.now() } : s)));

  const remove = (id: string) => save(scripts.filter((s) => s.id !== id));

  return { scripts, create, update, remove };
}

const emptyForm = (): Omit<Script, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '',
  episodeId: '',
  status: 'borrador',
  cta: '',
  voiceNotes: '',
  sections: emptySections(),
});

export default function GuionesPage() {
  const { state } = useStudio();
  const { scripts, create, update, remove } = useScripts();
  const [filter, setFilter] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<Script | null>(null);
  const [editing, setEditing] = useState<Script | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [tab, setTab] = useState<'sections' | 'notes'>('sections');

  const filtered = useMemo(
    () => scripts.filter((s) => filter === 'all' || s.status === filter),
    [scripts, filter]
  );

  const completeness = (s: Script) => {
    const filled = SECTIONS.filter((sec) => s.sections[sec.key]?.trim()).length;
    return Math.round((filled / SECTIONS.length) * 100);
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (s: Script) => {
    setEditing(s);
    setForm({ title: s.title, episodeId: s.episodeId, status: s.status, cta: s.cta, voiceNotes: s.voiceNotes, sections: { ...s.sections } });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    if (editing) { update(editing.id, form); }
    else { create(form); }
    setOpen(false);
  };

  const fmt = (ts: number) => new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(new Date(ts));

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/40">Editorial</div>
          <h1 className="mt-1 text-[28px] font-bold tracking-[-0.03em] text-[#0C1F36]">Guiones</h1>
          <p className="mt-1 text-[13px] text-[#6B7B8C]">Convierte estructuras narrativas en guiones listos para grabar.</p>
        </div>
        <Button onClick={openCreate}>+ Crear guión</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total', value: scripts.length },
          { label: 'Listos para grabar', value: scripts.filter((s) => s.status === 'listo-grabar').length },
          { label: 'En revisión', value: scripts.filter((s) => s.status === 'revision').length },
          { label: 'Grabados', value: scripts.filter((s) => s.status === 'grabado').length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-[20px] border border-black/[0.07] bg-white p-4 shadow-[0_2px_8px_rgba(12,31,54,0.05)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0C1F36]/40">{label}</div>
            <div className="mt-1 text-[28px] font-bold tracking-[-0.04em] text-[#0C1F36]">{value}</div>
          </div>
        ))}
      </div>

      {/* Filtro */}
      <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-48">
        <option value="all">Todos los estados</option>
        {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
      </Select>

      {/* Lista */}
      {filtered.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center py-10 text-center">
            <div className="text-4xl">📄</div>
            <p className="mt-3 text-[15px] font-semibold text-[#0C1F36]">Sin guiones</p>
            <Button className="mt-4" onClick={openCreate}>Crear guión</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const ep = state.episodes.find((e) => e.id === s.episodeId);
            const pct = completeness(s);
            return (
              <Card key={s.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-[#0C1F36]">{s.title}</span>
                      <Badge tone={STATUSES[s.status].tone}>{STATUSES[s.status].label}</Badge>
                    </div>
                    {ep && (
                      <div className="mt-0.5 text-[12px] text-[#6B7B8C]">
                        EP {ep.episodeNumber} — {ep.title}
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-[12px] text-[#6B7B8C]">
                      <span>Completitud: {pct}%</span>
                      <span>·</span>
                      <span>Actualizado {fmt(s.updatedAt)}</span>
                    </div>
                    {/* Barra */}
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/[0.07]">
                      <div className={joinClasses('h-full rounded-full', pct === 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-[#FEE94B]' : 'bg-[#E0211E]')} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="ghost" onClick={() => setViewing(s)}>Ver</Button>
                    <Button variant="secondary" onClick={() => openEdit(s)}>Editar</Button>
                    <Button variant="danger" onClick={() => remove(s.id)}>✕</Button>
                  </div>
                </div>
                {s.cta && (
                  <div className="mt-3 rounded-xl bg-[#FEE94B]/20 px-3 py-2 text-[12px] font-medium text-[#0C1F36]">
                    → {s.cta}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal crear/editar */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[24px] bg-white p-6 shadow-2xl">
            <h2 className="text-[20px] font-bold text-[#0C1F36]">{editing ? 'Editar guión' : 'Nuevo guión'}</h2>

            <div className="mt-4 space-y-3 overflow-y-auto max-h-[65vh]">
              <Field label="Título">
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Guión EP 35..." />
              </Field>
              <Field label="Episodio">
                <Select value={form.episodeId} onChange={(e) => setForm((f) => ({ ...f, episodeId: e.target.value }))}>
                  <option value="">Selecciona un episodio</option>
                  {state.episodes.map((ep) => <option key={ep.id} value={ep.id}>{ep.episodeNumber} — {ep.title}</option>)}
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Estado">
                  <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Script['status'] }))}>
                    {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </Select>
                </Field>
                <Field label="CTA">
                  <Input value={form.cta} onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))} placeholder="CTA del episodio" />
                </Field>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-black/[0.07] pb-2">
                {(['sections', 'notes'] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={joinClasses('rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all', tab === t ? 'bg-[#0C1F36] text-white' : 'text-[#6B7B8C] hover:bg-black/[0.05]')}>
                    {t === 'sections' ? 'Secciones' : 'Notas de voz'}
                  </button>
                ))}
              </div>

              {tab === 'sections' ? (
                <div className="space-y-3">
                  {SECTIONS.map((sec) => (
                    <Field key={sec.key} label={sec.label}>
                      <Textarea
                        value={form.sections[sec.key]}
                        onChange={(e) => setForm((f) => ({ ...f, sections: { ...f.sections, [sec.key]: e.target.value } }))}
                        placeholder={`Texto de ${sec.label.toLowerCase()}...`}
                        className="!min-h-[80px]"
                      />
                    </Field>
                  ))}
                </div>
              ) : (
                <Field label="Notas de voz / grabación">
                  <Textarea value={form.voiceNotes} onChange={(e) => setForm((f) => ({ ...f, voiceNotes: e.target.value }))} placeholder="Pausas, énfasis, tono..." className="!min-h-[120px]" />
                </Field>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit}>{editing ? 'Actualizar' : 'Crear'}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ver guión */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[24px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-[#0C1F36]">{viewing.title}</h2>
                <div className="mt-1"><Badge tone={STATUSES[viewing.status].tone}>{STATUSES[viewing.status].label}</Badge></div>
              </div>
              <Button variant="ghost" onClick={() => setViewing(null)}>✕</Button>
            </div>
            <div className="mt-4 max-h-[65vh] overflow-y-auto space-y-4">
              {SECTIONS.map((sec) => viewing.sections[sec.key] && (
                <div key={sec.key}>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/40">{sec.label}</div>
                  <div className="mt-1 rounded-xl bg-[#F5F1E8] px-4 py-3 text-[13px] leading-relaxed text-[#0C1F36] whitespace-pre-wrap">{viewing.sections[sec.key]}</div>
                </div>
              ))}
              {viewing.cta && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/40">CTA</div>
                  <div className="mt-1 rounded-xl bg-[#FEE94B]/30 px-4 py-3 text-[13px] text-[#0C1F36]">{viewing.cta}</div>
                </div>
              )}
              {viewing.voiceNotes && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/40">Notas de voz</div>
                  <div className="mt-1 rounded-xl bg-black/[0.03] px-4 py-3 text-[12px] text-[#6B7B8C] whitespace-pre-wrap">{viewing.voiceNotes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
