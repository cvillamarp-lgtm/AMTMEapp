/**
 * Metrics persistence layer for DecisionNotes and AIReports
 * Manages per-user storage in Supabase with localStorage fallback
 * Handles idempotent migration from localStorage to Supabase
 */

import { getSupabaseAuthBrowserClient } from './supabase/auth-browser';

export type MetricNoteKind = 'decision_note' | 'ai_report';

export type MetricNoteRecord = {
  id: string;
  user_id: string;
  kind: MetricNoteKind;
  item_key: string;
  month_key: string | null;
  payload: unknown;
  created_at: string;
  updated_at: string;
};

type UpsertInput = {
  kind: MetricNoteKind;
  item_key: string;
  month_key?: string | null;
  payload: unknown;
};

/**
 * Get authenticated user ID from browser session
 * Used for all frontend persistence operations
 */
async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const authClient = getSupabaseAuthBrowserClient();
    if (!authClient) return null;
    const {
      data: { session },
    } = await authClient.auth.getSession();
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Get metric notes from Supabase, filtered by kind if provided
 */
export async function getMetricNotes(kind?: MetricNoteKind): Promise<MetricNoteRecord[]> {
  const client = getSupabaseAuthBrowserClient();
  if (!client) {
    // Fallback: return empty array (will load from localStorage if needed)
    return [];
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return [];
  }

  try {
    let query = client.from('metrics_notes').select('*').eq('user_id', userId);

    if (kind) {
      query = query.eq('kind', kind);
    }

    const { data, error } = await query.order('updated_at', { ascending: false });

    if (error) {
      console.error('[metrics-persistence] Error fetching notes:', error);
      return [];
    }

    return (data as MetricNoteRecord[]) || [];
  } catch (err) {
    console.error('[metrics-persistence] Unexpected error fetching notes:', err);
    return [];
  }
}

/**
 * Upsert a single metric note (insert or update based on unique constraint)
 * Uses unique(user_id, kind, item_key) to prevent duplicates
 */
export async function upsertMetricNote(input: UpsertInput): Promise<MetricNoteRecord | null> {
  const client = getSupabaseAuthBrowserClient();
  if (!client) {
    console.warn('[metrics-persistence] Supabase not configured, cannot persist');
    return null;
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    console.warn('[metrics-persistence] User not authenticated, cannot persist');
    return null;
  }

  try {
    const { data, error } = await client
      .from('metrics_notes')
      .upsert(
        {
          user_id: userId,
          kind: input.kind,
          item_key: input.item_key,
          month_key: input.month_key ?? null,
          payload: input.payload,
        } as any,
        { onConflict: 'user_id,kind,item_key' }
      )
      .select()
      .single();

    if (error) {
      console.error('[metrics-persistence] Error upserting note:', error);
      return null;
    }

    return (data as MetricNoteRecord) || null;
  } catch (err) {
    console.error('[metrics-persistence] Unexpected error upserting note:', err);
    return null;
  }
}

/**
 * Delete a single metric note by kind and item_key
 */
