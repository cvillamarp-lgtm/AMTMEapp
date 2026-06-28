import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdmin, updateSectionContent, recordContentHistory } from '@/lib/cms/queries';
import type { SiteSection } from '@/lib/cms/types';

export async function POST(req: NextRequest) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const body = await req.json();
  const sections: SiteSection[] = body.sections ?? [];

  const errors: string[] = [];
  for (const section of sections) {
    const { error } = await updateSectionContent(section.id, section.content);
    if (error) errors.push(`${section.section_key}: ${error}`);
    else await recordContentHistory('section', section.id, section.content, 'Editor save');
  }

  if (errors.length > 0) return NextResponse.json({ error: errors.join('; ') }, { status: 500 });
  return NextResponse.json({ ok: true });
}
