'use client';
import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/shadcn/dialog';
import { Plus, Download, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getMetricsMonthly, createMetricMonthly } from '@/lib/database';
import type { MetricMonthly } from '@/types/database';

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

export default function MetricasPage() {
  const [metrics, setMetrics] = useState<MetricMonthly[]>([]);
  const [reports, setReports] = useState<AIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const d = await getMetricsMonthly();
      setMetrics(d);
      // Cargar reportes guardados de localStorage (temporal hasta tener tabla ai_history)
      const saved = localStorage.getItem('amtme-metric-reports');
      if (saved) setReports(JSON.parse(saved));
    } catch {
      toast.error('Error al cargar métricas');
    } finally {
      setLoading(false);
    }
  }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.platform || !form.month) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    try {
      await createMetricMonthly(form);
      toast.success('Métrica registrada');
      setDialogOpen(false);
      resetForm();
      await load();
    } catch {
      toast.error('Error al guardar');
    }
  }

  async function generateReport(m: MetricMonthly) {
    setGenerating(true);
    const prev = metrics.find((x) => x.month < m.month && x.platform === m.platform);
    const prompt = `Analiza estas métricas del podcast AMTME (A Mí Tampoco Me Explicaron) para ${m.platform} en ${m.month}:
Reproducciones: ${m.plays} | Alcance: ${m.reach} | DMs: ${m.dms} | Conversiones: ${m.conversions} | Ingresos: $${m.revenue}
${prev ? `Mes anterior: ${prev.plays} reproducciones, $${prev.revenue} ingresos` : 'Sin datos del mes anterior.'}
Insight registrado: ${m.insight || 'ninguno'}

Genera un reporte ejecutivo en JSON con exactamente estos campos:
{
  "diagnosis": "diagnóstico del mes en 2-3 oraciones",
  "growth_pattern": "patrón de crecimiento detectado",
  "best_content": "qué tipo de contenido funcionó mejor y por qué",
  "alert": "caída o alerta principal si existe, o 'Sin alertas críticas'",
  "recommendation_7d": "recomendación concreta para los próximos 7 días",
  "next_episode_hypothesis": "hipótesis de tema para el próximo episodio basada en los datos"
}
Devuelve SOLO el JSON. Español neutro. Sin clichés.`;

    try {
      const res = await fetch('/api/ia/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'groq',
          prompt,
          systemPrompt:
            'Eres el analista de métricas de AMTME. Respondes en JSON válido únicamente, sin markdown.',
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
      localStorage.setItem('amtme-metric-reports', JSON.stringify(updated));
      toast.success(`Reporte generado para ${m.month}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al generar reporte');
    } finally {
      setGenerating(false);
    }
  }

  function calcKPIs(m: MetricMonthly) {
    return {
      engagementRate: m.reach > 0 ? ((m.engagement / m.reach) * 100).toFixed(2) : '0',
      conversionRate: m.dms > 0 ? ((m.conversions / m.dms) * 100).toFixed(2) : '0',
      playsToDM: m.plays > 0 ? ((m.dms / m.plays) * 100).toFixed(2) : '0',
    };
  }

  function exportCSV() {
    if (!metrics.length) {
      toast.error('Sin métricas para exportar');
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
          <h1 className="text-2xl md:text-3xl font-semibold">Métricas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registro mensual y reportes automáticos IA
          </p>
        </div>
        <div className="flex gap-2">
          {metrics.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="mr-1 h-4 w-4" />
              CSV
            </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Registrar métrica
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar métrica mensual</DialogTitle>
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
                    placeholder="Qué aprendiste este mes"
                  />
                </div>
                <div>
                  <Label>Acción siguiente</Label>
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

      <Tabs defaultValue="mensual">
        <TabsList className="mb-6">
          <TabsTrigger value="mensual">Métricas Mensuales</TabsTrigger>
          <TabsTrigger value="reportes">Reportes Automáticos IA</TabsTrigger>
        </TabsList>

        <TabsContent value="mensual">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Cargando...</div>
          ) : metrics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Sin métricas registradas</p>
                <Button
                  className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar primera métrica
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
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
                          {generating ? 'Generando...' : 'Generar reporte IA'}
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
                          <p className="text-xs text-muted-foreground">Plays→DM</p>
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

        <TabsContent value="reportes">
          <div className="space-y-4">
            {reports.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Sin reportes generados</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    En la pestaña Métricas Mensuales, haz clic en "Generar reporte IA" en cualquier
                    mes
                  </p>
                </CardContent>
              </Card>
            ) : (
              reports.map((r) => (
                <Card key={r.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{r.month} — Reporte automático</CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.generated_at).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-[#F5F2EA] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Diagnóstico
                        </p>
                        <p className="text-sm">{r.diagnosis}</p>
                      </div>
                      <div className="rounded-xl bg-[#F5F2EA] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Patrón de crecimiento
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
                        Recomendación 7 días
                      </p>
                      <p className="text-sm font-medium">{r.recommendation_7d}</p>
                    </div>
                    <div className="rounded-xl bg-[#0c1f36] text-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                        Hipótesis próximo episodio
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
