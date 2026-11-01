import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemePreference;
  isDark: boolean;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDark: false,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    try {
      const stored = localStorage.getItem('glam_blocks_theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // ignore
    }
    return 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const updateThemeClass = () => {
      let activeIsDark = false;
      if (theme === 'system') {
        activeIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        activeIsDark = theme === 'dark';
      }

      setIsDark(activeIsDark);
      const root = document.documentElement;
      if (activeIsDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Update theme-color meta tag
      const meta = document.getElementById('theme-color-meta');
      if (meta) {
        meta.setAttribute('content', activeIsDark ? '#17101C' : '#FFF5F8');
      }
    };

    updateThemeClass();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => updateThemeClass();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const setTheme = (newTheme: ThemePreference) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('glam_blocks_theme', newTheme);
    } catch {
      // storage unavailable
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
