/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#7C3AED',
          50: '#F5F0FF',
          100: '#EDE0FF',
          500: '#7C3AED',
          600: '#6D28D9',
        },
        pink: { neon: '#FF3EA4' },
        cyan: { neon: '#3DFAFF' },
      },
      animation: {
        'blob': 'blobFloat 6s ease-in-out infinite alternate',
        'scan': 'scanLine 3s linear infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'gradient': 'gradientSlide 4s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'live': 'liveBlink 1.5s ease-in-out infinite',
        'bounce-sm': 'bounceSm 1.5s ease-in-out infinite',
      },
      keyframes: {
        blobFloat: {
          '0%': { transform: 'translate(0,0) scale(1)' },
          '100%': { transform: 'translate(12px,-12px) scale(1.12)' },
        },
        scanLine: {
          '0%': { top: '-5%' },
          '100%': { top: '105%' },
        },
        shimmer: {
          '0%,100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
        },
        gradientSlide: {
          to: { backgroundPosition: '200% center' },
        },
        pulseGlow: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
        liveBlink: {
          '0%,100%': { opacity: 1, boxShadow: '0 0 8px currentColor' },
          '50%': { opacity: 0.3, boxShadow: 'none' },
        },
        bounceSm: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
