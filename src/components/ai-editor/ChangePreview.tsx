import type { AiChangePlan } from '@/lib/ai-editor/types';
import { Card, Badge } from '@/components/ui';
import { RiskBadge } from './RiskBadge';
import { DiffViewer } from './DiffViewer';
import { ValidationPanel } from './ValidationPanel';

interface ChangePreviewProps {
  plan: AiChangePlan;
  onApply: () => void;
  onDiscard: () => void;
  onEditInstruction: () => void;
  onSaveAsTask: () => void;
  applying: boolean;
}

const validationStatusLabel: Record<string, string> = {
  pending: 'Pendiente',
  running: 'Validando…',
  passed: 'Validaciones OK',
  failed: 'Validación fallida',
  skipped: 'Omitida',
  deferred: 'Diferido — requiere CI',
};

export function ChangePreview({
  plan,
  onApply,
  onDiscard,
  onEditInstruction,
  onSaveAsTask,
  applying,
}: ChangePreviewProps) {
  const validationFailed =
    plan.validationStatus === 'failed' ||
    plan.riskLevel === 'blocked' ||
    plan.riskLevel === 'critical';

  const validationDeferred = plan.validationStatus === 'deferred';

  // Can proceed to prepare branch when validations are deferred or passed,
  // but block when validations have actually failed (security/destructive patterns)
  const canPrepare = !validationFailed;

  // Label reflects what the action actually does in Phase 2
  const applyLabel = applying
    ? 'Preparando…'
    : validationDeferred
      ? 'Preparar rama'
      : 'Aplicar cambio';

  return (
    <div className="space-y-5">
      {/* Intención y resumen */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
              Intención detectada
            </div>
            <p className="mt-1 font-mono text-sm font-medium text-amtme-navy">{plan.intent}</p>
          </div>
          <RiskBadge level={plan.riskLevel} />
        </div>
        <p className="mt-3 text-sm leading-6 text-semantic-text">{plan.summary}</p>

        {plan.requiresApproval ? (
          <div className="mt-3">
            <Badge tone="warning">Requiere aprobación manual</Badge>
          </div>
        ) : null}
      </Card>

      {/* Archivos afectados */}
      <Card>
        <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
          Archivos afectados
        </div>
        {plan.affectedFiles.length === 0 ? (
          <p className="mt-2 text-sm text-semantic-muted">Ningún archivo identificado.</p>
        ) : (
          <ul className="mt-3 space-y-1">
            {plan.affectedFiles.map((file) => (
              <li key={file} className="font-mono text-xs text-amtme-navy">
                · {file}
              </li>
            ))}
          </ul>
        )}

        {plan.affectedRoutes.length > 0 ? (
          <div className="mt-4">
            <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">Rutas</div>
            <ul className="mt-2 space-y-1">
              {plan.affectedRoutes.map((route) => (
                <li key={route} className="font-mono text-xs text-amtme-navy">
                  → {route}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      {/* Diff */}
      <Card>
        <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
          Vista de cambios (diff)
        </div>
        <div className="mt-3">
          <DiffViewer diff={plan.diff} />
        </div>
      </Card>

      {/* Validaciones */}
      <Card>
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
            Validaciones
          </div>
          <span
            className={`text-xs ${validationFailed ? 'text-amtme-red' : validationDeferred ? 'text-amtme-navy' : 'text-semantic-muted'}`}
          >
            {validationStatusLabel[plan.validationStatus] ?? plan.validationStatus}
          </span>
        </div>
        <div className="mt-3">
          <ValidationPanel checks={plan.validationChecks} />
        </div>
      </Card>

      {/* Nota CI cuando validaciones diferidas */}
      {validationDeferred ? (
        <div className="rounded-2xl border border-amtme-navy/20 bg-amtme-navy/5 px-4 py-3 text-sm text-amtme-navy">
          <p className="font-medium">⚠️ Validaciones CI pendientes</p>
          <p className="mt-1 text-xs leading-5 text-semantic-muted">
            Antes de mergear la rama propuesta, ejecuta localmente o en CI:
          </p>
          <pre className="mt-2 rounded bg-semantic-surface-soft p-2 font-mono text-xs text-amtme-navy">
            {`npm run type-check && npm run lint && npm run test && npm run build`}
          </pre>
        </div>
      ) : null}

      {/* Acciones */}
      <Card>
        <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">Acciones</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={onApply}
            disabled={!canPrepare || applying}
            className="inline-flex items-center justify-center rounded-full bg-amtme-navy px-4 py-2 text-sm font-medium text-amtme-white transition hover:bg-amtme-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {applyLabel}
          </button>
          <button
            onClick={onDiscard}
            disabled={applying}
            className="inline-flex items-center justify-center rounded-full border border-semantic-border bg-semantic-surface px-4 py-2 text-sm font-medium text-amtme-navy transition hover:bg-semantic-surface-soft disabled:opacity-50"
          >
            Descartar
          </button>
          <button
            onClick={onEditInstruction}
            className="inline-flex items-center justify-center rounded-full border border-semantic-border bg-semantic-surface px-4 py-2 text-sm font-medium text-amtme-navy transition hover:bg-semantic-surface-soft"
          >
            Editar instrucción
          </button>
          <button
            onClick={onSaveAsTask}
            className="inline-flex items-center justify-center rounded-full border border-semantic-border bg-semantic-surface px-4 py-2 text-sm font-medium text-amtme-navy transition hover:bg-semantic-surface-soft"
          >
            Guardar como tarea
          </button>
        </div>
      </Card>
    </div>
  );
}
