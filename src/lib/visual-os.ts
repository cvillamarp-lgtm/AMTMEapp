/**
 * AMTME Visual OS - Type-safe visual brand compliance validator
 *
 * Validates visual content against AMTME brand specifications:
 * - Official color palette (7 brand colors)
 * - Visual formats (FEED_4_5, STORY_9_16, SQUARE_1_1)
 * - Safe zones and margins
 * - Brand personality (editorial, masculine, sober, human, emotional, direct, real, close, forceful, premium)
 * - Forbidden elements and tones
 * - Template specifications
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type BrandColor =
  | 'lemonLime'
  | 'navyProfundo'
  | 'cremaEditorial'
  | 'blanco'
  | 'azulGrisaceo'
  | 'rojoAMTME'
  | 'negroInterfaz';

export type VisualFormat = 'FEED_4_5' | 'STORY_9_16' | 'SQUARE_1_1';

export type BrandPersonality =
  | 'editorial'
  | 'masculine'
  | 'sober'
  | 'human'
  | 'emotional'
  | 'direct'
  | 'real'
  | 'close'
  | 'forceful'
  | 'premium';

export type ForbiddenTone =
  | 'italic'
  | 'cursive'
  | 'neon'
  | 'glow'
  | '3d'
  | 'unnecessary_gradients'
  | 'wellness_cliche'
  | 'sad'
  | 'funeral'
  | 'depressive'
  | 'dramatic';

export type VisualTemplate =
  | 'viral_feed'
  | 'episode_player_story'
  | 'dm_interaction_story'
  | 'manifesto_feed';

export interface BrandColorSpec {
  name: BrandColor;
  hex: string;
  description: string;
}

export interface FormatDimensions {
  format: VisualFormat;
  width: number;
  height: number;
  aspectRatio: string;
}

export interface SafeZone {
  format: VisualFormat;
  topMargin: number;
  bottomMargin: number;
  leftMargin: number;
  rightMargin: number;
}

export interface VisualContent {
  format: VisualFormat;
  colors: BrandColor[];
  hasText: boolean;
  hasForbiddenTone?: ForbiddenTone;
  template?: VisualTemplate;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// PALETTE DEFINITION
// ============================================================================

export const BRAND_PALETTE: Record<BrandColor, string> = {
  lemonLime: '#FEE94B',
  navyProfundo: '#0C1F36',
  cremaEditorial: '#F5F2EA',
  blanco: '#FFFFFF',
  azulGrisaceo: '#90A4B8',
  rojoAMTME: '#E0211E',
  negroInterfaz: '#111111',
};

export const COLOR_SPECS: BrandColorSpec[] = [
  {
    name: 'lemonLime',
    hex: '#FEE94B',
    description: 'Primary accent - vibrant, energetic, high-impact yellow',
  },
  {
    name: 'navyProfundo',
    hex: '#0C1F36',
    description: 'Primary base - deep navy, premium, sophisticated',
  },
  {
    name: 'cremaEditorial',
    hex: '#F5F2EA',
    description: 'Secondary neutral - warm cream, editorial, approachable',
  },
  {
    name: 'blanco',
    hex: '#FFFFFF',
    description: 'Pure white - clarity, separation, breathing room',
  },
  {
    name: 'azulGrisaceo',
    hex: '#90A4B8',
    description: 'Tertiary accent - subtle blue-gray, professional, calm',
  },
  {
    name: 'rojoAMTME',
    hex: '#E0211E',
    description: 'Emotional accent - bold red, direct, powerful',
  },
  {
    name: 'negroInterfaz',
    hex: '#111111',
    description: 'Interface black - text, UI elements, maximum contrast',
  },
];

// ============================================================================
// FORMAT SPECIFICATIONS
// ============================================================================

export const FORMAT_DIMENSIONS: Record<VisualFormat, Omit<FormatDimensions, 'format'>> = {
  FEED_4_5: {
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
  },
  STORY_9_16: {
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
  },
  SQUARE_1_1: {
    width: 3000,
    height: 3000,
    aspectRatio: '1:1',
  },
};

export const SAFE_ZONES: Record<VisualFormat, Omit<SafeZone, 'format'>> = {
  FEED_4_5: {
    topMargin: 50,
    bottomMargin: 100,
    leftMargin: 40,
    rightMargin: 40,
  },
  STORY_9_16: {
    topMargin: 120,
    bottomMargin: 150,
    leftMargin: 40,
    rightMargin: 40,
  },
  SQUARE_1_1: {
    topMargin: 150,
    bottomMargin: 150,
    leftMargin: 150,
    rightMargin: 150,
  },
};

// ============================================================================
// TEMPLATE SPECIFICATIONS
// ============================================================================

export const TEMPLATE_SPECS: Record<
  VisualTemplate,
  {
    format: VisualFormat;
    purpose: string;
    maxColors: number;
    mustIncludeLogo: boolean;
  }
> = {
  viral_feed: {
    format: 'FEED_4_5',
    purpose: 'High-impact feed content designed for viral potential',
    maxColors: 3,
    mustIncludeLogo: false,
  },
  episode_player_story: {
    format: 'STORY_9_16',
    purpose: 'Story format for episode player integration',
    maxColors: 4,
    mustIncludeLogo: true,
  },
  dm_interaction_story: {
    format: 'STORY_9_16',
    purpose: 'Story format for DM interactions',
    maxColors: 3,
    mustIncludeLogo: false,
  },
  manifesto_feed: {
    format: 'FEED_4_5',
    purpose: 'Editorial manifesto content with premium positioning',
    maxColors: 2,
    mustIncludeLogo: true,
  },
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates that a color is part of the official AMTME palette
 */
