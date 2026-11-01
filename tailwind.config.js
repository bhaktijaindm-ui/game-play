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
        'game-rosegold': 'var(--color-secondary)',
        'game-accent': 'var(--color-accent)',
        'game-champagne': 'var(--color-accent)',
        'game-text': 'var(--color-text)',
        'game-muted': 'var(--color-muted)',
        'game-success': 'var(--color-success)',
        'game-danger': 'var(--color-danger)',
        'game-border': 'var(--color-border)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['"Playfair Display"', 'Fredoka', 'serif'],
        body: ['"Plus Jakarta Sans"', 'Poppins', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 6px 20px -2px rgba(42, 22, 37, 0.06)',
        'soft-lg': '0 12px 32px -4px rgba(42, 22, 37, 0.1)',
        'luxury': '0 14px 36px -6px rgba(194, 24, 91, 0.2), 0 4px 12px -2px rgba(42, 22, 37, 0.06)',
        'rosegold': '0 8px 24px -4px rgba(197, 131, 123, 0.35)',
        'glossy-pink': '0 10px 25px -4px rgba(194, 24, 91, 0.35)',
        'glossy-gold': '0 10px 25px -4px rgba(212, 175, 55, 0.35)',
        'inner-gloss': 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'sparkle': 'sparkle 0.6s ease-out forwards',
        'pop': 'pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'coin-float': 'coinFloat 1.2s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.92' },
          '50%': { transform: 'scale(1.03)', opacity: '1' },
        },
        sparkle: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.25) rotate(90deg)', opacity: '1' },
          '100%': { transform: 'scale(0.85) rotate(180deg)', opacity: '0' },
        },
        pop: {
          '0%': { transform: 'scale(0.88)' },
          '70%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
        coinFloat: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.8)' },
          '20%': { opacity: '1', transform: 'translateY(0px) scale(1.1)' },
          '80%': { opacity: '1', transform: 'translateY(-18px) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-30px) scale(0.9)' },
        },
      },
    },
  },
  plugins: [],
};
