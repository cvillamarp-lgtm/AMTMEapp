'use client';

import { useMemo, useState } from 'react';
import { Badge, Button, Card } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { buildVerificationReport, runStudioVerification } from '@/lib/studio-verifier';

function severityTone(severity: 'alta' | 'media' | 'baja') {
  if (severity === 'alta') return 'danger';
  if (severity === 'media') return 'warning';
  return 'neutral';
}

export default function VerificadorPage() {
  const { state } = useStudio();
  const [copyStatus, setCopyStatus] = useState('');

  const summary = useMemo(() => runStudioVerification(state), [state]);
  const report = useMemo(() => buildVerificationReport(summary), [summary]);

  const highCount = summary.issues.filter((issue) => issue.severity === 'alta').length;
  const mediumCount = summary.issues.filter((issue) => issue.severity === 'media').length;
  const lowCount = summary.issues.filter((issue) => issue.severity === 'baja').length;

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopyStatus('Reporte copiado al portapapeles.');
    } catch {
      setCopyStatus('No se pudo copiar automáticamente.');
    }
  };

  return (
    <div className="space-y-5 pb-24">
      <Card className="bg-[#0C1F36] text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/45">
              Verificador del sistema
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Control de orden, duplicidad y calidad
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/78">
              Este módulo valida la coherencia operativa de AMTME Studio OS sobre episodios,
              contenido, marca, calendario, checklists y documento maestro.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={summary.score >= 85 ? 'good' : summary.score >= 70 ? 'warning' : 'danger'}>
              Score {summary.score}/100
            </Badge>
            <Button onClick={copyReport}>Copiar reporte</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-[#F5F2EA]">
          <div className="text-xs uppercase tracking-[0.2em] text-black/40">Checks</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-[#0C1F36]">
            {summary.passedChecks}/{summary.totalChecks}
          </div>
          <div className="mt-2 text-sm text-black/55">Validaciones aprobadas</div>
        </Card>
        <Card className="bg-[#F5F2EA]">
          <div className="text-xs uppercase tracking-[0.2em] text-black/40">Incidencias altas</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-[#E0211E]">
            {highCount}
          </div>
          <div className="mt-2 text-sm text-black/55">Requieren corrección inmediata</div>
        </Card>
        <Card className="bg-[#F5F2EA]">
          <div className="text-xs uppercase tracking-[0.2em] text-black/40">Incidencias medias</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-[#0C1F36]">
            {mediumCount}
          </div>
          <div className="mt-2 text-sm text-black/55">Ajustes operativos sugeridos</div>
        </Card>
        <Card className="bg-[#F5F2EA]">
          <div className="text-xs uppercase tracking-[0.2em] text-black/40">Incidencias bajas</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-[#0C1F36]">
            {lowCount}
          </div>
          <div className="mt-2 text-sm text-black/55">Refinamientos de calidad</div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="text-xs uppercase tracking-[0.22em] text-black/40">
            Incidencias detectadas
          </div>
          <div className="mt-4 space-y-3">
            {summary.issues.length === 0 ? (
              <div className="rounded-3xl border border-black/8 bg-[#F5F2EA] p-4 text-sm text-black/60">
                Sin incidencias críticas. El sistema está listo para operación.
              </div>
            ) : (
              summary.issues.map((issue) => (
                <div key={issue.id} className="rounded-3xl border border-black/8 bg-[#F5F2EA] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-[#0C1F36]">{issue.title}</h3>
                    <Badge tone={severityTone(issue.severity)}>
                      {issue.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-black/58">Área: {issue.area}</div>
                  <p className="mt-2 text-sm leading-6 text-black/60">{issue.detail}</p>
                  <p className="mt-2 text-sm leading-6 text-[#0C1F36]">Acción: {issue.action}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-[0.22em] text-black/40">Reporte operativo</div>
          <p className="mt-3 text-sm text-black/55">
            Úsalo para documentar revisión mensual o compartir estado de sistema.
          </p>
          <pre className="mt-4 max-h-[560px] overflow-auto rounded-3xl border border-black/8 bg-[#F5F2EA] p-4 text-xs leading-6 text-[#0C1F36]">
            {report}
          </pre>
          {copyStatus ? <p className="mt-3 text-sm text-black/55">{copyStatus}</p> : null}
        </Card>
      </div>
    </div>
  );
}
