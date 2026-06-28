───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────// CMS data access functions for AMTME Landing
import { getSupabaseAuthServerClient } from '@/lib/supabase/auth-server';
import type { SitePage, SiteSection, SiteSetting } from './types';

export async function getPublishedLandingPage(): Promise<{ page: SitePage | null; sections: SiteSection[] }> {
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) return { page: null, sections: [] };
  const { data: page } = await supabase.from('site_pages').select('*').eq('slug', 'landing').eq('is_published', true).single();
  if (!page) return { page: null, sections: [] };
  const { data: sections } = await supabase.from('site_sections').select('*').eq('page_id', page.id).eq('is_visible', true).order('sort_order', { ascending: true });
  return { page: page as SitePage, sections: (sections ?? []) as SiteSection[] };
}

export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) return null;
  const { data } = await supabase.from('site_settings').select('*').eq('key', key).single();
  return data as SiteSetting | null;
}

export async function getAdminLandingPage(): Promise<{ page: SitePage | null; sections: SiteSection[] }> {
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) return { page: null, sections: [] };
  const { data: page } = await supabase.from('site_pages').select('*').eq('slug', 'landing').single();
  if (!page) return { page: null, sections: [] };
  const { data: sections } = await supabase.from('site_sections').select('*').eq('page_id', page.id).order('sort_order', { ascending: true });
  return { page: page as SitePage, sections: (sections ?? []) as SiteSection[] };
}

export async function updateSectionContent(sectionId: string, content: Record<string, unknown>): Promise<{ error: string | null }> {
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) return { error: 'Not authenticated' };
  const { error } = await supabase.from('site_sections').update({ content, updated_at: new Date().toISOString() }).eq('id', sectionId);
  return { error: error?.message ?? null };
}

export async function toggleSectionVisibility(sectionId: string, isVisible: boolean): Promise<{ error: string | null }> {
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) return { error: 'Not authenticated' };
  const { error } = await supabase.from('site_sections').update({ is_visible: isVisible, updated_at: new Date().toISOString() }).eq('id', sectionId);
  return { error: error?.message ?? null };
}

export async function reorderSections(updates: Array<{ id: string; sort_order: number }>): Promise<{ error: string | null }> {
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) return { error: 'Not authenticated' };
  for (const update of updates) {
    const { error } = await supabase.from('site_sections').update({ sort_order: update.sort_order, updated_at: new Date().toISOString() }).eq('id', update.id);
    if (error) return { error: error.message };
  }
  return { error: null };
}

export async function setPagePublished(pageId: string, isPublished: boolean): Promise<{ error: string | null }> {
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) return { error: 'Not authenticated' };
  const { error } = await supabase.from('site_pages').update({ is_published: isPublished, updated_at: new Date().toISOString() }).eq('id', pageId);
  return { error: error?.message ?? null };
}

export async function updatePageSeo(pageId: string, seoMetadata: Record<string, unknown>): Promise<{ error: string | null }> {
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) return { error: 'Not authenticated' };
  const { error } = await supabase.from('site_pages').update({ seo_metadata: seoMetadata, updated_at: new Date().toISOString() }).eq('id', pageId);
  return { error: error?.message ?? null };
}

export async function checkIsAdmin(): Promise<boolean> {
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) return false;
  const { data, error } = await supabase.rpc('is_cms_admin');
  if (error) return false;
  return data === true;
}

export async function recordContentHistory(entityType: 'page' | 'section' | 'block' | 'setting', entityId: string, snapshot: Record<string, unknown>, changeNote?: string): Promise<void> {
  const supabase = await getSupabaseAuthServerClient();
  if (!supabase) return;
  await supabase.from('site_content_history').insert({ entity_type: entityType, entity_id: entityId, snapshot, change_note: changeNote ?? null });
}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
