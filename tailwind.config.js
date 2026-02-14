/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cinema-black': '#0f0f0f',
        'cinema-gray': '#1a1a1a',
        'accent': '#3b82f6',
        'accent-dark': '#1d4ed8',
        'accent-gold': '#d4af37',
      },
    },
  },
  plugins: [],
}
