'use client';

import { useState } from 'react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import type { MetricMonthly } from '@/lib/studio-types';

const emptyMetric = (): MetricMonthly => ({
  id: `metric-month-${Date.now()}`,
  month: new Date().toISOString().slice(0, 7),
  platform: 'Spotify',
  reach: 0,
  plays: 0,
  downloads: 0,
  engagement: 0,
  profileVisits: 0,
  linkClicks: 0,
  dms: 0,
  conversions: 0,
  revenue: 0,
  insight: '',
  action: '',
});

export default function MetricasPage() {
  const { state, setState } = useStudio();
  const [draft, setDraft] = useState<MetricMonthly>(state.metricsMonthly[0] ?? emptyMetric());

  const saveMetric = () => {
    setState((current) => ({
      ...current,
      metricsMonthly: [draft, ...current.metricsMonthly],
    }));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.88fr]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Métricas</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
              Lectura operativa del sistema
            </h2>
          </div>
          <Badge tone="accent">{state.metricsMonthly.length} ciclos</Badge>
        </div>

        <div className="mt-5 space-y-4">
          {state.metricsMonthly.map((metric) => (
            <div key={metric.id} className="rounded-3xl border border-black/8 bg-[#F5F2EA] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-black/38">
                    {metric.month} · {metric.platform}
                  </div>
                  <div className="mt-1 text-base font-semibold text-[#0C1F36]">
                    {metric.insight}
                  </div>
                </div>
                <Badge tone={metric.conversions > 10 ? 'good' : 'neutral'}>
                  {metric.conversions} conversiones
                </Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-black/60 sm:grid-cols-3 lg:grid-cols-4">
                <span>Reach {metric.reach}</span>
                <span>Plays {metric.plays}</span>
                <span>Downloads {metric.downloads}</span>
                <span>Engagement {metric.engagement}%</span>
                <span>Visitas {metric.profileVisits}</span>
                <span>Clicks {metric.linkClicks}</span>
                <span>DMs {metric.dms}</span>
                <span>Revenue ${metric.revenue}</span>
              </div>
              <p className="mt-3 text-sm text-black/55">Acción: {metric.action}</p>
            </div>
          ))}

          {state.metricsEpisode.map((metric) => (
            <div key={metric.id} className="rounded-3xl border border-black/8 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-[#0C1F36]">
                  Episodio {metric.episodeId}
                </div>
                <Badge tone="neutral">Retención {metric.retention}%</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-black/60 sm:grid-cols-2 lg:grid-cols-3">
                <span>48h: {metric.plays48h}</span>
                <span>7d: {metric.plays7d}</span>
                <span>Guardados: {metric.saves}</span>
                <span>Compartidos: {metric.shares}</span>
                <span>Comentarios: {metric.comments}</span>
                <span>Conversiones: {metric.conversions}</span>
              </div>
              <p className="mt-3 text-sm text-black/55">{metric.insight}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-[0.22em] text-black/40">Registrar mes</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Mes">
            <Input
              value={draft.month}
              onChange={(event) => setDraft({ ...draft, month: event.target.value })}
            />
          </Field>
          <Field label="Plataforma">
            <Select
              value={draft.platform}
              onChange={(event) => setDraft({ ...draft, platform: event.target.value })}
            >
              <option>Spotify</option>
              <option>Apple Podcasts</option>
              <option>Instagram</option>
              <option>TikTok</option>
              <option>YouTube Shorts</option>
            </Select>
          </Field>
          <Field label="Reach">
            <Input
              type="number"
              value={draft.reach}
              onChange={(event) => setDraft({ ...draft, reach: Number(event.target.value) })}
            />
          </Field>
          <Field label="Plays">
            <Input
              type="number"
              value={draft.plays}
              onChange={(event) => setDraft({ ...draft, plays: Number(event.target.value) })}
            />
          </Field>
          <Field label="Downloads">
            <Input
              type="number"
              value={draft.downloads}
              onChange={(event) => setDraft({ ...draft, downloads: Number(event.target.value) })}
            />
          </Field>
          <Field label="Engagement %">
            <Input
              type="number"
              value={draft.engagement}
              onChange={(event) => setDraft({ ...draft, engagement: Number(event.target.value) })}
            />
          </Field>
          <Field label="Visitas perfil">
            <Input
              type="number"
              value={draft.profileVisits}
              onChange={(event) =>
                setDraft({ ...draft, profileVisits: Number(event.target.value) })
              }
            />
          </Field>
          <Field label="Clicks">
            <Input
              type="number"
              value={draft.linkClicks}
              onChange={(event) => setDraft({ ...draft, linkClicks: Number(event.target.value) })}
            />
          </Field>
          <Field label="DMs">
            <Input
              type="number"
              value={draft.dms}
              onChange={(event) => setDraft({ ...draft, dms: Number(event.target.value) })}
            />
          </Field>
          <Field label="Conversiones">
            <Input
              type="number"
              value={draft.conversions}
              onChange={(event) => setDraft({ ...draft, conversions: Number(event.target.value) })}
            />
          </Field>
          <Field label="Revenue">
            <Input
              type="number"
              value={draft.revenue}
              onChange={(event) => setDraft({ ...draft, revenue: Number(event.target.value) })}
            />
          </Field>
          <Field label="Insight">
            <Textarea
              rows={4}
              value={draft.insight}
              onChange={(event) => setDraft({ ...draft, insight: event.target.value })}
            />
          </Field>
          <Field label="Acción">
            <Textarea
              rows={4}
              value={draft.action}
              onChange={(event) => setDraft({ ...draft, action: event.target.value })}
            />
          </Field>
        </div>
        <div className="mt-5">
          <Button onClick={saveMetric}>Guardar ciclo mensual</Button>
        </div>
      </Card>
    </div>
  );
}
