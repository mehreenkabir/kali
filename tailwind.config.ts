// Tailwind CSS v4 configuration
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        dreamy: ['var(--font-caveat)', 'Caveat', 'cursive'],
        pixel: ['var(--font-press-start-2p)', 'Press Start 2P', 'monospace'],
      },
      colors: {
        // Atelier (Art World) Colors
        'atelier-dark': '#111111',
        'atelier-light': '#f5f5f5',
        'atelier-gray': '#a0a0a0',
        'atelier-citrus': '#ff8e3c',
        'atelier-violet': '#8a3ffc',
        
        // Mario (Math World) Colors
        'mario-blue': '#5C94FC',
        'mario-red': '#E72F2F',
        'luigi-green': '#46B236',
        'block-yellow': '#FAC000',
        'block-brown': '#A26202',
        
        // Brand Colors
        'brand-dark': '#1a1a1a',
        'brand-text-light': '#f8fafc',
      },
      boxShadow: {
        'pixel-hard': '8px 8px 0px rgba(0, 0, 0, 1)',
        'pixel-hard-sm': '4px 4px 0px rgba(0, 0, 0, 1)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
          pulse: {
            '0%, 100%': {
              opacity: '1',
            },
            '50%': {
              opacity: '.5',
            },
          },
      },
    },
  },
  plugins: [],
};

export default config;