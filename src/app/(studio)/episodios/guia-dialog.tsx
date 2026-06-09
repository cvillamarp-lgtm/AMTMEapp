'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/shadcn/dialog';
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
import { Sparkles, Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Episode, EpisodeStatus, NarrativeStructure } from '@/types/database';

type Variation = {
  label: string;
  title: string;
  theme: string;
  emotional_wound: string;
  central_symbol: string;
  cta: string;
};

type GeneratedFicha = {
  title: string;
  theme: string;
  emotional_wound: string;
  central_symbol: string;
  objective: string;
  cta: string;
  spotify_description: string;
  hooks: string[];
  narrative_structure: NarrativeStructure;
  notes: string;
  variations: Variation[];
};

const EPISODE_STATUSES: EpisodeStatus[] = [
  'idea', 'investigacion', 'guion', 'grabacion',
  'edicion', 'publicado', 'distribuido', 'medido', 'archivado',
];

const NS_LABELS: Record<keyof NarrativeStructure, string> = {
  umbral: 'Identificación del problema',
  herida: 'Exploración interna',
  simbolo: 'Quiebre o revelación',
  verdad: 'Reflexión consciente',
  puente: 'Integración práctica',
  accion: 'Cierre con CTA',
};

const GUIDE_SYSTEM_PROMPT = `Eres la guía editorial de AMTME (A Mí Tampoco Me Explicaron).
Tu función es construir fichas editoriales completas para episodios del pódcast.

TONO OBLIGATORIO:
- Español neutro latinoamericano
- Profundo pero claro y directo
- Emocional sin victimismo ni romantizar el sufrimiento
- Simbólico sin esoterismo vacío
- Terapéutico sin prometer curación
- Humano, acompañante, con salida y poder personal
- Sin frases genéricas de autoayuda
- Sin sonar como gurú
- Sin cursivas ni dramatismo innecesario

ESTRUCTURA NARRATIVA:
umbral (identificación del problema) → herida (exploración interna) → simbolo (quiebre/revelación) → verdad (reflexión consciente) → puente (integración práctica) → accion (cierre con CTA)

Devuelve SOLO JSON válido, sin markdown ni explicaciones.`;

function buildPrompt(inputs: {
  idea: string;
  number: string;
  status: string;
  theme: string;
  intention: string;
  focus: string;
  freeNotes: string;
}): string {
  return `Construye la ficha editorial completa para este episodio de AMTME.

Idea base: ${inputs.idea}
Número: ${inputs.number || 'por definir'}
Estado: ${inputs.status || 'idea'}
Tema: ${inputs.theme || 'inferir desde la idea'}
Intención emocional: ${inputs.intention || 'inferir desde la idea'}
Enfoque personal: ${inputs.focus || 'ninguno'}
Notas libres: ${inputs.freeNotes || 'ninguna'}

Genera exactamente este JSON (sin markdown, sin explicaciones):
{
  "title": "título optimizado del episodio",
  "theme": "tema central en 3-6 palabras",
  "emotional_wound": "herida emocional central que explora el episodio",
  "central_symbol": "símbolo central del episodio (objeto, imagen o metáfora concreta)",
  "objective": "objetivo del episodio en 1 oración directa",
  "cta": "llamada a la acción, primera persona del oyente, no imperativa",
  "spotify_description": "descripción de 150-200 palabras para Spotify, tono íntimo y sobrio, sin autoayuda",
  "hooks": [
    "hook para reel (máx 8 palabras, tensión emocional)",
    "hook para TikTok (máx 8 palabras, pregunta o quiebre)",
    "frase para carrusel (máx 12 palabras, citable)"
  ],
  "narrative_structure": {
    "umbral": "Identificación del problema: 2-3 oraciones",
    "herida": "Exploración interna: 2-3 oraciones",
    "simbolo": "Quiebre o revelación con el símbolo central: 2-3 oraciones",
    "verdad": "Reflexión consciente: 2-3 oraciones",
    "puente": "Integración práctica: 2-3 oraciones",
    "accion": "Cierre con CTA incluido: 2-3 oraciones"
  },
  "notes": "Subtítulo emocional: ...\\nArquetipo emocional: ...\\nPromesa emocional: ...\\nAudiencia: ...\\nDolor principal del oyente: ...\\nPregunta guía: ...\\nPalabras clave: ...\\nDuración sugerida: ...\\nPrioridad: ...\\nTono de grabación: ...\\nNivel de intensidad emocional: ...",
  "variations": [
    {
      "label": "Enfoque emocional",
      "title": "título desde el ángulo emocional",
      "theme": "tema desde el ángulo emocional",
      "emotional_wound": "herida emocional desde este ángulo",
      "central_symbol": "símbolo desde el ángulo emocional",
      "cta": "CTA desde el ángulo emocional"
    },
    {
      "label": "Enfoque psicológico",
      "title": "título desde el ángulo psicológico",
      "theme": "tema desde el ángulo psicológico",
      "emotional_wound": "herida desde el ángulo psicológico",
      "central_symbol": "símbolo desde el ángulo psicológico",
      "cta": "CTA desde el ángulo psicológico"
    },
    {
      "label": "Enfoque simbólico",
      "title": "título desde el ángulo simbólico",
      "theme": "tema desde el ángulo simbólico",
      "emotional_wound": "herida desde el ángulo simbólico",
      "central_symbol": "símbolo desde el ángulo simbólico",
      "cta": "CTA desde el ángulo simbólico"
    }
  ]
}`;
}

