/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'terminal-green': '#00ff41',
      },
      fontFamily: {
        'mono': ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'lightning': 'lightningStrike 0.3s ease-out',
        'thunder-flash': 'thunderFlash 0.5s ease-out',
        'storm-clouds': 'stormClouds 20s ease-in-out infinite',
        'rain-drop': 'rainDrop 1s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};