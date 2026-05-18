// @vitest-environment node

import { vi } from 'vitest';
import { MAX_AI_PROMPT_LENGTH } from '@/lib/schemas';

const { generateWithProviderMock } = vi.hoisted(() => ({
  generateWithProviderMock: vi.fn(),
}));

vi.mock('@/lib/ai-providers', () => ({
  generateWithProvider: generateWithProviderMock,
}));

import { POST } from './route';

describe('POST /api/ia/generar', () => {
  beforeEach(() => {
    generateWithProviderMock.mockReset();
  });

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

  it('devuelve resultado y construye el systemPrompt según el modo', async () => {
    generateWithProviderMock.mockResolvedValue('Respuesta operativa');

    const request = new Request('http://localhost/api/ia/generar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'gemini',
        prompt: 'Necesito copy para un reel.',
        mode: 'Copy',
        systemPrompt: 'Mantén tono editorial.',
        model: 'gemini-1.5-pro',
      }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { provider?: string; result?: string };

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      provider: 'gemini',
      result: 'Respuesta operativa',
    });
    expect(generateWithProviderMock).toHaveBeenCalledWith({
      provider: 'gemini',
      prompt: 'Necesito copy para un reel.',
      systemPrompt:
        'Mantén tono editorial. Devuelve copy listo para publicar con tono sobrio y claro.',
      model: 'gemini-1.5-pro',
    });
  });

  it('propaga errores del proveedor como respuesta 500', async () => {
    generateWithProviderMock.mockRejectedValue(new Error('Proveedor no disponible'));

    const request = new Request('http://localhost/api/ia/generar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Genera un guion breve.',
      }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { error?: string };

    expect(response.status).toBe(500);
    expect(payload.error).toBe('Proveedor no disponible');
  });
});
