import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  colors: {
    primary: '#7c3aed',
    primaryLight: '#a78bfa',
    background: '#ffffff',
    foreground: '#171717',
    text: '#1f2937',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#22c55e',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  fonts: {
    body: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    mono: "ui-monospace, 'Cascadia Code', monospace",
  },
});
