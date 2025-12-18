const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Base colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: '#F4F4F5',
        foreground: 'hsl(var(--foreground))',

        // Brand Colors
        primary: {
          DEFAULT: '#FE6A00',
          dark: '#002082',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: '#FE6A00',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // State Colors
        info: {
          DEFAULT: '#0582F1',
          foreground: 'hsl(var(--info))',
        },
        success: {
          DEFAULT: '#2BC84E',
          foreground: 'hsl(var(--success))',
        },
        warning: {
          DEFAULT: '#F46600',
          foreground: 'hsl(var(--warning))',
        },
        error: {
          DEFAULT: '#F00628',
          foreground: 'hsl(var(--error))',
        },

        // Black and White
        black: {
          1: '#1F1F1F',
        },
        white: '#FFFFFF',

        // Grey Colors
        gray: {
          1: '#C8C8CF',
          2: '#D4D4D8',
          3: '#DFDFE1',
          4: '#E9E9EB',
          5: '#F4F4F5',
        },

        // Legacy colors (kept for compatibility)
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        cabinet: ['CabinetGrotesk-Regular'],
        'cabinet-thin': ['CabinetGrotesk-Thin'],
        'cabinet-extralight': ['CabinetGrotesk-Extralight'],
        'cabinet-light': ['CabinetGrotesk-Light'],
        'cabinet-medium': ['CabinetGrotesk-Medium'],
        'cabinet-bold': ['CabinetGrotesk-Bold'],
        'cabinet-extrabold': ['CabinetGrotesk-Extrabold'],
        'cabinet-black': ['CabinetGrotesk-Black'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
