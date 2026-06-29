import { getSupabaseAuthServerClient } from '@/lib/supabase/auth-server';
import type { LandingPage, LandingSection } from '@/types/database';
import { landingSectionsFallback } from './fallback';

/**
 * Get published landing page with all visible sections
 * (public access - returns only published content)
 */
export async function getPublishedLandingPage(slug = 'home'): Promise<{
  page: LandingPage | null;
  sections: LandingSection[];
}> {
  const supabase = await getSupabaseAuthServerClient();

  if (!supabase) {
    return { page: null, sections: [] };
  }

  try {
    // Get published landing page
    const { data: pageData, error: pageError } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (pageError || !pageData) {
      console.error('Error fetching published landing page:', pageError);
      return { page: null, sections: [] };
    }

    const currentPage = pageData as LandingPage;

    // Get visible sections of published page
    const { data: sectionsData, error: sectionsError } = await supabase
      .from('landing_sections')
      .select('*')
      .eq('landing_page_id', currentPage.id)
      .eq('is_visible', true)
      .order('section_order', { ascending: true });

    if (sectionsError) {
      console.error('Error fetching landing sections:', sectionsError);
      return { page: currentPage, sections: [] };
    }

    return {
      page: currentPage,
      sections: (sectionsData as LandingSection[]) || [],
    };
  } catch (error) {
    console.error('Exception in getPublishedLandingPage:', error);
    return { page: null, sections: [] };
  }
}

/**
 * Get landing page for editing (admin only)
 */
export async function getAdminLandingPage(slug = 'home'): Promise<{
  page: LandingPage | null;
  sections: LandingSection[];
} | null> {
  const supabase = await getSupabaseAuthServerClient();

  if (!supabase) {
    return null;
  }

  try {
    // Get landing page (any status)
    const { data: pageData, error: pageError } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (pageError || !pageData) {
      console.error('Error fetching landing page for admin:', pageError);
      return null;
    }

    const currentPage = pageData as LandingPage;

    // Get all sections (including hidden ones)
    const { data: sectionsData, error: sectionsError } = await supabase
      .from('landing_sections')
      .select('*')
      .eq('landing_page_id', currentPage.id)
      .order('section_order', { ascending: true });

    if (sectionsError) {
      console.error('Error fetching landing sections for admin:', sectionsError);
      return { page: currentPage, sections: [] };
    }

    return {
      page: currentPage,
      sections: (sectionsData as LandingSection[]) || [],
    };
  } catch (error) {
    console.error('Exception in getAdminLandingPage:', error);
    return null;
  }
}

/**
 * Get landing page with fallback (preferred method)
 * Returns published sections, or fallback content if unavailable
 */
export async function getLandingPageWithFallback(slug = 'home'): Promise<{
  page: LandingPage | null;
  sections: LandingSection[];
  isFallback: boolean;
}> {
  const result = await getPublishedLandingPage(slug);

  // If we have published sections, return them
  if (result.page && result.sections.length > 0) {
    return {
      page: result.page,
      sections: result.sections,
      isFallback: false,
    };
  }

  // Return fallback content if database is unavailable
  return {
    page: null,
    sections: landingSectionsFallback as unknown as LandingSection[],
    isFallback: true,
  };
}

/**
 * Get single section content
 */
export async function getLandingSectionByKey(
  slug: string,
  sectionKey: string
): Promise<LandingSection | null> {
  const supabase = await getSupabaseAuthServerClient();

  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('landing_sections')
      .select(
        `
        *,
        landing_pages!inner(id, slug, is_published)
      `
      )
      .eq('landing_pages.slug', slug)
      .eq('section_key', sectionKey)
      .eq('is_visible', true)
      .eq('landing_pages.is_published', true)
      .single();

    if (error || !data) {
      return null;
    }

    return data as unknown as LandingSection;
  } catch (error) {
    console.error('Exception in getLandingSectionByKey:', error);
    return null;
  }
}
