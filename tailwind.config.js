/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Landing-Page/**/*.html",
    "./CMS/**/*.html",
    "./*.html",
    "./assets/Javascript/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        primaryDark: '#1e40af',
        accent: '#F59E0B',
        bg: '#F8FAFC',
        heading: '#0F172A',
        body: '#475569',
        surface: '#EFF6FF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [],
}
