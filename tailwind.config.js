/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'win95-gray': '#c0c0c0',
        'win95-blue': '#000080',
        'win95-teal': '#008080',
        'win95-light': '#ffffff',
        'win95-dark': '#808080',
        'win95-black': '#0a0a0a',
      },
      fontFamily: {
        'win95': ['"MS Sans Serif"', '"Segoe UI"', 'Tahoma', 'sans-serif'],
        'mono95': ['Fixedsys', '"Courier New"', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}
