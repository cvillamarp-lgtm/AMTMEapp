import type { AiChangePlan, AiEditorMode, ChangeStatus } from './types';
import { prepareGitHubChange } from './githubIntegration';

// ── Apply patch result ─────────────────────────────────────────────────────

export interface ApplyPatchResult {
  success: boolean;
  status: ChangeStatus;
  message: string;
  branchName?: string;
  branchType?: 'real' | 'proposed';
  commitSha?: string;
  executionSource?: 'simulation' | 'github_api';
  rollbackMetadata?: {
    strategy: string;
    patchFilePath?: string;
    details?: string;
  };
  evidenceUrl?: string;
}

// ── Apply patch ────────────────────────────────────────────────────────────
// Phase 2: Prepares the change plan and proposes a branch name.
// No real Git branch or commit is created at runtime — Next.js has no write
// access to the repository. The returned status is 'ready_to_apply', never
// 'applied'. When a real GitHub integration is available (Phase 3), this
// function should create a branch via the GitHub API and return 'applied'.

export async function applyPatch(
  plan: AiChangePlan,
  mode: AiEditorMode,
  requestId: string,
  prompt?: string
): Promise<ApplyPatchResult> {
  // Block when validations explicitly failed (policy or destructive patterns)
  if (plan.validationStatus === 'failed') {
    return {
      success: false,
      status: 'apply_blocked',
      message:
        'Las validaciones fallaron. Revisa los errores de seguridad o patrones destructivos antes de continuar.',
    };
  }

  if (plan.riskLevel === 'blocked' || plan.riskLevel === 'critical') {
    return {
      success: false,
      status: 'apply_blocked',
      message: 'No se puede preparar un cambio bloqueado o de riesgo crítico sin aprobación.',
    };
  }

  if (plan.requiresApproval && mode !== 'direct') {
    return {
      success: false,
      status: 'approved',
      message: 'Cambio pendiente de aprobación manual.',
    };
  }

  if (mode === 'safe') {
    return {
      success: false,
      status: 'draft',
      message: 'Modo seguro: solo análisis. No se aplican ni preparan cambios.',
    };
  }

  const githubIntegration = await prepareGitHubChange(plan, requestId, prompt);

  const deferredNote =
    plan.validationStatus === 'deferred'
      ? ' Las validaciones de CI (typecheck, lint, test, build) deben ejecutarse manualmente antes de mergear.'
      : '';

  return {
    success: true,
    status: 'ready_to_apply',
    message: `${githubIntegration.message}${deferredNote} ${
      githubIntegration.diffAppliedToFiles
        ? 'El diff fue aplicado sobre archivos del branch técnico.'
        : 'El diff quedó registrado como artefacto técnico; la aplicación sobre archivos de producto sigue pendiente de ejecución controlada.'
    }`,
    branchName: githubIntegration.branchName,
    branchType: githubIntegration.branchType,
    commitSha: githubIntegration.commitSha,
    executionSource: githubIntegration.executionSource,
    rollbackMetadata: githubIntegration.rollbackMetadata,
    evidenceUrl: githubIntegration.evidenceUrl,
  };
}
