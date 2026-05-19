import { describe, it, expect } from 'vitest';
import {
  validateBrandColor,
  validateColors,
  validateFormat,
  validateSafeZone,
  validateBrandPersonality,
  validateAccentUsage,
  validateTemplate,
  validateVisualContent,
  getFormatDimensions,
  getSafeZone,
  getValidColors,
  getTemplateSpecifications,
  BRAND_PALETTE,
  FORMAT_DIMENSIONS,
  SAFE_ZONES,
  TEMPLATE_SPECS,
  type BrandColor,
  type VisualFormat,
  type VisualContent,
  type BrandPersonality,
  type ForbiddenTone,
  type VisualTemplate,
} from '../visual-os';

describe('Visual OS - Brand Color Validation', () => {
  it('should validate official brand colors', () => {
    expect(validateBrandColor('#FEE94B')).toBe(true); // lemonLime
    expect(validateBrandColor('#0C1F36')).toBe(true); // navyProfundo
    expect(validateBrandColor('#F5F2EA')).toBe(true); // cremaEditorial
    expect(validateBrandColor('#FFFFFF')).toBe(true); // blanco
    expect(validateBrandColor('#90A4B8')).toBe(true); // azulGrisaceo
    expect(validateBrandColor('#E0211E')).toBe(true); // rojoAMTME
    expect(validateBrandColor('#111111')).toBe(true); // negroInterfaz
  });

  it('should reject non-brand colors', () => {
    expect(validateBrandColor('#FF0000')).toBe(false);
    expect(validateBrandColor('#00FF00')).toBe(false);
    expect(validateBrandColor('#0000FF')).toBe(false);
  });

  it('should be case-insensitive for hex values', () => {
    expect(validateBrandColor('#fee94b')).toBe(true);
    expect(validateBrandColor('#FEE94B')).toBe(true);
    expect(validateBrandColor('#FeE94b')).toBe(true);
  });
});

