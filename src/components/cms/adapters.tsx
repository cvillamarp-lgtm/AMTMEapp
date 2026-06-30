/**
 * CMS Adapters for Editorial Components
 * Pass CMS section data to editorial components while maintaining fallback behavior
 */

import type { SiteSection } from '@/lib/cms/types';

/**
 * Extract hero data from CMS section payload
 * Falls back to component defaults if payload is incomplete
 */
export function getHeroProps(section: SiteSection | null) {
  if (!section?.payload) return {};

  const payload = section.payload as Record<string, unknown>;

  return {
    cms: {
      tagline: (payload.tagline as string) || undefined,
      mainHeading: (payload.mainHeading as string) || undefined,
      subtitle: (payload.subtitle as string) || undefined,
      primaryCta: (payload.primaryCta as string) || undefined,
      secondaryCta: (payload.secondaryCta as string) || undefined,
      imageUrl: (payload.imageUrl as string) || undefined,
      imageAlt: (payload.imageAlt as string) || undefined,
      stats: (payload.stats as Array<{ label: string; value: string }>) || undefined,
    },
  };
}

/**
 * Extract featured episode data from CMS section payload
 */
export function getFeaturedEpisodeProps(section: SiteSection | null) {
  if (!section?.payload) return {};

  const payload = section.payload as Record<string, unknown>;

  return {
    cms: {
      sectionLabel: (payload.sectionLabel as string) || undefined,
      sectionTitle: (payload.sectionTitle as string) || undefined,
      episodeLabel: (payload.episodeLabel as string) || undefined,
      episodeBadge: (payload.episodeBadge as string) || undefined,
      episodeTitle: (payload.episodeTitle as string) || undefined,
      episodeDescription: (payload.episodeDescription as string) || undefined,
      imageUrl: (payload.imageUrl as string) || undefined,
      imageAlt: (payload.imageAlt as string) || undefined,
      spotifyEmbedUrl: (payload.spotifyEmbedUrl as string) || undefined,
      episodeUrl: (payload.episodeUrl as string) || undefined,
    },
  };
}

/**
 * Extract about section data from CMS section payload
 */
export function getAboutProps(section: SiteSection | null) {
  if (!section?.payload) return {};

  const payload = section.payload as Record<string, unknown>;

  return {
    cms: {
      sectionLabel: (payload.sectionLabel as string) || undefined,
      sectionTitle: (payload.sectionTitle as string) || undefined,
      paragraphs: (payload.paragraphs as string[]) || undefined,
      cta: (payload.cta as string) || undefined,
    },
  };
}

/**
 * Extract topics grid data from CMS section payload
 */
export function getTopicsProps(section: SiteSection | null) {
  if (!section?.payload) return {};

  const payload = section.payload as Record<string, unknown>;

  return {
    cms: {
      sectionLabel: (payload.sectionLabel as string) || undefined,
      sectionTitle: (payload.sectionTitle as string) || undefined,
      topics: (payload.topics as string[]) || undefined,
    },
  };
}

/**
 * Extract recent episodes data from CMS section payload
 */
export function getRecentEpisodesProps(section: SiteSection | null) {
  if (!section?.payload) return {};

  const payload = section.payload as Record<string, unknown>;

  return {
    cms: {
      sectionLabel: (payload.sectionLabel as string) || undefined,
      sectionTitle: (payload.sectionTitle as string) || undefined,
      episodes: (payload.episodes as Array<Record<string, unknown>>) || undefined,
    },
  };
}

/**
 * Extract manifesto data from CMS section payload
 */
export function getManifestoProps(section: SiteSection | null) {
  if (!section?.payload) return {};

  const payload = section.payload as Record<string, unknown>;

  return {
    cms: {
      sectionLabel: (payload.sectionLabel as string) || undefined,
      sectionTitle: (payload.sectionTitle as string) || undefined,
      manifestoPoints: (payload.manifestoPoints as string[]) || undefined,
      closingText: (payload.closingText as string) || undefined,
    },
  };
}

/**
 * Extract about Christian data from CMS section payload
 */
export function getAboutChristianProps(section: SiteSection | null) {
  if (!section?.payload) return {};

  const payload = section.payload as Record<string, unknown>;

  return {
    cms: {
      sectionLabel: (payload.sectionLabel as string) || undefined,
      sectionTitle: (payload.sectionTitle as string) || undefined,
      bio: (payload.bio as string) || undefined,
      imageUrl: (payload.imageUrl as string) || undefined,
      imageAlt: (payload.imageAlt as string) || undefined,
      socialLinks: (payload.socialLinks as Record<string, string>) || undefined,
    },
  };
}

/**
 * Extract newsletter data from CMS section payload
 */
export function getNewsletterProps(section: SiteSection | null) {
  if (!section?.payload) return {};

  const payload = section.payload as Record<string, unknown>;

  return {
    cms: {
      sectionTitle: (payload.sectionTitle as string) || undefined,
      sectionSubtitle: (payload.sectionSubtitle as string) || undefined,
      placeholderText: (payload.placeholderText as string) || undefined,
      ctaText: (payload.ctaText as string) || undefined,
    },
  };
}

/**
 * Extract platforms data from CMS section payload
 */
export function getPlatformsProps(section: SiteSection | null) {
  if (!section?.payload) return {};

  const payload = section.payload as Record<string, unknown>;

  return {
    cms: {
      sectionLabel: (payload.sectionLabel as string) || undefined,
      sectionTitle: (payload.sectionTitle as string) || undefined,
      platforms: (payload.platforms as Array<Record<string, string>>) || undefined,
    },
  };
}

/**
 * Extract footer data from CMS section payload
 */
export function getFooterProps(section: SiteSection | null) {
  if (!section?.payload) return {};

  const payload = section.payload as Record<string, unknown>;

  return {
    cms: {
      companyName: (payload.companyName as string) || undefined,
      tagline: (payload.tagline as string) || undefined,
      links: (payload.links as Array<{ label: string; url: string }>) || undefined,
      copyright: (payload.copyright as string) || undefined,
    },
  };
}
