/**** Tailwind Config ****/
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0b0f12',
          green: '#00ff99',
          cyan: '#7de3f7',
          yellow: '#e7e247',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 10px rgba(57,255,20,.35), 0 0 40px rgba(57,255,20,.15)'
      }
    },
  },
  plugins: [],
}
