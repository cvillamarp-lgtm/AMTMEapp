'use client';

import { useMemo, useState } from 'react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import type { MasterSection } from '@/lib/studio-types';
import { formatDate } from '@/lib/studio-utils';

export default function DocumentoMaestroPage() {
  const { state, setState } = useStudio();
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      state.masterSections.filter((section) =>
        `${section.title} ${section.content}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query, state.masterSections]
  );
  const [selectedId, setSelectedId] = useState(state.masterSections[0]?.id ?? '');
  const selected =
    state.masterSections.find((section) => section.id === selectedId) ?? state.masterSections[0];
  const [draft, setDraft] = useState<MasterSection | undefined>(selected);

  const syncSelected = (sectionId: string) => {
    const section = state.masterSections.find((item) => item.id === sectionId);
    if (section) {
      setSelectedId(sectionId);
      setDraft(section);
    }
  };

  const saveSection = () => {
    if (!draft) return;
    setState((current) => ({
      ...current,
      masterSections: current.masterSections.map((section) =>
        section.id === draft.id ? { ...draft } : section
      ),
    }));
  };

  const markReviewed = () => {
    if (!draft) return;
    const updated = {
      ...draft,
      status: 'Vigente' as const,
      lastReviewedAt: new Date().toISOString().slice(0, 10),
    };
    setDraft(updated);
    setState((current) => ({
      ...current,
      masterSections: current.masterSections.map((section) =>
        section.id === updated.id ? updated : section
      ),
    }));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">
              Documento Maestro
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
              Fuente central de conocimiento
            </h2>
          </div>
          <Badge tone="accent">{state.masterSections.length} secciones</Badge>
        </div>
        <div className="mt-5 space-y-4">
          <Field label="Buscar sección">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Resumen ejecutivo, métricas, política..."
            />
          </Field>
          <div className="max-h-[620px] space-y-3 overflow-auto pr-1">
            {filtered.map((section) => (
              <button
                key={section.id}
                onClick={() => syncSelected(section.id)}
                className={`w-full rounded-3xl border px-4 py-4 text-left transition ${selected?.id === section.id ? 'border-[#0C1F36] bg-[#0C1F36] text-white shadow-[0_12px_30px_rgba(0,31,54,0.18)]' : 'border-black/8 bg-[#F5F2EA] text-[#0C1F36] hover:bg-white'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{section.title}</div>
                    <div
                      className={`mt-1 text-xs uppercase tracking-[0.18em] ${selected?.id === section.id ? 'text-white/60' : 'text-black/38'}`}
                    >
                      {section.status}
                    </div>
                  </div>
                  <span
                    className={`text-xs ${selected?.id === section.id ? 'text-white/65' : 'text-black/45'}`}
                  >
                    {formatDate(section.lastReviewedAt)}
                  </span>
                </div>
                <p
                  className={`mt-3 line-clamp-3 text-sm leading-6 ${selected?.id === section.id ? 'text-white/82' : 'text-black/60'}`}
                >
                  {section.content}
                </p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        {draft ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-black/40">
                  Sección activa
                </div>
                <h3 className="mt-1 text-2xl font-semibold text-[#0C1F36]">{draft.title}</h3>
              </div>
              <Badge
                tone={
                  draft.status === 'Vigente'
                    ? 'good'
                    : draft.status === 'Requiere decisión'
                      ? 'warning'
                      : 'neutral'
                }
              >
                {draft.status}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Estado">
                <Select
                  value={draft.status}
                  onChange={(event) =>
                    setDraft({ ...draft, status: event.target.value as MasterSection['status'] })
                  }
                >
                  <option>Vigente</option>
                  <option>Pendiente</option>
                  <option>Histórico</option>
                  <option>Requiere decisión</option>
                </Select>
              </Field>
              <Field label="Última revisión">
                <Input
                  value={draft.lastReviewedAt}
                  onChange={(event) => setDraft({ ...draft, lastReviewedAt: event.target.value })}
                />
              </Field>
            </div>

            <Field label="Contenido">
              <Textarea
                rows={18}
                value={draft.content}
                onChange={(event) => setDraft({ ...draft, content: event.target.value })}
              />
            </Field>

            <div className="flex flex-wrap gap-2">
              <Button onClick={saveSection}>Guardar bloque</Button>
              <Button variant="secondary" onClick={markReviewed}>
                Marcar como revisada
              </Button>
              <Button variant="secondary" onClick={() => setDraft(selected)}>
                Revertir cambios
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-black/50">Selecciona una sección para editarla.</p>
        )}
      </Card>
    </div>
  );
}
