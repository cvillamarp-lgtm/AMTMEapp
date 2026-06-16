'use client';

import Link from 'next/link';
import { Sparkle, Leaf } from '@phosphor-icons/react';
import { useNextBestActions } from '@/hooks/use-next-best-actions';
import { useEpisodes, useContentPieces, useMonetizationLeads } from '@/hooks';
import { NextBestActionWidget } from '@/components/next-best-action-widget';
import { EpisodeList } from '@/components/lists';

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-4xl font-bold text-primary tracking-tight">{value}</p>
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
      {/* Hero */}
      <div className="rounded-2xl border border-amtme-lemon/60 bg-amtme-cream p-6 shadow-sm">
        <span className="inline-flex items-center rounded-full bg-amtme-lemon px-3 py-1 text-xs font-semibold text-black mb-4">
          Nueva identidad activa
        </span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
          AMTME Studio OS
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Sistema operativo editorial, documental y operativo para gestionar AMTME desde una sola
          fuente central.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Cargando datos desde Supabase...
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

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-semibold text-primary">Acciones rápidas</h2>
              <p className="text-sm text-muted-foreground mb-4">Navega a donde necesitas</p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/documento-maestro"
                  className="rounded-md border border-border bg-background p-3 text-center text-sm font-medium text-primary hover:bg-muted transition-colors"
                >
                  Documento maestro
                </Link>
                <Link
                  href="/studio/episodios"
                  className="rounded-md border border-border bg-background p-3 text-center text-sm font-medium text-primary hover:bg-muted transition-colors"
                >
                  Episodios
                </Link>
                <Link
                  href="/guiones"
                  className="rounded-md border border-border bg-background p-3 text-center text-sm font-medium text-primary hover:bg-muted transition-colors"
                >
                  Guiones
                </Link>
                <Link
                  href="/contenido"
                  className="rounded-md border border-border bg-background p-3 text-center text-sm font-medium text-primary hover:bg-muted transition-colors"
                >
                  Contenido
                </Link>
                <Link
                  href="/calendario"
                  className="rounded-md border border-border bg-background p-3 text-center text-sm font-medium text-primary hover:bg-muted transition-colors"
                >
                  Calendario
                </Link>
                <Link
                  href="/checklists"
                  className="rounded-md border border-border bg-background p-3 text-center text-sm font-medium text-primary hover:bg-muted transition-colors"
                >
                  Checklists
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-amtme-lemon/40 bg-amtme-cream p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-primary">IA útil ahora</h2>
                  <p className="text-sm text-muted-foreground">Genera contenido con asistencia</p>
                </div>
                <Sparkle size={20} className="text-amtme-lemon" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Editor de IA, guiones, descripciones y más
              </p>
              <Link
                href="/ia/editor"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Sparkle size={16} /> Abrir editor IA
              </Link>
            </div>
          </div>

          {/* Energía creativa */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-primary">Energia y sostén</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Recomendacion sostenible de hoy
                </p>
              </div>
              <Leaf size={20} className="text-primary" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-sm font-medium text-primary">Modo normal: produce.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Si tienes energia, avanza en el episodio actual. Si no, ve a Notas y activa el
                  modo baja energia.
                </p>
              </div>
              {activeLeads === 0 && (
                <div className="p-3 rounded-lg bg-[#e8ff40]/10 border border-[#e8ff40]/30">
                  <p className="text-sm font-medium text-primary">
                    Sin leads activos en Monetizacion.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cuando alguien exprese interes, registralo. No hace falta buscarlo; el contenido
                    lo atrae.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Episodios recientes */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-semibold text-primary">Producción actual</h2>
            <p className="text-sm text-muted-foreground mb-4">Episodios recientes desde Supabase</p>
            <EpisodeList limit={5} />
          </div>
        </>
      )}
    </div>
  );
}
