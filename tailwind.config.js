/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  safelist: [
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-6',
    'gap-3',
    'gap-4',
    'gap-6',
    'gap-8',
    {
      pattern: /^(bg|text|border)-(gray|white|black)/,
      variants: ['hover', 'dark']
    }
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'landscape': { 'raw': '(orientation: landscape)' },
      'portrait': { 'raw': '(orientation: portrait)' },
      'short': { 'raw': '(max-height: 768px)' }
    },
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
      },
      spacing: {
        'screen-dynamic': 'var(--vh, 100vh)'
      },
      minHeight: {
        'screen-dynamic': 'var(--vh, 100vh)'
      }
    },
  },
  plugins: [],
};