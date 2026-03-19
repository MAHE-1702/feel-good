/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        dm: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        bg: '#F7F4EF',
        surface: '#FFFFFF',
        primary: '#2C5F6E',
        accent: '#C4956A',
        ink: '#1A2B35',
        muted: '#6B8A99',
        border: '#E2DDD6',
        heroBg: '#1A3240',
      },
    },
  },
  plugins: [],
}
