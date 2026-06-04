'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkle, Leaf, CheckCircle, Lightning } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';

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
        const supabase = getSupabaseAuthBrowserClient();
        if (!supabase) return;
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

  const episodesPendingMeasure = episodes.filter(
    (e) => e.status === 'publicado' || e.status === 'distribuido'
  ).length;

  const inProgress = episodes.filter(
    (e) => !['publicado', 'distribuido', 'medido', 'archivado'].includes(e.status)
  ).length;

  const published = episodes.filter((e) =>
    ['publicado', 'distribuido', 'medido'].includes(e.status)
  ).length;

  const contentPending = content.filter((c) => ['borrador', 'listo'].includes(c.status)).length;

  const activeLeads = leads.filter(
    (l) => !['pagado', 'entregado', 'perdido'].includes(l.status)
  ).length;

  const criticalAlerts = episodes.filter(
    (e) => ['publicado', 'distribuido'].includes(e.status) && (!e.cta || !e.spotify_description)
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
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-primary">Siguiente acción recomendada</h2>
                  <p className="text-sm text-muted-foreground mt-1">Enfócate aquí primero</p>
                </div>
                <Lightning size={20} className="text-primary" />
              </div>
              <div className="mt-4 space-y-3">
                {episodesPendingMeasure > 0 ? (
                  <Link
                    href="/metricas"
                    className="block p-3 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors border border-teal-200"
                  >
                    <p className="text-sm font-medium text-teal-800">
                      {episodesPendingMeasure} episodio(s) listos para medir
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Registra las metricas para cerrar el ciclo de produccion
                    </p>
                  </Link>
                ) : null}
                {leadsNoAction.length > 0 ? (
                  <Link
                    href="/monetizacion"
                    className="block p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <p className="text-sm font-medium text-primary">
                      {leadsNoAction.length} lead(s) sin proxima accion
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Define el siguiente paso para mantener el flujo
                    </p>
                  </Link>
                ) : null}
                {contentPending > 0 ? (
                  <Link
                    href="/calendario"
                    className="block p-3 rounded-lg bg-[#e8ff40]/20 hover:bg-[#e8ff40]/30 transition-colors border border-[#e8ff40]/40"
                  >
                    <p className="text-sm font-medium text-primary">
                      {contentPending} pieza(s) lista(s) sin agendar
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ve al calendario y agenda la distribucion
                    </p>
                  </Link>
                ) : null}
                {criticalAlerts.length > 0 ? (
                  <Link
                    href="/episodios"
                    className="block p-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
                  >
                    <p className="text-sm font-medium text-destructive">
                      {criticalAlerts.length} episodio(s) incompleto(s)
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Faltan CTA o descripción Spotify
                    </p>
                  </Link>
                ) : null}
                {leadsNoAction.length === 0 && criticalAlerts.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">
                    Sin acciones críticas. Buen ritmo de trabajo.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-primary">Estado de producción</h2>
                  <p className="text-sm text-muted-foreground mt-1">Resumen del flujo</p>
                </div>
                <CheckCircle size={20} className="text-primary" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">En desarrollo</span>
                  <span className="font-semibold text-primary">{inProgress}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Publicados</span>
                  <span className="font-semibold text-primary">{published}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contenido pendiente</span>
                  <span className="font-semibold text-primary">{contentPending}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Leads activos</span>
                  <span className="font-semibold text-primary">{activeLeads}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Listo para publicar */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-primary">Listo para publicar</h2>
                <p className="text-sm text-muted-foreground">
                  Episodios que pueden distribuirse ahora
                </p>
              </div>
              <CheckCircle size={20} className="text-primary" />
            </div>
            <div className="space-y-2">
              {episodes.filter((e) => e.status === 'listo').length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No hay episodios listos para publicar
                </p>
              ) : (
                episodes
                  .filter((e) => e.status === 'listo')
                  .slice(0, 3)
                  .map((ep) => (
                    <div
                      key={ep.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors"
                    >
                      <span className="text-sm font-medium text-primary">
                        #{ep.episode_number}: {ep.title}
                      </span>
                      <Link href="/episodios" className="text-xs text-primary hover:underline">
                        Publicar
                      </Link>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Centro de control + Acciones rápidas */}
          <div className="grid gap-4 lg:grid-cols-2">
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
                  href="/episodios"
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
