// src/lib/visual/generators/carousel.ts
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
 * Carousel input fields
 */
export interface CarouselFields {
  carouselSlide: number;
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
 * Carousel output
 */
export interface CarouselOutput {
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
 * Clamp slide number to 1-6 range
 */
function clampSlide(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.min(6, Math.max(1, Math.round(n)));
}

/**
 * Headline rendering with highlight
 */
interface HeadlineRenderInput {
  lines: string[];
  startY: number;
  fontSize: number;
  lineHeight: number;
  x: number;
  tokens: BrandTokens;
  highlight?: {
    highlightMode?: 'none' | 'line' | 'phrase' | 'word';
    highlightTarget?: string;
    highlightStyle?: 'bar' | 'color' | 'bar+bold';
  };
}

interface HeadlineRenderOutput {
  descriptor: HighlightDescriptor;
  fragments: string[];
  rects: string[];
  textNodes: Array<{ id: string; fg: string; bg: string; largeText: boolean }>;
  maxWidth: number;
}

function renderHeadlineWithHighlight(input: HeadlineRenderInput): HeadlineRenderOutput {
  const { lines, startY, fontSize, lineHeight, x, tokens, highlight } = input;
  const descriptor = buildHighlightDescriptor(lines, highlight);
  const style = highlight?.highlightStyle || 'bar';

  const fragments: string[] = [];
  const rects: string[] = [];
  const textNodes: Array<{ id: string; fg: string; bg: string; largeText: boolean }> = [];
  let maxWidth = 0;

  lines.forEach((line, idx) => {
    const baselineY = startY + idx * lineHeight;
    const match = descriptor.match && descriptor.match.lineIndex === idx ? descriptor.match : null;
    const segments = splitLineByHighlight(line, match);
    let cursorX = x;

    segments.forEach((segment: TextSegment, segIdx: number) => {
      const isTarget = segment.highlighted && descriptor.hasMatch;
      const useBar = isTarget && (style === 'bar' || style === 'bar+bold');
      const useColor = isTarget && style === 'color';
      const weight = isTarget && style === 'bar+bold' ? 900 : 800;
      const fill =
        isTarget && useColor ? tokens.HL : isTarget && useBar ? tokens.NAVY : tokens.SAND;
      const segmentWidth = estimateTextWidth(segment.text, fontSize, weight);

      if (useBar) {
        rects.push(
          `<rect x="${Math.max(x, cursorX - 8)}" y="${baselineY - fontSize + 10}" width="${segmentWidth + 16}" height="${fontSize + 16}" fill="${tokens.HL}"/>`
        );
      }

      fragments.push(
        `<text x="${cursorX}" y="${baselineY}" font-family="${FONT_STACK}" font-size="${fontSize}" fill="${fill}" font-weight="${weight}" letter-spacing="-1.2">${escapeXml(segment.text)}</text>`
      );
      textNodes.push({
        id: `headline-${idx}-${segIdx}`,
        fg: fill,
        bg: useBar ? tokens.HL : tokens.NAVY,
        largeText: true,
      });
      const spacingAfter = useBar && segIdx < segments.length - 1 ? 12 : 0;
      cursorX += segmentWidth + spacingAfter;
    });

    maxWidth = Math.max(maxWidth, cursorX - x);
  });

  return { descriptor, fragments, rects, textNodes, maxWidth };
}

/**
 * Generate Instagram 1:1 Carousel SVG
 */
export function generateCarouselIg11Svg(
  fields: CarouselFields,
  tokens: BrandTokens,
  highlight?: {
    highlightMode?: 'none' | 'line' | 'phrase' | 'word';
    highlightTarget?: string;
    highlightStyle?: 'bar' | 'color' | 'bar+bold';
  },
  qaOverlay: boolean = false
): CarouselOutput {
  const width = 1080;
  const height = 1080;
  const safeMargin = 80;

  const slide = clampSlide(fields.carouselSlide || 1);
  const epNum = Number.isFinite(Number(fields.epNumber)) ? Number(fields.epNumber) : 0;
  const brand = normalizeText(fields.brand || 'AMTME');
  const category = normalizeText(fields.category || 'EL PATRÓN');
  const subtitleLine1 = normalizeText(fields.subtitleLine1 || 'Texto de apoyo');
  const subtitleLine2 = normalizeText(fields.subtitleLine2 || 'Desliza para continuar');
  const ctaLine1 = normalizeText(fields.ctaLine1 || 'ESCUCHAR EN');
  const ctaLine2 = normalizeText(fields.ctaLine2 || 'SPOTIFY →');

  const sourceHeadline = toHeadlineLines(fields.headline);
  const baseFontSize = slide === 6 ? 58 : 64;
  const wrappedHeadline = wrapLinesByWidth(
    sourceHeadline.length ? sourceHeadline : ['No te está costando', 'soltarlo'],
    width - 52 * 2 - 36,
    baseFontSize,
    800
  );
  const headlineLineCount = wrappedHeadline.length;
  const visibleLines = wrappedHeadline.slice(0, 5);

  const highlightRender = renderHeadlineWithHighlight({
    lines: visibleLines,
    startY: slide === 6 ? 400 : 340,
    fontSize: baseFontSize,
    lineHeight: slide === 6 ? 76 : 84,
    x: 52,
    tokens,
    highlight,
  });

  const theme =
    slide <= 3
      ? { bg: tokens.NAVY, fg: tokens.SAND, accent: tokens.GOLD }
      : { bg: tokens.TEAL, fg: tokens.NAVY, accent: tokens.GOLD };

  const layoutBoxes = [
    { id: 'slide-id', x: 52, y: 56, width: 180, height: 24 },
    {
      id: 'headline',
      x: 52,
      y: slide === 6 ? 342 : 278,
      width: highlightRender.maxWidth,
      height: visibleLines.length * (slide === 6 ? 76 : 84),
    },
    { id: 'subtitle', x: 52, y: 730, width: 860, height: 120 },
    { id: 'footer', x: 52, y: 996, width: width - 104, height: 32 },
  ];

  if (slide === 6) {
    layoutBoxes.push({ id: 'cta', x: 240, y: 590, width: 600, height: 78 });
  }

  const textNodes: Array<{ id: string; fg: string; bg: string; largeText: boolean }> = [
    ...highlightRender.textNodes,
    { id: 'slide-id', fg: theme.accent, bg: theme.bg, largeText: false },
    { id: 'category', fg: theme.accent, bg: theme.bg, largeText: false },
    { id: 'subtitle-1', fg: theme.fg, bg: theme.bg, largeText: false },
    { id: 'subtitle-2', fg: theme.fg, bg: theme.bg, largeText: false },
  ];

  if (slide === 6) {
    textNodes.push(
      { id: 'cta-1', fg: tokens.NAVY, bg: tokens.HL, largeText: false },
      { id: 'cta-2', fg: tokens.NAVY, bg: tokens.HL, largeText: false }
    );
  }

  const overlay = qaOverlay
    ? `<rect x="${safeMargin}" y="${safeMargin}" width="${width - safeMargin * 2}" height="${height - safeMargin * 2}" fill="none" stroke="#E0211E" stroke-width="2" stroke-dasharray="10 8"/>`
    : '';

  const backgroundArt =
    slide === 1
      ? `<rect width="${width}" height="120" fill="${tokens.NAVY}"/><text x="1028" y="96" text-anchor="end" font-family="${FONT_STACK}" font-size="10" fill="${tokens.GOLD}" opacity="0.6" letter-spacing="2">01 / 06</text>`
      : `<rect x="0" y="0" width="5" height="${height}" fill="${slide >= 4 ? tokens.HL : tokens.TEAL}" opacity="0.7"/><text x="52" y="72" font-family="${FONT_STACK}" font-size="11" fill="${slide >= 4 ? tokens.NAVY : tokens.TEAL}" font-weight="500" letter-spacing="3">${String(slide).padStart(2, '0')} / 06</text>`;

  const ctaBlock =
    slide === 6
      ? `<rect x="240" y="590" width="600" height="78" fill="${tokens.HL}"/><text x="540" y="640" text-anchor="middle" font-family="${FONT_STACK}" font-size="16" fill="${tokens.NAVY}" font-weight="800" letter-spacing="4">${escapeXml(ctaLine1)}</text><text x="540" y="664" text-anchor="middle" font-family="${FONT_STACK}" font-size="22" fill="${tokens.NAVY}" font-weight="900">${escapeXml(ctaLine2)}</text>`
      : '';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${theme.bg}"/>
  ${backgroundArt}
  <text x="52" y="130" font-family="${FONT_STACK}" font-size="12" fill="${theme.accent}" font-weight="700" letter-spacing="5" opacity="0.75">${escapeXml(category)}</text>
  <line x1="52" y1="152" x2="280" y2="152" stroke="${theme.accent}" stroke-width="0.8" opacity="0.4"/>
  ${highlightRender.rects.join('\n  ')}
  ${highlightRender.fragments.join('\n  ')}
  <rect x="52" y="690" width="70" height="2" fill="${theme.accent}" opacity="0.6"/>
  <text x="52" y="730" font-family="${FONT_STACK}" font-size="22" fill="${theme.fg}" font-weight="300" opacity="0.68">${escapeXml(subtitleLine1)}</text>
  <text x="52" y="764" font-family="${FONT_STACK}" font-size="22" fill="${theme.fg}" font-weight="300" opacity="0.56">${escapeXml(subtitleLine2)}</text>
  ${ctaBlock}
  <text x="52" y="1020" font-family="${FONT_STACK}" font-size="10" fill="${theme.accent}" opacity="0.45" letter-spacing="2">@yosoyvillamar · ${escapeXml(brand)} · EP ${String(Math.max(0, epNum)).padStart(2, '0')}</text>
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
      highlightApplied: Boolean(highlightRender.descriptor.hasMatch),
    },
  };
}
