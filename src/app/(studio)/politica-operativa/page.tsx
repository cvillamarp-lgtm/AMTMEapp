'use client';

import { Badge, Card } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';

export default function PoliticaOperativaPage() {
  const { state } = useStudio();

  return (
    <div className="space-y-5">
      <Card className="bg-[#0C1F36] text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/45">
              Política Operativa Activa
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              La arquitectura oficial es la única ruta activa
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/78">
              El sistema AMTME Studio OS trabaja sobre la estructura final, conserva el histórico
              como referencia y evita reproducir la estructura temporal.
            </p>
          </div>
          <Badge tone="accent">Blindaje activo</Badge>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {state.masterSections.map((section) => (
          <Card key={section.id} className="bg-white">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-[#0C1F36]">{section.title}</h3>
              <Badge tone={section.status === 'Vigente' ? 'good' : 'neutral'}>
                {section.status}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-black/58">{section.content}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="text-xs uppercase tracking-[0.22em] text-black/40">Reglas activas</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            'No volver a usar la estructura temporal como fuente operativa.',
            'Todo contenido nuevo debe nacer desde la política activa.',
            'El histórico solo se consulta como referencia.',
            'La validación mensual es obligatoria.',
            'Cada salida pública debe tener CTA y relación con un episodio.',
            'La paleta oficial permanece bloqueada.',
          ].map((rule) => (
            <div
              key={rule}
              className="rounded-3xl border border-black/8 bg-[#F5F2EA] p-4 text-sm leading-6 text-[#0C1F36]"
            >
              {rule}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
