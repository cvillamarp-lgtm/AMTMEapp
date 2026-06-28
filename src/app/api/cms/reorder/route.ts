import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdmin, reorderSections } from '@/lib/cms/queries';
export async function POST(req: NextRequest) {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    const { updates } = await req.json();
    if (!Array.isArray(updates)) return NextResponse.json({ error: 'updates array required' }, { status: 400 });
    const { error } = await reorderSections(updates);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ ok: true });
  }
