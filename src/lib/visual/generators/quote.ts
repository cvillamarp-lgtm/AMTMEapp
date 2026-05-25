import { z } from 'zod';
import type { BrandTokens } from '@/lib/visual/tokens';
import { sanitizeTokens } from '@/lib/visual/tokens';
import { escapeXml, renderCenteredTextBlock } from './shared';

const QuoteFieldsSchema = z.object({
  quote: z.string().min(8),
  author: z.string().min(2),
  context: z.string().min(3),
});

export type QuoteFields = z.infer<typeof QuoteFieldsSchema>;

export function generateQuoteSvg(
  input: QuoteFields,
  tokensInput: Partial<BrandTokens> = {}
): { svg: string; meta: Record<string, unknown> } {
  const fields = QuoteFieldsSchema.parse(input);
  const tokens = sanitizeTokens(tokensInput);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img" aria-label="Quote AMTME">
  <defs>
    <style>
      .bg { fill: ${tokens.NAVY}; }
      .mark { fill: ${tokens.HL}; font-size: 160px; font-weight: 700; font-family: ui-serif, Georgia, serif; }
      .quote { fill: #FFFFFF; font-size: 58px; font-weight: 600; font-family: ui-serif, Georgia, serif; }
      .meta { fill: ${tokens.AQUA}; font-size: 26px; font-family: ui-sans-serif, system-ui; letter-spacing: 1px; }
    </style>
  </defs>
  <rect class="bg" width="1080" height="1080" />
  <text x="140" y="230" class="mark">“</text>
  ${renderCenteredTextBlock({ text: fields.quote, x: 540, y: 420, maxLength: 28, className: 'quote', lineHeight: 68 })}
  <line x1="340" y1="760" x2="740" y2="760" stroke="${tokens.TEAL}" stroke-width="3" />
  <text x="540" y="824" text-anchor="middle" class="meta">${escapeXml(fields.author)}</text>
  <text x="540" y="868" text-anchor="middle" class="meta">${escapeXml(fields.context)}</text>
</svg>`;

  return {
    svg: svg.trim(),
    meta: {
      type: 'quote',
      format: 'SQUARE_1_1',
      author: fields.author,
    },
  };
}
