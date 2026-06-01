'use client';

import { useState } from 'react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { generateVisualPrompt, generateVisualSpec } from '@/lib/studio-generators';
import type { VisualAsset } from '@/lib/studio-types';

const emptyVisual = (): VisualAsset => ({
  id: `vis-${Date.now()}`,
  type: 'Carrusel portada',
  format: '1080x1350',
  title: '',
  mainText: '',
  secondaryText: '',
  cta: 'Desliza',
  prompt: '',
  technicalSpec: '',
  templateVariables: '{titulo}, {cta}',
  palette: 'Navy profundo, amarillo AMTME, blanco, crema cálido',
  status: 'Borrador',
  episodeId: '',
  createdAt: new Date().toISOString().slice(0, 10),
});

export default function CreadorVisualPage() {
  const { setState } = useStudio();
  const [draft, setDraft] = useState<VisualAsset>(emptyVisual());

  const generatePrompt = () => {
    setDraft((current) => ({
      ...current,
      prompt: generateVisualPrompt(current),
      technicalSpec: generateVisualSpec(current.format),
      status: 'Listo',
    }));
  };

  const saveVisual = () => {
    setState((current) => ({
      ...current,
      visualAssets: [draft, ...current.visualAssets],
    }));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Creador Visual</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
              Prompts y especificaciones
            </h2>
          </div>
          <Badge tone="accent">Apple-like editorial</Badge>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Tipo de pieza">
            <Select
              value={draft.type}
              onChange={(event) => setDraft({ ...draft, type: event.target.value })}
            >
              <option>Carrusel portada</option>
              <option>Frase viral feed</option>
              <option>Story nuevo episodio</option>
              <option>Story reproductor</option>
              <option>Carrusel slide texto</option>
              <option>Carrusel cierre</option>
              <option>Reel cover</option>
              <option>Manifiesto visual</option>
              <option>Anuncio plataformas</option>
              <option>Tarot / autoconocimiento</option>
              <option>Promoción de episodio</option>
              <option>Pieza DM</option>
            </Select>
          </Field>
          <Field label="Formato">
            <Select
              value={draft.format}
              onChange={(event) => setDraft({ ...draft, format: event.target.value })}
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
              value={draft.mainText}
              onChange={(event) => setDraft({ ...draft, mainText: event.target.value })}
            />
          </Field>
          <Field label="Texto secundario">
            <Textarea
              rows={3}
              value={draft.secondaryText}
              onChange={(event) => setDraft({ ...draft, secondaryText: event.target.value })}
            />
          </Field>
          <Field label="CTA">
            <Input
              value={draft.cta}
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
          <Button variant="secondary" onClick={saveVisual}>
            Guardar pieza
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
                'Haz clic en “Generar prompt visual” para ver la instrucción completa.'
              }
              readOnly
            />
          </Field>
          <Field label="Especificación técnica">
            <Textarea rows={4} value={draft.technicalSpec} readOnly />
          </Field>
          <Field label="Variables de plantilla">
            <Input
              value={draft.templateVariables}
              onChange={(event) => setDraft({ ...draft, templateVariables: event.target.value })}
            />
          </Field>
          <div className="rounded-3xl border border-black/8 bg-[#F5F2EA] p-4 text-sm text-black/60">
            <div className="font-medium text-[#0C1F36]">Checklist QA visual</div>
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
