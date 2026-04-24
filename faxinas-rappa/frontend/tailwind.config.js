/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#e6e9f7',
          100: '#c0c7ed',
          200: '#96a3e0',
          300: '#6b7ed3',
          400: '#4a61c9',
          500: '#2944bf',
          600: '#1e3aaa',
          700: '#132f96',
          800: '#082482',
          900: '#03045e',
        }
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}