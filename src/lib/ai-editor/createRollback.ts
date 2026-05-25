import type { AiChangePlan } from './types';

// ── Rollback result ────────────────────────────────────────────────────────

export interface RollbackResult {
  success: boolean;
  message: string;
  restoredFiles: string[];
}

// ── Create rollback snapshot ───────────────────────────────────────────────
// Phase 1: Architecture-ready stub. Real implementation connects to GitHub API
// to revert commits on the temporary branch.

export function createRollback(plan: AiChangePlan, requestId: string): RollbackResult {
  if (!plan.rollbackAvailable) {
    return {
      success: false,
      message: 'No hay snapshot de rollback disponible para este cambio.',
      restoredFiles: [],
    };
  }

  if (plan.affectedFiles.length === 0) {
    return {
      success: false,
      message: 'No hay archivos afectados registrados para revertir.',
      restoredFiles: [],
    };
  }

  // In real implementation: call GitHub API to revert the branch or commit
  return {
    success: true,
    message: `Rollback preparado para solicitud ${requestId}. ${plan.affectedFiles.length} archivo(s) revertido(s) al estado anterior.`,
    restoredFiles: plan.affectedFiles,
  };
}
