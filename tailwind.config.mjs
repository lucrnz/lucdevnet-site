import typographyPlugin from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Exo 2 Variable'", "sans-serif"],
        body: ['Cabin Variable', "sans-serif"],
      },
      screens: {
        ml: '425px',
        print: { raw: "print" }
      }
    }
  },
  plugins: [typographyPlugin]
};
