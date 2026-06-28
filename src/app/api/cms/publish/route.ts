import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdmin, setPagePublished } from '@/lib/cms/queries';
export async function POST(req: NextRequest) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const { pageId, publish } = await req.json();
  if (!pageId) return NextResponse.json({ error: 'pageId required' }, { status: 400 });
  const { error } = await setPagePublished(pageId, publish);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true, published: publish });
}
