import { z } from 'zod';
import type {
  LandingSectionKey,
  HeroSectionContent,
  FeaturedEpisodeSectionContent,
  AboutSectionContent,
  TopicsSectionContent,
  RecentEpisodesSectionContent,
  ManifestoSectionContent,
  AboutChristianSectionContent,
  NewsletterSectionContent,
  PlatformsSectionContent,
  FooterSectionContent,
} from '@/types/database';

// Section content schemas
const heroContentSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  cta_text: z.string().min(1).max(50),
  cta_url: z.string().url(),
  hero_image_url: z.string().url(),
});

const featuredEpisodeContentSchema = z.object({
  title: z.string().min(1).max(200),
  episode_title: z.string().min(1).max(200),
  episode_description: z.string().min(1).max(500),
  episode_url: z.string(),
  episode_image_url: z.string().url(),
});

const aboutContentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  cta_text: z.string().min(1).max(50),
  cta_url: z.string(),
});

const topicsContentSchema = z.object({
  title: z.string().min(1).max(200),
  topics: z.array(
    z.object({
      name: z.string().min(1).max(50),
      icon: z.string().min(1).max(50),
    })
  ),
});

const recentEpisodesContentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  show_count: z.number().int().min(1).max(20),
});

const manifestoContentSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(2000),
  cta_text: z.string().min(1).max(50),
  cta_url: z.string(),
});

const aboutChristianContentSchema = z.object({
  title: z.string().min(1).max(200),
  name: z.string().min(1).max(100),
  bio: z.string().min(1).max(500),
  image_url: z.string().url(),
  cta_text: z.string().min(1).max(50),
  cta_url: z.string(),
});

const newsletterContentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  placeholder: z.string().min(1).max(100),
  cta_text: z.string().min(1).max(50),
});

const platformsContentSchema = z.object({
  title: z.string().min(1).max(200),
  platforms: z.array(
    z.object({
      name: z.string().min(1).max(50),
      url: z.string().url(),
      icon: z.string().min(1).max(50),
    })
  ),
});

const footerContentSchema = z.object({
  copyright: z.string().min(1).max(200),
  links: z.array(
    z.object({
      text: z.string().min(1).max(100),
      url: z.string(),
    })
  ),
});

// Schema for landing page updates
export const updateLandingPageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(500).optional(),
  meta_keywords: z.string().min(1).max(200).optional(),
  og_image_url: z.string().url().optional(),
  is_published: z.boolean().optional(),
});

// Schema for section updates
export const updateLandingSectionSchema = z.object({
  section_order: z.number().int().min(0).max(100).optional(),
  is_visible: z.boolean().optional(),
  content: z.record(z.unknown()).optional(),
});

// Validation functions per section
export function validateHeroContent(data: unknown): HeroSectionContent {
  return heroContentSchema.parse(data);
}

export function validateFeaturedEpisodeContent(data: unknown): FeaturedEpisodeSectionContent {
  return featuredEpisodeContentSchema.parse(data);
}

export function validateAboutContent(data: unknown): AboutSectionContent {
  return aboutContentSchema.parse(data);
}

export function validateTopicsContent(data: unknown): TopicsSectionContent {
  return topicsContentSchema.parse(data);
}

export function validateRecentEpisodesContent(data: unknown): RecentEpisodesSectionContent {
  return recentEpisodesContentSchema.parse(data);
}

export function validateManifestoContent(data: unknown): ManifestoSectionContent {
  return manifestoContentSchema.parse(data);
}

export function validateAboutChristianContent(data: unknown): AboutChristianSectionContent {
  return aboutChristianContentSchema.parse(data);
}

export function validateNewsletterContent(data: unknown): NewsletterSectionContent {
  return newsletterContentSchema.parse(data);
}

export function validatePlatformsContent(data: unknown): PlatformsSectionContent {
  return platformsContentSchema.parse(data);
}

export function validateFooterContent(data: unknown): FooterSectionContent {
  return footerContentSchema.parse(data);
}

// Generic validation function that selects schema by section key
export function validateSectionContent(
  sectionKey: LandingSectionKey,
  data: unknown
): Record<string, unknown> {
  const validators: Record<LandingSectionKey, (data: unknown) => Record<string, unknown>> = {
    hero: validateHeroContent as (data: unknown) => Record<string, unknown>,
    featured_episode: validateFeaturedEpisodeContent as (data: unknown) => Record<string, unknown>,
    about: validateAboutContent as (data: unknown) => Record<string, unknown>,
    topics: validateTopicsContent as (data: unknown) => Record<string, unknown>,
    recent_episodes: validateRecentEpisodesContent as (data: unknown) => Record<string, unknown>,
    manifesto: validateManifestoContent as (data: unknown) => Record<string, unknown>,
    about_christian: validateAboutChristianContent as (data: unknown) => Record<string, unknown>,
    newsletter: validateNewsletterContent as (data: unknown) => Record<string, unknown>,
    platforms: validatePlatformsContent as (data: unknown) => Record<string, unknown>,
    footer: validateFooterContent as (data: unknown) => Record<string, unknown>,
  };

  const validator = validators[sectionKey];
  if (!validator) {
    throw new Error(`Unknown section key: ${sectionKey}`);
  }

  return validator(data);
}
