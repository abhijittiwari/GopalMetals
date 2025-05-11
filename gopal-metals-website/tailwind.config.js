/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d0021b', // Logo red
          50: '#ffe5e7',
          100: '#fbbfc2',
          200: '#f28a8f',
          300: '#ea555c',
          400: '#e22029',
          500: '#d0021b', // main
          600: '#a00115',
          700: '#70010f',
          800: '#400108',
          900: '#200104',
        },
      },
    },
  },
  plugins: [],
}