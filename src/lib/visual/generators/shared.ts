// src/lib/visual/generators/shared.ts

/**
 * Font stack for SVG rendering
 */
export const FONT_STACK = 'Inter, Helvetica, Arial, sans-serif' as const;

/**
 * XML escape for SVG text content
 */
export function escapeXml(value: string = ''): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Normalize text: collapse whitespace and trim
 */
export function normalizeText(value: unknown): string {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Convert headline (string or array) to array of lines
 */
export function toHeadlineLines(headline: string | string[] | unknown): string[] {
  if (Array.isArray(headline)) {
    return headline.map((line) => String(line || '').trim()).filter(Boolean);
  }

  return String(headline || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Wrap lines by width for text rendering
 */
export function wrapLinesByWidth(
  lines: string[],
  maxWidth: number,
  fontSize: number,
  fontWeight: number = 800
): string[] {
  const wrapped: string[] = [];

  for (const rawLine of lines) {
    const words = String(rawLine || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!words.length) continue;

    let current = words[0];
    for (let i = 1; i < words.length; i += 1) {
      const candidate = `${current} ${words[i]}`;
      if (estimateTextWidth(candidate, fontSize, fontWeight) <= maxWidth) {
        current = candidate;
      } else {
        wrapped.push(current);
        current = words[i];
      }
    }
    wrapped.push(current);
  }

  return wrapped;
}

/**
 * Estimate text width based on font size and weight
 */
export function estimateTextWidth(
  text: string,
  fontSize: number,
  fontWeight: number = 800
): number {
  const clean = String(text || '');
  const ratio = fontWeight >= 900 ? 0.61 : fontWeight >= 800 ? 0.59 : 0.57;
  return Math.max(0, clean.length * fontSize * ratio);
}

/**
 * Check if character is word character (alphanumeric + accents + underscore)
 */
function isWordChar(char: string = ''): boolean {
  return /[0-9A-Za-zÀ-ÿ_]/.test(char);
}

/**
 * Find word range in line (for highlighting)
 */
function findWordRange(line: string, word: string): { start: number; end: number } | null {
  const source = String(line || '');
  const target = normalizeText(word).toLowerCase();
  if (!target) return null;

  const lower = source.toLowerCase();
  let start = lower.indexOf(target);

  while (start !== -1) {
    const end = start + target.length;
    const prev = start > 0 ? source[start - 1] : '';
    const next = end < source.length ? source[end] : '';

    const prevOk = !prev || !isWordChar(prev);
    const nextOk = !next || !isWordChar(next);

    if (prevOk && nextOk) return { start, end };
    start = lower.indexOf(target, start + 1);
  }

  return null;
}

/**
 * Highlight descriptor
 */
export interface HighlightMatch {
  lineIndex: number;
  start: number;
  end: number;
}

export interface HighlightDescriptor {
  match: HighlightMatch | null;
  hasMatch: boolean;
}

/**
 * Build highlight descriptor from target text
 */
export function buildHighlightDescriptor(
  lines: string[],
  highlight?: {
    highlightMode?: 'none' | 'line' | 'phrase' | 'word';
    highlightTarget?: string;
  }
): HighlightDescriptor {
  const mode = highlight?.highlightMode || 'none';
  const target = normalizeText(highlight?.highlightTarget || '');

  if (mode === 'none' || !target) {
    return { match: null, hasMatch: false };
  }

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];

    if (mode === 'line') {
      if (normalizeText(line).toLowerCase() === target.toLowerCase()) {
        return { match: { lineIndex, start: 0, end: line.length }, hasMatch: true };
      }
    }

    if (mode === 'phrase') {
      const lowerLine = line.toLowerCase();
      const idx = lowerLine.indexOf(target.toLowerCase());
      if (idx !== -1) {
        return { match: { lineIndex, start: idx, end: idx + target.length }, hasMatch: true };
      }
    }

    if (mode === 'word') {
      const range = findWordRange(line, target);
      if (range) {
        return { match: { lineIndex, start: range.start, end: range.end }, hasMatch: true };
      }
    }
  }

  return { match: null, hasMatch: false };
}

/**
 * Text segment (part of highlighted line)
 */
export interface TextSegment {
  text: string;
  highlighted: boolean;
}

/**
 * Split line by highlight match into segments
 */
export function splitLineByHighlight(line: string, match: HighlightMatch | null): TextSegment[] {
  if (!match || match.start >= match.end) {
    return [{ text: line, highlighted: false }];
  }

  const before = line.slice(0, match.start);
  const target = line.slice(match.start, match.end);
  const after = line.slice(match.end);

  return [
    ...(before ? [{ text: before, highlighted: false }] : []),
    ...(target ? [{ text: target, highlighted: true }] : []),
    ...(after ? [{ text: after, highlighted: false }] : []),
  ];
}
