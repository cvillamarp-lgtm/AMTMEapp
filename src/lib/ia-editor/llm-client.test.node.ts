/**
 * Node-native TDD runner for llm-client (Fase 0.2)
 * Proves that the wrapper always forces visible reasoning.
 */
import assert from 'node:assert/strict';
import { generateWithReasoning } from './llm-client';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  const run = async () => {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (e) {
      console.error(`✗ ${name}`);
      console.error(e);
      failed++;
    }
  };
  return run();
}

async function main() {
  // Happy path - perfect JSON from model
  await test('always returns non-empty reasoning when model gives good JSON', async () => {
    const mockGenerate = async () => JSON.stringify({
      reasoning: 'El usuario quiere un empty state más humano para Episodios. Cambio de presentación seguro.',
      result: 'Añadir EmptyState editorial con copy AMTME.',
      confidence: 0.91,
    });

    const out = await generateWithReasoning({
      provider: 'grok',
      instruction: 'mejora esta página de episodios con un empty state más humano y premium',
    }, mockGenerate);

    assert.ok(out.reasoning.length > 30);
    assert.ok(out.result.includes('EmptyState'));
    assert.equal(out.confidence, 0.91);
  });

  // Fallback path - plain text
  await test('falls back gracefully with plain text response', async () => {
    const mockGenerate = async () =>
      'Razonamiento largo del modelo: deberíamos mejorar la presentación del listado de episodios usando un tono más editorial y humano, sin tocar la lógica de datos.';

    const out = await generateWithReasoning({
      provider: 'gemini',
      instruction: 'haz el módulo de episodios más premium',
    }, mockGenerate);

    assert.ok(out.reasoning.length > 40);
    assert.ok(out.result.length > 10);
  });

  // Error propagation
  await test('propagates provider errors correctly', async () => {
    const mockGenerate = async () => {
      throw new Error('Falta configurar XAI_API_KEY.');
    };

    await assert.rejects(
      () => generateWithReasoning({ provider: 'grok', instruction: 'test' }, mockGenerate),
      /XAI_API_KEY/
    );
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
