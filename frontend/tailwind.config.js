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
      '6xl': '5rem'
    },
    extend: {
      colors: {
        'grantor-green': 'rgb(141, 229, 100)',
        'dim': 'rgb(0, 0, 0, 0.5)',
        'primary': '#21525c',
        'secondary': "#19859c",
        'magnify-light-blue': 'rgb(235, 244, 244)',
        'magnify-blue': 'rgb(33, 82, 92)',
        'magnify-dark-blue': 'rgb(12, 39, 45)',
      }
    },
    backgroundImage: {
      "home-background": "url('./images/home-bg.png')",
    },
  },
  plugins: [],
}

