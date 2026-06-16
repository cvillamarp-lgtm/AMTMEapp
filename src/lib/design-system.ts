/**
 * AMTME Design System
 * Central token definitions for colors, typography, spacing, and motion
 */

export const colors = {
  // Brand palette
  navy: '#0c1f36',
  yellow: '#fee94b', // Updated to official AMTME yellow
  red: '#e0211e',
  warmWhite: '#f8f8f6',
  charcoal: '#0d0d0d',

  // Semantic
  background: '#0c1f36',
  foreground: '#f8f8f6',
  accent: '#fee94b',
  accentDark: '#0c1f36',
  destructive: '#e0211e',

  // Neutrals
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7b8c',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Functional
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
} as const;

export const typography = {
  // Font families
  fonts: {
    display: 'var(--font-josefin)',
    body: 'var(--font-body)',
    mono: 'var(--font-mono)',
  },

  // Font sizes (rem)
  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
  },

  // Line heights
  lineHeights: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Font weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const;

export const spacing = {
  // 4px base grid
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const;

export const radius = {
  none: '0',
  sm: '2px',
  md: '4px',
  lg: '6px',
  xl: '8px',
  '2xl': '12px',
  '3xl': '16px',
  full: '9999px',
} as const;

export const shadows = {
  // Minimal, editorial shadows
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  // Premium shadow for cards
  premium: '0 8px 24px rgba(12, 31, 54, 0.15)',
  // Soft shadow for interactive elements
  soft: '0 2px 8px rgba(12, 31, 54, 0.08)',
} as const;

export const motion = {
  durations: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timings: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    linear: 'linear',
  },
} as const;

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
  notification: 1090,
} as const;

// Component-specific tokens
export const components = {
  button: {
    padding: {
      xs: '0.375rem 0.75rem', // 6px 12px
      sm: '0.5rem 1rem', // 8px 16px
      md: '0.75rem 1.5rem', // 12px 24px
      lg: '1rem 2rem', // 16px 32px
    },
    height: {
      xs: '1.75rem', // 28px
      sm: '2rem', // 32px
      md: '2.5rem', // 40px
      lg: '3rem', // 48px
    },
  },
  input: {
    height: '2.5rem', // 40px
    padding: '0.625rem 1rem', // 10px 16px
    borderWidth: '1px',
  },
  card: {
    padding: '1.5rem', // 24px
    borderRadius: '6px',
    shadow: shadows.soft,
  },
} as const;

/**
 * Usage in components:
 * import { colors, typography, spacing } from '@/lib/design-system'
 *
 * <button style={{ color: colors.yellow, padding: spacing[4] }}>
 *   Action
 * </button>
 */
