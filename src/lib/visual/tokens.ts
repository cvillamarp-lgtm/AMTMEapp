// src/lib/visual/tokens.ts
import { z } from 'zod';

// Zod schema for runtime validation
export const BrandTokensSchema = z.object({
  NAVY: z.string().regex(/^#[0-9A-F]{6}$/, 'Must be valid hex color'),
  GOLD: z.string().regex(/^#[0-9A-F]{6}$/, 'Must be valid hex color'),
  AQUA: z.string().regex(/^#[0-9A-F]{6}$/, 'Must be valid hex color'),
  TEAL: z.string().regex(/^#[0-9A-F]{6}$/, 'Must be valid hex color'),
  SAND: z.string().regex(/^#[0-9A-F]{6}$/, 'Must be valid hex color'),
  HL: z.string().regex(/^#[0-9A-F]{6}$/, 'Must be valid hex color'),
});

// TypeScript type
export type BrandTokens = z.infer<typeof BrandTokensSchema>;

// Token keys constante
export const TOKEN_KEYS = Object.freeze(['NAVY', 'GOLD', 'AQUA', 'TEAL', 'SAND', 'HL'] as const);
export type TokenKey = (typeof TOKEN_KEYS)[number];

// Default tokens basados en la paleta oficial AMTME
export const DEFAULT_TOKENS: BrandTokens = Object.freeze({
  NAVY: '#0C1F36',
  GOLD: '#FEE94B',
  AQUA: '#90A4B8',
  TEAL: '#111111',
  SAND: '#F5F2EA',
  HL: '#FEE94B',
});

// Set of allowed hex colors
export const ALLOWED_HEX = Object.freeze(new Set(Object.values(DEFAULT_TOKENS)));

/**
 * Normalize and validate hex color
 */
function normalizeHex(hex: unknown): string {
  if (typeof hex !== 'string') return '';
  const cleaned = hex.trim().toUpperCase();
  return /^#[0-9A-F]{6}$/.test(cleaned) ? cleaned : '';
}

/**
 * Sanitize theme tokens with validation
 * Maintains HL (highlight) as immutable
 */
export function sanitizeThemeTokens(partial: Partial<BrandTokens> = {}): BrandTokens {
  const next = { ...DEFAULT_TOKENS };

  for (const key of TOKEN_KEYS) {
    const incoming = normalizeHex(partial[key as TokenKey]);
    if (incoming && ALLOWED_HEX.has(incoming)) {
      next[key as TokenKey] = incoming;
    }
  }

  // HL is always DEFAULT_TOKENS.HL (highlight is immutable)
  next.HL = DEFAULT_TOKENS.HL;

  return next;
}
