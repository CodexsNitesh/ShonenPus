/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: "#D4AF37",
          "gold-light": "#F4E8D0",
          "rose-gold": "#B76E79",
          charcoal: "#1A1A1A",
          navy: "#0F1419",
          cream: "#F8F7F2",
          "light-gray": "#E8E6E1",
          "sage-green": "#9CAF88",
          beige: "#E8DCC8",
          "dark-beige": "#8B7355",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      fontSize: {
        "2xl": "1.875rem",
        "3xl": "2.25rem",
        "4xl": "2.8rem",
        "5xl": "3.5rem",
      },
      letterSpacing: {
        wider: "0.1em",
        widest: "0.15em",
      },
      boxShadow: {
        luxury: "0 10px 40px rgba(0, 0, 0, 0.08)",
        "luxury-md": "0 4px 20px rgba(0, 0, 0, 0.06)",
        "luxury-lg": "0 20px 60px rgba(0, 0, 0, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
