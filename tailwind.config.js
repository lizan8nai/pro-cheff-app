/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f5fbff',
          100: '#e9f6ff',
          200: '#cfeaff',
          300: '#a6d8ff',
          400: '#73bfff',
          500: '#3ea4ff',
          600: '#198aff',
          700: '#0b6e3e',
          800: '#095ab6',
          900: '#0a4b91',
        },
      },
      boxShadow: {
        glass:
          '0 8px 30px rgba(2, 6, 23, .20), inset 0 1px 0 rgba(255,255,255,.04)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};