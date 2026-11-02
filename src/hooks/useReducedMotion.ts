import { useState, useEffect } from 'react';

const STORAGE_KEY = 'glam_reduced_motion';
const EVENT_NAME = 'glam_reduced_motion_change';

function getInitialPreference(): boolean {
  if (typeof window === 'undefined') return false;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    return stored === 'true';
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hook that returns whether reduced motion is preferred,
 * taking into account both the OS setting and user's app-level preference.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(getInitialPreference);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updatePreference = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setPrefersReducedMotion(stored === 'true');
      } else {
        setPrefersReducedMotion(mediaQuery.matches);
      }
    };

    const handleMediaChange = () => {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        setPrefersReducedMotion(mediaQuery.matches);
      }
    };

    const handleCustomChange = () => {
      updatePreference();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        updatePreference();
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    window.addEventListener(EVENT_NAME, handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener(EVENT_NAME, handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Updates the user's reduced motion preference in localStorage and notifies all hooks.
 */
export function setReducedMotionPreference(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: enabled }));
}

/**
 * Clears the user's manual override to follow the system OS setting again.
 */
export function clearReducedMotionPreference(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}
