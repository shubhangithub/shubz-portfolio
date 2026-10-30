// Weekly-ish snapshot content. Edit this file (and only this file) when the
// /now page or the home-page ticker drift. Used by:
//   - src/components/pages/NowV5.tsx   (focuses, journal, conditions, hero)
//   - src/components/pages/HomeV5.tsx  (journal ticker → mini-term)
//
// V5 colour rule: each entry carries a `family` pointing at one of the 10
// canonical NB palette keys (see palette.ts + DECISIONS-v5.md §14). The
// page components resolve `family` → `t[family]` to colour rows. Adding a
// new entry: pick the meta-topic, set `family`, rest is automatic.

import type { NBAccentKey } from "./palette";
import { SITE_LAST_UPDATED_DATE } from "./site";
import READING_GENERATED from "./reading.generated.json";

// ---------------------------------------------------------------------------
// CURRENTLY READING — pulled from the Fable shelf by `npm run update:reading`
// (scripts/update-reading.js → reading.generated.json; also runs on build).
// The "Reading" focus line and the Conditions "Reading" row derive from it,
// so neither is hand-edited. Books never render if the shelf comes back
// empty — the fallbacks below just drop the book clause / row.
// ---------------------------------------------------------------------------
type ReadingBook = { title: string; authors: string[]; url: string | null };
const READING_BOOKS: ReadingBook[] = READING_GENERATED.books;
const FABLE_PROFILE_URL = READING_GENERATED.source;

const surname = (book: ReadingBook) =>
  book.authors[0]?.split(" ").pop() ?? "";
