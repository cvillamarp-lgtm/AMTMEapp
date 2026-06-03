'use client';
import { useState, useEffect, useMemo } from 'react';
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
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Image,
  Sparkles,
  Loader2,
  Copy,
  CheckCheck,
  Package,
  CalendarPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  getContentPieces,
  createContentPiece,
  updateContentPiece,
  deleteContentPiece,
} from '@/lib/database';
import type { ContentPiece, Channel, ContentFormat, ContentStatus } from '@/types/database';
import { callAI, generatePublicationPackage, type PublicationPackage } from '@/lib/ai-studio';

// --- PackageSection helper ---
function PackageSection({ title, items }: { title: string; items: string[] }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const copy = (text: string, idx: number) => {
    void navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        {title}
      </p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm"
          >
            <span className="flex-1 leading-5">{item}</span>
            <button
              onClick={() => copy(item, i)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
            >
              {copiedIdx === i ? (
                <CheckCheck className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PackageSingle({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        {title}
      </p>
      <div className="flex items-start gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm">
        <span className="flex-1 leading-5">{text}</span>
        <button
          onClick={copy}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
        >
          {copied ? (
            <CheckCheck className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function ContenidoPage() {
  const router = useRouter();
  const { items, setItems, optimisticUpdate, optimisticCreate, optimisticRemove } =
    useOptimisticList<ContentPiece>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ContentPiece | null>(null);
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<Channel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [generatingContent, setGeneratingContent] = useState(false);
  const [form, setForm] = useState({
    channel: '' as Channel,
    format: '' as ContentFormat,
    theme: '',
    hook: '',
    main_text: '',
    cta: '',
    status: 'borrador' as ContentStatus,
  });

  // --- Generador de paquete ---
  const [packageTab, setPackageTab] = useState<'generator' | 'library'>('library');
  const [packageInput, setPackageInput] = useState('');
  const [generatingPackage, setGeneratingPackage] = useState(false);
  const [pkg, setPkg] = useState<PublicationPackage | null>(null);

  async function handleGeneratePackage() {
    if (!packageInput.trim() || packageInput.trim().length < 50) {
      toast.error('Pega un guion, nota o episodio con al menos 50 caracteres');
      return;
    }
    setGeneratingPackage(true);
    setPkg(null);
    try {
      const result = await generatePublicationPackage(packageInput);
      setPkg(result);
      toast.success('Paquete generado');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al generar paquete');
    } finally {
      setGeneratingPackage(false);
    }
  }

  async function generateContent() {
    if (!form.theme || !form.channel || !form.format) {
      toast.error('Completa tema, canal y formato primero');
      return;
    }
    setGeneratingContent(true);
    try {
      const prompt = `Genera una pieza de contenido para AMTME con este contexto:
Canal: ${form.channel}
Formato: ${form.format}
Tema: ${form.theme}

Devuelve exactamente en este formato:
[HOOK] - Una frase gancho de 10-15 palabras que genere tensión emocional
[TEXTO] - El texto principal (adapta la longitud al formato: reel=3-4 frases, carrusel=6-8 frases, story=2-3 frases)
[CTA] - Una llamada a la acción corta y específica`;

      const result = await callAI(prompt, 'Copy');
      const extract = (tag: string) => {
        const regex = new RegExp('\\[' + tag + '\\]\\s*[-–]?\\s*([\\s\\S]*?)(?=\\[|$)', 'i');
        const match = result.match(regex);
        return match ? match[1].trim() : '';
      };
      const hook = extract('HOOK');
      const texto = extract('TEXTO');
      const cta = extract('CTA');
      if (hook || texto) {
        setForm((f) => ({
          ...f,
          hook: hook || f.hook,
          main_text: texto || f.main_text,
          cta: cta || f.cta,
        }));
        toast.success('Contenido generado con IA');
      } else {
        toast.error('No se pudo parsear el resultado');
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Error al generar');
    } finally {
      setGeneratingContent(false);
    }
  }

  const filtered = useMemo(
    () =>
      items.filter((c) => {
        const matchSearch =
          search === '' ||
          c.theme.toLowerCase().includes(search.toLowerCase()) ||
          c.hook.toLowerCase().includes(search.toLowerCase());
        return (
          matchSearch &&
          (channelFilter === 'all' || c.channel === channelFilter) &&
          (statusFilter === 'all' || c.status === statusFilter)
        );
      }),
    [items, search, channelFilter, statusFilter]
  );

  useEffect(() => {
    load();
  }, []);
  async function load() {
    try {
      const d = await getContentPieces();
      setItems(d);
    } catch {
      toast.error('Error al cargar contenido');
    } finally {
      setLoading(false);
    }
  }
  function resetForm() {
    setForm({
      channel: '' as Channel,
      format: '' as ContentFormat,
      theme: '',
      hook: '',
      main_text: '',
      cta: '',
      status: 'borrador',
    });
    setEditing(null);
  }
  function handleEdit(c: ContentPiece) {
    setEditing(c);
    setForm({
      channel: c.channel,
      format: c.format,
      theme: c.theme,
      hook: c.hook,
      main_text: c.main_text,
      cta: c.cta,
      status: c.status,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.channel ||
      !form.format ||
      !form.theme ||
      !form.hook ||
      !form.main_text ||
      !form.cta
    ) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    setDialogOpen(false);
    resetForm();
    if (editing) {
      await optimisticUpdate(editing.id, form, () => updateContentPiece(editing.id, form));
      toast.success('Contenido actualizado');
    } else {
      const full = {
        ...form,
        emotion: null,
        objective: null,
        visual_prompt: null,
        caption: null,
        publish_date: null,
        episode_id: null,
        metric_goal: null,
      };
      const temp = {
        id: crypto.randomUUID(),
        user_id: 'temp',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...full,
      } as ContentPiece;
      await optimisticCreate(temp, () => createContentPiece(full));
      toast.success('Contenido creado');
    }
  }
  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar?')) return;
    await optimisticRemove(id, () => deleteContentPiece(id));
    toast.success('Eliminado');
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Contenido</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión multicanal y paquetes de publicación
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={packageTab === 'generator' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPackageTab('generator')}
            className={
              packageTab === 'generator'
                ? 'bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold'
                : ''
            }
          >
            <Package className="mr-2 h-4 w-4" />
            Generar paquete
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-[#0c1f36] text-white hover:bg-[#1a3a5c] font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva pieza
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? 'Editar contenido' : 'Crear contenido'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Canal *</Label>
                    <Select
                      value={form.channel}
                      onValueChange={(v) => setForm({ ...form, channel: v as Channel })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Canal" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          'instagram',
                          'tiktok',
                          'youtube-shorts',
                          'threads',
                          'spotify',
                          'email',
                        ].map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Formato *</Label>
                    <Select
                      value={form.format}
                      onValueChange={(v) => setForm({ ...form, format: v as ContentFormat })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Formato" />
                      </SelectTrigger>
                      <SelectContent>
                        {['reel', 'carrusel', 'story', 'short', 'post-texto', 'email'].map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={generateContent}
                  disabled={generatingContent}
                  className="w-full bg-[#0c1f36] text-white hover:bg-[#1a3a5c]"
                >
                  {generatingContent ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando con IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generar contenido con IA
                    </>
                  )}
                </Button>
                <div>
                  <Label>Tema *</Label>
                  <Input
                    value={form.theme}
                    onChange={(e) => setForm({ ...form, theme: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Hook *</Label>
                  <Textarea
                    value={form.hook}
                    onChange={(e) => setForm({ ...form, hook: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Texto principal *</Label>
                  <Textarea
                    value={form.main_text}
                    onChange={(e) => setForm({ ...form, main_text: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>CTA *</Label>
                  <Textarea
                    value={form.cta}
                    onChange={(e) => setForm({ ...form, cta: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v as ContentStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['borrador', 'listo', 'publicado', 'medido'].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* GENERADOR DE PAQUETE */}
      {packageTab === 'generator' && (
        <div className="mb-8 rounded-2xl border border-[#e8ff40]/30 bg-[#0c1f36]/5 p-6">
          <div className="flex items-center gap-2 mb-1">
            <Package className="h-5 w-5 text-[#0c1f36]" />
            <h2 className="text-lg font-semibold text-[#0c1f36]">Generador de paquete AMTME</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Pega un guion, nota o resumen de episodio. Obtenes hooks, captions, frases, ideas de
            reel, brief visual, CTA y checklist listos para copiar. El resultado no se guarda —
            copia lo que necesites.
          </p>
          <div className="space-y-3">
            <Textarea
              value={packageInput}
              onChange={(e) => setPackageInput(e.target.value)}
              placeholder="Pega aqui el guion, la nota o el contenido del episodio..."
              rows={6}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleGeneratePackage}
                disabled={generatingPackage}
                className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"
              >
                {generatingPackage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando paquete...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generar paquete
                  </>
                )}
              </Button>
              {pkg && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setPkg(null);
                    setPackageInput('');
                  }}
                >
                  Limpiar
                </Button>
              )}
              {pkg && (
                <Button
                  variant="outline"
                  className="border-[#0c1f36] text-[#0c1f36] hover:bg-[#0c1f36] hover:text-white"
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      `Hooks:\n${pkg.hooks.join('\n')}\n\nCaptions:\n${pkg.captions.join('\n')}\n\nCTA: ${pkg.cta}`
                    );
                    toast.success('Contenido copiado. Pega en el evento del calendario.');
                    router.push('/calendario');
                  }}
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Planificar en calendario
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-xs"
                onClick={() => setPackageTab('library')}
              >
                Volver a biblioteca →
              </Button>
            </div>
          </div>

          {pkg && (
            <div className="mt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <PackageSection title="Hooks para reels" items={pkg.hooks} />
                <PackageSection title="Captions para Instagram" items={pkg.captions} />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <PackageSection title="Frases recortables" items={pkg.frases} />
                <PackageSection title="Ideas de reel" items={pkg.reels} />
              </div>
              <PackageSection title="Ideas de carrusel" items={pkg.carouselIdeas} />
              <div className="grid md:grid-cols-2 gap-5">
                <PackageSingle title="Brief visual" text={pkg.briefVisual} />
                <PackageSingle title="CTA suave" text={pkg.cta} />
              </div>
              <PackageSection title="Checklist de publicacion" items={pkg.checklist} />
              <PackageSingle title="Siguiente accion editorial" text={pkg.nextAction} />
            </div>
          )}
        </div>
      )}

      {/* BIBLIOTECA DE PIEZAS */}
      {packageTab === 'library' && (
        <>
          <div className="mb-6 grid md:grid-cols-[1fr_auto_auto] gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={channelFilter}
              onValueChange={(v) => setChannelFilter(v as Channel | 'all')}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los canales</SelectItem>
                {['instagram', 'tiktok', 'youtube-shorts', 'threads', 'spotify', 'email'].map(
                  (c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as ContentStatus | 'all')}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {['borrador', 'listo', 'publicado', 'medido'].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Sin contenido todavia</p>
              <div className="mt-4 flex justify-center gap-2">
                <Button
                  className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]"
                  onClick={() => setPackageTab('generator')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Generar paquete
                </Button>
                <Button
                  className="bg-[#0c1f36] text-white hover:bg-[#1a3a5c]"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva pieza
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((c) => (
                  <motion.div
                    key={c.id}
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
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg">{c.theme}</CardTitle>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                {c.channel}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                {c.format}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === 'publicado' ? 'bg-[#e8ff40] text-[#0c1f36]' : 'bg-gray-100 text-gray-700'}`}
                              >
                                {c.status}
                              </span>
                            </div>
                            <CardDescription>{c.hook}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(c)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Texto: </span>
                            {c.main_text.substring(0, 120)}
                            {c.main_text.length > 120 ? '...' : ''}
                          </div>
                          <div>
                            <span className="text-muted-foreground">CTA: </span>
                            {c.cta}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
}
