'use client'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/shadcn/dialog'
import { Plus, Trash2, CalendarDays } from 'lucide-react'
import { toast } from 'sonner'
import { getCalendarEvents, createCalendarEvent, deleteCalendarEvent } from '@/lib/database'
import type { CalendarEvent, EventType, EventStatus } from '@/types/database'

export default function CalendarioPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'produccion' as EventType, date: '', time: '', frequency: '', channel: '', status: 'pendiente' as EventStatus, notes: '', episode_id: null as string|null, content_id: null as string|null })

  useEffect(() => { load() }, [])
  async function load() {
    try { const d = await getCalendarEvents(); setEvents(d) } catch { toast.error('Error al cargar') } finally { setLoading(false) }
  }
  function resetForm() { setForm({ title: '', type: 'produccion', date: '', time: '', frequency: '', channel: '', status: 'pendiente', notes: '', episode_id: null, content_id: null }) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.date) { toast.error('Completa título y fecha'); return }
    try {
      await createCalendarEvent({ ...form, time: form.time || null, frequency: form.frequency || null, channel: form.channel || null, notes: form.notes || null })
      toast.success('Evento creado'); setDialogOpen(false); resetForm(); await load()
    } catch { toast.error('Error al guardar') }
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminar?')) return
    try { await deleteCalendarEvent(id); setEvents(prev => prev.filter(e => e.id !== id)); toast.success('Eliminado') } catch { toast.error('Error') }
  }

  const statusColor: Record<string, string> = { pendiente: 'bg-gray-100 text-gray-700', 'en-proceso': 'bg-blue-100 text-blue-800', listo: 'bg-[#e8ff40] text-[#0c1f36]', publicado: 'bg-green-100 text-green-800' }
  const grouped = events.reduce((acc, ev) => { const m = ev.date.slice(0,7); if (!acc[m]) acc[m] = []; acc[m].push(ev); return acc }, {} as Record<string, CalendarEvent[]>)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl md:text-3xl font-semibold">Calendario</h1><p className="text-sm text-muted-foreground mt-1">Planificación editorial</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button onClick={resetForm} className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"><Plus className="mr-2 h-4 w-4" />Crear evento</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Crear evento</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Título</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Publicar EP.35" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Fecha</Label><Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
                <div><Label>Hora</Label><Input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Tipo</Label>
                  <Select value={form.type} onValueChange={v => setForm({...form, type: v as EventType})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{['produccion','grabacion','edicion','publicacion','distribucion','medicion','revision','monetizacion'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Estado</Label>
                  <Select value={form.status} onValueChange={v => setForm({...form, status: v as EventStatus})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{['pendiente','en-proceso','listo','publicado','medido'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Canal</Label><Input value={form.channel} onChange={e => setForm({...form, channel: e.target.value})} placeholder="Spotify, Instagram..." /></div>
              <div><Label>Notas</Label><Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
              <DialogFooter><Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancelar</Button><Button type="submit">Crear</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? <div className="text-center py-12 text-muted-foreground">Cargando...</div> : events.length === 0 ? (
        <div className="text-center py-16"><CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Sin eventos</p><Button className="mt-4 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]" onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Crear primero</Button></div>
      ) : (
        <div className="space-y-8">
          {Object.keys(grouped).sort().map(month => (
            <div key={month}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{month}</h2>
              <div className="grid gap-3">
                {grouped[month].map(ev => (
                  <Card key={ev.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{ev.title}</CardTitle>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[ev.status] || 'bg-gray-100 text-gray-700'}`}>{ev.status}</span>
                          </div>
                          <CardDescription className="mt-0.5">{ev.date}{ev.time ? ` · ${ev.time}` : ''} · {ev.type}</CardDescription>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(ev.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardHeader>
                    {ev.notes && <CardContent className="pt-0"><p className="text-sm text-muted-foreground">{ev.notes}</p></CardContent>}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}