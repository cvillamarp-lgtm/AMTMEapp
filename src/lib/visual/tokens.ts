import { z } from 'zod';

const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;

export const BrandTokensSchema = z.object({
  NAVY: z.string().regex(hexColorPattern),
  GOLD: z.string().regex(hexColorPattern),
  AQUA: z.string().regex(hexColorPattern),
  TEAL: z.string().regex(hexColorPattern),
  SAND: z.string().regex(hexColorPattern),
  HL: z.string().regex(hexColorPattern),
});

export type BrandTokens = z.infer<typeof BrandTokensSchema>;

export const DEFAULT_TOKENS: BrandTokens = {
  NAVY: '#083A4F',
  GOLD: '#A58D66',
  AQUA: '#C0D5D6',
  TEAL: '#407E8C',
  SAND: '#E5E1DD',
  HL: '#E8FF40',
};

export function sanitizeTokens(partial: Partial<BrandTokens> = {}): BrandTokens {
  return BrandTokensSchema.parse({
    ...DEFAULT_TOKENS,
    ...partial,
  });
}
