'use client'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/shadcn/dialog'
import { Plus, Pencil, Trash2, FileText, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getScripts, createScript, updateScript, deleteScript } from '@/lib/database'
import { callAI } from '@/lib/ai-studio'
import type { Script, ScriptStatus } from '@/types/database'

const blocks = [
  { key: 'opening', label: 'Apertura' },
  { key: 'threshold', label: 'Umbral' },
  { key: 'wound', label: 'Herida' },
  { key: 'symbol', label: 'Símbolo' },
  { key: 'truth', label: 'Verdad' },
  { key: 'bridge', label: 'Puente' },
  { key: 'action', label: 'Acción' },
  { key: 'closing', label: 'Cierre' },
]

export default function GuionesPage() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewing, setViewing] = useState<Script | null>(null)
  const [editing, setEditing] = useState<Script | null>(null)
  const [generating, setGenerating] = useState(false)
  const [form, setForm] = useState({ episode_id: '', title: '', opening: '', threshold: '', wound: '', symbol: '', truth: '', bridge: '', action: '', closing: '', cta: '', voice_notes: '', status: 'borrador' as ScriptStatus })

  useEffect(() => { load() }, [])
  async function load() {
    try { const d = await getScripts(); setScripts(d) } catch { toast.error('Error al cargar') } finally { setLoading(false) }
  }
  function resetForm() { setForm({ episode_id: '', title: '', opening: '', threshold: '', wound: '', symbol: '', truth: '', bridge: '', action: '', closing: '', cta: '', voice_notes: '', status: 'borrador' }); setEditing(null) }
  function handleEdit(s: Script) { setEditing(s); setForm({ episode_id: s.episode_id, title: s.title, opening: s.opening||'', threshold: s.threshold||'', wound: s.wound||'', symbol: s.symbol||'', truth: s.truth||'', bridge: s.bridge||'', action: s.action||'', closing: s.closing||'', cta: s.cta||'', voice_notes: s.voice_notes||'', status: s.status }); setDialogOpen(true) }

  async function generateWithAI() {
    if (!form.title || !form.wound || !form.symbol) {
      toast.error('Completa título, herida y símbolo para generar')
      return
    }
    setGenerating(true)
    try {
      const prompt = `Genera un guion completo para el episodio de AMTME con esta estructura exacta:

Episodio: ${form.episode_id} - "${form.title}"
Herida emocional: ${form.wound}
Símbolo central: ${form.symbol}
${form.cta ? `CTA: ${form.cta}` : ''}

Devuelve el guion dividido en 8 secciones con estas etiquetas exactas:
[APERTURA] - Gancho inicial, pregunta o escena que abre el episodio (3-4 frases)
[UMBRAL] - El momento de quiebre o reconocimiento (3-4 frases)
[HERIDA] - Descripción de la herida emocional central (4-5 frases)
[SÍMBOLO] - El símbolo central y su significado (3-4 frases)
[VERDAD] - La verdad que el episodio revela (4-5 frases)
[PUENTE] - Cómo conectar la verdad con la vida del oyente (3-4 frases)
[ACCIÓN] - Qué puede hacer el oyente con esto (2-3 frases)
[CIERRE] - Frase final memorable (1-2 frases)`

      const result = await callAI(prompt, 'Episodio')

      const extract = (tag: string) => {
        // Ignora asteriscos de markdown antes/despues del tag
        const regex = new RegExp('[*]*\\[' + tag + '\\][*]*[\\s\\-]*([\\s\\S]*?)(?=[*]*\\[|$)', 'i')
        const match = result.match(regex)
        return match ? match[1].replace(/^[-\s]+/, '').trim() : ''
      }

      setForm(f => ({
        ...f,
        opening: extract('APERTURA') || f.opening,
        threshold: extract('UMBRAL') || f.threshold,
        wound: extract('HERIDA') || f.wound,
        symbol: extract('SÍMBOLO') || extract('SIMBOLO') || f.symbol,
        truth: extract('VERDAD') || f.truth,
        bridge: extract('PUENTE') || f.bridge,
        action: extract('ACCIÓN') || extract('ACCION') || f.action,
        closing: extract('CIERRE') || f.closing,
      }))
      toast.success('Guion generado con IA')
    } catch (e: any) {
      toast.error(e.message || 'Error al generar')
    } finally {
      setGenerating(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.episode_id) { toast.error('Completa título e ID de episodio'); return }
    const data = { ...form, opening: form.opening||null, threshold: form.threshold||null, wound: form.wound||null, symbol: form.symbol||null, truth: form.truth||null, bridge: form.bridge||null, action: form.action||null, closing: form.closing||null, cta: form.cta||null, voice_notes: form.voice_notes||null }
    try {
      if (editing) { await updateScript(editing.id, data); toast.success('Guion actualizado') }
      else { await createScript(data); toast.success('Guion creado') }
      setDialogOpen(false); resetForm(); await load()
    } catch { toast.error('Error al guardar') }
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminar?')) return
    try { await deleteScript(id); setScripts(prev => prev.filter(s => s.id !== id)); toast.success('Eliminado') } catch { toast.error('Error') }
  }

  const statusColor: Record<string, string> = { borrador: 'bg-gray-100 text-gray-700', revision: 'bg-yellow-100 text-yellow-800', 'listo-grabar': 'bg-[#e8ff40] text-[#0c1f36]', grabado: 'bg-green-100 text-green-800' }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl md:text-3xl font-semibold">Guiones</h1><p className="text-sm text-muted-foreground mt-1">Estructura narrativa AZTIYARTE</p></div>
        <Dialog open={dialogOpen} onOpenChange={v => { setDialogOpen(v); if (!v) resetForm() }}>
          <DialogTrigger asChild><Button onClick={resetForm} className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"><Plus className="mr-2 h-4 w-4" />Crear guion</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? 'Editar guion' : 'Crear guion'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Título *</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="El momento que lo cambia todo" /></div>
                <div><Label>ID Episodio *</Label><Input value={form.episode_id} onChange={e => setForm({...form, episode_id: e.target.value})} placeholder="EP35" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Herida emocional</Label><Input value={form.wound} onChange={e => setForm({...form, wound: e.target.value})} placeholder="miedo al abandono" /></div>
                <div><Label>Símbolo central</Label><Input value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value})} placeholder="la puerta cerrada" /></div>
              </div>
              <div><Label>CTA</Label><Input value={form.cta} onChange={e => setForm({...form, cta: e.target.value})} /></div>

              <Button type="button" onClick={generateWithAI} disabled={generating} className="w-full bg-[#0c1f36] text-white hover:bg-[#1a3a5c]">
                {generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generando con IA...</> : <><Sparkles className="mr-2 h-4 w-4" />Generar guion completo con IA</>}
              </Button>

              {blocks.map(b => (
                <div key={b.key}><Label>{b.label}</Label><Textarea value={(form as any)[b.key]} onChange={e => setForm({...form, [b.key]: e.target.value})} rows={3} /></div>
              ))}
              <div><Label>Notas de voz</Label><Textarea value={form.voice_notes} onChange={e => setForm({...form, voice_notes: e.target.value})} rows={2} /></div>
              <div><Label>Estado</Label>
                <Select value={form.status} onValueChange={v => setForm({...form, status: v as ScriptStatus})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['borrador','revision','listo-grabar','grabado','archivado'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <DialogFooter><Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancelar</Button><Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {viewing && (
        <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{viewing.title}</DialogTitle></DialogHeader>
            <div className="space-y-4 text-sm">
              {blocks.map(b => (viewing as any)[b.key] && (
                <div key={b.key} className="border-l-2 border-[#e8ff40] pl-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">{b.label}</p>
                  <p className="whitespace-pre-wrap">{(viewing as any)[b.key]}</p>
                </div>
              ))}
              {viewing.cta && <div className="border-l-2 border-[#0c1f36] pl-4"><p className="text-xs font-semibold text-muted-foreground uppercase mb-1">CTA</p><p>{viewing.cta}</p></div>}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {loading ? <div className="text-center py-12 text-muted-foreground">Cargando...</div> : scripts.length === 0 ? (
        <div className="text-center py-16"><FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Sin guiones</p><Button className="mt-4 bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]" onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Crear primero</Button></div>
      ) : (
        <div className="grid gap-4">
          {scripts.map(s => (
            <Card key={s.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{s.title}</CardTitle>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[s.status] || 'bg-gray-100 text-gray-700'}`}>{s.status}</span>
                    </div>
                    <CardDescription>EP: {s.episode_id} · v{s.version}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setViewing(s)}><FileText className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(s)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              {s.opening && <CardContent><p className="text-sm text-muted-foreground line-clamp-2">{s.opening}</p></CardContent>}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
