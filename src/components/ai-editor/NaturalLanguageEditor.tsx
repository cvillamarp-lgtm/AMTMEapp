'use client';

import { useState } from 'react';
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
  const [history, setHistory] = useState<ChangeHistoryEntry[]>([]);

  const analyze = async () => {
    if (!prompt.trim()) return;

    setState({ loading: true, error: '', blocked: false, blockedReason: '', plan: null });

    try {
      const res = await fetch('/api/ai-editor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), mode, scope }),
      });

      const data = (await res.json()) as {
        plan?: AiChangePlan;
        blocked?: boolean;
        reason?: string;
        error?: string;
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
          addHistoryEntry(null, 'blocked');
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
        addHistoryEntry(data.plan, 'analyzed');
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
    plan: AiChangePlan | null,
    status: ChangeHistoryEntry['status'],
    branchName?: string
  ) => {
    const entry: ChangeHistoryEntry = {
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      prompt: prompt.trim(),
      status,
      filesChanged: plan?.affectedFiles ?? [],
      riskLevel: plan?.riskLevel ?? 'low',
      rollbackAvailable: status === 'ready_to_apply' || status === 'applied',
      mode,
      scope,
      plan: plan ?? undefined,
      branchName,
      persistenceType: 'session',
    };
    setHistory((prev) => [entry, ...prev]);
  };

  const handleApply = async () => {
    if (!state.plan) return;
    setApplying(true);

    try {
      const res = await fetch('/api/ai-editor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: `req-${Date.now()}`, plan: state.plan, mode }),
      });

      const data = (await res.json()) as {
        error?: string;
        message?: string;
        status?: string;
        branchName?: string;
      };

      if (!res.ok) {
        setState((prev) => ({ ...prev, error: data.error ?? 'No se pudo preparar el cambio.' }));
      } else {
        const entryStatus = (data.status as ChangeHistoryEntry['status']) ?? 'ready_to_apply';
        addHistoryEntry(state.plan, entryStatus, data.branchName);
        setState({ loading: false, error: '', blocked: false, blockedReason: '', plan: null });
        setPrompt('');
      }
    } catch {
      setState((prev) => ({ ...prev, error: 'Error al preparar el cambio.' }));
    } finally {
      setApplying(false);
    }
  };

  const handleDiscard = () => {
    addHistoryEntry(state.plan, 'discarded');
    setState({ loading: false, error: '', blocked: false, blockedReason: '', plan: null });
  };

  const handleEditInstruction = () => {
    setState((prev) => ({ ...prev, plan: null }));
  };

  const handleSaveAsTask = () => {
    addHistoryEntry(state.plan, 'draft');
    setState({ loading: false, error: '', blocked: false, blockedReason: '', plan: null });
    setPrompt('');
  };

  const handleRollback = async (entry: ChangeHistoryEntry) => {
    if (!entry.plan) return;

    try {
      const res = await fetch('/api/ai-editor/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: entry.id, plan: entry.plan }),
      });

      if (res.ok) {
        setHistory((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? { ...e, status: 'rolled_back' as const, rollbackAvailable: false }
              : e
          )
        );
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
          <Field label="Instrucción">
            <Textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ejemplo: mejora la pantalla de configuración, hazla más compacta y cambia la zona horaria a America/Cancun."
            />
          </Field>
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
            {state.loading ? 'Analizando…' : 'Analizar cambio'}
          </Button>
          {state.plan || state.blocked ? (
            <Button variant="ghost" onClick={handleDiscard}>
              Nueva instrucción
            </Button>
          ) : null}
        </div>

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
        <ChangePreview
          plan={state.plan}
          onApply={handleApply}
          onDiscard={handleDiscard}
          onEditInstruction={handleEditInstruction}
          onSaveAsTask={handleSaveAsTask}
          applying={applying}
        />
      ) : null}

      {/* History */}
      {history.length > 0 ? (
        <Card>
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
              Historial de cambios
            </div>
            <span className="rounded bg-amtme-slate/10 px-1.5 py-0.5 font-mono text-xs text-amtme-navy">
              solo sesión
            </span>
          </div>
          <p className="mt-1 text-xs text-semantic-muted">
            Este historial se pierde al recargar la página. Persistencia en base de datos pendiente
            (fase 3).
          </p>
          <div className="mt-4">
            <ChangeHistory entries={history} onRollback={handleRollback} />
          </div>
        </Card>
      ) : null}
    </div>
  );
}
