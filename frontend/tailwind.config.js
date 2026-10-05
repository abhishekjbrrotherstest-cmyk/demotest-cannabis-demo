/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6F1',
          100: '#DCEDE2',
          200: '#B9D9C5',
          300: '#8ABFA3',
          400: '#56A07E',
          500: '#2D6A4F',
          600: '#255A42',
          700: '#1B4332',
          800: '#16382A',
          900: '#102A20',
          DEFAULT: '#1B4332',
        },
        gold: {
          50: '#FDF7ED',
          100: '#FAECD6',
          200: '#F2D8A9',
          300: '#E7C184',
          400: '#D4A373',
          500: '#C99659',
          600: '#B5824A',
          DEFAULT: '#D4A373',
        },
        cream: {
          DEFAULT: '#FEFAE0',
          50: '#FFFDF5',
          100: '#FEFAE0',
          200: '#F6EEC7',
          300: '#ECE1AC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(16, 42, 32, 0.08)',
        lift: '0 12px 32px rgba(16, 42, 32, 0.14)',
      },
    },
  },
  plugins: [],
};