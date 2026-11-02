/**
 * Glam Blocks: The Gulab Mahal Salon
 * Theme System & CSS Custom Properties
 * 1. "Glam Day" (Default Light Theme)
 * 2. "Glam Night" (Dark Theme)
 * 
 * Supports dynamic CSS variable injection, system preference tracking,
 * and high-contrast WCAG AA compliance.
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
  boardFrame: string;
  boardCheckerA: string;
  boardCheckerB: string;
  darkBar: string;
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
  energy: string;
  info: string;
  metaThemeColor: string;
}

export const lightTheme: ThemeColors = {
  name: 'Glam Day',
  bgPrimary: '#FFF5F8',
  bgSecondary: '#FFF4E4',
  bgSurface: '#FFFFFF',
  bgBoard: '#FCE4EC',
  bgCellEmpty: '#96BAEB',
  bgCellEmptyHover: '#A9C6F2',
  boardFrame: '#6FADD4',
  boardCheckerA: '#96BAEB',
  boardCheckerB: '#A9C6F2',
  darkBar: 'rgba(25, 18, 40, 0.72)',
  textPrimary: '#2A1630',
  textSecondary: '#6A3FC8',
  textMuted: '#7A6283',
  accentPrimary: '#E6177F',
  accentHover: '#CC0F6F',
  accentGlow: 'rgba(230, 23, 127, 0.35)',
  goldAccent: '#F5B53C',
  goldGlow: 'rgba(245, 181, 60, 0.40)',
  borderSubtle: 'rgba(230, 23, 127, 0.15)',
  borderCard: '#F3D3E1',
  borderFocus: '#E6177F',
  glassBg: 'rgba(255, 255, 255, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.60)',
  shadowCard: '0 8px 24px rgba(106, 63, 200, 0.14)',
  shadowButton: '0 4px 14px rgba(230, 23, 127, 0.35)',
  shadowGold: '0 4px 16px rgba(245, 181, 60, 0.35)',
  trayBg: 'rgba(255, 255, 255, 0.75)',
  trayBorder: 'rgba(111, 173, 212, 0.40)',
  modalBackdrop: 'rgba(25, 18, 40, 0.65)',
  success: '#3FBF4F',
  warning: '#F59E0B',
  danger: '#FF4F7B',
  energy: '#3DA9FC',
  info: '#3DA9FC',
  metaThemeColor: '#FFF5F8',
};

export const darkTheme: ThemeColors = {
  name: 'Glam Night',
  bgPrimary: '#140E26',
  bgSecondary: '#231A45',
  bgSurface: '#231A45',
  bgBoard: '#1A1233',
  bgCellEmpty: '#2C3A66',
  bgCellEmptyHover: '#35467A',
  boardFrame: '#3D5E86',
  boardCheckerA: '#2C3A66',
  boardCheckerB: '#35467A',
  darkBar: 'rgba(14, 10, 24, 0.85)',
  textPrimary: '#F8EBFA',
  textSecondary: '#B28CFF',
  textMuted: '#B7A3C2',
  accentPrimary: '#FF4FA8',
  accentHover: '#FF73BA',
  accentGlow: 'rgba(255, 79, 168, 0.45)',
  goldAccent: '#FFD166',
  goldGlow: 'rgba(255, 209, 102, 0.45)',
  borderSubtle: 'rgba(178, 140, 255, 0.20)',
  borderCard: '#3D5E86',
  borderFocus: '#FF4FA8',
  glassBg: 'rgba(35, 26, 69, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  shadowCard: '0 8px 28px rgba(0, 0, 0, 0.55)',
  shadowButton: '0 4px 14px rgba(255, 79, 168, 0.30)',
  shadowGold: '0 4px 16px rgba(255, 209, 102, 0.30)',
  trayBg: 'rgba(35, 26, 69, 0.70)',
  trayBorder: 'rgba(61, 94, 134, 0.45)',
  modalBackdrop: 'rgba(10, 6, 20, 0.85)',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#FF658E',
  energy: '#60A5FA',
  info: '#60A5FA',
  metaThemeColor: '#140E26',
};

export const theme = {
  light: lightTheme,
  dark: darkTheme,
  fonts: {
    heading: "'Fredoka', 'Poppins', sans-serif",
    body: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'Fredoka', Consolas, monospace",
  },
  radii: {
    panel: '24px',
    button: '18px',
    cell: '10px',
    full: '9999px',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

const THEME_STORAGE_KEY = 'glam_blocks_theme';

let systemMediaListener: ((e: MediaQueryListEvent) => void) | null = null;

export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'system';
  }

  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem('glam_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // localStorage unavailable
  }

  return 'system';
}

export function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const isDark = resolveIsDark(mode);
  const activeColors = isDark ? darkTheme : lightTheme;

  // Toggle dark class
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Set CSS variables
  root.style.setProperty('--bg', activeColors.bgPrimary);
  root.style.setProperty('--bg-primary', activeColors.bgPrimary);
  root.style.setProperty('--bg-secondary', activeColors.bgSecondary);
  root.style.setProperty('--bg-surface', activeColors.bgSurface);
  root.style.setProperty('--bg-board', activeColors.bgBoard);
  root.style.setProperty('--bg-cell-empty', activeColors.bgCellEmpty);
  root.style.setProperty('--bg-cell-empty-hover', activeColors.bgCellEmptyHover);
  root.style.setProperty('--board-frame', activeColors.boardFrame);
  root.style.setProperty('--board-checker-a', activeColors.boardCheckerA);
  root.style.setProperty('--board-checker-b', activeColors.boardCheckerB);
  root.style.setProperty('--dark-bar', activeColors.darkBar);
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
  root.style.setProperty('--color-energy', activeColors.energy);
  root.style.setProperty('--color-info', activeColors.info);

  // Meta theme-color
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', activeColors.metaThemeColor);

  // Persist
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    localStorage.setItem('glam_theme', mode);
  } catch {}

  // System listener
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
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
