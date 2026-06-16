'use client';

import { MonetizationLead } from '@/lib/studio-types';
import { Card } from '@/components/shadcn/card';
import { Badge } from '@/components/shadcn/badge';

interface MonetizationLeadCardProps {
  lead: MonetizationLead;
  onSelect?: (id: string) => void;
}

const statusColor: Record<MonetizationLead['status'], string> = {
  'Nuevo lead': 'bg-yellow-100 text-yellow-800',
  'Conversación iniciada': 'bg-blue-100 text-blue-800',
  Interesado: 'bg-indigo-100 text-indigo-800',
  'Sesión ofrecida': 'bg-purple-100 text-purple-800',
  'Sesión agendada': 'bg-orange-100 text-orange-800',
  Pagado: 'bg-green-100 text-green-800',
  Perdido: 'bg-red-100 text-red-800',
  Seguimiento: 'bg-gray-100 text-gray-800',
};

export function MonetizationLeadCard({ lead, onSelect }: MonetizationLeadCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect?.(lead.id)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase">{lead.source}</p>
            <h3 className="text-base font-bold text-gray-900 mt-1">{lead.name}</h3>
          </div>
          <Badge className={statusColor[lead.status]}>{lead.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-medium text-gray-600">Ingresos</p>
            <p className="text-lg font-semibold text-gray-900">
              ${lead.revenue.toLocaleString('es-ES')}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Próxima acción</p>
            <p className="text-sm text-gray-700">{lead.nextAction}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Creado: {new Date(lead.createdAt).toLocaleDateString('es-ES')}
        </p>
      </div>
    </Card>
  );
}
