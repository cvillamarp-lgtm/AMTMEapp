'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
  ChartLegend,
} from '@/components/shadcn/chart';
import type { ChartConfig } from '@/components/shadcn/chart';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/shadcn/dialog';
import {
  Plus,
  Download,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Repeat2,
  Lightbulb,
  ArrowRight,
  BarChart2,
  Mic,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getMetricsMonthly,
  createMetricMonthly,
  getEpisodes,
  getMetricsEpisode,
  createMetricEpisode,
} from '@/lib/database';
import type { MetricMonthly, MetricEpisode, Episode } from '@/types/database';

type AIReport = {
  id: string;
  month: string;
  generated_at: string;
  diagnosis: string;
  growth_pattern: string;
  best_content: string;
  alert: string;
  recommendation_7d: string;
  next_episode_hypothesis: string;
};

type DecisionNote = {
  weekly_learning: string;
  next_experiment: string;
  next_decision: string;
  updated_at: string;
};

const DECISION_KEY = 'amtme-decision-notes';
const REPORTS_KEY = 'amtme-metric-reports';

export default function MetricasPage() {
  const [metrics, setMetrics] = useState<MetricMonthly[]>([]);
  const [metricsEpisode, setMetricsEpisode] = useState<MetricEpisode[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [reports, setReports] = useState<AIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [epDialogOpen, setEpDialogOpen] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState<DecisionNote>({
    weekly_learning: '',
    next_experiment: '',
    next_decision: '',
    updated_at: '',
  });
  const [savingNotes, setSavingNotes] = useState(false);

  const [form, setForm] = useState({
    month: new Date().toISOString().slice(0, 7),
    platform: '',
    reach: 0,
    plays: 0,
    downloads: 0,
    engagement: 0,
    profile_visits: 0,
    link_clicks: 0,
    dms: 0,
    conversions: 0,
    revenue: 0,
    insight: '',
    action: '',
  });

  const [epForm, setEpForm] = useState({
    episode_id: '',
    plays_48h: 0,
    plays_7d: 0,
    retention: 0,
    saves: 0,
    shares: 0,
    comments: 0,
    dms: 0,
    conversions: 0,
    insight: '',
  });

  const load = useCallback(async () => {
    try {
      const [d, ep, eps] = await Promise.all([
        getMetricsMonthly(),
        getMetricsEpisode(),
        getEpisodes(),
      ]);
      setMetrics(d);
      setMetricsEpisode(ep);
      setEpisodes(eps);
      const saved = localStorage.getItem(REPORTS_KEY);
      if (saved) setReports(JSON.parse(saved));
      const notes = localStorage.getItem(DECISION_KEY);
      if (notes) setDecisionNotes(JSON.parse(notes));
    } catch {
      toast.error('Error al cargar metricas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // --- episodios pendientes de medir ---
  const measuredEpisodeIds = new Set(metricsEpisode.map((m) => m.episode_id));
  const pendingToMeasure = episodes.filter(
    (e) => (e.status === 'publicado' || e.status === 'distribuido') && !measuredEpisodeIds.has(e.id)
  );

  // --- mejor rendimiento mensual ---
  const bestMonth =
    metrics.length > 0
      ? [...metrics].sort((a, b) => b.plays + b.dms * 10 - (a.plays + a.dms * 10))[0]
      : null;

  // --- episodio con mejor rendimiento (metricas_episode) ---
  const bestEpisode =
    metricsEpisode.length > 0
      ? [...metricsEpisode].sort((a, b) => b.plays_7d + b.dms * 10 - (a.plays_7d + a.dms * 10))[0]
      : null;
  const bestEpisodeData = bestEpisode
    ? episodes.find((e) => e.id === bestEpisode.episode_id)
    : null;

  // --- ultima recomendacion IA ---
  const latestReport = reports.length > 0 ? reports[0] : null;

  function resetForm() {
    setForm({
      month: new Date().toISOString().slice(0, 7),
      platform: '',
      reach: 0,
      plays: 0,
      downloads: 0,
      engagement: 0,
      profile_visits: 0,
      link_clicks: 0,
      dms: 0,
      conversions: 0,
      revenue: 0,
      insight: '',
      action: '',
    });
  }

  function resetEpForm(episodeId?: string) {
    setEpForm({
      episode_id: episodeId || '',
      plays_48h: 0,
      plays_7d: 0,
      retention: 0,
      saves: 0,
      shares: 0,
      comments: 0,
      dms: 0,
      conversions: 0,
      insight: '',
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.platform || !form.month) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    try {
      await createMetricMonthly(form);
      toast.success('Metrica registrada');
      setDialogOpen(false);
      resetForm();
      await load();
    } catch {
      toast.error('Error al guardar');
    }
  }

  async function handleEpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!epForm.episode_id) {
      toast.error('Selecciona un episodio');
      return;
    }
    try {
      await createMetricEpisode(epForm);
      toast.success('Metrica de episodio registrada');
      setEpDialogOpen(false);
      resetEpForm();
      await load();
    } catch {
      toast.error('Error al guardar');
    }
  }

  function saveDecisionNotes() {
    setSavingNotes(true);
    const updated = { ...decisionNotes, updated_at: new Date().toISOString() };
    setDecisionNotes(updated);
    localStorage.setItem(DECISION_KEY, JSON.stringify(updated));
    setTimeout(() => setSavingNotes(false), 600);
    toast.success('Notas guardadas');
  }

  async function generateReport(m: MetricMonthly) {
    setGenerating(true);
    const prev = metrics.find((x) => x.month < m.month && x.platform === m.platform);
    const prompt = `Analiza estas metricas del podcast AMTME para ${m.platform} en ${m.month}:
Reproducciones: ${m.plays} | Alcance: ${m.reach} | DMs: ${m.dms} | Conversiones: ${m.conversions} | Ingresos: ${m.revenue}
${prev ? `Mes anterior: ${prev.plays} reproducciones, ${prev.revenue} ingresos` : 'Sin datos del mes anterior.'}
Insight: ${m.insight || 'ninguno'}

JSON con exactamente:
{
  "diagnosis": "diagnostico del mes en 2-3 oraciones",
  "growth_pattern": "patron de crecimiento detectado",
  "best_content": "que tipo de contenido funciono mejor",
  "alert": "caida o alerta principal, o Sin alertas criticas",
  "recommendation_7d": "recomendacion concreta proximos 7 dias",
  "next_episode_hypothesis": "hipotesis de tema para proximo episodio"
}
Solo JSON. Espanol neutro.`;
    try {
      const res = await fetch('/api/ia/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'groq',
          prompt,
          systemPrompt:
            'Eres el analista de metricas de AMTME. Respondes en JSON valido unicamente.',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.result) throw new Error(data.error || 'Error al generar');
      const clean = data.result.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      const report: AIReport = {
        id: crypto.randomUUID(),
        month: m.month,
        generated_at: new Date().toISOString(),
        ...parsed,
      };
      const updated = [report, ...reports.filter((r) => r.month !== m.month)];
      setReports(updated);
      localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
      toast.success(`Reporte generado para ${m.month}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al generar reporte');
    } finally {
      setGenerating(false);
    }
  }

  const chartConfig: ChartConfig = {
    plays: { label: 'Reproducciones', color: '#0c1f36' },
    reach: { label: 'Alcance', color: '#e8ff40' },
  };

  const chartData = [...metrics]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((m) => ({ date: m.month.slice(0, 7), plays: m.plays, reach: m.reach }));

  function calcKPIs(m: MetricMonthly) {
    return {
      engagementRate: m.reach > 0 ? ((m.engagement / m.reach) * 100).toFixed(2) : '0',
      conversionRate: m.dms > 0 ? ((m.conversions / m.dms) * 100).toFixed(2) : '0',
      playsToDM: m.plays > 0 ? ((m.dms / m.plays) * 100).toFixed(2) : '0',
    };
  }

  function exportCSV() {
    if (!metrics.length) {
      toast.error('Sin metricas para exportar');
      return;
    }
    const headers = 'mes,plataforma,reproducciones,alcance,dms,conversiones,ingresos\n';
    const rows = metrics
      .map(
        (m) =>
          `${m.month},${m.platform},${m.plays},${m.reach},${m.dms},${m.conversions},${m.revenue}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amtme-metricas.csv';
    a.click();
    toast.success('CSV exportado');
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Metricas</h1>
          <p className="text-sm text-muted-foreground mt-1">Registro y decisiones editoriales</p>
        </div>
        <div className="flex gap-2">
          {metrics.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="mr-1 h-4 w-4" />
              CSV
            </Button>
          )}
          {/* Dialog: metrica episodio */}
          <Dialog open={epDialogOpen} onOpenChange={setEpDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => resetEpForm()}>
                <Mic className="mr-2 h-4 w-4" />
                Medir episodio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar metrica de episodio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEpSubmit} className="space-y-4">
                <div>
                  <Label>Episodio *</Label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                    value={epForm.episode_id}
                    onChange={(e) => setEpForm({ ...epForm, episode_id: e.target.value })}
                  >
                    <option value="">Selecciona un episodio</option>
                    {episodes
                      .filter((ep) => ['publicado', 'distribuido', 'medido'].includes(ep.status))
                      .map((ep) => (
                        <option key={ep.id} value={ep.id}>
                          #{ep.episode_number}: {ep.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Reproducciones 48h</Label>
                    <Input
                      type="number"
                      value={epForm.plays_48h}
                      onChange={(e) =>
                        setEpForm({ ...epForm, plays_48h: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label>Reproducciones 7d</Label>
                    <Input
                      type="number"
                      value={epForm.plays_7d}
                      onChange={(e) =>
                        setEpForm({ ...epForm, plays_7d: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label>Retencion (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={epForm.retention}
                      onChange={(e) =>
                        setEpForm({ ...epForm, retention: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label>Guardados</Label>
                    <Input
                      type="number"
                      value={epForm.saves}
                      onChange={(e) =>
                        setEpForm({ ...epForm, saves: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label>Compartidos</Label>
                    <Input
                      type="number"
                      value={epForm.shares}
                      onChange={(e) =>
                        setEpForm({ ...epForm, shares: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label>DMs generados</Label>
                    <Input
                      type="number"
                      value={epForm.dms}
                      onChange={(e) => setEpForm({ ...epForm, dms: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Conversiones</Label>
                    <Input
                      type="number"
                      value={epForm.conversions}
                      onChange={(e) =>
                        setEpForm({ ...epForm, conversions: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Insight del episodio</Label>
                  <Textarea
                    value={epForm.insight || ''}
                    onChange={(e) => setEpForm({ ...epForm, insight: e.target.value })}
                    rows={2}
                    placeholder="Que aprendiste de este episodio"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setEpDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {/* Dialog: metrica mensual */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Registrar metrica
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar metrica mensual</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Mes *</Label>
                    <Input
                      type="month"
                      value={form.month}
                      onChange={(e) => setForm({ ...form, month: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Plataforma *</Label>
                    <Input
                      value={form.platform}
                      onChange={(e) => setForm({ ...form, platform: e.target.value })}
                      placeholder="Spotify"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Alcance</Label>
                    <Input
                      type="number"
                      value={form.reach}
                      onChange={(e) => setForm({ ...form, reach: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Reproducciones</Label>
                    <Input
                      type="number"
                      value={form.plays}
                      onChange={(e) => setForm({ ...form, plays: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>DMs</Label>
                    <Input
                      type="number"
                      value={form.dms}
                      onChange={(e) => setForm({ ...form, dms: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Conversiones</Label>
                    <Input
                      type="number"
                      value={form.conversions}
                      onChange={(e) =>
                        setForm({ ...form, conversions: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Ingresos (USD)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.revenue}
                    onChange={(e) => setForm({ ...form, revenue: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Insight</Label>
                  <Input
                    value={form.insight}
                    onChange={(e) => setForm({ ...form, insight: e.target.value })}
                    placeholder="Que aprendiste este mes"
                  />
                </div>
                <div>
                  <Label>Accion siguiente</Label>
                  <Input
                    value={form.action}
                    onChange={(e) => setForm({ ...form, action: e.target.value })}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="decisiones">
        <TabsList className="mb-6">
          <TabsTrigger value="decisiones">Centro de Decisiones</TabsTrigger>
          <TabsTrigger value="mensual">Metricas Mensuales</TabsTrigger>
          <TabsTrigger value="episodios">Por Episodio</TabsTrigger>
          <TabsTrigger value="reportes">Reportes IA</TabsTrigger>
        </TabsList>

        {/* ======== TAB: CENTRO DE DECISIONES ======== */}
        <TabsContent value="decisiones">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {/* 1. EPISODIOS PENDIENTES DE MEDIR */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-base">Pendientes de medir</CardTitle>
                  </div>
                  <CardDescription>
                    Episodios publicados o distribuidos sin metrica registrada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingToMeasure.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Todos los episodios publicados tienen metrica registrada
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pendingToMeasure.map((ep) => (
                        <div
                          key={ep.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              #{ep.episode_number}: {ep.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Estado: {ep.status}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0"
                            onClick={() => {
                              resetEpForm(ep.id);
                              setEpDialogOpen(true);
                            }}
                          >
                            <BarChart2 className="h-3.5 w-3.5 mr-1" />
                            Medir
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 2. MEJOR RENDIMIENTO */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#0c1f36]" />
                      <CardTitle className="text-base">Mejor mes registrado</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!bestMonth ? (
                      <p className="text-sm text-muted-foreground">
                        Sin datos mensuales. Registra tu primera metrica.
                      </p>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-semibold">
                          {bestMonth.platform} — {bestMonth.month}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bestMonth.plays.toLocaleString()} reproducciones · {bestMonth.dms} DMs
                        </p>
                        {bestMonth.insight && (
                          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                            {bestMonth.insight}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Repeat2 className="h-5 w-5 text-[#0c1f36]" />
                      <CardTitle className="text-base">Episodio con mejor respuesta</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!bestEpisode ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Sin metricas por episodio todavia.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            resetEpForm();
                            setEpDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Medir un episodio
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {bestEpisodeData && (
                          <p className="font-semibold">
                            #{bestEpisodeData.episode_number}: {bestEpisodeData.title}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {bestEpisode.plays_7d.toLocaleString()} plays 7d · {bestEpisode.dms} DMs ·{' '}
                          {bestEpisode.saves} guardados
                        </p>
                        {bestEpisode.insight && (
                          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                            {bestEpisode.insight}
                          </p>
                        )}
                        <p className="text-xs font-medium text-[#0c1f36] mt-2">
                          Considera repetir el angulo o formato de este episodio
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 3. RECOMENDACION IA ACTIVA */}
              {latestReport && (
                <Card className="border-[#e8ff40] bg-[#e8ff40]/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      <CardTitle className="text-base">
                        Recomendacion activa — {latestReport.month}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                        Proximos 7 dias
                      </p>
                      <p className="text-sm font-medium">{latestReport.recommendation_7d}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                        Hipotesis proximo episodio
                      </p>
                      <p className="text-sm">{latestReport.next_episode_hypothesis}</p>
                    </div>
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .querySelector('[data-value="reportes"]')
                          ?.dispatchEvent(new MouseEvent('click'));
                      }}
                      className="text-xs text-[#0c1f36] underline"
                    >
                      Ver reporte completo
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* 4. NOTAS DE DECISION EDITORIAL */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-[#0c1f36]" />
                    <CardTitle className="text-base">Cuaderno de decisiones</CardTitle>
                  </div>
                  <CardDescription>
                    Aprendizaje de la semana, experimento siguiente y proxima accion editorial
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Aprendizaje de la semana
                    </Label>
                    <Textarea
                      className="mt-1.5"
                      rows={2}
                      placeholder="Que aprendiste esta semana sobre tu audiencia o contenido"
                      value={decisionNotes.weekly_learning}
                      onChange={(e) =>
                        setDecisionNotes({ ...decisionNotes, weekly_learning: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Proximo experimento editorial
                    </Label>
                    <Textarea
                      className="mt-1.5"
                      rows={2}
                      placeholder="Que vas a probar diferente en el proximo episodio o pieza"
                      value={decisionNotes.next_experiment}
                      onChange={(e) =>
                        setDecisionNotes({ ...decisionNotes, next_experiment: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Siguiente decision editorial
                    </Label>
                    <Textarea
                      className="mt-1.5"
                      rows={2}
                      placeholder="La accion concreta que tomas ahora"
                      value={decisionNotes.next_decision}
                      onChange={(e) =>
                        setDecisionNotes({ ...decisionNotes, next_decision: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    {decisionNotes.updated_at && (
                      <p className="text-xs text-muted-foreground">
                        Guardado: {new Date(decisionNotes.updated_at).toLocaleDateString('es-MX')}
                      </p>
                    )}
                    <Button size="sm" onClick={saveDecisionNotes} disabled={savingNotes}>
                      {savingNotes ? 'Guardando...' : 'Guardar notas'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 5. ACCESOS RAPIDOS */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/episodios"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Ver episodios <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/calendario"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Ver calendario <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/monetizacion"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Ver leads <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ======== TAB: METRICAS MENSUALES ======== */}
        <TabsContent value="mensual">
          {loading ? (
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-72 rounded-xl" />
            </div>
          ) : metrics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Sin metricas mensuales registradas</p>
                <Button
                  className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar primera metrica
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {chartData.length >= 2 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Evolución mensual</CardTitle>
                    <CardDescription>Reproducciones y alcance por mes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[220px] w-full">
                      <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(v) => v.slice(5)}
                        />
                        <YAxis tickLine={false} axisLine={false} width={40} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="plays" fill="var(--color-plays)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="reach" fill="var(--color-reach)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}
              {metrics.map((m) => {
                const kpis = calcKPIs(m);
                return (
                  <Card key={m.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>
                            {m.platform} — {m.month}
                          </CardTitle>
                          <CardDescription>
                            {m.plays.toLocaleString()} reproducciones · {m.reach.toLocaleString()}{' '}
                            alcance
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateReport(m)}
                          disabled={generating}
                        >
                          <Sparkles className="h-4 w-4 mr-1" />
                          {generating ? 'Generando...' : 'Reporte IA'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                          <p className="text-2xl font-semibold">{kpis.engagementRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Conv. Rate</p>
                          <p className="text-2xl font-semibold">{kpis.conversionRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Plays a DM</p>
                          <p className="text-2xl font-semibold">{kpis.playsToDM}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">DMs</p>
                          <p className="text-2xl font-semibold">{m.dms}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Ingresos</p>
                          <p className="text-2xl font-semibold text-[#0c1f36]">
                            ${m.revenue.toFixed(0)}
                          </p>
                        </div>
                      </div>
                      {m.insight && (
                        <p className="mt-3 text-sm border-t pt-3 text-muted-foreground">
                          <span className="font-medium text-foreground">Insight: </span>
                          {m.insight}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ======== TAB: METRICAS POR EPISODIO ======== */}
        <TabsContent value="episodios">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Metricas individuales por episodio</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  resetEpForm();
                  setEpDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Medir episodio
              </Button>
            </div>
            {loading ? (
              <div className="grid gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </div>
            ) : metricsEpisode.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BarChart2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Sin metricas de episodio todavia</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registra los datos de reproducciones, DMs y conversiones por episodio
                  </p>
                  <Button
                    className="mt-4 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]"
                    onClick={() => {
                      resetEpForm();
                      setEpDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Medir primer episodio
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {metricsEpisode.map((m) => {
                  const ep = episodes.find((e) => e.id === m.episode_id);
                  return (
                    <Card key={m.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          {ep ? `#${ep.episode_number}: ${ep.title}` : 'Episodio'}
                        </CardTitle>
                        <CardDescription>
                          {new Date(m.created_at).toLocaleDateString('es-MX')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Plays 48h</p>
                            <p className="text-xl font-semibold">{m.plays_48h.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Plays 7d</p>
                            <p className="text-xl font-semibold">{m.plays_7d.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Retencion</p>
                            <p className="text-xl font-semibold">{m.retention}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">DMs</p>
                            <p className="text-xl font-semibold">{m.dms}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Guardados</p>
                            <p className="text-xl font-semibold">{m.saves}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Compartidos</p>
                            <p className="text-xl font-semibold">{m.shares}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Conversiones</p>
                            <p className="text-xl font-semibold">{m.conversions}</p>
                          </div>
                        </div>
                        {m.insight && (
                          <p className="mt-3 text-sm border-t pt-3 text-muted-foreground">
                            <span className="font-medium text-foreground">Insight: </span>
                            {m.insight}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ======== TAB: REPORTES IA ======== */}
        <TabsContent value="reportes">
          <div className="space-y-4">
            {reports.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Sin reportes generados</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    En Metricas Mensuales, haz clic en Reporte IA para generar un analisis
                  </p>
                </CardContent>
              </Card>
            ) : (
              reports.map((r) => (
                <Card key={r.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{r.month} — Reporte automatico</CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.generated_at).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-[#F5F2EA] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Diagnostico
                        </p>
                        <p className="text-sm">{r.diagnosis}</p>
                      </div>
                      <div className="rounded-xl bg-[#F5F2EA] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Patron de crecimiento
                        </p>
                        <p className="text-sm">{r.growth_pattern}</p>
                      </div>
                      <div className="rounded-xl bg-[#F5F2EA] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Mejor contenido
                        </p>
                        <p className="text-sm">{r.best_content}</p>
                      </div>
                      <div className="rounded-xl bg-red-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-1">
                          Alerta
                        </p>
                        <p className="text-sm">{r.alert}</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#e8ff40]/20 border border-[#e8ff40] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#0c1f36] mb-1">
                        Recomendacion 7 dias
                      </p>
                      <p className="text-sm font-medium">{r.recommendation_7d}</p>
                    </div>
                    <div className="rounded-xl bg-[#0c1f36] text-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                        Hipotesis proximo episodio
                      </p>
                      <p className="text-sm">{r.next_episode_hypothesis}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
