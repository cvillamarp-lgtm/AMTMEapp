// src/lib/visual/generators/episode-card.ts
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
 * Episode card input fields
 */
export interface EpisodeCardFields {
  epNumber: number;
  category: string;
  headline: string;
  subtitleLine1: string;
  subtitleLine2: string;
  duration: string;
  brand: string;
  ctaLine1: string;
  ctaLine2: string;
}

/**
 * Episode card sizing options
 */
export interface EpisodeCardSizes {
  headlineScale?: number;
  subtitleScale?: number;
  ctaScale?: number;
  footerScale?: number;
}

/**
 * Episode card output
 */
export interface EpisodeCardOutput {
  svg: string;
  meta: {
    width: number;
    height: number;
    safeMargin: number;
    format: 'IG45';
    layoutBoxes: Array<{ id: string; x: number; y: number; width: number; height: number }>;
    textNodes: Array<{ id: string; fg: string; bg: string; largeText: boolean }>;
    headlineLineCount: number;
    visibleHeadlineLines: number;
    highlightApplied: boolean;
    highlightMode: 'none' | 'line' | 'phrase' | 'word';
    highlightStyle: 'bar' | 'color' | 'bar+bold';
  };
}

/**
 * Scale from percentage
 */
function scaleFromPercent(value: unknown, fallback: number = 100): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback / 100;
  return Math.min(1.2, Math.max(0.8, numeric / 100));
}

/**
 * Generate Instagram 4:5 Episode Card SVG
 */
