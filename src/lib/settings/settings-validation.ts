import { SettingCategory } from './settings-types';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const VALIDATION_RULES: Record<SettingCategory, Record<string, (value: unknown) => string[]>> = {
  general: {
    workspace_name: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'string') errors.push('Must be a string');
      if (typeof value === 'string' && value.length < 1) errors.push('Cannot be empty');
      if (typeof value === 'string' && value.length > 100)
        errors.push('Cannot exceed 100 characters');
      return errors;
    },
    project_name: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'string') errors.push('Must be a string');
      if (typeof value === 'string' && value.length < 1) errors.push('Cannot be empty');
      return errors;
    },
    creator_name: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'string') errors.push('Must be a string');
      return errors;
    },
    timezone: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'string') errors.push('Must be a string');
      const validTimezones = [
        'America/Cancun',
        'America/Mexico_City',
        'America/New_York',
        'Europe/London',
        'UTC',
      ];
      if (typeof value === 'string' && !validTimezones.includes(value)) {
        errors.push(`Must be one of: ${validTimezones.join(', ')}`);
      }
      return errors;
    },
    language: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'string') errors.push('Must be a string');
      const validLanguages = ['es-419', 'es-ES', 'en-US'];
      if (typeof value === 'string' && !validLanguages.includes(value)) {
        errors.push(`Must be one of: ${validLanguages.join(', ')}`);
      }
      return errors;
    },
    currency: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'string') errors.push('Must be a string');
      const validCurrencies = ['MXN', 'USD', 'EUR'];
      if (typeof value === 'string' && !validCurrencies.includes(value)) {
        errors.push(`Must be one of: ${validCurrencies.join(', ')}`);
      }
      return errors;
    },
    time_format: (value) => {
      const errors: string[] = [];
      if (!['12h', '24h'].includes(value as string)) errors.push('Must be 12h or 24h');
      return errors;
    },
  },
  brand: {
    brand_name: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'string') errors.push('Must be a string');
      if (typeof value === 'string' && value.length > 50)
        errors.push('Cannot exceed 50 characters');
      return errors;
    },
    primary_palette: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'object' || value === null) errors.push('Must be an object');
      if (typeof value === 'object' && value !== null) {
        const colors = value as Record<string, unknown>;
        ['yellow', 'navy', 'red', 'white'].forEach((color) => {
          if (!colors[color]) errors.push(`Missing color: ${color}`);
          if (typeof colors[color] !== 'string') errors.push(`Color ${color} must be a string`);
        });
      }
      return errors;
    },
  },
  podcast: {
    podcast_name: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'string') errors.push('Must be a string');
      return errors;
    },
    ideal_episode_duration_minutes: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'number') errors.push('Must be a number');
      if (typeof value === 'number' && (value < 10 || value > 300))
        errors.push('Must be between 10 and 300 minutes');
      return errors;
    },
  },
  content: {
    clips_per_episode: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'number') errors.push('Must be a number');
      if (typeof value === 'number' && value < 0) errors.push('Cannot be negative');
      return errors;
    },
    approval_required: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'boolean') errors.push('Must be a boolean');
      return errors;
    },
  },
  ai: {
    creative_temperature: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'number') errors.push('Must be a number');
      if (typeof value === 'number' && (value < 0 || value > 1))
        errors.push('Must be between 0 and 1');
      return errors;
    },
    active_provider: (value) => {
      const errors: string[] = [];
      const validProviders = ['groq', 'gemini', 'claude', 'grok'];
      if (typeof value === 'string' && !validProviders.includes(value)) {
        errors.push(`Must be one of: ${validProviders.join(', ')}`);
      }
      return errors;
    },
    require_human_review: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'boolean') errors.push('Must be a boolean');
      return errors;
    },
  },
  metrics: {
    strict_validation: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'boolean') errors.push('Must be a boolean');
      return errors;
    },
    import_mode: (value) => {
      const errors: string[] = [];
      if (!['Manual', 'Automatic'].includes(value as string))
        errors.push('Must be Manual or Automatic');
      return errors;
    },
  },
  integrations: {
    '*': (value) => {
      const errors: string[] = [];
      if (typeof value !== 'object' || value === null) errors.push('Must be an object');
      if (typeof value === 'object' && value !== null) {
        const config = value as Record<string, unknown>;
        if (typeof config.enabled !== 'boolean') errors.push('enabled must be a boolean');
        if (!config.status) errors.push('status is required');
      }
      return errors;
    },
  },
  automation: {
    automation_enabled: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'boolean') errors.push('Must be a boolean');
      return errors;
    },
    execution_mode: (value) => {
      const errors: string[] = [];
      const modes = ['manual', 'automatic', 'requires_confirmation'];
      if (typeof value === 'string' && !modes.includes(value)) {
        errors.push(`Must be one of: ${modes.join(', ')}`);
      }
      return errors;
    },
  },
  notifications: {
    notify_pending_episodes: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'boolean') errors.push('Must be a boolean');
      return errors;
    },
  },
  security: {
    two_factor_status: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'boolean') errors.push('Must be a boolean');
      return errors;
    },
    role: (value) => {
      const errors: string[] = [];
      const roles = ['owner', 'admin', 'editor', 'viewer'];
      if (typeof value === 'string' && !roles.includes(value)) {
        errors.push(`Must be one of: ${roles.join(', ')}`);
      }
      return errors;
    },
  },
  data: {
    logs_retention_days: (value) => {
      const errors: string[] = [];
      if (typeof value !== 'number') errors.push('Must be a number');
      if (typeof value === 'number' && (value < 1 || value > 730))
        errors.push('Must be between 1 and 730 days');
      return errors;
    },
  },
  system: {
    environment: (value) => {
      const errors: string[] = [];
      const envs = ['development', 'staging', 'production'];
      if (typeof value === 'string' && !envs.includes(value)) {
        errors.push(`Must be one of: ${envs.join(', ')}`);
      }
      return errors;
    },
  },
};

