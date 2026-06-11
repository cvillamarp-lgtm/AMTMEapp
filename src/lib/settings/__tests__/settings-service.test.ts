import { settingsService } from '../settings-service';
import { DEFAULT_SETTINGS } from '../settings-defaults';

describe('SettingsService', () => {
  beforeEach(() => {
    localStorage.clear();
    settingsService.resetToDefaults();
  });

  describe('initialize', () => {
    it('should load default settings on first initialization', async () => {
      await settingsService.initialize();
      const settings = settingsService.getSettings();

      expect(settings.general.workspace_name).toBe('AMTME Studio OS');
      expect(settings.general.project_name).toBe('A Mí Tampoco Me Explicaron');
    });

    it('should load persisted settings from localStorage', async () => {
      localStorage.setItem(
        'amtme:settings',
        JSON.stringify({
          general: {
            workspace_name: 'Custom Workspace',
          },
        })
      );

      await settingsService.initialize(true);
      const settings = settingsService.getSettings();

      expect(settings.general.workspace_name).toBe('Custom Workspace');
    });
  });

  describe('getSetting', () => {
    beforeEach(async () => {
      await settingsService.initialize();
    });

    it('should return entire category if no key specified', () => {
      const brandSettings = settingsService.getSetting('brand');
      expect(brandSettings).toHaveProperty('brand_name');
      expect(brandSettings).toHaveProperty('primary_palette');
    });

    it('should return specific setting value', () => {
      const brandName = settingsService.getSetting('general', 'workspace_name');
      expect(brandName).toBe('AMTME Studio OS');
    });

    it('should return undefined for non-existent setting', () => {
      const value = settingsService.getSetting('general', 'nonexistent');
      expect(value).toBeUndefined();
    });
  });

  describe('updateSetting', () => {
    beforeEach(async () => {
      await settingsService.initialize();
    });

    it('should update a valid setting', async () => {
      const result = await settingsService.updateSetting(
        'general',
        'workspace_name',
        'New Workspace'
      );

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);

      const updated = settingsService.getSetting('general', 'workspace_name');
      expect(updated).toBe('New Workspace');
    });

    it('should reject invalid setting value', async () => {
      const result = await settingsService.updateSetting('general', 'workspace_name', '');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should persist changes to localStorage', async () => {
      await settingsService.updateSetting('general', 'workspace_name', 'Persisted Workspace');

      const stored = localStorage.getItem('amtme:settings');
      expect(stored).toBeTruthy();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.general.workspace_name).toBe('Persisted Workspace');
      }
    });
  });

  describe('updateMultiple', () => {
    beforeEach(async () => {
      await settingsService.initialize();
    });

    it('should update multiple settings at once', async () => {
      const result = await settingsService.updateMultiple([
        { category: 'general', key: 'workspace_name', value: 'New Workspace' },
        { category: 'general', key: 'timezone', value: 'America/New_York' },
      ]);

      expect(result.valid).toBe(true);

      const ws = settingsService.getSetting('general', 'workspace_name');
      const tz = settingsService.getSetting('general', 'timezone');

      expect(ws).toBe('New Workspace');
      expect(tz).toBe('America/New_York');
    });

    it('should reject if any update is invalid', async () => {
      const result = await settingsService.updateMultiple([
        { category: 'general', key: 'workspace_name', value: 'Valid' },
        { category: 'general', key: 'workspace_name', value: '' }, // Invalid
      ]);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('getAffectedModules', () => {
    it('should return modules affected by a setting change', () => {
      const aiModules = settingsService.getAffectedModules('ai', 'active_provider');
      expect(aiModules).toContain('ia');

      const brandModules = settingsService.getAffectedModules('brand', 'primary_palette');
      expect(brandModules).toContain('creador-visual');
    });

    it('should return empty array for unknown setting', () => {
      const modules = settingsService.getAffectedModules('general', 'unknown_setting');
      expect(modules).toEqual([]);
    });
  });

  describe('getSettingsForModule', () => {
    beforeEach(async () => {
      await settingsService.initialize();
    });

    it('should return only relevant settings for a module', () => {
      const iaSettings = settingsService.getSettingsForModule('ia');

      expect(iaSettings.ai).toBeDefined();
      expect(iaSettings.ai).toHaveProperty('active_provider');
      expect(iaSettings.ai).toHaveProperty('default_model');
    });

    it('should include settings with "all" affected modules', () => {
      const automationSettings = settingsService.getSettingsForModule('any_module');

      expect(automationSettings.automation).toBeDefined();
    });
  });

  describe('resetToDefaults', () => {
    beforeEach(async () => {
      await settingsService.initialize();
    });

    it('should reset all settings to defaults', async () => {
      await settingsService.updateSetting('general', 'workspace_name', 'Custom Name');

      settingsService.resetToDefaults();
      const settings = settingsService.getSettings();

      expect(settings.general.workspace_name).toBe('AMTME Studio OS');
    });

    it('should add reset entry to audit log', () => {
      settingsService.resetToDefaults();
      const log = settingsService.getAuditLog();

      const resetEntry = log.find((entry) => entry.key === '__reset__');
      expect(resetEntry).toBeDefined();
    });
  });

  describe('getAuditLog', () => {
    beforeEach(async () => {
      await settingsService.initialize();
    });

    it('should track setting changes in audit log', async () => {
      await settingsService.updateSetting('general', 'workspace_name', 'New Workspace');

      const log = settingsService.getAuditLog();
      const entry = log.find((e) => e.key === 'workspace_name');

      expect(entry).toBeDefined();
      expect(entry?.old_value).toBe('AMTME Studio OS');
      expect(entry?.new_value).toBe('New Workspace');
      expect(entry?.change_source).toBe('ui');
    });

    it('should limit audit log to 100 entries', async () => {
      for (let i = 0; i < 150; i++) {
        await settingsService.updateSetting('general', 'timezone', `entry_${i}`);
      }

      const log = settingsService.getAuditLog();
      expect(log.length).toBeLessThanOrEqual(100);
    });
  });
});
