'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  AiChangePlan,
  AiEditorMode,
  AiEditorScope,
  ChangeHistoryEntry,
} from '@/lib/ai-editor/types';
import { ChangePreview } from './ChangePreview';
import { ChangeHistory } from './ChangeHistory';

// ── Stage type ─────────────────────────────────────────────────────────────
type EditorStage =
  | 'idle'
  | 'analyzing'
  | 'patch_ready'
  | 'validating'
  | 'ready_to_apply'
  | 'applying'
  | 'applied'
  | 'failed'
  | 'blocked';

interface AnalyzeState {
  loading: boolean;
  error: string;
  blocked: boolean;
  blockedReason: string;
  plan: AiChangePlan | null;
}

// ── Stage timeline ─────────────────────────────────────────────────────────
const STAGES = [
  { key: 'analyzing', label: 'Análisis' },
  { key: 'patch_ready', label: 'Plan' },
  { key: 'validating', label: 'Validación' },
  { key: 'ready_to_apply', label: 'Revisión' },
  { key: 'applying', label: 'Aplicando' },
  { key: 'applied', label: 'Listo' },
] as const;

function stageIndex(stage: EditorStage): number {
  return STAGES.findIndex((s) => s.key === stage);
}

function StageTimeline({ stage }: { stage: EditorStage }) {
  const active = stageIndex(stage);
  if (active < 0) return null;
  return (
    <div className="flex items-center gap-0 overflow-x-auto">
      {STAGES.map((s, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-all ${
                  done
                    ? 'bg-amtme-navy text-white'
                    : current
                      ? 'border-2 border-amtme-navy bg-white text-amtme-navy'
                      : 'border border-semantic-border bg-semantic-surface text-semantic-muted'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={`whitespace-nowrap text-[10px] ${current ? 'font-medium text-amtme-navy' : done ? 'text-amtme-navy/60' : 'text-semantic-muted'}`}
              >
                {s.label}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div
                className={`mx-1 mb-4 h-px w-6 flex-shrink-0 sm:w-10 ${done ? 'bg-amtme-navy' : 'bg-semantic-border'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Risk pill ──────────────────────────────────────────────────────────────
const RISK_STYLES: Record<string, string> = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-red-50 text-red-700 border-red-200',
  critical: 'bg-red-100 text-red-800 border-red-300',
  blocked: 'bg-gray-100 text-gray-600 border-gray-300',
};
const RISK_LABELS: Record<string, string> = {
  low: 'Riesgo bajo',
  medium: 'Riesgo medio',
  high: 'Riesgo alto',
  critical: 'Crítico',
  blocked: 'Bloqueado',
};

function RiskPill({ level }: { level: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${RISK_STYLES[level] ?? RISK_STYLES.low}`}
    >
      {RISK_LABELS[level] ?? level}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function NaturalLanguageEditor() {
  const [prompt, setPrompt] = useState('');
  const [scope] = useState<AiEditorScope>('current_page');
  const [mode] = useState<AiEditorMode>('assisted');
  const [stage, setStage] = useState<EditorStage>('idle');
  const [state, setState] = useState<AnalyzeState>({
    loading: false,
    error: '',
    blocked: false,
    blockedReason: '',
    plan: null,
  });
  const [applying, setApplying] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ChangeHistoryEntry[]>([]);
  const [persistenceInfo, setPersistenceInfo] = useState<{
    type: 'persistent' | 'session';
    source: 'supabase' | 'memory';
    reason?: string;
  }>({ type: 'session', source: 'memory' });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        if (Array.isArray(data.entries)) setHistory(data.entries);
        setPersistenceInfo({
          type: data.persistenceType ?? 'session',
          source: data.persistenceSource ?? 'memory',
          reason: data.persistenceReason,
        });
      } catch {
        // silent fallback
      }
    };
    void loadHistory();
  }, []);

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

  const analyze = async () => {
    if (!prompt.trim()) return;
    setStage('analyzing');
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
          setStage('blocked');
          setState({
            loading: false,
            error: '',
            blocked: true,
            blockedReason: data.reason ?? 'Acción bloqueada.',
            plan: null,
          });
          if (data.entry) setHistory((prev) => [data.entry as ChangeHistoryEntry, ...prev]);
          else addHistoryEntry(data.requestId ?? requestId, promptValue, null, 'blocked');
          return;
        }
        setStage('failed');
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
        setStage('patch_ready');
        setState({ loading: false, error: '', blocked: false, blockedReason: '', plan: data.plan });
        if (data.entry) setHistory((prev) => [data.entry as ChangeHistoryEntry, ...prev]);
        else addHistoryEntry(data.requestId ?? requestId, promptValue, data.plan, 'analyzed');
      }
      if (data.persistenceType && data.persistenceSource) {
        setPersistenceInfo({
          type: data.persistenceType,
          source: data.persistenceSource,
          reason: data.persistenceReason,
        });
      }
    } catch {
      setStage('failed');
      setState({
        loading: false,
        error: 'No se pudo conectar con el servicio.',
        blocked: false,
        blockedReason: '',
        plan: null,
      });
    }
  };

  const handleApply = async () => {
    if (!state.plan) return;
    setStage('applying');
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
        setStage('failed');
        setState((prev) => ({ ...prev, error: data.error ?? 'No se pudo preparar el cambio.' }));
      } else {
        setStage('applied');
        if (data.entry) setHistory((prev) => [data.entry as ChangeHistoryEntry, ...prev]);
        else {
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
        setState({ loading: false, error: '', blocked: false, blockedReason: '', plan: null });
        setPrompt('');
      }
    } catch {
      setStage('failed');
      setState((prev) => ({ ...prev, error: 'Error al preparar el cambio.' }));
    } finally {
      setApplying(false);
    }
  };

  const handleDiscard = () => {
    addHistoryEntry(`req-${Date.now()}`, prompt, state.plan, 'discarded');
    setState({ loading: false, error: '', blocked: false, blockedReason: '', plan: null });
    setStage('idle');
  };

  const handleReset = () => {
    setState({ loading: false, error: '', blocked: false, blockedReason: '', plan: null });
    setStage('idle');
    setPrompt('');
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleEditInstruction = () => {
    setState((prev) => ({ ...prev, plan: null }));
    setStage('idle');
  };

  const handleSaveAsTask = () => {
    addHistoryEntry(`req-${Date.now()}`, prompt, state.plan, 'draft');
    setState({ loading: false, error: '', blocked: false, blockedReason: '', plan: null });
    setStage('idle');
    setPrompt('');
  };

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
      if (res.ok && data.entry) setHistory((prev) => [data.entry as ChangeHistoryEntry, ...prev]);
      else if (res.ok) {
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
      // silent
    }
  };

  const isActive = stage !== 'idle';
  const hasError = stage === 'failed' || stage === 'blocked';

  return (
    <div className="space-y-6 pb-24">
      {/* Composer */}
      <div className="rounded-2xl border border-semantic-border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Modo seguro — revisión antes de aplicar
          </span>
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="text-xs text-semantic-muted underline underline-offset-2 hover:text-amtme-navy"
          >
            {showHistory ? 'Ocultar historial' : `Historial (${history.length})`}
          </button>
        </div>

        <textarea
          ref={textareaRef}
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              if (prompt.trim() && stage === 'idle') void analyze();
            }
          }}
          disabled={isActive && !hasError}
          placeholder="Quiero que el dashboard sea más claro y que priorice episodios, métricas y próximas acciones."
          className="w-full resize-none rounded-xl border border-semantic-border bg-semantic-surface-soft px-4 py-3 text-sm leading-6 text-amtme-navy placeholder:text-semantic-muted focus:border-amtme-navy/40 focus:outline-none focus:ring-2 focus:ring-amtme-navy/10 disabled:opacity-50"
        />
        <p className="mt-1.5 text-xs text-semantic-muted">⌘ + Enter para analizar</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {stage === 'idle' && (
            <button
              onClick={() => void analyze()}
              disabled={!prompt.trim()}
              className="inline-flex items-center justify-center rounded-full bg-amtme-navy px-5 py-2 text-sm font-medium text-white transition hover:bg-amtme-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              Analizar instrucción
            </button>
          )}
          {stage === 'analyzing' && (
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-full bg-amtme-navy px-5 py-2 text-sm font-medium text-white opacity-80"
            >
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Analizando…
            </button>
          )}
          {(stage === 'applied' || hasError) && (
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-full bg-amtme-navy px-5 py-2 text-sm font-medium text-white transition hover:bg-amtme-black"
            >
              Nueva instrucción
            </button>
          )}
          {isActive && stage !== 'applying' && stage !== 'analyzing' && (
            <button
              onClick={handleDiscard}
              className="inline-flex items-center justify-center rounded-full border border-semantic-border bg-white px-4 py-2 text-sm font-medium text-amtme-navy transition hover:bg-semantic-surface-soft"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Timeline */}
      {isActive && !hasError && (
        <div className="rounded-2xl border border-semantic-border bg-white px-5 py-4 shadow-sm">
          <StageTimeline stage={stage} />
        </div>
      )}

      {/* Empty state */}
      {stage === 'idle' && !showHistory && (
        <div className="rounded-2xl border border-dashed border-semantic-border bg-semantic-surface-soft px-6 py-10 text-center">
          <p className="text-sm text-semantic-muted">Todavía no hay una instrucción activa.</p>
          <p className="mt-1 text-xs text-semantic-muted">
            Nada se aplica automáticamente. Primero verás análisis, plan y validación.
          </p>
        </div>
      )}

      {/* Error */}
      {state.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">Error</p>
          <p className="mt-0.5 text-sm text-red-600">{state.error}</p>
        </div>
      )}

      {/* Blocked */}
      {state.blocked && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-base">🚫</span>
            <div>
              <p className="text-sm font-semibold text-red-700">Acción bloqueada</p>
              <p className="mt-1 text-sm text-red-600">{state.blockedReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Applied */}
      {stage === 'applied' && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-base">✅</span>
            <div>
              <p className="text-sm font-semibold text-emerald-700">Rama técnica preparada</p>
              <p className="mt-1 text-sm text-emerald-600">
                El plan fue registrado. Revisa el historial para ver el estado y hacer rollback si
                es necesario.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick plan summary */}
      {state.plan && stage === 'patch_ready' && (
        <div className="rounded-2xl border border-semantic-border bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-semantic-muted">
                Intención detectada
              </p>
              <p className="mt-1 font-mono text-sm font-medium text-amtme-navy">
                {state.plan.intent}
              </p>
            </div>
            <RiskPill level={state.plan.riskLevel} />
          </div>
          <p className="mt-3 text-sm leading-6 text-semantic-text">{state.plan.summary}</p>
          {state.plan.affectedFiles.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-semantic-muted">Archivos probables:</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {state.plan.affectedFiles.map((f) => (
                  <span
                    key={f}
                    className="rounded-md border border-semantic-border bg-semantic-surface-soft px-2 py-0.5 font-mono text-[11px] text-amtme-navy"
                  >
                    {f.replace('src/', '')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full ChangePreview */}
      {state.plan && (
        <ChangePreview
          plan={state.plan}
          onApply={handleApply}
          onDiscard={handleDiscard}
          onEditInstruction={handleEditInstruction}
          onSaveAsTask={handleSaveAsTask}
          applying={applying}
        />
      )}

      {/* History */}
      {showHistory && history.length > 0 && (
        <div className="rounded-2xl border border-semantic-border bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-semantic-muted">Historial</p>
            <span className="rounded bg-amtme-slate/10 px-1.5 py-0.5 font-mono text-xs text-amtme-navy">
              {persistenceInfo.type === 'persistent' ? 'persistente' : 'solo sesión'}
            </span>
          </div>
          <p className="mt-1 text-xs text-semantic-muted">
            {persistenceInfo.type === 'persistent'
              ? 'Cargado desde Supabase.'
              : 'Se pierde al recargar. Persistencia en base de datos no disponible en este runtime.'}
            {persistenceInfo.reason ? ` ${persistenceInfo.reason}` : ''}
          </p>
          <div className="mt-4">
            <ChangeHistory entries={history} onRollback={handleRollback} />
          </div>
        </div>
      )}

      {showHistory && history.length === 0 && (
        <div className="rounded-2xl border border-dashed border-semantic-border px-6 py-8 text-center">
          <p className="text-sm text-semantic-muted">
            Sin instrucciones anteriores en esta sesión.
          </p>
        </div>
      )}
    </div>
  );
}
