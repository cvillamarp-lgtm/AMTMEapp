/**
 * database.ts — Capa de acceso a Supabase para AMTMEapp
 * Schema: todas las tablas usan { id, owner_id, workspace_key, payload jsonb, created_at, updated_at }
 * Los campos de negocio van dentro de payload.
 */

import { getSupabaseAuthBrowserClient } from './supabase/auth-browser';
import type {
  Episode,
  ContentPiece,
  MetricMonthly,
  MonetizationLead,
  Checklist,
  CalendarEvent,
  Script,
  VisualAsset,
  AutomationRule,
} from '@/types/database';

const OWNER_ID = 'public';
const WORKSPACE = 'primary';

// FASE 8C.1 — Compatibilidad de lectura dual
// Permite leer datos con user_id IS NULL (pre-migración)
// y user_id = CHRISTIAN_UUID (post-migración) simultáneamente.
// Retirar CHRISTIAN_UUID y CHRISTIAN_UUID_FILTER en FASE 8E cuando RLS esté activa.
const CHRISTIAN_UUID = 'c5b87e86-8520-42a1-b9b4-48f8315a147a';
const CHRISTIAN_UUID_FILTER = `user_id.is.null,user_id.eq.${CHRISTIAN_UUID}`;

// FASE 8D — Helper de sesión real controlada
// Intenta obtener el user_id de la sesión activa de Supabase Auth.
// Si no hay sesión (modo público), devuelve null → compatibilidad dual se mantiene.
// No rompe producción sin login. No requiere NEXT_PUBLIC_REQUIRE_AUTH.
async function getActiveUserId(): Promise<string | null> {
  try {
    const authClient = getSupabaseAuthBrowserClient();
    if (!authClient) return null;
    const { data: { session } } = await authClient.auth.getSession();
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

function getClient() {
  return getSupabaseAuthBrowserClient() as any;
}

// ---- helpers ----

// FASE 8D: toRow acepta userId opcional.
// Si hay sesión activa, user_id = UUID real.
// Si no hay sesión, user_id = null → compatibilidad dual activa.
function toRow(payload: object, userId: string | null = null) {
  return { user_id: userId, payload };
}

function fromRow<T>(row: any): T {
  // Si tiene payload jsonb, expandirlo; si no, usar las columnas directas
  const base = {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id,
  };
  if (row.payload && typeof row.payload === 'object' && Object.keys(row.payload).length > 0) {
    return { ...base, ...row.payload } as T;
  }
  // Schema con columnas directas — omitir id/timestamps ya incluidos
  const { id, created_at, updated_at, user_id, owner_id, workspace_key, payload, ...rest } = row;
  return { ...base, ...rest } as T;
}

// FASE 8D: getAll usa sesión real si existe; si no, mantiene compatibilidad dual.
// Con sesión → filtra por user_id = UUID real del usuario autenticado.
// Sin sesión → filtra por CHRISTIAN_UUID_FILTER (dual: null OR uuid fijo).
async function getAll<T>(table: string): Promise<T[]> {
  const sb = getClient();
  if (!sb) return [];
  const activeUserId = await getActiveUserId();
  const filter = activeUserId
    ? `user_id.eq.${activeUserId}`
    : CHRISTIAN_UUID_FILTER;
  const { data, error } = await sb
    .from(table)
    .select('*')
    .or(filter)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((r: any) => fromRow<T>(r));
}

// FASE 8D: insertOne usa user_id real si hay sesión; null si no.
async function insertOne<T>(table: string, payload: object): Promise<T> {
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

async function updateOne<T>(table: string, id: string, updates: object): Promise<T> {
  const sb = getClient();
  if (!sb) throw new Error('Supabase no configurado');
  // Primero obtenemos el payload actual para hacer merge
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

async function deleteOne(table: string, id: string): Promise<void> {
  const sb = getClient();
  if (!sb) throw new Error('Supabase no configurado');
  const { error } = await sb.from(table).delete().eq('id', id);
  if (error) throw error;
}

// ---- EPISODES ----
export async function getEpisodes(): Promise<Episode[]> {
  return getAll<Episode>('episodes');
}
export async function createEpisode(
  ep: Omit<Episode, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<Episode> {
  return insertOne<Episode>('episodes', ep);
}
export async function updateEpisode(id: string, updates: Partial<Episode>): Promise<Episode> {
  return updateOne<Episode>('episodes', id, updates);
}
export async function deleteEpisode(id: string): Promise<void> {
  return deleteOne('episodes', id);
}

// ---- CONTENT PIECES ----
export async function getContentPieces(): Promise<ContentPiece[]> {
  return getAll<ContentPiece>('content_pieces');
}
export async function createContentPiece(
  c: Omit<ContentPiece, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<ContentPiece> {
  return insertOne<ContentPiece>('content_pieces', c);
}
export async function updateContentPiece(
  id: string,
  updates: Partial<ContentPiece>
): Promise<ContentPiece> {
  return updateOne<ContentPiece>('content_pieces', id, updates);
}
export async function deleteContentPiece(id: string): Promise<void> {
  return deleteOne('content_pieces', id);
}

// ---- METRICS MONTHLY ----
export async function getMetricsMonthly(): Promise<MetricMonthly[]> {
  return getAll<MetricMonthly>('metrics_monthly');
}
export async function createMetricMonthly(
  m: Omit<MetricMonthly, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<MetricMonthly> {
  return insertOne<MetricMonthly>('metrics_monthly', m);
}

// ---- MONETIZATION LEADS ----
export async function getMonetizationLeads(): Promise<MonetizationLead[]> {
  return getAll<MonetizationLead>('monetization_leads');
}
export async function createMonetizationLead(
  l: Omit<MonetizationLead, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<MonetizationLead> {
  return insertOne<MonetizationLead>('monetization_leads', l);
}
export async function updateMonetizationLead(
  id: string,
  updates: Partial<MonetizationLead>
): Promise<MonetizationLead> {
  return updateOne<MonetizationLead>('monetization_leads', id, updates);
}

// ---- CHECKLISTS ----
export async function getChecklists(): Promise<Checklist[]> {
  return getAll<Checklist>('checklists');
}
export async function createChecklist(
  c: Omit<Checklist, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<Checklist> {
  return insertOne<Checklist>('checklists', c);
}
export async function updateChecklist(id: string, updates: Partial<Checklist>): Promise<Checklist> {
  return updateOne<Checklist>('checklists', id, updates);
}
export async function deleteChecklist(id: string): Promise<void> {
  return deleteOne('checklists', id);
}

// ---- CALENDAR EVENTS ----
export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const sb = getClient();
  if (!sb) return [];
  const activeUserId = await getActiveUserId();
  const filter = activeUserId
    ? `user_id.eq.${activeUserId}`
    : CHRISTIAN_UUID_FILTER;
  const { data, error } = await sb
    .from('calendar_events')
    .select('*')
    .or(filter)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map((r: any) => fromRow<CalendarEvent>(r));
}
export async function createCalendarEvent(
  e: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<CalendarEvent> {
  return insertOne<CalendarEvent>('calendar_events', e);
}
export async function updateCalendarEvent(
  id: string,
  updates: Partial<CalendarEvent>
): Promise<CalendarEvent> {
  return updateOne<CalendarEvent>('calendar_events', id, updates);
}
export async function deleteCalendarEvent(id: string): Promise<void> {
  return deleteOne('calendar_events', id);
}

// ---- SCRIPTS ----
// Scripts en Supabase usan columnas directas (no payload jsonb)
export async function getScripts(): Promise<Script[]> {
  const sb = getClient();
  if (!sb) return [];
  const activeUserId = await getActiveUserId();
  const filter = activeUserId
    ? `user_id.eq.${activeUserId}`
    : CHRISTIAN_UUID_FILTER;
  const { data, error } = await sb
    .from('scripts')
    .select('*')
    .or(filter)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((r: any) => {
    if (r.payload && typeof r.payload === 'object') return fromRow<Script>(r);
    return { ...r } as Script;
  });
}
export async function createScript(
  s: Omit<Script, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'version'>
): Promise<Script> {
  const sb = getClient();
  if (!sb) throw new Error('Supabase no configurado');
  const activeUserId = await getActiveUserId();
  const { data, error } = await sb
    .from('scripts')
    .insert([
      {
        user_id: activeUserId,
        episode_id: (s as any).episode_id,
        title: (s as any).title,
        status: (s as any).status || 'borrador',
        version: 1,
        opening: (s as any).opening || null,
        threshold: (s as any).threshold || null,
        wound: (s as any).wound || null,
        symbol: (s as any).symbol || null,
        truth: (s as any).truth || null,
        bridge: (s as any).bridge || null,
        action: (s as any).action || null,
        closing: (s as any).closing || null,
        cta: (s as any).cta || null,
        voice_notes: (s as any).voice_notes || null,
      },
    ])
    .select()
    .single();
  if (!error) return data as Script;
  // Fallback: payload jsonb
  return insertOne<Script>('scripts', { ...s, version: 1 });
}
export async function updateScript(id: string, updates: Partial<Script>): Promise<Script> {
  const sb = getClient();
  if (!sb) throw new Error('Supabase no configurado');
  const { data, error } = await sb
    .from('scripts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Script;
}
export async function deleteScript(id: string): Promise<void> {
  return deleteOne('scripts', id);
}

// ---- VISUAL ASSETS ----
export async function getVisualAssets(): Promise<VisualAsset[]> {
  return getAll<VisualAsset>('visual_assets');
}

// ---- AUTOMATION RULES ----
export async function getAutomationRules(): Promise<AutomationRule[]> {
  return getAll<AutomationRule>('automation_rules');
}
export async function createAutomationRule(
  r: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<AutomationRule> {
  return insertOne<AutomationRule>('automation_rules', r);
}
export async function updateAutomationRule(
  id: string,
  updates: Partial<AutomationRule>
): Promise<AutomationRule> {
  return updateOne<AutomationRule>('automation_rules', id, updates);
}
export async function deleteAutomationRule(id: string): Promise<void> {
  return deleteOne('automation_rules', id);
}

// ---- ARCHIVE ITEMS ----
export async function getArchiveItems(): Promise<any[]> {
  return getAll<any>('archive_items');
}
export async function createArchiveItem(item: object): Promise<any> {
  return insertOne<any>('archive_items', item);
}
export async function updateArchiveItem(id: string, updates: object): Promise<any> {
  return updateOne<any>('archive_items', id, updates);
}
export async function deleteArchiveItem(id: string): Promise<void> {
  return deleteOne('archive_items', id);
}

// ---- METRICS EPISODE ----
export async function getMetricsEpisode(): Promise<import('@/types/database').MetricEpisode[]> {
  return getAll<import('@/types/database').MetricEpisode>('metrics_episode');
}
export async function getMetricsEpisodeByEpisode(
  episodeId: string
): Promise<import('@/types/database').MetricEpisode | null> {
  const sb = getClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from('metrics_episode')
    .select('*')
    .eq('payload->>episode_id', episodeId)
    .limit(1)
    .maybeSingle();
  if (error) return null;
  if (!data) return null;
  return fromRow<import('@/types/database').MetricEpisode>(data);
}
export async function createMetricEpisode(
  m: Omit<import('@/types/database').MetricEpisode, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<import('@/types/database').MetricEpisode> {
  return insertOne<import('@/types/database').MetricEpisode>('metrics_episode', m);
}
export async function updateMetricEpisode(
  id: string,
  updates: Partial<import('@/types/database').MetricEpisode>
): Promise<import('@/types/database').MetricEpisode> {
  return updateOne<import('@/types/database').MetricEpisode>('metrics_episode', id, updates);
}

// ---- MASTER SECTIONS ----
export async function getMasterSections(): Promise<any[]> {
  return getAll<any>('master_sections');
}
export async function createMasterSection(section: object): Promise<any> {
  return insertOne<any>('master_sections', section);
}
export async function updateMasterSection(id: string, updates: object): Promise<any> {
  return updateOne<any>('master_sections', id, updates);
}
export async function deleteMasterSection(id: string): Promise<void> {
  return deleteOne('master_sections', id);
}
