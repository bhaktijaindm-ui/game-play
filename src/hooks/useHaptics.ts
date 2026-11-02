import { useCallback, useEffect, useRef, useState } from 'react';

const HAPTICS_STORAGE_KEY = 'glam_haptics_enabled';
const HAPTICS_EVENT_NAME = 'glam_haptics_toggle';

interface UseHapticsResult {
  lightTap: () => void;
  mediumTap: () => void;
  successBuzz: () => void;
  isHapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
}

function getStoredHapticsPref(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(HAPTICS_STORAGE_KEY);
  return stored !== 'false';
}

export function useHaptics(): UseHapticsResult {
  const [isEnabled, setIsEnabled] = useState<boolean>(getStoredHapticsPref);
  const enabledRef = useRef<boolean>(isEnabled);

  useEffect(() => {
    enabledRef.current = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (typeof customEvent.detail === 'boolean') {
        setIsEnabled(customEvent.detail);
      } else {
        setIsEnabled(getStoredHapticsPref());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === HAPTICS_STORAGE_KEY) {
        setIsEnabled(getStoredHapticsPref());
      }
    };

    window.addEventListener(HAPTICS_EVENT_NAME, handleCustomEvent);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(HAPTICS_EVENT_NAME, handleCustomEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const setHapticsEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(HAPTICS_STORAGE_KEY, String(enabled));
      window.dispatchEvent(new CustomEvent(HAPTICS_EVENT_NAME, { detail: enabled }));
    }
  }, []);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!enabledRef.current) return;
    if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Haptics may be blocked by browser policy without active user gesture
      }
    }
  }, []);

  const lightTap = useCallback(() => {
    vibrate(12);
  }, [vibrate]);

  const mediumTap = useCallback(() => {
    vibrate(28);
  }, [vibrate]);

  const successBuzz = useCallback(() => {
    vibrate([25, 45, 35]);
  }, [vibrate]);

  return {
    lightTap,
    mediumTap,
    successBuzz,
    isHapticsEnabled: isEnabled,
    setHapticsEnabled,
  };
}
