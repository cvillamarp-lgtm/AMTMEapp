import type { AiChangePlan, AiEditorMode, AiEditorScope, RiskLevel } from './types';
import { detectBlockedAction } from './types';
import { resolveAffectedFiles, assessRisk } from './fileResolver';

// ── Parse instruction into structured plan ─────────────────────────────────

interface ParseResult {
  intent: string;
  summary: string;
  blocked?: boolean;
  blockedReason?: string;
  plan: Omit<AiChangePlan, 'diff' | 'validationStatus' | 'validationChecks' | 'rollbackAvailable'>;
}

export function parseInstruction(
  prompt: string,
  mode: AiEditorMode,
  scope: AiEditorScope
): ParseResult {
  const blocked = detectBlockedAction(prompt);
  if (blocked.blocked) {
    return {
      intent: 'blocked',
      summary: blocked.reason ?? 'Acción bloqueada por política de seguridad.',
      blocked: true,
      blockedReason: blocked.reason,
      plan: {
        intent: 'blocked',
        summary: blocked.reason ?? 'Acción bloqueada.',
        affectedFiles: [],
        affectedRoutes: [],
        riskLevel: 'blocked',
        requiresApproval: true,
      },
    };
  }

  const { files, routes } = resolveAffectedFiles(prompt, scope);
  const riskLevel: RiskLevel = assessRisk(files, undefined, prompt);
  const requiresApproval = mode !== 'safe' ? riskLevel !== 'low' || mode === 'direct' : true;

  const intent = extractIntent(prompt);
  const summary = buildSummary(prompt, files, riskLevel);

  return {
    intent,
    summary,
    plan: {
      intent,
      summary,
      affectedFiles: files,
      affectedRoutes: routes,
      riskLevel,
      requiresApproval: mode === 'safe' ? true : requiresApproval,
    },
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function extractIntent(prompt: string): string {
  const lower = prompt.toLowerCase().trim();

  if (lower.includes('mejora') || lower.includes('mejorar')) return 'improve_ui';
  if (lower.includes('compacto') || lower.includes('compacta')) return 'compact_layout';
  if (lower.includes('zona horaria') || lower.includes('timezone')) return 'update_config';
  if (lower.includes('color') || lower.includes('paleta')) return 'update_styles';
  if (lower.includes('texto') || lower.includes('copy') || lower.includes('título'))
    return 'update_copy';
  if (lower.includes('añadir') || lower.includes('agregar') || lower.includes('crear'))
    return 'add_feature';
  if (lower.includes('componente')) return 'update_component';
  if (lower.includes('ruta') || lower.includes('página')) return 'update_route';
  if (lower.includes('datos') || lower.includes('estado')) return 'update_data';
  return 'general_modification';
}

function buildSummary(prompt: string, files: string[], riskLevel: RiskLevel): string {
  const fileCount = files.length;
  const fileWord = fileCount === 1 ? 'archivo' : 'archivos';
  const riskLabels: Record<RiskLevel, string> = {
    low: 'bajo',
    medium: 'medio',
    high: 'alto',
    critical: 'crítico',
    blocked: 'bloqueado',
  };

  const instruction = prompt.length > 80 ? `${prompt.slice(0, 77)}...` : prompt;
  return `Instrucción: "${instruction}" — Afecta ${fileCount} ${fileWord}. Riesgo: ${riskLabels[riskLevel]}.`;
}
