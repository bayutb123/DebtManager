/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          50: '#f3f6ff',
          100: '#e6edff',
          200: '#c4d7ff',
          300: '#9fbfff',
          400: '#6c9eff',
          500: '#3d7dff',
          600: '#2c61db',
          700: '#214bb7',
          800: '#1c3d93',
          900: '#1a3578',
        },
      },
      boxShadow: {
        card: '0 10px 50px -20px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [forms, typography],
};
