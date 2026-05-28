import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        amtme: {
          lemon: '#FEE94B',
          navy: '#0C1F36',
          cream: '#F5F2EA',
          white: '#FFFFFF',
          slate: '#90A4B8',
          red: '#E0211E',
          black: '#111111',
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
        },
      },
      boxShadow: {
        panel: '0 16px 60px rgba(12, 31, 54, 0.16)',
      },
    },
  },
  plugins: [],
};

export default config;
