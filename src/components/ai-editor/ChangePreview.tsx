import type { AiChangePlan } from '@/lib/ai-editor/types';
import { Card } from '@/components/ui';
import { RiskBadge } from './RiskBadge';
import { DiffViewer } from './DiffViewer';
import { ValidationPanel } from './ValidationPanel';

interface ChangePreviewProps {
  plan: AiChangePlan;
  onApply: () => void;
  onDiscard: () => void;
  onEditInstruction: () => void;
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
  const applyLabel = applying ? 'Preparando…' : 'Preparar rama técnica';

  return (
    <div className="space-y-5">
      {/* Resumen del análisis de la IA */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-semantic-muted">
              Lo que entendió la IA
            </div>
            <p className="mt-2 text-lg font-semibold tracking-tight text-amtme-navy">
              {plan.summary}
            </p>
          </div>
          <RiskBadge level={plan.riskLevel} />
        </div>

        {plan.requiresApproval && (
          <div className="mt-4 rounded-xl border border-amtme-gold/30 bg-amtme-gold/5 px-4 py-3 text-sm">
            Este cambio requiere tu aprobación explícita antes de prepararse.
          </div>
        )}
      </Card>

      {/* Impacto del cambio */}
      <Card>
        <div className="text-xs uppercase tracking-[0.2em] text-semantic-muted mb-2">
          Impacto del cambio
        </div>

        {plan.affectedFiles.length > 0 ? (
          <div>
            <div className="text-sm font-medium text-amtme-navy mb-1.5">
              Archivos que se modificarán
            </div>
            <ul className="space-y-1.5">
              {plan.affectedFiles.map((file) => (
                <li
                  key={file}
                  className="font-mono text-xs bg-semantic-surface-soft px-3 py-1.5 rounded-lg text-amtme-navy"
                >
                  {file}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-semantic-muted">No se identificaron archivos específicos.</p>
        )}

        {plan.affectedRoutes.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium text-amtme-navy mb-1.5">
              Secciones de la app afectadas
            </div>
            <div className="flex flex-wrap gap-2">
              {plan.affectedRoutes.map((route) => (
                <span
                  key={route}
                  className="inline-block rounded-full bg-amtme-navy/5 px-3 py-1 text-xs font-mono text-amtme-navy"
                >
                  {route}
                </span>
              ))}
            </div>
          </div>
        )}
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

      {/* Seguridad y Validaciones */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-semantic-muted">
              Seguridad del cambio
            </div>
            <div className="text-sm font-medium text-amtme-navy mt-0.5">
              {validationStatusLabel[plan.validationStatus] ?? plan.validationStatus}
            </div>
          </div>
          <ValidationPanel checks={plan.validationChecks} />
        </div>

        {plan.validationRun && (
          <div className="text-[10px] text-semantic-muted">
            Validado vía:{' '}
            <span className="font-mono text-amtme-navy">{plan.validationRun.source}</span>
          </div>
        )}

        {validationDeferred && (
          <div className="mt-4 rounded-xl bg-amtme-navy/5 border border-amtme-navy/10 px-4 py-3 text-sm text-amtme-navy">
            Este cambio se marca como "propuesta". Se recomienda ejecutar verificaciones completas
            antes de mergear.
          </div>
        )}
      </Card>

      {(plan.branchName || plan.commitSha) && (
        <Card>
          <div className="text-xs uppercase tracking-[0.22em] text-semantic-muted">
            Estado técnico del cambio
          </div>
          <div className="mt-2 space-y-1 font-mono text-xs text-amtme-navy">
            {plan.branchName ? (
              <p>
                🌿 {plan.branchName} ({plan.branchType === 'real' ? 'real' : 'propuesta'})
              </p>
            ) : null}
            {plan.commitSha ? <p>🧾 {plan.commitSha}</p> : <p>🧾 sin commit real</p>}
          </div>
        </Card>
      )}

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

      {/* Acciones finales */}
      <div className="pt-2">
        <div className="text-xs uppercase tracking-[0.2em] text-semantic-muted mb-3">
          ¿Qué quieres hacer con este plan?
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onApply}
            disabled={!canPrepare || applying}
            className="inline-flex items-center justify-center rounded-full bg-amtme-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {applyLabel}
          </button>

          <button
            onClick={onDiscard}
            disabled={applying}
            className="inline-flex items-center justify-center rounded-full border border-semantic-border px-5 py-2.5 text-sm font-medium text-amtme-navy transition hover:bg-semantic-surface-soft disabled:opacity-50"
          >
            Descartar este plan
          </button>

          <button
            onClick={onEditInstruction}
            className="inline-flex items-center justify-center rounded-full border border-semantic-border px-5 py-2.5 text-sm font-medium text-amtme-navy transition hover:bg-semantic-surface-soft"
          >
            Cambiar la instrucción
          </button>
        </div>

        <div className="mt-4 text-[10px] text-semantic-muted">
          Puedes guardar esta propuesta como tarea pendiente si prefieres revisarla más tarde.
        </div>
      </div>
    </div>
  );
}
