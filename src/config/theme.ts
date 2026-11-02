/**
 * Glam Blocks - Theme System & CSS Custom Properties
 * Provides the definitive palette tokens for:
 * 1. "Rose Quartz Morning" (Light Theme)
 * 2. "Midnight Vanity" (Dark Theme)
 * 
 * Supports dynamic CSS variable injection, system preference tracking,
 * and high-DPI glassmorphism styles.
 */

import type { ThemeMode } from '../types';

export interface ThemeColors {
  name: string;
  bgPrimary: string;
  bgSecondary: string;
  bgSurface: string;
  bgBoard: string;
  bgCellEmpty: string;
  bgCellEmptyHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string;
  accentHover: string;
  accentGlow: string;
  goldAccent: string;
  goldGlow: string;
  borderSubtle: string;
  borderCard: string;
  borderFocus: string;
  glassBg: string;
  glassBorder: string;
  shadowCard: string;
  shadowButton: string;
  shadowGold: string;
  trayBg: string;
  trayBorder: string;
  modalBackdrop: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  metaThemeColor: string;
}

export const lightTheme: ThemeColors = {
  name: 'Rose Quartz Morning',
  bgPrimary: '#FFF5F8',
  bgSecondary: '#FFE8F0',
  bgSurface: '#FFFFFF',
  bgBoard: '#FCE4EC',
  bgCellEmpty: '#F5D5E2',
  bgCellEmptyHover: '#EFC1D3',
  textPrimary: '#2B1220',
  textSecondary: '#7A4760',
  textMuted: '#A5738B',
  accentPrimary: '#FF5C9E',
  accentHover: '#E83E84',
  accentGlow: 'rgba(255, 92, 158, 0.35)',
  goldAccent: '#F2B84B',
  goldGlow: 'rgba(242, 184, 75, 0.40)',
  borderSubtle: 'rgba(255, 92, 158, 0.15)',
  borderCard: 'rgba(235, 175, 200, 0.35)',
  borderFocus: '#FF5C9E',
  glassBg: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.60)',
  shadowCard: '0 8px 30px rgba(235, 92, 158, 0.12)',
  shadowButton: '0 4px 14px rgba(255, 92, 158, 0.35)',
  shadowGold: '0 4px 16px rgba(242, 184, 75, 0.35)',
  trayBg: 'rgba(255, 255, 255, 0.65)',
  trayBorder: 'rgba(255, 92, 158, 0.20)',
  modalBackdrop: 'rgba(43, 18, 32, 0.60)',
  success: '#2ECC71',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#3498DB',
  metaThemeColor: '#FFF5F8',
};

export const darkTheme: ThemeColors = {
  name: 'Midnight Vanity',
  bgPrimary: '#17101C',
  bgSecondary: '#24182E',
  bgSurface: '#2F1F3D',
  bgBoard: '#1E1326',
  bgCellEmpty: '#2A1A36',
  bgCellEmptyHover: '#3D254F',
  textPrimary: '#FFF0F5',
  textSecondary: '#D4B8C8',
  textMuted: '#8C7285',
  accentPrimary: '#FF7DB4',
  accentHover: '#FF5C9E',
  accentGlow: 'rgba(255, 125, 180, 0.45)',
  goldAccent: '#FFD27A',
  goldGlow: 'rgba(255, 210, 122, 0.45)',
  borderSubtle: 'rgba(255, 125, 180, 0.20)',
  borderCard: 'rgba(180, 147, 255, 0.25)',
  borderFocus: '#FF7DB4',
  glassBg: 'rgba(36, 24, 46, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  shadowCard: '0 8px 32px rgba(0, 0, 0, 0.50)',
  shadowButton: '0 4px 14px rgba(255, 125, 180, 0.30)',
  shadowGold: '0 4px 16px rgba(255, 210, 122, 0.30)',
  trayBg: 'rgba(36, 24, 46, 0.65)',
  trayBorder: 'rgba(255, 125, 180, 0.25)',
  modalBackdrop: 'rgba(10, 6, 12, 0.80)',
  success: '#2ECC71',
  warning: '#F1C40F',
  danger: '#E74C3C',
  info: '#3498DB',
  metaThemeColor: '#17101C',
};

