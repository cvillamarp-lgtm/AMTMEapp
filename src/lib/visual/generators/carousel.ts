import { z } from 'zod';
import type { BrandTokens } from '@/lib/visual/tokens';
import { sanitizeTokens } from '@/lib/visual/tokens';
import { applyHighlight, normalizeText, type HighlightConfig } from './shared';

const CarouselFieldsSchema = z.object({
  carouselSlide: z.number().int().min(1).max(10),
  epNumber: z.number().int().min(1),
  brand: z.string().min(2),
  category: z.string().min(2),
  headline: z.string().min(3),
  subtitleLine1: z.string().min(3),
  subtitleLine2: z.string().min(3),
  ctaLine1: z.string().min(2),
  ctaLine2: z.string().min(2),
});

export type CarouselFields = z.infer<typeof CarouselFieldsSchema>;

export function generateCarouselSvg(
  fieldsInput: CarouselFields,
  tokensInput: Partial<BrandTokens> = {},
  highlight?: HighlightConfig,
  qaOverlay = false
): { svg: string; meta: Record<string, unknown> } {
  const fields = CarouselFieldsSchema.parse(fieldsInput);
  const tokens = sanitizeTokens(tokensInput);
  const ep = String(fields.epNumber).padStart(2, '0');
  const slide = `${fields.carouselSlide}/10`;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img" aria-label="Carrusel AMTME">
  <defs>
    <style>
      .bg { fill: ${tokens.NAVY}; }
      .panel { fill: ${tokens.SAND}; opacity: 0.09; }
      .kicker { fill: ${tokens.AQUA}; font-size: 26px; letter-spacing: 2px; font-family: ui-sans-serif, system-ui; }
      .headline { fill: #FFFFFF; font-size: 76px; font-weight: 700; font-family: ui-sans-serif, system-ui; }
      .sub { fill: #FFFFFF; opacity: 0.88; font-size: 35px; font-family: ui-sans-serif, system-ui; }
      .cta { fill: ${tokens.HL}; font-size: 28px; font-weight: 600; font-family: ui-sans-serif, system-ui; }
      .chip { fill: ${tokens.GOLD}; }
      .chipText { fill: ${tokens.NAVY}; font-size: 22px; font-weight: 700; font-family: ui-sans-serif, system-ui; }
      .hl-bar { font-weight: 700; text-decoration: underline; text-decoration-thickness: 7px; text-decoration-color: ${tokens.HL}; }
      .hl-bar-bold { font-weight: 800; text-decoration: underline; text-decoration-thickness: 8px; text-decoration-color: ${tokens.HL}; }
      .hl-color { fill: ${tokens.HL}; font-weight: 700; }
    </style>
  </defs>
  <rect class="bg" width="1080" height="1080" />
  <rect class="panel" x="64" y="64" width="952" height="952" rx="32" />

  <text x="96" y="130" class="kicker">${normalizeText(fields.brand, 'AMTME')} · ${normalizeText(fields.category, 'Serie')}</text>
  <text x="96" y="188" class="kicker">EP.${ep} · Slide ${slide}</text>

  <text x="96" y="390" class="headline">${applyHighlight(fields.headline, highlight)}</text>

  <text x="96" y="478" class="sub">${normalizeText(fields.subtitleLine1, '')}</text>
  <text x="96" y="526" class="sub">${normalizeText(fields.subtitleLine2, '')}</text>

  <rect x="96" y="614" width="380" height="2" fill="${tokens.TEAL}" />
  <text x="96" y="686" class="cta">${normalizeText(fields.ctaLine1, '')}</text>
  <text x="96" y="730" class="cta">${normalizeText(fields.ctaLine2, '')}</text>

  <rect class="chip" x="836" y="92" width="160" height="52" rx="26" />
  <text x="916" y="126" text-anchor="middle" class="chipText">AMTME</text>
  ${qaOverlay ? '<rect x="24" y="24" width="1032" height="1032" fill="none" stroke="#FF3B30" stroke-dasharray="10 6" stroke-width="3" />' : ''}
</svg>`;

  return {
    svg: svg.trim(),
    meta: {
      type: 'carousel',
      format: 'SQUARE_1_1',
      episode: fields.epNumber,
      slide: fields.carouselSlide,
      qaOverlay,
    },
  };
}
