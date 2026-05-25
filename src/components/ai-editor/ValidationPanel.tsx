import type { ValidationCheck } from '@/lib/ai-editor/types';
import { joinClasses } from '@/lib/studio-utils';

const statusIcon: Record<string, string> = {
  passed: '✓',
  failed: '✗',
  running: '…',
  pending: '○',
  skipped: '—',
  deferred: '⏸',
};

const statusClass: Record<string, string> = {
  passed: 'text-amtme-black',
  failed: 'text-amtme-red',
  running: 'text-amtme-slate',
  pending: 'text-amtme-slate',
  skipped: 'text-amtme-slate',
  deferred: 'text-amtme-navy',
};

interface ValidationPanelProps {
  checks: ValidationCheck[];
}

export function ValidationPanel({ checks }: ValidationPanelProps) {
  if (checks.length === 0) {
    return (
      <p className="text-sm text-semantic-muted">
        Las validaciones se ejecutarán antes de aplicar el cambio.
      </p>
    );
  }

  const hasDeferredChecks = checks.some((c) => c.status === 'deferred');

  return (
    <div className="space-y-2">
      {hasDeferredChecks ? (
        <div className="rounded-2xl border border-amtme-navy/20 bg-amtme-navy/5 px-4 py-3">
          <p className="text-xs font-medium text-amtme-navy">
            ⏸ Validaciones diferidas — no ejecutadas en runtime
          </p>
          <p className="mt-1 text-xs text-semantic-muted">
            Estas validaciones no pueden ejecutarse desde el servidor web. Deben correr en CI/CD o
            localmente antes de aplicar el cambio a producción.
          </p>
        </div>
      ) : null}

      {checks.map((check) => (
        <div
          key={check.name}
          className="rounded-2xl border border-semantic-border bg-semantic-surface-soft px-4 py-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={joinClasses(
                'text-sm font-medium',
                statusClass[check.status] ?? 'text-semantic-text'
              )}
            >
              <span className="mr-2 font-mono">{statusIcon[check.status] ?? '?'}</span>
              {check.name}
            </span>
            <span
              className={joinClasses(
                'rounded-full px-2 py-0.5 text-xs',
                check.status === 'deferred'
                  ? 'bg-amtme-navy/10 text-amtme-navy'
                  : check.status === 'failed'
                    ? 'bg-amtme-red/10 text-amtme-red'
                    : 'bg-amtme-slate/15 text-amtme-navy'
              )}
            >
              {check.status === 'deferred' ? 'diferido' : check.status}
            </span>
          </div>

          {check.error ? <p className="mt-2 text-xs text-amtme-red">{check.error}</p> : null}

          {check.affectedFile ? (
            <p className="mt-1 font-mono text-xs text-semantic-muted">
              {check.affectedFile}
              {check.approximateLine ? `:${String(check.approximateLine)}` : ''}
            </p>
          ) : null}

          {check.recommendation ? (
            <p className="mt-1 text-xs text-semantic-muted">💡 {check.recommendation}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
