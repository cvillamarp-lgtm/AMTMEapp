/**
 * AMTME Studio OS — IA Editor Core Types (Fase 0 foundation)
 *
 * All data structures are created as **new immutable objects**.
 * Every user-facing step (intent, plan, preview, apply, history) MUST carry
 * visible LLM reasoning for transparency and trust.
 *
 * This is the single source of truth for the conversational editor contracts.
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Risk Levels (editorial, human language)
export const RiskLevelSchema = z.enum(['bajo', 'medio', 'alto']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Reasoning Trace — the model’s visible thinking (mandatory everywhere)
export const ReasoningTraceSchema = z.object({
  id: z.string().uuid(),
  model: z.string(),
  reasoning: z.string().min(20, 'El razonamiento del modelo debe ser significativo y visible para el usuario'),
  confidence: z.number().min(0).max(1),
  timestamp: z.string().datetime(),
});
export type ReasoningTrace = z.infer<typeof ReasoningTraceSchema>;

export function createReasoningTrace(input: {
  model: string;
  reasoning: string;
  confidence: number;
}): ReasoningTrace {
  const trace: ReasoningTrace = {
    id: crypto.randomUUID(),
    model: input.model,
    reasoning: input.reasoning.trim(),
    confidence: Math.max(0, Math.min(1, input.confidence)),
    timestamp: new Date().toISOString(),
  };
  return Object.freeze(trace);
}

// ─────────────────────────────────────────────────────────────────────────────
// Change Plan Item — one concrete, human-readable change with its own reasoning
export const ChangePlanItemSchema = z.object({
  id: z.string().uuid(),
  module: z.string().min(2), // e.g. "Episodios", "Calendario", "Métricas"
  description: z.string().min(10),
  risk: RiskLevelSchema,
  reasoning: z.string().min(15, 'Cada cambio debe explicar por qué el modelo propone este riesgo'),
});
export type ChangePlanItem = z.infer<typeof ChangePlanItemSchema>;

export function createChangePlanItem(input: {
  module: string;
  description: string;
  risk: RiskLevel;
  reasoning: string;
}): ChangePlanItem {
  const item: ChangePlanItem = {
    id: crypto.randomUUID(),
    module: input.module,
    description: input.description.trim(),
    risk: input.risk,
    reasoning: input.reasoning.trim(),
  };
  return Object.freeze(item);
}

// ─────────────────────────────────────────────────────────────────────────────
// Intent Analysis — what the model understood + its reasoning
export const IntentAnalysisSchema = z.object({
  originalInstruction: z.string().min(3),
  intent: z.string().min(5),
  reasoning: z.string().min(20),
  confidence: z.number().min(0).max(1),
  suggestedModules: z.array(z.string()).min(0),
});
export type IntentAnalysis = z.infer<typeof IntentAnalysisSchema>;

export function createIntentAnalysis(input: {
  originalInstruction: string;
  intent: string;
  reasoning: string;
  confidence: number;
  suggestedModules?: string[];
}): IntentAnalysis {
  const analysis: IntentAnalysis = {
    originalInstruction: input.originalInstruction.trim(),
    intent: input.intent.trim(),
    reasoning: input.reasoning.trim(),
    confidence: Math.max(0, Math.min(1, input.confidence)),
    suggestedModules: input.suggestedModules ?? [],
  };
  return Object.freeze(analysis);
}

// ─────────────────────────────────────────────────────────────────────────────
// Proposal — the full auditable unit (immutable after creation)
export const ProposalStatusSchema = z.enum(['draft', 'confirmed', 'applied', 'rolled_back']);
export type ProposalStatus = z.infer<typeof ProposalStatusSchema>;

export const ProposalSchema = z.object({
  id: z.string().uuid(),
  instruction: z.string(),
  intentAnalysis: IntentAnalysisSchema,
  plan: z.array(ChangePlanItemSchema).min(1, 'Un plan vacío no es válido'),
  reasoningTrace: z.array(ReasoningTraceSchema).min(1, 'Toda propuesta debe contener al menos un razonamiento visible del modelo'),
  status: ProposalStatusSchema,
  createdAt: z.string().datetime(),
  userId: z.string(),
  simulationOnly: z.literal(true), // Always true in current scope — real mutation is out of scope
});
export type Proposal = z.infer<typeof ProposalSchema>;

export function createProposalDraft(input: {
  instruction: string;
  intentAnalysis: IntentAnalysis;
  plan: ChangePlanItem[];
  reasoningTrace: ReasoningTrace[];
  userId?: string;
}): Proposal {
  if (input.plan.length === 0) {
    throw new Error('No se puede crear una propuesta sin plan de cambios');
  }
  if (input.reasoningTrace.length === 0) {
    throw new Error('No se puede crear una propuesta sin rastro de razonamiento del modelo');
  }

  const proposal: Proposal = {
    id: crypto.randomUUID(),
    instruction: input.instruction.trim(),
    intentAnalysis: input.intentAnalysis,
    plan: input.plan,
    reasoningTrace: input.reasoningTrace,
    status: 'draft',
    createdAt: new Date().toISOString(),
    userId: input.userId ?? 'local-dev',
    simulationOnly: true,
  };

  // Deep freeze for true immutability
  return Object.freeze({
    ...proposal,
    plan: Object.freeze([...proposal.plan].map(Object.freeze)),
    reasoningTrace: Object.freeze([...proposal.reasoningTrace].map(Object.freeze)),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience re-exports for consumers
export const IAEditorSchemas = {
  RiskLevel: RiskLevelSchema,
  ReasoningTrace: ReasoningTraceSchema,
  ChangePlanItem: ChangePlanItemSchema,
  IntentAnalysis: IntentAnalysisSchema,
  Proposal: ProposalSchema,
} as const;
