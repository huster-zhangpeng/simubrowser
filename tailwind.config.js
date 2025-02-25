/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#1a1a1a',
        darkSecondary: '#2d2d2d',
        darkBorder: '#404040',
        darkText: '#e5e5e5',
        lightBg: '#ffffff',
        lightSecondary: '#f3f4f6',
        lightBorder: '#e5e7eb',
        lightText: '#111827',
        primary: {
          light: '#4f46e5',
          dark: '#6366f1'
        },
        secondary: {
          light: '#9ca3af',
          dark: '#6b7280'
        }
      }
    },
  },
  plugins: [],
};