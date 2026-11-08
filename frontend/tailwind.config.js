/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SRI BALAJI – ROYAL IMPERIAL BRAND COLOUR IDENTITY

        // 1. PRIMARY – DEEP IMPERIAL PURPLE
        imperial: {
          DEFAULT: '#28143F', // Suggested Primary
          secondary: '#392052', // Secondary Purple
          dark: '#190D2B', // Dark Purple
          soft: '#51336B', // Soft Purple
          light: '#6D468E',
          border: '#42255F',
        },
        plum: {
          DEFAULT: '#28143F',
          50: '#F8F5FB',
          100: '#F0EBF7',
          200: '#DFD3EE',
          300: '#C4B0E0',
          400: '#A184CD',
          500: '#7B54B4',
          600: '#51336B', // Soft Purple
          700: '#392052', // Secondary Purple
          800: '#2E1749',
          900: '#28143F', // Primary Imperial Purple
          950: '#190D2B', // Darkest Purple
        },

        // 2. SECONDARY – RADIANT SAFFRON GOLD
        gold: {
          DEFAULT: '#F4C45E', // Primary Gold
          50: '#FFFDF7',
          100: '#FFF8EB',
          200: '#FFE7A3', // Light Gold
          300: '#FAD77B',
          400: '#F4C45E', // Primary Gold
          500: '#E5B242',
          600: '#D6A52D', // Rich Gold
          700: '#A97819', // Deep Gold
          800: '#865C0F',
          900: '#664407',
          light: '#FFE7A3',
          rich: '#D6A52D',
          deep: '#A97819',
        },
        turmeric: {
          DEFAULT: '#F4C45E', // Primary Gold alias
          50: '#FFFDF7',
          100: '#FFF8EB',
          200: '#FFE7A3',
          300: '#FAD77B',
          400: '#F4C45E',
          500: '#E5B242',
          600: '#D6A52D',
          700: '#A97819',
          800: '#865C0F',
          900: '#664407',
        },
        saffron: {
          DEFAULT: '#F4C45E',
          light: '#FFE7A3',
          rich: '#D6A52D',
          deep: '#A97819',
        },

        // 3. DETAIL – EMERALD GREEN
        emerald: {
          DEFAULT: '#126044', // Primary Emerald
          50: '#F0FDF7',
          100: '#DCFCEE',
          200: '#BBF7DC',
          300: '#86EFC1',
          400: '#72A88A', // Soft Emerald
          500: '#126044', // Primary Emerald
          600: '#0E5039',
          700: '#0B4433', // Deep Emerald
          800: '#083528',
          900: '#05261C',
          950: '#02140F',
          primary: '#126044',
          deep: '#0B4433',
          soft: '#72A88A',
        },
        pista: {
          DEFAULT: '#126044',
          50: '#F0FDF7',
          100: '#DCFCEE',
          200: '#BBF7DC',
          300: '#86EFC1',
          400: '#72A88A',
          500: '#126044',
          600: '#0E5039',
          700: '#0B4433',
          800: '#083528',
          900: '#05261C',
        },

        // 4. SUPPORTING NEUTRAL COLOURS
        ivory: {
          DEFAULT: '#FFF8EB', // Warm Ivory
          light: '#FFFFFF', // Soft White
          warm: '#FFF5E3',
          dark: '#F5EBD8', // Cream
          border: '#EEDDC4',
        },
        cream: {
          DEFAULT: '#F5EBD8', // Cream
          warm: '#FFF8EB', // Warm Ivory
          surface: '#FBF4E7',
          border: '#E5D3B8',
        },
        cocoa: {
          DEFAULT: '#392C28', // Cocoa Brown
          dark: '#271D1A',
          muted: '#68544E',
          light: '#9C857E',
        },
        spice: {
          DEFAULT: '#392C28',
          dark: '#271D1A',
          muted: '#68544E',
          light: '#9C857E',
        },

        // Action Tone Aliases & Pure Veg
        chilli: {
          DEFAULT: '#D6A52D', // Remapped to Rich Saffron Gold to remove old burgundy/orange
          50: '#FFF8EB',
          100: '#FFE7A3',
          200: '#FAD77B',
          300: '#F4C45E',
          400: '#E5B242',
          500: '#D6A52D',
          600: '#A97819',
          700: '#28143F',
          800: '#190D2B',
          900: '#190D2B',
        },
        peach: {
          DEFAULT: '#FFE7A3',
          50: '#FFFDF7',
          100: '#FFF8EB',
          200: '#FFE7A3',
          300: '#FAD77B',
          400: '#F4C45E',
          500: '#D6A52D',
        },
        brand: {
          50: '#F8F5FB',
          100: '#F0EBF7',
          200: '#FFE7A3',
          300: '#F4C45E',
          400: '#D6A52D',
          500: '#28143F',
          600: '#392052',
          700: '#190D2B',
          800: '#190D2B',
          900: '#190D2B',
        },
        crimson: {
          50: '#FFF8EB',
          100: '#FFE7A3',
          200: '#FAD77B',
          600: '#D6A52D',
          700: '#A97819',
          800: '#28143F',
          900: '#190D2B',
        },
        veg: {
          DEFAULT: '#126044',
          bg: '#DCFCEE',
          border: '#72A88A',
        }
      },
      fontFamily: {
        sans: ['"Manrope"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        oriya: ['"Noto Sans Oriya"', 'sans-serif'],
        telugu: ['"Noto Sans Telugu"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(40, 20, 63, 0.08)',
        'elevated': '0 12px 32px -4px rgba(40, 20, 63, 0.16)',
        'glow': '0 0 30px rgba(244, 196, 94, 0.45)',
        'gold': '0 8px 24px -4px rgba(214, 165, 45, 0.35)',
        'royal': '0 14px 36px -4px rgba(25, 13, 43, 0.50)',
        'chilli': '0 8px 24px -4px rgba(214, 165, 45, 0.35)',
        'plum': '0 12px 32px -4px rgba(40, 20, 63, 0.45)',
        'emerald': '0 8px 24px -4px rgba(18, 96, 68, 0.30)',
      }
    },
  },
  plugins: [],
}
