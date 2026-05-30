'use client';

import { useEffect, useState } from 'react';
import { Badge, Button, Card, Field, Select, Textarea } from '@/components/ui';
import type { AiEditorMode, AiEditorScope, AiChangePlan } from '@/lib/ai-editor/types';
import { ChangePreview } from './ChangePreview';
import { ChangeHistory } from './ChangeHistory';
import type { ChangeHistoryEntry } from '@/lib/ai-editor/types';

const SCOPE_LABELS: Record<AiEditorScope, string> = {
  current_page: 'Página actual',
  module: 'Módulo',
  whole_app: 'Toda la app',
  styles_only: 'Solo estilos',
  copy_only: 'Solo textos',
  data_only: 'Solo datos',
  components_only: 'Solo componentes',
};

const MODE_LABELS: Record<AiEditorMode, string> = {
  safe: 'Seguro (solo analiza)',
  assisted: 'Asistido (propone diff)',
  direct: 'Directo (rama temporal)',
};

interface AnalyzeState {
  loading: boolean;
  error: string;
  blocked: boolean;
  blockedReason: string;
  plan: AiChangePlan | null;
}

export function NaturalLanguageEditor() {
  const [prompt, setPrompt] = useState('');
  const [scope, setScope] = useState<AiEditorScope>('current_page');
  const [mode, setMode] = useState<AiEditorMode>('assisted');
  const [state, setState] = useState<AnalyzeState>({
    loading: false,
    error: '',
    blocked: false,
    blockedReason: '',
    plan: null,
  });
  const [applying, setApplying] = useState(false);
  const [confirmingApply, setConfirmingApply] = useState(false);
  const [applySuccess, setApplySuccess] = useState<{
    branchName?: string;
    message?: string;
    status?: string;
  } | null>(null);
  const [history, setHistory] = useState<ChangeHistoryEntry[]>([]);
  const [persistenceInfo, setPersistenceInfo] = useState<{
    type: 'persistent' | 'session';
    source: 'supabase' | 'memory';
    reason?: string;
  }>({
    type: 'session',
    source: 'memory',
  });

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch('/api/ai-editor/history');
        const data = (await res.json()) as {
          entries?: ChangeHistoryEntry[];
          persistenceType?: 'persistent' | 'session';
          persistenceSource?: 'supabase' | 'memory';
          persistenceReason?: string;
        };

        if (!res.ok) return;
        if (Array.isArray(data.entries)) {
          setHistory(data.entries);
        }
        setPersistenceInfo({
          type: data.persistenceType ?? 'session',
          source: data.persistenceSource ?? 'memory',
          reason: data.persistenceReason,
        });
      } catch {
        // fallback silencioso a historial local
      }
    };

    void loadHistory();
  }, []);

  const analyze = async () => {
    if (!prompt.trim()) return;

    setState({ loading: true, error: '', blocked: false, blockedReason: '', plan: null });
    const requestId = `req-${Date.now()}`;
    const promptValue = prompt.trim();

    try {
      const res = await fetch('/api/ai-editor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, prompt: promptValue, mode, scope }),
      });

      const data = (await res.json()) as {
        requestId?: string;
        plan?: AiChangePlan;
        blocked?: boolean;
        reason?: string;
        error?: string;
        entry?: ChangeHistoryEntry;
        persistenceType?: 'persistent' | 'session';
        persistenceSource?: 'supabase' | 'memory';
        persistenceReason?: string;
      };

      if (!res.ok || data.error) {
        if (data.blocked) {
          setState({
            loading: false,
            error: '',
            blocked: true,
            blockedReason: data.reason ?? 'Acción bloqueada.',
            plan: null,
          });
          if (data.entry) {
            const historyEntry = data.entry;
            setHistory((prev) => [historyEntry, ...prev]);
          } else {
            addHistoryEntry(data.requestId ?? requestId, promptValue, null, 'blocked');
          }
          return;
        }
        setState({
          loading: false,
          error: data.error ?? 'No se pudo analizar la instrucción.',
          blocked: false,
          blockedReason: '',
          plan: null,
        });
        return;
      }

      if (data.plan) {
        setState({ loading: false, error: '', blocked: false, blockedReason: '', plan: data.plan });
        if (data.entry) {
          const historyEntry = data.entry;
          setHistory((prev) => [historyEntry, ...prev]);
        } else {
          addHistoryEntry(data.requestId ?? requestId, promptValue, data.plan, 'analyzed');
        }
      }
      if (data.persistenceType && data.persistenceSource) {
        setPersistenceInfo({
          type: data.persistenceType,
          source: data.persistenceSource,
          reason: data.persistenceReason,
        });
      }
    } catch {
      setState({
        loading: false,
        error: 'No se pudo conectar con el servicio.',
        blocked: false,
        blockedReason: '',
        plan: null,
      });
    }
  };

  const addHistoryEntry = (
    id: string,
    promptValue: string,
    plan: AiChangePlan | null,
    status: ChangeHistoryEntry['status'],
    branchName?: string,
    options?: Partial<ChangeHistoryEntry>
  ) => {
    const entry: ChangeHistoryEntry = {
      id,
      createdAt: new Date().toISOString(),
      prompt: promptValue.trim(),
      status,
      filesChanged: plan?.affectedFiles ?? [],
      riskLevel: plan?.riskLevel ?? 'low',
      rollbackAvailable: status === 'ready_to_apply' || status === 'applied',
      mode,
      scope,
      plan: plan ?? undefined,
      branchName,
      branchType: options?.branchType,
      commitSha: options?.commitSha,
      executionSource: options?.executionSource,
      validationRun: options?.validationRun,
      rollbackType: options?.rollbackType,
      rollbackMetadata: options?.rollbackMetadata,
      persistenceType: options?.persistenceType ?? 'session',
      updatedAt: new Date().toISOString(),
    };
    setHistory((prev) => [entry, ...prev]);
  };

  const handleApply = async () => {
    if (!state.plan) return;

    // Enter confirmation step (much stronger Lovable-style safety + clarity)
    setConfirmingApply(true);
  };

  const confirmAndApply = async () => {
    if (!state.plan) return;

    setConfirmingApply(false);
    setApplying(true);

    try {
      const res = await fetch('/api/ai-editor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: `req-${Date.now()}`,
          prompt: prompt.trim(),
          scope,
          plan: state.plan,
          mode,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        message?: string;
        status?: string;
        branchName?: string;
        branchType?: 'real' | 'proposed';
        commitSha?: string;
        executionSource?: ChangeHistoryEntry['executionSource'];
        rollbackMetadata?: ChangeHistoryEntry['rollbackMetadata'];
        entry?: ChangeHistoryEntry;
        persistenceType?: 'persistent' | 'session';
        persistenceSource?: 'supabase' | 'memory';
        persistenceReason?: string;
      };

      if (!res.ok) {
        setState((prev) => ({ ...prev, error: data.error ?? 'No se pudo preparar el cambio.' }));
      } else {
        if (data.entry) {
          const historyEntry = data.entry;
          setHistory((prev) => [historyEntry, ...prev]);
        } else {
          const entryStatus = (data.status as ChangeHistoryEntry['status']) ?? 'ready_to_apply';
          addHistoryEntry(`req-${Date.now()}`, prompt, state.plan, entryStatus, data.branchName, {
            branchType: data.branchType,
            commitSha: data.commitSha,
            executionSource: data.executionSource,
            rollbackMetadata: data.rollbackMetadata,
          });
        }
        if (data.persistenceType && data.persistenceSource) {
          setPersistenceInfo({
            type: data.persistenceType,
            source: data.persistenceSource,
            reason: data.persistenceReason,
          });
        }

        // Show nice success feedback with next steps (Lovable-style closure)
        setApplySuccess({
          branchName: data.branchName,
          message: data.message,
          status: data.status,
        });

        // Clear plan after short delay so success banner is visible
        setTimeout(() => {
          setState({ loading: false, error: '', blocked: false, blockedReason: '', plan: null });
          setPrompt('');
        }, 1200);
      }
    } catch {
      setState((prev) => ({ ...prev, error: 'Error al preparar el cambio.' }));
    } finally {
      setApplying(false);
    }
  };

  const cancelConfirmation = () => {
    setConfirmingApply(false);
  };

  const dismissSuccess = () => {
    setApplySuccess(null);
  };

  const handleDiscard = () => {
    addHistoryEntry(`req-${Date.now()}`, prompt, state.plan, 'discarded');
    setState({ loading: false, error: '', blocked: false, blockedReason: '', plan: null });
  };

  const handleEditInstruction = () => {
    setState((prev) => ({ ...prev, plan: null }));
  };

  // Guardado como tarea pendiente (temporalmente deshabilitado en esta iteración del editor)
  // const handleSaveAsTask = () => { ... };

  const handleRollback = async (entry: ChangeHistoryEntry) => {
    if (!entry.plan) return;

    try {
      const res = await fetch('/api/ai-editor/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: entry.id,
          prompt: entry.prompt,
          mode: entry.mode,
          scope: entry.scope,
          plan: entry.plan,
          branchName: entry.branchName,
          commitSha: entry.commitSha,
          rollbackMetadata: entry.rollbackMetadata,
        }),
      });

      const data = (await res.json()) as {
        entry?: ChangeHistoryEntry;
        persistenceType?: 'persistent' | 'session';
        persistenceSource?: 'supabase' | 'memory';
        persistenceReason?: string;
      };

      if (res.ok && data.entry) {
        setHistory((prev) => [data.entry as ChangeHistoryEntry, ...prev]);
      } else if (res.ok) {
        setHistory((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? { ...e, status: 'rolled_back' as const, rollbackAvailable: false }
              : e
          )
        );
      }

      if (data.persistenceType && data.persistenceSource) {
        setPersistenceInfo({
          type: data.persistenceType,
          source: data.persistenceSource,
          reason: data.persistenceReason,
        });
      }
    } catch {
      // silent — UI will show no change
    }
  };

  return (
    <div className="space-y-5">
      {/* Input panel */}
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">Editor IA</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-amtme-navy">
              Instrucción natural
            </h2>
          </div>
          <Badge tone="accent">Modo: {MODE_LABELS[mode].split(' ')[0]}</Badge>
        </div>

        <div className="mt-5">
          <Field label="Instrucción en lenguaje natural">
            <Textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: 'Mejora la pantalla de configuración, hazla más compacta y cambia la zona horaria a America/Cancun' o 'Agrega una sección de testimonios en la home con el estilo editorial de AMTME'"
            />
          </Field>

          {/* Conversational helper — makes the Lovable-like experience clearer */}
          <div className="mt-3 rounded-xl border border-semantic-border bg-semantic-surface-soft p-3 text-xs text-semantic-muted">
            <strong>Ejemplos que funcionan bien:</strong>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              <li>Mejora la tipografía y espaciado del dashboard para que se sienta más premium</li>
              <li>Agrega un estado vacío útil en la página de episodios cuando no hay ninguno</li>
              <li>
                Haz que el calendario use colores del branding AMTME y sea más legible en mobile
              </li>
              <li>
                En el editor IA, agrega una explicación clara de qué hace cada modo (seguro /
                asistido / directo)
              </li>
            </ul>
            <p className="mt-2 text-[10px] opacity-70">
              El sistema analiza tu intención, identifica archivos afectados, calcula riesgo y
              genera un plan con preview antes de cualquier cambio.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Alcance">
            <Select value={scope} onChange={(e) => setScope(e.target.value as AiEditorScope)}>
              {(Object.entries(SCOPE_LABELS) as [AiEditorScope, string][]).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Modo de ejecución">
            <Select value={mode} onChange={(e) => setMode(e.target.value as AiEditorMode)}>
              {(Object.entries(MODE_LABELS) as [AiEditorMode, string][]).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={analyze} disabled={state.loading || !prompt.trim()}>
            {state.loading ? 'Pensando…' : 'Analizar con IA'}
          </Button>
          {state.plan || state.blocked ? (
            <Button variant="ghost" onClick={handleDiscard}>
              Nueva instrucción
            </Button>
          ) : null}
        </div>

        {state.loading && (
          <div className="mt-4 rounded-2xl border border-semantic-border bg-semantic-surface-soft p-4 text-sm text-semantic-muted">
            <div className="flex items-center gap-2 font-medium text-amtme-navy">
              <span className="animate-pulse">●</span> Analizando tu instrucción en lenguaje natural
            </div>
            <div className="mt-2 text-xs leading-relaxed">
              Identificando intención → Mapeando archivos y rutas afectadas → Evaluando nivel de
              riesgo → Generando preview seguro con validaciones.
            </div>
          </div>
        )}

        {state.error ? (
          <p className="mt-3 rounded-2xl bg-amtme-red/8 px-4 py-3 text-sm text-amtme-red">
            {state.error}
          </p>
        ) : null}

        {state.blocked ? (
          <div className="mt-3 rounded-2xl border border-amtme-red/20 bg-amtme-red/8 px-4 py-3">
            <p className="text-sm font-medium text-amtme-red">Acción bloqueada</p>
            <p className="mt-1 text-sm text-amtme-red/80">{state.blockedReason}</p>
          </div>
        ) : null}
      </Card>

      {/* Change preview */}
      {state.plan ? (
        <>
          {/* LLM Reasoning (new in this audit — makes the editor feel truly intelligent) */}
          {state.plan &&
            'reasoning' in state.plan &&
            (state.plan as { reasoning?: string }).reasoning && (
              <Card className="border-l-4 border-amtme-gold bg-semantic-surface-soft">
                <div className="text-xs uppercase tracking-[0.2em] text-semantic-muted mb-1">
                  Razonamiento de la IA
                </div>
                <p className="text-sm leading-relaxed text-amtme-navy">
                  {(state.plan as { reasoning?: string }).reasoning}
                </p>
                {'confidence' in state.plan &&
                  (state.plan as { confidence?: number }).confidence && (
                    <div className="mt-2 text-[10px] text-semantic-muted">
                      Confianza del análisis:{' '}
                      <span className="font-mono text-amtme-navy">
                        {(state.plan as { confidence?: number }).confidence}%
                      </span>
                    </div>
                  )}
              </Card>
            )}

          {/* Strong Confirmation before Apply (Lovable-style safety + clarity) */}
          {confirmingApply && state.plan && (
            <Card className="border-2 border-amtme-gold">
              <div className="font-semibold text-amtme-navy">Confirmar preparación del cambio</div>

              <div className="mt-3 text-sm">
                {(state.plan as { reasoning?: string }).reasoning ? (
                  <div>
                    <div className="text-xs text-semantic-muted mb-1">Razonamiento de la IA:</div>
                    <p className="italic text-amtme-navy">
                      “{(state.plan as { reasoning?: string }).reasoning}”
                    </p>
                  </div>
                ) : (
                  <p>{state.plan.summary}</p>
                )}
              </div>

              <div className="mt-4 text-xs text-amtme-slate">
                Esto generará una rama técnica/propuesta con los cambios propuestos.
                {state.plan.riskLevel !== 'low' &&
                  ` El nivel de riesgo es ${state.plan.riskLevel}.`}
              </div>

              <div className="mt-5 flex gap-3">
                <Button onClick={confirmAndApply} disabled={applying}>
                  {applying ? 'Preparando rama...' : 'Confirmar y preparar'}
                </Button>
                <Button variant="ghost" onClick={cancelConfirmation} disabled={applying}>
                  Cancelar
                </Button>
              </div>
            </Card>
          )}

          {!confirmingApply && (
            <ChangePreview
              plan={state.plan}
              onApply={handleApply}
              onDiscard={handleDiscard}
              onEditInstruction={handleEditInstruction}
              applying={applying}
            />
          )}
        </>
      ) : null}

      {/* Success feedback after Apply (strong closure for Lovable experience) */}
      {applySuccess && (
        <Card className="border-2 border-amtme-gold bg-amtme-gold/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold text-amtme-navy">¡Cambio preparado con éxito!</div>
              <p className="mt-1 text-sm text-amtme-navy/90">
                {applySuccess.message ||
                  'Se ha generado la rama técnica con los cambios propuestos.'}
              </p>
              {applySuccess.branchName && (
                <p className="mt-2 font-mono text-xs text-amtme-navy">
                  Rama: {applySuccess.branchName}
                </p>
              )}
              <p className="mt-3 text-xs text-semantic-muted">
                Revisa el historial abajo o ve al PR/branch para inspeccionar los cambios antes de
                mergear.
              </p>
            </div>
            <button
              onClick={dismissSuccess}
              className="text-xs text-amtme-slate hover:text-amtme-navy"
            >
              Cerrar
            </button>
          </div>
        </Card>
      )}

      {/* History */}
      {history.length > 0 ? (
        <Card>
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
              Historial de cambios
            </div>
            <span className="rounded bg-amtme-slate/10 px-1.5 py-0.5 font-mono text-xs text-amtme-navy">
              {persistenceInfo.type === 'persistent' ? 'persistente' : 'solo sesión'}
            </span>
          </div>
          <p className="mt-1 text-xs text-semantic-muted">
            {persistenceInfo.type === 'persistent'
              ? 'Historial cargado desde Supabase.'
              : 'Este historial se pierde al recargar la página. Persistencia en base de datos no disponible en este runtime.'}
            {persistenceInfo.reason ? ` ${persistenceInfo.reason}` : ''}
          </p>
          <div className="mt-4">
            <ChangeHistory entries={history} onRollback={handleRollback} />
          </div>
        </Card>
      ) : null}
    </div>
  );
}
