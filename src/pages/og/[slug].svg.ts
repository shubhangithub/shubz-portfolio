// Per-essay Open Graph image. Renders an SVG card at /og/<slug>.svg with
// the essay's kicker, title, and dek. Static-generated for every slug in
// POSTS at build time.
//
// V5: uses NB_LIGHT cream paper + each essay's per-essay accent (the same
// pen colour shown in the essay hero). One source of truth for the brand
// colour; flip POSTS[i].nbAccent and the OG card retunes on next build.
//
// Crawler caveat: LinkedIn / Twitter / Slack accept SVG og:images, but
// some legacy scrapers prefer PNG. If that becomes a problem, swap this
// for a satori + sharp build step that outputs PNG.

import type { APIRoute } from "astro";
import { POSTS } from "../../data/posts";
import { NB_LIGHT } from "../../data/palette";

export function getStaticPaths() {
  return POSTS.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

// Tiny entity escape. Titles + deks are author-controlled but defensive
// quoting keeps SVG well-formed if a future essay slips in a stray <.
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Wrap a long title into 2-3 SVG <tspan> rows by character budget.
function wrap(text: string, perLine: number, maxLines = 3): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if (lines.length === maxLines) break;
    if ((current + " " + w).trim().length <= perLine) {
      current = (current + " " + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (words.length > lines.join(" ").split(/\s+/).length && lines.length === maxLines) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\.?\s*$/, "…");
  }
  return lines;
}

export const GET: APIRoute = ({ props }) => {
  const post = props.post as (typeof POSTS)[number];
  const titleLines = wrap(post.title, 22, 3);
  const dekLines = wrap(post.dek, 60, 2);

  // V5 brand surface: cream paper + per-essay accent. Falls back to blue
  // if no nbAccent is set (shouldn't happen — every POSTS entry has one).
  const t = NB_LIGHT;
  const accent = t[post.nbAccent || "blue"];

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${t.paper}"/>
  <rect x="0" y="0" width="6" height="630" fill="${accent}"/>
  <line x1="80" y1="80" x2="1120" y2="80" stroke="${t.rule}" stroke-width="1"/>
  <line x1="80" y1="550" x2="1120" y2="550" stroke="${t.rule}" stroke-width="1"/>
  <text x="80" y="60" font-family="JetBrains Mono, monospace" font-size="14" fill="${accent}" letter-spacing="2">${esc(post.kicker.toUpperCase())}</text>
  ${titleLines
    .map(
      (line, i) =>
        `<text x="80" y="${230 + i * 96}" font-family="Fraunces, Georgia, serif" font-size="84" font-weight="380" fill="${t.ink}">${esc(line)}</text>`,
    )
    .join("\n  ")}
  ${dekLines
    .map(
      (line, i) =>
        `<text x="80" y="${500 + i * 38}" font-family="Source Serif 4, Georgia, serif" font-size="28" fill="${t.softInk}" font-style="italic">${esc(line)}</text>`,
    )
    .join("\n  ")}
  <text x="80" y="610" font-family="JetBrains Mono, monospace" font-size="13" fill="${accent}" letter-spacing="2">SHUBZSHARMA.COM/${esc(post.slug.toUpperCase())}</text>
  <text x="1120" y="610" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="13" fill="${t.muted}" letter-spacing="2">${post.minutes} MIN READ</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
