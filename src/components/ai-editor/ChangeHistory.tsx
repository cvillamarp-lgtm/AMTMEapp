import type { ChangeHistoryEntry } from '@/lib/ai-editor/types';
import { Card, Badge } from '@/components/ui';
import { RiskBadge } from './RiskBadge';

const statusTone: Record<string, 'neutral' | 'good' | 'warning' | 'danger' | 'accent'> = {
  draft: 'neutral',
  analyzed: 'accent',
  patch_ready: 'accent',
  validating: 'warning',
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
  approved: 'Aprobado',
  applied: 'Aplicado',
  discarded: 'Descartado',
  rolled_back: 'Revertido',
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
      {entries.map((entry) => (
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

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-semantic-muted">
            <span>Modo: {entry.mode}</span>
            <span>·</span>
            <span>Alcance: {entry.scope}</span>
            {entry.rollbackAvailable && onRollback ? (
              <>
                <span>·</span>
                <button
                  onClick={() => onRollback(entry)}
                  className="text-amtme-navy underline underline-offset-2 hover:text-amtme-black"
                >
                  Revertir
                </button>
              </>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
