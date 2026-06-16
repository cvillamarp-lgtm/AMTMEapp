'use client';

import { Episode } from '@/lib/studio-types';
import { EpisodeCard } from '@/components/cards';
import { useEpisodes } from '@/hooks';

interface EpisodeListProps {
  limit?: number;
  status?: Episode['status'];
  onSelectEpisode?: (id: string) => void;
}

export function EpisodeList({ limit = 10, status, onSelectEpisode }: EpisodeListProps) {
  const { data, loading, error } = useEpisodes({ status, limit });

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Cargando episodios...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar episodios: {error.message}
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay episodios disponibles</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} onSelect={onSelectEpisode} />
      ))}
    </div>
  );
}
