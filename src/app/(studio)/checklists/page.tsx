'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Badge } from '@/components/shadcn/badge';
import { Progress } from '@/components/shadcn/progress';
import { RefreshCw, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { getChecklists, updateChecklist } from '@/lib/database';

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
      await updateChecklist(checklist.id, { items: resetItems as any, status: 'Pendiente' });
      toast.success('Checklist reiniciado');
    } catch {
      toast.error('Error al reiniciar');
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
          <p className="text-sm text-muted-foreground mt-1">16 SOPs operativos AMTME</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Actualizar
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando checklists...</div>
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
