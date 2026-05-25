import type { AiChangePlan, AiEditorMode, ChangeStatus } from './types';

// ── Apply patch result ─────────────────────────────────────────────────────

export interface ApplyPatchResult {
  success: boolean;
  status: ChangeStatus;
  message: string;
  /**
   * Proposed branch name. In Phase 2 this branch is NOT yet created in GitHub —
   * it is the name that should be used when applying the diff manually or via CI.
   */
  branchName?: string;
}

// ── Apply patch ────────────────────────────────────────────────────────────
// Phase 2: Prepares the change plan and proposes a branch name.
// No real Git branch or commit is created at runtime — Next.js has no write
// access to the repository. The returned status is 'ready_to_apply', never
// 'applied'. When a real GitHub integration is available (Phase 3), this
// function should create a branch via the GitHub API and return 'applied'.

export function applyPatch(
  plan: AiChangePlan,
  mode: AiEditorMode,
  requestId: string
): ApplyPatchResult {
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

  // Phase 2: generate a proposed branch name only — no real commit is created
  const branchName = `ai-editor/${requestId.slice(0, 8)}`;

  const deferredNote =
    plan.validationStatus === 'deferred'
      ? ' Las validaciones de CI (typecheck, lint, test, build) deben ejecutarse manualmente antes de mergear.'
      : '';

  return {
    success: true,
    status: 'ready_to_apply',
    message: `Plan preparado. Rama propuesta: "${branchName}".${deferredNote} Aplica el diff en esa rama y ejecuta CI para completar.`,
    branchName,
  };
}
