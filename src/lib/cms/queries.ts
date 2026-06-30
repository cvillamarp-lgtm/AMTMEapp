/**
 * CMS Queries — Data access layer for landing page CMS
 * Handles reading/writing site pages and sections with proper RLS
 */

import { getSupabaseAuthServerClient } from '@/lib/supabase/auth-server';
import type { SitePage, SiteSection, CmsMutationResult } from './types';

/**
 * Get published landing page (public read)
 * Used by the public landing page — only returns published content
 */
export async function getPublishedLandingPage(): Promise<{
  page: SitePage | null;
  sections: SiteSection[];
}> {
  try {
    const supabase = await getSupabaseAuthServerClient();

    if (!supabase) {
      return { page: null, sections: [] };
    }

    // Fetch published page
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pageData, error: pageError } = await (supabase as any)
      .from('site_pages')
      .select('*')
      .eq('slug', 'home')
      .eq('payload->is_published', 'true')
      .single();

    if (pageError || !pageData) {
      return { page: null, sections: [] };
    }

    // Fetch visible sections from published page
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: sectionsData, error: sectionsError } = await (supabase as any)
      .from('site_sections')
      .select('*')
      .eq('page_id', pageData.id)
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (sectionsError) {
      return { page: pageData as SitePage, sections: [] };
    }

    return {
      page: pageData as SitePage,
      sections: (sectionsData || []) as SiteSection[],
    };
  } catch (error) {
    console.error('[getPublishedLandingPage] Error:', error);
    return { page: null, sections: [] };
  }
}

/**
 * Get admin landing page (admin-only read)
 * Used by the editor — returns all content (draft, hidden, published)
 * Must validate admin status first
 */
export async function getAdminLandingPage(): Promise<{
  page: SitePage | null;
  sections: SiteSection[];
}> {
  try {
    // Validate admin status first
    const isAdmin = await checkIsCMSAdmin();
    if (!isAdmin) {
      return { page: null, sections: [] };
    }

    const supabase = await getSupabaseAuthServerClient();

    if (!supabase) {
      return { page: null, sections: [] };
    }

    // Fetch any page (admin can see all)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pageData, error: pageError } = await (supabase as any)
      .from('site_pages')
      .select('*')
      .eq('slug', 'home')
      .single();

    if (pageError || !pageData) {
      return { page: null, sections: [] };
    }

    // Fetch all sections (no visibility filter for admin)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: sectionsData, error: sectionsError } = await (supabase as any)
      .from('site_sections')
      .select('*')
      .eq('page_id', pageData.id)
      .order('sort_order', { ascending: true });

    if (sectionsError) {
      return { page: pageData as SitePage, sections: [] };
    }

    return {
      page: pageData as SitePage,
      sections: (sectionsData || []) as SiteSection[],
    };
  } catch (error) {
    console.error('[getAdminLandingPage] Error:', error);
    return { page: null, sections: [] };
  }
}

/**
 * Check if current user is CMS admin
 * Uses RPC function public.is_cms_admin()
 */
