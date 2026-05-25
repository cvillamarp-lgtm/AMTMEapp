'use client';

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
  Métricas: 'Resume el dato clave y la acción siguiente de una métrica operativa.',
  Monetización: 'Redacta el siguiente paso comercial para convertir un lead interesado.',
};

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
    <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">IA</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
              Conexión Grok y Gemini
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
            </Select>
          </Field>
          <Field label="Modelo">
            <Input value={model} onChange={(event) => setModel(event.target.value)} />
          </Field>
          <Field label="Modo">
            <Select value={mode} onChange={(event) => syncMode(event.target.value as AIWorkMode)}>
              <option>Episodio</option>
              <option>Copy</option>
              <option>Visual</option>
              <option>Métricas</option>
              <option>Monetización</option>
            </Select>
          </Field>
          <Field label="Proveedor actual">
            <Input value={providerLabel} readOnly />
          </Field>
        </div>

        <Field
          label="Prompt operativo"
          hint="Se envía al proveedor seleccionado desde el servidor."
        >
          <Textarea rows={10} value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        </Field>

        <Field label="System prompt">
          <Textarea
            rows={6}
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
              <p className="text-black/45">Aquí aparecerá la respuesta de Grok o Gemini.</p>
            ) : null}
            {response.result ? (
              <pre className="whitespace-pre-wrap font-sans">{response.result}</pre>
            ) : null}
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase tracking-[0.22em] text-black/40">
            Estado de conexión
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
      </div>
    </div>
  );
}