async function generateFicha(prompt: string): Promise<GeneratedFicha> {
  const res = await fetch('/api/ia/generar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'groq',
      prompt,
      systemPrompt: GUIDE_SYSTEM_PROMPT,
      mode: 'Episodio',
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.result) throw new Error(data.error || 'Error al generar');
  const clean = (data.result as string).replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as GeneratedFicha;
}

export function EpisodioGuiadoDialog({
  open,
  onOpenChange,
  onSave,
  nextNumber,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ep: Partial<Episode>) => Promise<void>;
  nextNumber: string;
}) {
  const [step, setStep] = useState<'input' | 'generating' | 'review'>('input');

  // Input fields
  const [idea, setIdea] = useState('');
  const [number, setNumber] = useState('');
  const [status, setStatus] = useState<EpisodeStatus>('idea');
  const [inputTheme, setInputTheme] = useState('');
  const [intention, setIntention] = useState('');
  const [focus, setFocus] = useState('');
  const [freeNotes, setFreeNotes] = useState('');

  // Generated data
  const [ficha, setFicha] = useState<GeneratedFicha | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);

  // Editable review fields
  const [editTitle, setEditTitle] = useState('');
  const [editTheme, setEditTheme] = useState('');
  const [editWound, setEditWound] = useState('');
  const [editSymbol, setEditSymbol] = useState('');
  const [editObjective, setEditObjective] = useState('');
  const [editCta, setEditCta] = useState('');
  const [editSpotify, setEditSpotify] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  function resetAll() {
    setStep('input');
    setIdea('');
    setNumber('');
    setStatus('idea');
    setInputTheme('');
    setIntention('');
    setFocus('');
    setFreeNotes('');
    setFicha(null);
    setSelectedVariation(null);
  }

  function populateEditFields(f: GeneratedFicha, variationIdx: number | null) {
    if (variationIdx !== null && f.variations[variationIdx]) {
      const v = f.variations[variationIdx];
      setEditTitle(v.title);
      setEditTheme(v.theme);
      setEditWound(v.emotional_wound);
      setEditSymbol(v.central_symbol);
      setEditCta(v.cta);
    } else {
      setEditTitle(f.title);
      setEditTheme(f.theme);
      setEditWound(f.emotional_wound);
      setEditSymbol(f.central_symbol);
      setEditCta(f.cta);
    }
    setEditObjective(f.objective);
    setEditSpotify(f.spotify_description);
    setEditNotes(f.notes);
  }

  async function handleGenerate() {
    if (!idea.trim()) {
      toast.error('La idea base es obligatoria');
      return;
    }
    setStep('generating');
    try {
      const prompt = buildPrompt({
        idea, number, status, theme: inputTheme, intention, focus, freeNotes,
      });
      const result = await generateFicha(prompt);
      setFicha(result);
      populateEditFields(result, null);
      setStep('review');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al generar ficha');
      setStep('input');
    }
  }

  function applyVariation(idx: number) {
    if (!ficha) return;
    setSelectedVariation(idx === selectedVariation ? null : idx);
    populateEditFields(ficha, idx === selectedVariation ? null : idx);
  }

  async function handleSave() {
    if (!editTitle.trim() || !ficha) return;
    setSaving(true);
    try {
      await onSave({
        episode_number: number.trim() || nextNumber,
        title: editTitle,
        theme: editTheme,
        pillar: null,
        emotional_wound: editWound,
        central_symbol: editSymbol,
        objective: editObjective,
        status,
        cta: editCta,
        notes: editNotes,
        narrative_structure: ficha.narrative_structure,
        spotify_description: editSpotify,
        apple_description: null,
        publish_date: null,
        hooks: ficha.hooks,
        script: null,
        next_action: null,
      });
      toast.success('Episodio creado con la guía editorial');
      resetAll();
      onOpenChange(false);
    } catch {
      toast.error('Error al guardar el episodio');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetAll();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-[#0c1f36]" />
            Guía editorial AMTME
          </DialogTitle>
        </DialogHeader>

        {/* ── STEP 1: INPUT ── */}
        {step === 'input' && (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Idea base <span className="text-red-500">*</span>
              </Label>
              <Textarea
                rows={4}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe la idea central. Puede ser una situación, una emoción, una pregunta que no te puedes sacar de la cabeza..."
                className="mt-1.5 text-sm"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Número de episodio <span className="text-black/30">(opcional)</span>
                </Label>
                <Input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder={nextNumber}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Estado inicial</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as EpisodeStatus)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EPISODE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Tema principal <span className="text-black/30">(opcional)</span>
                </Label>
                <Input
                  value={inputTheme}
                  onChange={(e) => setInputTheme(e.target.value)}
                  placeholder="Ej: apego ansioso, límites"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Intención emocional <span className="text-black/30">(opcional)</span>
                </Label>
                <Input
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="¿Qué quieres que sienta el oyente?"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">
                Enfoque personal <span className="text-black/30">(opcional)</span>
              </Label>
              <Input
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="Ej: desde mi experiencia con..."
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">
                Notas libres <span className="text-black/30">(opcional)</span>
              </Label>
              <Textarea
                rows={2}
                value={freeNotes}
                onChange={(e) => setFreeNotes(e.target.value)}
                placeholder="Cualquier referencia, frase o idea adicional"
                className="mt-1.5 text-sm"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!idea.trim()}
                className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generar ficha editorial
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* ── STEP 2: GENERATING ── */}
        {step === 'generating' && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-[#0c1f36]" />
            <p className="text-sm font-medium text-foreground">
              Construyendo tu ficha editorial...
            </p>
            <p className="text-xs text-muted-foreground max-w-[280px] text-center leading-relaxed">
              La guía está interpretando tu idea y generando todos los campos del episodio.
            </p>
          </div>
        )}

        {/* ── STEP 3: REVIEW ── */}
        {step === 'review' && ficha && (
          <div className="space-y-5">
            {/* Variaciones */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Variaciones — elige una o usa la propuesta principal
              </p>
              <div className="grid gap-2">
                {ficha.variations.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyVariation(i)}
                    className={`text-left rounded-xl border p-3 transition-all ${
                      selectedVariation === i
                        ? 'border-[#0c1f36] bg-[#0c1f36]/5'
                        : 'border-border hover:border-[#0c1f36]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {v.label}
                      </span>
                      {selectedVariation === i && (
                        <span className="text-[10px] bg-[#e8ff40] text-[#0c1f36] px-1.5 py-0.5 rounded-full font-semibold">
                          Activa
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground leading-snug">{v.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {v.theme} · {v.central_symbol}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Campos editables */}
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Título</Label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="mt-1 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Tema central</Label>
                  <Input
                    value={editTheme}
                    onChange={(e) => setEditTheme(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Herida emocional</Label>
                  <Input
                    value={editWound}
                    onChange={(e) => setEditWound(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Símbolo central</Label>
                  <Input
                    value={editSymbol}
                    onChange={(e) => setEditSymbol(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">CTA principal</Label>
                  <Input
                    value={editCta}
                    onChange={(e) => setEditCta(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Objetivo del episodio</Label>
                <Textarea
                  rows={2}
                  value={editObjective}
                  onChange={(e) => setEditObjective(e.target.value)}
                  className="mt-1 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Descripción Spotify</Label>
                <Textarea
                  rows={3}
                  value={editSpotify}
                  onChange={(e) => setEditSpotify(e.target.value)}
                  className="mt-1 text-sm"
                />
              </div>

              {/* Hooks (read-only preview) */}
              {ficha.hooks?.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Hooks generados</Label>
                  <div className="mt-1 space-y-1">
                    {ficha.hooks.map((h, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-muted px-3 py-2 text-xs text-foreground"
                      >
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estructura narrativa (read-only) */}
              {ficha.narrative_structure && (
                <div>
                  <Label className="text-xs text-muted-foreground">Estructura narrativa</Label>
                  <div className="mt-1 space-y-1.5">
                    {(Object.keys(NS_LABELS) as (keyof NarrativeStructure)[]).map((key) => (
                      <div key={key} className="rounded-lg border border-border px-3 py-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {NS_LABELS[key]}
                        </p>
                        <p className="text-xs text-foreground mt-0.5 leading-relaxed">
                          {ficha.narrative_structure[key]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notas y metadatos */}
              <div>
                <Label className="text-xs text-muted-foreground">
                  Notas y metadatos generados
                </Label>
                <Textarea
                  rows={5}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="mt-1 text-xs font-mono"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('input')}
                className="text-xs"
              >
                <ArrowLeft className="mr-1.5 h-3 w-3" />
                Editar idea
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !editTitle.trim()}
                className="bg-[#e8ff40] text-[#0c1f36] hover:bg-[#d4eb3a] font-semibold"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                Guardar episodio
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
