import type { ValidationCheck, ValidationStatus, DiffHunk, RiskLevel } from './types';

// ── Validation result ──────────────────────────────────────────────────────

export interface ValidationResult {
  status: ValidationStatus;
  checks: ValidationCheck[];
  passed: boolean;
}

// ── Validate patch before applying ────────────────────────────────────────
// In phase 1, validation is architecture-ready but runs simulated checks.
// When real CI integration is available, replace the simulation with actual
// npm run typecheck / lint / test / build calls.

export function validatePatch(diff: DiffHunk[], riskLevel: RiskLevel): ValidationResult {
  const checks: ValidationCheck[] = [];

  // Typecheck simulation
  checks.push(runSimulatedCheck('typecheck', diff, riskLevel));

  // Lint simulation
  checks.push(runSimulatedCheck('lint', diff, riskLevel));

  // Test simulation
  checks.push(runSimulatedCheck('test', diff, riskLevel));

  // Build simulation
  checks.push(runSimulatedCheck('build', diff, riskLevel));

  const anyFailed = checks.some((c) => c.status === 'failed');
  const allPassed = checks.every((c) => c.status === 'passed');

  return {
    status: anyFailed ? 'failed' : allPassed ? 'passed' : 'pending',
    checks,
    passed: !anyFailed,
  };
}

// ── Simulated check ────────────────────────────────────────────────────────

function runSimulatedCheck(name: string, diff: DiffHunk[], riskLevel: RiskLevel): ValidationCheck {
  // Blocked or critical risk: mark as failed with explanation
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

  // Detect suspicious patterns in diff
  const allLines = diff.flatMap((h) => h.lines.map((l) => l.content));
  const hasDestructivePattern = allLines.some(
    (l) => /rm\s+-rf/i.test(l) || /drop\s+table/i.test(l) || /delete\s+from/i.test(l)
  );

  if (hasDestructivePattern) {
    return {
      name,
      status: 'failed',
      error: `Patrón destructivo detectado en el diff durante validación de ${name}.`,
      recommendation: 'Elimina las líneas con comandos destructivos antes de continuar.',
    };
  }

  // Simulate passing for low/medium risk, warning for high
  if (riskLevel === 'high') {
    return {
      name,
      status: 'passed',
      recommendation:
        'Riesgo alto: verifica manualmente el resultado antes de aplicar en producción.',
    };
  }

  return { name, status: 'passed' };
}
