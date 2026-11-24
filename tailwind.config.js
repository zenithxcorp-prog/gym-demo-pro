/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        obsidian: '#09090B',
        surface: '#111114',
        surfaceLight: '#18181B',
        gold: '#F59E0B',
        goldHover: '#D97706',
      },
    },
  },
  plugins: [],
}
