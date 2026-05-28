'use client';

import { Badge, Card } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';

export default function AutomatizacionPage() {
  const { state } = useStudio();

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Automatización</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
              Reglas y disparadores
            </h2>
          </div>
          <Badge tone="accent">{state.automationRules.length} reglas</Badge>
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {state.automationRules.map((rule) => (
            <div key={rule.id} className="rounded-3xl border border-black/8 bg-[#F5F2EA] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-[#0C1F36]">{rule.name}</h3>
                <Badge tone={rule.status === 'Listo' ? 'good' : 'neutral'}>{rule.status}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-black/58">{rule.objective}</p>
              <div className="mt-4 grid gap-2 text-sm text-black/60 sm:grid-cols-2">
                <span>Trigger: {rule.trigger}</span>
                <span>Herramienta: {rule.tool}</span>
                <span>Responsable: {rule.responsible}</span>
                <span>Riesgo: {rule.risk}</span>
                <span>Entrada: {rule.input}</span>
                <span>Salida: {rule.output}</span>
              </div>
              <p className="mt-3 text-sm text-black/55">Próxima revisión: {rule.nextReview}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
