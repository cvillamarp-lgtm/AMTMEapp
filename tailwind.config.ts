import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // AMTME Brand Colors
        amtme: {
          navy: '#0c1f36',
          'navy-deep': '#071426',
          yellow: '#fee94b',
          lemon: '#e8ff40',
          red: '#e0211e',
          white: '#f8f8f6',
          cream: '#f4efe7',
          charcoal: '#0d0d0d',
          carbon: '#0d0d0d',
          muted: '#8a8f98',
          // Semantic aliases
          background: '#0c1f36',
          foreground: '#f8f8f6',
          accent: '#fee94b',
          'accent-dark': '#0c1f36',
          'accent-light': '#e8ff40',
          destructive: '#e0211e',
          border: 'rgba(248, 248, 246, 0.1)',
          // Grays
          'gray-50': '#f9fafb',
          'gray-100': '#f3f4f6',
          'gray-200': '#e5e7eb',
          'gray-300': '#d1d5db',
          'gray-400': '#9ca3af',
          'gray-500': '#6b7b8c',
          'gray-600': '#4b5563',
          'gray-700': '#374151',
          'gray-800': '#1f2937',
          'gray-900': '#111827',
          // Functional
          success: '#10b981',
          warning: '#f59e0b',
          info: '#3b82f6',
          // Semantic (replace hardcoded CSS variables)
          'semantic-border': 'rgba(248, 248, 246, 0.1)',
          'semantic-surface': 'rgba(12, 31, 54, 0.5)',
          'semantic-muted': '#8a8f98',
          'semantic-text': '#f8f8f6',
        },
        // Shadcn compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        sm: 'var(--amtme-radius-sm)',
        md: 'var(--amtme-radius-md)',
        lg: 'var(--amtme-radius-lg)',
        xl: 'var(--amtme-radius-xl)',
        '2xl': '12px',
        '3xl': '16px',
      },
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        display: ['var(--font-josefin)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        josefin: ['var(--font-josefin)', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        fast: 'var(--amtme-duration-fast)',
        base: 'var(--amtme-duration-base)',
        slow: 'var(--amtme-duration-slow)',
      },
      transitionTimingFunction: {
        'ease-in-out': 'var(--amtme-ease-in-out)',
      },
      boxShadow: {
        none: 'none',
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        premium: '0 8px 24px rgba(12, 31, 54, 0.15)',
        soft: '0 2px 8px rgba(12, 31, 54, 0.08)',
      },
      zIndex: {
        hide: '-1',
        base: '0',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        backdrop: '1040',
        modal: '1060',
        popover: '1070',
        tooltip: '1080',
      },
    },
  },
  plugins: [],
};

export default config;
