'use client';

import { useMemo, useState } from 'react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import {
  buildNarrativeStructure,
  generateAppleDescription,
  generateEpisodeScript,
  generateHooks,
  generateSpotifyDescription,
} from '@/lib/studio-generators';
import type { Episode } from '@/lib/studio-types';
import { formatDate } from '@/lib/studio-utils';

const emptyEpisode = (): Episode => ({
  id: `ep-${Date.now()}`,
  episodeNumber: '',
  title: '',
  theme: '',
  pillar: '',
  emotionalWound: '',
  centralSymbol: '',
  objective: '',
  status: 'Idea',
  narrativeStructure: buildNarrativeStructure(),
  script: '',
  spotifyDescription: '',
  appleDescription: '',
  cta: '',
  hooks: [],
  publishDate: '',
  notes: '',
  nextAction: 'Definir estructura y CTA.',
});

export default function EpisodiosPage() {
  const { state, setState } = useStudio();
  const [status, setStatus] = useState<'Todos' | Episode['status']>('Todos');
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      state.episodes.filter((episode) => {
        const matchesQuery = `${episode.title} ${episode.theme} ${episode.pillar}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus = status === 'Todos' ? true : episode.status === status;
        return matchesQuery && matchesStatus;
      }),
    [query, status, state.episodes]
  );
  const [draft, setDraft] = useState<Episode>(state.episodes[0] ?? emptyEpisode());

  const selectEpisode = (episode: Episode) => {
    setDraft(episode);
  };

  const newEpisode = () => {
    setDraft(emptyEpisode());
  };

  const saveEpisode = () => {
    setState((current) => {
      const exists = current.episodes.some((episode) => episode.id === draft.id);
      const episodes = exists
        ? current.episodes.map((episode) => (episode.id === draft.id ? { ...draft } : episode))
        : [draft, ...current.episodes];
      return { ...current, episodes };
    });
  };

  const generateStructure = () =>
    setDraft({ ...draft, narrativeStructure: buildNarrativeStructure() });
  const generateScript = () => setDraft({ ...draft, script: generateEpisodeScript(draft) });
  const generateSpotify = () =>
    setDraft({ ...draft, spotifyDescription: generateSpotifyDescription(draft) });
  const generateApple = () =>
    setDraft({ ...draft, appleDescription: generateAppleDescription(draft) });
  const generateHooksPack = () =>
    setDraft({
      ...draft,
      hooks: generateHooks(draft.title || `Episodio ${draft.episodeNumber || 'nuevo'}`),
    });

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Episodios</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
              Producción editorial
            </h2>
          </div>
          <Button onClick={newEpisode}>Crear episodio</Button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Field label="Buscar">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Título, tema o pilar"
            />
          </Field>
          <Field label="Filtrar por estado">
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
            >
              <option>Todos</option>
              <option>Idea</option>
              <option>En investigación</option>
              <option>Guion</option>
              <option>Grabación</option>
              <option>Edición</option>
              <option>Publicado</option>
              <option>Distribuido</option>
              <option>Medido</option>
              <option>Archivado</option>
            </Select>
          </Field>
        </div>
        <div className="mt-4 space-y-3">
          {filtered.map((episode) => (
            <button
              key={episode.id}
              onClick={() => selectEpisode(episode)}
              className="w-full rounded-3xl border border-black/8 bg-[#F5F2EA] px-4 py-4 text-left transition hover:bg-white"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-black/38">
                    Episodio {episode.episodeNumber || 'nuevo'}
                  </div>
                  <div className="mt-1 text-base font-semibold text-[#0C1F36]">
                    {episode.title || 'Sin título'}
                  </div>
                </div>
                <Badge
                  tone={
                    episode.status === 'Publicado'
                      ? 'good'
                      : episode.status === 'Idea'
                        ? 'neutral'
                        : 'accent'
                  }
                >
                  {episode.status}
                </Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-black/55 sm:grid-cols-2">
                <span>CTA: {episode.cta || 'Pendiente'}</span>
                <span>Publicación: {episode.publishDate || 'Sin fecha'}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Editor</div>
            <h3 className="mt-1 text-2xl font-semibold text-[#0C1F36]">
              {draft.title || 'Nuevo episodio'}
            </h3>
          </div>
          <Badge tone={draft.status === 'Publicado' ? 'good' : 'neutral'}>{draft.status}</Badge>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Número">
            <Input
              value={draft.episodeNumber}
              onChange={(event) => setDraft({ ...draft, episodeNumber: event.target.value })}
            />
          </Field>
          <Field label="Estado">
            <Select
              value={draft.status}
              onChange={(event) =>
                setDraft({ ...draft, status: event.target.value as Episode['status'] })
              }
            >
              <option>Idea</option>
              <option>En investigación</option>
              <option>Guion</option>
              <option>Grabación</option>
              <option>Edición</option>
              <option>Publicado</option>
              <option>Distribuido</option>
              <option>Medido</option>
              <option>Archivado</option>
            </Select>
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Título">
            <Input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            />
          </Field>
          <Field label="Tema">
            <Input
              value={draft.theme}
              onChange={(event) => setDraft({ ...draft, theme: event.target.value })}
            />
          </Field>
          <Field label="Pilar">
            <Input
              value={draft.pillar}
              onChange={(event) => setDraft({ ...draft, pillar: event.target.value })}
            />
          </Field>
          <Field label="Objetivo">
            <Input
              value={draft.objective}
              onChange={(event) => setDraft({ ...draft, objective: event.target.value })}
            />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Herida emocional">
            <Input
              value={draft.emotionalWound}
              onChange={(event) => setDraft({ ...draft, emotionalWound: event.target.value })}
            />
          </Field>
          <Field label="Símbolo central">
            <Input
              value={draft.centralSymbol}
              onChange={(event) => setDraft({ ...draft, centralSymbol: event.target.value })}
            />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="CTA">
            <Input
              value={draft.cta}
              onChange={(event) => setDraft({ ...draft, cta: event.target.value })}
            />
          </Field>
          <Field label="Fecha de publicación">
            <Input
              value={draft.publishDate}
              onChange={(event) => setDraft({ ...draft, publishDate: event.target.value })}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button onClick={generateStructure}>Generar estructura</Button>
          <Button variant="secondary" onClick={generateScript}>
            Generar guion
          </Button>
          <Button variant="secondary" onClick={generateSpotify}>
            Generar descripción Spotify
          </Button>
          <Button variant="secondary" onClick={generateApple}>
            Generar descripción Apple
          </Button>
          <Button variant="secondary" onClick={generateHooksPack}>
            Generar hooks
          </Button>
          <Button variant="secondary" onClick={saveEpisode}>
            Guardar episodio
          </Button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Estructura narrativa">
            <Textarea rows={3} readOnly value={draft.narrativeStructure.join(' · ')} />
          </Field>
          <Field label="Guion">
            <Textarea
              rows={6}
              value={draft.script}
              onChange={(event) => setDraft({ ...draft, script: event.target.value })}
            />
          </Field>
          <Field label="Descripción Spotify">
            <Textarea
              rows={4}
              value={draft.spotifyDescription}
              onChange={(event) => setDraft({ ...draft, spotifyDescription: event.target.value })}
            />
          </Field>
          <Field label="Descripción Apple Podcasts">
            <Textarea
              rows={4}
              value={draft.appleDescription}
              onChange={(event) => setDraft({ ...draft, appleDescription: event.target.value })}
            />
          </Field>
          <Field label="Hooks">
            <Textarea
              rows={4}
              value={draft.hooks.join('\n')}
              onChange={(event) =>
                setDraft({ ...draft, hooks: event.target.value.split('\n').filter(Boolean) })
              }
            />
          </Field>
          <Field label="Notas">
            <Textarea
              rows={3}
              value={draft.notes}
              onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
            />
          </Field>
        </div>

        <div className="mt-5 text-sm text-black/55">
          Última revisión: {formatDate(draft.publishDate || new Date().toISOString().slice(0, 10))}.
          Próxima acción: {draft.nextAction}
        </div>
      </Card>
    </div>
  );
}
