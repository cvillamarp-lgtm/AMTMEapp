'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

type Episode = {
  id: string;
  episode_number: string;
  title: string;
  theme: string;
  status: string;
  cta: string | null;
  spotify_description: string | null;
};

type ContentPiece = { id: string; status: string };
type Lead = { id: string; status: string; next_action: string };

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-4xl font-bold text-primary tracking-tight">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [content, setContent] = useState<ContentPiece[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const [ep, ct, ld] = await Promise.all([
          supabase.from('episodes').select('*').order('created_at', { ascending: false }),
          supabase.from('content_pieces').select('id,status'),
          supabase.from('monetization_leads').select('id,status,next_action'),
        ]);
        setEpisodes(ep.data || []);
        setContent(ct.data || []);
        setLeads(ld.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const inProgress = episodes.filter(
    (e) => !['publicado', 'distribuido', 'medido', 'archivado'].includes(e.status)
  ).length;

  const published = episodes.filter((e) =>
    ['publicado', 'distribuido', 'medido'].includes(e.status)
  ).length;

  const contentPending = content.filter((c) =>
    ['borrador', 'listo'].includes(c.status)
  ).length;

  const activeLeads = leads.filter(
    (l) => !['pagado', 'entregado', 'perdido'].includes(l.status)
  ).length;

  const criticalAlerts = episodes.filter(
    (e) =>
      ['publicado', 'distribuido'].includes(e.status) &&
      (!e.cta || !e.spotify_description)
  );

  const leadsNoAction = leads.filter(
    (l) => !['pagado', 'perdido'].includes(l.status) && !l.next_action
  );

  const recent = episodes.slice(0, 5);

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
          Sistema operativo editorial, documental y operativo para gestionar AMTME desde una sola fuente central.
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

          {/* Centro de control + Alertas */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-semibold text-primary">Centro de control</h2>
              <p className="text-sm text-muted-foreground mb-4">Acciones rápidas</p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/episodios"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Plus size={16} /> Crear episodio
                </Link>
                <Link
                  href="/contenido"
                  className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors"
                >
                  <Plus size={16} /> Crear contenido
                </Link>
                <Link
                  href="/metricas"
                  className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors"
                >
                  <Plus size={16} /> Registrar métrica
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-semibold text-primary">Alertas críticas</h2>
              <p className="text-sm text-muted-foreground mb-4">Requieren atención</p>
              <div className="space-y-2">
                {criticalAlerts.length === 0 && leadsNoAction.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay alertas críticas</p>
                ) : (
                  <>
                    {criticalAlerts.map((ep) => (
                      <div key={ep.id} className="flex items-center justify-between text-sm">
                        <span>
                          EP #{ep.episode_number} {!ep.cta ? 'sin CTA' : 'sin descripción Spotify'}
                        </span>
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                          Acción requerida
                        </span>
                      </div>
                    ))}
                    {leadsNoAction.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span>{leadsNoAction.length} leads sin próxima acción</span>
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                          Acción requerida
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Episodios recientes */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-semibold text-primary">Producción actual</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Últimos episodios cargados desde Supabase
            </p>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No hay episodios. Revisa la conexión con Supabase.
              </p>
            ) : (
              <div className="space-y-3">
                {recent.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4"
                  >
                    <div>
                      <p className="font-semibold text-primary">
                        #{ep.episode_number}: {ep.title}
                      </p>
                      <p className="text-sm text-muted-foreground">Tema: {ep.theme}</p>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold',
                        ep.status === 'publicado'
                          ? 'bg-amtme-lemon text-black'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {ep.status.charAt(0).toUpperCase() + ep.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
