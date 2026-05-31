/**
 * Node-native TDD runner for ia-editor types (Fase 0.1)
 * Uses only Node assert + tsx. No Vitest dep.
 * Mirrors the intent of the vitest version.
 */
import assert from 'node:assert/strict';
import { RiskLevelSchema, createReasoningTrace, createChangePlanItem, createIntentAnalysis, createProposalDraft } from './types';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.error(`✗ ${name}`);
    console.error(e);
    failed++;
  }
}

test('RiskLevelSchema accepts bajo/medio/alto and rejects invalid', () => {
  assert.equal(RiskLevelSchema.parse('bajo'), 'bajo');
  assert.equal(RiskLevelSchema.parse('alto'), 'alto');
  assert.throws(() => RiskLevelSchema.parse('foo'));
});

test('createReasoningTrace returns frozen object with visible reasoning', () => {
  const trace = createReasoningTrace({
    model: 'grok',
    reasoning: 'El usuario pide un EmptyState editorial humano y premium para Episodios. Cambio seguro de UI.',
    confidence: 0.89,
  });
  assert.ok(trace.id);
  assert.ok(trace.reasoning.includes('EmptyState editorial'));
  assert.ok(Object.isFrozen(trace));
  // immutability
  assert.throws(() => { (trace as any).reasoning = 'mutated'; });
});

test('createChangePlanItem carries per-item reasoning and risk', () => {
  const item = createChangePlanItem({
    module: 'Episodios',
    description: 'Añadir EmptyState con copy AMTME',
    risk: 'medio',
    reasoning: 'Solo presentación. Riesgo visual moderado.',
  });
  assert.equal(item.risk, 'medio');
  assert.ok(item.reasoning.includes('presentación'));
  assert.ok(Object.isFrozen(item));
});

test('createProposalDraft requires non-empty reasoningTrace and plan', () => {
  const trace = createReasoningTrace({ model: 'grok', reasoning: 'Razonamiento completo del modelo para la instrucción', confidence: 0.9 });
  const planItem = createChangePlanItem({ module: 'Episodios', description: 'X', risk: 'bajo', reasoning: 'Y' });

  const proposal = createProposalDraft({
    instruction: 'mejora episodios',
    intentAnalysis: createIntentAnalysis({
      originalInstruction: 'mejora episodios',
      intent: 'Mejorar UX',
      reasoning: 'Modelo entendió la intención',
      confidence: 0.82,
    }),
    plan: [planItem],
    reasoningTrace: [trace],
  });

  assert.ok(proposal.id);
  assert.ok(Object.isFrozen(proposal));
  assert.equal(proposal.simulationOnly, true);
  assert.ok(proposal.reasoningTrace.length >= 1);
});

test('Proposal creation fails without reasoning trace (guardrail)', () => {
  const planItem = createChangePlanItem({ module: 'X', description: 'x', risk: 'bajo', reasoning: 'y' });
  assert.throws(() => {
    createProposalDraft({
      instruction: 'x',
      intentAnalysis: createIntentAnalysis({ originalInstruction: 'x', intent: 'x', reasoning: 'x', confidence: 0.5 }),
      plan: [planItem],
      reasoningTrace: [], // invalid
    });
  });
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
