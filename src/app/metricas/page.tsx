'use client'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/shadcn/dialog'
import { Plus, Download } from 'lucide-react'
import { toast } from 'sonner'
import { getMetricsMonthly, createMetricMonthly } from '@/lib/database'
import type { MetricMonthly } from '@/types/database'

export default function MetricasPage() {
  const [metrics, setMetrics] = useState<MetricMonthly[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ month: new Date().toISOString().slice(0,7), platform: '', reach: 0, plays: 0, downloads: 0, engagement: 0, profile_visits: 0, link_clicks: 0, dms: 0, conversions: 0, revenue: 0, insight: '', action: '' })

  useEffect(() => { load() }, [])
  async function load() {
    try { const d = await getMetricsMonthly(); setMetrics(d) } catch { toast.error('Error al cargar métricas') } finally { setLoading(false) }
  }
  function resetForm() { setForm({ month: new Date().toISOString().slice(0,7), platform: '', reach: 0, plays: 0, downloads: 0, engagement: 0, profile_visits: 0, link_clicks: 0, dms: 0, conversions: 0, revenue: 0, insight: '', action: '' }) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.platform || !form.month) { toast.error('Completa los campos obligatorios'); return }
    try {
      await createMetricMonthly(form)
      toast.success('Métrica registrada')
      setDialogOpen(false); resetForm(); await load()
    } catch { toast.error('Error al guardar') }
  }

  function calcKPIs(m: MetricMonthly) {
    return {
      engagementRate: m.reach > 0 ? ((m.engagement / m.reach) * 100).toFixed(2) : '0',
      conversionRate: m.dms > 0 ? ((m.conversions / m.dms) * 100).toFixed(2) : '0',
      playsToDM: m.plays > 0 ? ((m.dms / m.plays) * 100).toFixed(2) : '0',
    }
  }

  function exportCSV() {
    if (!metrics.length) { toast.error('Sin métricas para exportar'); return }
    const headers = 'mes,plataforma,reproducciones,alcance,dms,conversiones,ingresos\n'
    const rows = metrics.map(m => `${m.month},${m.platform},${m.plays},${m.reach},${m.dms},${m.conversions},${m.revenue}`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'amtme-metricas.csv'; a.click()
    toast.success('CSV exportado')
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl md:text-3xl font-semibold">Métricas</h1><p className="text-sm text-muted-foreground mt-1">Registro y análisis mensual</p></div>
        <div className="flex gap-2">
          {metrics.length > 0 && <Button variant="secondary" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />CSV</Button>}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button onClick={resetForm} className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"><Plus className="mr-2 h-4 w-4" />Registrar métrica</Button></DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Registrar métrica mensual</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Mes *</Label><Input type="month" value={form.month} onChange={e => setForm({...form, month: e.target.value})} /></div>
                  <div><Label>Plataforma *</Label><Input value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} placeholder="Spotify" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Alcance</Label><Input type="number" value={form.reach} onChange={e => setForm({...form, reach: parseInt(e.target.value)||0})} /></div>
                  <div><Label>Reproducciones</Label><Input type="number" value={form.plays} onChange={e => setForm({...form, plays: parseInt(e.target.value)||0})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>DMs</Label><Input type="number" value={form.dms} onChange={e => setForm({...form, dms: parseInt(e.target.value)||0})} /></div>
                  <div><Label>Conversiones</Label><Input type="number" value={form.conversions} onChange={e => setForm({...form, conversions: parseInt(e.target.value)||0})} /></div>
                </div>
                <div><Label>Ingresos</Label><Input type="number" step="0.01" value={form.revenue} onChange={e => setForm({...form, revenue: parseFloat(e.target.value)||0})} /></div>
                <div><Label>Insight</Label><Input value={form.insight} onChange={e => setForm({...form, insight: e.target.value})} /></div>
                <div><Label>Acción siguiente</Label><Input value={form.action} onChange={e => setForm({...form, action: e.target.value})} /></div>
                <DialogFooter><Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancelar</Button><Button type="submit">Guardar</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? <div className="text-center py-12 text-muted-foreground">Cargando...</div> : metrics.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground mb-4">Sin métricas registradas</p><Button className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]" onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Registrar primera métrica</Button></CardContent></Card>
      ) : (
        <div className="grid gap-6">
          {metrics.map(m => {
            const kpis = calcKPIs(m)
            return (
              <Card key={m.id}>
                <CardHeader>
                  <CardTitle>{m.platform} — {m.month}</CardTitle>
                  <CardDescription>{m.plays.toLocaleString()} reproducciones · {m.reach.toLocaleString()} alcance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div><p className="text-sm text-muted-foreground">Engagement</p><p className="text-2xl font-semibold">{kpis.engagementRate}%</p></div>
                    <div><p className="text-sm text-muted-foreground">Conv. Rate</p><p className="text-2xl font-semibold">{kpis.conversionRate}%</p></div>
                    <div><p className="text-sm text-muted-foreground">Plays→DM</p><p className="text-2xl font-semibold">{kpis.playsToDM}%</p></div>
                    <div><p className="text-sm text-muted-foreground">DMs</p><p className="text-2xl font-semibold">{m.dms}</p></div>
                    <div><p className="text-sm text-muted-foreground">Ingresos</p><p className="text-2xl font-semibold text-[#0c1f36]">${m.revenue.toFixed(0)}</p></div>
                  </div>
                  {m.insight && <p className="mt-4 text-sm text-muted-foreground border-t pt-3"><span className="font-medium text-foreground">Insight: </span>{m.insight}</p>}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
