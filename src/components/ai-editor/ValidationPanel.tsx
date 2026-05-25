import type { ValidationCheck } from '@/lib/ai-editor/types';
import { joinClasses } from '@/lib/studio-utils';

const statusIcon: Record<string, string> = {
  passed: '✓',
  failed: '✗',
  running: '…',
  pending: '○',
  skipped: '—',
};

const statusClass: Record<string, string> = {
  passed: 'text-amtme-black',
  failed: 'text-amtme-red',
  running: 'text-amtme-slate',
  pending: 'text-amtme-slate',
  skipped: 'text-amtme-slate',
};

export function ValidationPanel({ checks }: { checks: ValidationCheck[] }) {
  if (checks.length === 0) {
    return (
      <p className="text-sm text-semantic-muted">
        Las validaciones se ejecutarán antes de aplicar el cambio.
      </p>
    );
  }

  return (
    <div className="space-y-2">
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
            <span className="rounded-full bg-amtme-slate/15 px-2 py-0.5 text-xs text-amtme-navy">
              {check.status}
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
