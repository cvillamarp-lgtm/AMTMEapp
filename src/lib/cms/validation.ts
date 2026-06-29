/**
 * CMS Validation — Schema validation for CMS data
 */

import { z } from 'zod';
import type { SectionKey } from './types';
import { LANDING_SECTION_KEYS } from './types';

/**
 * Validate section key
 */
export function validateSectionKey(key: unknown): key is SectionKey {
  return typeof key === 'string' && LANDING_SECTION_KEYS.includes(key as SectionKey);
}

/**
 * Validate URL format
 */
export function validateUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate required fields in payload
 */
export function validatePayloadHasRequiredFields(
  payload: Record<string, unknown>,
  requiredFields: string[]
): boolean {
  for (const field of requiredFields) {
    const value = payload[field];
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Validate hero section
 */
export function validateHeroPayload(payload: Record<string, unknown>): boolean {
  const required = ['mainHeading', 'subtitle'];
  return validatePayloadHasRequiredFields(payload, required);
}

/**
 * Validate featured episode section
 */
export function validateFeaturedEpisodePayload(payload: Record<string, unknown>): boolean {
  const required = ['episodeTitle', 'episodeDescription'];
  return validatePayloadHasRequiredFields(payload, required);
}

/**
 * Validate about section
 */
export function validateAboutPayload(payload: Record<string, unknown>): boolean {
  const required = ['sectionTitle'];
  return validatePayloadHasRequiredFields(payload, required);
}

/**
 * Validate topics section
 */
export function validateTopicsPayload(payload: Record<string, unknown>): boolean {
  const required = ['sectionTitle'];
  return validatePayloadHasRequiredFields(payload, required);
}

/**
 * Validate recent episodes section
 */
export function validateRecentEpisodesPayload(payload: Record<string, unknown>): boolean {
  const required = ['sectionTitle'];
  return validatePayloadHasRequiredFields(payload, required);
}

/**
 * Validate manifesto section
 */
export function validateManifestoPayload(payload: Record<string, unknown>): boolean {
  const required = ['sectionTitle'];
  return validatePayloadHasRequiredFields(payload, required);
}

/**
 * Validate about_christian section
 */
export function validateAboutChristianPayload(payload: Record<string, unknown>): boolean {
  const required = ['name', 'title'];
  return validatePayloadHasRequiredFields(payload, required);
}

/**
 * Validate newsletter section
 */
export function validateNewsletterPayload(payload: Record<string, unknown>): boolean {
  const required = ['sectionTitle', 'ctaText'];
  return validatePayloadHasRequiredFields(payload, required);
}

/**
 * Validate platforms section
 */
export function validatePlatformsPayload(payload: Record<string, unknown>): boolean {
  const required = ['sectionTitle'];
  return validatePayloadHasRequiredFields(payload, required);
}

/**
 * Validate footer section
 */
export function validateFooterPayload(payload: Record<string, unknown>): boolean {
  const required = ['brandName', 'copyright'];
  return validatePayloadHasRequiredFields(payload, required);
}

/**
 * Validate section payload by type
 */
export function validateSectionPayload(
  sectionKey: SectionKey,
  payload: Record<string, unknown>
): boolean {
  switch (sectionKey) {
    case 'hero':
      return validateHeroPayload(payload);
    case 'featured_episode':
      return validateFeaturedEpisodePayload(payload);
    case 'about':
      return validateAboutPayload(payload);
    case 'topics':
      return validateTopicsPayload(payload);
    case 'recent_episodes':
      return validateRecentEpisodesPayload(payload);
    case 'manifesto':
      return validateManifestoPayload(payload);
    case 'about_christian':
      return validateAboutChristianPayload(payload);
    case 'newsletter':
      return validateNewsletterPayload(payload);
    case 'platforms':
      return validatePlatformsPayload(payload);
    case 'footer':
      return validateFooterPayload(payload);
    default:
      return false;
  }
}

/**
 * Validate reordering has exactly 10 sections
 */
export function validateSectionReorder(sectionKeys: unknown[]): sectionKeys is SectionKey[] {
  if (!Array.isArray(sectionKeys)) return false;
  if (sectionKeys.length !== 10) return false;

  const keySet = new Set<string>();
  for (const key of sectionKeys) {
    if (!validateSectionKey(key)) return false;
    if (keySet.has(key)) return false; // Duplicate
    keySet.add(key);
  }

  // Ensure all keys are present
  for (const required of LANDING_SECTION_KEYS) {
    if (!keySet.has(required)) return false;
  }

  return true;
}

/**
 * Validate SEO metadata
 */
const seoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url().optional(),
});

export function validateSeoMetadata(seo: unknown): seo is Record<string, unknown> {
  try {
    seoSchema.parse(seo);
    return true;
  } catch {
    return false;
  }
}
