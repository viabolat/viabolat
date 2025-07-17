import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E4002B', // Romanian Red
        secondary: '#FCD116', // Romanian Yellow
        accent: '#002B7F', // Romanian Blue
        dark: '#1A1A2E',
        light: '#F8F9FA',
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
