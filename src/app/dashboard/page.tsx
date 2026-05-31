'use client';

import Link from 'next/link';
import { Badge, Button, Card } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { formatDate } from '@/lib/studio-utils';
import { truncateText } from '@/lib/text-utils';

const MAX_ALERT_LENGTH = 120;
const MAX_EPISODE_TITLE_LENGTH = 68;

function KPI({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        'flex flex-col gap-1 rounded-[20px] border p-5',
        accent
          ? 'border-[#FEE94B] bg-[#FEE94B]'
          : 'border-black/[0.07] bg-white shadow-[0_2px_8px_rgba(12,31,54,0.05)]',
      ].join(' ')}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/40">
        {label}
      </span>
      <span
        className={[
          'text-[32px] font-bold leading-none tracking-[-0.04em]',
          accent ? 'text-[#0C1F36]' : 'text-[#0C1F36]',
        ].join(' ')}
      >
        {value}
      </span>
      <span className="text-[12px] leading-snug text-[#6B7B8C]">{detail}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { state } = useStudio();

  const episodesInFlight = state.episodes.filter(
    (ep) => !['Publicado', 'Distribuido', 'Medido', 'Archivado'].includes(ep.status)
  );
  const pendingEpisodes = state.episodes.filter(
    (ep) => !ep.cta || !ep.spotifyDescription || !ep.appleDescription
  );
  const overdueContent = state.contentPieces.filter(
    (p) => !p.metricGoal || p.status !== 'Publicado'
  );
  const qualityAlerts = [
    ...pendingEpisodes.map(
      (ep) => `Episodio ${ep.episodeNumber} sin cierre operativo completo.`
    ),
    ...state.visualAssets
      .filter((a) => !a.palette.includes('#0C1F36') && !a.palette.includes('Navy'))
      .map((a) => `Pieza visual ${a.title} sin referencia a paleta oficial.`),
    ...state.archiveItems
      .filter((i) => i.status !== 'Archivado')
      .map((i) => `Archivo ${i.name} sin estado final.`),
  ].slice(0, 7);

  return (
    <div className="space-y-5 pb-24">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        {/* Hero card — navy */}
        <div className="relative overflow-hidden rounded-[24px] bg-[#0C1F36] p-8 shadow-[0_24px_60px_rgba(12,31,54,0.30)]">
          {/* Textura sutil */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
               style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE94B]/15 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FEE94B]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FEE94B]">
                  Centro de control
                </span>
              </div>
              <h1 className="mt-5 text-[40px] font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-[48px]">
                AMTME<br />Studio OS
              </h1>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/55">
                La fuente de verdad editorial y operativa. Todo lo que importa en un solo lugar.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button href="/episodios"
                className="!bg-[#FEE94B] !text-[#0C1F36] hover:!bg-white shadow-none font-bold">
                Nuevo episodio
              </Button>
              <Button href="/ia/editor" variant="ghost"
                className="!text-white !bg-white/10 hover:!bg-white/20">
                Editor IA
              </Button>
            </div>
          </div>
        </div>

        {/* KPIs verticales */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 xl:gap-3">
          <KPI
            label="Sistema"
            value="Operativo"
            detail="Estructura oficial activa y política cargada."
            accent
          />
          <KPI
            label="Próxima fecha"
            value={state.calendarEvents[0] ? formatDate(state.calendarEvents[0].date) : 'Sin agenda'}
            detail="Publicación principal y revisión de flujo."
          />
        </div>
      </section>

      {/* ── Métricas rápidas ─────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KPI
          label="Episodios en curso"
          value={String(episodesInFlight.length)}
          detail="Ideas, guion, grabación o edición."
        />
        <KPI
          label="Contenido pendiente"
          value={String(overdueContent.length)}
          detail="Piezas sin cierre editorial o meta."
        />
        <KPI
          label="Alertas de calidad"
          value={String(qualityAlerts.length)}
          detail="Elementos que requieren atención."
        />
        <KPI
          label="Secciones maestras"
          value={String(state.masterSections.length)}
          detail="Activas con estado y revisión."
        />
      </section>

      {/* ── Alertas + Accesos ────────────────────────────────────────────── */}
      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/35">
                Pendientes críticos
              </div>
              <h2 className="mt-1 text-[20px] font-bold tracking-[-0.03em] text-[#0C1F36]">
                Lo que necesita atención ahora
              </h2>
            </div>
            <Button href="/checklists" variant="secondary">
              Checklists
            </Button>
          </div>

          <div className="mt-5">
            {qualityAlerts.length > 0 ? (
              <div className="space-y-2">
                {qualityAlerts.map((alert) => (
                  <div
                    key={alert}
                    className="flex items-start gap-3 rounded-2xl bg-[#F5F1E8] px-4 py-3"
                  >
                    <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-[#E0211E]" />
                    <span className="text-[13px] leading-snug text-[#0C1F36]">
                      {truncateText(alert, MAX_ALERT_LENGTH)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/[0.10] py-10 text-center">
                <div className="text-3xl">🌱</div>
                <p className="mt-3 text-[14px] font-semibold tracking-tight text-[#0C1F36]">
                  Sistema en equilibrio
                </p>
                <p className="mt-1 max-w-[220px] text-[12px] text-[#6B7B8C]">
                  No hay alertas de calidad activas.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Accesos rápidos */}
        <Card>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/35">
            Accesos rápidos
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {[
              { href: '/documento-maestro', label: 'Documento maestro' },
              { href: '/metricas', label: 'Registrar métrica' },
              { href: '/calendario', label: 'Calendario' },
              { href: '/politica-operativa', label: 'Política operativa' },
              { href: '/historico', label: 'Histórico' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between rounded-xl bg-[#F5F1E8] px-4 py-2.5 text-[13px] font-medium text-[#0C1F36] transition-all hover:bg-[#EDE8DF]"
              >
                {label}
                <span className="text-[#0C1F36]/30">→</span>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      {/* ── Episodios + Estado ───────────────────────────────────────────── */}
      <section className="grid gap-4 xl:grid-cols-[1.6fr_0.4fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/35">
                Episodios
              </div>
              <h2 className="mt-1 text-[20px] font-bold tracking-[-0.03em] text-[#0C1F36]">
                Producción actual
              </h2>
            </div>
            <Button href="/episodios" variant="ghost">
              Ver todos
            </Button>
          </div>

          <div className="mt-5 space-y-2">
            {state.episodes.slice(0, 4).map((episode) => (
              <Link
                key={episode.id}
                href="/episodios"
                className="flex items-center justify-between gap-4 rounded-2xl bg-[#FAFAF8] px-4 py-3.5 transition-all hover:bg-white hover:shadow-[0_2px_8px_rgba(12,31,54,0.06)]"
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0C1F36]/35">
                    EP {episode.episodeNumber}
                  </div>
                  <div className="mt-0.5 truncate text-[14px] font-semibold text-[#0C1F36]">
                    {truncateText(episode.title, MAX_EPISODE_TITLE_LENGTH)}
                  </div>
                  <div className="mt-1 text-[12px] text-[#6B7B8C]">
                    {episode.pillar} · {episode.publishDate || 'Sin fecha'}
                  </div>
                </div>
                <Badge tone={episode.status === 'Publicado' ? 'good' : 'neutral'}>
                  {episode.status}
                </Badge>
              </Link>
            ))}
          </div>
        </Card>

        {/* Estado del sistema */}
        <Card>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/35">
            Estado del sistema
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Política', tone: 'good' as const, status: 'Activa' },
              { label: 'Checklists', tone: 'accent' as const, status: 'Listos' },
              { label: 'Temporal', tone: 'warning' as const, status: 'Cerrada' },
              { label: 'Doc. maestro', tone: 'good' as const, status: 'Vigente' },
            ].map(({ label, tone, status }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[13px] text-[#0C1F36]">{label}</span>
                <Badge tone={tone}>{status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

    </div>
  );
}
