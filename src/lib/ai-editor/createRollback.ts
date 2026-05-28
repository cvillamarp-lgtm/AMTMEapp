import type { AiChangePlan } from './types';
import { rollbackGitHubChange } from './githubIntegration';

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
  rollbackCommitSha?: string;
}

// ── Create rollback ────────────────────────────────────────────────────────
// Phase 2: No real commits are created by applyPatch (which returns
// 'ready_to_apply', not 'applied'). Therefore rollback is always a plan
// discard operation — no files are restored from Git.
//
// When Phase 3 implements a real GitHub branch + commit via the API,
// this function should detect a real commit and perform an actual revert,
// returning rollbackType: 'revert' with the restored file list.

export async function createRollback(
  plan: AiChangePlan,
  requestId: string,
  options?: {
    branchName?: string;
    commitSha?: string;
    rollbackMetadata?: { strategy?: string; patchFilePath?: string };
  }
): Promise<RollbackResult> {
  if (!plan.rollbackAvailable) {
    return {
      success: false,
      message: 'No hay operación activa para deshacer en esta solicitud.',
      restoredFiles: [],
      rollbackType: 'discard',
    };
  }

  if (options?.commitSha && options.branchName) {
    const githubRollback = await rollbackGitHubChange({
      branchName: options.branchName,
      requestId,
      rollbackMetadata: options.rollbackMetadata,
    });

    if (githubRollback.success) {
      return {
        success: true,
        message: githubRollback.message,
        restoredFiles: githubRollback.restoredFiles,
        rollbackType: 'revert',
        rollbackCommitSha: githubRollback.rollbackCommitSha,
      };
    }

    return {
      success: false,
      message: githubRollback.message,
      restoredFiles: [],
      rollbackType: 'discard',
    };
  }

  if (options?.commitSha && !options.branchName) {
    return {
      success: false,
      message: 'Rollback real requiere branchName cuando existe commitSha.',
      restoredFiles: [],
      rollbackType: 'discard',
    };
  }

  return {
    success: true,
    message: `Plan descartado para solicitud ${requestId}. No se realizó ningún commit real — el diff propuesto ha sido cancelado.`,
    restoredFiles: [],
    rollbackType: 'discard',
  };
}
