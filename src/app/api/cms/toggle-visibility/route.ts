import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdmin, toggleSectionVisibility } from '@/lib/cms/queries';
export async function POST(req: NextRequest) {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    const { sectionId, isVisible } = await req.json();
    if (!sectionId) return NextResponse.json({ error: 'sectionId required' }, { status: 400 });
    const { error } = await toggleSectionVisibility(sectionId, isVisible);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ ok: true });
  }
