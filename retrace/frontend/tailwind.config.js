/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        surface: '#FFFFFF',
        background: '#F5F5F7',
        primary: '#000000',
        secondary: '#6E6E73',
        accent: '#0071E3',
        border: '#D2D2D7',
      },
      borderRadius: {
        'button': '8px',
        'input': '8px',
        'card': '16px',
        'image': '12px',
        'pill': '100px',
      },
      spacing: {
        'unit': '8px',
        'gutter': '24px',
        'stack-sm': '12px',
        'stack-md': '32px',
        'stack-lg': '64px',
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
