import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
export default defineConfig({
  site: "https://shubzsharma.com",
  devToolbar: {enabled: false},
  integrations: [
    // renderToString rather than renderToReadableStream: React 18's stream
    // encoder leaves NUL bytes in the HTML where a multi-byte character
    // straddles its 2 KB view boundary; one broke /builds/network/.
    react({ experimentalDisableStreaming: true }),
    sitemap(),
  ],
  build: {format: "directory"},
});
