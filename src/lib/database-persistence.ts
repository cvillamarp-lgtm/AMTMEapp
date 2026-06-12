/**
 * database-persistence.ts — Core Supabase persistence layer
 * Provides generic CRUD helpers used by all entity-specific functions.
 * Schema: all tables use { id, user_id, payload jsonb, created_at, updated_at }
 */

import { getSupabaseAuthBrowserClient } from './supabase/auth-browser';

// FASE 8E — Auth required. Strict RLS on all tables. Only auth.uid() = user_id.
export async function getActiveUserId(): Promise<string | null> {
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

export function getClient() {
  // Supabase client types not fully exposed in auth browser module
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getSupabaseAuthBrowserClient() as any;
}

// FASE 8E: toRow requires active session userId. No session: fails safely.
export function toRow(payload: object, userId: string | null = null) {
  return { user_id: userId, payload };
}

// Supabase rows have dynamic schema (payload + direct columns merged dynamically)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromRow<T>(row: any): T {
  // If payload exists, merge it; otherwise use direct columns
  const base = {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id,
  };
  if (row.payload && typeof row.payload === 'object' && Object.keys(row.payload).length > 0) {
    return { ...base, ...row.payload } as T;
  }
  // Schema with direct columns — omit id/timestamps already included
  // Intentionally destructure system fields to exclude from rest spread

  const {
    id: _id,
    created_at: _ca,
    updated_at: _ua,
    user_id: _uid,
    owner_id: _oid,
    workspace_key: _wk,
    payload: _payload,
    ...rest
  } = row;
  return { ...base, ...rest } as T;
}

// FASE 8E: getAll filters only by user_id = auth.uid(). No session: returns empty.
export async function getAll<T>(table: string): Promise<T[]> {
  const sb = getClient();
  if (!sb) return [];
  const activeUserId = await getActiveUserId();
  if (!activeUserId) return [];
  const { data, error } = await sb
    .from(table)
    .select('*')
    .eq('user_id', activeUserId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  // Supabase query result rows have dynamic schema
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((r: any) => fromRow<T>(r));
}

// FASE 8E: insertOne uses session userId. No session: fails safely.
export async function insertOne<T>(table: string, payload: object): Promise<T> {
  const sb = getClient();
  if (!sb) throw new Error('Supabase no configurado');
  const activeUserId = await getActiveUserId();
  const { data, error } = await sb
    .from(table)
    .insert([toRow(payload, activeUserId)])
    .select()
    .single();
  if (error) throw error;
  return fromRow<T>(data);
}

export async function updateOne<T>(table: string, id: string, updates: object): Promise<T> {
  const sb = getClient();
  if (!sb) throw new Error('Supabase no configurado');
  // First fetch current payload to merge
  const { data: current, error: fetchError } = await sb
    .from(table)
    .select('payload')
    .eq('id', id)
    .single();
  if (fetchError) throw fetchError;
  const merged = { ...(current?.payload || {}), ...updates };
  const { data, error } = await sb
    .from(table)
    .update({ payload: merged, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return fromRow<T>(data);
}

export async function deleteOne(table: string, id: string): Promise<void> {
  const sb = getClient();
  if (!sb) throw new Error('Supabase no configurado');
  const { error } = await sb.from(table).delete().eq('id', id);
  if (error) throw error;
}
