import { describe, expect, it } from 'vitest';
import { sanitizeTokens } from '@/lib/visual/tokens';
import { generateCarouselSvg } from '@/lib/visual/generators/carousel';
import { generateStorySvg } from '@/lib/visual/generators/story';

describe('visual module', () => {
  it('sanitiza tokens con defaults', () => {
    const tokens = sanitizeTokens({ NAVY: '#001F36' });
    expect(tokens.NAVY).toBe('#001F36');
    expect(tokens.HL).toBe('#E8FF40');
  });

  it('genera svg de carrusel tipado', () => {
    const result = generateCarouselSvg({
      carouselSlide: 1,
      epNumber: 34,
      brand: 'AMTME',
      category: 'Episodios',
      headline: 'La herida no se negocia',
      subtitleLine1: 'Nombrar cambia la energía',
      subtitleLine2: 'Evitarla la cronifica',
      ctaLine1: 'Guarda esta pieza',
      ctaLine2: 'y vuelve cuando duela',
    });

    expect(result.meta.type).toBe('carousel');
    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('EP.34');
  });

  it('genera svg de story tipado', () => {
    const result = generateStorySvg({
      title: 'No necesitas más ruido',
      body: 'Necesitas una decisión más honesta con tu límite.',
      cta: 'Responde: verdad',
      footer: 'AMTME Studio OS',
    });

    expect(result.meta.format).toBe('STORY_9_16');
    expect(result.svg).toContain('Responde: verdad');
  });
});
