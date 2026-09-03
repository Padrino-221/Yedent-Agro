import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#233f2e',
          50: '#3a5c49',
          100: '#4a6d59',
          200: '#1a2f23',
        },
        lime: {
          DEFAULT: '#afe67f',
          50: '#f4fbed',
          100: '#e8f6da',
          200: '#d2eeb6',
          300: '#bce692',
          400: '#b9e88d',
          500: '#afe67f',
          600: '#8ccf5a',
          700: '#6ba83c',
          800: '#4f7d2c',
          900: '#374f1f',
        },
        coral: {
          DEFAULT: '#6f6b66',
          50: '#f5f4f2',
          100: '#ebe9e6',
          200: '#d7d4cf',
          300: '#bfbab4',
          400: '#9a948c',
          500: '#6f6b66',
          600: '#5a5652',
          700: '#474440',
        },
        sky: {
          DEFAULT: '#c4c0bc',
          50: '#f7f6f5',
          100: '#efeeec',
          200: '#e0dedb',
          300: '#cfccc7',
          400: '#c4c0bc',
          500: '#a29d96',
          600: '#7f7a73',
          700: '#5f5b56',
        },
        mint: {
          DEFAULT: '#49433c',
          50: '#f2f1ef',
          100: '#e5e3e0',
          200: '#ccc8c2',
          300: '#b0aba3',
          400: '#8a847b',
          500: '#49433c',
          600: '#3a352f',
          700: '#2c2823',
        },
        cream: {
          DEFAULT: '#fffdf7',
          50: '#fffefb',
          100: '#fffdf7',
          200: '#faf6ec',
        },
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'sans-serif'],
        serif: ['var(--font-archivo)', 'sans-serif'],
        body: ['var(--font-archivo)', 'sans-serif'],
        narrow: ['var(--font-archivo-narrow)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '5px',
        lg: '12px',
        xl: '15px',
        md: '10px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
