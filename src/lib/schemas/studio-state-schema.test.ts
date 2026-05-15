import { describe, expect, it } from 'vitest';
import { initialStudioState } from '@/lib/studio-data';
import {
  contentPieceSchema,
  episodeSchema,
  metricEpisodeSchema,
  metricMonthlySchema,
  monetizationLeadSchema,
  studioStateSchema,
} from '@/lib/schemas';

describe('studioStateSchema', () => {
  it('acepta el StudioState inicial', () => {
    expect(() => studioStateSchema.parse(initialStudioState)).not.toThrow();
  });

  it('rechaza StudioState inválido', () => {
    const invalidState = {
      ...initialStudioState,
      episodes: [{ ...initialStudioState.episodes[0], hooks: 'no-array' }],
    };

    const result = studioStateSchema.safeParse(invalidState);
    expect(result.success).toBe(false);
  });
});

describe('entity schemas', () => {
  it('valida Episode', () => {
    const parsed = episodeSchema.safeParse(initialStudioState.episodes[0]);
    expect(parsed.success).toBe(true);
  });

  it('valida ContentPiece', () => {
    const parsed = contentPieceSchema.safeParse(initialStudioState.contentPieces[0]);
    expect(parsed.success).toBe(true);
  });

  it('valida MetricMonthly y MetricEpisode', () => {
    expect(metricMonthlySchema.safeParse(initialStudioState.metricsMonthly[0]).success).toBe(true);
    expect(metricEpisodeSchema.safeParse(initialStudioState.metricsEpisode[0]).success).toBe(true);
  });

  it('valida MonetizationLead', () => {
    expect(monetizationLeadSchema.safeParse(initialStudioState.monetizationLeads[0]).success).toBe(true);
  });
});
