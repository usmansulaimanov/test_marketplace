import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
        brand: {
          50: '#fff1f0',
          100: '#ffe1df',
          500: '#f14635', // Kaspi signature red
          600: '#e03221',
          700: '#be2213',
        },
        surface: {
          bg: '#f7f8fa',
          card: '#ffffff',
          border: '#eef0f3',
          muted: '#8c95a6',
          dark: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
