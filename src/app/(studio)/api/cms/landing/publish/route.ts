import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/cms/landing/publish
 * Publish a landing page (mark as_published = true)
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
    const { slug = 'home' } = body;

    // Publish page
    const { data, error } = await supabase
      .from('landing_pages')
      .update({
        is_published: true,
        published_at: new Date().toISOString(),
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
      .select('*')
      .single();

    if (error) {
      console.error('Error publishing landing page:', error);
      return NextResponse.json({ error: 'Failed to publish landing page' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Exception in POST /api/cms/landing/publish:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
