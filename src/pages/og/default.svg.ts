// Homepage Open Graph card. Copy comes from data/site.ts so the visual card
// and the page metadata cannot drift apart.

import type { APIRoute } from "astro";
import { NB_LIGHT } from "../../data/palette";
import { SITE_NAME, SITE_OG_TAGLINE } from "../../data/site";

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = () => {
  const t = NB_LIGHT;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${t.paper}"/>
  <line x1="80" y1="80" x2="1120" y2="80" stroke="${t.rule}" stroke-width="1"/>
  <line x1="80" y1="550" x2="1120" y2="550" stroke="${t.rule}" stroke-width="1"/>
  <text x="80" y="60" font-family="JetBrains Mono, monospace" font-size="14" fill="${t.muted}" letter-spacing="2">${esc(SITE_NAME.toUpperCase())} · ~/HOME</text>
  <text x="80" y="340" font-family="Fraunces, Georgia, serif" font-size="96" font-weight="380" fill="${t.ink}">shubzsharma<tspan fill="${t.blue}">.com</tspan></text>
  <text x="80" y="430" font-family="Source Serif 4, Georgia, serif" font-size="36" fill="${t.softInk}" font-style="italic">${esc(SITE_OG_TAGLINE)}</text>
  <text x="80" y="610" font-family="JetBrains Mono, monospace" font-size="13" fill="${t.blue}" letter-spacing="2">v.2026.07</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
