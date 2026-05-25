// src/lib/visual/generators/story.ts
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
  HighlightDescriptor,
  TextSegment,
} from './shared';

/**
 * Story input fields
 */
export interface StoryFields {
  epNumber: number;
  brand: string;
  category: string;
  headline: string;
  subtitleLine1: string;
  subtitleLine2: string;
  ctaLine1: string;
  ctaLine2: string;
}

/**
 * Story output
 */
export interface StoryOutput {
  svg: string;
  meta: {
    width: number;
    height: number;
    safeMargin: number;
    format: 'STORY';
    layoutBoxes: Array<{ id: string; x: number; y: number; width: number; height: number }>;
    textNodes: Array<{ id: string; fg: string; bg: string; largeText: boolean }>;
    headlineLineCount: number;
    visibleHeadlineLines: number;
    highlightApplied: boolean;
  };
}

/**
 * Generate Instagram Story (9:16) SVG
 */
export function generateStoryIg916Svg(
  fields: StoryFields,
  tokens: BrandTokens,
  highlight?: {
    highlightMode?: 'none' | 'line' | 'phrase' | 'word';
    highlightTarget?: string;
    highlightStyle?: 'bar' | 'color' | 'bar+bold';
  },
  qaOverlay: boolean = false
): StoryOutput {
  const width = 1080;
  const height = 1920;
  const safeMargin = 96;

  const epNum = Number.isFinite(Number(fields.epNumber)) ? Number(fields.epNumber) : 0;
  const epLabel = `EP. ${String(Math.max(0, epNum)).padStart(2, '0')}`;
  const brand = normalizeText(fields.brand || 'AMTME');
  const category = normalizeText(fields.category || 'NUEVO EPISODIO');
  const subtitleLine1 = normalizeText(fields.subtitleLine1 || 'Disponible ahora.');
  const subtitleLine2 = normalizeText(fields.subtitleLine2 || 'Link en bio');
  const ctaLine1 = normalizeText(fields.ctaLine1 || 'ESCUCHAR EN');
  const ctaLine2 = normalizeText(fields.ctaLine2 || 'SPOTIFY →');

  const headlineX = 52;
  const headlineStartY = 640;
  const fontSize = 76;
  const lineHeight = 100;

  const sourceHeadline = toHeadlineLines(fields.headline);
  const wrappedHeadline = wrapLinesByWidth(
    sourceHeadline.length
      ? sourceHeadline
      : ['No te está costando', 'soltarlo.', 'Te está costando', 'soltar quién eras ahí.'],
    width - headlineX * 2 - 28,
    76,
    900
  );
  const headlineLineCount = wrappedHeadline.length;
  const visibleLines = wrappedHeadline.slice(0, 6);

  const descriptor = buildHighlightDescriptor(visibleLines, highlight);
  const highlightStyle = highlight?.highlightStyle || 'bar';

  const fragments: string[] = [];
  const highlightRects: string[] = [];
  const textNodes: Array<{ id: string; fg: string; bg: string; largeText: boolean }> = [];
  let headlineMaxWidth = 0;

  visibleLines.forEach((line, idx) => {
    const baselineY = headlineStartY + idx * lineHeight;
    const match = descriptor.match && descriptor.match.lineIndex === idx ? descriptor.match : null;
    const segments = splitLineByHighlight(line, match);

    let cursorX = headlineX;
    segments.forEach((segment: TextSegment, segmentIdx: number) => {
      const isTarget = segment.highlighted && descriptor.hasMatch;
      const useBar = isTarget && (highlightStyle === 'bar' || highlightStyle === 'bar+bold');
      const useColor = isTarget && highlightStyle === 'color';
      const weight = isTarget && highlightStyle === 'bar+bold' ? 900 : 900;
      const fill =
        isTarget && useColor ? tokens.HL : isTarget && useBar ? tokens.NAVY : tokens.SAND;
      const widthEstimate = estimateTextWidth(segment.text, fontSize, weight);

      if (useBar) {
        highlightRects.push(
          `<rect x="${Math.max(headlineX, cursorX - 10)}" y="${baselineY - fontSize + 12}" width="${widthEstimate + 20}" height="${fontSize + 18}" fill="${tokens.HL}"/>`
        );
      }

      fragments.push(
        `<text x="${cursorX}" y="${baselineY}" font-family="${FONT_STACK}" font-size="${fontSize}" fill="${fill}" font-weight="${weight}" letter-spacing="-1.5">${escapeXml(segment.text)}</text>`
      );
      textNodes.push({
        id: `headline-${idx}-${segmentIdx}`,
        fg: fill,
        bg: useBar ? tokens.HL : tokens.NAVY,
        largeText: true,
      });
      const spacingAfter = useBar && segmentIdx < segments.length - 1 ? 14 : 0;
      cursorX += widthEstimate + spacingAfter;
    });

    headlineMaxWidth = Math.max(headlineMaxWidth, cursorX - headlineX);
  });

  const ctaY = 1438;
  const layoutBoxes = [
    { id: 'brand', x: 360, y: 264, width: 360, height: 100 },
    {
      id: 'headline',
      x: headlineX,
      y: headlineStartY - fontSize,
      width: headlineMaxWidth,
      height: visibleLines.length * lineHeight,
    },
    { id: 'subtitle', x: 52, y: 1338, width: 720, height: 98 },
    { id: 'cta', x: 52, y: ctaY, width: 976, height: 88 },
    { id: 'footer', x: 52, y: 1560, width: 976, height: 30 },
  ];

  textNodes.push(
    { id: 'brand', fg: tokens.SAND, bg: tokens.NAVY, largeText: false },
    { id: 'ep', fg: tokens.GOLD, bg: tokens.NAVY, largeText: false },
    { id: 'subtitle-1', fg: tokens.SAND, bg: tokens.NAVY, largeText: false },
    { id: 'subtitle-2', fg: tokens.AQUA, bg: tokens.NAVY, largeText: false },
    { id: 'cta-1', fg: tokens.NAVY, bg: tokens.HL, largeText: false },
    { id: 'cta-2', fg: tokens.NAVY, bg: tokens.HL, largeText: false }
  );

  const overlay = qaOverlay
    ? `<rect x="${safeMargin}" y="${safeMargin}" width="${width - safeMargin * 2}" height="${height - safeMargin * 2}" fill="none" stroke="#FF5B5B" stroke-width="2" stroke-dasharray="10 8"/>`
    : '';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${tokens.NAVY}"/>
  <rect x="0" y="0" width="6" height="${height}" fill="${tokens.TEAL}" opacity="0.8"/>
  <text x="540" y="280" text-anchor="middle" font-family="${FONT_STACK}" font-size="11" fill="${tokens.SAND}" font-weight="700" letter-spacing="6" opacity="0.55">${escapeXml(brand)}</text>
  <line x1="360" y1="306" x2="720" y2="306" stroke="${tokens.TEAL}" stroke-width="1" opacity="0.4"/>
  <text x="540" y="360" text-anchor="middle" font-family="${FONT_STACK}" font-size="18" fill="${tokens.GOLD}" font-weight="800" letter-spacing="4">${escapeXml(`${epLabel} — ${category}`)}</text>
  ${highlightRects.join('\n  ')}
  ${fragments.join('\n  ')}
  <rect x="52" y="1330" width="100" height="2.5" fill="${tokens.TEAL}"/>
  <text x="52" y="1378" font-family="${FONT_STACK}" font-size="28" fill="${tokens.SAND}" font-weight="300" opacity="0.65">${escapeXml(subtitleLine1)}</text>
  <rect x="52" y="${ctaY}" width="976" height="88" fill="${tokens.HL}"/>
  <text x="540" y="1482" text-anchor="middle" font-family="${FONT_STACK}" font-size="17" fill="${tokens.NAVY}" font-weight="800" letter-spacing="5">${escapeXml(ctaLine1)}</text>
  <text x="540" y="1512" text-anchor="middle" font-family="${FONT_STACK}" font-size="28" fill="${tokens.NAVY}" font-weight="900" letter-spacing="1">${escapeXml(ctaLine2)}</text>
  <text x="540" y="1570" text-anchor="middle" font-family="${FONT_STACK}" font-size="14" fill="${tokens.GOLD}" opacity="0.7" letter-spacing="2">${escapeXml(subtitleLine2)}</text>
  ${overlay}
</svg>`;

  return {
    svg,
    meta: {
      width,
      height,
      safeMargin,
      format: 'STORY',
      layoutBoxes,
      textNodes,
      headlineLineCount,
      visibleHeadlineLines: visibleLines.length,
      highlightApplied: Boolean(descriptor.hasMatch),
    },
  };
}
