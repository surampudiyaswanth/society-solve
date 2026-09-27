/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Remap dark utility classes directly to light civic shades
        slate: {
          950: '#F3F7FA', // Canvas page background
          900: '#FFFFFF', // Card surfaces & dialog containers
          850: '#F8FAFC',
          800: '#E2E8F0', // Border divider lines
          700: '#CBD5E1',
          600: '#64748B',
          500: '#64748B',
          400: '#94A3B8', // Placeholder & subtle icons
          300: '#334155', // Body prose
          200: '#1E293B', // Secondary headings
          100: '#0F172A', // Primary headers
          50: '#F8FAFC',
        },
        navy: {
          950: '#F3F7FA',
          900: '#FFFFFF',
          800: '#E2E8F0',
        },
        primary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#009FA6',
          600: '#008389',
          700: '#0F766E',
          900: '#134E4A',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
      }
    },
  },
  plugins: [],
}