export function generateEpisodeCardIg45Svg(
  fields: EpisodeCardFields,
  tokens: BrandTokens,
  highlight?: {
    highlightMode?: 'none' | 'line' | 'phrase' | 'word';
    highlightTarget?: string;
    highlightStyle?: 'bar' | 'color' | 'bar+bold';
  },
  sizes: EpisodeCardSizes = {},
  qaOverlay: boolean = false
): EpisodeCardOutput {
  const width = 1080;
  const height = 1350;
  const safeMargin = 96;

  const epNum = Number.isFinite(Number(fields.epNumber)) ? Number(fields.epNumber) : 0;
  const epLabel = `EP.${String(Math.max(0, epNum)).padStart(3, '0')}`;

  const category = normalizeText(fields.category || 'RELACIONES');
  const subtitleLine1 = normalizeText(fields.subtitleLine1 || 'No te cuesta soltarlo.');
  const subtitleLine2 = normalizeText(fields.subtitleLine2 || 'Te cuesta soltar quién eras ahí.');
  const duration = normalizeText(fields.duration || '13:26 min');
  const brand = normalizeText(fields.brand || 'AMTME');
  const ctaLine1 = normalizeText(fields.ctaLine1 || 'ESCUCHAR EN');
  const ctaLine2 = normalizeText(fields.ctaLine2 || 'SPOTIFY →');

  const eyebrowY = 136;
  const ruleY = 166;
  const headlineX = safeMargin;
  const headlineScale = scaleFromPercent(sizes.headlineScale, 100);
  const subtitleScale = scaleFromPercent(sizes.subtitleScale, 100);
  const ctaScale = scaleFromPercent(sizes.ctaScale, 100);
  const footerScale = scaleFromPercent(sizes.footerScale, 100);

  const headlineStartY = 292;
  const headlineFontSize = Math.round(76 * headlineScale);
  const headlineLineHeight = Math.round(88 * headlineScale);
  const highlightNeedsBarRoom =
    highlight?.highlightMode !== 'none' &&
    (highlight?.highlightStyle === 'bar' || highlight?.highlightStyle === 'bar+bold');
  const headlineMaxWidthAllowed = width - safeMargin * 2 - (highlightNeedsBarRoom ? 36 : 12);

  const rawHeadlineLines = toHeadlineLines(fields.headline);
  const wrappedHeadline = wrapLinesByWidth(
    rawHeadlineLines.length ? rawHeadlineLines : ['No te está costando soltarlo.'],
    headlineMaxWidthAllowed,
    headlineFontSize,
    800
  );
  const headlineLineCount = wrappedHeadline.length;
  const visibleLines = wrappedHeadline.slice(0, 4);

  const highlightDescriptor = buildHighlightDescriptor(visibleLines, highlight);
  const highlightMode = highlight?.highlightMode || 'none';
  const highlightStyle = highlight?.highlightStyle || 'bar';

  const textNodes: Array<{ id: string; fg: string; bg: string; largeText: boolean }> = [];
  const headlineTextFragments: string[] = [];
  const highlightRects: string[] = [];

  let headlineMaxWidth = 0;

  visibleLines.forEach((line, lineIndex) => {
    const baselineY = headlineStartY + lineIndex * headlineLineHeight;
    const match =
      highlightDescriptor.match && highlightDescriptor.match.lineIndex === lineIndex
        ? highlightDescriptor.match
        : null;
    const segments = splitLineByHighlight(line, match);

    let cursorX = headlineX;

    segments.forEach((segment: TextSegment, segmentIndex: number) => {
      const isTarget = segment.highlighted && highlightDescriptor.hasMatch;
      const useBar = isTarget && (highlightStyle === 'bar' || highlightStyle === 'bar+bold');
      const useColor = isTarget && highlightStyle === 'color';
      const fontWeight = isTarget && highlightStyle === 'bar+bold' ? 900 : 800;
      const fill =
        isTarget && useColor ? tokens.HL : isTarget && useBar ? tokens.NAVY : tokens.SAND;

      const segmentWidth = estimateTextWidth(segment.text, headlineFontSize, fontWeight);

      if (useBar) {
        const barX = Math.max(headlineX, cursorX - 8);
        const barWidth = segmentWidth + 14;
        const barY = baselineY - headlineFontSize + 16;
        const barHeight = headlineFontSize + 22;

        highlightRects.push(
          `<rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" fill="${tokens.HL}"/>`
        );
      }

      headlineTextFragments.push(
        `<text x="${cursorX}" y="${baselineY}" font-family="${FONT_STACK}" font-size="${headlineFontSize}" font-weight="${fontWeight}" letter-spacing="-1.4" fill="${fill}">${escapeXml(segment.text)}</text>`
      );

      textNodes.push({
        id: `headline-${lineIndex}-${segmentIndex}`,
        fg: fill,
        bg: useBar ? tokens.HL : tokens.NAVY,
        largeText: true,
      });

      const spacingAfter = useBar && segmentIndex < segments.length - 1 ? 16 : 0;
      cursorX += segmentWidth + spacingAfter;
    });

    headlineMaxWidth = Math.max(headlineMaxWidth, cursorX - headlineX);
  });

  const headlineBoxTop = headlineStartY - headlineFontSize;
  const headlineBoxHeight = visibleLines.length * headlineLineHeight;

  const footerTopY = height - safeMargin;
  const footerRuleY = footerTopY - 34;
  const ctaBoxWidth = Math.round(520 * ctaScale);
  const ctaBoxHeight = Math.round(84 * ctaScale);
  const ctaBarY = footerRuleY - ctaBoxHeight - 46;
  const subtitleFontSize = Math.round(34 * subtitleScale);
  const subtitleLineGap = Math.round(40 * subtitleScale);
  const ctaLabelFontSize = Math.round(17 * ctaScale);
  const ctaMainFontSize = Math.round(28 * ctaScale);
  const ctaLabelY = ctaBarY + Math.round(ctaBoxHeight * 0.34);
  const ctaMainY = ctaBarY + Math.round(ctaBoxHeight * 0.72);
  const footerFontSize = Math.round(15 * footerScale);
  const footerBoxHeight = Math.round(footerFontSize + 12);

  let subtitleY = headlineBoxTop + headlineBoxHeight + Math.round(78 * subtitleScale);
  const subtitleBlockHeight = subtitleFontSize + subtitleLineGap + 10;
  const maxSubtitleBottom = ctaBarY - 64;
  const subtitleBottom = subtitleY + subtitleLineGap + 10;
  if (subtitleBottom > maxSubtitleBottom) {
    subtitleY -= subtitleBottom - maxSubtitleBottom;
  }

  const layoutBoxes = [
    { id: 'eyebrow', x: safeMargin, y: eyebrowY - 20, width: 480, height: 20 },
    { id: 'category', x: safeMargin, y: eyebrowY + 22, width: 320, height: 20 },
    {
      id: 'headline',
      x: headlineX,
      y: headlineBoxTop,
      width: headlineMaxWidth,
      height: headlineBoxHeight,
    },
    {
      id: 'subtitle',
      x: safeMargin,
      y: subtitleY - subtitleFontSize + 3,
      width: 760,
      height: subtitleBlockHeight,
    },
    { id: 'cta', x: safeMargin, y: ctaBarY, width: ctaBoxWidth, height: ctaBoxHeight },
    {
      id: 'footer-left',
      x: safeMargin,
      y: footerTopY - footerBoxHeight + 2,
      width: 380,
      height: footerBoxHeight,
    },
    {
      id: 'footer-right',
      x: width - safeMargin - 350,
      y: footerTopY - footerBoxHeight + 2,
      width: 350,
      height: footerBoxHeight,
    },
  ];

  if (highlightRects.length) {
    layoutBoxes.push({
      id: 'highlight-bar',
      x: headlineX,
      y: headlineBoxTop,
      width: headlineMaxWidth,
      height: headlineBoxHeight,
    });
  }

  textNodes.push(
    { id: 'eyebrow', fg: tokens.GOLD, bg: tokens.NAVY, largeText: false },
    { id: 'category', fg: tokens.TEAL, bg: tokens.NAVY, largeText: false },
    { id: 'subtitle-1', fg: tokens.AQUA, bg: tokens.NAVY, largeText: false },
    { id: 'subtitle-2', fg: tokens.TEAL, bg: tokens.NAVY, largeText: false },
    { id: 'cta-1', fg: tokens.NAVY, bg: tokens.HL, largeText: false },
    { id: 'cta-2', fg: tokens.NAVY, bg: tokens.HL, largeText: false },
    { id: 'footer-left', fg: tokens.GOLD, bg: tokens.NAVY, largeText: false },
    { id: 'footer-right', fg: tokens.SAND, bg: tokens.NAVY, largeText: false }
  );

  const safeZoneOverlay = qaOverlay
    ? `<rect x="${safeMargin}" y="${safeMargin}" width="${width - safeMargin * 2}" height="${height - safeMargin * 2}" fill="none" stroke="#FF5B5B" stroke-width="2" stroke-dasharray="10 8" opacity="0.8"/>`
    : '';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${tokens.NAVY}"/>
  <rect x="0" y="0" width="8" height="${height}" fill="${tokens.GOLD}" opacity="0.78"/>
  <text x="${safeMargin}" y="${eyebrowY}" font-family="${FONT_STACK}" font-size="15" font-weight="800" letter-spacing="4" fill="${tokens.GOLD}" opacity="0.9">${escapeXml(brand)}</text>
  <line x1="${safeMargin}" y1="${ruleY}" x2="${width - safeMargin}" y2="${ruleY}" stroke="${tokens.TEAL}" stroke-width="1" opacity="0.32"/>
  <text x="${safeMargin}" y="${eyebrowY + 46}" font-family="${FONT_STACK}" font-size="15" font-weight="700" letter-spacing="3" fill="${tokens.TEAL}" opacity="0.95">${escapeXml(category)}</text>
  ${highlightRects.join('\n  ')}
  ${headlineTextFragments.join('\n  ')}
  <line x1="${safeMargin}" y1="${subtitleY - 54}" x2="${safeMargin + 220}" y2="${subtitleY - 54}" stroke="${tokens.GOLD}" stroke-width="2" opacity="0.6"/>
  <text x="${safeMargin}" y="${subtitleY}" font-family="${FONT_STACK}" font-size="${subtitleFontSize}" font-weight="600" letter-spacing="-0.5" fill="${tokens.AQUA}" opacity="0.92">${escapeXml(subtitleLine1)}</text>
  <text x="${safeMargin}" y="${subtitleY + subtitleLineGap}" font-family="${FONT_STACK}" font-size="${subtitleFontSize}" font-weight="600" letter-spacing="-0.5" fill="${tokens.TEAL}" opacity="0.95">${escapeXml(subtitleLine2)}</text>
  <rect x="${safeMargin}" y="${ctaBarY}" width="${ctaBoxWidth}" height="${ctaBoxHeight}" fill="${tokens.HL}"/>
  <text x="${safeMargin + 22}" y="${ctaLabelY}" font-family="${FONT_STACK}" font-size="${ctaLabelFontSize}" font-weight="800" letter-spacing="3.2" fill="${tokens.NAVY}">${escapeXml(ctaLine1)}</text>
  <text x="${safeMargin + 22}" y="${ctaMainY}" font-family="${FONT_STACK}" font-size="${ctaMainFontSize}" font-weight="900" letter-spacing="0" fill="${tokens.NAVY}">${escapeXml(ctaLine2)}</text>
  <line x1="${safeMargin}" y1="${footerRuleY}" x2="${width - safeMargin}" y2="${footerRuleY}" stroke="${tokens.TEAL}" stroke-width="1" opacity="0.28"/>
  <text x="${safeMargin}" y="${footerTopY}" font-family="${FONT_STACK}" font-size="${footerFontSize}" font-weight="700" letter-spacing="2.6" fill="${tokens.GOLD}" opacity="0.95">${escapeXml(`${epLabel}  ${duration}`)}</text>
  <text x="${width - safeMargin}" y="${footerTopY}" text-anchor="end" font-family="${FONT_STACK}" font-size="${footerFontSize}" font-weight="700" letter-spacing="1.8" fill="${tokens.SAND}" opacity="0.9">${escapeXml(`${brand}  |  SB-01`)}</text>
  ${safeZoneOverlay}
</svg>`;

  return {
    svg,
    meta: {
      width,
      height,
      safeMargin,
      format: 'IG45',
      layoutBoxes,
      textNodes,
      headlineLineCount,
      visibleHeadlineLines: visibleLines.length,
      highlightApplied: Boolean(highlightDescriptor.hasMatch),
      highlightMode,
      highlightStyle,
    },
  };
}
