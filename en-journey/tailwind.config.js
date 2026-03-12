/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy:  { DEFAULT: '#0A1628', light: '#1A2E4A', subtle: '#243858' },
        gold:  { DEFAULT: '#C9A227', light: '#D9B84A', dark: '#A8831A' },
        cream: { DEFAULT: '#FAFAF8', warm: '#F5F0E8' },
        stone: { DEFAULT: '#6B7280', light: '#9CA3AF' },
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', 'Georgia', 'serif'],
        sans:  ['"Noto Sans JP"', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
        widest3: '0.3em',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'line-grow': 'lineGrow 1s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        lineGrow: {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
