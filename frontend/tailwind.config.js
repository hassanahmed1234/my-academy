/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["'Amiri'", "serif"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      colors: {
        islamic: {
          bg: "#F9FAF7",          // Soft Pearl / Warm Cream Background
          card: "#FFFFFF",        // Pure White Card
          border: "#E2E8F0",      // Light Slate Border
          primary: "#059669",     // Rich Emerald Green
          gold: "#B45309",        // Deep Metallic Amber / Antique Gold
          goldHover: "#D97706",   // Bright Gold Accent
          text: "#0F172A",        // Dark Slate Charcoal Text
          muted: "#64748B",       // Cool Gray Muted Text
        },
      },
    },
  },
  plugins: [],
};