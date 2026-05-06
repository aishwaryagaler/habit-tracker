/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      colors: {
        cream: '#faf8f5',
        stone: {
          50:  '#faf9f7',
          100: '#f2efe9',
          200: '#e5e0d6',
          300: '#d0c8bb',
          400: '#b5aa99',
          500: '#9a8e7c',
          600: '#7e7264',
          700: '#655a4e',
          800: '#4a4139',
          900: '#302b25',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.35s ease both',
        'slide-up':   'slideUp 0.3s ease both',
        'pop':        'pop 0.2s ease both',
        'check':      'check 0.25s ease both',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pop:     { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.12)' }, '100%': { transform: 'scale(1)' } },
        check:   { from: { transform: 'scale(0.8)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
      },
    },
  },
  plugins: [],
}
