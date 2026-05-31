'use client';

import { useMemo } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { joinClasses } from '@/lib/studio-utils';

type FieldCheck = { label: string; ok: boolean; critical: boolean };

function analyzeEpisode(ep: ReturnType<typeof useStudio>['state']['episodes'][0]) {
  const checks: FieldCheck[] = [
    { label: 'Título', ok: !!ep.title?.trim(), critical: true },
    { label: 'Número', ok: !!ep.episodeNumber, critical: true },
    { label: 'Pilar', ok: !!ep.pillar?.trim(), critical: true },
    { label: 'CTA', ok: !!ep.cta?.trim(), critical: false },
    { label: 'Descripción Spotify', ok: !!ep.spotifyDescription?.trim(), critical: false },
    { label: 'Descripción Apple', ok: !!ep.appleDescription?.trim(), critical: false },
    { label: 'Fecha de publicación', ok: !!ep.publishDate, critical: false },
  ];
  const total = checks.length;
  const passed = checks.filter((c) => c.ok).length;
  const criticalFailed = checks.filter((c) => !c.ok && c.critical).length;
  return { checks, pct: Math.round((passed / total) * 100), criticalFailed, warnings: checks.filter((c) => !c.ok && !c.critical).length };
}

export default function RevisionEpisodiosPage() {
  const { state } = useStudio();

  const analyses = useMemo(
    () => state.episodes.map((ep) => ({ ep, ...analyzeEpisode(ep) })),
    [state.episodes]
  );

  const incomplete = analyses.filter((a) => a.pct < 100);
  const critical = analyses.filter((a) => a.criticalFailed > 0);
  const complete = analyses.filter((a) => a.pct === 100);

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/40">
            Control de calidad
          </div>
          <h1 className="mt-1 text-[28px] font-bold tracking-[-0.03em] text-[#0C1F36]">
            Revisión de Episodios
          </h1>
          <p className="mt-1 text-[13px] text-[#6B7B8C]">
            Detecta campos faltantes y alertas de completitud.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: analyses.length, tone: 'neutral' as const },
          { label: 'Incompletos', value: incomplete.length, tone: 'warning' as const },
          { label: 'Errores críticos', value: critical.length, tone: 'danger' as const },
        ].map(({ label, value, tone }) => (
          <div key={label} className="rounded-[20px] border border-black/[0.07] bg-white p-5 shadow-[0_2px_8px_rgba(12,31,54,0.05)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/40">{label}</div>
            <div className="mt-1 text-[32px] font-bold leading-none tracking-[-0.04em] text-[#0C1F36]">{value}</div>
            <div className="mt-2">
              <Badge tone={tone}>{tone === 'neutral' ? 'Total' : tone === 'warning' ? 'Atención' : 'Crítico'}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Lista */}
      {incomplete.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center py-10 text-center">
            <div className="text-4xl">✅</div>
            <p className="mt-3 text-[15px] font-semibold text-[#0C1F36]">Todos los episodios están completos</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {analyses.map(({ ep, checks, pct, criticalFailed, warnings }) => (
            <Card key={ep.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0C1F36]/35">
                    EP {ep.episodeNumber}
                  </div>
                  <div className="mt-0.5 text-[15px] font-bold text-[#0C1F36]">{ep.title}</div>
                  <div className="mt-1 flex gap-2">
                    {criticalFailed > 0 && <Badge tone="danger">{criticalFailed} críticos</Badge>}
                    {warnings > 0 && <Badge tone="warning">{warnings} advertencias</Badge>}
                    {pct === 100 && <Badge tone="good">Completo</Badge>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[28px] font-bold tracking-tight text-[#0C1F36]">{pct}%</div>
                  <div className="text-[11px] text-[#6B7B8C]">completitud</div>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]">
                <div
                  className={joinClasses(
                    'h-full rounded-full transition-all',
                    pct === 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-[#FEE94B]' : 'bg-[#E0211E]'
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Campos faltantes */}
              {checks.some((c) => !c.ok) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {checks
                    .filter((c) => !c.ok)
                    .map((c) => (
                      <div
                        key={c.label}
                        className={joinClasses(
                          'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-medium',
                          c.critical
                            ? 'bg-red-50 text-[#C0201E]'
                            : 'bg-[#FEE94B]/30 text-[#0C1F36]'
                        )}
                      >
                        <span>{c.critical ? '✕' : '△'}</span>
                        {c.label}
                      </div>
                    ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
