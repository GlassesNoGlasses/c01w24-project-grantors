/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['SF-Compact-Rounded-Regular']
    },
    fontSize: {
      sm: '1rem',
      base: '1.25rem',
      lg: '1.55rem',
      xl: '1.8rem',
      '2xl': '2rem',
      '3xl': '2.5rem',
      '4xl': '3rem',
      '5xl': '4rem',
    },
    extend: {},
  },
  plugins: [],
}

