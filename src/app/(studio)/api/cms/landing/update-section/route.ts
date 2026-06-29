import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { updateLandingSectionSchema, validateSectionContent } from '@/lib/landing-cms/validation';
import type { LandingSectionKey } from '@/types/database';
import { NextRequest, NextResponse } from 'next/server';

/**
 * PATCH /api/cms/landing/update-section
 * Update a single landing section (content, visibility, order)
 * Admin only
 */
export async function PATCH(request: NextRequest) {
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
    const { slug = 'home', sectionKey, ...updateData } = body;

    if (!sectionKey) {
      return NextResponse.json({ error: 'Missing sectionKey' }, { status: 400 });
    }

    // Validate update data
    const validated = updateLandingSectionSchema.parse(updateData);

    // If content is provided, validate it against section schema
    if (validated.content) {
      validated.content = validateSectionContent(
        sectionKey as LandingSectionKey,
        validated.content
      );
    }

    // Get landing page ID
    const { data: pageData, error: pageError } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('slug', slug)
      .single();

    if (pageError || !pageData) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }

    // Prepare update - build only the fields that are provided
    const updateFields: Record<string, unknown> = {
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    if (validated.section_order !== undefined) {
      updateFields.section_order = validated.section_order;
    }
    if (validated.is_visible !== undefined) {
      updateFields.is_visible = validated.is_visible;
    }
    if (validated.content !== undefined) {
      updateFields.content = validated.content;
    }

    // Update section - use type assertion due to Supabase strict typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateResult = await supabase
      .from('landing_sections')
      .update(updateFields as any)
      .eq('landing_page_id', pageData.id)
      .eq('section_key', sectionKey)
      .select('*')
      .single();

    const { data, error } = updateResult;

    if (error) {
      console.error('Error updating landing section:', error);
      return NextResponse.json({ error: 'Failed to update landing section' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Exception in PATCH /api/cms/landing/update-section:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
