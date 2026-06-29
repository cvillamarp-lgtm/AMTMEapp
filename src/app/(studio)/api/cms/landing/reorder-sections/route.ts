import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * POST /api/cms/landing/reorder-sections
 * Reorder landing sections by updating section_order
 * Admin only
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceRoleClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Verify admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is CMS admin
    const { data: adminCheck, error: adminError } = await supabase
      .from('cms_admins')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminCheck) {
      return NextResponse.json({ error: 'Forbidden: Not a CMS admin' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { slug = 'home', sections } = body;

    // Validate sections format
    const sectionsSchema = z.array(
      z.object({
        sectionKey: z.string(),
        order: z.number().int().min(0),
      })
    );

    const validatedSections = sectionsSchema.parse(sections);

    // Get landing page ID
    const { data: pageData, error: pageError } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('slug', slug)
      .single();

    if (pageError || !pageData) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }

    // Update all sections with new order
    const updates = validatedSections.map((section) =>
      supabase
        .from('landing_sections')
        .update({
          section_order: section.order,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('landing_page_id', pageData.id)
        .eq('section_key', section.sectionKey)
    );

    const results = await Promise.all(updates);

    // Check for errors
    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      console.error('Errors reordering sections:', errors);
      return NextResponse.json({ error: 'Failed to reorder sections' }, { status: 500 });
    }

    // Get updated sections
    const { data: updatedSections, error: fetchError } = await supabase
      .from('landing_sections')
      .select('*')
      .eq('landing_page_id', pageData.id)
      .order('section_order', { ascending: true });

    if (fetchError) {
      console.error('Error fetching updated sections:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch updated sections' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedSections });
  } catch (error) {
    console.error('Exception in POST /api/cms/landing/reorder-sections:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
