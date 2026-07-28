import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { POSTS } from "./src/data/posts.ts";

// Draft essays are reachable by direct URL but shouldn't be advertised to
// search engines — keep their URLs out of the sitemap.
const DRAFT_URLS = new Set(
  POSTS.filter((p) => p.draft).map((p) => `https://shubzsharma.com/${p.slug}/`),
);

// https://astro.build/config
export default defineConfig({
  site: "https://shubzsharma.com",
  integrations: [
    react(),
    sitemap({ filter: (page) => !DRAFT_URLS.has(page) }),
  ],
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
