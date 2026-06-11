'use client';

import { useEffect, useState, useCallback } from 'react';
import { Settings, SettingCategory } from '@/lib/settings/settings-types';
import { settingsService } from '@/lib/settings/settings-service';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        setIsLoading(true);
        await settingsService.initialize();
        setSettings(settingsService.getSettings());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    initializeSettings();
  }, []);

  const getSetting = useCallback(
    <T extends SettingCategory>(category: T, key?: string): unknown => {
      if (!settings) return null;
      return settingsService.getSetting(category, key);
    },
    [settings]
  );

  const updateSetting = useCallback(
    async <T extends SettingCategory>(
      category: T,
      key: string,
      value: unknown,
      userId?: string
    ): Promise<{ valid: boolean; errors: string[] }> => {
      try {
        const result = await settingsService.updateSetting(category, key, value, userId);

        if (result.valid) {
          setSettings(settingsService.getSettings());
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        return { valid: false, errors: [error.message] };
      }
    },
    []
  );

  const updateMultiple = useCallback(
    async (
      updates: Array<{
        category: SettingCategory;
        key: string;
        value: unknown;
      }>,
      userId?: string
    ): Promise<{ valid: boolean; errors: string[] }> => {
      try {
        const result = await settingsService.updateMultiple(updates, userId);

        if (result.valid) {
          setSettings(settingsService.getSettings());
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        return { valid: false, errors: [error.message] };
      }
    },
    []
  );

  const getSettingsForModule = useCallback((moduleName: string): Partial<Settings> => {
    return settingsService.getSettingsForModule(moduleName);
  }, []);

  const resetToDefaults = useCallback(async (): Promise<void> => {
    try {
      settingsService.resetToDefaults();
      setSettings(settingsService.getSettings());
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    }
  }, []);

  return {
    settings,
    isLoading,
    error,
    getSetting,
    updateSetting,
    updateMultiple,
    getSettingsForModule,
    resetToDefaults,
  };
}
