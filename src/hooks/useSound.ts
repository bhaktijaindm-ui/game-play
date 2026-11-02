import { useCallback, useEffect, useRef, useState } from 'react';

const SOUND_STORAGE_KEY = 'glam_sound_enabled';
const SOUND_EVENT_NAME = 'glam_sound_toggle';

interface UseSoundResult {
  playPop: () => void;
  playSparkle: () => void;
  playChime: () => void;
  playTaDa: () => void;
  isSoundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

let sharedAudioCtx: AudioContext | null = null;
let audioUnlocked = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }
  }
  return sharedAudioCtx;
}

function unlockAudio() {
  if (audioUnlocked || !sharedAudioCtx) return;

  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().then(() => {
      audioUnlocked = true;
    }).catch(() => {
      // Audio resume will retry on next user interaction
    });
  } else if (sharedAudioCtx.state === 'running') {
    audioUnlocked = true;
  }
}

if (typeof window !== 'undefined') {
  const unlockEvents = ['pointerdown', 'keydown', 'touchstart'];
  const handleUserGesture = () => {
    getAudioContext();
    unlockAudio();
    unlockEvents.forEach((ev) => window.removeEventListener(ev, handleUserGesture));
  };

  unlockEvents.forEach((ev) => {
    window.addEventListener(ev, handleUserGesture, { passive: true });
  });
}

function getStoredSoundPref(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(SOUND_STORAGE_KEY);
  return stored !== 'false';
}

export function useSound(): UseSoundResult {
  const [isEnabled, setIsEnabled] = useState<boolean>(getStoredSoundPref);
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
        setIsEnabled(getStoredSoundPref());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === SOUND_STORAGE_KEY) {
        setIsEnabled(getStoredSoundPref());
      }
    };

    window.addEventListener(SOUND_EVENT_NAME, handleCustomEvent);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(SOUND_EVENT_NAME, handleCustomEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
      window.dispatchEvent(new CustomEvent(SOUND_EVENT_NAME, { detail: enabled }));
    }
  }, []);

  const playPop = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }, []);

  const playSparkle = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
    const noteDuration = 0.15;
    const stagger = 0.045;

    notes.forEach((freq, idx) => {
      const startTime = now + idx * stagger;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.linearRampToValueAtTime(freq * 1.05, startTime + noteDuration);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + noteDuration + 0.02);
    });
  }, []);

  const playChime = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const duration = 0.6;

    chord.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.02);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08 / chord.length, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    });
  }, []);

  const playTaDa = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Intro notes
    const fanfareNotes = [
      { freq: 523.25, start: 0, dur: 0.1 },    // C5
      { freq: 659.25, start: 0.1, dur: 0.1 },  // E5
      { freq: 783.99, start: 0.2, dur: 0.12 }, // G5
    ];

    fanfareNotes.forEach(({ freq, start, dur }) => {
      const noteTime = now + start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + dur + 0.02);
    });

    // Final triumphant chord
    const finalChordTime = now + 0.32;
    const finalChord = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5 major high chord
    const finalDuration = 0.65;

    finalChord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, finalChordTime);

      gain.gain.setValueAtTime(0.001, finalChordTime);
      gain.gain.linearRampToValueAtTime(0.16 / finalChord.length, finalChordTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, finalChordTime + finalDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(finalChordTime);
      osc.stop(finalChordTime + finalDuration + 0.05);
    });
  }, []);

  return {
    playPop,
    playSparkle,
    playChime,
    playTaDa,
    isSoundEnabled: isEnabled,
    setSoundEnabled,
  };
}
