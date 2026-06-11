'use client';

import { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Sparkles,
  Check,
  X,
  Copy,
  RefreshCw,
  Loader2,
  FileText,
  Layers,
  CheckSquare,
  DollarSign,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import {
  getEpisodeById,
  getScriptsByEpisode,
  getContentPiecesByEpisode,
  getChecklistsByEpisode,
  getLeadsByEpisode,
  getSpotifyMetricsByEpisode,
  updateEpisode,
} from '@/lib/database';
import type {
  Episode,
  Script,
  ContentPiece,
  Checklist,
  MonetizationLead,
  EpisodeStatus,
  SpotifyEpisodeMetric,
} from '@/types/database';

type TitleOptimizationOutput = {
  originalTitle: string;
  optimizedTitle: string;
  primaryKeyword: string;
  emotionalHook: string;
  reasoning: string;
  seoScore: number;
};

type OptimizerState = 'idle' | 'loading' | 'generated' | 'approved' | 'rejected';

const STATUS_COLORS: Record<string, string> = {
  publicado: 'bg-[#e8ff40] text-[#0c1f36]',
  grabacion: 'bg-blue-100 text-blue-800',
  edicion: 'bg-purple-100 text-purple-800',
  guion: 'bg-yellow-100 text-yellow-800',
  idea: 'bg-gray-100 text-gray-700',
  investigacion: 'bg-orange-100 text-orange-800',
  distribuido: 'bg-green-100 text-green-800',
  medido: 'bg-teal-100 text-teal-800',
  archivado: 'bg-gray-50 text-gray-400',
};

const PIPELINE: EpisodeStatus[] = [
  'idea',
  'investigacion',
  'guion',
  'grabacion',
  'edicion',
  'publicado',
  'distribuido',
  'medido',
];

function TitleOptimizer({
  episode,
  onUpdate,
}: {
  episode: Episode;
  onUpdate: (updates: Partial<Episode>) => void;
}) {
  const initialState: OptimizerState =
    episode.title_optimization_status === 'approved'
      ? 'approved'
      : episode.title_optimization_status === 'rejected'
        ? 'rejected'
        : episode.title_optimization_status === 'generated' && episode.ai_optimized_title
          ? 'generated'
          : 'idle';

  const [state, setState] = useState<OptimizerState>(initialState);
  const [result, setResult] = useState<TitleOptimizationOutput | null>(
    initialState === 'generated' && episode.ai_optimized_title
      ? {
          originalTitle: episode.original_title || episode.title,
          optimizedTitle: episode.ai_optimized_title,
          primaryKeyword: '',
          emotionalHook: '',
          reasoning: '',
          seoScore: 0,
        }
      : null
  );

  const optimize = useCallback(async () => {
    setState('loading');
    try {
      const res = await fetch('/api/ia/title-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTitle: episode.title,
          episodeDescription: episode.spotify_description || undefined,
          episodeTheme: episode.theme,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al optimizar');
      }
      const data: TitleOptimizationOutput = await res.json();
      setResult(data);
      setState('generated');
      await updateEpisode(episode.id, {
        original_title: episode.title,
        ai_optimized_title: data.optimizedTitle,
        title_optimization_status: 'generated',
        title_optimization_source: 'ai',
      });
      onUpdate({
        original_title: episode.title,
        ai_optimized_title: data.optimizedTitle,
        title_optimization_status: 'generated',
      });
    } catch (e) {
      setState('idle');
      toast.error(e instanceof Error ? e.message : 'Error al optimizar el título');
    }
  }, [episode, onUpdate]);

  const handleAccept = useCallback(async () => {
    if (!result) return;
    try {
      await updateEpisode(episode.id, {
        title: result.optimizedTitle,
        title_optimization_status: 'approved',
        title_optimized_at: new Date().toISOString(),
      });
      setState('approved');
      onUpdate({ title: result.optimizedTitle, title_optimization_status: 'approved' });
      toast.success('Título actualizado');
    } catch {
      toast.error('Error al guardar el título');
    }
  }, [episode.id, result, onUpdate]);

  const handleReject = useCallback(async () => {
    try {
      await updateEpisode(episode.id, { title_optimization_status: 'rejected' });
      setState('rejected');
      onUpdate({ title_optimization_status: 'rejected' });
      toast('Sugerencia rechazada');
    } catch {
      toast.error('Error al guardar');
    }
  }, [episode.id, onUpdate]);

  const handleRegenerate = useCallback(() => {
    setResult(null);
    optimize();
  }, [optimize]);

  const handleCopy = useCallback(() => {
    if (result?.optimizedTitle) {
      navigator.clipboard.writeText(result.optimizedTitle);
      toast.success('Copiado al portapapeles');
    }
  }, [result]);

  if (state === 'approved') {
    return (
      <div className="rounded-xl border border-[#e8ff40] bg-[#e8ff40]/10 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-[#0c1f36]">
          <Check className="h-4 w-4" />
          Título optimizado con IA
        </div>
        {episode.original_title && (
          <p className="mt-1 text-xs text-muted-foreground line-through">
            {episode.original_title}
          </p>
        )}
        <p className="mt-1 text-sm font-semibold">{episode.title}</p>
        <button
          onClick={() => setState('idle')}
          className="mt-2 text-xs text-muted-foreground hover:underline"
        >
          Volver a optimizar
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Optimización de título con IA</p>
          <p className="text-xs text-muted-foreground">
            Fórmula: [Keyword] + [Beneficio/Dolor] + [Gancho emocional]
          </p>
        </div>
        {state === 'rejected' && (
          <span className="text-xs text-red-500 font-medium shrink-0">Rechazado</span>
        )}
      </div>

      <div className="text-sm bg-muted/50 rounded-lg p-3">
        <span className="text-muted-foreground text-xs block mb-1">Título actual</span>
        <span className="font-medium">{episode.title}</span>
      </div>

      {(state === 'idle' || state === 'rejected') && (
        <Button
          size="sm"
          className="bg-[#0c1f36] text-white hover:bg-[#0c1f36]/90 w-full"
          onClick={optimize}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Mejorar título con IA
        </Button>
      )}

      {state === 'loading' && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-3">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analizando y optimizando...
        </div>
      )}

      {state === 'generated' && result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3 bg-background">
              <p className="text-xs text-muted-foreground mb-1">Título anterior</p>
              <p className="text-sm">{result.originalTitle}</p>
            </div>
            <div className="rounded-lg border-2 border-[#e8ff40] p-3 bg-[#e8ff40]/5">
              <p className="text-xs font-medium text-[#0c1f36] mb-1">Título optimizado</p>
              <p className="text-sm font-semibold">{result.optimizedTitle}</p>
            </div>
          </div>

          {(result.primaryKeyword || result.emotionalHook || result.seoScore > 0) && (
            <div className="text-xs text-muted-foreground space-y-1 border rounded-lg p-3 bg-muted/30">
              {result.primaryKeyword && (
                <div>
                  <span className="font-medium">Keyword:</span> {result.primaryKeyword}
                </div>
              )}
              {result.emotionalHook && (
                <div>
                  <span className="font-medium">Gancho:</span> {result.emotionalHook}
                </div>
              )}
              {result.seoScore > 0 && (
                <div>
                  <span className="font-medium">SEO Score:</span> {result.seoScore}/10
                </div>
              )}
              {result.reasoning && (
                <div className="pt-1 border-t">
                  <span className="font-medium">Razonamiento:</span> {result.reasoning}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] flex-1"
              onClick={handleAccept}
            >
              <Check className="h-4 w-4 mr-1" />
              Aceptar
            </Button>
            <Button size="sm" variant="outline" onClick={handleRegenerate}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Regenerar
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleReject}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface EpisodePageProps {
  params: Promise<{ episodeId: string }>;
}

export default function EpisodePage({ params }: EpisodePageProps) {
  const { episodeId } = use(params);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [content, setContent] = useState<ContentPiece[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [leads, setLeads] = useState<MonetizationLead[]>([]);
  const [spotifyMetrics, setSpotifyMetrics] = useState<SpotifyEpisodeMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      try {
        const [ep, sc, co, ch, le, sm] = await Promise.all([
          getEpisodeById(episodeId),
          getScriptsByEpisode(episodeId),
          getContentPiecesByEpisode(episodeId),
          getChecklistsByEpisode(episodeId),
          getLeadsByEpisode(episodeId),
          getSpotifyMetricsByEpisode(episodeId),
        ]);
        setEpisode(ep);
        setScripts(sc);
        setContent(co);
        setChecklists(ch);
        setLeads(le);
        setSpotifyMetrics(sm);
      } catch {
        toast.error('Error al cargar el episodio');
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [episodeId]);

  const handleEpisodeUpdate = useCallback((updates: Partial<Episode>) => {
    setEpisode((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const advanceStatus = useCallback(async () => {
    if (!episode) return;
    const idx = PIPELINE.indexOf(episode.status);
    if (idx < 0 || idx >= PIPELINE.length - 1) return;
    const next = PIPELINE[idx + 1];
    try {
      await updateEpisode(episode.id, { status: next });
      setEpisode((prev) => (prev ? { ...prev, status: next } : prev));
      toast.success(`Estado actualizado: ${next}`);
    } catch {
      toast.error('Error al actualizar estado');
    }
  }, [episode]);

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-72" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto text-center py-16">
        <p className="text-muted-foreground">Episodio no encontrado</p>
        <Link href="/episodios" className="mt-4 inline-block text-sm underline">
          Volver a episodios
        </Link>
      </div>
    );
  }

  const pipelineIdx = PIPELINE.indexOf(episode.status);
  const canAdvance = pipelineIdx >= 0 && pipelineIdx < PIPELINE.length - 1;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-20 md:pb-8">
      <Link
        href="/episodios"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Episodios
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              #{episode.episode_number}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[episode.status] || 'bg-gray-100 text-gray-700'}`}
            >
              {episode.status}
            </span>
            {episode.title_optimization_status === 'approved' && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#e8ff40]/30 text-[#0c1f36]">
                IA optimizado
              </span>
            )}
            {episode.title_optimization_status === 'generated' && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700">
                Sugerencia IA
              </span>
            )}
          </div>
          <h1 className="text-xl md:text-2xl font-semibold leading-snug">{episode.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{episode.theme}</p>
        </div>
        {canAdvance && (
          <Button
            size="sm"
            className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-medium shrink-0"
            onClick={advanceStatus}
          >
            {PIPELINE[pipelineIdx + 1]}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Guiones', count: scripts.length },
          { label: 'Contenidos', count: content.length },
          { label: 'Checklists', count: checklists.length },
          { label: 'Leads', count: leads.length },
        ].map(({ label, count }) => (
          <div key={label} className="rounded-xl border p-3 text-center">
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="ficha">
        <TabsList className="mb-4 overflow-x-auto w-full justify-start h-auto flex-wrap gap-1 bg-transparent p-0">
          <TabsTrigger
            value="ficha"
            className="data-[state=active]:bg-[#0c1f36] data-[state=active]:text-white"
          >
            Ficha
          </TabsTrigger>
          <TabsTrigger
            value="guion"
            className="data-[state=active]:bg-[#0c1f36] data-[state=active]:text-white"
          >
            Guión {scripts.length > 0 ? `(${scripts.length})` : ''}
          </TabsTrigger>
          <TabsTrigger
            value="contenido"
            className="data-[state=active]:bg-[#0c1f36] data-[state=active]:text-white"
          >
            Contenido {content.length > 0 ? `(${content.length})` : ''}
          </TabsTrigger>
          <TabsTrigger
            value="checklists"
            className="data-[state=active]:bg-[#0c1f36] data-[state=active]:text-white"
          >
            Checklists {checklists.length > 0 ? `(${checklists.length})` : ''}
          </TabsTrigger>
          <TabsTrigger
            value="leads"
            className="data-[state=active]:bg-[#0c1f36] data-[state=active]:text-white"
          >
            Leads {leads.length > 0 ? `(${leads.length})` : ''}
          </TabsTrigger>
          <TabsTrigger
            value="spotify"
            className="data-[state=active]:bg-[#0c1f36] data-[state=active]:text-white"
          >
            Spotify {spotifyMetrics.length > 0 ? `(${spotifyMetrics.length})` : ''}
          </TabsTrigger>
        </TabsList>

        {/* FICHA */}
        <TabsContent value="ficha" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos del episodio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Herida emocional</span>
                  <p>{episode.emotional_wound}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Símbolo central</span>
                  <p>{episode.central_symbol}</p>
                </div>
                {episode.pillar && (
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Pilar</span>
                    <p>{episode.pillar}</p>
                  </div>
                )}
                {episode.objective && (
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Objetivo</span>
                    <p>{episode.objective}</p>
                  </div>
                )}
              </div>
              {episode.cta && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">CTA</span>
                  <p>{episode.cta}</p>
                </div>
              )}
              {episode.spotify_description && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">
                    Descripción Spotify
                  </span>
                  <p className="text-muted-foreground">{episode.spotify_description}</p>
                </div>
              )}
              {episode.notes && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Notas</span>
                  <p className="text-muted-foreground">{episode.notes}</p>
                </div>
              )}
              {episode.publish_date && (
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">
                    Fecha de publicación
                  </span>
                  <p>{episode.publish_date}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline de producción</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 flex-wrap">
                {PIPELINE.map((step, i) => {
                  const isDone = i < pipelineIdx;
                  const isCurrent = step === episode.status;
                  return (
                    <span
                      key={step}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isCurrent
                          ? 'bg-[#0c1f36] text-white'
                          : isDone
                            ? 'bg-[#e8ff40] text-[#0c1f36]'
                            : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step}
                    </span>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <TitleOptimizer episode={episode} onUpdate={handleEpisodeUpdate} />
        </TabsContent>

        {/* GUION */}
        <TabsContent value="guion" className="space-y-3">
          {scripts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-sm text-muted-foreground">Sin guiones para este episodio</p>
              <Link href="/guiones">
                <Button size="sm" className="mt-3 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]">
                  Ir a Guiones
                </Button>
              </Link>
            </div>
          ) : (
            scripts.map((s) => (
              <Card key={s.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{s.title}</CardTitle>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                      {s.status}
                    </span>
                  </div>
                  <CardDescription>Versión {s.version}</CardDescription>
                </CardHeader>
                {s.opening && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{s.opening}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        {/* CONTENIDO */}
        <TabsContent value="contenido" className="space-y-3">
          {content.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-sm text-muted-foreground">
                Sin piezas de contenido para este episodio
              </p>
              <Link href="/contenido">
                <Button size="sm" className="mt-3 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]">
                  Ir a Contenido
                </Button>
              </Link>
            </div>
          ) : (
            content.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-mono">
                        {c.channel}
                      </span>
                      <span className="text-xs text-muted-foreground">{c.format}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                      {c.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium line-clamp-2">{c.hook}</p>
                  {c.caption && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.caption}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* CHECKLISTS */}
        <TabsContent value="checklists" className="space-y-3">
          {checklists.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-sm text-muted-foreground">Sin checklists para este episodio</p>
              <Link href="/checklists">
                <Button size="sm" className="mt-3 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]">
                  Ir a Checklists
                </Button>
              </Link>
            </div>
          ) : (
            checklists.map((cl) => {
              const completed = cl.items.filter((item) => item.completed).length;
              const total = cl.items.length;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <Card key={cl.id}>
                  <CardHeader>
                    <CardTitle>{cl.name}</CardTitle>
                    <CardDescription>{cl.area}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#e8ff40] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {completed}/{total}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {cl.items.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center gap-2 text-xs">
                          <span
                            className={
                              item.completed ? 'text-[#0c1f36] font-bold' : 'text-muted-foreground'
                            }
                          >
                            {item.completed ? '✓' : '○'}
                          </span>
                          <span
                            className={item.completed ? 'line-through text-muted-foreground' : ''}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                      {cl.items.length > 4 && (
                        <p className="text-xs text-muted-foreground pl-4">
                          +{cl.items.length - 4} ítems más
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* LEADS */}
        <TabsContent value="leads" className="space-y-3">
          {leads.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-sm text-muted-foreground">Sin leads asociados a este episodio</p>
              <Link href="/monetizacion">
                <Button size="sm" className="mt-3 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]">
                  Ir a Monetización
                </Button>
              </Link>
            </div>
          ) : (
            leads.map((lead) => (
              <Card key={lead.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{lead.name}</CardTitle>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                      {lead.status}
                    </span>
                  </div>
                  <CardDescription>{lead.offer}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Valor potencial: ${lead.potential_value}</span>
                    <span>Probabilidad: {lead.close_probability}%</span>
                  </div>
                  {lead.next_action && (
                    <p className="text-xs mt-1">
                      <span className="font-medium">Siguiente acción:</span> {lead.next_action}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* SPOTIFY METRICS */}
        <TabsContent value="spotify" className="space-y-3">
          {spotifyMetrics.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
              <p className="text-sm text-muted-foreground">
                Sin métricas de Spotify importadas para este episodio
              </p>
              <Link href="/metricas/spotify">
                <Button size="sm" className="mt-3 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]">
                  Importar métricas de Spotify
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {/* KPIs agregados */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    label: 'Total plays',
                    value: spotifyMetrics.reduce((s, m) => s + (m.plays ?? 0), 0).toLocaleString(),
                  },
                  {
                    label: 'Oyentes únicos',
                    value: spotifyMetrics
                      .reduce((s, m) => s + (m.listeners ?? 0), 0)
                      .toLocaleString(),
                  },
                  {
                    label: 'Retención prom.',
                    value: (() => {
                      const v = spotifyMetrics.filter((m) => m.completion_rate != null);
                      return v.length
                        ? Math.round(
                            v.reduce((s, m) => s + (m.completion_rate ?? 0), 0) / v.length
                          ) + '%'
                        : '—';
                    })(),
                  },
                  {
                    label: 'Min. escuchados',
                    value: spotifyMetrics
                      .reduce((s, m) => s + (m.minutes_listened ?? 0), 0)
                      .toLocaleString(),
                  },
                ].map((kpi) => (
                  <Card key={kpi.label}>
                    <CardContent className="pt-4 pb-3">
                      <p className="text-2xl font-bold text-[#0c1f36]">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Tabla por importación */}
              {spotifyMetrics.map((m) => (
                <Card key={m.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">
                        {m.metric_date || m.period_start || 'Fecha desconocida'}
                      </p>
                      {m.traffic_source && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {m.traffic_source}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-sm">
                      {m.plays != null && (
                        <div>
                          <p className="font-bold">{m.plays.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Plays</p>
                        </div>
                      )}
                      {m.listeners != null && (
                        <div>
                          <p className="font-bold">{m.listeners.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Oyentes</p>
                        </div>
                      )}
                      {m.completion_rate != null && (
                        <div>
                          <p className="font-bold">{m.completion_rate}%</p>
                          <p className="text-xs text-muted-foreground">Retención</p>
                        </div>
                      )}
                      {m.minutes_listened != null && (
                        <div>
                          <p className="font-bold">{m.minutes_listened.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Minutos</p>
                        </div>
                      )}
                      {m.country && (
                        <div>
                          <p className="font-bold">{m.country}</p>
                          <p className="text-xs text-muted-foreground">País</p>
                        </div>
                      )}
                      {m.platform && (
                        <div>
                          <p className="font-bold">{m.platform}</p>
                          <p className="text-xs text-muted-foreground">Plataforma</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
