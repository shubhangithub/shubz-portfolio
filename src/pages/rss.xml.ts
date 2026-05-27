// RSS feed at /rss.xml. One <item> per essay in POSTS, ordered as listed
// (which is the editorial order — most-recent-first / featured-first).
//
// Subscribers (Substack imports, Feedly, NetNewsWire, etc.) read this to
// pick up new posts. Update POSTS and the feed updates on next deploy.

import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { POSTS } from "../data/posts";

export function GET(context: APIContext) {
  return rss({
    title: "Shubz Sharma · Writing",
    description:
      "Long-form essays on geospatial ML, computational biology, optimisation, recommendation, and the small obsessions in between.",
    site: context.site ?? "https://shubzsharma.com",
    items: POSTS.map((post) => ({
      title: post.title,
      description: post.dek,
      link: `/${post.slug}/`,
      categories: post.kicker.split("·").map((s) => s.trim()).filter(Boolean),
    })),
    customData: `<language>en-gb</language><generator>Astro</generator>`,
  });
}
