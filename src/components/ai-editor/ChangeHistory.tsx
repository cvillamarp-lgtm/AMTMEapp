import type { ChangeHistoryEntry } from '@/lib/ai-editor/types';
import { Card, Badge } from '@/components/ui';
import { RiskBadge } from './RiskBadge';

const statusTone: Record<string, 'neutral' | 'good' | 'warning' | 'danger' | 'accent'> = {
  draft: 'neutral',
  analyzed: 'accent',
  patch_ready: 'accent',
  validating: 'warning',
  validation_pending: 'warning',
  validation_running: 'warning',
  validation_passed: 'good',
  validation_failed: 'danger',
  ready_to_apply: 'accent',
  apply_blocked: 'danger',
  approved: 'good',
  applied: 'good',
  discarded: 'neutral',
  rolled_back: 'warning',
  blocked: 'danger',
};

const statusLabel: Record<string, string> = {
  draft: 'Borrador',
  analyzed: 'Analizado',
  patch_ready: 'Patch listo',
  validating: 'Validando',
  validation_pending: 'Validación pendiente',
  validation_running: 'Validando…',
  validation_passed: 'Validado',
  validation_failed: 'Validación fallida',
  ready_to_apply: 'Listo para aplicar',
  apply_blocked: 'Bloqueado',
  approved: 'Aprobado',
  applied: 'Aplicado',
  discarded: 'Descartado',
  rolled_back: 'Descartado/Revertido',
  blocked: 'Bloqueado',
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

interface ChangeHistoryProps {
  entries: ChangeHistoryEntry[];
  onRollback?: (entry: ChangeHistoryEntry) => void;
}

export function ChangeHistory({ entries, onRollback }: ChangeHistoryProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-semantic-muted">
        Aquí aparecerá el historial de instrucciones procesadas.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const rollbackLabel = entry.status === 'ready_to_apply' ? 'Descartar plan' : 'Revertir';

        return (
          <Card key={entry.id} className="!p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-amtme-navy">{entry.prompt}</p>
                <p className="mt-1 text-xs text-semantic-muted">{formatDate(entry.createdAt)}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Badge tone={statusTone[entry.status] ?? 'neutral'}>
                  {statusLabel[entry.status] ?? entry.status}
                </Badge>
                <RiskBadge level={entry.riskLevel} />
              </div>
            </div>

            {entry.filesChanged.length > 0 ? (
              <p className="mt-2 truncate font-mono text-xs text-semantic-muted">
                {entry.filesChanged.join(', ')}
              </p>
            ) : null}

            {entry.branchName ? (
              <p className="mt-1 font-mono text-xs text-amtme-navy">
                🌿 {entry.branchName} ({entry.branchType === 'real' ? 'real' : 'propuesta'})
              </p>
            ) : null}
            {entry.commitSha ? (
              <p className="mt-1 font-mono text-xs text-amtme-navy">🧾 {entry.commitSha}</p>
            ) : null}
            {entry.validationRun ? (
              <p className="mt-1 text-xs text-semantic-muted">
                Validación: {entry.validationRun.status} · fuente {entry.validationRun.source}
                {entry.validationRun.runUrl ? (
                  <>
                    {' '}
                    ·{' '}
                    <a
                      href={entry.validationRun.runUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amtme-navy underline underline-offset-2"
                    >
                      evidencia
                    </a>
                  </>
                ) : null}
              </p>
            ) : null}
            {entry.rollbackType ? (
              <p className="mt-1 text-xs text-semantic-muted">Rollback: {entry.rollbackType}</p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-semantic-muted">
              <span>Modo: {entry.mode}</span>
              <span>·</span>
              <span>Alcance: {entry.scope}</span>
              {entry.persistenceType ? (
                <>
                  <span>·</span>
                  <span className="rounded bg-amtme-slate/10 px-1.5 py-0.5 font-mono text-amtme-navy">
                    {entry.persistenceType === 'session' ? 'sesión' : 'persistido'}
                  </span>
                </>
              ) : null}
              {entry.rollbackAvailable && onRollback ? (
                <>
                  <span>·</span>
                  <button
                    onClick={() => onRollback(entry)}
                    className="text-amtme-navy underline underline-offset-2 hover:text-amtme-black"
                  >
                    {rollbackLabel}
                  </button>
                </>
              ) : null}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
