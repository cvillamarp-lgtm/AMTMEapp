export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};

export type MasterSection = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  status: 'vigente' | 'pendiente' | 'historico' | 'requiere-decision';
  last_reviewed_at: string | null;
  priority: 'alta' | 'media' | 'baja';
  responsible: string | null;
  notes: string | null;
  version: number;
  created_at: string;
  updated_at: string;
};

export type TitleOptimizationStatus = 'generated' | 'approved' | 'rejected' | 'regenerated';

export type Episode = {
  id: string;
  user_id: string;
  episode_number: string;
  title: string;
  theme: string;
  pillar: string | null;
  emotional_wound: string;
  central_symbol: string;
  objective: string | null;
  status: EpisodeStatus;
  narrative_structure: NarrativeStructure | null;
  script: string | null;
  spotify_description: string | null;
  apple_description: string | null;
  cta: string | null;
  hooks: string[] | null;
  publish_date: string | null;
  notes: string | null;
  next_action: string | null;
  // Title optimization fields — stored in payload JSONB, no migration needed
  original_title: string | null;
  ai_optimized_title: string | null;
  title_optimization_status: TitleOptimizationStatus | null;
  title_optimized_at: string | null;
  title_optimization_source: 'ai' | 'manual' | null;
  created_at: string;
  updated_at: string;
};

export type EpisodeStatus =
  | 'idea'
  | 'investigacion'
  | 'guion'
  | 'grabacion'
  | 'edicion'
  | 'publicado'
  | 'distribuido'
  | 'medido'
  | 'archivado';

export type NarrativeStructure = {
  umbral: string;
  herida: string;
  simbolo: string;
  verdad: string;
  puente: string;
  accion: string;
};

export type Script = {
  id: string;
  user_id: string;
  episode_id: string;
  title: string;
  opening: string | null;
  threshold: string | null;
  wound: string | null;
  symbol: string | null;
  truth: string | null;
  bridge: string | null;
  action: string | null;
  closing: string | null;
  cta: string | null;
  voice_notes: string | null;
  status: ScriptStatus;
  version: number;
  created_at: string;
  updated_at: string;
};

export type ScriptStatus = 'borrador' | 'revision' | 'listo-grabar' | 'grabado' | 'archivado';

export type ContentPiece = {
  id: string;
  user_id: string;
  channel: Channel;
  format: ContentFormat;
  theme: string;
  emotion: string | null;
  objective: string | null;
  hook: string;
  main_text: string;
  caption: string | null;
  cta: string;
  visual_prompt: string | null;
  status: ContentStatus;
  publish_date: string | null;
  episode_id: string | null;
  metric_goal: string | null;
  created_at: string;
  updated_at: string;
};

export type Channel =
  | 'instagram'
  | 'tiktok'
  | 'youtube-shorts'
  | 'threads'
  | 'spotify'
  | 'apple-podcasts'
  | 'email'
  | 'whatsapp'
  | 'dm';

export type ContentFormat =
  | 'reel'
  | 'carrusel'
  | 'story'
  | 'short'
  | 'post-texto'
  | 'caption'
  | 'email'
  | 'guion-corto'
  | 'clip'
  | 'podcast';

export type ContentStatus = 'borrador' | 'listo' | 'publicado' | 'medido' | 'archivado';

export type VisualAsset = {
  id: string;
  user_id: string;
  type: VisualType;
  format: VisualFormat;
  title: string;
  main_text: string | null;
  secondary_text: string | null;
  cta: string | null;
  prompt: string;
  technical_spec: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template_variables: Record<string, any> | null;
  palette: string;
  status: string;
  episode_id: string | null;
  content_id: string | null;
  visual_reference: string | null;
  created_at: string;
  updated_at: string;
};

export type VisualType =
  | 'portada-podcast'
  | 'carrusel-portada'
  | 'story'
  | 'reel-cover'
  | 'post-tipografico'
  | 'prompt-editorial'
  | 'imagen-ia'
  | 'banner'
  | 'miniatura-youtube';

