export type AppearanceTheme = 'amtme-official';

export const APPEARANCE_STORAGE_KEY = 'amtme-appearance-theme';
export const APPEARANCE_PALETTE_STORAGE_KEY = 'amtme-appearance-palette';

export interface AppearancePalette {
  navy: string;
  lemon: string;
  cream: string;
  slate: string;
  red: string;
  white: string;
}

export const DEFAULT_AMTME_PALETTE: AppearancePalette = {
  navy: '#0c1f36',
  lemon: '#e8ff40',
  cream: '#f5f1e8',
  slate: '#6b7b8c',
  red: '#e0211e',
  white: '#ffffff',
};

export const THEME_PRESETS: Record<AppearanceTheme, { name: string; palette: AppearancePalette }> =
  {
    'amtme-official': {
      name: 'AMTME Oficial',
      palette: DEFAULT_AMTME_PALETTE,
    },
  };

export function saveAppearanceTheme(theme: AppearanceTheme): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, theme);
    const palette = THEME_PRESETS[theme].palette;
    window.localStorage.setItem(APPEARANCE_PALETTE_STORAGE_KEY, JSON.stringify(palette));
  } catch {
    // Safe to ignore localStorage errors
  }
}

export function getAppearanceTheme(): AppearanceTheme {
  if (typeof window === 'undefined') return 'amtme-official';
  try {
    const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (stored && stored in THEME_PRESETS) {
      return stored as AppearanceTheme;
    }
  } catch {
    // Safe to ignore localStorage errors
  }
  return 'amtme-official';
}

export function getAppearancePalette(): AppearancePalette {
  if (typeof window === 'undefined') return DEFAULT_AMTME_PALETTE;
  try {
    const stored = window.localStorage.getItem(APPEARANCE_PALETTE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AppearancePalette;
    }
  } catch {
    // Safe to ignore localStorage errors
  }
  return DEFAULT_AMTME_PALETTE;
}

export function resetAppearanceToDefault(): void {
  saveAppearanceTheme('amtme-official');
}
