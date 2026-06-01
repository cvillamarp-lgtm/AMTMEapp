<<<<<<< HEAD
'use client';

import { useMemo } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { joinClasses } from '@/lib/studio-utils';

type FieldCheck = { label: string; ok: boolean; critical: boolean };

function analyzeEpisode(ep: ReturnType<typeof useStudio>['state']['episodes'][0]) {
  const checks: FieldCheck[] = [
    { label: 'Título', ok: !!ep.title?.trim(), critical: true },
    { label: 'Número', ok: !!ep.episodeNumber, critical: true },
    { label: 'Pilar', ok: !!ep.pillar?.trim(), critical: true },
    { label: 'CTA', ok: !!ep.cta?.trim(), critical: false },
    { label: 'Descripción Spotify', ok: !!ep.spotifyDescription?.trim(), critical: false },
    { label: 'Descripción Apple', ok: !!ep.appleDescription?.trim(), critical: false },
    { label: 'Fecha de publicación', ok: !!ep.publishDate, critical: false },
  ];
  const total = checks.length;
  const passed = checks.filter((c) => c.ok).length;
  const criticalFailed = checks.filter((c) => !c.ok && c.critical).length;
  return { checks, pct: Math.round((passed / total) * 100), criticalFailed, warnings: checks.filter((c) => !c.ok && !c.critical).length };
}