/** "Camus's The Myth of Sisyphus and Other Essays, and Pirsig's Zen …" */
const READING_ASIDE = READING_BOOKS.length
  ? ` Also ${READING_BOOKS.map((book) =>
      surname(book) ? `${surname(book)}'s ${book.title}` : book.title,
    ).join(", and ")}.`
  : "";
/** Title trimmed for the small Conditions tile ("… and Other Essays" etc.). */
const shortTitle = (title: string) => title.split(/: | and Other /)[0];

// ---------------------------------------------------------------------------
// HERO — /now page hero H1 + lede paragraph
// ---------------------------------------------------------------------------
export type Span = string | { em: string; c?: NBAccentKey };

export const NOW_HERO_LINES: Span[][] = [
  [
    "What I'm ",
    { em: "actually", c: "orange" },
    " ",
    { em: "doing", c: "orange" },
    " this week.",
  ],
];

export const NOW_LEDE_PREFIX = "The ";
export const NOW_LEDE_LINK_TEXT = "/now";
export const NOW_LEDE_LINK_URL = "https://nownownow.com/about";
export const NOW_LEDE_SUFFIX =
  " convention — what's on my plate, what I'm reading, where my attention is going. A snapshot, not a profile. Updated whenever I notice it has drifted.";

export const NOW_MARGINALIA = {
  lines: ["the rule: only", "five things at", "once. anything", "more is fiction."],
  accent: "orange" as NBAccentKey,
};

export const NOW_LAST_UPDATED_LABEL = "NOW · WEEKLY-ISH SNAPSHOT";
export const NOW_LAST_UPDATED_DATE = SITE_LAST_UPDATED_DATE;

export const NOW_CADENCE_LABEL = "weekly-ish";

export type Focus = {
  kind: string;
  what: string;
  family: NBAccentKey;
  linkText?: string;
  linkUrl?: string;
  linkTitle?: string;
};
export type JournalEntry = {
  artifact?: { href: string; image: string; alt: string; label: string };
  date: string;
  note: string;
  /** ≤10-word one-liner for the home mini-terminal (`cat .now`). RULE: the
   *  home page streams at most the TWO latest entries, one brief line
   *  each — the full `note` belongs to the /now field journal. Always
   *  fill this in when adding a journal entry. */
  brief?: string;
  family: NBAccentKey;
};
export type Condition = { k: string; v: string; sub: string; family: NBAccentKey };

// /now · "Right now" — five concurrent threads.
// CAP: 5 entries (same reason as JOURNAL — anything more clutters the layout).
export const FOCUSES: Focus[] = [
  // DissentCheck / Cosmos grant → AI safety
  {
    kind: "Building",
    family: "blue",
    what: "DissentCheck — a toolkit and experimental framework for studying and testing consensus dynamics in AI committees. Funded by a Cosmos Institute grant, under the AI for Truth-Seeking track with FIRE.",
    linkText: "Cosmos Institute",
    linkUrl: "https://blog.cosmos-institute.org/p/announcing-80-new-cosmos-grantees",
    linkTitle: "Cosmos Grants — September 2026 cohort announcement",
  },
  // BlueDot Technical AI Safety → AI safety
  { kind: "Studying",  family: "blue",   what: "BlueDot's Technical AI Safety course — mechanistic interpretability, RLHF, evaluations, AI control. Alongside the BDI-funded research." },
  // Agentic AI reading → AI/ML · book clause + link auto-filled from Fable
  {
    kind: "Reading",
    family: "purple",
    what: `Agentic systems — tool use, memory architectures, multi-agent coordination. The gap between demos and things that actually work reliably.${READING_ASIDE}`,
    ...(READING_BOOKS.length
      ? {
          linkText: READING_BOOKS[0].title,
          linkUrl: FABLE_PROFILE_URL,
          linkTitle: "View Shubz Sharma on Fable",
        }
      : {}),
  },
  // Procreate / drawing → outreach (personal, creative)
  { kind: "Drawing",   family: "orange", what: "Procreate course on Skillshare. Trying to get better at making things by hand. No particular goal, just enjoy it." },
  // Structured science communication → outreach
  {
    kind: "Learning",
    family: "orange",
    what: "Learning science communication through a structured programme with I'm a Scientist, one of the organisations I volunteer with.",
    linkText: "I'm a Scientist",
    linkUrl: "https://imascientist.org.uk/",
    linkTitle: "Visit I'm a Scientist",
  },
];

// /now · "Field journal" — newest first.
// The home mini-terminal uses a short slice; the journal retains every entry.
export const JOURNAL: JournalEntry[] = [
  // Cosmos Institute grant → AI safety
  { date: "2026-09", family: "blue",   brief: "Awarded a Cosmos × FIRE grant for DissentCheck.", note: "Awarded a Cosmos Grant by the Cosmos Institute and FIRE, in the AI for Truth-Seeking track — one of 80 in their largest cohort yet. The project is DissentCheck, a toolkit and experimental framework for studying and testing consensus dynamics in AI committees.", artifact: { href: "https://blog.cosmos-institute.org/p/announcing-80-new-cosmos-grantees", image: "/social/cosmos-dissentcheck.jpg", alt: "Cosmos Institute grant announcement for DissentCheck", label: "Cosmos × FIRE ↗" } },
  { date: "2026-09", family: "yellow", brief: "Building physical infrastructure at Torus, now featured in Forbes.", note: "I joined Torus in July as a founding member of technical staff, and I'm excited about what we're building. Torus uses AI to draft the engineering drawings and calculations behind physical infrastructure, from plants and pipelines to substations, with engineers reviewing the work. I get to work on agentic systems whose output has to make sense beyond a screen, which is a big part of the appeal for me. Forbes included Torus in its look at YC's Summer 2026 batch this month.", artifact: { href: "https://www.forbes.com/sites/dariashunina/2026/09/03/meet-the-yc-startups-betting-on-what-comes-next/", image: "/social/torus-forbes.svg", alt: "Illustrated press clipping linking to Forbes coverage of Torus in the YC Summer 2026 batch", label: "Torus in Forbes ↗" } },
  // Thinking About Thinking fellowship → outreach
  { date: "2026-07", family: "orange", brief: "Selected as a Thinking About Thinking Fellowship ambassador.", note: "Selected for the Thinking About Thinking Fellowship — a global network across AI, neuroscience, maths and scientific discovery. Ambassadors carry the conversations about intelligence and the future of AI into their own communities. Looking forward to it." },
  // InnovateHer outreach milestone + summer talks → outreach
  { date: "2026-07", family: "orange", brief: "InnovateHer outreach passed 200+ students across UK schools.", note: "InnovateHer outreach passed 200+ students spoken to across UK schools — careers in tech, and the roles we don't have names for yet. Recent talks at the University of Liverpool Maths School, and DACA London." },
  // Branching out post-grant → mixed
  { date: "2026-06", family: "orange", brief: "Cybersecurity certificate, Procreate course, agentic-systems reading.", note: "Since the grant: started Google's cybersecurity certificate, a Procreate drawing course on Skillshare, reading a lot about agentic systems. Professionally quieter than usual, which is fine." },
];

// /now · "Field journal archive" — older entries, diary only (not home mini-term).
// Append to JOURNAL in the DiaryJournal component. Newest first.
export const JOURNAL_ARCHIVE: JournalEntry[] = [
  // BDI grant + Technical AI Safety course → AI safety (rolled out of the live JOURNAL, kept here)
  { date: "2026-06", family: "blue",   note: "BDI grant came through. Starting BlueDot's Technical AI Safety course — mechanistic interpretability, RLHF, evaluations, AI control." },
  // BlueDot cohort close → AI safety (rolled out of the live JOURNAL, kept here)
  { date: "2026-05", family: "blue",   note: "BlueDot's AGI Strategy cohort. Good primer on the strategic frame around the technical work." },
  // Orion search rewrite → AI/ML (rolled out of the live JOURNAL, kept here)
  { date: "2026-05", family: "purple", note: "Rewriting Orion's search system — tool schemas, decision-tree prompts, fewshot disambiguation." },
  // fashion-web redesign → Markets (rolled out of the live JOURNAL, kept here)
  { date: "2026-04", family: "ochre",  note: "Used Claude to redesign fashion-web. Broke more than I expected. Still putting it back together." },
  // MInstP + Taylor rec second pass → late 2025
  { date: "2025-12", family: "ochre",  note: "Second pass at the Taylor Swift recommender — ported from the R/Shiny original to Python and TypeScript, six engines in parallel. Learning a lot about how recommendation systems actually work when you try to make them good." },
  // IEEE Best Paper → August 2025
  { date: "2025-08", family: "purple", note: "Best Paper at IEEE ICCUBEA-2025. 1,240 submissions, 220 accepted. The Flipkart–Walmart NLP paper I co-authored with Prof. Chakraborty two years ago — surprised it landed the way it did." },
  // Orion promotion to Data & ML Engineer → late 2024
  { date: "2024-11", family: "teal",   note: "Moved from Data Engineer to Data & ML Engineer at Orion. Starting to own the ML side properly — anomaly detection over the H3 spatial indexing layer, confidence-weighted signal fusion." },
  // Oxford thesis submission → summer 2024
  { date: "2024-09", family: "red",    note: "Submitted the MFoCS thesis. Two problems in automated biomarker detection on multiplex immunofluorescence data from actual tumour samples. Glad it's done. Genuinely don't know how pathologists look at this stuff every day." },
  // Joined Orion → April 2024
  { date: "2024-04", family: "teal",   note: "Joined Orion as one of the first two hires. Building geospatial intelligence infrastructure from nothing. The problem space is genuinely interesting — high-volume multi-source data with hard latency constraints." },
];

// One canonical journal collection for pagination and every displayed count.
export const JOURNAL_ENTRIES: JournalEntry[] = [...JOURNAL, ...JOURNAL_ARCHIVE];

// /now · "Conditions" tile
export const CONDITIONS: Condition[] = [
  // Drawing / creative mode → outreach (personal)
  { k: "Mood",    family: "orange", v: "drawing things",    sub: "on procreate" },
  // Music → outreach (personal)
  { k: "Music",   family: "orange", v: "nolan's odyssey",   sub: "the soundtrack, on repeat" },
  // Reading → outreach (personal) · auto-filled from the Fable shelf
  ...READING_BOOKS.slice(0, 1).map((book) => ({
    k: "Reading",
    family: "orange" as NBAccentKey,
    v: shortTitle(book.title),
    sub: surname(book).toLowerCase(),
  })),
  // Drink → outreach (personal)
  { k: "Drink",   family: "orange", v: "english breakfast", sub: "the strawberry matcha era is over" },
];
