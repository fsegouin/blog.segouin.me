import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.segouin.me",
  // /blog and /projects used to be real pages. The post list now lives at
  // the root and projects are gone, so keep the old URLs resolving rather
  // than 404ing anything already linked or indexed.
  redirects: {
    "/blog": "/",
    "/projects": "/",
  },
  integrations: [sitemap(), mdx(), pagefind()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
