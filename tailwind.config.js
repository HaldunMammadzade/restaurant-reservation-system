/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./presentation/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#6366F1',
          dark: '#4338CA',
          light: '#818CF8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
          dark: '#0F172A',
          'dark-secondary': '#1E293B',
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          violet: '#8B5CF6',
          cyan: '#06B6D4',
        },
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)',
        'premium-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 20px 40px -10px rgba(99, 102, 241, 0.12)',
        'premium-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.05)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-sm': '0 0 10px rgba(99, 102, 241, 0.2)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh': 'radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6, 182, 212, 0.08) 0px, transparent 50%)',
        'sidebar': 'linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'count-up': 'countUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
