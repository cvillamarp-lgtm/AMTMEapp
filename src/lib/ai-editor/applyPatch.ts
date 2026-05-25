import type { AiChangePlan, AiEditorMode, ChangeStatus } from './types';

// ── Apply patch result ─────────────────────────────────────────────────────

export interface ApplyPatchResult {
  success: boolean;
  status: ChangeStatus;
  message: string;
  branchName?: string;
}

// ── Apply patch ────────────────────────────────────────────────────────────
// Phase 1: Architecture-ready stub. Real implementation connects to GitHub API
// to create a branch and commit the diff.

export function applyPatch(
  plan: AiChangePlan,
  mode: AiEditorMode,
  requestId: string
): ApplyPatchResult {
  if (!plan.validationStatus || plan.validationStatus !== 'passed') {
    return {
      success: false,
      status: 'validating',
      message: 'Las validaciones deben pasar antes de aplicar el cambio.',
    };
  }

  if (plan.riskLevel === 'blocked' || plan.riskLevel === 'critical') {
    return {
      success: false,
      status: 'blocked',
      message: 'No se puede aplicar un cambio bloqueado o de riesgo crítico sin aprobación.',
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
      message: 'Modo seguro: solo análisis. No se aplican cambios.',
    };
  }

  // mode === 'direct': create on temp branch only (never direct to main/production)
  const branchName = `ai-editor/${requestId.slice(0, 8)}`;

  return {
    success: true,
    status: 'applied',
    message: `Cambio aplicado en rama temporal "${branchName}". Requiere revisión antes de merge.`,
    branchName,
  };
}
