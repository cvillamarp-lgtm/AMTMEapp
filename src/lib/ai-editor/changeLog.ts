import type {
  ChangeHistoryEntry,
  AiChangePlan,
  AiEditorMode,
  AiEditorScope,
  ChangeStatus,
  RiskLevel,
  ValidationRunMetadata,
} from './types';

// ── Persistence contract ───────────────────────────────────────────────────
// Phase 2: all entries are session-scoped (in-memory, lost on page refresh).
// Phase 3: replace with Supabase `ai_editor_changes` table and set
// persistenceType: 'persistent'.

export const CHANGE_LOG_STORAGE = 'session' as const;

// ── In-memory change log ───────────────────────────────────────────────────

const _log: ChangeHistoryEntry[] = [];

export function addChangeLogEntry(entry: ChangeHistoryEntry): void {
  _log.unshift(entry);
}

export function getChangeLog(): ChangeHistoryEntry[] {
  return [..._log];
}

export function buildHistoryEntry(
  id: string,
  prompt: string,
  mode: AiEditorMode,
  scope: AiEditorScope,
  status: ChangeStatus,
  riskLevel: RiskLevel,
  filesChanged: string[],
  plan?: AiChangePlan,
  branchName?: string,
  options?: {
    branchType?: 'real' | 'proposed';
    commitSha?: string;
    executionSource?: ChangeHistoryEntry['executionSource'];
    validationRun?: ValidationRunMetadata;
    rollbackType?: 'discard' | 'revert';
    rollbackMetadata?: ChangeHistoryEntry['rollbackMetadata'];
    persistenceType?: 'session' | 'persistent';
  }
): ChangeHistoryEntry {
  return {
    id,
    createdAt: new Date().toISOString(),
    prompt,
    status,
    filesChanged,
    riskLevel,
    // Rollback is meaningful only when a plan was prepared or actually applied
    rollbackAvailable: status === 'ready_to_apply' || status === 'applied',
    mode,
    scope,
    plan,
    branchName,
    branchType: options?.branchType,
    commitSha: options?.commitSha,
    executionSource: options?.executionSource,
    validationRun: options?.validationRun,
    rollbackType: options?.rollbackType,
    rollbackMetadata: options?.rollbackMetadata,
    persistenceType: options?.persistenceType ?? CHANGE_LOG_STORAGE,
    updatedAt: new Date().toISOString(),
  };
}

export function updateChangeLogStatus(id: string, status: ChangeStatus): void {
  const entry = _log.find((e) => e.id === id);
  if (entry) {
    entry.status = status;
    entry.rollbackAvailable = status === 'ready_to_apply' || status === 'applied';
  }
}
