'use client';

import { Episode } from '@/lib/studio-types';
import { Card } from '@/components/shadcn/card';
import { Badge } from '@/components/shadcn/badge';

interface EpisodeCardProps {
  episode: Episode;
  onSelect?: (id: string) => void;
}

const statusColor: Record<Episode['status'], string> = {
  Idea: 'bg-amtme-gray-200 text-amtme-gray-800',
  'En investigación': 'bg-amtme-info/20 text-amtme-info',
  Guion: 'bg-amtme-yellow/20 text-amtme-yellow',
  Grabación: 'bg-amtme-warning/20 text-amtme-warning',
  Edición: 'bg-amtme-yellow/30 text-amtme-yellow',
  Publicado: 'bg-amtme-success/20 text-amtme-success',
  Distribuido: 'bg-amtme-info/20 text-amtme-info',
  Medido: 'bg-amtme-success/20 text-amtme-success',
  Archivado: 'bg-amtme-gray-300 text-amtme-gray-700',
};

export function EpisodeCard({ episode, onSelect }: EpisodeCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-premium transition-all duration-200 border border-amtme-border bg-amtme-navy/30 hover:bg-amtme-navy/50"
      onClick={() => onSelect?.(episode.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect?.(episode.id);
        }
      }}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-xs text-amtme-gray-400 uppercase tracking-wide">
              Ep. {episode.episodeNumber}
            </p>
            <h3 className="text-base font-display font-bold text-amtme-yellow mt-1 line-clamp-2">
              {episode.title}
            </h3>
          </div>
          <Badge className={`shrink-0 ${statusColor[episode.status]}`}>{episode.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-amtme-gray-400">
          <div>
            <p className="font-semibold uppercase tracking-wide">Tema</p>
            <p className="text-amtme-white/70 line-clamp-1">{episode.theme}</p>
          </div>
          <div>
            <p className="font-semibold uppercase tracking-wide">Pilar</p>
            <p className="text-amtme-white/70 line-clamp-1">{episode.pillar}</p>
          </div>
        </div>

        {episode.publishDate && (
          <p className="text-xs text-amtme-gray-500">
            📅 {new Date(episode.publishDate).toLocaleDateString('es-ES')}
          </p>
        )}

        {episode.notes && (
          <p className="text-xs text-amtme-white/60 line-clamp-2 border-t border-amtme-border pt-2">
            {episode.notes}
          </p>
        )}
      </div>
    </Card>
  );
}
