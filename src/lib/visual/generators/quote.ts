// src/lib/visual/generators/quote.ts
import { BrandTokens } from '../tokens';
import {
  FONT_STACK,
  buildHighlightDescriptor,
  escapeXml,
  estimateTextWidth,
  normalizeText,
  splitLineByHighlight,
  toHeadlineLines,
  wrapLinesByWidth,
  TextSegment,
} from './shared';

/**
 * Quote input fields
 */
export interface QuoteFields {
  epNumber: number;
  brand: string;
  category: string;
  headline: string;
  subtitleLine1: string;
  subtitleLine2: string;
}

/**
 * Quote output
 */
export interface QuoteOutput {
  svg: string;
  meta: {
    width: number;
    height: number;
    safeMargin: number;
    format: 'IG11';
    layoutBoxes: Array<{ id: string; x: number; y: number; width: number; height: number }>;
    textNodes: Array<{ id: string; fg: string; bg: string; largeText: boolean }>;
    headlineLineCount: number;
    visibleHeadlineLines: number;
    highlightApplied: boolean;
  };
}

/**
 * Generate Instagram 1:1 Quote SVG
 */
export function generateQuoteIg11Svg(
  fields: QuoteFields,
  tokens: BrandTokens,
  highlight?: {
    highlightMode?: 'none' | 'line' | 'phrase' | 'word';
    highlightTarget?: string;
    highlightStyle?: 'bar' | 'color' | 'bar+bold';
  },
  qaOverlay: boolean = false
): QuoteOutput {
  const width = 1080;
  const height = 1080;
  const safeMargin = 80;

  const epNum = Number.isFinite(Number(fields.epNumber)) ? Number(fields.epNumber) : 0;
  const epLabel = `EP. ${String(Math.max(0, epNum)).padStart(2, '0')}`;
  const brand = normalizeText(fields.brand || 'AMTME');
  const category = normalizeText(fields.category || 'AMOR · APEGO');
  const subtitleLine1 = normalizeText(fields.subtitleLine1 || 'Ep. 27 — AMTME');
  const subtitleLine2 = normalizeText(fields.subtitleLine2 || 'Escúchalo en Spotify');

  const sourceHeadline = toHeadlineLines(fields.headline);
  const wrappedHeadline = wrapLinesByWidth(
    sourceHeadline.length
      ? sourceHeadline
      : ['No extrañas a esa persona.', 'Extrañas quién eras ahí.'],
    width - safeMargin * 2 - 24,
    70,
    900
  );
  const headlineLineCount = wrappedHeadline.length;
  const visibleLines = wrappedHeadline.slice(0, 5);

  const highlightStyle = highlight?.highlightStyle || 'bar';
  const descriptor = buildHighlightDescriptor(visibleLines, highlight);

  const headlineX = safeMargin;
  const headlineStartY = 360;
  const headlineFontSize = 70;
  const headlineLineHeight = 90;

  const headlineFragments: string[] = [];
  const highlightRects: string[] = [];
  const textNodes: Array<{ id: string; fg: string; bg: string; largeText: boolean }> = [];

  let headlineMaxWidth = 0;

  visibleLines.forEach((line, lineIndex) => {
    const baselineY = headlineStartY + lineIndex * headlineLineHeight;
    const match =
      descriptor.match && descriptor.match.lineIndex === lineIndex ? descriptor.match : null;
    const segments = splitLineByHighlight(line, match);

    let cursorX = headlineX;

    segments.forEach((segment: TextSegment, segmentIndex: number) => {
      const isTarget = segment.highlighted && descriptor.hasMatch;
      const useBar = isTarget && (highlightStyle === 'bar' || highlightStyle === 'bar+bold');
      const useColor = isTarget && highlightStyle === 'color';
      const fontWeight = isTarget && highlightStyle === 'bar+bold' ? 900 : 900;
      const fill = isTarget && useColor ? tokens.HL : tokens.NAVY;

      const segmentWidth = estimateTextWidth(segment.text, headlineFontSize, fontWeight);
      if (useBar) {
        highlightRects.push(
          `<rect x="${Math.max(headlineX, cursorX - 8)}" y="${baselineY - headlineFontSize + 10}" width="${segmentWidth + 16}" height="${headlineFontSize + 16}" fill="${tokens.HL}"/>`
        );
      }

      headlineFragments.push(
        `<text x="${cursorX}" y="${baselineY}" font-family="${FONT_STACK}" font-size="${headlineFontSize}" fill="${fill}" font-weight="${fontWeight}" letter-spacing="-1.2">${escapeXml(segment.text)}</text>`
      );

      textNodes.push({
        id: `headline-${lineIndex}-${segmentIndex}`,
        fg: fill,
        bg: useBar ? tokens.HL : tokens.SAND,
        largeText: true,
      });
      const spacingAfter = useBar && segmentIndex < segments.length - 1 ? 12 : 0;
      cursorX += segmentWidth + spacingAfter;
    });

    headlineMaxWidth = Math.max(headlineMaxWidth, cursorX - headlineX);
  });

  const headlineBoxTop = headlineStartY - headlineFontSize;
  const headlineBoxHeight = visibleLines.length * headlineLineHeight;

  const layoutBoxes = [
    { id: 'header-brand', x: safeMargin, y: 58, width: 520, height: 60 },
    { id: 'category', x: safeMargin, y: 205, width: 300, height: 24 },
    {
      id: 'headline',
      x: headlineX,
      y: headlineBoxTop,
      width: headlineMaxWidth,
      height: headlineBoxHeight,
    },
    { id: 'subtitle', x: safeMargin, y: 756, width: 720, height: 120 },
    { id: 'footer', x: safeMargin, y: 926, width: width - safeMargin * 2, height: 26 },
  ];

  textNodes.push(
    { id: 'brand', fg: tokens.SAND, bg: tokens.NAVY, largeText: false },
    { id: 'category', fg: tokens.TEAL, bg: tokens.SAND, largeText: false },
    { id: 'subtitle-1', fg: tokens.TEAL, bg: tokens.SAND, largeText: false },
    { id: 'subtitle-2', fg: tokens.NAVY, bg: tokens.SAND, largeText: false },
    { id: 'footer', fg: tokens.TEAL, bg: tokens.SAND, largeText: false }
  );

  const overlay = qaOverlay
    ? `<rect x="${safeMargin}" y="${safeMargin}" width="${width - safeMargin * 2}" height="${height - safeMargin * 2}" fill="none" stroke="#FF5B5B" stroke-width="2" stroke-dasharray="10 8"/>`
    : '';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${tokens.SAND}"/>
  <rect width="${width}" height="140" fill="${tokens.NAVY}"/>
  <rect x="0" y="140" width="5" height="940" fill="${tokens.TEAL}" opacity="0.7"/>
  <text x="${safeMargin}" y="66" font-family="${FONT_STACK}" font-size="11" fill="${tokens.SAND}" font-weight="700" letter-spacing="5">${escapeXml(brand)}</text>
  <text x="${safeMargin}" y="108" font-family="${FONT_STACK}" font-size="14" fill="${tokens.GOLD}" font-weight="600" letter-spacing="2">@yosoyvillamar</text>
  <text x="${width - safeMargin}" y="88" text-anchor="end" font-family="${FONT_STACK}" font-size="38" fill="${tokens.SAND}" opacity="0.1" font-weight="900">${escapeXml(epLabel)}</text>
  <text x="${safeMargin}" y="220" font-family="${FONT_STACK}" font-size="11" fill="${tokens.TEAL}" font-weight="700" letter-spacing="5">${escapeXml(category)}</text>
  <line x1="${safeMargin}" y1="238" x2="${safeMargin + 220}" y2="238" stroke="${tokens.TEAL}" stroke-width="1" opacity="0.5"/>
  ${highlightRects.join('\n  ')}
  ${headlineFragments.join('\n  ')}
  <rect x="${safeMargin}" y="726" width="100" height="2.5" fill="${tokens.GOLD}"/>
  <text x="${safeMargin}" y="780" font-family="${FONT_STACK}" font-size="18" fill="${tokens.TEAL}" font-weight="600">${escapeXml(subtitleLine1)}</text>
  <line x1="${safeMargin}" y1="900" x2="${width - safeMargin}" y2="900" stroke="${tokens.NAVY}" stroke-width="0.5" opacity="0.15"/>
  <text x="${safeMargin}" y="946" font-family="${FONT_STACK}" font-size="12" fill="${tokens.TEAL}" font-weight="600" letter-spacing="2.5">${escapeXml(subtitleLine2)}</text>
  <text x="${width - safeMargin}" y="946" text-anchor="end" font-family="${FONT_STACK}" font-size="12" fill="${tokens.NAVY}" opacity="0.45" letter-spacing="2">${escapeXml(epLabel)}</text>
  ${overlay}
</svg>`;

  return {
    svg,
    meta: {
      width,
      height,
      safeMargin,
      format: 'IG11',
      layoutBoxes,
      textNodes,
      headlineLineCount,
      visibleHeadlineLines: visibleLines.length,
      highlightApplied: Boolean(descriptor.hasMatch),
    },
  };
}