describe('Visual OS - Colors Array Validation', () => {
  it('should validate valid color arrays', () => {
    const result = validateColors(['lemonLime', 'navyProfundo', 'blanco']);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject empty color array', () => {
    const result = validateColors([]);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('At least one color must be specified');
  });

  it('should reject invalid colors', () => {
    const result = validateColors(['lemonLime', 'invalidColor' as BrandColor]);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Invalid colors');
  });

  it('should warn about conflicting accent colors', () => {
    const result = validateColors(['lemonLime', 'rojoAMTME', 'navyProfundo']);
    expect(result.isValid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('visual harmony');
  });
});

describe('Visual OS - Format Validation', () => {
  it('should validate FEED_4_5 format dimensions', () => {
    const result = validateFormat('FEED_4_5', 1080, 1350);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate STORY_9_16 format dimensions', () => {
    const result = validateFormat('STORY_9_16', 1080, 1920);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate SQUARE_1_1 format dimensions', () => {
    const result = validateFormat('SQUARE_1_1', 3000, 3000);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject incorrect dimensions for format', () => {
    const result = validateFormat('FEED_4_5', 1080, 1080);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Invalid dimensions');
  });

  it('should reject wrong width', () => {
    const result = validateFormat('STORY_9_16', 800, 1920);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Invalid dimensions');
  });
});

describe('Visual OS - Safe Zone Validation', () => {
  it('should validate content within safe zone', () => {
    const result = validateSafeZone('FEED_4_5', 50, 100, 40, 40);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject content violating top margin', () => {
    const result = validateSafeZone('FEED_4_5', 30, 100, 40, 40);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('top');
  });

  it('should reject content violating bottom margin', () => {
    const result = validateSafeZone('FEED_4_5', 50, 50, 40, 40);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('bottom');
  });

  it('should validate STORY_9_16 safe zones', () => {
    const result = validateSafeZone('STORY_9_16', 120, 150, 40, 40);
    expect(result.isValid).toBe(true);
  });

  it('should validate SQUARE_1_1 safe zones', () => {
    const result = validateSafeZone('SQUARE_1_1', 150, 150, 150, 150);
    expect(result.isValid).toBe(true);
  });
});

describe('Visual OS - Brand Personality Validation', () => {
  it('should validate valid personalities', () => {
    const result = validateBrandPersonality(['editorial', 'direct', 'real']);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid personality types', () => {
    const result = validateBrandPersonality(['editorial', 'invalid' as BrandPersonality]);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Invalid brand personalities');
  });

  it('should reject forbidden tones', () => {
    const result = validateBrandPersonality(['editorial'], ['neon']);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Forbidden tones detected');
  });

  it('should detect personality conflicts', () => {
    const result = validateBrandPersonality(['sober', 'forceful']);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should warn about unknown tone categories', () => {
    const result = validateBrandPersonality(['editorial'], ['unknown_tone' as ForbiddenTone]);
    expect(result.isValid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('should reject multiple forbidden tones', () => {
    const result = validateBrandPersonality(['editorial'], ['neon', 'glow', '3d']);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Forbidden tones detected');
  });
});

describe('Visual OS - Accent Usage Validation', () => {
  it('should validate accent count within limits', () => {
    const result = validateAccentUsage(['lemonLime', 'navyProfundo'], 1);
    expect(result.isValid).toBe(true);
  });

  it('should reject accent count exceeding available accents', () => {
    const result = validateAccentUsage(['navyProfundo', 'blanco'], 3);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Accent count');
  });

  it('should warn when using more than 2 accent colors', () => {
    const result = validateAccentUsage(['lemonLime', 'rojoAMTME', 'azulGrisaceo'], 3);
    expect(result.isValid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('visual coherence');
  });

  it('should handle no accent colors', () => {
    const result = validateAccentUsage(['navyProfundo', 'blanco'], 0);
    expect(result.isValid).toBe(true);
  });
});

describe('Visual OS - Template Validation', () => {
  it('should validate viral_feed template', () => {
    const result = validateTemplate('viral_feed', 'FEED_4_5', ['lemonLime', 'navyProfundo']);
    expect(result.isValid).toBe(true);
  });

  it('should validate episode_player_story template', () => {
    const result = validateTemplate('episode_player_story', 'STORY_9_16', [
      'lemonLime',
      'navyProfundo',
      'blanco',
      'cremaEditorial',
    ]);
    expect(result.isValid).toBe(true);
  });

  it('should validate manifesto_feed template', () => {
    const result = validateTemplate('manifesto_feed', 'FEED_4_5', ['navyProfundo']);
    expect(result.isValid).toBe(true);
  });

  it('should reject wrong format for template', () => {
    const result = validateTemplate('viral_feed', 'STORY_9_16', ['lemonLime']);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('format');
  });

  it('should reject exceeding max colors for template', () => {
    const result = validateTemplate('viral_feed', 'FEED_4_5', [
      'lemonLime',
      'navyProfundo',
      'blanco',
      'rojoAMTME',
    ]);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('max');
  });

  it('should validate dm_interaction_story template', () => {
    const result = validateTemplate('dm_interaction_story', 'STORY_9_16', [
      'lemonLime',
      'navyProfundo',
    ]);
    expect(result.isValid).toBe(true);
  });
});

describe('Visual OS - Comprehensive Content Validation', () => {
  it('should validate complete visual content', () => {
    const content: VisualContent = {
      format: 'FEED_4_5',
      colors: ['lemonLime', 'navyProfundo'],
      hasText: true,
      template: 'viral_feed',
    };
    const result = validateVisualContent(content);
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid format in content', () => {
    const content: VisualContent = {
      format: 'INVALID' as VisualFormat,
      colors: ['lemonLime'],
      hasText: false,
    };
    const result = validateVisualContent(content);
    expect(result.isValid).toBe(false);
  });

  it('should aggregate errors from multiple validations', () => {
    const content: VisualContent = {
      format: 'FEED_4_5',
      colors: ['invalidColor' as BrandColor],
      hasText: true,
      hasForbiddenTone: 'neon',
      template: 'viral_feed',
    };
    const result = validateVisualContent(content);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  it('should validate story format content', () => {
    const content: VisualContent = {
      format: 'STORY_9_16',
      colors: ['navyProfundo', 'lemonLime'],
      hasText: true,
      template: 'episode_player_story',
    };
    const result = validateVisualContent(content);
    expect(result.isValid).toBe(true);
  });

  it('should handle content without template', () => {
    const content: VisualContent = {
      format: 'SQUARE_1_1',
      colors: ['blanco', 'negroInterfaz'],
      hasText: false,
    };
    const result = validateVisualContent(content);
    expect(result.isValid).toBe(true);
  });
});

describe('Visual OS - Helper Functions', () => {
  it('should return format dimensions correctly', () => {
    const dims = getFormatDimensions('FEED_4_5');
    expect(dims.format).toBe('FEED_4_5');
    expect(dims.width).toBe(1080);
    expect(dims.height).toBe(1350);
    expect(dims.aspectRatio).toBe('4:5');
  });

  it('should return safe zone correctly', () => {
    const zone = getSafeZone('STORY_9_16');
    expect(zone.format).toBe('STORY_9_16');
    expect(zone.topMargin).toBe(120);
    expect(zone.bottomMargin).toBe(150);
  });

  it('should return all valid colors', () => {
    const colors = getValidColors();
    expect(colors.length).toBe(7);
    expect(colors[0].name).toBe('lemonLime');
    expect(colors[0].hex).toBe('#FEE94B');
  });

  it('should return template specifications', () => {
    const spec = getTemplateSpecifications('viral_feed');
    expect(spec.format).toBe('FEED_4_5');
    expect(spec.maxColors).toBe(3);
    expect(spec.mustIncludeLogo).toBe(false);
  });

  it('should return all template specs', () => {
    const specs = ['viral_feed', 'episode_player_story', 'dm_interaction_story', 'manifesto_feed'];
    specs.forEach((templateName) => {
      const spec = getTemplateSpecifications(templateName as VisualTemplate);
      expect(spec).toBeDefined();
      expect(spec.purpose).toBeDefined();
    });
  });
});

describe('Visual OS - Constants and Exports', () => {
  it('should have all brand colors in palette', () => {
    expect(Object.keys(BRAND_PALETTE)).toHaveLength(7);
    expect(BRAND_PALETTE.lemonLime).toBe('#FEE94B');
    expect(BRAND_PALETTE.navyProfundo).toBe('#0C1F36');
  });

  it('should have dimensions for all formats', () => {
    expect(FORMAT_DIMENSIONS.FEED_4_5).toBeDefined();
    expect(FORMAT_DIMENSIONS.STORY_9_16).toBeDefined();
    expect(FORMAT_DIMENSIONS.SQUARE_1_1).toBeDefined();
  });

  it('should have safe zones for all formats', () => {
    expect(SAFE_ZONES.FEED_4_5).toBeDefined();
    expect(SAFE_ZONES.STORY_9_16).toBeDefined();
    expect(SAFE_ZONES.SQUARE_1_1).toBeDefined();
  });

  it('should have specs for all templates', () => {
    expect(TEMPLATE_SPECS.viral_feed).toBeDefined();
    expect(TEMPLATE_SPECS.episode_player_story).toBeDefined();
    expect(TEMPLATE_SPECS.dm_interaction_story).toBeDefined();
    expect(TEMPLATE_SPECS.manifesto_feed).toBeDefined();
  });
});
