import { NextResponse } from 'next/server';
import { loadHistoryEntries } from '@/lib/ai-editor/historyPersistence';

export async function GET() {
  const result = await loadHistoryEntries();

  return NextResponse.json({
    success: true,
    entries: result.entries,
    persistenceType: result.persistenceType,
    persistenceSource: result.source,
    persistenceReason: result.reason,
  });
}
