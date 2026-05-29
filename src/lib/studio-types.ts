export type SectionStatus = 'Vigente' | 'Pendiente' | 'Histórico' | 'Requiere decisión';
export type EpisodeStatus =
  | 'Idea'
  | 'En investigación'
  | 'Guion'
  | 'Grabación'
  | 'Edición'
  | 'Publicado'
  | 'Distribuido'
  | 'Medido'
  | 'Archivado';
export type ContentStatus = 'Borrador' | 'Listo' | 'Publicado' | 'Medido' | 'Archivado';
export type ChecklistStatus = 'Pendiente' | 'En proceso' | 'Listo';
export type CalendarStatus =
  | 'Pendiente'
  | 'En proceso'
  | 'Listo'
  | 'Publicado'
  | 'Medido'
  | 'Archivado';
export type MonetizationStatus =
  | 'Nuevo lead'
  | 'Conversación iniciada'
  | 'Interesado'
  | 'Sesión ofrecida'
  | 'Sesión agendada'
  | 'Pagado'
  | 'Perdido'
  | 'Seguimiento';
export type AIProvider = 'grok' | 'gemini';
export type InterfaceDensity = 'compacta' | 'estandar';
export type IntegrationStatus = 'No configurada' | 'Preparada' | 'Conectada';
export type AIWorkMode = 'Episodio' | 'Copy' | 'Visual' | 'Métricas' | 'Monetización';
export type AIEngine =
  | 'AI Episodios'
  | 'AI Visual'
  | 'AI Contenido'
  | 'AI Calidad'
  | 'AI Documento Maestro'
  | 'AI Archivo'
  | 'AI Métricas'
  | 'AI Reportes'
  | 'AI Monetización'
  | 'AI Automatización'
  | 'AI Calendario'
  | 'AI Checklists';

export interface MasterSection {
  id: string;
  title: string;
  content: string;
  status: SectionStatus;
  lastReviewedAt: string;
}

export interface Episode {
  id: string;
  episodeNumber: string;
  title: string;
  theme: string;
  pillar: string;
  emotionalWound: string;
  centralSymbol: string;
  objective: string;
  status: EpisodeStatus;
  narrativeStructure: string[];
  script: string;
  spotifyDescription: string;
  appleDescription: string;
  cta: string;
  hooks: string[];
  publishDate: string;
  notes: string;
  nextAction: string;
}

export interface VisualAsset {
  id: string;
  type: string;
  format: string;
  title: string;
  mainText: string;
  secondaryText: string;
  cta: string;
  prompt: string;
  technicalSpec: string;
  templateVariables: string;
  palette: string;
  status: ContentStatus;
  episodeId: string;
  createdAt: string;
}

export interface ContentPiece {
  id: string;
  channel: string;
  format: string;
  theme: string;
  emotion: string;
  objective: string;
  hook: string;
  mainText: string;
  caption: string;
  cta: string;
  visualPrompt: string;
  status: ContentStatus;
  publishDate: string;
  episodeId: string;
  metricGoal: string;
  createdAt: string;
}

export interface MetricMonthly {
  id: string;
  month: string;
  platform: string;
  reach: number;
  plays: number;
  downloads: number;
  engagement: number;
  profileVisits: number;
  linkClicks: number;
  dms: number;
  conversions: number;
  revenue: number;
  insight: string;
  action: string;
}

export interface MetricEpisode {
  id: string;
  episodeId: string;
  plays48h: number;
  plays7d: number;
  retention: number;
  saves: number;
  shares: number;
  comments: number;
  dms: number;
  conversions: number;
  insight: string;
}

export interface ChecklistItem {
  id: string;
  item: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  name: string;
  area: string;
  frequency: string;
  status: ChecklistStatus;
  readyCriteria: string;
  errorsToAvoid: string;
  items: ChecklistItem[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  frequency: string;
  channel: string;
  relatedEpisodeId: string;
  relatedContentId: string;
  status: CalendarStatus;
  notes: string;
}

export interface ArchiveItem {
  id: string;
  name: string;
  type: string;
  origin: string;
  reason: string;
  archivedAt: string;
  recoverable: 'Sí' | 'No';
  status: 'Activo' | 'Archivado' | 'Rescate requerido';
  notes: string;
}

export interface MonetizationLead {
  id: string;
  source: string;
  name: string;
  status: MonetizationStatus;
  offerId: string;
  revenue: number;
  nextAction: string;
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  objective: string;
  trigger: string;
  input: string;
  output: string;
  tool: string;
  status: ContentStatus;
  responsible: string;
  risk: string;
  nextReview: string;
}

export interface AIHistoryEntry {
  id: string;
  createdAt: string;
  engine: AIEngine;
  provider: AIProvider;
  model: string;
  promptSummary: string;
  resultSummary: string;
}

export interface FutureIntegration {
  id: 'supabase' | 'drive' | 'calendar' | 'sheets' | 'webhooks';
  label: string;
  status: IntegrationStatus;
  mode: 'solo lectura' | 'pendiente';
  detail: string;
}

export interface AppConfig {
  projectName: string;
  projectDescriptor: string;
  uiLanguage: string;
  timeZone: string;
  currency: string;
  operationalContext: string;
  paletteLocked: boolean;
  activeChannels: string[];
  activeFormats: string[];
  defaultChannel: string;
  defaultFrequency: string;
  publishingWindows: string[];
  frequentCtas: string[];
  defaultNarrativeStructure: string[];
  editorialTone: string;
  psychologicalConcepts: string[];
  futureApis: string[];
  futureIntegrations: FutureIntegration[];
  aiPrimaryProvider: AIProvider;
  aiFallbackProvider: AIProvider;
  aiEnabled: boolean;
  aiPreferredModelByProvider: Record<AIProvider, string>;
  aiVisibleModelsByProvider: Record<AIProvider, string[]>;
  aiSystemPrompt: string;
  aiTone: string;
  aiImageModel: string;
  aiNarrativeStructure: string[];
  aiQualityRules: string[];
  aiBaseQualityChecklist: string[];
  aiConnectionStatus: string;
  persistenceMode: 'local' | 'remote' | 'hibrido';
  environmentReadOnlyFlags: string[];
  uiDensity: InterfaceDensity;
  compactCards: boolean;
  showInterfaceHelp: boolean;
}

export interface StudioState {
  masterSections: MasterSection[];
  episodes: Episode[];
  visualAssets: VisualAsset[];
  contentPieces: ContentPiece[];
  metricsMonthly: MetricMonthly[];
  metricsEpisode: MetricEpisode[];
  checklists: Checklist[];
  calendarEvents: CalendarEvent[];
  archiveItems: ArchiveItem[];
  monetizationLeads: MonetizationLead[];
  automationRules: AutomationRule[];
  aiHistory: AIHistoryEntry[];
  config: AppConfig;
}
