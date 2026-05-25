import { z } from 'zod';

// ── Enums ──────────────────────────────────────────────────────────────────

export const AiEditorModeSchema = z.enum(['safe', 'assisted', 'direct']);
export type AiEditorMode = z.infer<typeof AiEditorModeSchema>;

export const AiEditorScopeSchema = z.enum([
  'current_page',
  'module',
  'whole_app',
  'styles_only',
  'copy_only',
  'data_only',
  'components_only',
]);
export type AiEditorScope = z.infer<typeof AiEditorScopeSchema>;

export const RiskLevelSchema = z.enum(['low', 'medium', 'high', 'critical', 'blocked']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const ValidationStatusSchema = z.enum([
  'pending',
  'running',
  'passed',
  'failed',
  'skipped',
  // Phase 2: validation scheduled but not yet executed (e.g. CI must run externally)
  'deferred',
]);
export type ValidationStatus = z.infer<typeof ValidationStatusSchema>;

export const ChangeStatusSchema = z.enum([
  'draft',
  'analyzed',
  'patch_ready',
  'validating',
  // Phase 2 explicit states
  'validation_pending',
  'validation_running',
  'validation_passed',
  'validation_failed',
  'ready_to_apply',
  'apply_blocked',
  // Legacy / future states kept for compatibility
  'approved',
  'applied',
  'discarded',
  'rolled_back',
  'blocked',
]);
export type ChangeStatus = z.infer<typeof ChangeStatusSchema>;

// ── Validation Check ────────────────────────────────────────────────────────

export const ValidationCheckSchema = z.object({
  name: z.string(),
  status: ValidationStatusSchema,
  error: z.string().optional(),
  affectedFile: z.string().optional(),
  approximateLine: z.number().int().positive().optional(),
  recommendation: z.string().optional(),
});
export type ValidationCheck = z.infer<typeof ValidationCheckSchema>;

// ── Diff Hunk ──────────────────────────────────────────────────────────────

export const DiffHunkSchema = z.object({
  file: z.string(),
  oldStart: z.number().int().nonnegative(),
  newStart: z.number().int().nonnegative(),
  lines: z.array(
    z.object({
      type: z.enum(['context', 'add', 'remove']),
      content: z.string(),
    })
  ),
});
export type DiffHunk = z.infer<typeof DiffHunkSchema>;

// ── Change Request ─────────────────────────────────────────────────────────

export const AiChangeRequestSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  prompt: z.string().min(1),
  mode: AiEditorModeSchema,
  scope: AiEditorScopeSchema,
});
export type AiChangeRequest = z.infer<typeof AiChangeRequestSchema>;

// ── Change Plan ────────────────────────────────────────────────────────────

export const AiChangePlanSchema = z.object({
  intent: z.string(),
  summary: z.string(),
  affectedFiles: z.array(z.string()),
  affectedRoutes: z.array(z.string()),
  riskLevel: RiskLevelSchema,
  requiresApproval: z.boolean(),
  diff: z.array(DiffHunkSchema),
  validationStatus: ValidationStatusSchema,
  validationChecks: z.array(ValidationCheckSchema),
  rollbackAvailable: z.boolean(),
});
export type AiChangePlan = z.infer<typeof AiChangePlanSchema>;

// ── Change History Entry ───────────────────────────────────────────────────

export const ChangeHistoryEntrySchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  prompt: z.string().min(1),
  status: ChangeStatusSchema,
  filesChanged: z.array(z.string()),
  riskLevel: RiskLevelSchema,
  rollbackAvailable: z.boolean(),
  mode: AiEditorModeSchema,
  scope: AiEditorScopeSchema,
  plan: AiChangePlanSchema.optional(),
  // Phase 2: proposed branch name when status === 'ready_to_apply'
  branchName: z.string().optional(),
  // Phase 2: 'session' = in-memory only; 'persistent' = saved to DB
  persistenceType: z.enum(['session', 'persistent']).optional(),
});
export type ChangeHistoryEntry = z.infer<typeof ChangeHistoryEntrySchema>;

// ── Blocked Actions ────────────────────────────────────────────────────────

export const BLOCKED_PATTERNS: { pattern: RegExp; reason: string }[] = [
  {
    pattern: /eliminar?\b.{0,20}\b(archivo|fichero|ruta|route)/i,
    reason: 'Eliminar archivos está bloqueado.',
  },
  {
    pattern: /borrar?\b.{0,20}\b(todo|base\s+de\s+datos|producción)/i,
    reason: 'Acción destructiva bloqueada.',
  },
  {
    pattern: /\b(api[_-]?key|secret|token|password|contraseña)\b.*=\s*['"]/i,
    reason: 'No se pueden exponer claves privadas.',
  },
  {
    pattern: /deploy\s*(directo|a\s+producci[oó]n|to\s+prod)/i,
    reason: 'Deploy directo a producción bloqueado.',
  },
  {
    pattern: /modificar?\s+(auth|autenticaci[oó]n|authentication)\b/i,
    reason: 'Modificación de autenticación crítica requiere revisión manual.',
  },
  { pattern: /\brm\s+-rf\b/i, reason: 'Comandos destructivos de sistema bloqueados.' },
  {
    pattern: /eliminar?\b.{0,20}\b(base\s+de\s+datos|database|db)\b/i,
    reason: 'Eliminar base de datos está bloqueado.',
  },
];

export function detectBlockedAction(prompt: string): { blocked: boolean; reason?: string } {
  for (const { pattern, reason } of BLOCKED_PATTERNS) {
    if (pattern.test(prompt)) {
      return { blocked: true, reason };
    }
  }
  return { blocked: false };
}
