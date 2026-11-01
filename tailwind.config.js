/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'game-bg': 'var(--color-bg)',
        'game-surface': 'var(--color-surface)',
        'game-card': 'var(--color-card)',
        'game-primary': 'var(--color-primary)',
        'game-primary-hover': 'var(--color-primary-hover)',
        'game-secondary': 'var(--color-secondary)',
        'game-accent': 'var(--color-accent)',
        'game-text': 'var(--color-text)',
        'game-muted': 'var(--color-muted)',
        'game-success': 'var(--color-success)',
        'game-danger': 'var(--color-danger)',
        'game-border': 'var(--color-border)',
      },
      fontFamily: {
        heading: ['Fredoka', 'Comic Sans MS', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 8px 24px -4px rgba(43, 27, 46, 0.08)',
        'soft-lg': '0 12px 32px -4px rgba(43, 27, 46, 0.14)',
        'glossy-pink': '0 8px 20px -4px rgba(233, 30, 140, 0.35)',
        'glossy-purple': '0 8px 20px -4px rgba(155, 93, 229, 0.35)',
        'glossy-gold': '0 8px 20px -4px rgba(245, 183, 0, 0.35)',
        'inner-gloss': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'sparkle': 'sparkle 0.6s ease-out forwards',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        sparkle: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.3) rotate(90deg)', opacity: '1' },
          '100%': { transform: 'scale(0.8) rotate(180deg)', opacity: '0' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
