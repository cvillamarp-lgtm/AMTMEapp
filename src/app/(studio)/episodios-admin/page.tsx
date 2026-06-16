'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useOptimisticList } from '@/hooks/use-optimistic-list';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/shadcn/dialog';
import { Plus, Pencil, Trash2, Search, Sparkles, Mic, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getEpisodes, createEpisode, updateEpisode, deleteEpisode } from '@/lib/database';
import type { Episode, EpisodeStatus, NarrativeStructure } from '@/types/database';
import { callAI } from '@/lib/ai-studio';

export default function EpisodiosPage() {
  const {
    items: episodes,
    setItems: setEpisodes,
    optimisticUpdate,
    optimisticCreate,
    optimisticRemove,
  } = useOptimisticList<Episode>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EpisodeStatus | 'all'>('all');
  const [generatingHooks, setGeneratingHooks] = useState(false);
  const [suggestedHooks, setSuggestedHooks] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    episode_number: '',
    title: '',
    theme: '',
    pillar: '',
    emotional_wound: '',
    central_symbol: '',
    objective: '',
    status: 'idea' as EpisodeStatus,
    cta: '',
    notes: '',
    narrative_structure: null as NarrativeStructure | null,
    spotify_description: '',
    apple_description: '',
    publish_date: null as string | null,
  });

  async function generateHooks() {
    if (!formData.theme || !formData.emotional_wound) {
      toast.error('Completa tema y herida emocional primero');
      return;
    }
    setGeneratingHooks(true);
    try {
      const prompt = `Genera 5 títulos alternativos para un episodio de AMTME con este contexto:
Tema: ${formData.theme}
Herida emocional: ${formData.emotional_wound}
Símbolo: ${formData.central_symbol || 'no definido'}

Cada título debe:
- Ser una pregunta directa de 5-10 palabras
- Usar la segunda persona singular (tú)
- Apuntar a la herida emocional
- Generar tensión psicológica

Devuelve solo los 5 títulos numerados, uno por línea.`;
      const result = await callAI(prompt, 'Episodio');
      const hooks = result
        .split('\n')
        .filter((l) => l.match(/^\d/))
        .map((l) => l.replace(/^\d+\.?\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 5);
      setSuggestedHooks(hooks);
      toast.success('Hooks generados');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al generar');
    } finally {
      setGeneratingHooks(false);
    }
  }

  const filteredEpisodes = useMemo(
    () =>
      episodes.filter((ep) => {
        const matchSearch =
          searchQuery === '' ||
          ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ep.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ep.episode_number.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || ep.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [episodes, searchQuery, statusFilter]
  );

  useEffect(() => {
    loadEpisodes();
  }, []);

  async function loadEpisodes() {
    try {
      const data = await getEpisodes();
      setEpisodes(data);
    } catch {
      toast.error('Error al cargar episodios');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      episode_number: '',
      title: '',
      theme: '',
      pillar: '',
      emotional_wound: '',
      central_symbol: '',
      objective: '',
      status: 'idea',
      cta: '',
      notes: '',
      narrative_structure: null,
      spotify_description: '',
      apple_description: '',
      publish_date: null,
    });
    setEditingEpisode(null);
  }

  function handleEdit(ep: Episode) {
    setEditingEpisode(ep);
    setFormData({
      episode_number: ep.episode_number,
      title: ep.title,
      theme: ep.theme,
      pillar: ep.pillar || '',
      emotional_wound: ep.emotional_wound,
      central_symbol: ep.central_symbol,
      objective: ep.objective || '',
      status: ep.status,
      cta: ep.cta || '',
      notes: ep.notes || '',
      narrative_structure: ep.narrative_structure,
      spotify_description: ep.spotify_description || '',
      apple_description: ep.apple_description || '',
      publish_date: ep.publish_date || null,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !formData.episode_number ||
      !formData.title ||
      !formData.theme ||
      !formData.emotional_wound ||
      !formData.central_symbol
    ) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    const episodeData = {
      ...formData,
      script: null,
      hooks: null,
      next_action: null,
      spotify_description: formData.spotify_description || null,
      apple_description: formData.apple_description || null,
      publish_date: formData.publish_date || null,
      pillar: formData.pillar || null,
      objective: formData.objective || null,
      cta: formData.cta || null,
      notes: formData.notes || null,
    };
    setDialogOpen(false);
    resetForm();
    if (editingEpisode) {
      await optimisticUpdate(editingEpisode.id, episodeData, () =>
        updateEpisode(editingEpisode.id, episodeData)
      );
      toast.success('Episodio actualizado');
    } else {
      const temp: Episode = {
        id: crypto.randomUUID(),
        user_id: 'temp',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...episodeData,
      };
      await optimisticCreate(temp, () => createEpisode(episodeData));
      toast.success('Episodio creado');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este episodio?')) return;
    await optimisticRemove(id, () => deleteEpisode(id));
    toast.success('Episodio eliminado');
  }

  const statusColors: Record<string, string> = {
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

  // Pipeline ordenado de estados editoriales
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

  function nextAction(status: EpisodeStatus): string {
    const map: Record<EpisodeStatus, string> = {
      idea: 'Definir herida emocional y símbolo central',
      investigacion: 'Crear guion en estructura AZTIYARTE',
      guion: 'Revisar guion y marcar listo para grabar',
      grabacion: 'Editar el audio grabado',
      edicion: 'Publicar en Spotify y plataformas',
      publicado: 'Distribuir en redes sociales',
      distribuido: 'Registrar métricas del episodio',
      medido: 'Episodio completado',
      archivado: 'Episodio archivado',
    };
    return map[status] ?? '';
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Episodios</h1>
          <p className="text-sm text-muted-foreground mt-1">Ciclo completo de producción</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" /> Crear episodio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEpisode ? 'Editar episodio' : 'Crear episodio'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Número *</Label>
                  <Input
                    value={formData.episode_number}
                    onChange={(e) => setFormData({ ...formData, episode_number: e.target.value })}
                    placeholder="35"
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v: EpisodeStatus) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        'idea',
                        'investigacion',
                        'guion',
                        'grabacion',
                        'edicion',
                        'publicado',
                        'distribuido',
                        'medido',
                      ].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Título *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Cuando ya no puedes seguir fingiendo"
                />
              </div>
              <div className="flex gap-2 mt-1">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={generateHooks}
                  disabled={generatingHooks}
                  className="text-xs"
                >
                  {generatingHooks ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      Generar hooks con IA
                    </>
                  )}
                </Button>
              </div>
              {suggestedHooks.length > 0 && (
                <div className="border rounded-lg p-3 bg-muted/50 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Selecciona un hook:
                  </p>
                  {suggestedHooks.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, title: h })}
                      className="block w-full text-left text-sm p-2 rounded hover:bg-background transition-colors"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
              <div>
                <Label>Tema *</Label>
                <Input
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="agotamiento emocional y verdad personal"
                />
              </div>
              <div>
                <Label>Herida emocional *</Label>
                <Input
                  value={formData.emotional_wound}
                  onChange={(e) => setFormData({ ...formData, emotional_wound: e.target.value })}
                />
              </div>
              <div>
                <Label>Símbolo central *</Label>
                <Input
                  value={formData.central_symbol}
                  onChange={(e) => setFormData({ ...formData, central_symbol: e.target.value })}
                />
              </div>
              <div>
                <Label>CTA</Label>
                <Textarea
                  value={formData.cta}
                  onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label>Notas</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Fecha de publicación</Label>
                <Input
                  type="date"
                  value={formData.publish_date || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, publish_date: e.target.value || null })
                  }
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingEpisode ? 'Guardar cambios' : 'Crear episodio'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 grid md:grid-cols-[1fr_auto] gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Buscar por título, tema, número..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as EpisodeStatus | 'all')}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {[
              'idea',
              'investigacion',
              'guion',
              'grabacion',
              'edicion',
              'publicado',
              'distribuido',
              'medido',
            ].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando episodios...</div>
      ) : filteredEpisodes.length === 0 ? (
        <div className="text-center py-16">
          <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Sin episodios todavía</p>
          <Button
            className="mt-4 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear primer episodio
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredEpisodes.map((ep) => (
              <motion.div
                key={ep.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <CardTitle className="text-lg">
                            #{ep.episode_number}: {ep.title}
                          </CardTitle>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[ep.status] || 'bg-gray-100 text-gray-700'}`}
                          >
                            {ep.status}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${ep.script ? 'bg-[#e8ff40] text-[#0c1f36]' : 'bg-gray-100 text-gray-500'}`}
                          >
                            {ep.script ? 'Con guion' : 'Sin guion'}
                          </span>
                        </div>
                        <CardDescription>{ep.theme}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(ep)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(ep.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Herida: </span>
                        {ep.emotional_wound}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Símbolo: </span>
                        {ep.central_symbol}
                      </div>
                      {ep.cta && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">CTA: </span>
                          {ep.cta}
                        </div>
                      )}
                    </div>

                    {/* Pipeline de estados */}
                    <div className="mt-4 flex items-center gap-1 flex-wrap">
                      {PIPELINE.map((step, i) => {
                        const currentIdx = PIPELINE.indexOf(ep.status as EpisodeStatus);
                        const isDone = i < currentIdx;
                        const isCurrent = step === ep.status;
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

                    {/* Siguiente acción */}
                    {ep.status !== 'medido' && ep.status !== 'archivado' && (
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">Siguiente:</span>{' '}
                          {nextAction(ep.status as EpisodeStatus)}
                        </p>
                        {(ep.status === 'idea' || ep.status === 'investigacion') && (
                          <Link
                            href="/guiones"
                            className="shrink-0 text-xs font-medium text-[#0c1f36] underline underline-offset-2 hover:no-underline"
                          >
                            Ir a guiones →
                          </Link>
                        )}
                        {ep.status === 'guion' && (
                          <Link
                            href="/revision-episodios"
                            className="shrink-0 text-xs font-medium text-[#0c1f36] underline underline-offset-2 hover:no-underline"
                          >
                            Ir a revision →
                          </Link>
                        )}
                        {ep.status === 'distribuido' && (
                          <Link
                            href="/metricas"
                            className="shrink-0 text-xs font-medium text-teal-700 underline underline-offset-2 hover:no-underline"
                          >
                            Registrar metricas →
                          </Link>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
