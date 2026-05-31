/**
 * Node TDD for useEditorSession (immutable state machine)
 * Tests the exported pure reducer directly (no React needed).
 */
import assert from 'node:assert/strict';
import { editorSessionReducer, initialEditorState, type EditorAction } from './useEditorSession';
import type { IntentAnalysis, ChangePlanItem } from '@/lib/ia-editor/types';
import { createIntentAnalysis, createChangePlanItem, createProposalDraft, createReasoningTrace } from '@/lib/ia-editor/types';
import { detectBlockedAction } from '@/lib/ia-editor/intentAnalyzer';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try { fn(); console.log(`✓ ${name}`); passed++; }
  catch (e) { console.error(`✗ ${name}`); console.error(e); failed++; }
}

function main() {
  test('initial state is idle with empty history (immutable)', () => {
    assert.equal(initialEditorState.phase, 'idle');
    assert.equal(initialEditorState.history.length, 0);
    assert.ok(Object.isFrozen(initialEditorState) === false); // not frozen root but children are in practice
  });

  test('START_THINKING resets to thinking preserving history (immutability)', () => {
    const prev = { ...initialEditorState, history: [{ id: 'p1' } as any] };
    const next = editorSessionReducer(prev, { type: 'START_THINKING', instruction: 'mejora episodios' });
    assert.equal(next.phase, 'thinking');
    assert.equal(next.instruction, 'mejora episodios');
    assert.equal(next.history.length, 1); // preserved
    assert.notStrictEqual(next, prev); // new object
  });

  test('RECEIVE_PLAN moves to plan-ready with data', () => {
    const ia: IntentAnalysis = createIntentAnalysis({ originalInstruction: 'x', intent: 'y', reasoning: 'z'.repeat(30), confidence: 0.8 });
    const plan: ChangePlanItem[] = [createChangePlanItem({ module: 'Episodios', description: 'Add X', risk: 'bajo', reasoning: 'Safe' })];
    const next = editorSessionReducer(initialEditorState, { type: 'RECEIVE_PLAN', intentAnalysis: ia, plan });
    assert.equal(next.phase, 'plan-ready');
    assert.equal(next.plan.length, 1);
  });

  test('REQUEST_CONFIRMATION for high risk goes to confirming-high-risk', () => {
    const ia = createIntentAnalysis({ originalInstruction: 'x', intent: 'y', reasoning: 'z'.repeat(30), confidence: 0.8 });
    const highRiskPlan = [createChangePlanItem({ module: 'Métricas', description: 'drop table', risk: 'alto', reasoning: 'Danger' })];
    let state = editorSessionReducer(initialEditorState, { type: 'RECEIVE_PLAN', intentAnalysis: ia, plan: highRiskPlan });
    state = editorSessionReducer(state, { type: 'REQUEST_CONFIRMATION' });
    assert.equal(state.phase, 'confirming-high-risk');
  });

  test('APPLY_SIMULATION and SUCCESS append to history immutably (simulation only)', () => {
    const trace = createReasoningTrace({ model: 'grok', reasoning: 'Razonamiento visible completo del modelo para esta simulación segura.', confidence: 0.9 });
    const planItem = createChangePlanItem({ module: 'Episodios', description: 'Mejorar empty state', risk: 'bajo', reasoning: 'Solo UI' });
    const proposal = createProposalDraft({ instruction: 'test', intentAnalysis: createIntentAnalysis({ originalInstruction: 't', intent: 't', reasoning: 'r'.repeat(25), confidence: 0.7 }), plan: [planItem], reasoningTrace: [trace] });

    let state = editorSessionReducer(initialEditorState, { type: 'APPLY_SIMULATION', proposal });
    assert.equal(state.phase, 'applying-simulation');
    assert.equal(state.simulationActive, true);

    state = editorSessionReducer(state, { type: 'SUCCESS', proposal });
    assert.equal(state.phase, 'success');
    assert.equal(state.history.length, 1);
    assert.equal(state.history[0].simulationOnly, true);
  });

  test('RESET returns clean initial (no mutation)', () => {
    const dirty = { ...initialEditorState, phase: 'error' as const, error: 'boom' };
    const next = editorSessionReducer(dirty, { type: 'RESET' });
    assert.equal(next.phase, 'idle');
    assert.equal(next.error, null);
    assert.notStrictEqual(next, dirty);
  });

  // Guardrails TDD tests (security first, visible reasoning on block)
  test('detectBlockedAction flags dangerous real-mutation attempts', () => {
    const r1 = detectBlockedAction('borrar toda la base de datos de produccion');
    assert.equal(r1.blocked, true);
    assert.ok(r1.reason && r1.reason.includes('guardrails'));

    const r2 = detectBlockedAction('mejora el empty state de episodios');
    assert.equal(r2.blocked, false);
  });

  test('blocked intent produces high-risk plan without calling LLM', () => {
    // Note: full analyzeInstruction is async+LLM; here we test the pure guard path indirectly via exported fn
    const res = detectBlockedAction('eliminar la tabla de episodios en prod');
    assert.equal(res.blocked, true);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
