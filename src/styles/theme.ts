export const theme = {
  colors: {
    bg: '#1a1a2e',
    surface: '#16213e',
    surfaceHover: '#1a2a4a',
    border: 'rgba(255,255,255,0.08)',
    borderHover: 'rgba(255,255,255,0.18)',
    text: '#e8eaf0',
    textMuted: '#8892a4',
    accent: '#4f8ef7',
    accentHover: '#6ba3ff',
    danger: '#e05c5c',
    taskbar: '#0f0f23',
    windowChrome: '#1e2233',
    windowBorder: 'rgba(255,255,255,0.1)',
    titleBarBtn: {
      close: '#ff5f57',
      minimize: '#febc2e',
      maximize: '#28c840',
    },
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '20px',
    full: '9999px',
  },
  shadow: {
    window: '0 8px 32px rgba(0,0,0,0.6)',
    menu: '0 8px 24px rgba(0,0,0,0.5)',
    icon: '0 2px 8px rgba(0,0,0,0.4)',
  },
  font: {
    sans: "'Inter', system-ui, sans-serif",
    size: {
      xs: '11px',
      sm: '12px',
      md: '14px',
      lg: '16px',
    },
  },
  taskbarHeight: '48px',
};

export type Theme = typeof theme;
