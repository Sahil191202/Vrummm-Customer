/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        vrumm: {
          deepest: '#051F20',
          deepGreen: '#0B2B26',
          forest: '#163832',
          hunterGreen: '#235347',
          mintSage: '#8EB69B',
          lightest: '#DAF1DE',
        },
      },
      fontFamily: {
        sans: ['PlusJakartaSans_400Regular', 'NotoSansDevanagari_400Regular', 'sans-serif'],
        heading: ['PlusJakartaSans_700Bold', 'NotoSansDevanagari_700Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
