/**
 * Intent Analyzer for AMTME IA Editor
 * Uses the reasoning-forcing llm-client to turn natural language into
 * typed IntentAnalysis + ChangePlan with risk levels.
 */

import { generateWithReasoning } from './llm-client';
import type { AIProvider } from '@/lib/studio-types';
import type { IntentAnalysis, ChangePlanItem, RiskLevel } from './types';
import { createIntentAnalysis, createChangePlanItem } from './types';

export interface AnalyzeInstructionInput {
  provider: AIProvider;
  instruction: string;
  currentModules?: string[];
}

export interface AnalyzeInstructionResult {
  intentAnalysis: IntentAnalysis;
  plan: ChangePlanItem[];
  overallRisk: RiskLevel;
  rawReasoning: string;
}

const RISK_KEYWORDS = {
  alto: ['borrar', 'eliminar', 'delete', 'drop', 'truncate', 'secret', 'clave', 'password', 'auth', 'production', 'prod', 'real db', 'base de datos real'],
  medio: ['modificar', 'cambiar', 'update', 'editar', 'reemplazar', 'migrar'],
  bajo: ['añadir', 'agregar', 'crear', 'mejorar', 'pulir', 'empty state', 'ui', 'visual', 'copy', 'texto'],
};

// Security guardrails - blocked actions (never allow even in simulation without explicit override)
// Broad but precise: catch real destructive / credential / prod mutation attempts
const BLOCKED_PATTERNS = [
  /borrar\s+(todo|la base|db|database|produccion|repo|github|datos)/i,
  /eliminar\s+(tabla|datos|usuarios|auth|claves|secrets|produccion|base)/i,
  /(cambiar|modificar|actualizar|setear)\s+(auth|autenticaci[oó]n|claves?|api.?key|env|variables?.*entorno|config.*seguridad|secret)/i,
  /acceder\s+(a la db real|produccion|secrets|admin|clave)/i,
  /mutar en (produccion|real|live|db)/i,
  /base de datos (real|produccion|live)/i,
];

export function detectBlockedAction(instruction: string): { blocked: boolean; reason?: string } {
  const lower = instruction.toLowerCase().trim();
  // Robust detection (regex + keyword fallback for Spanish variations)
  const blocked = BLOCKED_PATTERNS.some(p => p.test(lower)) ||
    (lower.includes('borrar') && (lower.includes('base') || lower.includes('produccion') || lower.includes('db'))) ||
    (lower.includes('eliminar') && (lower.includes('tabla') || lower.includes('datos') || lower.includes('produccion'))) ||
    (lower.includes('base de datos') && (lower.includes('real') || lower.includes('produccion')));
  if (blocked) {
    return {
      blocked: true,
      reason: 'Acción bloqueada por guardrails de seguridad. Esta instrucción intenta realizar cambios de alto riesgo en sistemas reales o credenciales. El editor solo permite simulaciones seguras de UI/UX y contenido editorial. (Razonamiento visible del guardrail)',
    };
  }
  return { blocked: false };
}

function inferRisk(text: string): RiskLevel {
  const lower = text.toLowerCase();
  if (RISK_KEYWORDS.alto.some(k => lower.includes(k))) return 'alto';
  if (RISK_KEYWORDS.medio.some(k => lower.includes(k))) return 'medio';
  return 'bajo';
}

export async function analyzeInstruction(input: AnalyzeInstructionInput): Promise<AnalyzeInstructionResult> {
  const { provider, instruction, currentModules = ['Episodios', 'Calendario', 'Métricas', 'Contenido'] } = input;

  // Security guardrail - fail fast, never proceed with blocked intent (visible in reasoning)
  const blockCheck = detectBlockedAction(instruction);
  if (blockCheck.blocked) {
    const blockedAnalysis = createIntentAnalysis({
      originalInstruction: instruction,
      intent: 'Acción bloqueada por seguridad',
      reasoning: blockCheck.reason || 'Instrucción rechazada por políticas de guardrail.',
      confidence: 1.0,
      suggestedModules: [],
    });
    const blockedPlan: ChangePlanItem[] = [
      createChangePlanItem({
        module: 'Seguridad',
        description: 'Bloqueo de instrucción peligrosa (no se generó plan de cambios)',
        risk: 'alto',
        reasoning: blockCheck.reason || 'Guardrail activado.',
      }),
    ];
    return {
      intentAnalysis: blockedAnalysis,
      plan: blockedPlan,
      overallRisk: 'alto',
      rawReasoning: blockCheck.reason || 'Bloqueado',
    };
  }

  const context = `Módulos disponibles en el Studio: ${currentModules.join(', ')}. 
El usuario habla en español natural. Devuelve un plan accionable y humano.`;

  const response = await generateWithReasoning({
    provider,
    instruction,
    context,
  });

  // Parse the structured result from the model (it may be in the 'result' field)
  const planItems: ChangePlanItem[] = [];
  let overallRisk: RiskLevel = 'bajo';

  // Very simple heuristic parser for the first version (we can make it LLM-structured later)
  const lines = response.result.split('\n').filter(l => l.trim().length > 5);

  lines.forEach((line, index) => {
    const risk = inferRisk(line + ' ' + response.reasoning);
    if (risk === 'alto') overallRisk = 'alto';
    else if (risk === 'medio' && overallRisk !== 'alto') overallRisk = 'medio';

    planItems.push(
      createChangePlanItem({
        module: currentModules[index % currentModules.length],
        description: line.trim().slice(0, 120),
        risk,
        reasoning: response.reasoning.slice(0, 280),
      })
    );
  });

  if (planItems.length === 0) {
    // Fallback single item
    planItems.push(
      createChangePlanItem({
        module: 'General',
        description: response.result.slice(0, 140),
        risk: inferRisk(response.reasoning),
        reasoning: response.reasoning,
      })
    );
  }

  const intentAnalysis = createIntentAnalysis({
    originalInstruction: instruction,
    intent: response.result.slice(0, 200),
    reasoning: response.reasoning,
    confidence: response.confidence ?? 0.75,
    suggestedModules: currentModules.slice(0, 3),
  });

  return {
    intentAnalysis,
    plan: planItems,
    overallRisk,
    rawReasoning: response.reasoning,
  };
}
