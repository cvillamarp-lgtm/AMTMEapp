'use client';

import { Episode } from '@/lib/studio-types';
import { Card } from '@/components/shadcn/card';
import { Badge } from '@/components/shadcn/badge';

interface EpisodeCardProps {
  episode: Episode;
  onSelect?: (id: string) => void;
}

const statusColor: Record<Episode['status'], string> = {
  Idea: 'bg-gray-100 text-gray-800',
  'En investigación': 'bg-blue-100 text-blue-800',
  Guion: 'bg-indigo-100 text-indigo-800',
  Grabación: 'bg-purple-100 text-purple-800',
  Edición: 'bg-orange-100 text-orange-800',
  Publicado: 'bg-green-100 text-green-800',
  Distribuido: 'bg-teal-100 text-teal-800',
  Medido: 'bg-cyan-100 text-cyan-800',
  Archivado: 'bg-gray-300 text-gray-700',
};

export function EpisodeCard({ episode, onSelect }: EpisodeCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect?.(episode.id)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900">{episode.episodeNumber}</p>
            <h3 className="text-base font-bold text-gray-900 mt-1">{episode.title}</h3>
          </div>
          <Badge className={statusColor[episode.status]}>{episode.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>
            <p className="font-medium">Tema</p>
            <p>{episode.theme}</p>
          </div>
          <div>
            <p className="font-medium">Pilar</p>
            <p>{episode.pillar}</p>
          </div>
        </div>

        {episode.publishDate && (
          <p className="text-xs text-gray-500">
            Publicación: {new Date(episode.publishDate).toLocaleDateString('es-ES')}
          </p>
        )}

        {episode.notes && <p className="text-xs text-gray-700 line-clamp-2">{episode.notes}</p>}
      </div>
    </Card>
  );
}
