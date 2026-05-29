import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        amtme: {
          lemon: '#FEE94B',
          navy: '#001F36',
          cream: '#F5F2EA',
          white: '#FFFFFF',
          slate: '#7A8A99',
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
        panel: '0 18px 52px rgba(0, 31, 54, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