export const theme = {
  light: lightTheme,
  dark: darkTheme,
  fonts: {
    sans: "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    heading: "'Playfair Display', 'Clash Display', Georgia, serif",
    mono: "'JetBrains Mono', Consolas, monospace",
  },
  radii: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

const THEME_STORAGE_KEY = 'glam_blocks_theme';

// Track active media listener for 'system' mode cleanup
let systemMediaListener: ((e: MediaQueryListEvent) => void) | null = null;

/**
 * Returns initial theme preference by checking localStorage first,
 * then falling back to system preference.
 */
export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'system';
  }

  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // localStorage unavailable (e.g. sandbox or security block)
  }

  return 'system';
}

/**
 * Resolves whether the active visual presentation should be dark.
 */
export function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

/**
 * Applies all CSS variables for the given ThemeMode directly to document.documentElement.
 */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const isDark = resolveIsDark(mode);
  const activeColors = isDark ? darkTheme : lightTheme;

  // 1. Toggle dark class on root element
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // 2. Set all CSS custom properties
  root.style.setProperty('--bg-primary', activeColors.bgPrimary);
  root.style.setProperty('--bg-secondary', activeColors.bgSecondary);
  root.style.setProperty('--bg-surface', activeColors.bgSurface);
  root.style.setProperty('--bg-board', activeColors.bgBoard);
  root.style.setProperty('--bg-cell-empty', activeColors.bgCellEmpty);
  root.style.setProperty('--bg-cell-empty-hover', activeColors.bgCellEmptyHover);
  root.style.setProperty('--text-primary', activeColors.textPrimary);
  root.style.setProperty('--text-secondary', activeColors.textSecondary);
  root.style.setProperty('--text-muted', activeColors.textMuted);
  root.style.setProperty('--accent-primary', activeColors.accentPrimary);
  root.style.setProperty('--accent-hover', activeColors.accentHover);
  root.style.setProperty('--accent-glow', activeColors.accentGlow);
  root.style.setProperty('--gold-accent', activeColors.goldAccent);
  root.style.setProperty('--gold-glow', activeColors.goldGlow);
  root.style.setProperty('--border-subtle', activeColors.borderSubtle);
  root.style.setProperty('--border-card', activeColors.borderCard);
  root.style.setProperty('--border-focus', activeColors.borderFocus);
  root.style.setProperty('--glass-bg', activeColors.glassBg);
  root.style.setProperty('--glass-border', activeColors.glassBorder);
  root.style.setProperty('--shadow-card', activeColors.shadowCard);
  root.style.setProperty('--shadow-button', activeColors.shadowButton);
  root.style.setProperty('--shadow-gold', activeColors.shadowGold);
  root.style.setProperty('--tray-bg', activeColors.trayBg);
  root.style.setProperty('--tray-border', activeColors.trayBorder);
  root.style.setProperty('--modal-backdrop', activeColors.modalBackdrop);
  root.style.setProperty('--color-success', activeColors.success);
  root.style.setProperty('--color-warning', activeColors.warning);
  root.style.setProperty('--color-danger', activeColors.danger);
  root.style.setProperty('--color-info', activeColors.info);

  // 3. Set meta theme-color for mobile address bars
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', activeColors.metaThemeColor);

  // 4. Persist to localStorage
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Ignore storage errors
  }

  // 5. Handle system preference listener
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Clean up existing listener if present
    if (systemMediaListener) {
      mediaQuery.removeEventListener('change', systemMediaListener);
      systemMediaListener = null;
    }

    if (mode === 'system') {
      systemMediaListener = () => {
        applyTheme('system');
      };
      mediaQuery.addEventListener('change', systemMediaListener);
    }
  }
}
