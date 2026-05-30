'use client';

import Link from 'next/link';
import { Badge, Button, Card } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { formatDate } from '@/lib/studio-utils';
import { truncateText } from '@/lib/text-utils';

const MAX_ALERT_LENGTH = 120;
const MAX_EPISODE_TITLE_LENGTH = 68;

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card className="border border-semantic-border bg-semantic-surface">
      <div className="text-[10px] uppercase tracking-[0.2em] text-amtme-slate">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tighter text-amtme-navy">{value}</div>
      <div className="mt-1.5 text-xs leading-tight text-amtme-slate/80">{detail}</div>
    </Card>
  );
}

export default function DashboardPage() {
  const { state } = useStudio();

  const episodesInFlight = state.episodes.filter(
    (episode) => !['Publicado', 'Distribuido', 'Medido', 'Archivado'].includes(episode.status)
  );
  const pendingEpisodes = state.episodes.filter(
    (episode) => !episode.cta || !episode.spotifyDescription || !episode.appleDescription
  );
  const overdueContent = state.contentPieces.filter(
    (piece) => !piece.metricGoal || piece.status !== 'Publicado'
  );
  const qualityAlerts = [
    ...pendingEpisodes.map(
      (episode) => `Episodio ${episode.episodeNumber} sin cierre operativo completo.`
    ),
    ...state.visualAssets
      .filter((asset) => !asset.palette.includes('#0C1F36') && !asset.palette.includes('Navy'))
      .map((asset) => `Pieza visual ${asset.title} sin referencia clara a la paleta oficial.`),
    ...state.archiveItems
      .filter((item) => item.status !== 'Archivado')
      .map((item) => `Archivo ${item.name} sin estado final.`),
  ].slice(0, 7);

  return (
    <div className="space-y-6 pb-24">
      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="overflow-hidden border-0 bg-amtme-navy text-white shadow-[0_24px_70px_rgba(12,31,54,0.35)]">
          <div className="flex h-full flex-col justify-between gap-10 p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium tracking-[0.15em] text-amtme-gold">
                CENTRO DE CONTROL
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tighter sm:text-5xl">
                Bienvenido a<br />
                AMTME Studio OS
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
                La fuente de verdad editorial y operativa. Todo lo que importa para producir,
                distribuir y medir AMTME en un solo lugar.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                href="/episodios"
                className="bg-white text-amtme-navy hover:bg-amtme-gold hover:text-amtme-navy"
              >
                Nuevo episodio
              </Button>
              <Button
                href="/ia/editor"
                variant="secondary"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Usar el Editor IA
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Stat
            label="Sistema"
            value="Operativo"
            detail="Estructura oficial activa y política cargada."
          />
          <Stat
            label="Próxima fecha"
            value={
              state.calendarEvents[0] ? formatDate(state.calendarEvents[0].date) : 'Sin agenda'
            }
            detail="Publicación principal y revisión de flujo."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Episodios en curso"
          value={String(episodesInFlight.length)}
          detail="Ideas, investigación, guion, grabación o edición."
        />
        <Stat
          label="Contenido pendiente"
          value={String(overdueContent.length)}
          detail="Piezas sin cierre editorial o meta clara."
        />
        <Stat
          label="Alertas de calidad"
          value={String(qualityAlerts.length)}
          detail="Elementos que requieren atención inmediata."
        />
        <Stat
          label="Documento maestro"
          value={String(state.masterSections.length)}
          detail="Secciones activas con estado y revisión."
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-black/40">
                Pendientes críticos
              </div>
              <h3 className="mt-1 text-xl font-bold text-amtme-navy">
                Lo que necesita atención ahora
              </h3>
            </div>
            <Button href="/checklists" variant="secondary">
              Abrir checklists
            </Button>
          </div>
          <div className="mt-6">
            {qualityAlerts.length > 0 ? (
              <div className="space-y-3">
                {qualityAlerts.map((alert) => (
                  <div
                    key={alert}
                    className="flex items-start gap-3 rounded-2xl border border-black/10 bg-semantic-surface-soft px-4 py-3 text-sm text-amtme-navy"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amtme-red" />
                    <span className="leading-snug">{truncateText(alert, MAX_ALERT_LENGTH)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-semantic-border py-10 text-center">
                <div className="text-4xl">🌱</div>
                <p className="mt-4 font-medium tracking-tight text-amtme-navy">
                  El sistema está en equilibrio
                </p>
                <p className="mt-1.5 max-w-[260px] text-sm text-amtme-slate">
                  No hay alertas de calidad activas. Buen trabajo manteniendo la integridad
                  editorial.
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-[0.22em] text-black/40">Accesos rápidos</div>
          <div className="mt-4 grid gap-2">
            <Button href="/documento-maestro" variant="secondary">
              Ver documento maestro
            </Button>
            <Button href="/metricas" variant="secondary">
              Registrar métrica
            </Button>
            <Button href="/calendario" variant="secondary">
              Ver calendario
            </Button>
            <Button href="/politica-operativa" variant="secondary">
              Revisar política
            </Button>
            <Button href="/historico" variant="secondary">
              Abrir histórico
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-black/40">Episodios</div>
              <h3 className="mt-1 text-xl font-bold text-amtme-navy">Producción actual</h3>
            </div>
            <Button href="/episodios" variant="ghost">
              Ver todos
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {state.episodes.slice(0, 3).map((episode) => (
              <Link
                key={episode.id}
                href="/episodios"
                className="block rounded-2xl border border-black/10 bg-semantic-surface-soft px-4 py-4 transition hover:bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-black/38">
                      Episodio {episode.episodeNumber}
                    </div>
                    <div className="mt-1 text-base font-bold text-amtme-navy">
                      {truncateText(episode.title, MAX_EPISODE_TITLE_LENGTH)}
                    </div>
                  </div>
                  <Badge tone={episode.status === 'Publicado' ? 'good' : 'neutral'}>
                    {episode.status}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-black/60 sm:grid-cols-3">
                  <span>Pilar: {episode.pillar}</span>
                  <span>CTA: {episode.cta || 'Pendiente'}</span>
                  <span>Publicación: {episode.publishDate || 'Sin fecha'}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-[0.22em] text-black/40">
            Estado del sistema
          </div>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Política</span>
              <Badge tone="good">Activa</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Checklists</span>
              <Badge tone="accent">Listos</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Temporal</span>
              <Badge tone="warning">Cerrada</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Documento maestro</span>
              <Badge tone="good">Vigente</Badge>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
