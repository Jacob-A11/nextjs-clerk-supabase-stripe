// postcss.config.mjs
// Minimal, stable PostCSS config for Tailwind CSS v4 + Next.js 16
// Ensures proper CSS processing with autoprefixer support.

export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};