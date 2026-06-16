'use client';

import { ContentPiece } from '@/lib/studio-types';
import { Card } from '@/components/shadcn/card';
import { Badge } from '@/components/shadcn/badge';

interface ContentPieceCardProps {
  piece: ContentPiece;
  onSelect?: (id: string) => void;
}

const statusColor: Record<ContentPiece['status'], string> = {
  Borrador: 'bg-gray-100 text-gray-800',
  Listo: 'bg-blue-100 text-blue-800',
  Publicado: 'bg-green-100 text-green-800',
  Medido: 'bg-cyan-100 text-cyan-800',
  Archivado: 'bg-gray-300 text-gray-700',
};

export function ContentPieceCard({ piece, onSelect }: ContentPieceCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect?.(piece.id)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase">{piece.format}</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{piece.channel}</p>
          </div>
          <Badge className={statusColor[piece.status]}>{piece.status}</Badge>
        </div>

        <div className="space-y-2">
          <div>
            <p className="font-medium text-xs text-gray-600">Hook</p>
            <p className="text-sm text-gray-900 line-clamp-2">{piece.hook}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <p className="font-medium">Tema</p>
              <p>{piece.theme}</p>
            </div>
            <div>
              <p className="font-medium">Emoción</p>
              <p>{piece.emotion}</p>
            </div>
          </div>
        </div>

        {piece.publishDate && (
          <p className="text-xs text-gray-500">
            Publicación: {new Date(piece.publishDate).toLocaleDateString('es-ES')}
          </p>
        )}
      </div>
    </Card>
  );
}
