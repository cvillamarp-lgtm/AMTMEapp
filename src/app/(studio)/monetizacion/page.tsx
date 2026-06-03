'use client';
import { useState, useEffect } from 'react';
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
import { Plus, Pencil, Sparkles, Loader2, Copy, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import {
  getMonetizationLeads,
  createMonetizationLead,
  updateMonetizationLead,
} from '@/lib/database';
import type { MonetizationLead, LeadStatus } from '@/types/database';
import { callAI } from '@/lib/ai-studio';

const SERVICIOS_DISPONIBLES = [
  {
    nombre: 'Lectura de tarot simbolica',
    descripcion: 'Sesion individual para explorar un area de vida — amor, identidad, transicion.',
    precio: 'Definido por sesion',
    canal: 'DM de Instagram',
  },
  {
    nombre: 'Sesion de acompanamiento',
    descripcion: 'Conversacion estructurada para clarificar un momento de confusion o cambio.',
    precio: 'Definido por sesion',
    canal: 'DM de Instagram',
  },
];

const CTA_SUAVES = [
  'Si esto resuena contigo, escríbeme por DM.',
  'Puedo acompañarte en esto. Escríbeme cuando quieras.',
  'Si quieres explorar esto más a fondo, podemos hablar.',
  'Hay un espacio para esto. Escríbeme si te interesa.',
];

export default function MonetizacionPage() {
  const [leads, setLeads] = useState<MonetizationLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<Record<string, string>>({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<MonetizationLead | null>(null);
  const [form, setForm] = useState({
    name: '',
    source: '',
    contact: '',
    status: 'nuevo-lead' as LeadStatus,
    offer: '',
    potential_value: 0,
    real_revenue: 0,
    close_probability: 50,
    next_action: '',
    notes: '',
  });

  useEffect(() => {
    load();
  }, []);
  async function load() {
    try {
      const d = await getMonetizationLeads();
      setLeads(d);
    } catch {
      toast.error('Error al cargar leads');
    } finally {
      setLoading(false);
    }
  }
  function resetForm() {
    setForm({
      name: '',
      source: '',
      contact: '',
      status: 'nuevo-lead',
      offer: '',
      potential_value: 0,
      real_revenue: 0,
      close_probability: 50,
      next_action: '',
      notes: '',
    });
    setEditing(null);
  }
  function handleEdit(l: MonetizationLead) {
    setEditing(l);
    setForm({
      name: l.name,
      source: l.source,
      contact: l.contact,
      status: l.status,
      offer: l.offer,
      potential_value: l.potential_value,
      real_revenue: l.real_revenue,
      close_probability: l.close_probability,
      next_action: l.next_action,
      notes: l.notes || '',
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.source || !form.offer) {
      toast.error('Completa nombre, fuente y oferta');
      return;
    }
    try {
      if (editing) {
        await updateMonetizationLead(editing.id, form);
        toast.success('Lead actualizado');
      } else {
        await createMonetizationLead({
          ...form,
          follow_up_date: null,
          conversion_origin: null,
          episode_id: null,
          content_id: null,
        });
        toast.success('Lead creado');
      }
      setDialogOpen(false);
      resetForm();
      await load();
    } catch {
      toast.error('Error al guardar');
    }
  }

  async function generateFollowUp(l: MonetizationLead) {
    setGeneratingId(l.id);
    try {
      const prompt = `Genera el mensaje de seguimiento exacto para este lead de AMTME:

Nombre: ${l.name}
Oferta: ${l.offer}
Fuente: ${l.source}
Estado actual: ${l.status}
Valor potencial: $${l.potential_value}
Próxima acción registrada: ${l.next_action || 'no definida'}

Contexto AMTME: podcast de acompañamiento emocional para hombres, lecturas de tarot simbólico, voz cercana y directa, nunca vendedora ni insistente.

Devuelve exactamente:
[MENSAJE] - El mensaje completo listo para enviar por DM de Instagram (máximo 4 frases, tono natural, sin emojis excesivos)
[NEXT] - El siguiente paso concreto después de este mensaje`;

      const result = await callAI(prompt, 'Monetización');
      const extract = (tag: string) => {
        const regex = new RegExp('\\[' + tag + '\\]\\s*[-–]?\\s*([\\s\\S]*?)(?=\\[|$)', 'i');
        const match = result.match(regex);
        return match ? match[1].trim() : '';
      };
      const mensaje = extract('MENSAJE');
      const next = extract('NEXT');
      setAiMessages((prev) => ({ ...prev, [l.id]: mensaje }));
      if (next) {
        await updateMonetizationLead(l.id, { next_action: next });
        await load();
      }
      toast.success('Mensaje generado');
    } catch (e: unknown) {
      toast.error((e as Error).message || 'Error al generar');
    } finally {
      setGeneratingId(null);
    }
  }

  const active = leads.filter((l) => !['pagado', 'entregado', 'perdido'].includes(l.status));
  const won = leads.filter((l) => ['pagado', 'entregado'].includes(l.status));
  const totalRevenue = won.reduce((s, l) => s + l.real_revenue, 0);
  const closeRate = leads.length > 0 ? ((won.length / leads.length) * 100).toFixed(1) : '0';
  const pendingFollowUp = leads.filter(
    (l) => !['pagado', 'entregado', 'perdido'].includes(l.status) && !l.next_action
  );
  const urgente = pendingFollowUp[0] || null;

  const statusColor: Record<string, string> = {
    pagado: 'bg-[#e8ff40] text-[#0c1f36]',
    entregado: 'bg-green-100 text-green-800',
    perdido: 'bg-red-100 text-red-800',
    interesado: 'bg-blue-100 text-blue-800',
    'oferta-enviada': 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Monetizacion</h1>
          <p className="text-sm text-muted-foreground mt-1">Pipeline comercial y acompanamiento</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar lead' : 'Crear lead'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Fuente *</Label>
                  <Input
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                    placeholder="Instagram DM"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Estado</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v as LeadStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        'nuevo-lead',
                        'conversacion-iniciada',
                        'interesado',
                        'oferta-enviada',
                        'sesion-agendada',
                        'pagado',
                        'entregado',
                        'seguimiento',
                        'perdido',
                      ].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Oferta *</Label>
                  <Input
                    value={form.offer}
                    onChange={(e) => setForm({ ...form, offer: e.target.value })}
                    placeholder="Lectura tarot simbólica"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valor potencial</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.potential_value}
                    onChange={(e) =>
                      setForm({ ...form, potential_value: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Ingreso real</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.real_revenue}
                    onChange={(e) =>
                      setForm({ ...form, real_revenue: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Próxima acción</Label>
                <Textarea
                  value={form.next_action}
                  onChange={(e) => setForm({ ...form, next_action: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label>Notas</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editing ? 'Guardar' : 'Crear lead'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Panel de oportunidad de hoy */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* Oportunidad activa */}
        <Card className="border-[#e8ff40]/40 bg-[#e8ff40]/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#0c1f36]" />
              <CardTitle className="text-base">Oportunidad de hoy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {urgente ? (
              <>
                <p className="text-sm font-medium text-[#0c1f36]">{urgente.name}</p>
                <p className="text-xs text-muted-foreground">{urgente.offer} — sin proxima accion definida</p>
                <Button
                  size="sm"
                  className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] text-xs mt-1"
                  onClick={() => handleEdit(urgente)}
                >
                  Definir siguiente paso
                </Button>
              </>
            ) : active.length > 0 ? (
              <p className="text-sm text-muted-foreground">Todos los leads activos tienen siguiente paso. Buen ritmo.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Sin leads activos. Cuando llegue un interes, registralo aqui.</p>
            )}
          </CardContent>
        </Card>

        {/* CTA suave recomendado */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">CTA suave para hoy</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#0c1f36] leading-relaxed">
              {CTA_SUAVES[new Date().getDay() % CTA_SUAVES.length]}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Rotacion diaria — para usar al cierre de contenido o en DM.</p>
          </CardContent>
        </Card>
      </div>

      {/* Servicios disponibles */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Servicios disponibles</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {SERVICIOS_DISPONIBLES.map((s) => (
            <Card key={s.nombre} className="border-border/50">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm font-semibold text-[#0c1f36]">{s.nombre}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.descripcion}</p>
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{s.precio}</span>
                  <span>·</span>
                  <span>{s.canal}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Leads activos</CardDescription>
            <CardTitle className="text-3xl">{active.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ingresos totales</CardDescription>
            <CardTitle className="text-3xl">${totalRevenue.toFixed(0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Tasa de cierre</CardDescription>
            <CardTitle className="text-3xl">{closeRate}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Seguimiento pendiente */}
      {pendingFollowUp.length > 1 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">{pendingFollowUp.length} leads sin siguiente paso</span>
          </div>
          <p className="text-xs text-amber-700">Define la proxima accion para cada uno. No hace falta apresurarse, pero si tener claridad.</p>
        </div>
      )}

      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Pipeline de leads</h2>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Cargando...</div>
      ) : leads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-2">Sin leads registrados</p>
            <p className="text-xs text-muted-foreground mb-4">Cuando alguien exprese interes en un servicio, registralo aqui para darle seguimiento.</p>
            <Button
              className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a]"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Registrar primer lead
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {leads.map((l) => (
            <Card key={l.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{l.name}</CardTitle>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[l.status] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {l.status}
                      </span>
                    </div>
                    <CardDescription>
                      {l.offer} · {l.source}
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(l)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Potencial: </span>${l.potential_value}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Real: </span>${l.real_revenue}
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Siguiente paso: </span>
                    {l.next_action ? (
                      <span className="text-[#0c1f36]">{l.next_action}</span>
                    ) : (
                      <span className="text-amber-600 font-medium">Sin definir — requiere atencion</span>
                    )}
                  </div>
                </div>
                {aiMessages[l.id] && (
                  <div className="mt-3 p-3 rounded-lg bg-muted/40 text-sm">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Mensaje generado:</p>
                    <p className="text-[#0c1f36] leading-relaxed">{aiMessages[l.id]}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2 h-7 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(aiMessages[l.id]);
                        toast.success('Copiado');
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copiar
                    </Button>
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled={generatingId === l.id}
                    onClick={() => generateFollowUp(l)}
                  >
                    {generatingId === l.id ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    Generar mensaje de seguimiento
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
