// src/lib/visual/generators/index.ts

export { generateCarouselIg11Svg, type CarouselFields, type CarouselOutput } from './carousel';
export {
  generateEpisodeCardIg45Svg,
  type EpisodeCardFields,
  type EpisodeCardSizes,
  type EpisodeCardOutput,
} from './episode-card';
export { generateQuoteIg11Svg, type QuoteFields, type QuoteOutput } from './quote';
export { generateStoryIg916Svg, type StoryFields, type StoryOutput } from './story';

// Shared utilities
export {
  FONT_STACK,
  escapeXml,
  normalizeText,
  toHeadlineLines,
  wrapLinesByWidth,
  estimateTextWidth,
  buildHighlightDescriptor,
  splitLineByHighlight,
  type HighlightMatch,
  type HighlightDescriptor,
  type TextSegment,
} from './shared';
