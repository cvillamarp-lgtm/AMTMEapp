'use client';

import { useState, useRef } from 'react';
import { Plus, DotsSixVertical } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export interface KanbanEpisode {
  id: string;
  ep: number;
  title: string;
  theme: string;
  progress: number;
  daysLeft: number;
  statusLabel: string;
}

export interface KanbanStage {
  id: string;
  label: string;
  color: string;
  episodes: KanbanEpisode[];
}

const INITIAL_STAGES: KanbanStage[] = [
  {
    id: 'idea',
    label: 'Idea',
    color: '#9a9384',
    episodes: [
      {
        id: 'ep36',
        ep: 36,
        title: 'El miedo a ser elegido',
        theme: 'Autoestima',
        progress: 10,
        daysLeft: 21,
        statusLabel: 'Idea',
      },
    ],
  },
  { id: 'research', label: 'Investigación', color: '#9DC4D5', episodes: [] },
  {
    id: 'script',
    label: 'Guión',
    color: '#003D5C',
    episodes: [
      {
        id: 'ep35',
        ep: 35,
        title: 'La herida del abandono',
        theme: 'Apego',
        progress: 45,
        daysLeft: 7,
        statusLabel: 'Guión',
      },
    ],
  },
  { id: 'recording', label: 'Grabación', color: '#001F36', episodes: [] },
  {
    id: 'editing',
    label: 'Edición',
    color: '#E8FF40',
    episodes: [
      {
        id: 'ep34',
        ep: 34,
        title: 'Cuando el silencio duele',
        theme: 'Comunicación',
        progress: 75,
        daysLeft: 3,
        statusLabel: 'Edición',
      },
    ],
  },
  { id: 'review', label: 'Revisión', color: '#9DC4D5', episodes: [] },
  {
    id: 'published',
    label: 'Publicado',
    color: '#2d7a2d',
    episodes: [
      {
        id: 'ep33',
        ep: 33,
        title: 'El rechazo que nos forma',
        theme: 'Identidad',
        progress: 100,
        daysLeft: 0,
        statusLabel: 'Publicado',
      },
    ],
  },
];

export function KanbanBoard() {
  const [stages, setStages] = useState<KanbanStage[]>(INITIAL_STAGES);
  const dragRef = useRef<{ ep: KanbanEpisode; fromStageId: string } | null>(null);

  const handleDragStart = (ep: KanbanEpisode, fromStageId: string) => {
    dragRef.current = { ep, fromStageId };
  };

  const handleDrop = (toStageId: string) => {
    if (!dragRef.current) return;
    const { ep, fromStageId } = dragRef.current;
    if (fromStageId === toStageId) return;

    const toStage = stages.find((s) => s.id === toStageId);
    setStages((prev) =>
      prev.map((s) => {
        if (s.id === fromStageId)
          return { ...s, episodes: s.episodes.filter((e) => e.id !== ep.id) };
        if (s.id === toStageId)
          return {
            ...s,
            episodes: [...s.episodes, { ...ep, statusLabel: toStage?.label ?? s.label }],
          };
        return s;
      })
    );
    dragRef.current = null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#001F36]">Pipeline visual</h2>
          <p className="text-sm text-[#9a9384]">Arrastra episodios para cambiar estado</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-[#001F36] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003D5C]">
          <Plus size={16} />
          Nuevo episodio
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="flex min-w-[220px] flex-col rounded-2xl border border-[#eee8da] bg-[#fafaf9]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage.id)}
          >
            <div className="flex items-center gap-2 border-b border-[#eee8da] px-4 py-3">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: stage.color }}
              />
              <span className="flex-1 text-xs font-bold uppercase tracking-wide text-[#001F36]">
                {stage.label}
              </span>
              <span className="rounded-full bg-[#eee8da] px-2 py-0.5 text-xs font-medium text-[#9a9384]">
                {stage.episodes.length}
              </span>
            </div>

            <div className="flex min-h-[120px] flex-col gap-2 p-3">
              {stage.episodes.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[#d8d2c2] py-6 text-xs text-[#9a9384]">
                  Arrastra aquí
                </div>
              ) : (
                stage.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    draggable
                    onDragStart={() => handleDragStart(ep, stage.id)}
                    onDragEnd={() => {
                      dragRef.current = null;
                    }}
                    className="cursor-grab rounded-xl border border-[#eee8da] bg-white p-3 shadow-sm transition-all hover:border-[#d8d2c2] hover:shadow-md active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#9DC4D5]">
                          EP {ep.ep}
                        </span>
                        <p className="mt-0.5 text-sm font-semibold leading-tight text-[#001F36]">
                          {ep.title}
                        </p>
                        <p className="mt-1 text-xs text-[#9a9384]">{ep.theme}</p>
                      </div>
                      <DotsSixVertical size={16} className="mt-0.5 shrink-0 text-[#d8d2c2]" />
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] text-[#9a9384]">{ep.progress}%</span>
                        {ep.daysLeft > 0 && (
                          <span
                            className={cn(
                              'text-[10px] font-medium',
                              ep.daysLeft <= 3 ? 'text-red-500' : 'text-[#9a9384]'
                            )}
                          >
                            {ep.daysLeft}d
                          </span>
                        )}
                      </div>
                      <div className="h-1 rounded-full bg-[#eee8da]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${ep.progress}%`,
                            backgroundColor: stage.color === '#E8FF40' ? '#001F36' : stage.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="flex items-center gap-1 rounded-b-2xl px-4 py-2.5 text-xs text-[#9a9384] transition-colors hover:bg-[#f6f3ec] hover:text-[#001F36]">
              <Plus size={12} />
              Agregar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
