import { describe, it, expect } from 'vitest';
import {
  RiskLevelSchema,
  ReasoningTraceSchema,
  ChangePlanItemSchema,
  IntentAnalysisSchema,
  ProposalSchema,
  createReasoningTrace,
  createChangePlanItem,
  createIntentAnalysis,
  createProposalDraft,
  type RiskLevel,
} from './types';

describe('ia-editor types (immutable + Zod contracts)', () => {
  it('RiskLevelSchema accepts only bajo | medio | alto and rejects invalid', () => {
    expect(RiskLevelSchema.parse('bajo')).toBe('bajo');
    expect(RiskLevelSchema.parse('medio')).toBe('medio');
    expect(RiskLevelSchema.parse('alto')).toBe('alto');

    expect(() => RiskLevelSchema.parse('critical')).toThrow();
    expect(() => RiskLevelSchema.parse('')).toThrow();
  });

  it('createReasoningTrace returns a frozen immutable object with required fields', () => {
    const trace = createReasoningTrace({
      model: 'grok-2-latest',
      reasoning: 'El usuario quiere añadir un EmptyState editorial coherente con la identidad AMTME en el módulo de Episodios. Esto mejora la experiencia sin riesgo estructural.',
      confidence: 0.87,
    });

    expect(trace.id).toBeTypeOf('string');
    expect(trace.model).toBe('grok-2-latest');
    expect(trace.reasoning).toContain('EmptyState editorial');
    expect(trace.confidence).toBe(0.87);
    expect(trace.timestamp).toBeTypeOf('string');

    // Immutability check
    const originalReasoning = trace.reasoning;
    // @ts-expect-error - testing runtime freeze
    expect(() => { trace.reasoning = 'mutated'; }).toThrow();
    expect(trace.reasoning).toBe(originalReasoning);
  });

  it('createChangePlanItem enforces risk level and includes per-item reasoning', () => {
    const item = createChangePlanItem({
      module: 'Episodios',
      description: 'Añadir componente EmptyState editorial con copy AMTME y paleta correcta',
      risk: 'medio',
      reasoning: 'Cambio de presentación solamente. No afecta datos ni lógica de negocio. Riesgo visual moderado si el copy no encaja.',
    });

    expect(item.module).toBe('Episodios');
    expect(item.risk).toBe('medio');
    expect(item.reasoning).toContain('presentación solamente');

    // Immutability
    expect(Object.isFrozen(item)).toBe(true);
  });

  it('createIntentAnalysis captures original Spanish instruction + visible model reasoning', () => {
    const analysis = createIntentAnalysis({
      originalInstruction: 'mejora esta página de episodios con un empty state más humano y premium',
      intent: 'Añadir estado vacío editorial en el listado de episodios',
      reasoning: 'El usuario pide explícitamente tono humano y premium. Identifico el módulo Episodios/lista como objetivo. No hay riesgo de datos.',
      confidence: 0.91,
      suggestedModules: ['Episodios'],
    });

    expect(analysis.originalInstruction).toContain('empty state más humano');
    expect(analysis.reasoning).toContain('tono humano y premium');
    expect(analysis.confidence).toBeGreaterThan(0.8);
  });

  it('createProposalDraft produces a complete immutable Proposal with full reasoning trace', () => {
    const trace = createReasoningTrace({ model: 'grok', reasoning: 'Análisis inicial completo', confidence: 0.9 });
    const planItem = createChangePlanItem({
      module: 'Episodios',
      description: 'EmptyState',
      risk: 'bajo',
      reasoning: 'Solo UI',
    });

    const proposal = createProposalDraft({
      instruction: 'haz el módulo de episodios más premium',
      intentAnalysis: createIntentAnalysis({
        originalInstruction: 'haz el módulo de episodios más premium',
        intent: 'Mejorar presentación',
        reasoning: 'Razonamiento del modelo',
        confidence: 0.85,
        suggestedModules: ['Episodios'],
      }),
      plan: [planItem],
      reasoningTrace: [trace],
    });

    expect(proposal.id).toBeTypeOf('string');
    expect(proposal.plan).toHaveLength(1);
    expect(proposal.reasoningTrace).toHaveLength(1);
    expect(proposal.status).toBe('draft');

    // Full immutability of the proposal object tree
    expect(Object.isFrozen(proposal)).toBe(true);
    expect(Object.isFrozen(proposal.plan[0])).toBe(true);
  });

  it('ProposalSchema rejects proposals without any reasoning trace', () => {
    const bad = {
      id: 'p1',
      instruction: 'x',
      intentAnalysis: {} as any,
      plan: [],
      reasoningTrace: [], // empty → should fail
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      userId: 'u1',
    };

    expect(() => ProposalSchema.parse(bad)).toThrow();
  });
});
