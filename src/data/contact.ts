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
  lines: ["don't begin with", '"quick question."'],
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
  { label: "LinkedIn", handle: "linkedin.com/in/Shubz-s-sharma", note: "Conventional channel; checked weekly-ish.", c: "orange", href: "https://www.linkedin.com/in/Shubz-s-sharma/" },
  { label: "GitHub",   handle: "github.com/shubhangithub",           note: "For code or issues on the open repos.",     c: "yellow", href: "https://github.com/shubhangithub" },
];

// ---------------------------------------------------------------------------
// §03 PREFERENCES — Will read / Won't read / Reply time / Based
// ---------------------------------------------------------------------------
export type Preference = { k: string; v: string; c: NBAccentKey };

export const CONTACT_PREFERENCES: Preference[] = [
  { k: "Will read",  v: "AI safety, geospatial ML, quantum computation, computational biology, recommendation systems, fashion forecasting, or anything at the intersection of maths and something unexpected.", c: "orange" },
  { k: "Won't read", v: "Generic outreach. \"Quick question\" emails. Anything with the word 'leverage'.",                                                                                                       c: "orange" },
  { k: "Reply time", v: "≤ 72 hours for substantive emails. Faster if it makes me laugh.",                                                                                                                       c: "yellow" },
  { k: "Based",      v: "London — happy on calls in any reasonable timezone.",                                                                                                                                   c: "teal"   },
];

// ---------------------------------------------------------------------------
// §04 COMPOSE — form copy
// ---------------------------------------------------------------------------
export const CONTACT_COMPOSE = {
  toLabel: "To:",
  toAddress: "hello@shubzsharma.com",
  readyLabel: "● ready",
  fromPlaceholder: "your name & email",
  subjectPlaceholder: "what this is about",
  bodyPlaceholder: "don't begin with 'quick question'.",
  defaultSubject: "Hi from your site",
  footerNote: "opens your mail client · spam-screened by hand",
  sendButton: "Send →",
};

// ---------------------------------------------------------------------------
// RIGHT RAIL — protocol JSON + calendar
// ---------------------------------------------------------------------------
export const CONTACT_PROTOCOL = {
  preferred: "email",
  cadence:   "daily, am",
  reply:     "≤72h",
  noise:     "low",
};

export type CalendarRow = { label: string; c: NBAccentKey | "muted"; note: string };

export const CONTACT_CALENDAR: CalendarRow[] = [
  { label: "mon–thu", c: "orange", note: "am, before 09:00" },
  { label: "fri",     c: "orange", note: "mixed" },
  { label: "sat–sun", c: "muted",  note: "rowing / piano" },
];

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