export type VisualFormat = '1080x1080' | '1080x1350' | '1080x1920' | '3000x3000' | '1920x1080';

export type CalendarEvent = {
  id: string;
  user_id: string;
  title: string;
  type: EventType;
  date: string;
  time: string | null;
  frequency: string | null;
  channel: string | null;
  episode_id: string | null;
  content_id: string | null;
  status: EventStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type EventType =
  | 'produccion'
  | 'grabacion'
  | 'edicion'
  | 'publicacion'
  | 'distribucion'
  | 'medicion'
  | 'revision'
  | 'descanso'
  | 'monetizacion';

export type EventStatus =
  | 'pendiente'
  | 'en-proceso'
  | 'listo'
  | 'publicado'
  | 'medido'
  | 'archivado';

export type MetricMonthly = {
  id: string;
  user_id: string;
  month: string;
  platform: string;
  reach: number;
  plays: number;
  downloads: number;
  engagement: number;
  profile_visits: number;
  link_clicks: number;
  dms: number;
  conversions: number;
  revenue: number;
  insight: string | null;
  action: string | null;
  created_at: string;
  updated_at: string;
};

export type MetricEpisode = {
  id: string;
  user_id: string;
  episode_id: string;
  plays_48h: number;
  plays_7d: number;
  retention: number;
  saves: number;
  shares: number;
  comments: number;
  dms: number;
  conversions: number;
  insight: string | null;
  created_at: string;
  updated_at: string;
};

export type MonetizationLead = {
  id: string;
  user_id: string;
  source: string;
  name: string;
  contact: string;
  status: LeadStatus;
  offer: string;
  potential_value: number;
  real_revenue: number;
  close_probability: number;
  next_action: string;
  follow_up_date: string | null;
  conversion_origin: string | null;
  episode_id: string | null;
  content_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadStatus =
  | 'nuevo-lead'
  | 'conversacion-iniciada'
  | 'interesado'
  | 'oferta-enviada'
  | 'sesion-agendada'
  | 'pagado'
  | 'entregado'
  | 'seguimiento'
  | 'perdido';

export type Checklist = {
  id: string;
  user_id: string;
  name: string;
  area: string;
  frequency: string | null;
  status: string;
  ready_criteria: string | null;
  errors_to_avoid: string | null;
  items: ChecklistItem[];
  related_episode_id: string | null;
  related_content_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type AutomationRule = {
  id: string;
  user_id: string;
  name: string;
  objective: string;
  trigger: string;
  input: string;
  output: string;
  tool: string;
  status: AutomationStatus;
  responsible: string | null;
  risk: string | null;
  next_review: string | null;
  created_at: string;
  updated_at: string;
};

export type AutomationStatus =
  | 'idea'
  | 'pendiente'
  | 'en-proceso'
  | 'listo'
  | 'activo'
  | 'pausado'
  | 'archivado';

export type ArchiveItem = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  origin: string;
  archive_reason: string;
  archived_at: string;
  recoverable: boolean;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AIHistory = {
  id: string;
  user_id: string;
  created_at: string;
  engine: string;
  provider: string;
  model: string;
  mode: AIMode;
  prompt_summary: string;
  result_summary: string | null;
  full_result: string | null;
  saved_destination: string | null;
};

export type AIMode =
  | 'episodio'
  | 'copy'
  | 'visual'
  | 'metricas'
  | 'monetizacion'
  | 'documento-maestro'
  | 'checklist'
  | 'calendario'
  | 'archivo';

export type AppConfig = {
  id: string;
  user_id: string;
  project_name: string;
  palette_locked: boolean;
  active_channels: string[];
  active_formats: string[];
  frequent_ctas: string[];
  psychological_concepts: string[];
  ai_primary_provider: string;
  ai_fallback_provider: string;
  ai_enabled: boolean;
  ai_system_prompt: string | null;
  ai_tone: string;
  ai_quality_rules: string[];
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: NoteCategory;
  status: NoteStatus;
  pinned: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type NoteCategory =
  | 'general'
  | 'reflexion'
  | 'episodio'
  | 'frase'
  | 'aprendizaje'
  | 'simbolo'
  | 'sueno'
  | 'insight'
  | 'pendiente';

export type NoteStatus = 'activa' | 'archivada' | 'pendiente';

export type Idea = {
  id: string;
  user_id: string;
  title: string;
  category: IdeaCategory;
  priority: 'alta' | 'media' | 'baja';
  emotional_state: string | null;
  theme: string | null;
  episode_id: string | null;
  viral_potential: number | null;
  therapeutic_potential: number | null;
  notes: string | null;
  status: IdeaStatus;
  created_at: string;
  updated_at: string;
};

// ---- SPOTIFY ANALYTICS ----

export type ImportStatus = 'uploaded' | 'validated' | 'processed' | 'failed' | 'partial';

export interface SpotifyMetricImport {
  id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  status: ImportStatus;
  detected_report_type: string | null;
  period_start: string | null;
  period_end: string | null;
  total_rows: number | null;
  processed_rows: number | null;
  failed_rows: number | null;
  error_log: Record<string, unknown> | null;
  raw_metadata: Record<string, unknown> | null;
  file_hash: string | null;
}

export interface SpotifyEpisodeMetric {
  id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  import_id: string;
  episode_id: string | null;
  spotify_episode_title: string;
  normalized_episode_title: string;
  metric_date: string | null;
  period_start: string | null;
  period_end: string | null;
  plays: number | null;
  streams: number | null;
  starts: number | null;
  listeners: number | null;
  followers_gained: number | null;
  completion_rate: number | null;
  average_consumption: number | null;
  minutes_listened: number | null;
  impressions: number | null;
  clicks: number | null;
  country: string | null;
  city: string | null;
  age_range: string | null;
  gender: string | null;
  platform: string | null;
  traffic_source: string | null;
  raw_row: Record<string, unknown> | null;
  // Campos extra para reportes de tipo "episode_rankings"
  episode_title?: string | null;
  episode_uri?: string | null;
  published_at?: string | null;
  plays_downloads?: number | null;
  ranking?: number | null;
  source_file_name?: string | null;
  imported_at?: string | null;
}

export interface SpotifyDailyMetric {
  id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  import_id: string;
  date: string;
  plays_downloads: number | null;
  listens: number | null;
  listening_hours: number | null;
  followers: number | null;
  source_file_name: string;
  imported_at: string;
}

export type SpotifyDistributionDimensionType = 'app' | 'location';

export interface SpotifyDistributionMetric {
  id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  import_id: string;
  dimension_type: SpotifyDistributionDimensionType;
  dimension_name: string;
  percentage: number | null;
  source_file_name: string;
  imported_at: string;
}

export interface AmtmeManualMetric {
  id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  import_id: string;
  month: string;
  platform: string;
  plays: number | null;
  reach: number | null;
  dms: number | null;
  conversions: number | null;
  revenue: number | null;
  source_file_name: string;
  imported_at: string;
}

export interface StrategyRecommendedActions {
  immediate: string[];
  next7Days: string[];
  next30Days: string[];
}

export interface PodcastStrategySnapshot {
  id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  import_id: string | null;
  period_start: string;
  period_end: string;
  summary: string;
  key_findings: string[];
  growth_signals: string[];
  risk_signals: string[];
  best_performing_episodes: string[];
  underperforming_episodes: string[];
  title_insights: string[];
  audience_insights: string[];
  distribution_insights: string[];
  recommended_actions: StrategyRecommendedActions;
  content_strategy_updates: string[];
  generated_by: 'ai' | 'manual';
}

export type IdeaCategory =
  | 'amor-propio'
  | 'relaciones'
  | 'ruptura'
  | 'apego'
  | 'limites'
  | 'tarot-terapeutico'
  | 'sanacion-emocional'
  | 'identidad'
  | 'proposito'
  | 'sombra'
  | 'renacimiento';

export type IdeaStatus = 'nueva' | 'en-desarrollo' | 'lista' | 'usada' | 'archivada';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      master_sections: {
        Row: MasterSection;
        Insert: Omit<MasterSection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MasterSection, 'id' | 'created_at' | 'updated_at'>>;
      };
      episodes: {
        Row: Episode;
        Insert: Omit<Episode, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Episode, 'id' | 'created_at' | 'updated_at'>>;
      };
      scripts: {
        Row: Script;
        Insert: Omit<Script, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Script, 'id' | 'created_at' | 'updated_at'>>;
      };
      content_pieces: {
        Row: ContentPiece;
        Insert: Omit<ContentPiece, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ContentPiece, 'id' | 'created_at' | 'updated_at'>>;
      };
      visual_assets: {
        Row: VisualAsset;
        Insert: Omit<VisualAsset, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VisualAsset, 'id' | 'created_at' | 'updated_at'>>;
      };
      calendar_events: {
        Row: CalendarEvent;
        Insert: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>>;
      };
      metrics_monthly: {
        Row: MetricMonthly;
        Insert: Omit<MetricMonthly, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MetricMonthly, 'id' | 'created_at' | 'updated_at'>>;
      };
      metrics_episode: {
        Row: MetricEpisode;
        Insert: Omit<MetricEpisode, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MetricEpisode, 'id' | 'created_at' | 'updated_at'>>;
      };
      monetization_leads: {
        Row: MonetizationLead;
        Insert: Omit<MonetizationLead, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MonetizationLead, 'id' | 'created_at' | 'updated_at'>>;
      };
      checklists: {
        Row: Checklist;
        Insert: Omit<Checklist, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Checklist, 'id' | 'created_at' | 'updated_at'>>;
      };
      automation_rules: {
        Row: AutomationRule;
        Insert: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AutomationRule, 'id' | 'created_at' | 'updated_at'>>;
      };
      archive_items: {
        Row: ArchiveItem;
        Insert: Omit<ArchiveItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ArchiveItem, 'id' | 'created_at' | 'updated_at'>>;
      };
      ai_history: {
        Row: AIHistory;
        Insert: Omit<AIHistory, 'id' | 'created_at'>;
        Update: Partial<Omit<AIHistory, 'id' | 'created_at'>>;
      };
      app_config: {
        Row: AppConfig;
        Insert: Omit<AppConfig, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AppConfig, 'id' | 'created_at' | 'updated_at'>>;
      };
      ideas: {
        Row: Idea;
        Insert: Omit<Idea, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Idea, 'id' | 'created_at' | 'updated_at'>>;
      };
      spotify_metric_imports: {
        Row: SpotifyMetricImport;
        Insert: Omit<SpotifyMetricImport, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SpotifyMetricImport, 'id' | 'created_at' | 'updated_at'>>;
      };
      spotify_episode_metrics: {
        Row: SpotifyEpisodeMetric;
        Insert: Omit<SpotifyEpisodeMetric, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SpotifyEpisodeMetric, 'id' | 'created_at' | 'updated_at'>>;
      };
      podcast_strategy_snapshots: {
        Row: PodcastStrategySnapshot;
        Insert: Omit<PodcastStrategySnapshot, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PodcastStrategySnapshot, 'id' | 'created_at' | 'updated_at'>>;
      };
      spotify_daily_metrics: {
        Row: SpotifyDailyMetric;
        Insert: Omit<SpotifyDailyMetric, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SpotifyDailyMetric, 'id' | 'created_at' | 'updated_at'>>;
      };
      spotify_distribution_metrics: {
        Row: SpotifyDistributionMetric;
        Insert: Omit<SpotifyDistributionMetric, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SpotifyDistributionMetric, 'id' | 'created_at' | 'updated_at'>>;
      };
      amtme_manual_metrics: {
        Row: AmtmeManualMetric;
        Insert: Omit<AmtmeManualMetric, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AmtmeManualMetric, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};
