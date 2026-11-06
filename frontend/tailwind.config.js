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
          50: '#FDF8F3',
          100: '#F9EDE0',
          200: '#F2D7BF',
          300: '#E7B893',
          400: '#D99163',
          500: '#C86B33',
          600: '#B04F22',
          700: '#943A19',
          800: '#792D17',
          900: '#642617',
        },
        crimson: {
          50: '#FDF2F2',
          100: '#FDE8E8',
          200: '#FBD5D5',
          600: '#C81E1E',
          700: '#9B1C1C',
          800: '#771D1D',
          900: '#611717',
        },
        gold: {
          50: '#FEFDF8',
          100: '#FDF9E7',
          200: '#FAF0C3',
          300: '#F5E397',
          400: '#EFCF5E',
          500: '#E5B826',
          600: '#C99818',
          700: '#9F7113',
          800: '#7D5715',
        },
        cream: {
          DEFAULT: '#FFFDF9',
          warm: '#FAF6EE',
          surface: '#F5EEDB',
          border: '#E8DEC8',
        },
        spice: {
          DEFAULT: '#2A1810',
          dark: '#1A0E0A',
          muted: '#5C473E',
          light: '#8C7469',
        },
        veg: {
          DEFAULT: '#16A34A',
          bg: '#DCFCE7',
          border: '#86EFAC',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(42, 24, 16, 0.06)',
        'elevated': '0 12px 32px -4px rgba(42, 24, 16, 0.12)',
        'glow': '0 0 25px rgba(229, 184, 38, 0.35)',
      }
    },
  },
  plugins: [],
}

