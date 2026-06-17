'use client';

import Link from 'next/link';
import { Sparkle, Leaf } from '@phosphor-icons/react';
import { useNextBestActions } from '@/hooks/use-next-best-actions';
import { useEpisodes, useContentPieces, useMonetizationLeads } from '@/hooks';
import { NextBestActionWidget } from '@/components/next-best-action-widget';
import { EpisodeList } from '@/components/lists';
import { PageHeader, LoadingSkeleton, Button } from '@/components/ui';

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-amtme-border bg-amtme-navy/30 p-5 shadow-soft">
      <p className="text-sm text-amtme-gray-400">{label}</p>
      <p className="mt-2 text-4xl font-bold text-amtme-yellow tracking-tight">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  // Fetch data using hooks
  const { data: allEpisodes, loading: episodesLoading } = useEpisodes();
  const { data: allContent, loading: contentLoading } = useContentPieces();
  const { data: allLeads, loading: leadsLoading } = useMonetizationLeads();

  const loading = episodesLoading || contentLoading || leadsLoading;
  const nextBestActions = useNextBestActions();

  // Compute KPIs from fetched data
  const inProgress = allEpisodes.filter(
    (e) => !['Publicado', 'Distribuido', 'Medido', 'Archivado'].includes(e.status)
  ).length;

  const published = allEpisodes.filter((e) =>
    ['Publicado', 'Distribuido', 'Medido'].includes(e.status)
  ).length;

  const contentPending = allContent.filter((c) => ['Borrador', 'Listo'].includes(c.status)).length;

  const activeLeads = allLeads.filter((l) => !['Pagado', 'Perdido'].includes(l.status)).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <PageHeader
        eyebrow="Sistema operativo"
        title="AMTME Studio OS"
        description="Gestiona episodios, contenido, métricas y monetización desde una fuente central."
      />

      {loading ? (
        <div className="space-y-4">
          <LoadingSkeleton lines={4} />
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatCard label="Episodios en curso" value={inProgress} />
            <StatCard label="Episodios publicados" value={published} />
            <StatCard label="Contenido pendiente" value={contentPending} />
            <StatCard label="Leads activos" value={activeLeads} />
          </div>

          {/* Siguiente acción + Estado de producción */}
          <div className="grid gap-4 lg:grid-cols-2">
            <NextBestActionWidget actions={nextBestActions} />

            <div className="rounded-lg border border-amtme-border bg-amtme-navy/30 p-5 shadow-soft">
              <h2 className="font-semibold text-amtme-yellow mb-1">Accesos rápidos</h2>
              <p className="text-sm text-amtme-gray-400 mb-4">Navega a donde necesitas</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: '/documento-maestro', label: 'Documento maestro' },
                  { href: '/studio/episodios', label: 'Episodios' },
                  { href: '/guiones', label: 'Guiones' },
                  { href: '/contenido', label: 'Contenido' },
                  { href: '/calendario', label: 'Calendario' },
                  { href: '/checklists', label: 'Checklists' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md border border-amtme-border/60 bg-amtme-navy/50 px-3 py-3 text-center text-sm font-medium text-amtme-white hover:bg-amtme-navy/80 hover:text-amtme-yellow transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-amtme-yellow/30 bg-amtme-navy/30 p-5 shadow-soft">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-amtme-yellow">IA útil ahora</h2>
                  <p className="text-sm text-amtme-gray-400">Genera contenido con asistencia</p>
                </div>
                <Sparkle size={20} className="text-amtme-yellow shrink-0" />
              </div>
              <p className="text-sm text-amtme-gray-400 mb-4">
                Editor de IA, guiones, descripciones y más
              </p>
              <Button variant="primary" href="/ia/editor">
                <Sparkle size={16} weight="fill" />
                Abrir editor IA
              </Button>
            </div>
          </div>

          {/* Energía creativa */}
          <div className="rounded-lg border border-amtme-border bg-amtme-navy/30 p-5 shadow-soft">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-amtme-yellow">Energía y sostén</h2>
                <p className="text-sm text-amtme-gray-400 mt-1">Recomendación sostenible de hoy</p>
              </div>
              <Leaf size={20} className="text-amtme-yellow shrink-0" />
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-amtme-white/5 border border-amtme-border/40">
                <p className="text-sm font-medium text-amtme-white">Modo normal: produce.</p>
                <p className="text-sm text-amtme-gray-400 mt-1">
                  Si tienes energía, avanza en el episodio actual. Si no, ve a Notas y activa el
                  modo baja energía.
                </p>
              </div>
              {activeLeads === 0 && (
                <div className="p-3 rounded-lg bg-amtme-yellow/10 border border-amtme-yellow/30">
                  <p className="text-sm font-medium text-amtme-yellow">
                    Sin leads activos en Monetización.
                  </p>
                  <p className="text-sm text-amtme-gray-300 mt-1">
                    Cuando alguien exprese interés, regístralo. No hace falta buscarlo; el contenido
                    lo atrae.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Episodios recientes */}
          <div className="rounded-lg border border-amtme-border bg-amtme-navy/30 p-5 shadow-soft">
            <h2 className="font-semibold text-amtme-yellow mb-1">Producción actual</h2>
            <p className="text-sm text-amtme-gray-400 mb-4">Episodios recientes desde Supabase</p>
            <EpisodeList limit={5} />
          </div>
        </>
      )}
    </div>
  );
}