export async function deleteMetricNote(kind: MetricNoteKind, itemKey: string): Promise<boolean> {
  const client = getSupabaseAuthBrowserClient();
  if (!client) {
    console.warn('[metrics-persistence] Supabase not configured, cannot delete');
    return false;
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    console.warn('[metrics-persistence] User not authenticated, cannot delete');
    return false;
  }

  try {
    const { error } = await client
      .from('metrics_notes')
      .delete()
      .eq('user_id', userId)
      .eq('kind', kind)
      .eq('item_key', itemKey);

    if (error) {
      console.error('[metrics-persistence] Error deleting note:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[metrics-persistence] Unexpected error deleting note:', err);
    return false;
  }
}

/**
 * Migrate metrics from localStorage to Supabase (idempotent)
 * Called once per session to move DecisionNotes and AIReports to persistent storage
 * Preserves original localStorage data to prevent data loss
 */
export async function migrateMetricsLocalStorageToSupabase(): Promise<{
  decisionNotesMigrated: number;
  reportsMigrated: number;
  errors: string[];
}> {
  const client = getSupabaseAuthBrowserClient();
  const userId = await getAuthenticatedUserId();

  const result = { decisionNotesMigrated: 0, reportsMigrated: 0, errors: [] as string[] };

  // Check if already migrated in this session
  const migrationKey = 'amtme-metrics-migrated-to-supabase-v1';
  if (sessionStorage.getItem(migrationKey)) {
    // Already migrated this session
    return result;
  }

  // Only proceed if Supabase is available and user is authenticated
  if (!client || !userId) {
    return result;
  }

  try {
    // 1. Migrate DecisionNotes
    const decisionKey = 'amtme-decision-notes';
    const decisionData = localStorage.getItem(decisionKey);

    if (decisionData) {
      try {
        const parsed = JSON.parse(decisionData);
        if (parsed && typeof parsed === 'object') {
          // Create stable item_key from content
          const itemKey = `decision_note_${parsed.updated_at || new Date().toISOString()}`;

          const record = await upsertMetricNote({
            kind: 'decision_note',
            item_key: itemKey,
            month_key: null,
            payload: parsed,
          });

          if (record) {
            result.decisionNotesMigrated++;
          }
        }
      } catch (err) {
        result.errors.push(
          `Failed to parse decision notes: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    // 2. Migrate AIReports
    const reportsKey = 'amtme-metric-reports';
    const reportsData = localStorage.getItem(reportsKey);

    if (reportsData) {
      try {
        const parsed = JSON.parse(reportsData);
        if (Array.isArray(parsed)) {
          for (const report of parsed) {
            if (report && typeof report === 'object' && report.id) {
              const monthKey = report.month ?? null;
              const record = await upsertMetricNote({
                kind: 'ai_report',
                item_key: report.id,
                month_key: monthKey,
                payload: report,
              });

              if (record) {
                result.reportsMigrated++;
              }
            }
          }
        }
      } catch (err) {
        result.errors.push(
          `Failed to parse reports: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    // Mark migration as complete in session storage
    // localStorage keys are NOT deleted to preserve data
    sessionStorage.setItem(migrationKey, JSON.stringify({ timestamp: new Date().toISOString() }));
  } catch (err) {
    result.errors.push(
      `Unexpected error during migration: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  return result;
}

/**
 * Get DecisionNote from Supabase or localStorage (fallback)
 * Returns the most recent decision note
 */
export async function getDecisionNote(): Promise<{
  source: 'supabase' | 'localStorage' | 'none';
  data: Record<string, unknown> | null;
}> {
  // Try Supabase first
  const notes = await getMetricNotes('decision_note');
  if (notes.length > 0) {
    return { source: 'supabase', data: notes[0].payload as Record<string, unknown> };
  }

  // Fallback to localStorage
  const localKey = 'amtme-decision-notes';
  const localData = localStorage.getItem(localKey);
  if (localData) {
    try {
      return { source: 'localStorage', data: JSON.parse(localData) };
    } catch {
      return { source: 'localStorage', data: null };
    }
  }

  return { source: 'none', data: null };
}

/**
 * Save DecisionNote to Supabase and localStorage
 * Ensures data persists even if one storage fails
 */
export async function saveDecisionNote(note: Record<string, unknown>): Promise<{
  supabase: boolean;
  localStorage: boolean;
}> {
  const result = { supabase: false, localStorage: false };

  // Always save to localStorage for fallback
  try {
    localStorage.setItem('amtme-decision-notes', JSON.stringify(note));
    result.localStorage = true;
  } catch (err) {
    console.error('[metrics-persistence] Failed to save to localStorage:', err);
  }

  // Try to save to Supabase
  const userId = await getAuthenticatedUserId();
  if (userId) {
    const record = await upsertMetricNote({
      kind: 'decision_note',
      item_key: `decision_note_${new Date().toISOString()}`,
      month_key: null,
      payload: note,
    });

    if (record) {
      result.supabase = true;
    }
  }

  return result;
}

/**
 * Get AIReports from Supabase or localStorage (fallback)
 */
export async function getAIReports(): Promise<{
  source: 'supabase' | 'localStorage' | 'none';
  data: Record<string, unknown>[];
}> {
  // Try Supabase first
  const notes = await getMetricNotes('ai_report');
  if (notes.length > 0) {
    return {
      source: 'supabase',
      data: notes.map((n) => n.payload as Record<string, unknown>),
    };
  }

  // Fallback to localStorage
  const localKey = 'amtme-metric-reports';
  const localData = localStorage.getItem(localKey);
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      return { source: 'localStorage', data: Array.isArray(parsed) ? parsed : [] };
    } catch {
      return { source: 'localStorage', data: [] };
    }
  }

  return { source: 'none', data: [] };
}

/**
 * Save AIReports to Supabase and localStorage
 * Ensures data persists even if one storage fails
 */
export async function saveAIReports(reports: Record<string, unknown>[]): Promise<{
  supabase: number;
  localStorage: boolean;
}> {
  const result = { supabase: 0, localStorage: false };

  // Always save to localStorage for fallback
  try {
    localStorage.setItem('amtme-metric-reports', JSON.stringify(reports));
    result.localStorage = true;
  } catch (err) {
    console.error('[metrics-persistence] Failed to save reports to localStorage:', err);
  }

  // Try to save each report to Supabase
  const userId = await getAuthenticatedUserId();
  if (userId) {
    for (const report of reports) {
      if (report && typeof report === 'object' && 'id' in report) {
        const record = await upsertMetricNote({
          kind: 'ai_report',
          item_key: String(report.id),
          month_key: report.month ? String(report.month) : null,
          payload: report,
        });

        if (record) {
          result.supabase++;
        }
      }
    }
  }

  return result;
}
