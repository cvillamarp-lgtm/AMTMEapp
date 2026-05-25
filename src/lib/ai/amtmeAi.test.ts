import { describe, expect, it, vi } from 'vitest';
import { generateEpisodeFields, generateSemanticMap } from '@/lib/ai/amtmeAi';

describe('amtmeAi', () => {
  it('cae a fallback local en generación de episodio si falla provider', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network error'));

    const result = await generateEpisodeFields({
      idea_principal: 'Dejar de confundir intensidad con amor',
      episode_number: 37,
    });

    expect(result.metadata.source).toBe('local-fallback');
    expect(result.fields.title).toContain('EP.37');
    expect(result.fields.keywords.length).toBeGreaterThanOrEqual(3);
    fetchMock.mockRestore();
  });

  it('cae a fallback local en mapa semántico si falla provider', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network error'));

    const result = await generateSemanticMap({
      title: 'Límites sin culpa',
      theme: 'Límite emocional',
      core_thesis: 'Sin límite no hay vínculo sostenible.',
      hook: 'Lo que sostienes sin querer te rompe en silencio.',
      cta: 'Escríbeme verdad.',
    });

    expect(result.metadata.source).toBe('local-fallback');
    expect(result.map.pillars.length).toBeGreaterThanOrEqual(2);
    fetchMock.mockRestore();
  });
});
