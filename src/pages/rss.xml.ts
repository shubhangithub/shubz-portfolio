// RSS feed at /rss.xml. One <item> per published essay in POSTS, ordered as
// listed (which is the editorial order — most-recent-first / featured-first).
//
// Subscribers (Substack imports, Feedly, NetNewsWire, etc.) read this to
// pick up new posts. Update POSTS and the feed updates on next deploy.

import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { VISIBLE_POSTS } from "../data/posts";
import RSS_CONTENT from "../data/rss-content.generated.json";

export function GET(context: APIContext) {
  return rss({
    title: "Shubz Sharma · Writing",
    description:
      "Long-form essays on geospatial ML, computational biology, optimisation, recommendation, and the small obsessions in between.",
    site: context.site ?? "https://shubzsharma.com",
    items: VISIBLE_POSTS.filter((post) => !post.draft).map((post) => ({
      title: post.title,
      description: post.dek,
      content:
        RSS_CONTENT[post.slug as keyof typeof RSS_CONTENT] ?? post.dek,
      link: `/${post.slug}/`,
      ...(post.publishedAt
        ? { pubDate: new Date(`${post.publishedAt}T00:00:00Z`) }
        : {}),
      categories: post.kicker.split("·").map((s) => s.trim()).filter(Boolean),
    })),
    customData: `<language>en-gb</language><generator>Astro</generator>`,
  });
}
