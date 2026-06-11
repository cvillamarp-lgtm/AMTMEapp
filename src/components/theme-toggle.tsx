'use client';

import { Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from '@/hooks/use-theme';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-black/[0.06] dark:hover:bg-white/[0.1]"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
    </button>
  );
}
