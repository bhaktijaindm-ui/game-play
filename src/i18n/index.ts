/**
 * Glam Blocks - Internationalization (i18n) Provider & Translation Hook
 * Lightweight, zero-dependency translation engine with:
 * - Nested dot-notation resolution (e.g., t('game.powerups.bomb'))
 * - Interpolation for variables (e.g., t('game.comboMultiplier', { count: 3 }))
 * - React Context & useTranslation hook
 * - Standalone t() helper for non-React modules
 * - LocalStorage persistence and browser locale detection
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode, FC } from 'react';
import enTranslations from './en.json';

export type TranslationDictionary = typeof enTranslations;

export type SupportedLocale = 'en' | 'hi';

const translationsRegistry: Record<string, Record<string, unknown>> = {
  en: enTranslations as unknown as Record<string, unknown>,
};

/**
 * Register an additional language dictionary dynamically
 */
export function registerLocale(locale: string, dictionary: Record<string, unknown>): void {
  translationsRegistry[locale] = dictionary;
}

/**
 * Resolves a nested dot-notation string in a dictionary object.
 * e.g., getNestedValue({ a: { b: "hello" } }, 'a.b') => "hello"
 */
function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;

  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Replaces {variable} tokens within a template string.
 */
function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return key in params ? String(params[key]) : match;
  });
}

/**
 * Core translation resolver
 */
export function translate(
  key: string,
  params?: Record<string, string | number>,
  locale: string = 'en'
): string {
  const activeDict = translationsRegistry[locale] || translationsRegistry.en;
  let value = getNestedValue(activeDict, key);

  // Fallback to English dictionary if missing in current locale
  if (value === undefined && locale !== 'en') {
    value = getNestedValue(translationsRegistry.en, key);
  }

  if (typeof value === 'string') {
    return interpolate(value, params);
  }

  // If path resolved to non-string (e.g. object or undefined), return the key itself as safe fallback
  return key;
}

/**
 * Standalone translation function defaulting to English or stored locale
 */
export function t(key: string, params?: Record<string, string | number>): string {
  let storedLocale = 'en';
  if (typeof window !== 'undefined') {
    try {
      storedLocale = localStorage.getItem('glam_blocks_locale') || 'en';
    } catch {
      storedLocale = 'en';
    }
  }
  return translate(key, params, storedLocale);
}

export interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key, params) => translate(key, params, 'en'),
});

const LOCALE_STORAGE_KEY = 'glam_blocks_locale';

export function detectBrowserLocale(): string {
  if (typeof window === 'undefined') return 'en';
  try {
    const navLang = (navigator.language || 'en').toLowerCase();
    if (navLang.startsWith('hi')) {
      return 'hi';
    }
  } catch {
    // Default to en
  }
  return 'en';
}

export interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: string;
}

export const I18nProvider: FC<I18nProviderProps> = ({ children, initialLocale }) => {
  const [locale, setLocaleState] = useState<string>(() => {
    if (initialLocale) return initialLocale;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
        if (saved) return saved;
      } catch {
        // storage disabled
      }
      return detectBrowserLocale();
    }
    return 'en';
  });

  const setLocale = useCallback((newLocale: string) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      } catch {
        // storage error ignored
      }
    }
  }, []);

  const translateFn = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return translate(key, params, locale);
    },
    [locale]
  );

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t: translateFn,
    }),
    [locale, setLocale, translateFn]
  );

  return React.createElement(I18nContext.Provider, { value: contextValue }, children);
};

/**
 * React hook to access translations and locale controls
 */
export function useTranslation(): I18nContextType {
  return useContext(I18nContext);
}
