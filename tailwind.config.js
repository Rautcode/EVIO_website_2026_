/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'evio-navy': '#0A1628',
        'evio-blue': '#00AEEF',
        'evio-amber': '#F59E0B',
        'evio-white': '#FFFFFF',
        'evio-black': '#1A202C',
        'evio-light-gray': '#F4F6F9',
        'evio-border': '#E2E8F0',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'evio-card': '0 4px 24px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        fadeup: 'fadeup 0.8s ease-out forwards',
        kenburns: 'kenburns 10s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeup: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
