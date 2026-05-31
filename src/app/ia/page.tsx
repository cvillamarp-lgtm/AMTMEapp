'use client';

import { Badge } from '@/components/ui';
import { useStudio } from '@/components/studio-provider';
import { NaturalLanguageEditor } from '@/components/ia-editor/NaturalLanguageEditor';

export default function IAPage() {
  const { state } = useStudio();
<<<<<<< HEAD
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
=======
>>>>>>> ece5a9a (fix: botones visibles hero card, estado activo episodios, monetizacion con acciones de venta, copiar output IA)

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-black/40">IA</div>
<<<<<<< HEAD
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">
              Conexión Grok y Gemini
            </h2>
=======
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0C1F36]">Editor Conversacional</h2>
>>>>>>> ece5a9a (fix: botones visibles hero card, estado activo episodios, monetizacion con acciones de venta, copiar output IA)
          </div>
          <Badge tone={state.config.aiEnabled ? 'good' : 'warning'}>
            {state.config.aiEnabled ? 'IA activa' : 'IA pausada'}
          </Badge>
        </div>
<<<<<<< HEAD

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
=======
        <p className="mt-3 max-w-prose text-sm text-black/55">
          Escribe en lenguaje natural. El modelo te mostrará su razonamiento en cada paso. 
          Todas las aplicaciones son simulaciones seguras (no modifican el repositorio real).
        </p>
>>>>>>> ece5a9a (fix: botones visibles hero card, estado activo episodios, monetizacion con acciones de venta, copiar output IA)
      </div>

      <NaturalLanguageEditor />

      {/* Legacy quick generator kept for power users - can be removed later */}
      <details className="mt-12 text-xs text-black/40">
        <summary className="cursor-pointer">Modo clásico (generador por prompts)</summary>
        <div className="mt-4 text-[13px] text-black/50">El modo clásico sigue disponible temporalmente en la ruta /ia/clasico (por implementar). El nuevo editor conversacional con razonamiento visible es la experiencia principal.</div>
      </details>
    </div>
  );
}
