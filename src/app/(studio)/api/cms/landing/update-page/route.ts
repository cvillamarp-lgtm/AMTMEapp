import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { updateLandingPageSchema } from '@/lib/landing-cms/validation';
import { NextRequest, NextResponse } from 'next/server';

/**
 * PATCH /api/cms/landing/update-page
 * Update landing page metadata (title, description, publish status, SEO)
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

    // Check if user is CMS admin (call RLS function)
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
    const { slug = 'home', ...updateData } = body;

    // Validate update data
    const validated = updateLandingPageSchema.parse(updateData);

    // Prepare update
    const updatePayload = {
      ...validated,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    };

    // Update page
    const { data, error } = await supabase
      .from('landing_pages')
      .update(updatePayload)
      .eq('slug', slug)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating landing page:', error);
      return NextResponse.json({ error: 'Failed to update landing page' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Exception in PATCH /api/cms/landing/update-page:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
