import type { AiChangePlan } from './types';

// ── Rollback result ────────────────────────────────────────────────────────

export type RollbackType = 'discard' | 'revert';

export interface RollbackResult {
  success: boolean;
  message: string;
  restoredFiles: string[];
  /**
   * 'discard' — no real commit existed; rollback means cancelling the prepared plan.
   * 'revert'  — a real commit was made and has been reverted (Phase 3+).
   */
  rollbackType: RollbackType;
}

// ── Create rollback ────────────────────────────────────────────────────────
// Phase 2: No real commits are created by applyPatch (which returns
// 'ready_to_apply', not 'applied'). Therefore rollback is always a plan
// discard operation — no files are restored from Git.
//
// When Phase 3 implements a real GitHub branch + commit via the API,
// this function should detect a real commit and perform an actual revert,
// returning rollbackType: 'revert' with the restored file list.

export function createRollback(plan: AiChangePlan, requestId: string): RollbackResult {
  if (!plan.rollbackAvailable) {
    return {
      success: false,
      message: 'No hay operación activa para deshacer en esta solicitud.',
      restoredFiles: [],
      rollbackType: 'discard',
    };
  }

  // Phase 2: no real commit was made, so rollback = discard the prepared plan
  return {
    success: true,
    message: `Plan descartado para solicitud ${requestId}. No se realizó ningún commit real — el diff propuesto ha sido cancelado.`,
    restoredFiles: [],
    rollbackType: 'discard',
  };
}
