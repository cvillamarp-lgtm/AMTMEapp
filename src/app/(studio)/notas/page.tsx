'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Pin, Trash2, Plus, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type Note = {
  id: string
  user_id: string | null
  created_at: string
  updated_at: string
  title: string
  content: string
  category: string
  status: string
  pinned: boolean
}

const CATEGORIES = ['general', 'episodio', 'estrategia', 'monetizacion', 'técnico', 'reflexion']
const STATUS_OPTIONS = ['activa', 'archivada', 'pendiente']

async function getNotes(): Promise<Note[]> {
  const sb = getSupabaseBrowserClient() as any
  if (!sb) return []
  const { data, error } = await sb.from('notes').select('*').is('user_id', null).order('pinned', { ascending: false }).order('updated_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return (data || []).map((r: any) => ({
    id: r.id, user_id: r.user_id, created_at: r.created_at, updated_at: r.updated_at,
    ...r.payload
  }))
}

async function saveNote(id: string | null, data: Partial<Note>): Promise<Note> {
  const sb = getSupabaseBrowserClient() as any
  const payload = { title: data.title, content: data.content, category: data.category, status: data.status, pinned: data.pinned ?? false }
  if (id) {
    const { data: row, error } = await sb.from('notes').update({ payload, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return { id: row.id, user_id: row.user_id, created_at: row.created_at, updated_at: row.updated_at, ...row.payload }
  } else {
    const { data: row, error } = await sb.from('notes').insert([{ user_id: null, payload }]).select().single()
    if (error) throw error
    return { id: row.id, user_id: row.user_id, created_at: row.created_at, updated_at: row.updated_at, ...row.payload }
  }
}

async function deleteNote(id: string) {
  const sb = getSupabaseBrowserClient() as any
  const { error } = await sb.from('notes').delete().eq('id', id)
  if (error) throw error
}

export default function NotasPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Note | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState({ title: '', content: '', category: 'general', status: 'activa', pinned: false })

  useEffect(() => { load() }, [])

  async function load() {
    try { const data = await getNotes(); setNotes(data) }
    catch { toast.error('Error al cargar notas') }
    finally { setLoading(false) }
  }

  const filtered = useMemo(() => notes.filter(n => {
    const matchQ = !search || n.title?.toLowerCase().includes(search.toLowerCase()) || n.content?.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || n.category === categoryFilter
    return matchQ && matchCat
  }), [notes, search, categoryFilter])

  function select(n: Note) {
    setSelected(n)
    setDraft({ title: n.title || '', content: n.content || '', category: n.category || 'general', status: n.status || 'activa', pinned: n.pinned || false })
    setEditing(false)
  }

  async function handleNew() {
    const newDraft = { title: 'Nueva nota', content: '', category: 'general', status: 'activa', pinned: false }
    setSaving(true)
    try {
      const created = await saveNote(null, newDraft)
      setNotes(prev => [created, ...prev])
      setSelected(created)
      setDraft(newDraft)
      setEditing(true)
    } catch { toast.error('Error al crear nota') }
    finally { setSaving(false) }
  }

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    try {
      const updated = await saveNote(selected.id, draft)
      setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
      setSelected(updated)
      setEditing(false)
      toast.success('Nota guardada')
    } catch { toast.error('Error al guardar') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta nota?')) return
    try {
      await deleteNote(id)
      setNotes(prev => prev.filter(n => n.id !== id))
      if (selected?.id === id) setSelected(null)
      toast.success('Nota eliminada')
    } catch { toast.error('Error al eliminar') }
  }

  async function togglePin(note: Note) {
    try {
      const updated = await saveNote(note.id, { ...note, pinned: !note.pinned })
      setNotes(prev => prev.map(n => n.id === updated.id ? updated : n).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)))
      if (selected?.id === note.id) setSelected(updated)
    } catch { toast.error('Error al fijar nota') }
  }

  const fmt = (s: string) => new Date(s).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4 overflow-hidden pb-4 p-6 md:p-8">
      {/* Panel izquierdo */}
      <div className="flex w-72 shrink-0 flex-col gap-3">
        <div className="flex gap-2">
          <Input placeholder="Buscar notas..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-sm" />
          <Button onClick={handleNew} disabled={saving} className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] px-3">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="text-sm"><SelectValue placeholder="Categoría" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? <p className="text-xs text-center text-muted-foreground py-4">Cargando...</p>
            : filtered.length === 0 ? <p className="text-xs text-center text-muted-foreground py-8">Sin notas</p>
            : filtered.map(n => (
              <button key={n.id} onClick={() => select(n)}
                className={`w-full rounded-2xl border p-3 text-left transition-all ${selected?.id === n.id ? 'border-[#0c1f36] bg-[#0c1f36] text-white' : 'border-black/7 bg-white hover:bg-[#F5F1E8]'}`}>
                <div className="flex items-start justify-between gap-1">
                  <span className={`truncate text-sm font-semibold ${selected?.id === n.id ? 'text-white' : 'text-[#0c1f36]'}`}>{n.title || 'Sin título'}</span>
                  {n.pinned && <Pin className="h-3 w-3 shrink-0 mt-0.5" />}
                </div>
                <p className={`mt-1 truncate text-xs ${selected?.id === n.id ? 'text-white/60' : 'text-muted-foreground'}`}>{n.content || 'Sin contenido'}</p>
                <p className={`mt-1 text-xs ${selected?.id === n.id ? 'text-white/40' : 'text-muted-foreground/60'}`}>{n.category} · {fmt(n.updated_at)}</p>
              </button>
            ))}
        </div>
      </div>

      {/* Panel derecho — editor */}
      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        {selected ? (
          <>
            <div className="flex items-center justify-between border-b px-5 py-3 gap-2">
              <span className="text-xs text-muted-foreground">{fmt(selected.updated_at)}</span>
              <div className="flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => togglePin(selected)}>
                  <Pin className={`h-4 w-4 ${selected.pinned ? 'fill-current' : ''}`} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(selected.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                {editing ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => { select(selected); setEditing(false) }}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[#0c1f36] text-white">
                      <Save className="h-4 w-4 mr-1" />{saving ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setEditing(true)} className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]">Editar</Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {editing ? (
                <div className="space-y-4">
                  <Input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                    className="border-0 bg-transparent px-0 text-2xl font-bold text-[#0c1f36] focus-visible:ring-0 shadow-none"
                    placeholder="Título" />
                  <div className="flex gap-3">
                    <Select value={draft.category} onValueChange={v => setDraft(d => ({ ...d, category: v }))}>
                      <SelectTrigger className="w-40 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={draft.status} onValueChange={v => setDraft(d => ({ ...d, status: v }))}>
                      <SelectTrigger className="w-36 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <Textarea value={draft.content} onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
                    className="min-h-[400px] border-0 bg-transparent px-0 text-sm focus-visible:ring-0 shadow-none resize-none"
                    placeholder="Escribe aquí..." />
                </div>
              ) : (
                <div className="cursor-text" onClick={() => setEditing(true)}>
                  <h1 className="text-2xl font-bold tracking-tight text-[#0c1f36]">{selected.title}</h1>
                  <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                    <span>{selected.category}</span>
                    <span>·</span>
                    <span>{selected.status}</span>
                  </div>
                  <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#0c1f36]">
                    {selected.content || <span className="italic text-muted-foreground">Haz clic para editar</span>}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground p-8">
            <p className="text-lg font-semibold text-[#0c1f36]">Selecciona una nota</p>
            <p className="text-sm mt-1">o crea una nueva</p>
            <Button className="mt-4 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />Nueva nota
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
