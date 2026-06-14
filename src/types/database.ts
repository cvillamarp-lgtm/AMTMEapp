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
    };
  };
};
