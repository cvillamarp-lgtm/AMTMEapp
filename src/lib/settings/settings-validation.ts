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

export function validateSetting(
  category: SettingCategory,
  key: string,
  value: unknown
): ValidationResult {
  const errors: string[] = [];

  if (!VALIDATION_RULES[category]) {
    return { valid: false, errors: [`Unknown category: ${category}`] };
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
