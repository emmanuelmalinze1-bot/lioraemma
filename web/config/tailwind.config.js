/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0e17',
          card: '#0d111c',
          panel: '#131722',
          border: '#1f2430',
          auth: '#121018',
          input: '#17141d',
        },
        gold: {
          DEFAULT: '#e5b84d',
          hover: '#d4a73e',
          light: '#F3C75A',
          dark: '#D49F28',
          text: '#EBD196',
          border: '#B88A1B',
        },
        inputborder: '#3D3527',
        cardborder: '#26232B',
        muted: '#8b95a5',
        success: '#00d26a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        glossy:
          'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.5)',
        'input-inset': 'inset 0 2px 4px rgba(0,0,0,0.2)',
        'auth-card': '0 20px 50px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
