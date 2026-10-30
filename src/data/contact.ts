// contact.ts — editable copy for /contact. ContactV5 reads from this file.

import type { NBAccentKey } from "./palette";
import { SITE_LAST_UPDATED_DATE } from "./site";
import type { Span } from "./home";

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
export const CONTACT_HERO_LINES: Span[][] = [
  ["Say ", { em: "hello", c: "orange" }, "."],
  ["I read everything ", { em: "eventually", c: "orange" }, "."],
];

export const CONTACT_LEDE: Span[] = ["I prefer email."];

export const CONTACT_MARGINALIA = {
  lines: ["best on email,", "read once daily."],
  accent: "orange" as NBAccentKey,
};

export const CONTACT_LAST_UPDATED_LABEL = "CONTACT · CHANNELS + COMPOSE";
export const CONTACT_LAST_UPDATED_DATE = SITE_LAST_UPDATED_DATE;

// ---------------------------------------------------------------------------
// §02 CHANNELS
// ---------------------------------------------------------------------------
export type Channel = {
  label: string;
  handle: string;
  note: string;
  c: NBAccentKey;
  href: string;
};

export const CONTACT_CHANNELS: Channel[] = [
  { label: "Email",    handle: "hello@shubzsharma.com",          note: "Best — read once a day.",                  c: "orange", href: "mailto:hello@shubzsharma.com" },
  { label: "LinkedIn", handle: "linkedin.com/in/shubhangi-s-sharma", note: "Conventional channel; checked weekly-ish.", c: "orange", href: "https://www.linkedin.com/in/shubhangi-s-sharma/" },
  { label: "GitHub",   handle: "github.com/shubhangithub",           note: "For code or issues on the open repos.",     c: "yellow", href: "https://github.com/shubhangithub" },
  { label: "Fable",    handle: "fable.co/fabler/shubz-sharma",       note: "Reading lists, book clubs, and what I'm reading.", c: "orange", href: "https://fable.co/fabler/shubz-sharma-375148102003" },
  { label: "Strava",   handle: "strava.com/athletes/155447309",      note: "Rowing, riding, and training logs.",        c: "orange", href: "https://www.strava.com/athletes/155447309" },
];

// ---------------------------------------------------------------------------
// §03 COMPOSE — form copy
// ---------------------------------------------------------------------------
export const CONTACT_COMPOSE = {
  toLabel: "To:",
  toAddress: "hello@shubzsharma.com",
  readyLabel: "● ready",
  fromPlaceholder: "your name & email",
  subjectPlaceholder: "what this is about",
  bodyPlaceholder: "what would you like to talk about?",
  defaultSubject: "Hi from your site",
  footerNote: "opens your mail client",
  sendButton: "Send →",
};

// ---------------------------------------------------------------------------
// RIGHT RAIL — protocol JSON + calendar
// ---------------------------------------------------------------------------
export const CONTACT_PROTOCOL = {
  preferred: "email",
  cadence:   "daily, am",
};

// ---------------------------------------------------------------------------
// "Open to" block — what kinds of collaboration / topics. Moved here from
// /work since this is a contact / communication preference, not a CV item.
// ---------------------------------------------------------------------------
export const CONTACT_OPEN_TO = [
  "research collabs",
  "talks, podcasts, & panels",
  "judging & mentoring",
  "guest writing",
  "the occasional 1-1",
] as const;

// ---------------------------------------------------------------------------
// Photo polaroid under the "open to" block — proof the talks happen.
// Outreach (orange) per §14. File lives in public/photos/.
// ---------------------------------------------------------------------------
export const CONTACT_PHOTO = {
  src: "/photos/downing-street.jpg",
  caption: "Presentation at 10 Downing Street, UK",
  alt: "Shubz beside the lectern in the briefing room at 10 Downing Street, UK",
  cat: "orange",
  tilt: 1.6,
  w: 272, h: 204,
} as const;
