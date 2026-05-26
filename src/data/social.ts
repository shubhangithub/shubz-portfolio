// social.ts — manual feed of latest social posts shown on the homepage
// "latest" row. LinkedIn doesn't expose a public RSS feed for personal
// profiles, so this is the simplest reliable option: a list you edit by
// hand when you post somewhere.
//
// Cadence: weekly-ish. Same edit-on-GitHub pattern as the rest of /data
// (click "edit this page →" in the home footer to open this file in
// GitHub's web editor).
//
// Each entry shows up as a small chip on the home page's "latest" row.
// To remove an entry, delete its object. To reorder, reorder the array
// (newest first).

import type { NBAccentKey } from "./palette";

export type SocialPost = {
  /** Free-text date as you'd write it, e.g. "25 May 2026" or "this week". */
  date: string;
  /** Platform label shown on the chip. */
  platform: "linkedin" | "x" | "github" | "substack" | "medium" | string;
  /** The post body (or a one-sentence summary). Keep it short — chip-sized. */
  text: string;
  /** Where the post lives. Opens in a new tab. */
  url: string;
  /** V5 canonical accent key. Defaults to the platform's natural colour
   *  when omitted (linkedin → blue, github → yellow, x → magenta, etc). */
  family?: NBAccentKey;
};

export const SOCIAL_POSTS: SocialPost[] = [
  {
    date: "26 May 2026",
    platform: "linkedin",
    text: "Some context — placeholder. Replace with your actual latest LinkedIn post. Edit src/data/social.ts to update.",
    url: "https://www.linkedin.com/in/Shubz-s-sharma/",
    family: "blue",
  },
];

/** Default colour per platform when an entry omits `family`. */
export const PLATFORM_DEFAULT_FAMILY: Record<string, NBAccentKey> = {
  linkedin: "blue",
  github:   "yellow",
  x:        "magenta",
  substack: "ochre",
  medium:   "ochre",
};

// ---------------------------------------------------------------------------
// GITHUB CONTRIBUTION GRAPH — driven by ghchart.rshah.org which renders a
// year-of-commits heatmap as an SVG. Free, no auth, embed-as-img. Falls
// back to nothing visible if the service is down — failure mode is benign.
// ---------------------------------------------------------------------------
export const GITHUB_USERNAME = "shubhangithub";

/** Build the chart URL for the active theme's accent colour (hex without #). */
export function ghChartUrl(hexNoHash: string, username: string = GITHUB_USERNAME): string {
  return `https://ghchart.rshah.org/${hexNoHash}/${username}`;
}
