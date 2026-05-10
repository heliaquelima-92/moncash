import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'moncash': {
          'lime': '#D5FF40',
          'lime-dark': '#b8e030',
          'lime-glow': 'rgba(213, 255, 64, 0.15)',
          'gray': '#C0C2B8',
          'gray-dark': '#8a8c84',
          'dark': '#0a0a0a',
          'darker': '#050505',
          'card': '#111111',
          'card-hover': '#1a1a1a',
          'border': '#1f1f1f',
          'border-light': '#2a2a2a',
          'white': '#FFFFFF',
          'text': '#FFFFFF',
          'text-muted': '#888888',
          'text-secondary': '#C0C2B8',
          'success': '#4ade80',
          'error': '#f87171',
          'warning': '#fbbf24',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-lime': 'pulseLime 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseLime: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(213, 255, 64, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(213, 255, 64, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;