import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from './en.json';
import hiTranslations from './hi.json';

export type Language = 'en' | 'hi';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string, variables?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (k) => k,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('glam_blocks_lang');
      if (saved === 'en' || saved === 'hi') return saved;
      if (navigator.language && navigator.language.startsWith('hi')) return 'hi';
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('glam_blocks_lang', lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (keyPath: string, variables?: Record<string, string | number>): string => {
    const currentDict = language === 'hi' ? hiTranslations : enTranslations;
    const fallbackDict = enTranslations;

    const keys = keyPath.split('.');
    let value: unknown = currentDict;
    let fallbackValue: unknown = fallbackDict;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        value = undefined;
      }
      if (fallbackValue && typeof fallbackValue === 'object' && key in fallbackValue) {
        fallbackValue = (fallbackValue as Record<string, unknown>)[key];
      }
    }

    let result = (typeof value === 'string' ? value : typeof fallbackValue === 'string' ? fallbackValue : keyPath) as string;

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return result;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
