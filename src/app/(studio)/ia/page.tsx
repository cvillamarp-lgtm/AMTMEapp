'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { getProviderLabel } from '@/lib/ai-providers';
import type { AIProvider, AIWorkMode } from '@/lib/studio-types';

type AIResponseState = {
  loading: boolean;
  error: string;
  result: string;
};

const defaultPromptByMode: Record<AIWorkMode, string> = {
  Episodio: 'Genera un guion breve para un episodio de AMTME con hooks, estructura y CTA.',
  Copy: 'Escribe copy listo para publicar para Instagram con tono sobrio y editorial.',
  Visual: 'Define un prompt visual tipo Apple para una pieza de AMTME.',
  Métricas: 'Resume el dato clave y la accion siguiente de una metrica operativa.',
  Monetización: 'Redacta el siguiente paso comercial para convertir un lead interesado.',
};

type PresetCard = {
  title: string;
  description: string;
  input: string;
  output: string;
  href?: string;
  mode?: AIWorkMode;
  promptHint: string;
};

const EDITORIAL_PRESETS: PresetCard[] = [
  {
    title: 'Revisar coherencia AMTME',
    description:
      'Analiza si un texto respeta la voz, el tono y la estructura narrativa del podcast.',
    input: 'Texto o seccion del guion',
    output: 'Lista de observaciones: que funciona, que rompe el tono, que mejorar',
    mode: 'Episodio',
    promptHint:
      'Revisa este texto segun la voz AMTME: companero, no guru. Tono sobrio, directo. Sin autoayuda generica. Estructura: umbral, herida, simbolo, verdad, puente. Indica que funciona, que rompe el tono y que mejorar:\n\n[PEGA TU TEXTO AQUI]',
  },
  {
    title: 'Convertir nota en estructura',
    description:
      'Toma una idea o apunte del Documento Maestro y lo convierte en esqueleto editorial.',
    input: 'Nota o idea en bruto',
    output: 'Herida emocional, simbolo central, tema, posible CTA y estructura de 3 bloques',
    href: '/documento-maestro',
    mode: 'Episodio',
    promptHint:
      'Convierte esta nota en una estructura editorial AMTME. Identifica: herida emocional, simbolo central, tema, posible CTA y propone una estructura de 3 bloques narrativos:\n\n[PEGA TU NOTA AQUI]',
  },
  {
    title: 'Generar hooks para reels',
    description: 'Crea 5 hooks de apertura para reels o stories a partir del tema del episodio.',
    input: 'Titulo del episodio y herida emocional',
    output: '5 hooks de 8-12 palabras, con tension psicologica, segunda persona singular',
    href: '/episodios',
    mode: 'Copy',
    promptHint:
      'Genera 5 hooks de apertura para reels de AMTME. Cada hook: 8-12 palabras, segunda persona singular, tension psicologica, sin autoayuda. Basado en:\n\nTitulo: [TITULO]\nHerida emocional: [HERIDA]',
  },
  {
    title: 'Crear paquete de episodio',
    description: 'A partir de un guion listo, genera descripcion Spotify, caption IG y CTA.',
    input: 'Guion completo o resumen del episodio',
    output: 'Descripcion Spotify, descripcion Apple, caption Instagram, CTA especifico',
    href: '/guiones',
    mode: 'Copy',
    promptHint:
      'A partir de este guion, genera el paquete de publicacion de AMTME.\n[SPOTIFY] Descripcion 150-200 palabras, tono intimo\n[APPLE] Descripcion 100-150 palabras\n[IG_CAPTION] Caption listo para publicar\n[CTA] Una sola frase de accion\n\nGuion:\n[PEGA EL GUION AQUI]',
  },
  {
    title: 'Detectar herida, simbolo y CTA',
    description: 'Analiza un texto y extrae los tres elementos narrativos clave de AMTME.',
    input: 'Cualquier texto: nota, parrafo, guion, idea',
    output: 'Herida emocional identificada, simbolo central propuesto, CTA sugerido',
    mode: 'Episodio',
    promptHint:
      'Analiza este texto y extrae los 3 elementos narrativos clave de AMTME:\n- Herida emocional: que duele realmente aqui\n- Simbolo central: que objeto, imagen o situacion puede representarlo\n- CTA: que accion concreta puede tomar el oyente\n\nTexto:\n[PEGA EL TEXTO AQUI]',
  },
  {
    title: 'Crear brief visual',
    description: 'Genera un brief para el disenador o para Midjourney a partir del episodio.',
    input: 'Titulo, simbolo central y tono del episodio',
    output: 'Descripcion visual, paleta sugerida, composicion, prompt Midjourney',
    href: '/contenido',
    mode: 'Visual',
    promptHint:
      'Genera un brief visual para una pieza de AMTME. Paleta: Navy #001F36, Cian #9DC4D5, Lima #E8FF40, Blanco. Tipografia: Big Shoulders Display + DM Sans. Sin cursivas. Estilo sobrio, emocional, no generico.\n\nTitulo: [TITULO]\nSimbolo: [SIMBOLO]\nTono: [TONO]',
  },
  {
    title: 'Generar paquete de publicacion',
    description:
      'Convierte un guion o nota en el paquete completo: hooks, captions, frases, reels, brief visual y CTA.',
    input: 'Guion completo, resumen o nota del episodio',
    output:
      '5 hooks, 3 captions, 5 frases, 3 ideas de reel, 3 ideas de carrusel, brief visual, CTA, checklist y siguiente accion',
    href: '/contenido',
    mode: 'Copy',
    promptHint:
      'A partir de este contenido de AMTME, genera el paquete de publicacion completo en JSON con estos campos:\n{\n  "hooks": ["...","...","...","...","..."],\n  "captions": ["...","...","..."],\n  "frases": ["...","...","...","...","..."],\n  "reels": ["...","...","..."],\n  "carouselIdeas": ["...","...","..."],\n  "briefVisual": "...",\n  "cta": "...",\n  "checklist": ["...","...","...","...","..."],\n  "nextAction": "..."\n}\n\nContenido:\n[PEGA EL GUION O NOTA AQUI]',
  },
];

