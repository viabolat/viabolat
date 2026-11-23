/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,njk}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "Geist Fallback", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // Warm ink for the dark bookends (hero, contact).
        ink: { 950: "#0d0d0c" },
        // Warm neutral ramp: every text-gray-* / border-gray-* tints toward paper and ink.
        gray: {
          50: "#faf9f6",
          100: "#f1efe9",
          200: "#d9d5ca",
          300: "#c2bdb0",
          400: "#a29e92",
          500: "#7a766b",
          600: "#57534a",
          700: "#3f3c35",
          800: "#2a2823",
          900: "#1a1916",
        },
        // The one accent: amber. 300-400 sit on dark, 600-800 carry text on light (>= 4.5:1).
        primary: {
          50: "#fbf6e9",
          100: "#f5eac9",
          200: "#ecd597",
          300: "#e0b45a",
          400: "#c9a24d",
          500: "#a8741a",
          600: "#8a5a00",
          700: "#6f4800",
          800: "#573800",
          900: "#3d2800",
        },
        // Retired hue: kept only as neutrals so any leftover class stays in palette.
        secondary: {
          50: "#faf9f6", 100: "#f1efe9", 200: "#e3e0d8", 300: "#cdc9be", 400: "#a29e92",
          500: "#7a766b", 600: "#57534a", 700: "#3f3c35", 800: "#2a2823", 900: "#1a1916",
        },
      },
    },
  },
  plugins: [],
};
