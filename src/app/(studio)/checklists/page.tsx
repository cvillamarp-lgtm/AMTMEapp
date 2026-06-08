'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Progress } from '@/components/shadcn/progress';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/shadcn/dialog';
import { RefreshCw, CheckCircle2, Circle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { getChecklists, createChecklist, updateChecklist } from '@/lib/database';

const TEMPLATES: { label: string; area: string; frequency: string; items: string[] }[] = [
  {
    label: 'Pre-grabación',
    area: 'Producción',
    frequency: 'Por episodio',
    items: [
      'Guion revisado y listo',
      'Micrófono probado y limpio',
      'Espacio silencioso preparado',
      'Agua y voz calentada',
      'Intención emocional clara',
    ],
  },
  {
    label: 'Pre-publicación',
    area: 'Distribución',
    frequency: 'Por episodio',
    items: [
      'Audio exportado en MP3 320kbps',
      'Portada del episodio lista',
      'Descripción Spotify escrita',
      'Show notes revisadas',
      'CTA confirmado',
    ],
  },
  {
    label: 'Revisión semanal',
    area: 'Editorial',
    frequency: 'Semanal',
    items: [
      'Revisar métricas de la semana',
      'Actualizar pipeline de episodios',
      'Registrar ideas nuevas',
      'Confirmar publicación próxima semana',
    ],
  },
  {
    label: 'Custom',
    area: '',
    frequency: '',
    items: [],
  },
];

// El payload del seed usa estos campos reales
type RichChecklistItem = { id: string; text: string; completed: boolean; critical?: boolean };

type RichChecklist = Omit<import('@/types/database').Checklist, 'items'> & {
  items: RichChecklistItem[];
  readyCriteria: string;
  errorsToAvoid: string;
};

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<RichChecklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [newName, setNewName] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newFrequency, setNewFrequency] = useState('');
  const [newItemsText, setNewItemsText] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getChecklists();
      setChecklists(data as RichChecklist[]);
    } catch {
      toast.error('Error al cargar checklists');
    } finally {
      setLoading(false);
    }
  }

  async function toggleItem(checklist: RichChecklist, itemId: string) {
    const updatedItems = checklist.items.map((i) =>
      i.id === itemId ? { ...i, completed: !i.completed } : i
    );
    const allDone = updatedItems.every((i) => i.completed);
    const newStatus = allDone
      ? 'Listo'
      : updatedItems.some((i) => i.completed)
        ? 'En proceso'
        : 'Pendiente';

    // Optimistic update
    setChecklists((prev) =>
      prev.map((c) =>
        c.id === checklist.id ? { ...c, items: updatedItems, status: newStatus } : c
      )
    );

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateChecklist(checklist.id, { items: updatedItems as any, status: newStatus });
    } catch {
      toast.error('Error al guardar');
      setChecklists((prev) => prev.map((c) => (c.id === checklist.id ? checklist : c)));
    }
  }

  async function resetChecklist(checklist: RichChecklist) {
    const resetItems = checklist.items.map((i) => ({ ...i, completed: false }));
    setChecklists((prev) =>
      prev.map((c) =>
        c.id === checklist.id ? { ...c, items: resetItems, status: 'Pendiente' } : c
      )
    );
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateChecklist(checklist.id, { items: resetItems as any, status: 'Pendiente' });
      toast.success('Checklist reiniciado');
    } catch {
      toast.error('Error al reiniciar');
    }
  }

  function applyTemplate(idx: number) {
    const t = TEMPLATES[idx];
    setSelectedTemplate(idx);
    setNewName(t.label === 'Custom' ? '' : t.label);
    setNewArea(t.area);
    setNewFrequency(t.frequency);
    setNewItemsText(t.items.join('\n'));
  }

  async function handleCreate() {
    if (!newName.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    const lines = newItemsText.split('\n').map((l) => l.trim()).filter(Boolean);
    const items = lines.map((text) => ({ id: crypto.randomUUID(), text, completed: false }));
    setCreating(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const created = await createChecklist({
        name: newName.trim(),
        area: newArea.trim() || 'General',
        frequency: newFrequency.trim() || null,
        status: 'Pendiente',
        ready_criteria: null,
        errors_to_avoid: null,
        items: items as any,
        related_episode_id: null,
        related_content_id: null,
      });
      setChecklists((prev) => [created as RichChecklist, ...prev]);
      setCreateOpen(false);
      setNewName('');
      setNewArea('');
      setNewFrequency('');
      setNewItemsText('');
      setSelectedTemplate(0);
      toast.success('Checklist creado');
    } catch {
      toast.error('Error al crear checklist');
    } finally {
      setCreating(false);
    }
  }

  const statusColor = (s: string) => {
    if (s === 'Listo') return 'bg-[#e8ff40] text-[#0c1f36]';
    if (s === 'En proceso') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Checklists</h1>
          <p className="text-sm text-muted-foreground mt-1">SOPs operativos AMTME</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"
                onClick={() => applyTemplate(0)}
              >
                <Plus className="h-4 w-4 mr-1" /> Nueva checklist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nueva checklist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Plantilla base
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {TEMPLATES.map((t, i) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => applyTemplate(i)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                          selectedTemplate === i
                            ? 'bg-[#0c1f36] text-white border-[#0c1f36]'
                            : 'bg-white text-[#0c1f36] border-black/10 hover:border-[#0c1f36]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label>Nombre *</Label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Nombre del SOP"
                    />
                  </div>
                  <div>
                    <Label>Área</Label>
                    <Input
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      placeholder="Editorial, Técnico..."
                    />
                  </div>
                  <div>
                    <Label>Frecuencia</Label>
                    <Input
                      value={newFrequency}
                      onChange={(e) => setNewFrequency(e.target.value)}
                      placeholder="Semanal, Por episodio..."
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Ítems (uno por línea)</Label>
                    <Textarea
                      rows={6}
                      value={newItemsText}
                      onChange={(e) => setNewItemsText(e.target.value)}
                      placeholder="Paso 1&#10;Paso 2&#10;Paso 3"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={creating}
                  className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"
                >
                  {creating ? 'Creando...' : 'Crear checklist'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : checklists.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-2">Sin checklists</p>
          <p className="text-xs text-muted-foreground">
            Ejecuta el seed SQL en Supabase para cargar los 16 SOPs reales
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {checklists.map((cl) => {
            const items = cl.items || [];
            const done = items.filter((i) => i.completed).length;
            const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;
            const isExpanded = expanded === cl.id;

            return (
              <Card key={cl.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {cl.area}
                      </p>
                      <CardTitle className="text-base leading-tight">{cl.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{cl.frequency}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor(cl.status)}`}
                    >
                      {cl.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>
                        {done}/{items.length} completados
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col gap-3">
                  {/* Items — expandibles */}
                  <div className="space-y-1.5">
                    {(isExpanded ? items : items.slice(0, 4)).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(cl, item.id)}
                        className={`w-full flex items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                          item.completed
                            ? 'bg-[#0c1f36] text-white'
                            : item.critical
                              ? 'bg-red-50 text-[#0c1f36] hover:bg-red-100'
                              : 'bg-[#F5F2EA] text-[#0c1f36] hover:bg-white border border-black/5'
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-[#e8ff40]" />
                        ) : (
                          <Circle
                            className={`h-4 w-4 shrink-0 mt-0.5 ${item.critical ? 'text-red-400' : 'text-muted-foreground'}`}
                          />
                        )}
                        <span className="leading-snug">{item.text}</span>
                      </button>
                    ))}
                  </div>

                  {items.length > 4 && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : cl.id)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
                    >
                      {isExpanded ? '▲ Ver menos' : `▼ Ver ${items.length - 4} más`}
                    </button>
                  )}

                  {/* Criterios de listo */}
                  {isExpanded && cl.readyCriteria && (
                    <div className="rounded-xl border border-black/8 bg-white p-3 text-xs space-y-2">
                      <p className="font-semibold text-[#0c1f36]">Lista cuando:</p>
                      <p className="text-muted-foreground leading-relaxed">{cl.readyCriteria}</p>
                      {cl.errorsToAvoid && (
                        <>
                          <p className="font-semibold text-red-600">Evitar:</p>
                          <p className="text-muted-foreground leading-relaxed">
                            {cl.errorsToAvoid}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {pct === 100 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resetChecklist(cl)}
                      className="mt-auto text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reiniciar
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