export function validateBrandColor(color: string): boolean {
  const colorEntries = Object.entries(BRAND_PALETTE);
  return colorEntries.some(([, hex]) => hex.toLowerCase() === color.toLowerCase());
}

/**
 * Validates that used colors are from the official palette
 */
export function validateColors(colors: BrandColor[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (colors.length === 0) {
    errors.push('At least one color must be specified');
    return { isValid: false, errors, warnings };
  }

  const validColors = Object.keys(BRAND_PALETTE) as BrandColor[];
  const invalidColors = colors.filter((color) => !validColors.includes(color));

  if (invalidColors.length > 0) {
    errors.push(
      `Invalid colors: ${invalidColors.join(', ')}. Use only official AMTME palette colors.`
    );
  }

  if (colors.includes('lemonLime') && colors.includes('rojoAMTME')) {
    warnings.push('Using both lemonLime and rojoAMTME accents may reduce visual harmony');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates visual format dimensions
 */
export function validateFormat(
  format: VisualFormat,
  width: number,
  height: number
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const dims = FORMAT_DIMENSIONS[format];
  if (width !== dims.width || height !== dims.height) {
    errors.push(
      `Invalid dimensions for ${format}: expected ${dims.width}x${dims.height}, got ${width}x${height}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates safe zone compliance
 */
export function validateSafeZone(
  format: VisualFormat,
  contentTop: number,
  contentBottom: number,
  contentLeft: number,
  contentRight: number
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const zones = SAFE_ZONES[format];

  if (contentTop < zones.topMargin) {
    errors.push(`Content top (${contentTop}px) violates safe zone (min ${zones.topMargin}px)`);
  }

  if (contentBottom < zones.bottomMargin) {
    errors.push(
      `Content bottom (${contentBottom}px) violates safe zone (min ${zones.bottomMargin}px)`
    );
  }

  if (contentLeft < zones.leftMargin) {
    errors.push(`Content left (${contentLeft}px) violates safe zone (min ${zones.leftMargin}px)`);
  }

  if (contentRight < zones.rightMargin) {
    errors.push(
      `Content right (${contentRight}px) violates safe zone (min ${zones.rightMargin}px)`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates brand personality alignment
 */
export function validateBrandPersonality(
  personalities: BrandPersonality[],
  forbiddenTones: ForbiddenTone[] = []
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const validPersonalities: BrandPersonality[] = [
    'editorial',
    'masculine',
    'sober',
    'human',
    'emotional',
    'direct',
    'real',
    'close',
    'forceful',
    'premium',
  ];

  const invalidPersonalities = personalities.filter((p) => !validPersonalities.includes(p));
  if (invalidPersonalities.length > 0) {
    errors.push(`Invalid brand personalities: ${invalidPersonalities.join(', ')}`);
  }

  // Check for forbidden tones
  const allForbiddenTones: ForbiddenTone[] = [
    'italic',
    'cursive',
    'neon',
    'glow',
    '3d',
    'unnecessary_gradients',
    'wellness_cliche',
    'sad',
    'funeral',
    'depressive',
    'dramatic',
  ];

  const invalidTones = forbiddenTones.filter((t) => !allForbiddenTones.includes(t));
  if (invalidTones.length > 0) {
    warnings.push(`Unknown tone categories: ${invalidTones.join(', ')}`);
  }

  const detectedForbidden = forbiddenTones.filter((t) => allForbiddenTones.includes(t));
  if (detectedForbidden.length > 0) {
    errors.push(`Forbidden tones detected: ${detectedForbidden.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates accent color usage
 */
export function validateAccentUsage(colors: BrandColor[], accentCount: number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const accentColors: BrandColor[] = ['lemonLime', 'rojoAMTME', 'azulGrisaceo'];
  const usedAccents = colors.filter((c) => accentColors.includes(c));

  if (accentCount > usedAccents.length) {
    errors.push(
      `Accent count (${accentCount}) exceeds available accents in palette (${usedAccents.length})`
    );
  }

  if (usedAccents.length > 2) {
    warnings.push('Using more than 2 accent colors may reduce visual coherence');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates template specifications
 */
export function validateTemplate(
  template: VisualTemplate,
  format: VisualFormat,
  colors: BrandColor[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const spec = TEMPLATE_SPECS[template];

  if (spec.format !== format) {
    errors.push(`Template ${template} requires format ${spec.format}, got ${format}`);
  }

  if (colors.length > spec.maxColors) {
    errors.push(`Template ${template} supports max ${spec.maxColors} colors, got ${colors.length}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Comprehensive visual content validation
 */
export function validateVisualContent(content: VisualContent): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate format
  if (!Object.keys(FORMAT_DIMENSIONS).includes(content.format)) {
    errors.push(`Invalid format: ${content.format}`);
  }

  // Validate colors
  const colorValidation = validateColors(content.colors);
  errors.push(...colorValidation.errors);
  warnings.push(...colorValidation.warnings);

  // Validate brand personality (if applicable)
  if (content.hasText) {
    const personalityValidation = validateBrandPersonality(
      ['editorial', 'direct', 'real'],
      content.hasForbiddenTone ? [content.hasForbiddenTone] : []
    );
    errors.push(...personalityValidation.errors);
    warnings.push(...personalityValidation.warnings);
  }

  // Validate template if specified
  if (content.template) {
    const templateValidation = validateTemplate(content.template, content.format, content.colors);
    errors.push(...templateValidation.errors);
    warnings.push(...templateValidation.warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get format dimensions by type
 */
export function getFormatDimensions(format: VisualFormat): FormatDimensions {
  const dims = FORMAT_DIMENSIONS[format];
  return {
    format,
    ...dims,
  };
}

/**
 * Get safe zone for format
 */
export function getSafeZone(format: VisualFormat): SafeZone {
  const zone = SAFE_ZONES[format];
  return {
    format,
    ...zone,
  };
}

/**
 * Get all valid colors
 */
export function getValidColors(): BrandColorSpec[] {
  return COLOR_SPECS;
}

/**
 * Get template specifications
 */
export function getTemplateSpecifications(template: VisualTemplate) {
  return TEMPLATE_SPECS[template];
}
