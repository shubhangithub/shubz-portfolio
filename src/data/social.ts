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
  /** Optional accompanying image. Path relative to /public, e.g.
   *  "/social/minstp.jpg". Renders as a small square thumb next to
   *  the post text. Drop the file in public/social/ and reference here. */
  image?: string;
  /** Optional alt text for the image (a11y). Defaults to the post text
   *  if omitted, but a tighter description is better. */
  imageAlt?: string;
};

export const SOCIAL_POSTS: SocialPost[] = [
  {
    date: "Jul 2026",
    platform: "linkedin",
    text:
      "Through InnovateHer, I've now spoken to 200+ students across UK schools about careers in tech — and the roles we don't have names for yet. Named an InnovateHer Ambassador for the year.",
    url: "https://www.linkedin.com/in/shubhangi-s-sharma/recent-activity/all/",
    family: "orange", // orange = Outreach (STEM-ed)
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
// GITHUB CONTRIBUTION GRAPH — rendered on the home page via
// react-github-calendar (see HomeV5). The library fetches from
// github-contributions-api.jogruber.de which scrapes the public profile.
//
// Important: the count shown reflects PUBLIC contributions only by default.
// To include private-repo commits on the public profile (and therefore in
// the heatmap), turn on:
//   GitHub Settings → Public profile → "Include private contributions on
//   my profile"
// If you have multiple emails making commits, also confirm each one is
// linked in Settings → Emails so they count toward your contribution
// graph.
// ---------------------------------------------------------------------------
export const GITHUB_USERNAME = "shubhangithub";
