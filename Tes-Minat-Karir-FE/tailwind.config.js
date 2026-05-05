/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        accent: '#854836',
        saffron: '#F5B553',
        'accent-dark': '#6d392c',
        'bg-light': '#FDFBFA',
        'surface': '#FFFFFF',
        'border-light': '#E8E0D8',
        'text-primary': '#2C2C2C',
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(133, 72, 54, 0.08)',
        'md-custom': '0 4px 20px rgba(133, 72, 54, 0.12)',
        'lg-custom': '0 20px 40px rgba(133, 72, 54, 0.15)',
        'hover': '0 12px 35px rgba(133, 72, 54, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-ring': 'pulseRing 1.5s ease-in-out infinite',
        'progress-fill': 'progressFill 0.6s ease-out',
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
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      transitionDuration: {
        '350': '350ms',
      },
    },
  },
  plugins: [],
}
