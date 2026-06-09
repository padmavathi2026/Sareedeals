/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50:  '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          500: '#9b1c1c',
          600: '#7b1a1a',
          700: '#5c1212',
          800: '#450e0e',
          900: '#2d0909',
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#d4af37',
          600: '#b8960c',
          700: '#92740a',
        },
        cream: {
          50:  '#fffdf7',
          100: '#fff8f0',
          200: '#fef0d9',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Poppins', 'system-ui', 'sans-serif'],
      },
      aspectRatio: {
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [],
};