export async function checkIsCMSAdmin(): Promise<boolean> {
  try {
    const supabase = await getSupabaseAuthServerClient();

    if (!supabase) {
      console.error('[checkIsCMSAdmin] Supabase not configured');
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc('is_cms_admin');

    if (error) {
      console.error('[checkIsCMSAdmin] RPC error:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('[checkIsCMSAdmin] Error:', error);
    return false;
  }
}

/**
 * Save section draft
 * Updates section payload and maintains page draft state
 */
export async function saveSectionDraft(
  sectionKey: string,
  payload: Record<string, unknown>
): Promise<CmsMutationResult<SiteSection>> {
  try {
    const isAdmin = await checkIsCMSAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Unauthorized: admin access required' };
    }

    const supabase = await getSupabaseAuthServerClient();

    if (!supabase) {
      return { success: false, error: 'Service unavailable' };
    }

    // Get page first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pageData, error: pageError } = await (supabase as any)
      .from('site_pages')
      .select('id')
      .eq('slug', 'home')
      .single();

    if (pageError || !pageData) {
      return { success: false, error: 'Page not found' };
    }

    // Update section
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('site_sections')
      .update({
        payload,
        updated_at: new Date().toISOString(),
      })
      .eq('page_id', pageData.id)
      .eq('section_key', sectionKey)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Create history entry
    await createContentHistorySnapshot(pageData.id, data.id, 'updated', null, payload);

    return { success: true, data: data as SiteSection };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Publish landing page
 * Marks site_pages.payload.is_published = true
 */
export async function publishLandingPage(): Promise<CmsMutationResult<SitePage>> {
  try {
    const isAdmin = await checkIsCMSAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Unauthorized: admin access required' };
    }

    const supabase = await getSupabaseAuthServerClient();

    if (!supabase) {
      return { success: false, error: 'Service unavailable' };
    }

    // Get page with current payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pageData, error: pageError } = await (supabase as any)
      .from('site_pages')
      .select('*')
      .eq('slug', 'home')
      .single();

    if (pageError || !pageData) {
      return { success: false, error: 'Page not found' };
    }

    // Update payload to published
    const updatedPayload = {
      ...pageData.payload,
      is_published: true,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('site_pages')
      .update({
        payload: updatedPayload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageData.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Create history snapshot
    await createContentHistorySnapshot(
      pageData.id,
      null,
      'published',
      pageData.payload,
      updatedPayload
    );

    return { success: true, data: data as SitePage };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Toggle section visibility
 */
export async function toggleSectionVisibility(
  sectionKey: string,
  isVisible: boolean
): Promise<CmsMutationResult<SiteSection>> {
  try {
    const isAdmin = await checkIsCMSAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Unauthorized: admin access required' };
    }

    const supabase = await getSupabaseAuthServerClient();

    if (!supabase) {
      return { success: false, error: 'Service unavailable' };
    }

    // Get page
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pageData, error: pageError } = await (supabase as any)
      .from('site_pages')
      .select('id')
      .eq('slug', 'home')
      .single();

    if (pageError || !pageData) {
      return { success: false, error: 'Page not found' };
    }

    // Update section
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('site_sections')
      .update({
        is_visible: isVisible,
        updated_at: new Date().toISOString(),
      })
      .eq('page_id', pageData.id)
      .eq('section_key', sectionKey)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Create history entry
    const section = data as SiteSection;
    await createContentHistorySnapshot(pageData.id, section.id, 'updated', null, section.payload);

    return { success: true, data: section };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Reorder sections
 * Validates all 10 required sections are present
 */
export async function reorderSections(sectionKeys: string[]): Promise<CmsMutationResult<void>> {
  try {
    const isAdmin = await checkIsCMSAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Unauthorized: admin access required' };
    }

    // Validate exactly 10 sections
    if (sectionKeys.length !== 10) {
      return { success: false, error: 'Must reorder exactly 10 sections' };
    }

    const supabase = await getSupabaseAuthServerClient();

    if (!supabase) {
      return { success: false, error: 'Service unavailable' };
    }

    // Get page
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pageData, error: pageError } = await (supabase as any)
      .from('site_pages')
      .select('id')
      .eq('slug', 'home')
      .single();

    if (pageError || !pageData) {
      return { success: false, error: 'Page not found' };
    }

    // Update sort_order for each section
    for (let i = 0; i < sectionKeys.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('site_sections')
        .update({
          sort_order: i + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('page_id', pageData.id)
        .eq('section_key', sectionKeys[i]);

      if (error) {
        return { success: false, error: `Failed to reorder ${sectionKeys[i]}: ${error.message}` };
      }
    }

    // Create history entry
    await createContentHistorySnapshot(pageData.id, null, 'updated', null, {
      sectionOrder: sectionKeys,
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Update page SEO metadata
 */
export async function updatePageSeo(
  seoMetadata: Record<string, unknown>
): Promise<CmsMutationResult<SitePage>> {
  try {
    const isAdmin = await checkIsCMSAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Unauthorized: admin access required' };
    }

    const supabase = await getSupabaseAuthServerClient();

    if (!supabase) {
      return { success: false, error: 'Service unavailable' };
    }

    // Get page
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pageData, error: pageError } = await (supabase as any)
      .from('site_pages')
      .select('*')
      .eq('slug', 'home')
      .single();

    if (pageError || !pageData) {
      return { success: false, error: 'Page not found' };
    }

    // Update payload with new SEO
    const updatedPayload = {
      ...pageData.payload,
      seo: seoMetadata,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('site_pages')
      .update({
        payload: updatedPayload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageData.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Create history entry
    await createContentHistorySnapshot(
      pageData.id,
      null,
      'updated',
      pageData.payload,
      updatedPayload
    );

    return { success: true, data: data as SitePage };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Create content history snapshot
 * Internal function to track changes
 */
async function createContentHistorySnapshot(
  pageId: string,
  sectionId: string | null,
  changeType: 'updated' | 'published' | 'deleted',
  oldPayload: Record<string, unknown> | null,
  newPayload: Record<string, unknown> | null
): Promise<void> {
  try {
    const supabase = await getSupabaseAuthServerClient();

    if (!supabase) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('site_content_history').insert({
      page_id: pageId,
      section_id: sectionId,
      change_type: changeType,
      old_payload: oldPayload,
      new_payload: newPayload,
      metadata: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[createContentHistorySnapshot] Error:', error);
  }
}