// Allowlist of permitted keys per category (prevents prototype pollution)
export const PERMITTED_KEYS: Record<SettingCategory, Set<string>> = {
  general: new Set([
    'workspace_name',
    'project_name',
    'creator_name',
    'timezone',
    'language',
    'date_format',
    'time_format',
    'currency',
    'week_start_day',
    'editorial_preferred_day',
    'editorial_preferred_time_window',
    'system_status',
  ]),
  brand: new Set([
    'brand_name',
    'full_brand_name',
    'tagline',
    'short_description',
    'voice_tone',
    'brand_keywords',
    'banned_words',
    'primary_palette',
    'typography',
    'visual_rules',
    'thumbnail_rules',
  ]),
  podcast: new Set([
    'podcast_name',
    'host_name',
    'main_platform',
    'secondary_platforms',
    'ideal_episode_duration_minutes',
    'max_episode_duration_minutes',
    'default_primary_cta',
    'default_secondary_cta',
    'official_episode_structure',
    'title_formula',
    'editorial_categories',
  ]),
  content: new Set([
    'active_formats',
    'active_platforms',
    'clips_per_episode',
    'quotes_per_episode',
    'copies_per_episode',
    'default_copy_style',
    'content_rules',
    'platform_specific_rules',
    'repurposing_rules',
    'approval_required',
  ]),
  ai: new Set([
    'active_provider',
    'default_model',
    'creative_temperature',
    'technical_temperature',
    'metrics_temperature',
    'max_tokens',
    'generation_modes',
    'base_amtme_prompt',
    'enabled_modules',
    'save_generation_history',
    'allow_auto_overwrite',
    'require_human_review',
  ]),
  metrics: new Set([
    'primary_metrics_platform',
    'accepted_file_types',
    'import_mode',
    'strict_validation',
    'allow_partially_valid_files',
    'save_source_file',
    'primary_kpis',
    'current_goals',
    'benchmark_rules',
  ]),
  integrations: new Set(['spotify', 'youtube', 'instagram', 'tiktok', 'linkedin']),
  automation: new Set([
    'automation_enabled',
    'execution_mode',
    'active_automations',
    'analysis_frequency',
    'weekly_report_day',
    'weekly_report_time',
    'destructive_actions_require_confirmation',
  ]),
  notifications: new Set([
    'notify_pending_episodes',
    'notify_missing_metrics',
    'notify_performance_drop',
    'notify_ready_to_publish',
    'notify_overdue_tasks',
    'notify_integration_errors',
    'notify_weekly_recommendations',
    'notification_channels',
    'priority_rules',
  ]),
  security: new Set([
    'primary_user',
    'email',
    'role',
    'session_status',
    'last_access',
    'two_factor_status',
    'activity_log_enabled',
    'module_permissions',
  ]),
  data: new Set([
    'last_backup_at',
    'backup_status',
    'estimated_data_size',
    'last_export_at',
    'logs_retention_days',
    'export_formats',
  ]),
  system: new Set([
    'app_version',
    'environment',
    'supabase_status',
    'vercel_status',
    'last_deploy',
    'last_migration',
    'tests_status',
    'integrations_status',
  ]),
};

// Dangerous keys that should never be used as setting keys (prototype pollution prevention)
export const FORBIDDEN_KEYS = new Set([
  '__proto__',
  'constructor',
  'prototype',
  '__constructor__',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
]);

export function validateSetting(
  category: SettingCategory,
  key: string,
  value: unknown
): ValidationResult {
  const errors: string[] = [];

  // Check for prototype pollution attempts
  if (FORBIDDEN_KEYS.has(key)) {
    return { valid: false, errors: [`Invalid key name: ${key} is not allowed`] };
  }

  if (!VALIDATION_RULES[category]) {
    return { valid: false, errors: [`Unknown category: ${category}`] };
  }

  // Check if key is in the allowlist for this category
  if (!PERMITTED_KEYS[category].has(key)) {
    return { valid: false, errors: [`Unknown key "${key}" for category "${category}"`] };
  }

  const categoryRules = VALIDATION_RULES[category];
  const validator = categoryRules[key] || categoryRules['*'];

  if (validator) {
    const validationErrors = validator(value);
    errors.push(...validationErrors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateCategory(
  category: SettingCategory,
  values: Record<string, unknown>
): ValidationResult {
  const errors: string[] = [];

  for (const [key, value] of Object.entries(values)) {
    const result = validateSetting(category, key, value);
    if (!result.valid) {
      errors.push(`${key}: ${result.errors.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
