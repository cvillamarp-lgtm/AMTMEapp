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
  Idea,
  SpotifyMetricImport,
  SpotifyEpisodeMetric,
  SpotifyDailyMetric,
  SpotifyDistributionMetric,
  AmtmeManualMetric,
  PodcastStrategySnapshot,
} from '@/types/database';

// FASE 8E — Auth obligatoria. RLS estricta en 15 tablas. Solo auth.uid() = user_id.
async function getActiveUserId(): Promise<string | null> {
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

function getClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any — Supabase client types not fully exposed in auth browser module
  return getSupabaseAuthBrowserClient() as any;
}

// ---- helpers ----

// FASE 8E: toRow requiere userId de sesión activa. Sin sesión: falla seguro.
function toRow(payload: object, userId: string | null = null) {
  return { user_id: userId, payload };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any — Supabase rows have dynamic schema (payload + direct columns merged dynamically)
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars — Intentionally destructure system fields to exclude from rest spread
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

// FASE 8E: getAll filtra solo por user_id = auth.uid(). Sin sesión: devuelve vacío.
async function getAll<T>(table: string): Promise<T[]> {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any — Supabase query result rows have dynamic schema
  return (data || []).map((r: any) => fromRow<T>(r));
}

// FASE 8E: insertOne usa user_id de sesión activa. Sin sesión: falla seguro.
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

export async function getEpisodeById(id: string): Promise<Episode | null> {
  const all = await getEpisodes();
  return all.find((e) => e.id === id) ?? null;
}

export async function getScriptsByEpisode(episodeId: string): Promise<Script[]> {
  const sb = getClient();
  if (!sb) return [];
  const activeUserId = await getActiveUserId();
  if (!activeUserId) return [];
  const { data, error } = await sb
    .from('scripts')
    .select('*')
    .eq('user_id', activeUserId)
    .eq('episode_id', episodeId)
    .order('created_at', { ascending: false });
  if (error) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((r: any) => {
    if (r.payload && typeof r.payload === 'object') return fromRow<Script>(r);
    return { ...r } as Script;
  });
}

export async function getContentPiecesByEpisode(episodeId: string): Promise<ContentPiece[]> {
  const sb = getClient();
  if (!sb) return [];
  const activeUserId = await getActiveUserId();
  if (!activeUserId) return [];
  const { data, error } = await sb
    .from('content_pieces')
    .select('*')
    .eq('user_id', activeUserId)
    .eq('payload->>episode_id', episodeId)
    .order('created_at', { ascending: false });
  if (error) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((r: any) => fromRow<ContentPiece>(r));
}

export async function getChecklistsByEpisode(episodeId: string): Promise<Checklist[]> {
  const sb = getClient();
  if (!sb) return [];
  const activeUserId = await getActiveUserId();
  if (!activeUserId) return [];
  const { data, error } = await sb
    .from('checklists')
    .select('*')
    .eq('user_id', activeUserId)
    .eq('payload->>related_episode_id', episodeId)
    .order('created_at', { ascending: false });
  if (error) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((r: any) => fromRow<Checklist>(r));
}

export async function getLeadsByEpisode(episodeId: string): Promise<MonetizationLead[]> {
  const sb = getClient();
  if (!sb) return [];
  const activeUserId = await getActiveUserId();
  if (!activeUserId) return [];
  const { data, error } = await sb
    .from('monetization_leads')
    .select('*')
    .eq('user_id', activeUserId)
    .eq('payload->>episode_id', episodeId)
    .order('created_at', { ascending: false });
  if (error) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((r: any) => fromRow<MonetizationLead>(r));
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
  if (!activeUserId) return [];
  const { data, error } = await sb
    .from('calendar_events')
    .select('*')
    .eq('user_id', activeUserId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  if (!activeUserId) return [];
  const { data, error } = await sb
    .from('scripts')
    .select('*')
    .eq('user_id', activeUserId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      /* eslint-disable @typescript-eslint/no-explicit-any — Script row fields stored as direct columns, not in payload; cast required for type safety */
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
      /* eslint-enable @typescript-eslint/no-explicit-any */
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
export async function createVisualAsset(
  asset: Omit<VisualAsset, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<VisualAsset> {
  return insertOne<VisualAsset>('visual_assets', asset);
}
export async function updateVisualAsset(
  id: string,
  updates: Partial<VisualAsset>
): Promise<VisualAsset> {
  return updateOne<VisualAsset>('visual_assets', id, updates);
}
export async function deleteVisualAsset(id: string): Promise<void> {
  return deleteOne('visual_assets', id);
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
/* eslint-disable @typescript-eslint/no-explicit-any — Archive items have unstructured dynamic schema, type cannot be narrowed statically */
export async function getArchiveItems(): Promise<any[]> {
  return getAll<any>('archive_items');
}
export async function createArchiveItem(item: object): Promise<any> {
  return insertOne<any>('archive_items', item);
}
export async function updateArchiveItem(id: string, updates: object): Promise<any> {
  return updateOne<any>('archive_items', id, updates);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
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

// ---- IDEAS ----
export async function getIdeas(): Promise<Idea[]> {
  return getAll<Idea>('ideas');
}
export async function createIdea(
  idea: Omit<Idea, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<Idea> {
  return insertOne<Idea>('ideas', idea);
}
export async function updateIdea(id: string, updates: Partial<Idea>): Promise<Idea> {
  return updateOne<Idea>('ideas', id, updates);
}
export async function deleteIdea(id: string): Promise<void> {
  return deleteOne('ideas', id);
}

// ---- MASTER SECTIONS ----
/* eslint-disable @typescript-eslint/no-explicit-any — Master sections have unstructured dynamic schema, type cannot be narrowed statically */
export async function getMasterSections(): Promise<any[]> {
  return getAll<any>('master_sections');
}
export async function createMasterSection(section: object): Promise<any> {
  return insertOne<any>('master_sections', section);
}
export async function updateMasterSection(id: string, updates: object): Promise<any> {
  return updateOne<any>('master_sections', id, updates);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
export async function deleteMasterSection(id: string): Promise<void> {
  return deleteOne('master_sections', id);
}

// ---- SPOTIFY ANALYTICS ----

export async function createSpotifyImport(
  data: Omit<SpotifyMetricImport, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<SpotifyMetricImport> {
  return insertOne<SpotifyMetricImport>('spotify_metric_imports', data);
}

export async function updateSpotifyImport(
  id: string,
  updates: Partial<SpotifyMetricImport>
): Promise<SpotifyMetricImport> {
  return updateOne<SpotifyMetricImport>('spotify_metric_imports', id, updates);
}

export async function getSpotifyImports(): Promise<SpotifyMetricImport[]> {
  return getAll<SpotifyMetricImport>('spotify_metric_imports');
}

export async function getSpotifyImportById(id: string): Promise<SpotifyMetricImport | null> {
  const all = await getSpotifyImports();
  return all.find((i) => i.id === id) ?? null;
}

export async function deleteSpotifyImport(id: string): Promise<void> {
  return deleteOne('spotify_metric_imports', id);
}

export async function createSpotifyEpisodeMetrics(
  metrics: Omit<SpotifyEpisodeMetric, 'id' | 'created_at' | 'updated_at' | 'user_id'>[]
): Promise<SpotifyEpisodeMetric[]> {
  const sb = getClient();
  if (!sb) throw new Error('Supabase no configurado');
  const activeUserId = await getActiveUserId();
  const rows = metrics.map((m) => ({ user_id: activeUserId, payload: m }));
  const { data, error } = await sb.from('spotify_episode_metrics').insert(rows).select();
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((r: any) => fromRow<SpotifyEpisodeMetric>(r));
}

export async function getSpotifyMetricsByImport(importId: string): Promise<SpotifyEpisodeMetric[]> {
  const sb = getClient();
  if (!sb) return [];
  const activeUserId = await getActiveUserId();
  if (!activeUserId) return [];
  const { data, error } = await sb
    .from('spotify_episode_metrics')
    .select('*')
    .eq('user_id', activeUserId)
    .eq('payload->>import_id', importId)
    .order('created_at', { ascending: false });
  if (error) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((r: any) => fromRow<SpotifyEpisodeMetric>(r));
}

export async function getSpotifyMetricsByEpisode(
  episodeId: string
): Promise<SpotifyEpisodeMetric[]> {
  const sb = getClient();
  if (!sb) return [];
  const activeUserId = await getActiveUserId();
  if (!activeUserId) return [];
  const { data, error } = await sb
    .from('spotify_episode_metrics')
    .select('*')
    .eq('user_id', activeUserId)
    .eq('payload->>episode_id', episodeId)
    .order('created_at', { ascending: false });
  if (error) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((r: any) => fromRow<SpotifyEpisodeMetric>(r));
}

export async function getAllSpotifyMetrics(): Promise<SpotifyEpisodeMetric[]> {
  return getAll<SpotifyEpisodeMetric>('spotify_episode_metrics');
}

// ---- SPOTIFY DAILY METRICS (series diarias) ----

export async function createSpotifyDailyMetrics(
  metrics: Omit<SpotifyDailyMetric, 'id' | 'created_at' | 'updated_at' | 'user_id'>[]
): Promise<SpotifyDailyMetric[]> {
  const sb = getClient();
  if (!sb) throw new Error('Supabase no configurado');
  const activeUserId = await getActiveUserId();
  const rows = metrics.map((m) => ({ user_id: activeUserId, payload: m }));
  const { data, error } = await sb.from('spotify_daily_metrics').insert(rows).select();
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((r: any) => fromRow<SpotifyDailyMetric>(r));
}

export async function getAllSpotifyDailyMetrics(): Promise<SpotifyDailyMetric[]> {
  return getAll<SpotifyDailyMetric>('spotify_daily_metrics');
}

// ---- SPOTIFY DISTRIBUTION METRICS (apps / geografía) ----

export async function createSpotifyDistributionMetrics(
  metrics: Omit<SpotifyDistributionMetric, 'id' | 'created_at' | 'updated_at' | 'user_id'>[]
): Promise<SpotifyDistributionMetric[]> {
  const sb = getClient();
  if (!sb) throw new Error('Supabase no configurado');
  const activeUserId = await getActiveUserId();
  const rows = metrics.map((m) => ({ user_id: activeUserId, payload: m }));
  const { data, error } = await sb.from('spotify_distribution_metrics').insert(rows).select();
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((r: any) => fromRow<SpotifyDistributionMetric>(r));
}

export async function getAllSpotifyDistributionMetrics(): Promise<SpotifyDistributionMetric[]> {
  return getAll<SpotifyDistributionMetric>('spotify_distribution_metrics');
}

// ---- AMTME MANUAL METRICS (consolidado mensual por plataforma) ----

export async function createAmtmeManualMetrics(
  metrics: Omit<AmtmeManualMetric, 'id' | 'created_at' | 'updated_at' | 'user_id'>[]
): Promise<AmtmeManualMetric[]> {
  const sb = getClient();
  if (!sb) throw new Error('Supabase no configurado');
  const activeUserId = await getActiveUserId();
  const rows = metrics.map((m) => ({ user_id: activeUserId, payload: m }));
  const { data, error } = await sb.from('amtme_manual_metrics').insert(rows).select();
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((r: any) => fromRow<AmtmeManualMetric>(r));
}

export async function getAllAmtmeManualMetrics(): Promise<AmtmeManualMetric[]> {
  return getAll<AmtmeManualMetric>('amtme_manual_metrics');
}

export async function createStrategySnapshot(
  data: Omit<PodcastStrategySnapshot, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<PodcastStrategySnapshot> {
  return insertOne<PodcastStrategySnapshot>('podcast_strategy_snapshots', data);
}

export async function getStrategySnapshots(): Promise<PodcastStrategySnapshot[]> {
  return getAll<PodcastStrategySnapshot>('podcast_strategy_snapshots');
}

export async function deleteStrategySnapshot(id: string): Promise<void> {
  return deleteOne('podcast_strategy_snapshots', id);
}
