'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Badge } from '@/components/shadcn/badge';
import { Progress } from '@/components/shadcn/progress';
import { Alert, AlertDescription } from '@/components/shadcn/alert';
import { Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getEpisodes, updateEpisode } from '@/lib/database';
import type { Episode } from '@/types/database';

type FieldCheck = { label: string; ok: boolean; critical: boolean };

function analyzeEpisode(ep: Episode): {
  checks: FieldCheck[];
  pct: number;
  criticalFailed: number;
} {
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
  ];
  const passed = checks.filter((c) => c.ok).length;
  const criticalFailed = checks.filter((c) => !c.ok && c.critical).length;
  return { checks, pct: Math.round((passed / checks.length) * 100), criticalFailed };
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

Devuelve SOLO el JSON, sin markdown ni explicaciones.`;

  const res = await fetch('/api/ia/generar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'groq',
      prompt,
      systemPrompt:
        'Eres el asistente operativo de AMTME. Generas contenido en español neutro latinoamericano, tono íntimo y sobrio. Sin clichés de autoayuda. Devuelve SOLO JSON válido.',
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.result) throw new Error(data.error || 'Error al generar');

  try {
    const clean = data.result.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    throw new Error('La IA no devolvió JSON válido');
  }
}

export default function RevisionEpisodiosPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getEpisodes();
      setEpisodes(data);
    } catch {
      toast.error('Error al cargar episodios');
    } finally {
      setLoading(false);
    }
  }

  const analyses = useMemo(
    () => episodes.map((ep) => ({ ep, ...analyzeEpisode(ep) })).sort((a, b) => a.pct - b.pct),
    [episodes]
  );

  const incomplete = analyses.filter((a) => a.pct < 100);
  const critical = analyses.filter((a) => a.criticalFailed > 0);

  async function handleComplete(ep: Episode) {
    setCompleting(ep.id);
    try {
      const updates = await completeEpisodeWithAI(ep);
      const updated = await updateEpisode(ep.id, updates);
      setEpisodes((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      toast.success(`EP ${ep.episode_number} completado con IA`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al completar');
    } finally {
      setCompleting(null);
    }
  }

  async function handleBatch() {
    const pending = incomplete.filter((a) => a.pct < 80);
    if (!pending.length) {
      toast.info('No hay episodios críticos pendientes');
      return;
    }
    setBatchRunning(true);
    let completed = 0;
    for (const { ep } of pending.slice(0, 10)) {
      try {
        const updates = await completeEpisodeWithAI(ep);
        const updated = await updateEpisode(ep.id, updates);
        setEpisodes((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        completed++;
        toast.success(
          `EP ${ep.episode_number} completado (${completed}/${Math.min(pending.length, 10)})`
        );
        await new Promise((r) => setTimeout(r, 1500));
      } catch {
        toast.error(`Error en EP ${ep.episode_number}, continuando...`);
      }
    }
    setBatchRunning(false);
    toast.success(`Batch completado: ${completed} episodios actualizados`);
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Revisión de Episodios
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Motor de auditoría y completitud con IA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>
          {incomplete.length > 0 && (
            <Button
              onClick={handleBatch}
              disabled={batchRunning}
              className="bg-amtme-yellow text-amtme-navy hover:bg-amtme-yellow/90 font-semibold"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {batchRunning
                ? 'Completando...'
                : `Completar pendientes con IA (${Math.min(incomplete.filter((a) => a.pct < 80).length, 10)})`}
            </Button>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-bold">{analyses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Incompletos</p>
            <p className="text-3xl font-bold text-yellow-600">{incomplete.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Errores críticos</p>
            <p className="text-3xl font-bold text-red-600">{critical.length}</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando episodios...</div>
      ) : analyses.length === 0 ? (
        <Alert>
          <AlertDescription>
            No hay episodios. Crea episodios en /episodios primero.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {analyses.map(({ ep, checks, pct, criticalFailed }) => (
            <Card key={ep.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">EP {ep.episode_number}</span>
                      {criticalFailed > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {criticalFailed} críticos
                        </Badge>
                      ) : pct === 100 ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">Completo</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {pct}%
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold text-foreground truncate">{ep.title}</p>
                    <div className="mt-2">
                      <Progress value={pct} className="h-1.5" />
                    </div>
                    {checks.some((c) => !c.ok) && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {checks
                          .filter((c) => !c.ok)
                          .map((c) => (
                            <span
                              key={c.label}
                              className={`text-xs px-2 py-0.5 rounded-full ${c.critical ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}
                            >
                              {c.critical ? '✕' : '△'} {c.label}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-2xl font-bold">{pct}%</span>
                    {pct < 100 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplete(ep)}
                        disabled={completing === ep.id || batchRunning}
                        className="text-xs"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {completing === ep.id ? 'Generando...' : 'Completar con IA'}
                      </Button>
                    )}
                    {pct === 100 && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
