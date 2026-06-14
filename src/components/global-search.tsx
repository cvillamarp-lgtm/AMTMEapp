'use client';

import { useEffect, useState, useRef } from 'react';
import {
  MagnifyingGlass,
  X,
  ArrowElbowDownLeft,
  FileText,
  MicrophoneStage,
  ChartBar,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  label: string;
  description: string;
  category: 'episode' | 'metric' | 'distribution' | 'content';
  href: string;
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: '1',
    label: 'EP35 — La herida del abandono',
    description: 'Guión · Vence en 7 días',
    category: 'episode',
    href: '/dashboard/episodes/35',
  },
  {
    id: '2',
    label: 'EP34 — Cuando el silencio duele',
    description: 'Edición · 75% completado',
    category: 'episode',
    href: '/dashboard/episodes/34',
  },
  {
    id: '3',
    label: 'EP33 — El rechazo que nos forma',
    description: 'Publicado · 1,240 streams',
    category: 'episode',
    href: '/dashboard/episodes/33',
  },
  {
    id: '4',
    label: 'Métricas de streaming',
    description: 'Centro de decisiones',
    category: 'metric',
    href: '/dashboard/metrics',
  },
  {
    id: '5',
    label: 'Pipeline de distribución',
    description: 'Spotify · Apple · Instagram',
    category: 'distribution',
    href: '/dashboard/distribution',
  },
  {
    id: '6',
    label: 'Hub editorial',
    description: 'Generador de contenido AMTME',
    category: 'content',
    href: '/dashboard/editorial',
  },
];

const CATEGORY_ICONS = {
  episode: <MicrophoneStage size={16} />,
  metric: <ChartBar size={16} />,
  distribution: <ArrowElbowDownLeft size={16} />,
  content: <FileText size={16} />,
};

const CATEGORY_COLORS = {
  episode: 'text-[#003D5C] bg-[#9DC4D5]/20',
  metric: 'text-[#001F36] bg-[#eee8da]',
  distribution: 'text-amber-600 bg-amber-50',
  content: 'text-purple-600 bg-purple-50',
};

interface GlobalSearchProps {
  onNavigate?: (href: string) => void;
}

export function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? MOCK_RESULTS.filter(
        (r) =>
          r.label.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_RESULTS;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        setSelected(0);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((v) => (v + 1) % results.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((v) => (v - 1 + results.length) % results.length);
      }
      if (e.key === 'Enter' && results[selected]) {
        onNavigate?.(results[selected].href);
        setOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, selected, onNavigate]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm px-4"
      onClick={() => {
        setOpen(false);
        setQuery('');
      }}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-[#eee8da] bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#eee8da] px-4 py-3">
          <MagnifyingGlass size={18} className="shrink-0 text-[#9a9384]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            placeholder="Buscar episodios, métricas, contenido..."
            className="flex-1 bg-transparent text-sm text-[#001F36] placeholder:text-[#9a9384] outline-none"
          />
          <div className="flex items-center gap-1.5">
            {query && (
              <button
                onClick={() => setQuery('')}
                className="rounded p-0.5 text-[#9a9384] hover:text-[#001F36]"
              >
                <X size={14} />
              </button>
            )}
            <kbd className="rounded border border-[#eee8da] px-1.5 py-0.5 text-[10px] text-[#9a9384]">
              ESC
            </kbd>
          </div>
        </div>

        <div className="max-h-[340px] overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[#9a9384]">
              Sin resultados para &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((r, i) => (
              <button
                key={r.id}
                onClick={() => {
                  onNavigate?.(r.href);
                  setOpen(false);
                  setQuery('');
                }}
                onMouseEnter={() => setSelected(i)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                  selected === i ? 'bg-[#f6f3ec]' : 'hover:bg-[#fafaf9]'
                )}
              >
                <span className={cn('rounded-lg p-1.5 shrink-0', CATEGORY_COLORS[r.category])}>
                  {CATEGORY_ICONS[r.category]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#001F36] truncate">{r.label}</p>
                  <p className="text-xs text-[#9a9384] truncate">{r.description}</p>
                </div>
                {selected === i && (
                  <ArrowElbowDownLeft size={14} className="shrink-0 text-[#9a9384]" />
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-[#eee8da] px-4 py-2.5">
          <span className="text-[10px] text-[#9a9384]">
            <kbd className="mr-1 rounded border border-[#eee8da] px-1 py-0.5">↑↓</kbd>
            navegar
          </span>
          <span className="text-[10px] text-[#9a9384]">
            <kbd className="mr-1 rounded border border-[#eee8da] px-1 py-0.5">↵</kbd>
            abrir
          </span>
          <span className="ml-auto text-[10px] text-[#9a9384]">
            <kbd className="mr-1 rounded border border-[#eee8da] px-1 py-0.5">⌘K</kbd>
            cerrar
          </span>
        </div>
      </div>
    </div>
  );
}
