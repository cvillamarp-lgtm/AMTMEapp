'use client';

import { useState } from 'react';
import { Badge, Button, Card, Select, Field } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';

export default function MonetizacionPage() {
  const { state, setState } = useStudio();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const updateLead = (leadId: string, status: string) => {
    setState((current) => ({
      ...current,
      monetizationLeads: current.monetizationLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status: status as typeof lead.status } : lead
      ),
    }));
  };

  const markAsPaid = (leadId: string) => {
    setState((current) => ({
      ...current,
      monetizationLeads: current.monetizationLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status: 'Pagado' as typeof lead.status } : lead
      ),
    }));
  };

  const copyAvailability = (lead: typeof state.monetizationLeads[0]) => {
    const template = `Hola! Gracias por tu interés en la sesión de ${lead.offerId}.\n\nMi disponibilidad esta semana:\n• Lunes–Viernes: 10am–2pm (hora CDMX)\n• Sábados: 10am–12pm\n\nPuedes agendar directamente aquí: [LINK]\n\nEl costo es ${lead.revenue} USD por sesión de 60 min.\n\n¿Cuál horario te funciona mejor?`;
    navigator.clipboard.writeText(template).then(() => {
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const totalPipeline = state.monetizationLeads.reduce((sum, lead) => sum + lead.revenue, 0);
  const totalPaid = state.monetizationLeads
    .filter((lead) => lead.status === 'Pagado')
    .reduce((sum, lead) => sum + lead.revenue, 0);
  const activeLeads = state.monetizationLeads.filter((lead) => !['Pagado', 'Perdido'].includes(lead.status));

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.82fr]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Monetización</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
              Leads y sesiones
            </h2>
          </div>
<<<<<<< HEAD
          <Badge tone="accent">
            ${state.monetizationLeads.reduce((sum, lead) => sum + lead.revenue, 0)} pipeline
          </Badge>
=======
          <div className="flex flex-col items-end gap-1">
            <Badge tone="accent">${totalPipeline} pipeline</Badge>
            {totalPaid > 0 && <span className="text-xs text-emerald-600 font-medium">${totalPaid} cobrado</span>}
          </div>
>>>>>>> ece5a9a (fix: botones visibles hero card, estado activo episodios, monetizacion con acciones de venta, copiar output IA)
        </div>
        <div className="mt-5 space-y-3">
          {state.monetizationLeads.map((lead) => (
            <div key={lead.id} className="rounded-3xl border border-black/8 bg-[#F5F2EA] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-black/38">
                    {lead.source}
                  </div>
                  <div className="mt-1 text-base font-semibold text-[#0C1F36]">{lead.name}</div>
                </div>
                <Badge
                  tone={
                    lead.status === 'Pagado'
                      ? 'good'
                      : lead.status === 'Perdido'
                        ? 'danger'
                        : 'accent'
                  }
                >
                  {lead.status}
                </Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-black/60 sm:grid-cols-2">
                <span>Oferta: {lead.offerId}</span>
                <span>Revenue: ${lead.revenue}</span>
                <span>Próxima acción: {lead.nextAction}</span>
                <span>Creado: {lead.createdAt}</span>
              </div>
              {lead.status !== 'Pagado' && lead.status !== 'Perdido' && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => copyAvailability(lead)}
                  >
                    {copiedId === lead.id ? '✓ Copiado' : 'Copiar disponibilidad'}
                  </Button>
                  <Button
                    onClick={() => markAsPaid(lead.id)}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Marcar pagado
                  </Button>
                </div>
              )}
            </div>
          ))}
          {activeLeads.length === 0 && (
            <p className="text-sm text-black/50 py-4 text-center">No hay leads activos en este momento.</p>
          )}
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-[0.22em] text-black/40">Gestión rápida</div>
        <div className="mt-4 space-y-4">
          {state.monetizationLeads.map((lead) => (
            <Field key={lead.id} label={lead.name}>
              <Select
                value={lead.status}
                onChange={(event) => updateLead(lead.id, event.target.value)}
              >
                <option>Nuevo lead</option>
                <option>Conversación iniciada</option>
                <option>Interesado</option>
                <option>Sesión ofrecida</option>
                <option>Sesión agendada</option>
                <option>Pagado</option>
                <option>Perdido</option>
                <option>Seguimiento</option>
              </Select>
            </Field>
          ))}
        </div>
      </Card>
    </div>
  );
}
