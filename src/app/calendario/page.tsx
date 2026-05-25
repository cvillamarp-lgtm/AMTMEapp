'use client';

import { useState } from 'react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';

export default function CalendarioPage() {
  const { state, setState } = useStudio();
  const [draft, setDraft] = useState(
    state.calendarEvents[0] ?? {
      id: `cal-${Date.now()}`,
      title: '',
      type: 'Publicación',
      date: new Date().toISOString().slice(0, 10),
      time: '11:00',
      frequency: 'Semanal',
      channel: 'Spotify',
      relatedEpisodeId: state.episodes[0]?.id ?? '',
      relatedContentId: state.contentPieces[0]?.id ?? '',
      status: 'Pendiente' as const,
      notes: '',
    }
  );

  const saveEvent = () => {
    setState((current) => ({
      ...current,
      calendarEvents: [draft, ...current.calendarEvents],
    }));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Calendario</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
              Secuencia operativa
            </h2>
          </div>
          <Badge tone="accent">{state.calendarEvents.length} eventos</Badge>
        </div>
        <div className="mt-5 space-y-3">
          {state.calendarEvents.map((event) => (
            <div key={event.id} className="rounded-3xl border border-black/8 bg-[#F5F2EA] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-black/38">
                    {event.date} · {event.time}
                  </div>
                  <div className="mt-1 text-base font-semibold text-[#0C1F36]">{event.title}</div>
                </div>
                <Badge tone={event.status === 'Listo' ? 'good' : 'neutral'}>{event.status}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-black/60 sm:grid-cols-2">
                <span>Canal: {event.channel}</span>
                <span>Tipo: {event.type}</span>
                <span>Frecuencia: {event.frequency}</span>
                <span>Relacionado: {event.relatedEpisodeId || 'N/D'}</span>
              </div>
              <p className="mt-3 text-sm text-black/55">{event.notes}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-[0.22em] text-black/40">Nuevo evento</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Título">
            <Input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            />
          </Field>
          <Field label="Tipo">
            <Select
              value={draft.type}
              onChange={(event) => setDraft({ ...draft, type: event.target.value })}
            >
              <option>Publicación</option>
              <option>Grabación</option>
              <option>Guion</option>
              <option>Edición</option>
              <option>Revisión</option>
              <option>Medición</option>
            </Select>
          </Field>
          <Field label="Fecha">
            <Input
              value={draft.date}
              onChange={(event) => setDraft({ ...draft, date: event.target.value })}
            />
          </Field>
          <Field label="Hora">
            <Input
              value={draft.time}
              onChange={(event) => setDraft({ ...draft, time: event.target.value })}
            />
          </Field>
          <Field label="Canal">
            <Input
              value={draft.channel}
              onChange={(event) => setDraft({ ...draft, channel: event.target.value })}
            />
          </Field>
          <Field label="Estado">
            <Select
              value={draft.status}
              onChange={(event) =>
                setDraft({ ...draft, status: event.target.value as typeof draft.status })
              }
            >
              <option>Pendiente</option>
              <option>En proceso</option>
              <option>Listo</option>
              <option>Publicado</option>
              <option>Medido</option>
              <option>Archivado</option>
            </Select>
          </Field>
          <Field label="Episodio relacionado">
            <Select
              value={draft.relatedEpisodeId}
              onChange={(event) => setDraft({ ...draft, relatedEpisodeId: event.target.value })}
            >
              <option value="">Sin relación</option>
              {state.episodes.map((episode) => (
                <option key={episode.id} value={episode.id}>
                  {episode.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Contenido relacionado">
            <Select
              value={draft.relatedContentId}
              onChange={(event) => setDraft({ ...draft, relatedContentId: event.target.value })}
            >
              <option value="">Sin relación</option>
              {state.contentPieces.map((piece) => (
                <option key={piece.id} value={piece.id}>
                  {piece.channel} · {piece.format}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Frecuencia">
            <Input
              value={draft.frequency}
              onChange={(event) => setDraft({ ...draft, frequency: event.target.value })}
            />
          </Field>
        </div>
        <Field label="Notas" hint="Describe dependencias, CTA, clips o revisión previa.">
          <Textarea
            rows={6}
            value={draft.notes}
            onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
          />
        </Field>
        <div className="mt-5">
          <Button onClick={saveEvent}>Guardar evento</Button>
        </div>
      </Card>
    </div>
  );
}
