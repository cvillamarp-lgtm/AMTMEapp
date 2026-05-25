import type { ValidationCheck, ValidationStatus, DiffHunk, RiskLevel } from './types';

// ── Validation result ──────────────────────────────────────────────────────

export interface ValidationResult {
  status: ValidationStatus;
  checks: ValidationCheck[];
  /** true only when all checks actually executed and none failed */
  passed: boolean;
  /**
   * true when at least one check was not executed (deferred to CI).
   * deferred checks must NOT be interpreted as passing.
   */
  deferred: boolean;
}

// ── CI command map ─────────────────────────────────────────────────────────

const CI_COMMANDS: Record<string, string> = {
  typecheck: 'npm run type-check',
  lint: 'npm run lint',
  test: 'npm run test',
  build: 'npm run build',
};

// ── Validate patch before applying ────────────────────────────────────────
// Phase 2: policy checks (blocked/critical/destructive patterns) execute
// immediately server-side. CI checks (typecheck, lint, test, build) are
// deferred — they cannot run from within Next.js at request time.
// Deferred status ≠ passed. The UI must make this explicit.

export function validatePatch(diff: DiffHunk[], riskLevel: RiskLevel): ValidationResult {
  const checks: ValidationCheck[] = [];

  for (const name of ['typecheck', 'lint', 'test', 'build'] as const) {
    checks.push(runCheck(name, diff, riskLevel));
  }

  const anyFailed = checks.some((c) => c.status === 'failed');
  const anyDeferred = checks.some((c) => c.status === 'deferred');

  return {
    status: anyFailed ? 'failed' : anyDeferred ? 'deferred' : 'passed',
    checks,
    // Only truly passed when ALL checks executed and none failed
    passed: !anyFailed && !anyDeferred,
    deferred: anyDeferred,
  };
}

// ── Individual check ───────────────────────────────────────────────────────

function runCheck(
  name: keyof typeof CI_COMMANDS,
  diff: DiffHunk[],
  riskLevel: RiskLevel
): ValidationCheck {
  // Policy failures — can be determined without running CI
  if (riskLevel === 'blocked') {
    return {
      name,
      status: 'failed',
      error: 'Acción bloqueada por política de seguridad.',
      recommendation: 'Revisa la instrucción y elimina acciones destructivas.',
    };
  }

  if (riskLevel === 'critical') {
    return {
      name,
      status: 'failed',
      error: 'Riesgo crítico detectado. Se requiere revisión manual antes de continuar.',
      recommendation: 'Solicita revisión de seguridad explícita.',
    };
  }

  // Destructive pattern detection in diff — server-side, no CI needed
  const allLines = diff.flatMap((h) => h.lines.map((l) => l.content));
  const hasDestructivePattern = allLines.some(
    (l) => /rm\s+-rf/i.test(l) || /drop\s+table/i.test(l) || /delete\s+from/i.test(l)
  );

  if (hasDestructivePattern) {
    return {
      name,
      status: 'failed',
      error: `Patrón destructivo detectado en el diff (validación de ${name}).`,
      recommendation: 'Elimina las líneas con comandos destructivos antes de continuar.',
    };
  }

  // All other checks must be deferred to CI — cannot run npm commands at request time
  return {
    name,
    status: 'deferred',
    recommendation: `Ejecuta manualmente: ${CI_COMMANDS[name]}`,
  };
}