export default function IAPage() {
  const { state } = useStudio();
  const [provider, setProvider] = useState<AIProvider>(state.config.aiPrimaryProvider);
  const [mode, setMode] = useState<AIWorkMode>('Copy');
  const [model, setModel] = useState(state.config.aiPreferredModelByProvider[provider]);
  const [prompt, setPrompt] = useState(defaultPromptByMode.Copy);
  const [systemPrompt, setSystemPrompt] = useState(state.config.aiSystemPrompt);
  const [response, setResponse] = useState<AIResponseState>({
    loading: false,
    error: '',
    result: '',
  });

  const providerLabel = useMemo(() => getProviderLabel(provider), [provider]);

  const syncMode = (nextMode: AIWorkMode) => {
    setMode(nextMode);
    setPrompt(defaultPromptByMode[nextMode]);
  };

  const syncProvider = (nextProvider: AIProvider) => {
    setProvider(nextProvider);
    setModel(state.config.aiPreferredModelByProvider[nextProvider]);
  };

  const loadPreset = (preset: PresetCard) => {
    if (preset.mode) syncMode(preset.mode);
    setPrompt(preset.promptHint);
    document.getElementById('ia-consola')?.scrollIntoView({ behavior: 'smooth' });
  };

  const runGeneration = async () => {
    setResponse({ loading: true, error: '', result: '' });
    try {
      const result = await fetch('/api/ia/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, mode, prompt, systemPrompt, model }),
      });
      const payload = (await result.json()) as { result?: string; error?: string };
      if (!result.ok) {
        setResponse({
          loading: false,
          error: payload.error ?? 'No se pudo generar la respuesta.',
          result: '',
        });
        return;
      }
      setResponse({ loading: false, error: '', result: payload.result ?? '' });
    } catch {
      setResponse({
        loading: false,
        error: 'No se pudo conectar con el servicio de IA.',
        result: '',
      });
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Encabezado editorial */}
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-black/40">
          IA / Asistente editorial
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0C1F36]">IA para AMTME</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
          Asistente editorial para revisar, estructurar y convertir contenido real. Elige un preset,
          ajusta el prompt en la consola y genera.
        </p>
      </div>

      {/* Flujo editorial — links reales */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-black/40">Flujo editorial:</span>
        {[
          { label: 'Documento Maestro', href: '/documento-maestro' },
          { label: 'Episodios', href: '/episodios' },
          { label: 'Guiones', href: '/guiones' },
          { label: 'Revision', href: '/revision-episodios' },
          { label: 'Contenido', href: '/contenido' },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg border border-black/10 bg-[#F5F2EA] px-2.5 py-1 font-medium text-[#0C1F36] hover:bg-white transition-colors"
          >
            {l.label} →
          </Link>
        ))}
      </div>

      {/* Presets editoriales AMTME */}
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-black/40 mb-4">
          Asistente editorial AMTME
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {EDITORIAL_PRESETS.map((preset) => (
            <div
              key={preset.title}
              className="flex flex-col gap-3 rounded-2xl border border-black/8 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-snug text-[#0C1F36]">
                  {preset.title}
                </h3>
                <span className="shrink-0 rounded-full bg-[#e8ff40] px-2 py-0.5 text-[10px] font-medium text-[#0C1F36]">
                  Listo
                </span>
              </div>
              <p className="text-xs leading-5 text-black/60">{preset.description}</p>
              <div className="space-y-1 text-[11px]">
                <div>
                  <span className="font-medium text-black/50">Input: </span>
                  <span className="text-black/70">{preset.input}</span>
                </div>
                <div>
                  <span className="font-medium text-black/50">Output: </span>
                  <span className="text-black/70">{preset.output}</span>
                </div>
              </div>
              <div className="mt-auto flex gap-2 pt-1">
                <button
                  onClick={() => loadPreset(preset)}
                  className="flex-1 rounded-xl bg-[#0C1F36] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0C1F36]/90"
                >
                  Usar en consola
                </button>
                {preset.href && (
                  <Link
                    href={preset.href}
                    className="rounded-xl border border-black/10 px-3 py-1.5 text-xs font-medium text-[#0C1F36] transition-colors hover:bg-[#F5F2EA]"
                  >
                    Ir →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-black/8" />
        <span className="text-xs uppercase tracking-[0.2em] text-black/30">Consola directa</span>
        <div className="h-px flex-1 bg-black/8" />
      </div>

      {/* Consola IA — misma logica que antes, preservada */}
      <div id="ia-consola" className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-black/40">Consola IA</div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
                Generacion directa
              </h2>
            </div>
            <Badge tone={state.config.aiEnabled ? 'good' : 'warning'}>
              {state.config.aiEnabled ? 'IA activa' : 'IA pausada'}
            </Badge>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Proveedor">
              <Select
                value={provider}
                onChange={(event) => syncProvider(event.target.value as AIProvider)}
              >
                <option value="grok">Grok</option>
                <option value="gemini">Gemini</option>
                <option value="claude">Claude</option>
              </Select>
            </Field>
            <Field label="Modelo">
              <Input value={model} onChange={(event) => setModel(event.target.value)} />
            </Field>
            <Field label="Modo">
              <Select value={mode} onChange={(event) => syncMode(event.target.value as AIWorkMode)}>
                <option value="Episodio">Episodio</option>
                <option value="Copy">Copy</option>
                <option value="Visual">Visual</option>
              </Select>
            </Field>
            <Field label="Proveedor activo">
              <Input value={providerLabel} readOnly />
            </Field>
          </div>

          <Field label="Prompt" hint="Carga un preset de arriba o escribe tu instruccion.">
            <Textarea
              rows={10}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </Field>

          <Field label="System prompt">
            <Textarea
              rows={5}
              value={systemPrompt}
              onChange={(event) => setSystemPrompt(event.target.value)}
            />
          </Field>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={runGeneration} disabled={response.loading}>
              {response.loading ? 'Generando…' : 'Generar con IA'}
            </Button>
            <Button variant="secondary" onClick={() => setPrompt(defaultPromptByMode[mode])}>
              Restaurar prompt
            </Button>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">Resultado</div>
            <div className="mt-4 min-h-[360px] rounded-3xl border border-black/8 bg-[#F5F2EA] p-4 text-sm leading-6 text-[#0C1F36]">
              {response.error ? <p className="text-[#E0211E]">{response.error}</p> : null}
              {!response.error && !response.result ? (
                <p className="text-black/45">
                  Selecciona un preset de arriba o escribe un prompt y genera.
                </p>
              ) : null}
              {response.result ? (
                <pre className="whitespace-pre-wrap font-sans">{response.result}</pre>
              ) : null}
            </div>
            {response.result && (
              <button
                onClick={() => void navigator.clipboard.writeText(response.result)}
                className="mt-3 text-xs font-medium text-[#0C1F36] underline underline-offset-2 hover:no-underline"
              >
                Copiar resultado
              </button>
            )}
          </Card>

          <Card>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">
              Estado de conexion
            </div>
            <div className="mt-4 grid gap-3 text-sm text-black/60">
              <div className="flex items-center justify-between rounded-2xl bg-[#F5F2EA] px-4 py-3">
                <span>Proveedor primario</span>
                <span className="font-medium text-[#0C1F36]">
                  {getProviderLabel(state.config.aiPrimaryProvider)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#F5F2EA] px-4 py-3">
                <span>Proveedor fallback</span>
                <span className="font-medium text-[#0C1F36]">
                  {getProviderLabel(state.config.aiFallbackProvider)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#F5F2EA] px-4 py-3">
                <span>Modelo Grok</span>
                <span className="font-medium text-[#0C1F36]">
                  {state.config.aiPreferredModelByProvider.grok}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#F5F2EA] px-4 py-3">
                <span>Modelo Gemini</span>
                <span className="font-medium text-[#0C1F36]">
                  {state.config.aiPreferredModelByProvider.gemini}
                </span>
              </div>
            </div>
          </Card>

          {/* Link al editor tecnico */}
          <div className="rounded-2xl border border-black/8 bg-[#F5F2EA] p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-black/40 mb-2">
              Editor tecnico de la app
            </div>
            <p className="text-xs leading-5 text-black/60 mb-3">
              Para modificar la propia aplicacion en lenguaje natural — cambios de UI, componentes o
              copy — usa el Editor tecnico. Es distinto al asistente editorial de arriba.
            </p>
            <Link
              href="/ia/editor"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0C1F36] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0C1F36]/90"
            >
              Abrir editor tecnico →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
