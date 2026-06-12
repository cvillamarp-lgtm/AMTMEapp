/**
 * visual-os-constants.ts — AMTME visual brand constants
 * Color palettes, format dimensions, safe zones, and template specifications
 */

import type {
  BrandColor,
  BrandColorSpec,
  VisualFormat,
  FormatDimensions,
  SafeZone,
  VisualTemplate,
} from './visual-os';

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
