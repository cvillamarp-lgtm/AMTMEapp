'use client'
import { useState, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOptimisticList } from '@/hooks/use-optimistic-list'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/shadcn/dialog'
import { Plus, Pencil, Trash2, Search, Image } from 'lucide-react'
import { toast } from 'sonner'
import { getContentPieces, createContentPiece, updateContentPiece, deleteContentPiece } from '@/lib/database'
import type { ContentPiece, Channel, ContentFormat, ContentStatus } from '@/types/database'

export default function ContenidoPage() {
  const { items, setItems, optimisticUpdate, optimisticCreate, optimisticRemove } = useOptimisticList<ContentPiece>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ContentPiece | null>(null)
  const [search, setSearch] = useState('')
  const [channelFilter, setChannelFilter] = useState<Channel | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')
  const [form, setForm] = useState({ channel: '' as Channel, format: '' as ContentFormat, theme: '', hook: '', main_text: '', cta: '', status: 'borrador' as ContentStatus })

  const filtered = useMemo(() => items.filter(c => {
    const matchSearch = search === '' || c.theme.toLowerCase().includes(search.toLowerCase()) || c.hook.toLowerCase().includes(search.toLowerCase())
    return matchSearch && (channelFilter === 'all' || c.channel === channelFilter) && (statusFilter === 'all' || c.status === statusFilter)
  }), [items, search, channelFilter, statusFilter])

  useEffect(() => { load() }, [])
  async function load() {
    try { const d = await getContentPieces(); setItems(d) } catch { toast.error('Error al cargar contenido') } finally { setLoading(false) }
  }
  function resetForm() { setForm({ channel: '' as Channel, format: '' as ContentFormat, theme: '', hook: '', main_text: '', cta: '', status: 'borrador' }); setEditing(null) }
  function handleEdit(c: ContentPiece) { setEditing(c); setForm({ channel: c.channel, format: c.format, theme: c.theme, hook: c.hook, main_text: c.main_text, cta: c.cta, status: c.status }); setDialogOpen(true) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.channel || !form.format || !form.theme || !form.hook || !form.main_text || !form.cta) { toast.error('Completa los campos obligatorios'); return }
    setDialogOpen(false); resetForm()
    if (editing) {
      await optimisticUpdate(editing.id, form, () => updateContentPiece(editing.id, form)); toast.success('Contenido actualizado')
    } else {
      const full = { ...form, emotion: null, objective: null, visual_prompt: null, caption: null, publish_date: null, episode_id: null, metric_goal: null }
      const temp = { id: crypto.randomUUID(), user_id: 'temp', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...full } as ContentPiece
      await optimisticCreate(temp, () => createContentPiece(full)); toast.success('Contenido creado')
    }
  }
  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar?')) return
    await optimisticRemove(id, () => deleteContentPiece(id)); toast.success('Eliminado')
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl md:text-3xl font-semibold">Contenido</h1><p className="text-sm text-muted-foreground mt-1">Gestión multicanal</p></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button onClick={resetForm} className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"><Plus className="mr-2 h-4 w-4" />Crear contenido</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? 'Editar contenido' : 'Crear contenido'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Canal *</Label>
                  <Select value={form.channel} onValueChange={v => setForm({...form, channel: v as Channel})}>
                    <SelectTrigger><SelectValue placeholder="Canal" /></SelectTrigger>
                    <SelectContent>{['instagram','tiktok','youtube-shorts','threads','spotify','email'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Formato *</Label>
                  <Select value={form.format} onValueChange={v => setForm({...form, format: v as ContentFormat})}>
                    <SelectTrigger><SelectValue placeholder="Formato" /></SelectTrigger>
                    <SelectContent>{['reel','carrusel','story','short','post-texto','email'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Tema *</Label><Input value={form.theme} onChange={e => setForm({...form, theme: e.target.value})} /></div>
              <div><Label>Hook *</Label><Textarea value={form.hook} onChange={e => setForm({...form, hook: e.target.value})} rows={2} /></div>
              <div><Label>Texto principal *</Label><Textarea value={form.main_text} onChange={e => setForm({...form, main_text: e.target.value})} rows={4} /></div>
              <div><Label>CTA *</Label><Textarea value={form.cta} onChange={e => setForm({...form, cta: e.target.value})} rows={2} /></div>
              <div><Label>Estado</Label>
                <Select value={form.status} onValueChange={v => setForm({...form, status: v as ContentStatus})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['borrador','listo','publicado','medido'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <DialogFooter><Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancelar</Button><Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 grid md:grid-cols-[1fr_auto_auto] gap-4">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" /><Input type="search" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
        <Select value={channelFilter} onValueChange={v => setChannelFilter(v as Channel | 'all')}><SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos los canales</SelectItem>{['instagram','tiktok','youtube-shorts','threads','spotify','email'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as ContentStatus | 'all')}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem>{['borrador','listo','publicado','medido'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
      </div>

      {loading ? <div className="text-center py-12 text-muted-foreground">Cargando...</div> : filtered.length === 0 ? (
        <div className="text-center py-16"><Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Sin contenido todavía</p><Button className="mt-4 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]" onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Crear primer contenido</Button></div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(c => (
              <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Card><CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{c.theme}</CardTitle>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{c.channel}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{c.format}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === 'publicado' ? 'bg-[#e8ff40] text-[#0c1f36]' : 'bg-gray-100 text-gray-700'}`}>{c.status}</span>
                      </div>
                      <CardDescription>{c.hook}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent><div className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground">Texto: </span>{c.main_text.substring(0, 120)}{c.main_text.length > 120 ? '...' : ''}</div>
                  <div><span className="text-muted-foreground">CTA: </span>{c.cta}</div>
                </div></CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
