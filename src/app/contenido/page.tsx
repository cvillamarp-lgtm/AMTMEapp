'use client';

import { useMemo, useState } from 'react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { generateContentPack } from '@/lib/studio-generators';
import type { ContentPiece } from '@/lib/studio-types';
import { formatDate } from '@/lib/studio-utils';

export default function ContenidoPage() {
  const { state, setState } = useStudio();
  const [episodeId, setEpisodeId] = useState(state.episodes[0]?.id ?? '');
  const episode = state.episodes.find((item) => item.id === episodeId) ?? state.episodes[0];
  const [draft, setDraft] = useState<ContentPiece>(() =>
    generateContentPack({
      theme: episode?.theme ?? 'Tema',
      emotion: 'Claridad contenida',
      objective: episode?.objective ?? 'Abrir conversación',
      episodeTitle: episode?.title ?? 'Nuevo episodio',
    })
  );

  const channelOptions = useMemo(() => state.config.activeChannels, [state.config.activeChannels]);

  const regenerate = () => {
    const generated = generateContentPack({
      theme: episode?.theme ?? draft.theme,
      emotion: draft.emotion || 'Claridad contenida',
      objective: draft.objective || 'Abrir conversación',
      episodeTitle: episode?.title ?? draft.mainText,
    });
    setDraft({ ...generated, episodeId: episode?.id ?? '' });
  };

  const saveContent = () => {
    setState((current) => ({
      ...current,
      contentPieces: [draft, ...current.contentPieces],
    }));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Contenido</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
              Piezas listas para publicar
            </h2>
          </div>
          <Badge tone="accent">{state.contentPieces.length} piezas</Badge>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Episodio fuente">
            <Select value={episodeId} onChange={(event) => setEpisodeId(event.target.value)}>
              {state.episodes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.episodeNumber ? `Episodio ${item.episodeNumber}` : item.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Canal principal">
            <Select
              value={draft.channel}
              onChange={(event) => setDraft({ ...draft, channel: event.target.value })}
            >
              {channelOptions.map((channel) => (
                <option key={channel}>{channel}</option>
              ))}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Formato">
              <Input
                value={draft.format}
                onChange={(event) => setDraft({ ...draft, format: event.target.value })}
              />
            </Field>
            <Field label="Estado">
              <Select
                value={draft.status}
                onChange={(event) =>
                  setDraft({ ...draft, status: event.target.value as ContentPiece['status'] })
                }
              >
                <option>Borrador</option>
                <option>Listo</option>
                <option>Publicado</option>
                <option>Archivado</option>
              </Select>
            </Field>
          </div>
          <Field label="Tema">
            <Input
              value={draft.theme}
              onChange={(event) => setDraft({ ...draft, theme: event.target.value })}
            />
          </Field>
          <Field label="Emoción">
            <Input
              value={draft.emotion}
              onChange={(event) => setDraft({ ...draft, emotion: event.target.value })}
            />
          </Field>
          <Field label="Objetivo">
            <Input
              value={draft.objective}
              onChange={(event) => setDraft({ ...draft, objective: event.target.value })}
            />
          </Field>
          <Field label="Hook">
            <Textarea
              rows={3}
              value={draft.hook}
              onChange={(event) => setDraft({ ...draft, hook: event.target.value })}
            />
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={regenerate}>Generar contenido</Button>
          <Button variant="secondary" onClick={saveContent}>
            Guardar pieza
          </Button>
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-[0.22em] text-black/40">Salida editorial</div>
        <div className="mt-4 space-y-4">
          <Field label="Texto principal">
            <Textarea
              rows={5}
              value={draft.mainText}
              onChange={(event) => setDraft({ ...draft, mainText: event.target.value })}
            />
          </Field>
          <Field label="Caption">
            <Textarea
              rows={5}
              value={draft.caption}
              onChange={(event) => setDraft({ ...draft, caption: event.target.value })}
            />
          </Field>
          <Field label="CTA">
            <Input
              value={draft.cta}
              onChange={(event) => setDraft({ ...draft, cta: event.target.value })}
            />
          </Field>
          <Field label="Promesa visual">
            <Textarea
              rows={4}
              value={draft.visualPrompt}
              onChange={(event) => setDraft({ ...draft, visualPrompt: event.target.value })}
            />
          </Field>
          <Field label="Meta de medición">
            <Input
              value={draft.metricGoal}
              onChange={(event) => setDraft({ ...draft, metricGoal: event.target.value })}
            />
          </Field>
          <div className="rounded-3xl border border-black/8 bg-[#F5F2EA] p-4 text-sm text-black/58">
            Publicación sugerida: {formatDate(draft.publishDate)} · Episodio{' '}
            {episode?.episodeNumber || 'nuevo'}
          </div>
        </div>
      </Card>
    </div>
  );
}
