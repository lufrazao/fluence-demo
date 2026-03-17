/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fintech: { 50: '#f0f0ff', 100: '#e0e0ff', 200: '#c4b5fd', 400: '#8b5cf6', 500: '#7c3aed', 600: '#6d28d9', 700: '#5b21b6', 800: '#4c1d95' },
        travel: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', accent: '#f472b6' },
        shop: { 50: '#fff7ed', 100: '#ffedd5', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', accent: '#10b981' },
        fluence: { 50: '#f0fdfa', 100: '#ccfbf1', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488' },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
    },
  },
  plugins: [],
}
