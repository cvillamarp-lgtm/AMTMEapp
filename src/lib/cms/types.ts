/**
 * CMS Types — Landing Page Content Management System
 * Defines all TypeScript interfaces for the CMS structure
 */

export const LANDING_SECTION_KEYS = [
  'hero',
  'featured_episode',
  'about',
  'topics',
  'recent_episodes',
  'manifesto',
  'about_christian',
  'newsletter',
  'platforms',
  'footer',
] as const;

export type SectionKey = (typeof LANDING_SECTION_KEYS)[number];

/**
 * Database row from site_pages table
 */
export interface SitePage {
  id: string;
  user_id: string;
  slug: string;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Database row from site_sections table
 */
export interface SiteSection {
  id: string;
  page_id: string;
  user_id: string;
  section_key: SectionKey;
  is_visible: boolean;
  sort_order: number;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Database row from site_content_history table
 */
export interface SiteContentHistory {
  id: string;
  page_id: string | null;
  section_id: string | null;
  user_id: string;
  change_type: 'updated' | 'published' | 'deleted';
  old_payload: Record<string, unknown> | null;
  new_payload: Record<string, unknown> | null;
  snapshot: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

/**
 * Public API response for landing page
 */
export interface LandingCmsData {
  page: SitePage | null;
  sections: SiteSection[];
}

/**
 * CMS save operation result
 */
export interface CmsSaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  message?: string;
  error?: string;
}

/**
 * CMS mutation result
 */
export interface CmsMutationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * SEO metadata for pages
 */
export interface SeoMetadata {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

/**
 * Type guard for SectionKey
 */
export function isSectionKey(key: unknown): key is SectionKey {
  return typeof key === 'string' && LANDING_SECTION_KEYS.includes(key as SectionKey);
}

/**
 * Type guard for SitePage
 */
export function isSitePage(obj: unknown): obj is SitePage {
  if (typeof obj !== 'object' || obj === null) return false;
  const page = obj as Record<string, unknown>;
  return (
    typeof page.id === 'string' &&
    typeof page.user_id === 'string' &&
    typeof page.slug === 'string' &&
    typeof page.payload === 'object' &&
    typeof page.created_at === 'string' &&
    typeof page.updated_at === 'string'
  );
}

/**
 * Type guard for SiteSection
 */
export function isSiteSection(obj: unknown): obj is SiteSection {
  if (typeof obj !== 'object' || obj === null) return false;
  const section = obj as Record<string, unknown>;
  return (
    typeof section.id === 'string' &&
    typeof section.page_id === 'string' &&
    typeof section.user_id === 'string' &&
    isSectionKey(section.section_key) &&
    typeof section.is_visible === 'boolean' &&
    typeof section.sort_order === 'number' &&
    typeof section.payload === 'object' &&
    typeof section.created_at === 'string' &&
    typeof section.updated_at === 'string'
  );
}
