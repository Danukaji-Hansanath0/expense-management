/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'light-bg': '#F6F7FB',
        'light-surface': '#FFFFFF',
        'light-card': '#FFFFFF',
        'light-border': '#E5E7EB',
        
        // Dark theme colors
        'dark-bg': '#0B0E14',
        'dark-surface': '#151A23',
        'dark-card': '#1A202C',
        'dark-border': '#262D3D',
        
        // Primary colors
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        
        // Semantic colors
        income: '#16A34A',
        expense: '#DC2626',
        warning: '#F59E0B',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
}
