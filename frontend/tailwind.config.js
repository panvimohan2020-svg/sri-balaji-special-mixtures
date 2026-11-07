/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Sri Balaji Brand Palette — Authenticated from Packaging & Mascot Artwork
        // Primary Jewel Tone: Noble Emerald Green (From Crest & Pure Veg Seal)
        plum: {
          DEFAULT: '#0D3B2E',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#156B48',
          800: '#0E4E36',
          900: '#0A3826',
          950: '#041F14',
        },
        // Secondary Action Tone: Festive Chilli Scarlet (From Ribbon & Spices)
        chilli: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Hero Radiant Atmosphere: Sunlit Turmeric & Saffron Yellow (From Background & Fresh Mixture)
        turmeric: {
          DEFAULT: '#F59E0B',
          50: '#FFFDF0',
          100: '#FEF7C8',
          200: '#FDEE8A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Pista & Curry Leaf Green
        pista: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Sunlit Golden Cream & Warm Saffron Butter Surfaces
        ivory: {
          DEFAULT: '#FFFDF5',
          light: '#FFFEFA',
          warm: '#FFF9E6',
          dark: '#FDECB8',
          border: '#F6DCA0',
        },
        // Roasted Cocoa & Teak Wood (Authentic Snack Table & Deep Typography)
        cocoa: {
          DEFAULT: '#2D1B12',
          dark: '#1C1009',
          muted: '#664B38',
          light: '#9E7E69',
        },
        // Golden Amber & Roasted Crunch Tones
        peach: {
          DEFAULT: '#FED7AA',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
        },

        // Backward compatibility mappings
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#FED7AA',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#DC2626',
          600: '#B91C1C',
          700: '#991B1B',
          800: '#0E4E36',
          900: '#0A3826',
        },
        crimson: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#0E4E36',
          900: '#0A3826',
        },
        gold: {
          50: '#FFFDF0',
          100: '#FEF7C8',
          200: '#FDEE8A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
        },
        cream: {
          DEFAULT: '#FFFDF5',
          warm: '#FFF9E6',
          surface: '#FDF3DA',
          border: '#F6DCA0',
        },
        spice: {
          DEFAULT: '#2D1B12',
          dark: '#1C1009',
          muted: '#664B38',
          light: '#9E7E69',
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
        'soft': '0 4px 20px -2px rgba(10, 56, 38, 0.07)',
        'elevated': '0 12px 32px -4px rgba(10, 56, 38, 0.12)',
        'glow': '0 0 30px rgba(251, 191, 36, 0.45)',
        'chilli': '0 8px 24px -4px rgba(220, 38, 38, 0.35)',
        'plum': '0 12px 32px -4px rgba(4, 31, 20, 0.40)',
      }
    },
  },
  plugins: [],
}
