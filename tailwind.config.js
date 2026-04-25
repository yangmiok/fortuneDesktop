/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdecd3',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        fortune: {
          gold: '#d4af37',
          red: '#dc2626',
          dark: '#1f2937',
        }
      },
      fontFamily: {
        'chinese': ['PingFang SC', 'Microsoft YaHei', 'SimHei', 'sans-serif'],
      }
    },
  },
  plugins: [],
}