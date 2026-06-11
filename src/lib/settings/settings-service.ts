import { Settings, SettingCategory, SettingsAuditLog } from './settings-types';
import { DEFAULT_SETTINGS } from './settings-defaults';
import { validateSetting } from './settings-validation';

class SettingsService {
  private settings: Settings = { ...DEFAULT_SETTINGS };
  private auditLog: SettingsAuditLog[] = [];
  private isInitialized = false;

  async initialize(force = false): Promise<void> {
    if (this.isInitialized && !force) return;

    try {
      const stored = localStorage.getItem('amtme:settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.settings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
        };
      }
    } catch {
      this.settings = { ...DEFAULT_SETTINGS };
    }

    this.isInitialized = true;
  }

  getSettings(): Settings {
    return JSON.parse(JSON.stringify(this.settings));
  }

  getSetting<T extends SettingCategory>(category: T, key?: string): unknown {
    const categorySettings = this.settings[category];

    if (!key) {
      return categorySettings;
    }

    if (typeof categorySettings === 'object' && categorySettings !== null) {
      return (categorySettings as Record<string, unknown>)[key];
    }

    return undefined;
  }

  async updateSetting<T extends SettingCategory>(
    category: T,
    key: string,
    value: unknown,
    userId: string = 'system'
  ): Promise<{ valid: boolean; errors: string[] }> {
    const validation = validateSetting(category, key, value);

    if (!validation.valid) {
      return validation;
    }

    const oldValue = this.getSetting(category, key);

    const categorySettings = this.settings[category];
    if (typeof categorySettings === 'object' && categorySettings !== null) {
      (categorySettings as Record<string, unknown>)[key] = value;
    }

    this.persistSettings();

    const affectedModules = this.getAffectedModules(category, key);
    this.addAuditLog({
      id: `${Date.now()}-${Math.random()}`,
      workspace_id: 'default',
      category,
      key,
      old_value: oldValue,
      new_value: value,
      affected_modules: affectedModules,
      changed_by: userId,
      changed_at: new Date().toISOString(),
      change_source: 'ui',
    });

    return { valid: true, errors: [] };
  }

  async updateMultiple(
    updates: Array<{
      category: SettingCategory;
      key: string;
      value: unknown;
    }>,
    userId: string = 'system'
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    for (const update of updates) {
      const validation = validateSetting(update.category, update.key, update.value);
      if (!validation.valid) {
        errors.push(`${update.category}.${update.key}: ${validation.errors.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    for (const update of updates) {
      const categorySettings = this.settings[update.category];
      if (typeof categorySettings === 'object' && categorySettings !== null) {
        (categorySettings as Record<string, unknown>)[update.key] = update.value;
      }
    }

    this.persistSettings();
    return { valid: true, errors: [] };
  }

  getAffectedModules(category: SettingCategory, key: string): string[] {
    const moduleMap: Record<SettingCategory, Record<string, string[]>> = {
      general: {
        timezone: ['ia', 'metricas', 'contenido'],
        language: ['all'],
        currency: ['metricas', 'financiero'],
      },
      brand: {
        brand_name: ['contenido', 'creador-visual'],
        primary_palette: ['creador-visual'],
        voice_tone: ['ia', 'contenido'],
      },
      podcast: {
        podcast_name: ['contenido', 'guiones'],
        host_name: ['contenido'],
        default_primary_cta: ['contenido', 'guiones'],
      },
      content: {
        active_formats: ['contenido', 'creador-visual'],
        active_platforms: ['contenido'],
        approval_required: ['contenido'],
      },
      ai: {
        active_provider: ['ia'],
        default_model: ['ia'],
        base_amtme_prompt: ['ia'],
      },
      metrics: {
        primary_metrics_platform: ['metricas'],
        primary_kpis: ['metricas'],
        current_goals: ['metricas'],
      },
      integrations: {
        spotify: ['metricas', 'contenido'],
        youtube: ['metricas', 'contenido'],
      },
      automation: {
        automation_enabled: ['all'],
        active_automations: ['all'],
      },
      notifications: {
        notify_pending_episodes: ['shell'],
        notify_missing_metrics: ['metricas'],
      },
      security: {
        role: ['shell'],
        module_permissions: ['shell'],
      },
      data: {
        backup_status: ['shell'],
        logs_retention_days: ['shell'],
      },
      system: {
        app_version: ['shell'],
        environment: ['shell'],
      },
    };

    const category_map = moduleMap[category];
    if (category_map && category_map[key]) {
      return category_map[key];
    }

    return [];
  }

  getSettingsForModule(moduleName: string): Partial<Settings> {
    const moduleSettings: Partial<Settings> = {};

    for (const [category, settings] of Object.entries(this.settings)) {
      if (typeof settings === 'object' && settings !== null) {
        const categoryKeys = Object.keys(settings);
        const relevantKeys = categoryKeys.filter((key) => {
          const affected = this.getAffectedModules(category as SettingCategory, key);
          return affected.includes(moduleName) || affected.includes('all');
        });

        if (relevantKeys.length > 0) {
          moduleSettings[category as SettingCategory] = relevantKeys.reduce(
            (acc, key) => {
              acc[key] = (settings as Record<string, unknown>)[key];
              return acc;
            },
            {} as Record<string, unknown>
          ) as never;
        }
      }
    }

    return moduleSettings;
  }

  resetToDefaults(): void {
    this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    this.persistSettings();

    this.addAuditLog({
      id: `${Date.now()}-${Math.random()}`,
      workspace_id: 'default',
      category: 'general',
      key: '__reset__',
      old_value: null,
      new_value: null,
      affected_modules: ['all'],
      changed_by: 'system',
      changed_at: new Date().toISOString(),
      change_source: 'system',
      change_reason: 'Reset to defaults',
    });
  }

  getAuditLog(): SettingsAuditLog[] {
    return [...this.auditLog];
  }

  private addAuditLog(entry: SettingsAuditLog): void {
    this.auditLog.push(entry);
    if (this.auditLog.length > 100) {
      this.auditLog = this.auditLog.slice(-100);
    }
  }

  private persistSettings(): void {
    try {
      localStorage.setItem('amtme:settings', JSON.stringify(this.settings));
    } catch {
      console.warn('Failed to persist settings to localStorage');
    }
  }
}

export const settingsService = new SettingsService();
