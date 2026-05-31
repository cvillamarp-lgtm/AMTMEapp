import { getSupabaseBrowserClient } from './supabase/client'
import type {
  Episode,
  ContentPiece,
  MetricMonthly,
  MetricEpisode,
  MonetizationLead,
  Checklist,
  CalendarEvent,
  Script,
  VisualAsset,
  AutomationRule,
  ArchiveItem,
  MasterSection,
} from '@/types/database'

function getClient() {
  return getSupabaseBrowserClient() as any
}

// EPISODES
export async function getEpisodes(): Promise<Episode[]> {
  const sb = getClient()
  if (!sb) return []
  const { data, error } = await sb.from('episodes').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createEpisode(episode: Omit<Episode, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Episode> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('episodes').insert([episode] as any).select().single()
  if (error) throw error
  return data
}

export async function updateEpisode(id: string, updates: Partial<Episode>): Promise<Episode> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('episodes').update({ ...updates, updated_at: new Date().toISOString() } as any).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteEpisode(id: string): Promise<void> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { error } = await sb.from('episodes').delete().eq('id', id)
  if (error) throw error
}

// CONTENT PIECES
export async function getContentPieces(): Promise<ContentPiece[]> {
  const sb = getClient()
  if (!sb) return []
  const { data, error } = await sb.from('content_pieces').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createContentPiece(content: Omit<ContentPiece, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<ContentPiece> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('content_pieces').insert([content] as any).select().single()
  if (error) throw error
  return data
}

export async function updateContentPiece(id: string, updates: Partial<ContentPiece>): Promise<ContentPiece> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('content_pieces').update({ ...updates, updated_at: new Date().toISOString() } as any).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteContentPiece(id: string): Promise<void> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { error } = await sb.from('content_pieces').delete().eq('id', id)
  if (error) throw error
}

// METRICS MONTHLY
export async function getMetricsMonthly(): Promise<MetricMonthly[]> {
  const sb = getClient()
  if (!sb) return []
  const { data, error } = await sb.from('metrics_monthly').select('*').order('month', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createMetricMonthly(metric: Omit<MetricMonthly, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<MetricMonthly> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('metrics_monthly').insert([metric] as any).select().single()
  if (error) throw error
  return data
}

// MONETIZATION LEADS
export async function getMonetizationLeads(): Promise<MonetizationLead[]> {
  const sb = getClient()
  if (!sb) return []
  const { data, error } = await sb.from('monetization_leads').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createMonetizationLead(lead: Omit<MonetizationLead, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<MonetizationLead> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('monetization_leads').insert([lead] as any).select().single()
  if (error) throw error
  return data
}

export async function updateMonetizationLead(id: string, updates: Partial<MonetizationLead>): Promise<MonetizationLead> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('monetization_leads').update({ ...updates, updated_at: new Date().toISOString() } as any).eq('id', id).select().single()
  if (error) throw error
  return data
}

// CHECKLISTS
export async function getChecklists(): Promise<Checklist[]> {
  const sb = getClient()
  if (!sb) return []
  const { data, error } = await sb.from('checklists').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createChecklist(checklist: Omit<Checklist, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Checklist> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('checklists').insert([checklist] as any).select().single()
  if (error) throw error
  return data
}

export async function updateChecklist(id: string, updates: Partial<Checklist>): Promise<Checklist> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('checklists').update({ ...updates, updated_at: new Date().toISOString() } as any).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteChecklist(id: string): Promise<void> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { error } = await sb.from('checklists').delete().eq('id', id)
  if (error) throw error
}

// CALENDAR EVENTS
export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const sb = getClient()
  if (!sb) return []
  const { data, error } = await sb.from('calendar_events').select('*').order('date', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createCalendarEvent(event: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<CalendarEvent> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('calendar_events').insert([event] as any).select().single()
  if (error) throw error
  return data
}

export async function updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('calendar_events').update({ ...updates, updated_at: new Date().toISOString() } as any).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { error } = await sb.from('calendar_events').delete().eq('id', id)
  if (error) throw error
}

// SCRIPTS
export async function getScripts(): Promise<Script[]> {
  const sb = getClient()
  if (!sb) return []
  const { data, error } = await sb.from('scripts').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createScript(script: Omit<Script, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'version'>): Promise<Script> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('scripts').insert([{ ...script, version: 1 }] as any).select().single()
  if (error) throw error
  return data
}

export async function updateScript(id: string, updates: Partial<Script>): Promise<Script> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('scripts').update({ ...updates, updated_at: new Date().toISOString() } as any).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteScript(id: string): Promise<void> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { error } = await sb.from('scripts').delete().eq('id', id)
  if (error) throw error
}

// AUTOMATION RULES
export async function getAutomationRules(): Promise<AutomationRule[]> {
  const sb = getClient()
  if (!sb) return []
  const { data, error } = await sb.from('automation_rules').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createAutomationRule(rule: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<AutomationRule> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('automation_rules').insert([rule] as any).select().single()
  if (error) throw error
  return data
}

export async function updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('automation_rules').update({ ...updates, updated_at: new Date().toISOString() } as any).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteAutomationRule(id: string): Promise<void> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { error } = await sb.from('automation_rules').delete().eq('id', id)
  if (error) throw error
}

// VISUAL ASSETS
export async function getVisualAssets(): Promise<VisualAsset[]> {
  const sb = getClient()
  if (!sb) return []
  const { data, error } = await sb.from('visual_assets').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ARCHIVE ITEMS
export async function getArchiveItems(): Promise<ArchiveItem[]> {
  const sb = getClient()
  if (!sb) return []
  const { data, error } = await sb.from('archive_items').select('*').order('archived_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createArchiveItem(item: Omit<ArchiveItem, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<ArchiveItem> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('archive_items').insert([item] as any).select().single()
  if (error) throw error
  return data
}

export async function updateArchiveItem(id: string, updates: Partial<ArchiveItem>): Promise<ArchiveItem> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('archive_items').update({ ...updates, updated_at: new Date().toISOString() } as any).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteArchiveItem(id: string): Promise<void> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { error } = await sb.from('archive_items').delete().eq('id', id)
  if (error) throw error
}

// MASTER SECTIONS
export async function getMasterSections(): Promise<MasterSection[]> {
  const sb = getClient()
  if (!sb) return []
  const { data, error } = await sb.from('master_sections').select('*').order('priority', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createMasterSection(section: Omit<MasterSection, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<MasterSection> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('master_sections').insert([section] as any).select().single()
  if (error) throw error
  return data
}

export async function updateMasterSection(id: string, updates: Partial<MasterSection>): Promise<MasterSection> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { data, error } = await sb.from('master_sections').update({ ...updates, updated_at: new Date().toISOString() } as any).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteMasterSection(id: string): Promise<void> {
  const sb = getClient()
  if (!sb) throw new Error('Supabase no configurado')
  const { error } = await sb.from('master_sections').delete().eq('id', id)
  if (error) throw error
}
