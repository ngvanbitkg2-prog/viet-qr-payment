/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        dark: {
          900: '#1A1A1A',
          800: '#1E1E1E',
          700: '#252525',
          600: '#2A2A2A',
          500: '#333333',
          400: '#3D3D3D',
        },
        // Gold accent
        gold: {
          400: '#FFD54F',
          500: '#FFC107',
          600: '#F5B300',
          700: '#E5A800',
        },
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
          muted: '#A0A0A0',
          disabled: '#6F6F6F',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
        'gradient-card': 'linear-gradient(145deg, #2A2A2A 0%, #252525 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFC107 0%, #F5B300 100%)',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'gold': '0 4px 15px rgba(245, 179, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
