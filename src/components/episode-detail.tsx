'use client';

import { useState } from 'react';
import { X, PencilSimple, Check, Warning } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export interface Episode {
  ep: number;
  title: string;
  statusLabel: string;
  statusColor?: string;
  progress: number;
  dueLabel: string;
  theme: string;
  wound: string;
  symbol: string;
  cta: string;
  spotifyDesc: string;
  appleDesc: string;
  notes: string;
}

interface EpisodeDetailProps {
  episode: Episode;
  onClose: () => void;
  onSave?: (updated: Episode) => void;
}

type EditableField = 'spotifyDesc' | 'appleDesc' | 'notes';

const NARRATIVE_FIELDS: { label: string; key: keyof Episode }[] = [
  { label: 'Tema central', key: 'theme' },
  { label: 'Herida emocional', key: 'wound' },
  { label: 'Símbolo central', key: 'symbol' },
  { label: 'CTA', key: 'cta' },
];

const EDITABLE_FIELDS: { key: EditableField; label: string }[] = [
  { key: 'spotifyDesc', label: 'Descripción para Spotify' },
  { key: 'appleDesc', label: 'Descripción para Apple Podcasts' },
  { key: 'notes', label: 'Notas operativas' },
];

export function EpisodeDetail({ episode, onClose, onSave }: EpisodeDetailProps) {
  const [data, setData] = useState<Episode>(episode);
  const [editing, setEditing] = useState<EditableField | null>(null);
  const [draft, setDraft] = useState('');

  const startEdit = (field: EditableField) => {
    setEditing(field);
    setDraft(data[field]);
  };

  const saveEdit = () => {
    if (!editing) return;
    const updated = { ...data, [editing]: draft };
    setData(updated);
    onSave?.(updated);
    setEditing(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee8da] bg-white px-6 py-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#9DC4D5]">
              Episodio {data.ep}
            </span>
            <h2 className="text-xl font-bold text-[#001F36]">{data.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#9a9384] transition-colors hover:bg-[#f6f3ec]"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#001F36] px-3 py-1 text-xs font-semibold text-white">
              {data.statusLabel}
            </span>
            <div className="min-w-[180px] flex-1">
              <div className="mb-1 flex justify-between text-xs text-[#9a9384]">
                <span>{data.progress}% completado</span>
                <span>Vence {data.dueLabel}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#eee8da]">
                <div
                  className="h-full rounded-full bg-[#E8FF40] transition-all"
                  style={{ width: `${data.progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {NARRATIVE_FIELDS.map(({ label, key }) => (
              <div key={key} className="rounded-xl border border-[#eee8da] bg-[#fafaf9] p-3">
                <p className="text-[10px] uppercase tracking-widest text-[#9a9384]">{label}</p>
                <p className="mt-1 text-sm font-medium text-[#001F36]">
                  {String(data[key]) || '—'}
                </p>
              </div>
            ))}
          </div>

          {EDITABLE_FIELDS.map(({ key, label }) => (
            <div key={key} className="rounded-xl border border-[#eee8da] p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-[#001F36]">{label}</p>
                {editing === key ? (
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="rounded-lg bg-[#001F36] px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-[#003D5C]"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="rounded-lg border border-[#eee8da] px-3 py-1 text-xs font-medium text-[#9a9384] transition-colors hover:bg-[#f6f3ec]"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(key)}
                    className="flex items-center gap-1 rounded-lg border border-[#eee8da] px-3 py-1 text-xs text-[#9a9384] transition-colors hover:bg-[#f6f3ec] hover:text-[#001F36]"
                  >
                    <PencilSimple size={12} />
                    Editar
                  </button>
                )}
              </div>
              {editing === key ? (
                <textarea
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={4}
                  className={cn(
                    'w-full resize-none rounded-lg border border-[#9DC4D5] bg-white p-2',
                    'text-sm text-[#001F36] outline-none focus:ring-2 focus:ring-[#9DC4D5]/40'
                  )}
                />
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#9a9384]">
                  {data[key] || <span className="italic opacity-40">Sin contenido</span>}
                </p>
              )}
            </div>
          ))}

          <div className="rounded-xl border border-[#eee8da] bg-[#fafaf9] p-4">
            <p className="mb-3 text-sm font-semibold text-[#001F36]">Sugerencias editoriales</p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2 text-[#2d7a2d]">
                <Check size={16} className="mt-0.5 shrink-0" />
                La herida emocional está bien definida y es específica.
              </li>
              <li className="flex gap-2 text-amber-600">
                <Warning size={16} className="mt-0.5 shrink-0" />
                El símbolo podría ser más concreto y visceral.
              </li>
              <li className="flex gap-2 text-[#003D5C]">
                <span className="mt-0.5 shrink-0 text-[#9DC4D5]">→</span>
                Considera agregar una pregunta de apertura en la descripción de Spotify.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
