import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { getAdminLandingPage } from '@/lib/landing-cms/queries';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/cms/landing/get-admin
 * Get landing page with all sections for editing (admin only)
 */
export async function GET(request: NextRequest) {
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

    // Get slug from query params
    const slug = request.nextUrl.searchParams.get('slug') || 'home';

    // Fetch admin landing page
    const result = await getAdminLandingPage(slug);

    if (!result) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Exception in GET /api/cms/landing/get-admin:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
