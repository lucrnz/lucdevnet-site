import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import robotsTxt from "astro-robots-txt";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const urlBase = "https://lucdev.net";

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3000
  },

  devToolbar: {
    enabled: false
  },

  site: urlBase,

  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  },

  integrations: [
    mdx(),
    sitemap(),
    robotsTxt({
      sitemap: `${urlBase}/sitemap-index.xml`,
      policy: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/404"]
        }
      ]
    })
  ],

  vite: {
    plugins: [tsconfigPaths(), tailwindcss()]
  }
});
