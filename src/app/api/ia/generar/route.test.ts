import { describe, expect, it } from 'vitest';
import { MAX_AI_PROMPT_LENGTH } from '@/lib/schemas';
import { POST } from './route';

describe('POST /api/ia/generar', () => {
  it('rechaza prompt vacío', async () => {
    const request = new Request('http://localhost/api/ia/generar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: '   ' }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { error?: string };

    expect(response.status).toBe(400);
    expect(payload.error).toContain('Se requiere un prompt.');
  });

  it('rechaza prompt demasiado largo', async () => {
    const request = new Request('http://localhost/api/ia/generar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'a'.repeat(MAX_AI_PROMPT_LENGTH + 1) }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { error?: string };

    expect(response.status).toBe(400);
    expect(payload.error).toContain('excede el máximo');
  });
});
