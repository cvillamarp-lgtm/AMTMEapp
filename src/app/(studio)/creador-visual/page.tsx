'use client';

import { useState } from 'react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { generateVisualPrompt, generateVisualSpec } from '@/lib/studio-generators';
import { createVisualAsset } from '@/lib/database';
import type { VisualAsset, VisualType, VisualFormat } from '@/types/database';

type DraftVisualAsset = Omit<VisualAsset, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

const emptyVisual = (): DraftVisualAsset => ({
  type: 'carrusel-portada',
  format: '1080x1350',
  title: '',
  main_text: '',
  secondary_text: '',
  cta: 'Desliza',
  prompt: '',
  technical_spec: '',
  template_variables: { titulo: '', cta: '' },
  palette: 'Navy profundo, amarillo AMTME, blanco, crema cálido',
  status: 'Borrador',
  episode_id: '',
  content_id: null,
  visual_reference: null,
});

export default function CreadorVisualPage() {
  const [draft, setDraft] = useState<DraftVisualAsset>(emptyVisual());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const generatePrompt = () => {
    setDraft((current) => ({
      ...current,
      prompt: generateVisualPrompt({
        type: current.type,
        mainText: current.main_text || '',
        secondaryText: current.secondary_text || '',
        cta: current.cta || '',
        palette: current.palette,
      }),
      technical_spec: generateVisualSpec(current.format),
      status: 'Listo',
    }));
  };

  const saveVisual = async () => {
    try {
      setSaveStatus('saving');
      await createVisualAsset(draft);
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
        setDraft(emptyVisual());
      }, 2000);
    } catch (error) {
      console.error('Error saving visual asset:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Creador Visual</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-amtme-navy">
              Prompts y especificaciones
            </h2>
          </div>
          <Badge tone="accent">Apple-like editorial</Badge>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Tipo de pieza">
            <Select
              value={draft.type}
              onChange={(event) => setDraft({ ...draft, type: event.target.value as VisualType })}
            >
              <option value="carrusel-portada">Carrusel portada</option>
              <option value="portada-podcast">Portada podcast</option>
              <option value="story">Story</option>
              <option value="reel-cover">Reel cover</option>
              <option value="post-tipografico">Post tipográfico</option>
              <option value="prompt-editorial">Prompt editorial</option>
              <option value="imagen-ia">Imagen IA</option>
              <option value="banner">Banner</option>
              <option value="miniatura-youtube">Miniatura YouTube</option>
            </Select>
          </Field>
          <Field label="Formato">
            <Select
              value={draft.format}
              onChange={(event) =>
                setDraft({ ...draft, format: event.target.value as VisualFormat })
              }
            >
              <option>1080x1350</option>
              <option>1080x1920</option>
              <option>1080x1080</option>
              <option>3000x3000</option>
            </Select>
          </Field>
          <Field label="Canal">
            <Input value="Instagram" readOnly />
          </Field>
          <Field label="Objetivo">
            <Input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              placeholder="Objetivo de la pieza"
            />
          </Field>
          <Field label="Texto principal">
            <Textarea
              rows={3}
              value={draft.main_text || ''}
              onChange={(event) => setDraft({ ...draft, main_text: event.target.value })}
            />
          </Field>
          <Field label="Texto secundario">
            <Textarea
              rows={3}
              value={draft.secondary_text || ''}
              onChange={(event) => setDraft({ ...draft, secondary_text: event.target.value })}
            />
          </Field>
          <Field label="CTA">
            <Input
              value={draft.cta || ''}
              onChange={(event) => setDraft({ ...draft, cta: event.target.value })}
            />
          </Field>
          <Field label="Paleta">
            <Input
              value={draft.palette}
              onChange={(event) => setDraft({ ...draft, palette: event.target.value })}
            />
          </Field>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={generatePrompt}>Generar prompt visual</Button>
          <Button variant="secondary" onClick={saveVisual} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' && 'Guardando...'}
            {saveStatus === 'saved' && '✓ Guardado'}
            {saveStatus === 'error' && '✗ Error al guardar'}
            {saveStatus === 'idle' && 'Guardar pieza'}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="text-xs uppercase tracking-[0.22em] text-black/40">Salida estructurada</div>
        <div className="mt-4 space-y-4">
          <Field label="Prompt visual completo">
            <Textarea
              rows={8}
              value={
                draft.prompt ||
                'Haz clic en "Generar prompt visual" para ver la instrucción completa.'
              }
              readOnly
            />
          </Field>
          <Field label="Especificación técnica">
            <Textarea rows={4} value={draft.technical_spec || ''} readOnly />
          </Field>
          <Field label="Variables de plantilla">
            <Textarea
              rows={2}
              value={JSON.stringify(draft.template_variables, null, 2)}
              onChange={(event) => {
                try {
                  setDraft({ ...draft, template_variables: JSON.parse(event.target.value) });
                } catch {
                  // Invalid JSON, ignore
                }
              }}
            />
          </Field>
          <div className="rounded-3xl border border-black/8 bg-amtme-cream p-4 text-sm text-black/60">
            <div className="font-medium text-amtme-navy">Checklist QA visual</div>
            <ul className="mt-3 space-y-2 leading-6">
              <li>• Paleta oficial respetada</li>
              <li>• Un solo CTA principal</li>
              <li>• Lectura móvil clara</li>
              <li>• Espacio negativo suficiente</li>
              <li>• Cero estética de coaching</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
