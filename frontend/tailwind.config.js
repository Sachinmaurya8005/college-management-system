/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        polytechnic: {
          50: '#f0f5ff',
          100: '#e0ecff',
          200: '#c7dcff',
          300: '#9ec4fe',
          400: '#6ea3fc',
          500: '#437ef7',
          600: '#255df0',
          700: '#1d48db',
          800: '#1e3cb2',
          900: '#0b2545', // Primary Deep Navy
          950: '#07162c',
        },
        navy: {
          800: '#0e2439',
          850: '#0b1d30',
          900: '#081726',
          950: '#040d16',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(11, 37, 69, 0.06), 0 2px 6px -1px rgba(11, 37, 69, 0.04)',
        'elevated': '0 20px 25px -5px rgba(11, 37, 69, 0.1), 0 10px 10px -5px rgba(11, 37, 69, 0.04)',
      }
    },
  },
  plugins: [],
}
