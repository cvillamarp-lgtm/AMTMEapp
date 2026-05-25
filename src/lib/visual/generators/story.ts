import { z } from 'zod';
import type { BrandTokens } from '@/lib/visual/tokens';
import { sanitizeTokens } from '@/lib/visual/tokens';
import { escapeXml, renderCenteredTextBlock } from './shared';

const StoryFieldsSchema = z.object({
  title: z.string().min(4),
  body: z.string().min(8),
  cta: z.string().min(3),
  footer: z.string().min(2),
});

export type StoryFields = z.infer<typeof StoryFieldsSchema>;

export function generateStorySvg(
  input: StoryFields,
  tokensInput: Partial<BrandTokens> = {}
): { svg: string; meta: Record<string, unknown> } {
  const fields = StoryFieldsSchema.parse(input);
  const tokens = sanitizeTokens(tokensInput);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" role="img" aria-label="Story AMTME">
  <defs>
    <style>
      .bg { fill: ${tokens.NAVY}; }
      .title { fill: ${tokens.HL}; font-size: 82px; font-weight: 700; font-family: ui-sans-serif, system-ui; }
      .body { fill: #FFFFFF; font-size: 46px; font-family: ui-sans-serif, system-ui; }
      .cta { fill: ${tokens.AQUA}; font-size: 34px; font-weight: 600; font-family: ui-sans-serif, system-ui; }
      .footer { fill: ${tokens.GOLD}; font-size: 24px; font-family: ui-sans-serif, system-ui; letter-spacing: 1px; }
    </style>
  </defs>
  <rect class="bg" width="1080" height="1920" />
  <rect x="84" y="120" width="912" height="1680" fill="none" stroke="${tokens.TEAL}" stroke-width="2" rx="28" />

  ${renderCenteredTextBlock({ text: fields.title, x: 540, y: 340, maxLength: 18, className: 'title', lineHeight: 92 })}
  ${renderCenteredTextBlock({ text: fields.body, x: 540, y: 860, maxLength: 30, className: 'body', lineHeight: 58 })}

  <text x="540" y="1480" text-anchor="middle" class="cta">${escapeXml(fields.cta)}</text>
  <text x="540" y="1730" text-anchor="middle" class="footer">${escapeXml(fields.footer)}</text>
</svg>`;

  return {
    svg: svg.trim(),
    meta: {
      type: 'story',
      format: 'STORY_9_16',
      footer: fields.footer,
    },
  };
}
