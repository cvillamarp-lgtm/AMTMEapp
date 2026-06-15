'use client';

import { ContentPiece } from '@/lib/studio-types';
import { ContentPieceCard } from '@/components/cards';
import { useContentPieces } from '@/hooks';

interface ContentPieceListProps {
  limit?: number;
  status?: ContentPiece['status'];
  channel?: string;
  onSelectPiece?: (id: string) => void;
}

export function ContentPieceList({
  limit = 10,
  status,
  channel,
  onSelectPiece,
}: ContentPieceListProps) {
  const { data, loading, error } = useContentPieces({ status, channel, limit });

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Cargando contenido...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar contenido: {error.message}
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay contenido disponible</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((piece) => (
        <ContentPieceCard key={piece.id} piece={piece} onSelect={onSelectPiece} />
      ))}
    </div>
  );
}
