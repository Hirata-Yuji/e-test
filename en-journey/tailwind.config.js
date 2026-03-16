/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#C41E3A',
          light:   '#E8435A',
          dark:    '#9A1530',
          pale:    '#FFF0F2',
          muted:   '#F5D5DA',
        },
        warm: {
          white: '#FEFEFE',
          50:    '#FAF9F7',
          100:   '#F5F3F0',
          200:   '#EDE9E3',
        },
        charcoal: { DEFAULT: '#1A1A1A', soft: '#3D3D3D' },
        muted:    { DEFAULT: '#7A7A7A', light: '#A8A8A8' },
        // keep navy/gold for backward compat on inner pages
        navy:  { DEFAULT: '#0A1628', light: '#1A2E4A' },
        gold:  { DEFAULT: '#C9A227' },
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
        'fade-up':   'fadeUp 0.8s ease forwards',
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
