import type {
  ChangeHistoryEntry,
  AiChangePlan,
  AiEditorMode,
  AiEditorScope,
  ChangeStatus,
  RiskLevel,
} from './types';

// ── In-memory change log (phase 1) ────────────────────────────────────────
// Phase 1: client-side in-memory store.
// Phase 2: replace with Supabase `ai_editor_changes` table.

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
  plan?: AiChangePlan
): ChangeHistoryEntry {
  return {
    id,
    createdAt: new Date().toISOString(),
    prompt,
    status,
    filesChanged,
    riskLevel,
    rollbackAvailable: status === 'applied',
    mode,
    scope,
    plan,
  };
}

export function updateChangeLogStatus(id: string, status: ChangeStatus): void {
  const entry = _log.find((e) => e.id === id);
  if (entry) {
    entry.status = status;
    entry.rollbackAvailable = status === 'applied';
  }
}
