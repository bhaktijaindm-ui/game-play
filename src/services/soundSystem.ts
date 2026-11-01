/**
 * Glam Blocks - High-Fidelity Web Audio & Haptic Feedback System
 * Complies strictly with browser autoplay policies: lazily initialized on first interaction.
 */

class SoundAndHapticSystem {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private hapticsEnabled: boolean = true;
  private isUnlocked: boolean = false;

  constructor() {
    // Load persisted preferences
    try {
      const savedSettings = localStorage.getItem('glam_blocks_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (typeof parsed.sound === 'boolean') this.soundEnabled = parsed.sound;
        if (typeof parsed.music === 'boolean') this.musicEnabled = parsed.music;
        if (typeof parsed.haptics === 'boolean') this.hapticsEnabled = parsed.haptics;
      }
    } catch {
      // Fallback defaults
    }

    // Bind unlock listener
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.unlockAudio();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
    }
  }

  public unlockAudio(): void {
    if (this.isUnlocked) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.isUnlocked = true;
      }
    } catch {
      // AudioContext not supported
    }
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
  }

  public setHapticsEnabled(enabled: boolean): void {
    this.hapticsEnabled = enabled;
  }

  public isSoundOn(): boolean {
    return this.soundEnabled;
  }

  public isMusicOn(): boolean {
    return this.musicEnabled;
  }

  public isHapticsOn(): boolean {
    return this.hapticsEnabled;
  }

  /**
   * Soft organic "pop" sound when placing a piece
   */
  public playPop(): void {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Pitch drop creates the cute bubble/pop effect
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Fallback silent
    }

    this.vibrate(15);
  }

  /**
   * Sparkle sound for clearing rows or columns
   */
  public playSparkle(): void {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const frequencies = [659.25, 830.61, 987.77, 1318.51, 1661.22]; // E maj pentatonic sparkles

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.23);
      });
    } catch {
      // Fallback silent
    }

    this.vibrate([25, 30, 35]);
  }

  /**
   * Ascending celebratory chime for combos (multiplier 2x, 3x, 4x, 5x)
   */
  public playCombo(comboMultiplier: number): void {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = 440 * Math.pow(1.15, Math.min(comboMultiplier, 5));
      const chord = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];

      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.04;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.25, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.36);
      });
    } catch {
      // Fallback
    }

    this.vibrate([40, 50, 70]);
  }

  /**
   * Sound effect when activating a power-up (Bomb, Shuffle, Undo)
   */
  public playPowerup(): void {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.18);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.21);
    } catch {
      // Fallback
    }

    this.vibrate(30);
  }

  /**
   * Gentle Game Over chime
   */
  public playGameOver(): void {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 392, 349.23, 293.66]; // A, G, F, D descending

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.26);
      });
    } catch {
      // Fallback
    }

    this.vibrate([60, 60, 100]);
  }

  /**
   * UI Click feedback
   */
  public playClick(): void {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Fallback
    }

    this.vibrate(10);
  }

  /**
   * Trigger device vibration
   */
  public vibrate(pattern: number | number[]): void {
    if (!this.hapticsEnabled) return;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Haptics suppressed by device or OS
      }
    }
  }
}

export const soundSystem = new SoundAndHapticSystem();
