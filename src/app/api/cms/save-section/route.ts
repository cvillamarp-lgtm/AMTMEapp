import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAuthServerClient } from '@/lib/supabase/auth-server';
import { saveSectionDraft, checkIsCMSAdmin } from '@/lib/cms/queries';
import { validateSectionKey, validateSectionPayload } from '@/lib/cms/validation';

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
    const { sectionKey, payload } = body;

    // Validate section key
    if (!validateSectionKey(sectionKey)) {
      return NextResponse.json({ success: false, error: 'Invalid section key' }, { status: 400 });
    }

    // Validate payload
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    if (!validateSectionPayload(sectionKey, payload)) {
      return NextResponse.json(
        { success: false, error: 'Payload missing required fields' },
        { status: 400 }
      );
    }

    // Save
    const result = await saveSectionDraft(sectionKey, payload);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[/api/cms/save-section] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
