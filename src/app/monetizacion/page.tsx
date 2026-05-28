'use client';

import { Badge, Card, Select, Field } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';

export default function MonetizacionPage() {
  const { state, setState } = useStudio();

  const updateLead = (leadId: string, status: string) => {
    setState((current) => ({
      ...current,
      monetizationLeads: current.monetizationLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status: status as typeof lead.status } : lead
      ),
    }));
  };

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
          <Badge tone="accent">
            ${state.monetizationLeads.reduce((sum, lead) => sum + lead.revenue, 0)} pipeline
          </Badge>
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
            </div>
          ))}
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
