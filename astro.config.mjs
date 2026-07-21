import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://shubzsharma.com",
  integrations: [react(), sitemap()],
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  build: {
    // ship pretty URLs (essays/jaya/ instead of essays/jaya.html)
    format: "directory",
  },
});
