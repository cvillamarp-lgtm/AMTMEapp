import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateWithReasoning } from './llm-client';
import * as aiProviders from '@/lib/ai-providers';
import type { AIProvider } from '@/lib/studio-types';

describe('llm-client (forces visible reasoning)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('always returns a non-empty reasoning string alongside the result', async () => {
    const mockResponse = JSON.stringify({
      reasoning: 'El usuario quiere un estado vacío más humano y editorial para el módulo de Episodios. Esto mejora la UX sin tocar datos.',
      result: 'Se recomienda añadir el componente EmptyState con copy AMTME.',
      confidence: 0.88,
    });

    vi.spyOn(aiProviders, 'generateWithProvider').mockResolvedValue(mockResponse);

    const output = await generateWithReasoning({
      provider: 'grok',
      instruction: 'mejora esta página de episodios con un empty state más humano y premium',
    });

    expect(output.reasoning).toContain('estado vacío más humano');
    expect(output.result).toContain('EmptyState');
    expect(output.confidence).toBeGreaterThan(0.8);
  });

  it('gracefully falls back when the model returns plain text instead of JSON', async () => {
    const plainText = 'Aquí va un razonamiento largo y útil del modelo sobre por qué añadir un empty state editorial es una buena idea para AMTME.';

    vi.spyOn(aiProviders, 'generateWithProvider').mockResolvedValue(plainText);

    const output = await generateWithReasoning({
      provider: 'gemini',
      instruction: 'haz el listado de episodios más premium',
    });

    expect(output.reasoning.length).toBeGreaterThan(30);
    expect(output.result.length).toBeGreaterThan(5);
  });

  it('propagates errors from the underlying provider', async () => {
    vi.spyOn(aiProviders, 'generateWithProvider').mockRejectedValue(
      new Error('Falta configurar XAI_API_KEY.')
    );

    await expect(
      generateWithReasoning({ provider: 'grok', instruction: 'cualquier cosa' })
    ).rejects.toThrow('XAI_API_KEY');
  });

  it('uses the provided model when passed', async () => {
    const spy = vi.spyOn(aiProviders, 'generateWithProvider').mockResolvedValue('{"reasoning":"ok","result":"ok"}');

    await generateWithReasoning({
      provider: 'grok',
      instruction: 'test',
      model: 'grok-3-beta',
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'grok-3-beta' })
    );
  });
});
