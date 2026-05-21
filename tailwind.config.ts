import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      colors: {
        background: 'rgb(10 14 39)',
        foreground: 'rgb(224 231 255)',

        card: 'rgb(26 31 58)',
        'card-border': 'rgb(42 63 95)',

        primary: 'rgb(6 182 212)',
        'primary-dark': 'rgb(8 145 178)',

        accent: 'rgb(14 165 233)',
        'accent-dark': 'rgb(2 132 199)',

        muted: 'rgb(100 116 139)',

        success: 'rgb(16 185 129)',
        warning: 'rgb(245 158 11)',
        error: 'rgb(239 68 68)',
      },

      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
      },

      boxShadow: {
        glow: '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-lg': '0 0 40px rgba(6, 182, 212, 0.4)',
        'glow-sm': '0 0 10px rgba(6, 182, 212, 0.2)',
      },

      backgroundImage: {
        'gradient-glow':
          'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(14,165,233,0.1) 100%)',
      },

      keyframes: {
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
          },

          '50%': {
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.5)',
          },
        },

        slideIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },

          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        fadeIn: {
          '0%': {
            opacity: '0',
          },

          '100%': {
            opacity: '1',
          },
        },
      },

      animation: {
        glow: 'glow 3s ease-in-out infinite',
        slideIn: 'slideIn 0.3s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
      },
    },
  },

  plugins: [],
};

export default config;