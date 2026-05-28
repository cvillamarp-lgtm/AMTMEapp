import { addChangeLogEntry, getChangeLog } from './changeLog';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import type { ChangeHistoryEntry } from './types';
import { ChangeHistoryEntrySchema } from './types';
import type { Json } from '@/lib/supabase/database.types';

const AI_HISTORY_OWNER_ID = process.env.AI_EDITOR_HISTORY_OWNER_ID ?? 'ai-editor';
const AI_HISTORY_WORKSPACE = process.env.AI_EDITOR_HISTORY_WORKSPACE_KEY ?? 'editor-ia';

type PersistenceResult = {
  persistenceType: 'persistent' | 'session';
  source: 'supabase' | 'memory';
  reason?: string;
};

export async function saveHistoryEntry(entry: ChangeHistoryEntry): Promise<PersistenceResult> {
  addChangeLogEntry(entry);
  const client = getSupabaseServiceRoleClient();

  if (!client) {
    return {
      persistenceType: 'session',
      source: 'memory',
      reason: 'Supabase no configurado. Se mantiene historial de sesión.',
    };
  }

  const { error } = await client.from('ai_history').insert({
    owner_id: AI_HISTORY_OWNER_ID,
    workspace_key: AI_HISTORY_WORKSPACE,
    payload: entry as unknown as Json,
  });

  if (error) {
    return {
      persistenceType: 'session',
      source: 'memory',
      reason: `No se pudo persistir en Supabase: ${error.message}`,
    };
  }

  return {
    persistenceType: 'persistent',
    source: 'supabase',
  };
}

export async function loadHistoryEntries(limit = 50): Promise<{
  entries: ChangeHistoryEntry[];
  persistenceType: 'persistent' | 'session';
  source: 'supabase' | 'memory';
  reason?: string;
}> {
  const client = getSupabaseServiceRoleClient();

  if (!client) {
    return {
      entries: getChangeLog(),
      persistenceType: 'session',
      source: 'memory',
      reason: 'Supabase no configurado. Historial cargado desde memoria de sesión.',
    };
  }

  const { data, error } = await client
    .from('ai_history')
    .select('payload, created_at')
    .eq('owner_id', AI_HISTORY_OWNER_ID)
    .eq('workspace_key', AI_HISTORY_WORKSPACE)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return {
      entries: getChangeLog(),
      persistenceType: 'session',
      source: 'memory',
      reason: `Error leyendo Supabase: ${error.message}`,
    };
  }

  const parsedEntries: ChangeHistoryEntry[] = [];
  for (const row of data ?? []) {
    const parsed = ChangeHistoryEntrySchema.safeParse(row.payload);
    if (parsed.success) {
      parsedEntries.push(parsed.data);
    }
  }

  return {
    entries: parsedEntries,
    persistenceType: 'persistent',
    source: 'supabase',
  };
}
