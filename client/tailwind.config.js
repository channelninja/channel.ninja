/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        error: {
          '0%, 100%': { transform: 'translateX(-5%)' },
          '50%': { transform: 'translateX(5%)' },
        },
        info: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(5%)' },
        },
      },
      animation: {
        error: 'error 0.3s ease-in-out 2',
        info: 'info 0.3s ease-in-out 2',
      },
    },
  },
  plugins: [],
};
