/ ** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          sm: "2rem",
          lg: "3rem",
          xl: "4rem",
          "2xl": "6rem",
        },
        screens: {
          "2xl": "1440px",
        },
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glass: "var(--shadow-glass)",
        glow: "0 0 20px rgba(0,0,0,0.08)",
      },
      spacing: {
        "rhythm-xs": "var(--rhythm-xs)",
        "rhythm-sm": "var(--rhythm-sm)",
        "rhythm-md": "var(--rhythm-md)",
        "rhythm-lg": "var(--rhythm-lg)",
        "rhythm-xl": "var(--rhythm-xl)",
      },
    },
  },
  plugins: [],
};
