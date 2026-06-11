export type SettingCategory =
  | 'general'
  | 'brand'
  | 'podcast'
  | 'content'
  | 'ai'
  | 'metrics'
  | 'integrations'
  | 'automation'
  | 'notifications'
  | 'security'
  | 'data'
  | 'system';

export type EditMode = 'editable' | 'read_only' | 'system_managed' | 'env_managed' | 'coming_soon';

export type ValueType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'select'
  | 'color'
  | 'textarea';

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface SettingDefinition {
  category: SettingCategory;
  key: string;
  label: string;
  description: string;
  valueType: ValueType;
  editMode: EditMode;
  value: unknown;
  defaultValue: unknown;
  affectedModules: string[];
  allowedRoles?: UserRole[];
  validationRules?: Record<string, unknown>;
  isCritical?: boolean;
  requiresConfirmation?: boolean;
}

export interface GeneralSettings {
  workspace_name: string;
  project_name: string;
  creator_name: string;
  timezone: string;
  language: string;
  date_format: string;
  time_format: '12h' | '24h';
  currency: string;
  week_start_day: 'Monday' | 'Sunday';
  editorial_preferred_day: string;
  editorial_preferred_time_window: string;
  system_status: 'active' | 'maintenance' | 'paused';
}

export interface BrandSettings {
  brand_name: string;
  full_brand_name: string;
  tagline: string;
  short_description: string;
  voice_tone: string;
  brand_keywords: string[];
  banned_words: string[];
  primary_palette: {
    yellow: string;
    navy: string;
    red: string;
    white: string;
  };
  typography?: {
    primary_font?: string;
    secondary_font?: string;
  };
  visual_rules?: string[];
  thumbnail_rules?: string[];
}

export interface PodcastSettings {
  podcast_name: string;
  host_name: string;
  main_platform: string;
  secondary_platforms: string[];
  ideal_episode_duration_minutes: number;
  max_episode_duration_minutes: number;
  default_primary_cta: string;
  default_secondary_cta: string;
  official_episode_structure: string[];
  title_formula: string;
  editorial_categories: string[];
}

export interface ContentSettings {
  active_formats: string[];
  active_platforms: string[];
  clips_per_episode: number;
  quotes_per_episode: number;
  copies_per_episode: number;
  default_copy_style: string;
  content_rules: string[];
  platform_specific_rules?: Record<string, string[]>;
  repurposing_rules?: string[];
  approval_required: boolean;
}

export interface AiSettings {
  active_provider: 'groq' | 'gemini' | 'claude' | 'grok';
  default_model: string;
  creative_temperature: number;
  technical_temperature: number;
  metrics_temperature: number;
  max_tokens: number;
  generation_modes: string[];
  base_amtme_prompt: string;
  enabled_modules: string[];
  save_generation_history: boolean;
  allow_auto_overwrite: boolean;
  require_human_review: boolean;
}

export interface MetricsSettings {
  primary_metrics_platform: string;
  accepted_file_types: string[];
  import_mode: 'Manual' | 'Automatic';
  strict_validation: boolean;
  allow_partially_valid_files: boolean;
  save_source_file: boolean;
  primary_kpis: string[];
  current_goals: Record<string, number>;
  benchmark_rules?: Record<string, unknown>;
}

export interface IntegrationSettings {
  [key: string]: {
    enabled: boolean;
    status: 'connected' | 'disconnected' | 'requires_configuration' | 'error' | 'disabled';
    last_sync_at?: string;
    last_error?: string;
    last_tested_at?: string;
  };
}

export interface AutomationSettings {
  automation_enabled: boolean;
  execution_mode: 'manual' | 'automatic' | 'requires_confirmation';
  active_automations: string[];
  analysis_frequency: string;
  weekly_report_day: string;
  weekly_report_time: string;
  destructive_actions_require_confirmation: boolean;
}

export interface NotificationSettings {
  notify_pending_episodes: boolean;
  notify_missing_metrics: boolean;
  notify_performance_drop: boolean;
  notify_ready_to_publish: boolean;
  notify_overdue_tasks: boolean;
  notify_integration_errors: boolean;
  notify_weekly_recommendations: boolean;
  notification_channels: string[];
  priority_rules?: Record<string, string>;
}

/**
 * SECURITY BOUNDARY NOTICE:
 * `role` and `module_permissions` are CLIENT-SIDE UI preferences ONLY.
 * They are stored in localStorage (fully user-controllable via devtools).
 * These MUST NOT be used as authorization boundaries.
 * All real access control MUST be enforced server-side via:
 * - Supabase RLS policies
 * - Authenticated API routes
 * - Middleware authentication checks
 * Treat these fields as UI personalization, not security.
 */
export interface SecuritySettings {
  primary_user: string;
  email: string;
  role: UserRole;
  session_status: string;
  last_access: string;
  two_factor_status: boolean;
  activity_log_enabled: boolean;
  module_permissions?: Record<string, UserRole[]>;
}

export interface DataSettings {
  last_backup_at?: string;
  backup_status: 'ready' | 'in_progress' | 'failed';
  estimated_data_size: string;
  last_export_at?: string;
  logs_retention_days: number;
  export_formats: string[];
}

export interface SystemSettings {
  app_version: string;
  environment: 'development' | 'staging' | 'production';
  supabase_status: 'connected' | 'error' | 'unknown';
  vercel_status: 'connected' | 'error' | 'unknown';
  last_deploy?: string;
  last_migration?: string;
  tests_status: 'passing' | 'failing' | 'unknown';
  integrations_status: Record<string, boolean>;
}

export interface Settings {
  general: GeneralSettings;
  brand: BrandSettings;
  podcast: PodcastSettings;
  content: ContentSettings;
  ai: AiSettings;
  metrics: MetricsSettings;
  integrations: IntegrationSettings;
  automation: AutomationSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  data: DataSettings;
  system: SystemSettings;
}

export interface SettingsAuditLog {
  id: string;
  workspace_id: string;
  category: SettingCategory;
  key: string;
  old_value: unknown;
  new_value: unknown;
  affected_modules: string[];
  changed_by: string;
  changed_at: string;
  change_source: 'ui' | 'api' | 'import' | 'system';
  change_reason?: string;
}
