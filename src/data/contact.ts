// contact.ts — editable copy for /contact. ContactV5 reads from this file.

import type { NBAccentKey } from "./palette";
import type { Span } from "./home";

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
export const CONTACT_HERO_LINES: Span[][] = [
  ["Say ", { em: "hello", c: "orange" }, "."],
  ["I read everything ", { em: "eventually", c: "orange" }, "."],
];

export const CONTACT_LEDE: Span[] = [
  "I prefer email. If you're writing about ",
  { tag: "computational biology", c: "red" },
  ", ",
  { tag: "geospatial ML", c: "teal" },
  ", or ",
  { tag: "music recommendations", c: "purple" },
  ", you will get a longer reply than you expect.",
];

export const CONTACT_MARGINALIA = {
  lines: ["best on email,", "read once daily —", "morning, usually."],
  accent: "orange" as NBAccentKey,
};

export const CONTACT_LAST_UPDATED_LABEL = "CONTACT · CHANNELS + COMPOSE";
export const CONTACT_LAST_UPDATED_DATE = "26 may 2026";

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
  { label: "Email",    handle: "hello@shubzsharma.com",          note: "Best — read once a day in the morning.",   c: "orange", href: "mailto:hello@shubzsharma.com" },
  { label: "LinkedIn", handle: "linkedin.com/in/shubhangi-s-sharma", note: "Conventional channel; checked weekly-ish.", c: "orange", href: "https://www.linkedin.com/in/shubhangi-s-sharma/" },
  { label: "GitHub",   handle: "github.com/shubhangithub",           note: "For code or issues on the open repos.",     c: "yellow", href: "https://github.com/shubhangithub" },
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
export const CONTACT_OPEN_TO: Span[] = [
  "Open to collaboration on ",
  { tag: "geospatial ML", c: "teal" },
  ", ",
  { tag: "AI safety", c: "blue" },
  ", ",
  { tag: "computational biology", c: "red" },
  ", ",
  { tag: "STEM-ed outreach", c: "prompt" },
  ", or anything that crosses these.",
];