export default function RevisionEpisodiosPage() {
  const { state } = useStudio();

  const analyses = useMemo(
    () => state.episodes.map((ep) => ({ ep, ...analyzeEpisode(ep) })),
    [state.episodes]
  );

  const incomplete = analyses.filter((a) => a.pct < 100);
  const critical = analyses.filter((a) => a.criticalFailed > 0);
  const complete = analyses.filter((a) => a.pct === 100);

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/40">
            Control de calidad
          </div>
          <h1 className="mt-1 text-[28px] font-bold tracking-[-0.03em] text-[#0C1F36]">
            Revisión de Episodios
          </h1>
          <p className="mt-1 text-[13px] text-[#6B7B8C]">
            Detecta campos faltantes y alertas de completitud.
          </p>
=======
'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Progress } from '@/components/shadcn/progress'
import { Alert, AlertDescription } from '@/components/shadcn/alert'
import { Sparkles, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { getEpisodes, updateEpisode } from '@/lib/database'
import type { Episode } from '@/types/database'

type FieldCheck = { label: string; ok: boolean; critical: boolean }

function analyzeEpisode(ep: Episode): { checks: FieldCheck[]; pct: number; criticalFailed: number } {
  const checks: FieldCheck[] = [
    { label: 'Título', ok: !!ep.title?.trim(), critical: true },
    { label: 'Número', ok: !!ep.episode_number?.trim(), critical: true },
    { label: 'Herida emocional', ok: !!ep.emotional_wound?.trim(), critical: true },
    { label: 'Símbolo central', ok: !!ep.central_symbol?.trim(), critical: true },
    { label: 'Tema', ok: !!ep.theme?.trim(), critical: true },
    { label: 'CTA', ok: !!ep.cta?.trim(), critical: false },
    { label: 'Descripción Spotify', ok: !!ep.spotify_description?.trim(), critical: false },
    { label: 'Descripción Apple', ok: !!ep.apple_description?.trim(), critical: false },
    { label: 'Estructura narrativa', ok: !!ep.narrative_structure, critical: false },
    { label: 'Fecha publicación', ok: !!ep.publish_date, critical: false },
  ]
  const passed = checks.filter(c => c.ok).length
  const criticalFailed = checks.filter(c => !c.ok && c.critical).length
  return { checks, pct: Math.round((passed / checks.length) * 100), criticalFailed }
}

async function completeEpisodeWithAI(ep: Episode): Promise<Partial<Episode>> {
  const prompt = `Episodio del podcast AMTME (A Mí Tampoco Me Explicaron).
Título: ${ep.title}
Tema: ${ep.theme}
Herida emocional: ${ep.emotional_wound || 'no definida'}
Símbolo: ${ep.central_symbol || 'no definido'}

Genera en JSON exactamente estos campos que faltan (omite los que ya tienen valor):
- spotify_description: descripción de 150-200 palabras para Spotify, tono íntimo y sobrio, sin autoayuda
- apple_description: descripción de 100-150 palabras para Apple Podcasts
- cta: una sola frase de cierre-acción, no imperativa, en primera persona del oyente
- narrative_structure: objeto con claves A,Z,T,I,Y,A2,R,T2,E (bloques AZTIYARTE, 1-2 oraciones cada uno)

Devuelve SOLO el JSON, sin markdown ni explicaciones.`

  const res = await fetch('/api/ia/generar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'groq', prompt, systemPrompt: 'Eres el asistente operativo de AMTME. Generas contenido en español neutro latinoamericano, tono íntimo y sobrio. Sin clichés de autoayuda. Devuelve SOLO JSON válido.' })
  })
  const data = await res.json()
  if (!res.ok || !data.result) throw new Error(data.error || 'Error al generar')

  try {
    const clean = data.result.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    throw new Error('La IA no devolvió JSON válido')
  }
}

export default function RevisionEpisodiosPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)
  const [batchRunning, setBatchRunning] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const data = await getEpisodes()
      setEpisodes(data)
    } catch { toast.error('Error al cargar episodios') }
    finally { setLoading(false) }
  }

  const analyses = useMemo(() =>
    episodes.map(ep => ({ ep, ...analyzeEpisode(ep) }))
      .sort((a, b) => a.pct - b.pct),
    [episodes]
  )

  const incomplete = analyses.filter(a => a.pct < 100)
  const critical = analyses.filter(a => a.criticalFailed > 0)
  const complete = analyses.filter(a => a.pct === 100)

  async function handleComplete(ep: Episode) {
    setCompleting(ep.id)
    try {
      const updates = await completeEpisodeWithAI(ep)
      const updated = await updateEpisode(ep.id, updates)
      setEpisodes(prev => prev.map(e => e.id === updated.id ? updated : e))
      toast.success(`EP ${ep.episode_number} completado con IA`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al completar')
    } finally {
      setCompleting(null)
    }
  }

  async function handleBatch() {
    const pending = incomplete.filter(a => a.pct < 80)
    if (!pending.length) { toast.info('No hay episodios críticos pendientes'); return }
    setBatchRunning(true)
    let completed = 0
    for (const { ep } of pending.slice(0, 10)) {
      try {
        const updates = await completeEpisodeWithAI(ep)
        const updated = await updateEpisode(ep.id, updates)
        setEpisodes(prev => prev.map(e => e.id === updated.id ? updated : e))
        completed++
        toast.success(`EP ${ep.episode_number} completado (${completed}/${Math.min(pending.length, 10)})`)
        await new Promise(r => setTimeout(r, 1500))
      } catch {
        toast.error(`Error en EP ${ep.episode_number}, continuando...`)
      }
    }
    setBatchRunning(false)
    toast.success(`Batch completado: ${completed} episodios actualizados`)
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Revisión de Episodios</h1>
          <p className="text-sm text-muted-foreground mt-1">Motor de auditoría y completitud con IA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4 mr-1" />Actualizar</Button>
          {incomplete.length > 0 && (
            <Button onClick={handleBatch} disabled={batchRunning} className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold">
              <Sparkles className="h-4 w-4 mr-2" />
              {batchRunning ? 'Completando...' : `Completar pendientes con IA (${Math.min(incomplete.filter(a => a.pct < 80).length, 10)})`}
            </Button>
          )}
>>>>>>> f04b222 (feat: revision-episodios+checklists+notas Supabase, metricas reportes IA, seeds maestro 25 secciones, 16 checklists)
        </div>
      </div>

      {/* KPIs */}
<<<<<<< HEAD
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: analyses.length, tone: 'neutral' as const },
          { label: 'Incompletos', value: incomplete.length, tone: 'warning' as const },
          { label: 'Errores críticos', value: critical.length, tone: 'danger' as const },
        ].map(({ label, value, tone }) => (
          <div key={label} className="rounded-[20px] border border-black/[0.07] bg-white p-5 shadow-[0_2px_8px_rgba(12,31,54,0.05)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C1F36]/40">{label}</div>
            <div className="mt-1 text-[32px] font-bold leading-none tracking-[-0.04em] text-[#0C1F36]">{value}</div>
            <div className="mt-2">
              <Badge tone={tone}>{tone === 'neutral' ? 'Total' : tone === 'warning' ? 'Atención' : 'Crítico'}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Lista */}
      {incomplete.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center py-10 text-center">
            <div className="text-4xl">✅</div>
            <p className="mt-3 text-[15px] font-semibold text-[#0C1F36]">Todos los episodios están completos</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {analyses.map(({ ep, checks, pct, criticalFailed, warnings }) => (
            <Card key={ep.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0C1F36]/35">
                    EP {ep.episodeNumber}
                  </div>
                  <div className="mt-0.5 text-[15px] font-bold text-[#0C1F36]">{ep.title}</div>
                  <div className="mt-1 flex gap-2">
                    {criticalFailed > 0 && <Badge tone="danger">{criticalFailed} críticos</Badge>}
                    {warnings > 0 && <Badge tone="warning">{warnings} advertencias</Badge>}
                    {pct === 100 && <Badge tone="good">Completo</Badge>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[28px] font-bold tracking-tight text-[#0C1F36]">{pct}%</div>
                  <div className="text-[11px] text-[#6B7B8C]">completitud</div>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]">
                <div
                  className={joinClasses(
                    'h-full rounded-full transition-all',
                    pct === 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-[#FEE94B]' : 'bg-[#E0211E]'
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Campos faltantes */}
              {checks.some((c) => !c.ok) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {checks
                    .filter((c) => !c.ok)
                    .map((c) => (
                      <div
                        key={c.label}
                        className={joinClasses(
                          'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-medium',
                          c.critical
                            ? 'bg-red-50 text-[#C0201E]'
                            : 'bg-[#FEE94B]/30 text-[#0C1F36]'
                        )}
                      >
                        <span>{c.critical ? '✕' : '△'}</span>
                        {c.label}
                      </div>
                    ))}
                </div>
              )}
=======
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Total</p><p className="text-3xl font-bold">{analyses.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Incompletos</p><p className="text-3xl font-bold text-yellow-600">{incomplete.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Errores críticos</p><p className="text-3xl font-bold text-red-600">{critical.length}</p></CardContent></Card>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando episodios...</div>
      ) : analyses.length === 0 ? (
        <Alert><AlertDescription>No hay episodios. Crea episodios en /episodios primero.</AlertDescription></Alert>
      ) : (
        <div className="space-y-3">
          {analyses.map(({ ep, checks, pct, criticalFailed }) => (
            <Card key={ep.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">EP {ep.episode_number}</span>
                      {criticalFailed > 0
                        ? <Badge variant="destructive" className="text-xs">{criticalFailed} críticos</Badge>
                        : pct === 100
                          ? <Badge className="bg-green-100 text-green-800 text-xs">Completo</Badge>
                          : <Badge variant="secondary" className="text-xs">{pct}%</Badge>
                      }
                    </div>
                    <p className="font-semibold text-foreground truncate">{ep.title}</p>
                    <div className="mt-2">
                      <Progress value={pct} className="h-1.5" />
                    </div>
                    {checks.some(c => !c.ok) && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {checks.filter(c => !c.ok).map(c => (
                          <span key={c.label} className={`text-xs px-2 py-0.5 rounded-full ${c.critical ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                            {c.critical ? '✕' : '△'} {c.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-2xl font-bold">{pct}%</span>
                    {pct < 100 && (
                      <Button size="sm" variant="outline" onClick={() => handleComplete(ep)} disabled={completing === ep.id || batchRunning} className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {completing === ep.id ? 'Generando...' : 'Completar con IA'}
                      </Button>
                    )}
                    {pct === 100 && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  </div>
                </div>
              </CardContent>
>>>>>>> f04b222 (feat: revision-episodios+checklists+notas Supabase, metricas reportes IA, seeds maestro 25 secciones, 16 checklists)
            </Card>
          ))}
        </div>
      )}
    </div>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> f04b222 (feat: revision-episodios+checklists+notas Supabase, metricas reportes IA, seeds maestro 25 secciones, 16 checklists)
}
