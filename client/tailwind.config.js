/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c3e879',
          50: '#f5fbe9',
          100: '#eaf5d2',
          200: '#d9edaf',
          300: '#cde995',
          400: '#c3e879',
          500: '#a8d55d',
          600: '#85ae48',
          700: '#678738',
          800: '#4c632c',
          900: '#374822',
        },
        secondary: '#89bda6',
        purple: {
          50: '#f5fbe9', 100: '#eaf5d2', 200: '#d9edaf', 300: '#cde995', 400: '#c3e879',
          500: '#a8d55d', 600: '#85ae48', 700: '#678738', 800: '#4c632c', 900: '#374822', 950: '#202a18',
        },
        violet: {
          50: '#f3f8ee', 100: '#e5efda', 200: '#d0e3bc', 300: '#b9d69d', 400: '#a4c985',
          500: '#88b66d', 600: '#6e9959', 700: '#567a47', 800: '#405c37', 900: '#2f452c', 950: '#19271b',
        },
        indigo: {
          50: '#f0f7f3', 100: '#dfede5', 200: '#c4dece', 300: '#a7cdb7', 400: '#8bbda1',
          500: '#6ea688', 600: '#55866c', 700: '#416a56', 800: '#315041', 900: '#243c32', 950: '#12231d',
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        navy: {
          950: '#090d0c',
          900: '#0c1010',
          800: '#121816',
          700: '#18211d',
          600: '#202b25',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        grid: "grid 15s linear infinite",
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
      },
      boxShadow: {
        'glow': '0 0 30px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 60px rgba(139, 92, 246, 0.4)',
        'glow-xl': '0 0 80px rgba(139, 92, 246, 0.5)',
        'inner-glow': 'inset 0 0 30px rgba(139, 92, 246, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
