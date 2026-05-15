import { describe, expect, it } from 'vitest';
import {
  buildNarrativeStructure,
  generateAppleDescription,
  generateContentPack,
  generateEpisodeScript,
  generateHooks,
  generateSpotifyDescription,
  generateVisualPrompt,
  generateVisualSpec,
} from '@/lib/studio-generators';

describe('studio-generators', () => {
  it('construye estructura narrativa estándar', () => {
    expect(buildNarrativeStructure()).toEqual(['Umbral', 'Herida', 'Símbolo', 'Verdad', 'Puente', 'Acción']);
  });

  it('genera textos base de episodio', () => {
    const script = generateEpisodeScript({
      title: 'Título',
      theme: 'Tema',
      objective: 'Objetivo',
    });

    expect(script).toContain('Apertura: Título.');
    expect(generateSpotifyDescription({ title: 'Título', theme: 'Tema' })).toContain('Tema');
    expect(generateAppleDescription({ title: 'Título', objective: 'Objetivo' })).toContain('Título');
  });

  it('genera hooks y packs de contenido', () => {
    const hooks = generateHooks('El Cambio');
    expect(hooks).toHaveLength(2);

    const pack = generateContentPack({
      theme: 'Claridad',
      emotion: 'Calma',
      objective: 'Conversar',
      episodeTitle: 'El Cambio',
    });

    expect(pack.theme).toBe('Claridad');
    expect(pack.status).toBe('Borrador');
  });

  it('genera prompt y spec visual', () => {
    const prompt = generateVisualPrompt({
      type: 'Carrusel',
      mainText: 'Idea principal',
      secondaryText: 'Texto secundario',
      cta: 'Desliza',
      palette: 'Navy',
    });

    expect(prompt).toContain('Tipo de pieza: Carrusel.');
    expect(generateVisualSpec('1080x1350')).toContain('Formato 1080x1350');
  });
});
