/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wraith-dark': '#0a0a0a',
        'wraith-amber': '#d97706',
        'wraith-copper': '#b45309',
        'wraith-green': '#16a34a',
      },
      fontFamily: {
        'vintage': ['serif'],
      },
      animation: {
        'flicker': 'flicker 2s infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #d97706' },
          '100%': { boxShadow: '0 0 20px #d97706, 0 0 30px #d97706' },
        }
      }
    },
  },
  plugins: [],
}