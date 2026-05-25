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

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  running: 'Validando…',
  passed: 'Validaciones OK',
  failed: 'Validación fallida',
  skipped: 'Omitida',
};

export function ChangePreview({
  plan,
  onApply,
  onDiscard,
  onEditInstruction,
  onSaveAsTask,
  applying,
}: ChangePreviewProps) {
  const canApply =
    plan.validationStatus === 'passed' &&
    plan.riskLevel !== 'blocked' &&
    plan.riskLevel !== 'critical';

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
          <span className="text-xs text-semantic-muted">
            {statusLabel[plan.validationStatus] ?? plan.validationStatus}
          </span>
        </div>
        <div className="mt-3">
          <ValidationPanel checks={plan.validationChecks} />
        </div>
      </Card>

      {/* Acciones */}
      <Card>
        <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">Acciones</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={onApply}
            disabled={!canApply || applying}
            className="inline-flex items-center justify-center rounded-full bg-amtme-navy px-4 py-2 text-sm font-medium text-amtme-white transition hover:bg-amtme-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {applying ? 'Aplicando…' : 'Aplicar cambio'}
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
