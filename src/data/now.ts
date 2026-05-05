// Weekly-ish snapshot content. Edit this file (and only this file) when the
// /now page or the home-page ticker drift. Used by:
//   - src/components/pages/NowV4.tsx     (focuses, journal, conditions)
//   - src/components/pages/HomeV4.tsx    (nowItems ticker)

export type Focus = { kind: string; what: string };
export type JournalEntry = { date: string; note: string };
export type Condition = { k: string; v: string; sub: string };
export type NowTickerItem = { kind: string; what: string };

// /now · "Right now" — five concurrent threads
export const FOCUSES: Focus[] = [
  { kind: "Building", what: "Orion's geospatial intelligence platform — intelligent real-time risk analysis." },
  { kind: "Shipping", what: "fashion-web — predicting fashion trends, complete with a LMSR exchange with StyleCoins. Live at fashion-web-psi.vercel.app." },
  { kind: "Writing",  what: "Drafting the next essay. Collecting my old work." },
  { kind: "Re-building", what: "shubz-taylor-rec-engine — six recommendation engines for one songbook. From a UG course; I keep finding new things to try." },
  { kind: "Reading",  what: "AI safety fundamentals for Bluedot's AGI Strategy cohort, ZX-Calculus (again), and Claude hacks." },
];

// /now · "Field journal" — newest first
export const JOURNAL: JournalEntry[] = [
  { date: "2026-04", note: "fashion-web's data pipeline finally feels complete — Reddit, Bluesky, YouTube, editorial, all flowing into one composite trend score with Holt-Winters on top. Now I can stop building and start watching what it predicts." },
  { date: "2026-02", note: "Elected MInstP. The certificate is small and unreasonably satisfying." },
  { date: "2025-12", note: "Started a second pass at the Taylor Swift recommender — TypeScript this time, six engines, all of them slightly wrong in interesting ways." },
  { date: "2025-08", note: "\"Decoding Flipkart-Walmart Merger\" picks up the Best Paper Award at IEEE ICCUBEA-2025. Co-authored with Prof. Chakraborty; four years from data scrape to award." },
  { date: "2025-08", note: "Promoted to Founding Engineer at Orion. The job description got shorter and the work got broader." },
];

// /now · "Conditions" tile
export const CONDITIONS: Condition[] = [
  { k: "Mood",    v: "study-mode",         sub: "rare and protected" },
  { k: "Music",   v: "Caroline Polachek",  sub: "depending on the hour" },
  { k: "Reading", v: "AI Safety papers",   sub: "and one quiet novel" },
  { k: "Drink",   v: "strawberry matcha",  sub: "from blank street" },
];

// Home page · scrolling ticker that links to /now
export const NOW_TICKER: NowTickerItem[] = [
  { kind: "FOUNDING", what: "Orion — geospatial ML over H3 indexing, confidence weighting at every join" },
  { kind: "SHIPPING", what: "fashion-web — five-source trend pipeline, LMSR exchange, Gemini CV" },
  { kind: "WRITING",  what: "Drafting the next essay — the argument is half-formed, the diagrams are the fun part" },
  { kind: "READING",  what: "Papers on calibration, a novel I won't name yet, optimization surveys" },
  { kind: "BUILDING", what: "shubz-taylor-rec-engine — six engines, all slightly wrong in interesting ways" },
];
