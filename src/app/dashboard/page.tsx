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
    <Card className="bg-[#F5F2EA]">
      <div className="text-xs uppercase tracking-[0.22em] text-black/40">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-[#0C1F36]">{value}</div>
      <div className="mt-2 text-sm text-black/55">{detail}</div>
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
    <div className="space-y-5 pb-24">
      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="overflow-hidden bg-[#0C1F36] text-white shadow-[0_20px_60px_rgba(0,31,54,0.28)]">
          <div className="flex h-full flex-col justify-between gap-8">
            <div className="max-w-2xl">
              <Badge tone="accent">Centro de control operativo</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                AMTME Studio OS
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/78 sm:text-base">
                Fuente central para gestionar episodios, contenido, métricas, monetización, política
                y verificación del sistema.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button href="/episodios">Crear episodio</Button>
              <Button href="/creador-visual" variant="secondary">
                Crear imagen
              </Button>
              <Button href="/contenido" variant="secondary">
                Crear copy
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
              <h3 className="mt-1 text-xl font-semibold text-[#0C1F36]">
                Lo que necesita atención ahora
              </h3>
            </div>
            <Button href="/checklists" variant="secondary">
              Abrir checklists
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {qualityAlerts.length ? (
              qualityAlerts.map((alert) => (
                <div
                  key={alert}
                  className="flex items-start gap-3 rounded-2xl border border-black/8 bg-[#F5F2EA] px-4 py-3 text-sm text-[#0C1F36]"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#E0211E]" />
                  <span>{truncateText(alert, MAX_ALERT_LENGTH)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-black/50">No hay alertas activas.</p>
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
              <h3 className="mt-1 text-xl font-semibold text-[#0C1F36]">Producción actual</h3>
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
                className="block rounded-2xl border border-black/8 bg-[#F5F2EA] px-4 py-4 transition hover:bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-black/38">
                      Episodio {episode.episodeNumber}
                    </div>
                    <div className="mt-1 text-base font-semibold text-[#0C1F36]">
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
