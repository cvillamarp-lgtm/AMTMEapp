import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAuthServerClient } from '@/lib/supabase/auth-server';
import { reorderSections, checkIsCMSAdmin } from '@/lib/cms/queries';
import { validateSectionReorder } from '@/lib/cms/validation';

export async function POST(request: NextRequest) {
  try {
    // Validate session
    const supabase = await getSupabaseAuthServerClient();

    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Service unavailable' }, { status: 503 });
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Validate admin
    const isAdmin = await checkIsCMSAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: admin access required' },
        { status: 403 }
      );
    }

    // Parse body
    const body = await request.json();
    const { sectionKeys } = body;

    // Validate
    if (!Array.isArray(sectionKeys)) {
      return NextResponse.json({ success: false, error: 'Invalid sectionKeys' }, { status: 400 });
    }

    if (!validateSectionReorder(sectionKeys)) {
      return NextResponse.json(
        { success: false, error: 'Must reorder exactly 10 valid sections' },
        { status: 400 }
      );
    }

    // Reorder
    const result = await reorderSections(sectionKeys);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[/api/cms/reorder] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
