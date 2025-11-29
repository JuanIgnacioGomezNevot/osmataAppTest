/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#059669',
          secondary: '#34D399',
          accent: '#A7F3D0',
          dark: '#064E3B',
          light: '#ECFDF5',
        },
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(circle at 20% 25%, rgba(16,185,129,0.25), transparent 40%), radial-gradient(circle at 80% 15%, rgba(52,211,153,0.25), transparent 45%), linear-gradient(135deg, #f0fdf4, #dcfce7)',
        'mesh-dark':
          'radial-gradient(circle at 25% 25%, rgba(16,185,129,0.35), transparent 35%), radial-gradient(circle at 80% 0%, rgba(5,150,105,0.4), transparent 45%), linear-gradient(135deg, #022c22, #064e3b)',
      },
      boxShadow: {
        glow: '0 25px 80px rgba(5,150,105,0.22)',
      },
    },
  },
  plugins: [],
};
