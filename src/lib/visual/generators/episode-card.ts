import { z } from 'zod';
import type { BrandTokens } from '@/lib/visual/tokens';
import { sanitizeTokens } from '@/lib/visual/tokens';
import { escapeXml, renderCenteredTextBlock } from './shared';

const EpisodeCardFieldsSchema = z.object({
  epNumber: z.number().int().min(1),
  title: z.string().min(4),
  thesis: z.string().min(8),
  cta: z.string().min(3),
});

export type EpisodeCardFields = z.infer<typeof EpisodeCardFieldsSchema>;

export function generateEpisodeCardSvg(
  input: EpisodeCardFields,
  tokensInput: Partial<BrandTokens> = {}
): { svg: string; meta: Record<string, unknown> } {
  const fields = EpisodeCardFieldsSchema.parse(input);
  const tokens = sanitizeTokens(tokensInput);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" role="img" aria-label="Episode Card AMTME">
  <defs>
    <style>
      .bg { fill: ${tokens.SAND}; }
      .panel { fill: #FFFFFF; }
      .kicker { fill: ${tokens.NAVY}; font-size: 28px; letter-spacing: 2px; font-family: ui-sans-serif, system-ui; }
      .title { fill: ${tokens.NAVY}; font-size: 72px; font-weight: 700; font-family: ui-sans-serif, system-ui; }
      .body { fill: ${tokens.NAVY}; opacity: 0.9; font-size: 38px; font-family: ui-sans-serif, system-ui; }
      .cta { fill: ${tokens.TEAL}; font-size: 34px; font-weight: 600; font-family: ui-sans-serif, system-ui; }
    </style>
  </defs>
  <rect class="bg" width="1080" height="1350" />
  <rect class="panel" x="72" y="72" width="936" height="1206" rx="24" />

  <text x="540" y="180" text-anchor="middle" class="kicker">EP.${String(fields.epNumber).padStart(2, '0')}</text>
  ${renderCenteredTextBlock({ text: fields.title, x: 540, y: 340, maxLength: 22, className: 'title', lineHeight: 86 })}

  <text x="540" y="736" text-anchor="middle" class="body">${escapeXml(fields.thesis)}</text>
  <line x1="260" y1="840" x2="820" y2="840" stroke="${tokens.AQUA}" stroke-width="3" />

  <text x="540" y="940" text-anchor="middle" class="cta">${escapeXml(fields.cta)}</text>
  <text x="540" y="1240" text-anchor="middle" class="kicker">AMTME STUDIO OS</text>
</svg>`;

  return {
    svg: svg.trim(),
    meta: {
      type: 'episode-card',
      format: 'FEED_4_5',
      episode: fields.epNumber,
    },
  };
}
