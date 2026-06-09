'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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
import {
  Plus,
  Trash2,
  CalendarDays,
  AlertCircle,
  Clock3,
  CheckCircle2,
  CircleDot,
  CalendarCheck,
  Layers,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  getCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
} from '@/lib/database';
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
function dayMonthLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}
function getMondayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

const TYPE_COLOR: Record<string, string> = {
  publicacion: 'bg-[#e8ff40] text-[#0c1f36]',
  distribucion: 'bg-green-100 text-green-700',
  produccion: 'bg-blue-50 text-blue-700',
  grabacion: 'bg-purple-100 text-purple-700',
  edicion: 'bg-orange-100 text-orange-700',
  medicion: 'bg-teal-100 text-teal-700',
  revision: 'bg-gray-100 text-gray-600',
  monetizacion: 'bg-pink-100 text-pink-700',
};

const DAYS_ES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

function padDate(n: number) {
  return String(n).padStart(2, '0');
}

export default function CalendarioPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<'operativo' | 'semanal' | 'mes'>('operativo');
  const [weekStart, setWeekStart] = useState<string>(() => getMondayOfWeek(todayStr()));
  const now = new Date();
  const [calMonth, setCalMonth] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
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

  useEffect(() => {
    load();
  }, []);

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
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'publicado' } : e)));
      toast.success('Marcado como publicado');
    } catch {
      toast.error('Error al actualizar');
    }
  }

  // ---- clasificacion operativa ----
  const today = todayStr();
  const in7 = addDays(today, 7);

  const secHoy = useMemo(
    () =>
      events.filter(
        (e) => e.date === today && e.status !== 'publicado' && e.status !== 'archivado'
      ),
    [events, today]
  );
  const secProximas = useMemo(
    () =>
      events.filter(
        (e) =>
          e.date > today && e.date <= in7 && e.status !== 'publicado' && e.status !== 'archivado'
      ),
    [events, today, in7]
  );
  const secAtrasadas = useMemo(
    () =>
      events.filter((e) => e.date < today && e.status !== 'publicado' && e.status !== 'archivado'),
    [events, today]
  );
  const secPublicadas = useMemo(() => events.filter((e) => e.status === 'publicado'), [events]);

  // carga semanal: eventos entre hoy y +7
  const cargaSemanal = useMemo(() => {
    const map: Record<string, number> = {};
    events
      .filter((e) => e.date >= today && e.date <= in7)
      .forEach((e) => {
        map[e.date] = (map[e.date] || 0) + 1;
      });
    return map;
  }, [events, today, in7]);

  // semana seleccionada (7 dias desde weekStart)
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );
  const weekEvsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    weekDays.forEach((d) => { map[d] = []; });
    events.forEach((ev) => { if (ev.date in map) map[ev.date].push(ev); });
    return map;
  }, [events, weekDays]);

  // siguiente accion: primer evento pendiente o atrasado
  const siguienteAccion = useMemo(() => {
    return (
      [...secAtrasadas, ...secHoy, ...secProximas].sort((a, b) =>
        a.date.localeCompare(b.date)
      )[0] || null
    );
  }, [secAtrasadas, secHoy, secProximas]);

  // huecos: dias sin contenido en los proximos 7
  const diasConContenido = new Set(
    events.filter((e) => e.date >= today && e.date <= in7).map((e) => e.date)
  );
  const huecos: string[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = addDays(today, i);
    if (!diasConContenido.has(d)) huecos.push(d);
  }


  // grid mensual real
  const calGrid = useMemo(() => {
    const { year, month } = calMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    // Convert Sunday=0 to Monday-first: Sun becomes 6
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    const cells: (number | null)[] = Array.from({ length: totalCells }, (_, i) => {
      const d = i - startOffset + 1;
      return d >= 1 && d <= daysInMonth ? d : null;
    });
    return cells;
  }, [calMonth]);

  const eventsByDay = useCallback(
    (day: number) => {
      const { year, month } = calMonth;
      const key = `${year}-${padDate(month + 1)}-${padDate(day)}`;
      return events.filter((e) => e.date === key);
    },
    [events, calMonth]
  );

  const monthLabel = useMemo(() => {
    const d = new Date(calMonth.year, calMonth.month, 1);
    return d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  }, [calMonth]);

  function prevMonth() {
    setCalMonth(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );
    setSelectedDay(null);
  }

  function nextMonth() {
    setCalMonth(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );
    setSelectedDay(null);
  }

  function goToday() {
    const n = new Date();
    setCalMonth({ year: n.getFullYear(), month: n.getMonth() });
    setSelectedDay(null);
  }

  const statusColor: Record<string, string> = {
    pendiente: 'bg-gray-100 text-gray-600',
    'en-proceso': 'bg-blue-50 text-blue-700',
    listo: 'bg-[#e8ff40] text-[#0c1f36]',
    publicado: 'bg-green-100 text-green-700',
    medido: 'bg-purple-50 text-purple-700',
    archivado: 'bg-gray-50 text-gray-400',
  };

  // ---- sub-componente de tarjeta de evento ----
  function EventCard({
    ev,
    showMarkPublished = true,
  }: {
    ev: CalendarEvent;
    showMarkPublished?: boolean;
  }) {
    return (
      <div
        className={`rounded-xl border bg-card p-4 flex items-start gap-3 ${ev.date < today && ev.status !== 'publicado' ? 'border-red-200' : 'border-border'}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-medium text-sm text-primary truncate">{ev.title}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[ev.status] || 'bg-gray-100 text-gray-600'}`}
            >
              {ev.status}
            </span>
            {ev.channel && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {ev.channel}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {weekLabel(ev.date)}
            {ev.time ? ` · ${ev.time}` : ''} · {ev.type}
          </p>
          {ev.notes && <p className="text-xs text-muted-foreground mt-1 truncate">{ev.notes}</p>}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {showMarkPublished && ev.status !== 'publicado' && (
            <Button
              size="sm"
              variant="ghost"
              className="text-green-700 hover:text-green-900 text-xs h-7"
              onClick={() => handleMarkPublished(ev.id)}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Publicado
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive h-7"
            onClick={() => handleDelete(ev.id)}
          >
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
              onClick={() => setView('semanal')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border-x border-border ${view === 'semanal' ? 'bg-[#e8ff40] text-[#0c1f36]' : 'bg-background text-muted-foreground hover:bg-muted'}`}
            >
              Semanal
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
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          'publicacion',
                          'distribucion',
                          'produccion',
                          'grabacion',
                          'edicion',
                          'medicion',
                          'revision',
                          'monetizacion',
                        ].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Canal" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          'Spotify',
                          'Instagram',
                          'TikTok',
                          'YouTube Shorts',
                          'Threads',
                          'Email',
                          'WhatsApp',
                        ].map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['pendiente', 'en-proceso', 'listo', 'publicado'].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
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
                  <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Agendar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : view === 'operativo' ? (
        <div className="space-y-8">
          {/* SIGUIENTE ACCION */}
          {siguienteAccion && (
            <div className="rounded-xl border border-[#e8ff40]/60 bg-[#e8ff40]/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4 text-[#0c1f36]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#0c1f36]">
                  Siguiente accion
                </span>
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
                <p className="text-sm text-muted-foreground">
                  No hay publicaciones agendadas para hoy
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 text-xs"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agendar para hoy
                </Button>
              </div>
            ) : (
              <div className="grid gap-2">
                {secHoy.map((ev) => (
                  <EventCard key={ev.id} ev={ev} />
                ))}
              </div>
            )}
          </div>

          {/* ATRASADAS */}
          {secAtrasadas.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-red-600">
                  Atrasadas
                </h2>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  {secAtrasadas.length}
                </span>
              </div>
              <div className="grid gap-2">
                {secAtrasadas.map((ev) => (
                  <EventCard key={ev.id} ev={ev} />
                ))}
              </div>
            </div>
          )}

          {/* PROXIMAS 7 DIAS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock3 className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
                Proximos 7 dias
              </h2>
            </div>
            {secProximas.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Sin publicaciones agendadas esta semana
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 text-xs"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agendar
                </Button>
              </div>
            ) : (
              <div className="grid gap-2">
                {secProximas.map((ev) => (
                  <EventCard key={ev.id} ev={ev} />
                ))}
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
                  {Object.entries(cargaSemanal)
                    .sort()
                    .map(([date, count]) => (
                      <div key={date} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{weekLabel(date)}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            count >= 3
                              ? 'bg-red-100 text-red-700'
                              : count === 2
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {count} evento{count > 1 ? 's' : ''}
                        </span>
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
                  {huecos.slice(0, 5).map((d) => (
                    <div key={d} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{weekLabel(d)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-6"
                        onClick={() => {
                          setForm((f) => ({ ...f, date: d }));
                          setDialogOpen(true);
                        }}
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
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Publicadas
              </h2>
              <span className="text-xs text-muted-foreground">{secPublicadas.length} total</span>
            </div>
            {secPublicadas.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                Ninguna publicacion marcada como completada todavia
              </p>
            ) : (
              <div className="grid gap-2">
                {secPublicadas.slice(0, 5).map((ev) => (
                  <EventCard key={ev.id} ev={ev} showMarkPublished={false} />
                ))}
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
              <p className="text-sm text-muted-foreground mb-4">
                Agenda tu primera publicacion. Cada semana necesita al menos un punto de
                distribucion.
              </p>
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
      ) : view === 'semanal' ? (
        // VISTA SEMANAL — grid 7 columnas por día
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setWeekStart(addDays(weekStart, -7))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs px-3"
                onClick={() => setWeekStart(getMondayOfWeek(todayStr()))}
              >
                Hoy
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setWeekStart(addDays(weekStart, 7))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {dayMonthLabel(weekStart)} – {dayMonthLabel(addDays(weekStart, 6))}
            </p>
          </div>
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <div className="grid grid-cols-7 gap-1.5 min-w-[560px]">
              {weekDays.map((date, i) => {
                const dayNum = parseInt(date.slice(8, 10));
                const isToday = date === today;
                const dayEvs = weekEvsByDate[date] ?? [];
                return (
                  <div
                    key={date}
                    className={`rounded-xl border flex flex-col ${isToday ? 'border-[#e8ff40] bg-[#e8ff40]/5' : 'border-border bg-card'}`}
                  >
                    <div
                      className={`text-center py-2 border-b ${isToday ? 'border-[#e8ff40]/40' : 'border-border'}`}
                    >
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {DAYS_ES[i]}
                      </span>
                      <span
                        className={`block text-lg font-bold leading-tight ${isToday ? 'text-[#0c1f36]' : 'text-foreground'}`}
                      >
                        {dayNum}
                      </span>
                    </div>
                    <div className="flex-1 p-1.5 space-y-1.5 min-h-[140px]">
                      {dayEvs.map((ev) => (
                        <div
                          key={ev.id}
                          className={`group relative rounded-lg p-1.5 ${TYPE_COLOR[ev.type] || 'bg-gray-100 text-gray-600'}`}
                        >
                          <p className="text-[11px] font-medium leading-tight line-clamp-2 pr-5">
                            {ev.title}
                          </p>
                          {ev.time && <p className="text-[10px] opacity-60 mt-0.5">{ev.time}</p>}
                          {ev.channel && <p className="text-[10px] opacity-60">{ev.channel}</p>}
                          <div className="absolute top-1 right-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {ev.status !== 'publicado' && (
                              <button
                                onClick={() => handleMarkPublished(ev.id)}
                                title="Marcar publicado"
                                className="rounded p-0.5 bg-white/50 hover:bg-white/80 text-green-700"
                              >
                                <CheckCircle2 className="h-2.5 w-2.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(ev.id)}
                              title="Eliminar"
                              className="rounded p-0.5 bg-white/50 hover:bg-white/80 text-red-500"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setForm((f) => ({ ...f, date }));
                          setDialogOpen(true);
                        }}
                        className="w-full flex items-center justify-center h-6 rounded-lg border border-dashed border-border hover:border-primary hover:bg-muted/40 text-muted-foreground hover:text-primary transition-all"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // VISTA POR MES — grid real 7 columnas
        <div className="space-y-4">
          {/* Navegación */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={prevMonth} className="h-8 w-8 p-0">
                ‹
              </Button>
              <span className="text-sm font-semibold capitalize min-w-[160px] text-center">
                {monthLabel}
              </span>
              <Button size="sm" variant="outline" onClick={nextMonth} className="h-8 w-8 p-0">
                ›
              </Button>
            </div>
            <Button size="sm" variant="ghost" onClick={goToday} className="text-xs">
              Hoy
            </Button>
          </div>

          {/* Grid */}
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Cabecera días */}
            <div className="grid grid-cols-7 border-b border-border">
              {DAYS_ES.map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-xs font-semibold text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Celdas */}
            <div className="grid grid-cols-7">
              {calGrid.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-border/50 bg-muted/20" />;
                }
                const dateStr = `${calMonth.year}-${padDate(calMonth.month + 1)}-${padDate(day)}`;
                const dayEvents = eventsByDay(day);
                const isToday = dateStr === todayStr();
                const isSelected = selectedDay === dateStr;
                const isPast = dateStr < todayStr();
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                    className={`min-h-[80px] border-b border-r border-border/50 p-1.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#0c1f36]/5'
                        : isPast
                          ? 'bg-muted/10 hover:bg-muted/20'
                          : 'hover:bg-muted/30'
                    }`}
                  >
                    <div
                      className={`text-xs font-semibold mb-1 h-5 w-5 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-[#0c1f36] text-white'
                          : isPast
                            ? 'text-muted-foreground'
                            : 'text-foreground'
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`truncate text-[10px] px-1 py-0.5 rounded font-medium ${TYPE_COLOR[ev.type] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[10px] text-muted-foreground px-1">
                          +{dayEvents.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel del día seleccionado */}
          {selectedDay && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {weekLabel(selectedDay)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {eventsByDay(parseInt(selectedDay.slice(8))).length === 0 ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Sin eventos este día</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setForm((f) => ({ ...f, date: selectedDay }));
                        setDialogOpen(true);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Agendar
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {eventsByDay(parseInt(selectedDay.slice(8))).map((ev) => (
                      <EventCard key={ev.id} ev={ev} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Empty state si no hay eventos en el mes */}
          {events.length === 0 && (
            <div className="text-center py-12">
              <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="text-sm text-muted-foreground mb-3">Sin eventos registrados</p>
              <Button
                className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agendar
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
