import { initialStudioState } from '@/lib/studio-data';
import {
  buildAiCorePrompt,
  createAiHistoryEntry,
  getAiEngineDefinition,
  summarizeAiResult,
} from '@/lib/amtme-ai-core';

describe('amtme-ai-core', () => {
  it('expone la definición del motor configurado', () => {
    const definition = getAiEngineDefinition('AI Visual');

    expect(definition).toMatchObject({
      engine: 'AI Visual',
      module: 'Creador Visual',
      phase: 'FASE IA 1',
    });
  });

  it('construye un prompt operativo con contexto maestro y reglas activas', () => {
    const prompt = buildAiCorePrompt({
      engine: 'AI Episodios',
      goal: 'Construir un episodio claro.',
      prompt: 'Genera un guion breve.',
      provider: 'grok',
      model: 'grok-2-latest',
      state: initialStudioState,
    });

    expect(prompt).toContain('Motor: AI Episodios');
    expect(prompt).toContain('Módulo: Episodios');
    expect(prompt).toContain('Paleta oficial: Navy #0C1F36');
    expect(prompt).toContain(
      'Política operativa: La arquitectura oficial es la única ruta activa.'
    );
    expect(prompt).toContain('Objetivo: Construir un episodio claro.');
    expect(prompt).toContain('Prompt del usuario: Genera un guion breve.');
  });

  it('resume resultados y crea historial compacto para auditoría', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-18T12:34:56.000Z'));

    const historyEntry = createAiHistoryEntry({
      engine: 'AI Contenido',
      provider: 'gemini',
      model: 'gemini-1.5-pro',
      prompt: '   Crear un carrusel sobre claridad emocional con CTA suave y una sola idea   ',
      result:
        '  Resultado   con   saltos \n de línea y espacios extra para validar el resumen automático del sistema.  ',
    });

    expect(summarizeAiResult('   texto \n resumido   ')).toBe('texto resumido');
    expect(historyEntry).toMatchObject({
      createdAt: '2026-05-18T12:34:56.000Z',
      engine: 'AI Contenido',
      provider: 'gemini',
      model: 'gemini-1.5-pro',
    });
    expect(historyEntry.id).toBe(`ai-${Date.now()}`);
    expect(historyEntry.promptSummary).toBe(
      'Crear un carrusel sobre claridad emocional con CTA suave y una sola idea'
    );
    expect(historyEntry.resultSummary).toBe(
      'Resultado con saltos de línea y espacios extra para validar el resumen automático del sistema.'
    );

    vi.useRealTimers();
  });
});
