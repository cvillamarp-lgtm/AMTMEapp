import { z } from 'zod';

const sectionStatusSchema = z.enum(['Vigente', 'Pendiente', 'Histórico', 'Requiere decisión']);
const episodeStatusSchema = z.enum(['Idea', 'En investigación', 'Guion', 'Grabación', 'Edición', 'Publicado', 'Distribuido', 'Medido', 'Archivado']);
const contentStatusSchema = z.enum(['Borrador', 'Listo', 'Publicado', 'Archivado']);
const checklistStatusSchema = z.enum(['Pendiente', 'En proceso', 'Listo']);
const calendarStatusSchema = z.enum(['Pendiente', 'En proceso', 'Listo', 'Publicado', 'Medido', 'Archivado']);
const monetizationStatusSchema = z.enum([
  'Nuevo lead',
  'Conversación iniciada',
  'Interesado',
  'Sesión ofrecida',
  'Sesión agendada',
  'Pagado',
  'Perdido',
  'Seguimiento',
]);
const aiProviderSchema = z.enum(['grok', 'gemini']);
const aiEngineSchema = z.enum([
  'AI Episodios',
  'AI Visual',
  'AI Contenido',
  'AI Calidad',
  'AI Documento Maestro',
  'AI Archivo',
  'AI Métricas',
  'AI Reportes',
  'AI Monetización',
  'AI Automatización',
  'AI Calendario',
  'AI Checklists',
]);

const masterSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  status: sectionStatusSchema,
  lastReviewedAt: z.string(),
}).passthrough();

export const episodeSchema = z.object({
  id: z.string(),
  episodeNumber: z.string(),
  title: z.string(),
  theme: z.string(),
  pillar: z.string(),
  emotionalWound: z.string(),
  centralSymbol: z.string(),
  objective: z.string(),
  status: episodeStatusSchema,
  narrativeStructure: z.array(z.string()),
  script: z.string(),
  spotifyDescription: z.string(),
  appleDescription: z.string(),
  cta: z.string(),
  hooks: z.array(z.string()),
  publishDate: z.string(),
  notes: z.string(),
  nextAction: z.string(),
}).passthrough();

const visualAssetSchema = z.object({
  id: z.string(),
  type: z.string(),
  format: z.string(),
  title: z.string(),
  mainText: z.string(),
  secondaryText: z.string(),
  cta: z.string(),
  prompt: z.string(),
  technicalSpec: z.string(),
  templateVariables: z.string(),
  palette: z.string(),
  status: contentStatusSchema,
  episodeId: z.string(),
  createdAt: z.string(),
}).passthrough();

export const contentPieceSchema = z.object({
  id: z.string(),
  channel: z.string(),
  format: z.string(),
  theme: z.string(),
  emotion: z.string(),
  objective: z.string(),
  hook: z.string(),
  mainText: z.string(),
  caption: z.string(),
  cta: z.string(),
  visualPrompt: z.string(),
  status: contentStatusSchema,
  publishDate: z.string(),
  episodeId: z.string(),
  metricGoal: z.string(),
  createdAt: z.string(),
}).passthrough();

export const metricMonthlySchema = z.object({
  id: z.string(),
  month: z.string(),
  platform: z.string(),
  reach: z.number().finite(),
  plays: z.number().finite(),
  downloads: z.number().finite(),
  engagement: z.number().finite(),
  profileVisits: z.number().finite(),
  linkClicks: z.number().finite(),
  dms: z.number().finite(),
  conversions: z.number().finite(),
  revenue: z.number().finite(),
  insight: z.string(),
  action: z.string(),
}).passthrough();

export const metricEpisodeSchema = z.object({
  id: z.string(),
  episodeId: z.string(),
  plays48h: z.number().finite(),
  plays7d: z.number().finite(),
  retention: z.number().finite(),
  saves: z.number().finite(),
  shares: z.number().finite(),
  comments: z.number().finite(),
  dms: z.number().finite(),
  conversions: z.number().finite(),
  insight: z.string(),
}).passthrough();

const checklistItemSchema = z.object({
  id: z.string(),
  item: z.string(),
  completed: z.boolean(),
}).passthrough();

const checklistSchema = z.object({
  id: z.string(),
  name: z.string(),
  area: z.string(),
  frequency: z.string(),
  status: checklistStatusSchema,
  readyCriteria: z.string(),
  errorsToAvoid: z.string(),
  items: z.array(checklistItemSchema),
}).passthrough();

const calendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  date: z.string(),
  time: z.string(),
  frequency: z.string(),
  channel: z.string(),
  relatedEpisodeId: z.string(),
  relatedContentId: z.string(),
  status: calendarStatusSchema,
  notes: z.string(),
}).passthrough();

const archiveItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  origin: z.string(),
  reason: z.string(),
  archivedAt: z.string(),
  recoverable: z.enum(['Sí', 'No']),
  status: z.enum(['Activo', 'Archivado', 'Rescate requerido']),
  notes: z.string(),
}).passthrough();

export const monetizationLeadSchema = z.object({
  id: z.string(),
  source: z.string(),
  name: z.string(),
  status: monetizationStatusSchema,
  offerId: z.string(),
  revenue: z.number().finite(),
  nextAction: z.string(),
  createdAt: z.string(),
}).passthrough();

const automationRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  objective: z.string(),
  trigger: z.string(),
  input: z.string(),
  output: z.string(),
  tool: z.string(),
  status: contentStatusSchema,
  responsible: z.string(),
  risk: z.string(),
  nextReview: z.string(),
}).passthrough();

const aiHistoryEntrySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  engine: aiEngineSchema,
  provider: aiProviderSchema,
  model: z.string(),
  promptSummary: z.string(),
  resultSummary: z.string(),
}).passthrough();

const appConfigSchema = z.object({
  projectName: z.string(),
  paletteLocked: z.boolean(),
  activeChannels: z.array(z.string()),
  activeFormats: z.array(z.string()),
  frequentCtas: z.array(z.string()),
  psychologicalConcepts: z.array(z.string()),
  futureApis: z.array(z.string()),
  aiPrimaryProvider: aiProviderSchema,
  aiFallbackProvider: aiProviderSchema,
  aiEnabled: z.boolean(),
  aiPreferredModelByProvider: z.object({
    grok: z.string(),
    gemini: z.string(),
  }).passthrough(),
  aiSystemPrompt: z.string(),
  aiTone: z.string(),
  aiImageModel: z.string(),
  aiNarrativeStructure: z.array(z.string()),
  aiQualityRules: z.array(z.string()),
  aiConnectionStatus: z.string(),
}).passthrough();

export const studioStateSchema = z.object({
  masterSections: z.array(masterSectionSchema),
  episodes: z.array(episodeSchema),
  visualAssets: z.array(visualAssetSchema),
  contentPieces: z.array(contentPieceSchema),
  metricsMonthly: z.array(metricMonthlySchema),
  metricsEpisode: z.array(metricEpisodeSchema),
  checklists: z.array(checklistSchema),
  calendarEvents: z.array(calendarEventSchema),
  archiveItems: z.array(archiveItemSchema),
  monetizationLeads: z.array(monetizationLeadSchema),
  automationRules: z.array(automationRuleSchema),
  aiHistory: z.array(aiHistoryEntrySchema),
  config: appConfigSchema,
}).passthrough();

export const studioStatePutBodySchema = z.object({
  state: studioStateSchema,
});
