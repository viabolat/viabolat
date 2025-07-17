import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E4002B', // Romanian Red
        secondary: '#00CC99',
        accent: '#6633FF',
        dark: '#1A1A2E',
        light: '#F8F9FA',
        romanianYellow: '#FCD116',
        romanianBlue: '#002B7F',
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
