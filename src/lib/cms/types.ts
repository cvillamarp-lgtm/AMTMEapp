──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────// CMS TypeScript types for AMTME Landing Editor
export type CmsRole = 'admin' | 'editor';
export interface AdminRole { id: string; user_id: string; role: CmsRole; created_at: string; updated_at: string; }
export interface SeoMetadata { og_title?: string; og_description?: string; og_image?: string; twitter_card?: string; [key: string]: string | undefined; }
export interface SitePage { id: string; slug: string; title: string; description?: string; is_published: boolean; seo_metadata: SeoMetadata; created_at: string; updated_at: string; }
export interface SiteSection { id: string; page_id: string; section_key: string; label: string; sort_order: number; is_visible: boolean; content: Record<string, unknown>; created_at: string; updated_at: string; }
export interface SiteBlock { id: string; section_id: string; block_type: string; sort_order: number; is_visible: boolean; content: Record<string, unknown>; created_at: string; updated_at: string; }
export interface SiteAsset { id: string; filename: string; url: string; alt?: string; mime_type?: string; size_bytes?: number; metadata: Record<string, unknown>; created_at: string; updated_at: string; }
export interface SiteSetting { id: string; key: string; value: Record<string, unknown>; description?: string; created_at: string; updated_at: string; }
export type ContentHistoryEntityType = 'page' | 'section' | 'block' | 'setting';
export interface SiteContentHistory { id: string; entity_type: ContentHistoryEntityType; entity_id: string; changed_by?: string; snapshot: Record<string, unknown>; change_note?: string; created_at: string; }
export type EditorSaveState = 'idle' | 'unsaved' | 'saving' | 'saved' | 'error';
export interface EditorSection extends SiteSection { isDirty?: boolean; originalContent?: Record<string, unknown>; }
export interface LandingEditorState { page: SitePage | null; sections: EditorSection[]; selectedSectionKey: string | null; saveState: EditorSaveState; saveError?: string; lastSavedAt?: Date; }
export const LANDING_SECTION_KEYS = ['hero','featured_episode','about','topics','recent_episodes','manifesto','about_christian','newsletter','platforms','footer'] as const;
export type LandingSectionKey = (typeof LANDING_SECTION_KEYS)[number];
export interface HeroContent { eyebrow: string; title: string; subtitle: string; cta_primary_label: string; cta_primary_url: string; cta_secondary_label: string; cta_secondary_url: string; stats?: Array<{ label: string; value: string }>; ticker_items?: string[]; }
export interface FeaturedEpisodeContent { eyebrow: string; label: string; episode_tag: string; episode_topics: string; episode_title: string; episode_description: string; cta_label: string; cta_url: string; platforms?: string[]; }
export interface AboutContent { eyebrow: string; headline: string; body: string; }
export interface ManifestoContent { eyebrow: string; quote_line1: string; quote_line2: string; quote_line3: string; cta_primary_label: string; cta_primary_url: string; cta_secondary_label: string; cta_secondary_url: string; }
export interface AboutChristianContent { eyebrow: string; headline: string; body1: string; body2: string; cta_label: string; cta_url: string; social_handle: string; social_url: string; image_url: string; image_alt: string; }
export interface NewsletterContent { eyebrow: string; headline: string; body: string; cta_label: string; disclaimer: string; beehiiv_url?: string; }
export interface PlatformItem { name: string; badge: string; url: string; }
export interface PlatformsContent { eyebrow: string; headline: string; platforms: PlatformItem[]; }
export interface FooterNavLink { label: string; url: string; }
export interface FooterContent { brand_name: string; tagline: string; copyright: string; nav_links: FooterNavLink[]; }
export interface SocialLinksSettings { spotify: string; instagram: string; instagram_host?: string; tiktok?: string; youtube?: string; apple_podcasts?: string; ivoox?: string; }
