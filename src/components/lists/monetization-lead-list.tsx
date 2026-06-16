'use client';

import { MonetizationLead } from '@/lib/studio-types';
import { MonetizationLeadCard } from '@/components/cards';
import { useMonetizationLeads } from '@/hooks';

interface MonetizationLeadListProps {
  limit?: number;
  status?: MonetizationLead['status'];
  onSelectLead?: (id: string) => void;
}

export function MonetizationLeadList({
  limit = 10,
  status,
  onSelectLead,
}: MonetizationLeadListProps) {
  const { data, loading, error } = useMonetizationLeads({ status, limit });

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Cargando leads...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">Error al cargar leads: {error.message}</div>
    );
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay leads disponibles</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((lead) => (
        <MonetizationLeadCard key={lead.id} lead={lead} onSelect={onSelectLead} />
      ))}
    </div>
  );
}
