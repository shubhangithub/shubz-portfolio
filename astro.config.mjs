import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://shubzsharma.com",
  integrations: [react(), mdx(), sitemap()],
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  build: {
    // ship pretty URLs (essays/jaya/ instead of essays/jaya.html)
    format: "directory",
  },
  vite: {
    ssr: {
      // diagram components are React islands; nothing else to externalise
      noExternal: [],
    },
  },
});
