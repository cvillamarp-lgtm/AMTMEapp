import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        amtme: {
<<<<<<< HEAD
          // Official AMTME Editorial Premium palette (audited & aligned)
          navy: '#0C1F36', // Navy profundo
          gold: '#FEE94B', // Amarillo editorial
          cream: '#F5F1E8', // Crema editorial
          warmWhite: '#F8F8F6', // Blanco cálido
          slate: '#6B7B8C', // Gris frío suave para UI secundaria
          red: '#E0211E', // Rojo acento
          black: '#111111',
          // Legacy aliases (kept for compatibility during audit)
          lemon: '#FEE94B',
          'navy-profundo': '#0C1F36',
          'crema-editorial': '#F5F1E8',
        },
        semantic: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-soft': 'var(--color-surface-soft)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
          border: 'var(--color-border)',
          accent: 'var(--color-accent)',
          danger: 'var(--color-danger)',
=======
          navy: '#0C1F36', // Deep editorial navy (primary)
          navyLegacy: '#001F36', // Previous value retained for compatibility
          gold: '#FEE94B', // Editorial yellow/gold accent
          yellow: '#E8FF40', // Legacy bright accent (kept for existing surfaces)
          white: '#F8F8F6', // Warm editorial white
          cream: '#F5F1E8', // Warm cream
          creamLegacy: '#F5EFE6',
          petro: '#003D5C',
          terracotta: '#B85C38',
          red: '#E0211E', // High-risk / danger accent
>>>>>>> ece5a9a (fix: botones visibles hero card, estado activo episodios, monetizacion con acciones de venta, copiar output IA)
        },
      },
      boxShadow: {
        panel: '0 18px 52px rgba(0, 31, 54, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
