/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5A5A40',
        secondary: '#8B8B6F',
        accent: '#D4AF37',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
module.exports = {
  // ...
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
