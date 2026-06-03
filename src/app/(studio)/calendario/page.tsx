'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { Plus, Trash2, CalendarDays, AlertCircle, Clock3, CheckCircle2, CircleDot, CalendarCheck, Layers, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { getCalendarEvents, createCalendarEvent, deleteCalendarEvent, updateCalendarEvent } from '@/lib/database';
import type { CalendarEvent, EventType, EventStatus } from '@/types/database';

// ---- helpers de fecha ----
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function addDays(d: string, n: number) {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}
function weekLabel(date: string) {
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
}

export default function CalendarioPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<'operativo' | 'mes'>('operativo');
  const [form, setForm] = useState({
    title: '',
    type: 'produccion' as EventType,
    date: '',
    time: '',
    frequency: '',
    channel: '',
    status: 'pendiente' as EventStatus,
    notes: '',
    episode_id: null as string | null,
    content_id: null as string | null,
  });

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const d = await getCalendarEvents();
      setEvents(d);
    } catch {
      toast.error('Error al cargar');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      title: '',
      type: 'produccion',
      date: todayStr(),
      time: '',
      frequency: '',
      channel: '',
      status: 'pendiente',
      notes: '',
      episode_id: null,
      content_id: null,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.date) {
      toast.error('Completa titulo y fecha');
      return;
    }
    try {
      await createCalendarEvent({
        ...form,
        time: form.time || null,
        frequency: form.frequency || null,
        channel: form.channel || null,
        notes: form.notes || null,
      });
      toast.success('Evento creado');
      setDialogOpen(false);
      resetForm();
      await load();
    } catch {
      toast.error('Error al guardar');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminar este evento?')) return;
    try {
      await deleteCalendarEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success('Eliminado');
    } catch {
      toast.error('Error');
    }
  }

  async function handleMarkPublished(id: string) {
    try {
      await updateCalendarEvent(id, { status: 'publicado' });
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, status: 'publicado' } : e));
      toast.success('Marcado como publicado');
    } catch {
      toast.error('Error al actualizar');
    }
  }

  // ---- clasificacion operativa ----
  const today = todayStr();
  const in7 = addDays(today, 7);

  const secHoy = useMemo(() => events.filter(e => e.date === today && e.status !== 'publicado' && e.status !== 'archivado'), [events, today]);
  const secProximas = useMemo(() => events.filter(e => e.date > today && e.date <= in7 && e.status !== 'publicado' && e.status !== 'archivado'), [events, today, in7]);
  const secAtrasadas = useMemo(() => events.filter(e => e.date < today && e.status !== 'publicado' && e.status !== 'archivado'), [events, today]);
  const secPublicadas = useMemo(() => events.filter(e => e.status === 'publicado'), [events]);

  // carga semanal: eventos entre hoy y +7
  const cargaSemanal = useMemo(() => {
    const map: Record<string, number> = {};
    events.filter(e => e.date >= today && e.date <= in7).forEach(e => {
      map[e.date] = (map[e.date] || 0) + 1;
    });
    return map;
  }, [events, today, in7]);

  // siguiente accion: primer evento pendiente o atrasado
  const siguienteAccion = useMemo(() => {
    return [...secAtrasadas, ...secHoy, ...secProximas].sort((a, b) => a.date.localeCompare(b.date))[0] || null;
  }, [secAtrasadas, secHoy, secProximas]);

  // huecos: dias sin contenido en los proximos 7
  const diasConContenido = new Set(events.filter(e => e.date >= today && e.date <= in7).map(e => e.date));
  const huecos: string[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = addDays(today, i);
    if (!diasConContenido.has(d)) huecos.push(d);
  }

  // agrupacion por mes para vista de mes
  const grouped = events.reduce((acc, ev) => {
    const m = ev.date.slice(0, 7);
    if (!acc[m]) acc[m] = [];
    acc[m].push(ev);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const statusColor: Record<string, string> = {
    pendiente: 'bg-gray-100 text-gray-600',
    'en-proceso': 'bg-blue-50 text-blue-700',
    listo: 'bg-[#e8ff40] text-[#0c1f36]',
    publicado: 'bg-green-100 text-green-700',
    medido: 'bg-purple-50 text-purple-700',
    archivado: 'bg-gray-50 text-gray-400',
  };

  // ---- sub-componente de tarjeta de evento ----
  function EventCard({ ev, showMarkPublished = true }: { ev: CalendarEvent; showMarkPublished?: boolean }) {
    return (
      <div className={`rounded-xl border bg-card p-4 flex items-start gap-3 ${ev.date < today && ev.status !== 'publicado' ? 'border-red-200' : 'border-border'}` }>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-medium text-sm text-primary truncate">{ev.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[ev.status] || 'bg-gray-100 text-gray-600'}`}>{ev.status}</span>
            {ev.channel && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{ev.channel}</span>}
          </div>
          <p className="text-xs text-muted-foreground">
            {weekLabel(ev.date)}{ev.time ? ` · ${ev.time}` : ''} · {ev.type}
          </p>
          {ev.notes && <p className="text-xs text-muted-foreground mt-1 truncate">{ev.notes}</p>}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {showMarkPublished && ev.status !== 'publicado' && (
            <Button size="sm" variant="ghost" className="text-green-700 hover:text-green-900 text-xs h-7" onClick={() => handleMarkPublished(ev.id)}>
              <CheckCircle2 className="h-3 w-3 mr-1" />Publicado
            </Button>
          )}
          <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive h-7" onClick={() => handleDelete(ev.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Calendario</h1>
          <p className="text-sm text-muted-foreground mt-1">Centro operativo de distribucion</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView('operativo')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'operativo' ? 'bg-[#e8ff40] text-[#0c1f36]' : 'bg-background text-muted-foreground hover:bg-muted'}`}
            >
              Operativo
            </button>
            <button
              onClick={() => setView('mes')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'mes' ? 'bg-[#e8ff40] text-[#0c1f36]' : 'bg-background text-muted-foreground hover:bg-muted'}`}
            >
              Por mes
            </button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agendar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agendar publicacion</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Titulo</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="EP.36 — Lanzamiento en Spotify"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha</Label>
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Hora</Label>
                    <Input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) => setForm({ ...form, type: v as EventType })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[
                          'publicacion','distribucion','produccion','grabacion',
                          'edicion','medicion','revision','monetizacion',
                        ].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Canal</Label>
                    <Select
                      value={form.channel || ''}
                      onValueChange={(v) => setForm({ ...form, channel: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Canal" /></SelectTrigger>
                      <SelectContent>
                        {['Spotify','Instagram','TikTok','YouTube Shorts','Threads','Email','WhatsApp'].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v as EventStatus })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['pendiente','en-proceso','listo','publicado'].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Notas</Label>
                  <Input
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Detalles, links, observaciones..."
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit">Agendar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando...</div>
      ) : view === 'operativo' ? (
        <div className="space-y-8">

          {/* SIGUIENTE ACCION */}
          {siguienteAccion && (
            <div className="rounded-xl border border-[#e8ff40]/60 bg-[#e8ff40]/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4 text-[#0c1f36]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#0c1f36]">Siguiente accion</span>
              </div>
              <p className="font-medium text-primary">{siguienteAccion.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {weekLabel(siguienteAccion.date)}
                {siguienteAccion.channel ? ` · ${siguienteAccion.channel}` : ''}
                {siguienteAccion.type ? ` · ${siguienteAccion.type}` : ''}
              </p>
            </div>
          )}

          {/* HOY */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CircleDot className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Hoy</h2>
              <span className="text-xs text-muted-foreground">{today}</span>
            </div>
            {secHoy.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">No hay publicaciones agendadas para hoy</p>
                <Button size="sm" variant="ghost" className="mt-2 text-xs" onClick={() => setDialogOpen(true)}>
                  <Plus className="h-3 w-3 mr-1" />Agendar para hoy
                </Button>
              </div>
            ) : (
              <div className="grid gap-2">
                {secHoy.map(ev => <EventCard key={ev.id} ev={ev} />)}
              </div>
            )}
          </div>

          {/* ATRASADAS */}
          {secAtrasadas.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-red-600">Atrasadas</h2>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{secAtrasadas.length}</span>
              </div>
              <div className="grid gap-2">
                {secAtrasadas.map(ev => <EventCard key={ev.id} ev={ev} />)}
              </div>
            </div>
          )}

          {/* PROXIMAS 7 DIAS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock3 className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">Proximos 7 dias</h2>
            </div>
            {secProximas.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">Sin publicaciones agendadas esta semana</p>
                <Button size="sm" variant="ghost" className="mt-2 text-xs" onClick={() => setDialogOpen(true)}>
                  <Plus className="h-3 w-3 mr-1" />Agendar
                </Button>
              </div>
            ) : (
              <div className="grid gap-2">
                {secProximas.map(ev => <EventCard key={ev.id} ev={ev} />)}
              </div>
            )}
          </div>

          {/* CARGA SEMANAL + HUECOS */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Carga semanal</h3>
              </div>
              {Object.keys(cargaSemanal).length === 0 ? (
                <p className="text-xs text-muted-foreground">Sin eventos esta semana</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(cargaSemanal).sort().map(([date, count]) => (
                    <div key={date} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{weekLabel(date)}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        count >= 3 ? 'bg-red-100 text-red-700' : count === 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>{count} evento{count > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-dashed border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Huecos esta semana</h3>
              </div>
              {huecos.length === 0 ? (
                <p className="text-xs text-green-700 font-medium">Semana completa. Buen ritmo.</p>
              ) : (
                <div className="space-y-1">
                  {huecos.slice(0, 5).map(d => (
                    <div key={d} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{weekLabel(d)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-6"
                        onClick={() => { setForm(f => ({ ...f, date: d })); setDialogOpen(true); }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PUBLICADAS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Publicadas</h2>
              <span className="text-xs text-muted-foreground">{secPublicadas.length} total</span>
            </div>
            {secPublicadas.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">Ninguna publicacion marcada como completada todavia</p>
            ) : (
              <div className="grid gap-2">
                {secPublicadas.slice(0, 5).map(ev => <EventCard key={ev.id} ev={ev} showMarkPublished={false} />)}
                {secPublicadas.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{secPublicadas.length - 5} mas — cambia a vista por mes para ver todo
                  </p>
                )}
              </div>
            )}
          </div>

          {/* EMPTY STATE GLOBAL */}
          {events.length === 0 && (
            <div className="text-center py-16">
              <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium text-primary mb-1">El calendario esta vacio</p>
              <p className="text-sm text-muted-foreground mb-4">Agenda tu primera publicacion. Cada semana necesita al menos un punto de distribucion.</p>
              <Button
                className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agendar primera publicacion
              </Button>
            </div>
          )}
        </div>
      ) : (
        // VISTA POR MES
        <div className="space-y-8">
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-16">
              <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Sin eventos</p>
              <Button
                className="mt-4 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />Agendar
              </Button>
            </div>
          ) : (
            Object.keys(grouped).sort().map((month) => (
              <div key={month}>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{month}</h2>
                <div className="grid gap-2">
                  {grouped[month].map((ev) => (
                    <Card key={ev.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">{ev.title}</CardTitle>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[ev.status] || 'bg-gray-100 text-gray-600'}`}>
                                {ev.status}
                              </span>
                            </div>
                            <CardDescription className="mt-0.5">
                              {weekLabel(ev.date)}{ev.time ? ` · ${ev.time}` : ''} · {ev.type}
                              {ev.channel ? ` · ${ev.channel}` : ''}
                            </CardDescription>
                          </div>
                          <div className="flex gap-1">
                            {ev.status !== 'publicado' && (
                              <Button size="sm" variant="ghost" className="h-8" onClick={() => handleMarkPublished(ev.id)}>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(ev.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      {ev.notes && (
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">{ev.notes}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
