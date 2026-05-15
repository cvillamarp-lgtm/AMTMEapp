import { describe, expect, it } from 'vitest';
import { initialStudioState } from '@/lib/studio-data';
import { exportStudioStateToJson, importStudioStateFromJson } from '@/lib/studio-backup';

describe('studio-backup', () => {
  it('exporta e importa StudioState válido', () => {
    const json = exportStudioStateToJson(initialStudioState);
    const restored = importStudioStateFromJson(json);

    expect(restored.success).toBe(true);
    if (restored.success) {
      expect(restored.state.config.projectName).toBe(initialStudioState.config.projectName);
    }
  });

  it('rechaza JSON inválido sin reemplazar estado', () => {
    const restored = importStudioStateFromJson('{mal-json');
    expect(restored.success).toBe(false);
  });

  it('rechaza estructura inválida', () => {
    const restored = importStudioStateFromJson(JSON.stringify({ episodes: [] }));
    expect(restored.success).toBe(false);
  });
});
