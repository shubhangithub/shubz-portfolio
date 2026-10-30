// work.ts — editable copy for /work. The WorkV5 component imports
// everything here and lays it out; edit the constants to change the
// content. See EDITING.md for the data map.
//
// Sections in render order (V5 — see WorkV5.tsx):
//   1. Hero, lede, marginalia (top of page)
//   3. WORK_EVENTS_V5      — trajectory timeline (lens-filtered)
//   4. WORK_FEATURED_V5 / WORK_BUILDS_LIST_V5 — selected work
//   5. WORK_CORE_CARDS / WORK_FULL_GROUPS     — toolbox taxonomy
//   6. WORK_GANTT_LANES    — concurrency Gantt
//   7. Right-rail data (WORK_CV_STAT, WORK_BASED)

import type { NBAccentKey } from "./palette";
import { SITE_LAST_UPDATED_DATE } from "./site";
import type { Span } from "./home";

// ---------------------------------------------------------------------------
// Shared constants — referenced by toolbox links
// ---------------------------------------------------------------------------
export const CV_PDF = "/uploads/Shubhangi-Sharma-Resume-20260717.pdf";
export const PERSONAL_SITE_REPO = "https://github.com/shubhangithub/shubz-portfolio";

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
export const WORK_HERO: Span[] = [
  "Roles, ",
  { em: "builds", c: "yellow" },
  ", and the ",
  { em: "toolbox", c: "yellow" },
  " behind them.",
];

/** Lede sentence under the H1. The `pdfLink` substring is rendered as
 *  a link to CV_PDF; the rest is plain text. */
export const WORK_LEDE_PARTS = {
  before: "The CV with marginalia. Each entry has a footnote. Available as ",
  pdfLink: "PDF",
  after: " for the more conventional version.",
};

export const WORK_MARGINALIA = {
  /** Lines render with <br/> between them. The last line is a link to
   *  CV_PDF when `seeHereLink` is true — used to invite the visitor to
   *  the traditional CV alongside this annotated view. */
  lines: ["for the more", "traditional CV,", "download here →"],
  accent: "yellow" as NBAccentKey,
  /** When set, wraps "see here" in the last line with a link to this URL. */
  seeHereHref: CV_PDF,
};

export const WORK_LAST_UPDATED_LABEL = "WORK · CV WITH MARGINALIA";
export const WORK_LAST_UPDATED_DATE = SITE_LAST_UPDATED_DATE;


// ---------------------------------------------------------------------------
// RIGHT-RAIL data blocks
// ---------------------------------------------------------------------------
export const WORK_CV_STAT = {
  filename: "cv.pdf",
  span: "2020 — now",
  updatedDisplay: "17/07/2026",
  openText: "↗ open pdf",
  /** Sections shown on this /work page. Listed in the right-rail stat
   *  block so a visitor scanning the CV knows what's covered without
   *  scrolling. Update if you add a section onward. */
  sections: ["profile", "trajectory", "selected work", "toolbox"],
};

// WORK_OPEN_TO removed — the "open to collaboration on …" block moved to
// /contact (it's a communication preference, not a work artefact). See
// CONTACT_OPEN_TO in src/data/contact.ts.

// Pinned photo polaroids at the top of the right rail. Pin colour follows
// the §14 category of what the photo shows (Orion → geospatial teal,
// InnovateHer → outreach orange). Files live in public/photos/.
export const WORK_PHOTOS = [
  {
    src: "/photos/orion-retreat.jpg",
    caption: "team retreat · orion",
    alt: "The Orion team mid-game around a long wooden table at a cabin retreat, character sheets and dice everywhere",
    cat: "teal",
    tilt: -1.6,
    w: 264, h: 320,
  },
  {
    src: "/photos/innovateher-talk.jpg",
    caption: "role-model talk · InnovateHer",
    alt: "Speaking to a classroom of secondary-school students at an InnovateHer role-model talk",
    cat: "orange",
    tilt: 1.4,
    w: 282, h: 204,
  },
] as const;

export const WORK_BASED = {
  tz: "Europe/London (BST)",
  calls: "any reasonable tz",
};

// ---------------------------------------------------------------------------
// Work-page types + data arrays
// ---------------------------------------------------------------------------

export type WorkEventV5 = {
  year: string;
  what: string;
  where: string;
  /** Confirmed working location, when distinct from the event context. */
  location?: string;
  track: "engineering" | "research" | "study" | "outreach";
  cat: NBAccentKey;
  big: boolean;
  lenses: string[];
  note: string;
  /** Gantt overrides. The concurrency chart is derived from `year` (see
   *  "Gantt derivation" below), so most entries need none of these.
   *  - `ganttFrom` — when `year` states a milestone rather than a duration.
   *    The BSc entry reads "May 2023" (graduation) but the bar covers the
   *    degree, so it sets ganttFrom: "Aug 2019".
   *  - `ganttGroup` — draw several related entries as one bar. Clicking it
   *    still lists every entry in the group.
   *  - `ganttName` — label rendered inside the bar. Only worth it on long
   *    bars; everything else relies on hover. */
  ganttFrom?: string;
  ganttGroup?: string;
  ganttName?: string;
};

export type GanttBar = {
  left: number;
  w: number;
  top: number;
  h: number;
  cat: NBAccentKey;
  label: string;
  lenses: string[];
  match: string[];
  name?: string;
  big?: boolean;
  faded?: boolean;
};

export type GanttLane = {
  key: "engineering" | "research" | "study" | "outreach";
  label: string;
  color: NBAccentKey;
  bars: GanttBar[];
  /** Rows needed after packing. WorkV5 sizes the lane box from this. */
  rows: number;
};

export type ProjectGroup = "work" | "personal" | "research";
export const PROJECT_GROUPS: {key: ProjectGroup; label: string}[] = [
  {key: "work", label: "Work projects"},
  {key: "personal", label: "Fun projects"},
  {key: "research", label: "Research"},
];

export type WorkFeaturedV5 = {
  group: ProjectGroup;
  name: string;
  cat: NBAccentKey;
  scope: string;
  deploy: string;
  url: string | null;
  essay: string | null;
  private: boolean;
  blurb: string;
  metrics: string[];
  lenses: string[];
};

export type WorkBuildItemV5 = {
  group: ProjectGroup;
  name: string;
  cat: NBAccentKey;
  scope: string;
  url: string | null;
  essay: string | null;
  blurb: string;
  metrics: string[];
  lenses: string[];
};

export type CoreCard = {
  name: string;
  group: string;
  cat: NBAccentKey;
  tier: string;
  count: string;
  link: string;
  href: string;
  essay: string | null;
  essayCat?: NBAccentKey;
  lenses: string[];
};

export type FullGroup = {
  group: string;
  cat: NBAccentKey;
  items: string[];
};

export const WORK_EVENTS_V5: WorkEventV5[] = [
  { year: "Sep 2026 —",         what: "Cosmos Grantee · Cosmos Institute",          where: "AI for Truth-Seeking · with FIRE", track: "research", cat: "blue",   big: true,  lenses: ["research", "ml"],  note: "Awarded a Cosmos Grant by the Cosmos Institute and FIRE, in the Institute's largest cohort to date (80 grantees), under the AI for Truth-Seeking track — for DissentCheck. Currently working on its experimental design: how AI committee conclusions respond to shared evidence, peer exposure and dissent." },
  { year: "Jul 2026 —",         what: "Founding Member of Technical Staff · Torus",                  where: "YC S26", location: "London + San Francisco",                         track: "engineering", cat: "yellow",    big: true,  lenses: ["ml", "eng"],       note: "Agentic engineering for physical infrastructure, with recent work on production reliability, project-email handling and automated evaluation and review workflows.", ganttName: "Torus →" },
  { year: "Jul 2026 —",         what: "Fellowship Ambassador · Thinking About Thinking", where: "global network",           track: "outreach",    cat: "orange",  big: false, lenses: ["community", "research"], note: "Selected by invitation and review as an ambassador for Thinking About Thinking — a non-profit bringing people together across AI, neuroscience, mathematics and scientific discovery to shape the conversation about intelligence and the future of AI." },
  { year: "Jun 2026 —",         what: "Technical AI Safety · BlueDot",              where: "BlueDot Impact",                track: "study",       cat: "blue",    big: false, lenses: ["ml"],              note: "Cohort course — mechanistic interpretability, RLHF, evaluations, AI control, scalable oversight.", ganttGroup: "bluedot-courses" },
  { year: "Jun 2026",           what: "Certified · Hugging Face AI Agents course",  where: "two certificates",              track: "study",       cat: "purple",  big: false, lenses: ["ml"],              note: "Completed the Hugging Face Agents course — building, evaluating and deploying LLM agents. Two certificates earned.", ganttGroup: "certs-2026" },
  { year: "2026 —",             what: "Google Cybersecurity Certificate",            where: "in progress",                   track: "study",       cat: "yellow",  big: false, lenses: ["eng"],             note: "A more formal grounding in security, alongside the safety work.", ganttGroup: "certs-2026" },
  { year: "Apr 2026 —",         what: "AI Researcher · Independent",                where: "Funded by BDI Grants · Remote", track: "research",    cat: "blue",    big: true,  lenses: ["research", "ml"],  note: "AI safety, alignment, and multi-agent systems — independently, funded by BlueDot's grants programme, alongside Torus." },
  { year: "Apr — Jun 2026",     what: "AGI Strategy cohort · BlueDot",              where: "BlueDot Impact",                track: "study",       cat: "blue",    big: false, lenses: ["ml"],              note: "Pre-reading and weekly seminars on AGI strategy, alignment, and frontier-AI policy. Completed June 2026.", ganttGroup: "bluedot-courses" },
  { year: "Jun 2026 —",         what: "Member · Institute of Mathematics and its Applications", where: "UK",            track: "study",       cat: "magenta", big: false, lenses: ["community"],       note: "Member of the UK's professional body for mathematics and its applications.", ganttGroup: "prof-bodies" },
  { year: "Feb 2026",           what: "Elected MInstP · Institute of Physics",      where: "London",                        track: "study",       cat: "prompt",  big: false, lenses: ["ml", "community"], note: "Member of the UK's professional body for physics.", ganttGroup: "prof-bodies" },
  { year: "Aug 2025",           what: "Best Paper · IEEE ICCUBEA-2025",             where: "co-author",                     track: "study",       cat: "purple",  big: false, lenses: ["ml"],              note: "Flipkart–Walmart merger NLP. 1,240 submissions, 220 accepted, one Best Paper. With Prof. Chakraborty." },
  { year: "2025 —",             what: "STEM Ambassador · InnovateHer",              where: "UK schools",                    track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "200+ students spoken to across UK schools about careers in tech; named an InnovateHer Ambassador for the year. Recent talks at the University of Liverpool Maths School and DACA London. DBS-checked.", ganttGroup: "stem-mentoring" },
  { year: "2025 —",             what: "Mentor · Stemmettes",                        where: "STEM-ed outreach",              track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Workshops, panels and 1:1s for girls and non-binary young people moving toward engineering, maths and CS.", ganttGroup: "stem-mentoring" },
  { year: "2025 —",             what: "Science Communicator · I'm a Scientist",     where: "public engagement",             track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Answering school students' science questions live — CS and maths.", ganttGroup: "stem-mentoring" },
  { year: "2025 —",             what: "Member · MLOps Community London",            where: "London",                        track: "engineering", cat: "yellow",  big: false, lenses: ["community", "eng"], note: "Local chapter of the global MLOps community — talks and meetups on running ML in production." },
  { year: "2025 —",             what: "OSS maintainer · Taylor Swift rec engine, revamped", where: "open source · self-directed", track: "engineering", cat: "ochre",   big: true,  lenses: ["eng", "ml"],       note: "Rebuilt the original R/Shiny rec engine in Python + TypeScript. Six recommendation engines — Sentence-BERT on lyrics, a VAE on audio features, Node2Vec graph embeddings, neural collaborative filtering, contrastive self-supervised learning, and a weighted ensemble with a consensus boost. 801 songs, editorial bridges to 53 related artists. Recommendations in under 200ms. Live on Vercel." },
  { year: "Apr 2024 — Jun 2026", what: "Founding Engineer · Orion",                 where: "London",                        track: "engineering", cat: "teal",    big: true,  lenses: ["ml", "data"],      note: "Built geospatial intelligence infrastructure from scratch — data pipelines for high-volume multi-source streams, ML anomaly detection over the H3 spatial indexing layer, confidence-weighted signal fusion, and backend services in Python and Golang. One of the first two hires; joined as Data Engineer, became Data & ML Engineer in Nov 2024, then Founding Engineer. Rewrote the LLM-driven search system end-to-end — tool schemas, decision-tree system prompts, few-shot disambiguation, and output evaluation.", ganttName: "Orion" },
  { year: "Oct 2023 —",         what: "Ambassador · Oxford Mathematical Institute", where: "Oxford · LMH",                  track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Q&A panels and applicant support at the Mathematical Institute and Lady Margaret Hall.", ganttGroup: "oxford-societies" },
  { year: "Oct 2023 —",         what: "Member · Oxford Womxn in Computer Science",  where: "OxWoCS · Oxford",               track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Member and alum of OxWoCS — the department's community for women and non-binary computer scientists.", ganttGroup: "oxford-societies" },
  { year: "Jan — Sep 2024",     what: "IT Officer · Oxford FemTech Society",        where: "Oxford",                        track: "outreach",    cat: "orange",  big: false, lenses: ["community", "eng"], note: "Built and ran the society's IT infrastructure." },
  { year: "Sep 2023 — Jul 2024", what: "MFoCS · Oxford · Lady Margaret Hall",      where: "Maths + CS",                    track: "study",       cat: "magenta", big: true,  lenses: ["ml", "community"], note: "Thesis: automated immune-biomarker detection on multiplex IF tumour data. Modules: Geometric Deep Learning, Game Theory, Quantum Information, Category Theory." },
  { year: "Sep 2023 · 1 mo",    what: "Machine Learning Researcher · FLAME",        where: "Pune · contract",               track: "research",    cat: "purple",  big: false, lenses: ["ml", "research"],  note: "Generative and reconstructive applications of Variational Autoencoders (VAEs) and associated algorithms." },
  { year: "Jun — Sep 2023",     what: "ML Engineering Intern · Natter",             where: "London",                        track: "engineering", cat: "purple",  big: false, lenses: ["ml", "data"],      note: "Content-moderation models (bullying, distress, spam) on social text, plus a user-matching recommender." },
  { year: "May 2023",           what: "BSc (Hons) CS · Dean's Roll · FLAME",       where: "CGPA 8.53",                     track: "study",       cat: "yellow",  big: false, lenses: ["eng", "community"], note: "Graduated with the Dean's Roll of Honour.", ganttFrom: "Aug 2019" },
  { year: "Sep 2022 — May 2023", what: "BSc Honours Thesis · GNSS water vapour",   where: "FLAME · Prof. Gopalan",          track: "study",       cat: "prompt",  big: false, lenses: ["ml"],              note: "Estimated tropospheric water-vapour from GNSS signals with regression ML, beating linear baselines on accuracy and robustness." },
  { year: "late 2022",          what: "OSS · Taylor Swift rec engine — original R/Shiny", where: "open source · FLAME final year", track: "engineering", cat: "ochre",  big: false, lenses: ["eng", "ml"],       note: "UBCF hybrid recommender in R — 10 separate audio-feature models (danceability, energy, acousticness, valence, tempo, loudness, popularity, speechiness, liveness, album membership) merged via recommenderlab's HybridRecommender. Visualisations break down why each song was chosen. Still live on shinyapps.io." },
  { year: "2022 — 2023",        what: "Founder + President · Dotslash",             where: "FLAME University",              track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Founded and led a 10+ person team running tech events pulling 100+ attendees per session.", ganttGroup: "flame-societies" },
  { year: "2022 — 2023",        what: "Vice-Captain · Student Council",             where: "FLAME University",              track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Helped lead the Student Council, triage student concerns and coordinate follow-up with fellow representatives and university staff. Automated allocation of six annual student awards with Python + Google Sheets API.", ganttGroup: "flame-societies" },
  { year: "May — Jul 2022",     what: "Backend Developer Intern · JobsForHer",      where: "Bangalore",                     track: "engineering", cat: "yellow",  big: false, lenses: ["data"],            note: "User flows in Flask, PostgreSQL, and scalable AWS deploys (EC2, S3, load balancers, CloudWatch, SNS)." },
  { year: "2022",               what: "OSS · IoT weather bot · layered cipher",     where: "open source · FLAME",           track: "engineering", cat: "cyan",    big: false, lenses: ["eng"],             note: "Arduino/ESP8266 temperature and humidity monitor — RGB status LEDs, buzzer, servo fan, ThingSpeak cloud logging with rate-aware uploads every 7 loop iterations. And a four-layer Python cipher (scatter → wheel-spin → binary transform → matrix + ASCII) with SHA-256 tamper detection and 2,000+ round-trip tests, rooted in a linear-algebra module." },
  { year: "Jan — Aug 2022",     what: "Research Intern · Prof. Valadi, FLAME",      where: "Bioinformatics",                track: "research",    cat: "purple",     big: false, lenses: ["research", "ml"],  note: "Improved the JAYA optimiser (size-penalised fitness, elitism) for protein function ID. Poster PP-28 at INBIX'22." },
  { year: "Oct 2021 — Apr 2022", what: "Data Analyst · Centre for Knowledge Alternatives", where: "Pune",                  track: "research",    cat: "teal",    big: false, lenses: ["data", "research"], note: "Cultural mapping of Kolhapur for the Discover India Project — government datasets, Tableau." },
  { year: "Aug 2021 — Jan 2022", what: "Research Intern · Prof. Gopalan, FLAME",   where: "Atmospheric ML",                track: "research",    cat: "prompt",  big: false, lenses: ["research", "ml", "data"], note: "Derived cloud information from INSAT-3D satellite data — thresholding clear-sky vs cloudy pixels with NumPy, SciPy, PyHDF, NetCDF." },
  { year: "Jun — Sep 2021",     what: "Teaching + Fundraising · iVolunteer",        where: "India",                         track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Planned maths and science course material for grades 3–8, and built teaching material for the teachers delivering it. Raised over ₹40,000 for Covid relief in India.", ganttGroup: "india-2021" },
  { year: "Jun — Aug 2021",     what: "Blogging Volunteer · Swapnopuron",           where: "welfare society",               track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Wrote on education and the environment for a welfare society working on child education, child protection, literacy and women's employment.", ganttGroup: "india-2021" },
  { year: "Jul 2020 — Jan 2023", what: "Founder · PrintedCraft",                   where: "Bangalore",                     track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Personalised-printing business — Python connector to a cloud product DB, Google + Facebook Ads, 100+ designs." },
  { year: "Jun — Dec 2020",     what: "Co-founder · UnisphereCo",                   where: "Hyderabad",                     track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Platform for the undergrad-application process — mentors from 50+ universities, 200+ attendees per session." },
];

// ---------------------------------------------------------------------------
// GANTT DERIVATION
//
// The concurrency chart used to be hand-placed percentages, which meant every
// new role needed a bar drawn by hand — so it silently fell behind the
// trajectory list. It's now computed from WORK_EVENTS_V5: add an entry above
// and its bar appears, in the right lane, at the right place on the timeline.
//
// Add a role → nothing else to do. The optional `ganttFrom` / `ganttGroup` /
// `ganttName` fields on WorkEventV5 are the only knobs, and most entries want
// none of them.
// ---------------------------------------------------------------------------

/** Left and right edges of the chart, as fractional years. */
const GANTT_T0 = 2019;
const GANTT_NOW = 2026 + 9 / 12; // Oct 2026

/** Bar height and row pitch, in px. Exported so WorkV5 sizes lanes to match. */
export const GANTT_BAR_H = 9;
export const GANTT_STRIDE = 11;

const MONTH_IDX: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const ym = (y: number, m: number) => y + m / 12;

/** Parse one endpoint: "Jul 2026" | "Jul" | "2026" | "late 2022".
 *  A bare month borrows its year from the other endpoint ("Jun — Sep 2021"). */
function ganttEndpoint(tok: string, fallbackYear: number | null) {
  const t = tok.trim().toLowerCase();
  let m = /^late\s+(\d{4})$/.exec(t);
  if (m) return { y: +m[1], mo: 9 as number | null };
  m = /^([a-z]{3})[a-z]*\.?\s+(\d{4})$/.exec(t);
  if (m && MONTH_IDX[m[1]] !== undefined) return { y: +m[2], mo: MONTH_IDX[m[1]] };
  m = /^([a-z]{3})[a-z]*\.?$/.exec(t);
  if (m && MONTH_IDX[m[1]] !== undefined && fallbackYear != null) return { y: fallbackYear, mo: MONTH_IDX[m[1]] };
  m = /^(\d{4})$/.exec(t);
  if (m) return { y: +m[1], mo: null };
  return null;
}

/** Turn a free-text `year` field into a span. Handles every shape used above:
 *  "Jul 2026 —", "Apr 2024 — Jun 2026", "Jun — Sep 2021", "2022 — 2023",
 *  "Sep 2023 · 1 mo", "late 2022", "2022", "May 2023". */
export function ganttSpan(yearField: string, from?: string): { start: number; end: number } {
  const raw = (from ? `${from} — ${yearField}` : yearField).replace(/\s*·.*$/, "").trim();
  const ongoing = /[—–-]\s*$/.test(raw);
  const parts = raw.split(/\s*[—–]\s*/).map(s => s.trim()).filter(Boolean);

  const rightYear = parts.length > 1 ? ganttEndpoint(parts[1], null)?.y ?? null : null;
  const a = ganttEndpoint(parts[0], rightYear);
  if (!a) return { start: GANTT_T0, end: GANTT_T0 };

  const start = ym(a.y, a.mo ?? 0);
  if (ongoing || parts.length === 1) {
    // A lone endpoint covers its own month (or its whole year, if undated).
    const end = ongoing ? GANTT_NOW : a.mo == null ? ym(a.y + 1, 0) : ym(a.y, a.mo) + 1 / 12;
    return { start, end };
  }
  const b = ganttEndpoint(parts[1], a.y);
  if (!b) return { start, end: start + 1 / 12 };
  return { start, end: b.mo == null ? ym(b.y + 1, 0) : ym(b.y, b.mo) + 1 / 12 };
}

const pct = (t: number) => ((t - GANTT_T0) / (GANTT_NOW - GANTT_T0)) * 100;

/** Year ticks, positioned on the same scale as the bars so the axis and the
 *  chart can't disagree. */
export const GANTT_YEAR_TICKS = Array.from({ length: 8 }, (_, i) => 2019 + i)
  .map(y => ({ label: String(y), left: pct(y) }))
  .filter(t => t.left >= 0 && t.left <= 100);

/** Merged bars: entries sharing a `ganttGroup` draw as one bar with this
 *  label, and clicking it lists all of them. */
const GANTT_GROUP_LABELS: Record<string, string> = {
  "flame-societies":  "Dotslash + Student Council",
  "stem-mentoring":   "Stemmettes · InnovateHer · I'm a Scientist",
  "oxford-societies": "Oxford · Maths Institute, LMH, OxWoCS",
  "india-2021":       "iVolunteer + Swapnopuron · teaching, fundraising",
  "prof-bodies":      "Professional bodies · MInstP, IMA",
  "bluedot-courses":  "BlueDot · AGI Strategy → Technical AI Safety",
  "certs-2026":       "HF Agents certs · Google cyber",
};

const LANE_META: { key: GanttLane["key"]; label: string; color: NBAccentKey }[] = [
  { key: "engineering", label: "eng",      color: "yellow" },
  { key: "research",    label: "research", color: "blue" },
  { key: "study",       label: "study",    color: "magenta" },
  { key: "outreach",    label: "outreach", color: "orange" },
];

/** Render a span as the "(2024–26)" suffix the bar labels carry. */
function spanLabel(start: number, end: number) {
  const y0 = Math.floor(start + 1e-6);
  const y1 = Math.floor(end - 1e-6);
  const live = end >= GANTT_NOW - 1e-6;
  if (live) return `${y0} — now`;
  return y0 === y1 ? `${y0}` : `${y0}–${String(y1).slice(2)}`;
}

function buildGanttLanes(): GanttLane[] {
  return LANE_META.map(meta => {
    const events = WORK_EVENTS_V5.filter(e => e.track === meta.key);

    // One bar per entry, except where entries share a ganttGroup.
    type Draft = { start: number; end: number; cat: NBAccentKey; lenses: string[]; match: string[]; label: string; name?: string };
    const drafts: Draft[] = [];
    const byGroup = new Map<string, Draft>();

    for (const e of events) {
      const { start, end } = ganttSpan(e.year, e.ganttFrom);
      if (e.ganttGroup) {
        const found = byGroup.get(e.ganttGroup);
        if (found) {
          found.start = Math.min(found.start, start);
          found.end = Math.max(found.end, end);
          found.match.push(e.what);
          for (const l of e.lenses) if (!found.lenses.includes(l)) found.lenses.push(l);
          continue;
        }
        const draft: Draft = { start, end, cat: e.cat, lenses: [...e.lenses], match: [e.what], label: e.ganttGroup };
        byGroup.set(e.ganttGroup, draft);
        drafts.push(draft);
        continue;
      }
      drafts.push({ start, end, cat: e.cat, lenses: [...e.lenses], match: [e.what], label: e.what, name: e.ganttName });
    }

    // Finalise labels now that grouped spans are known.
    for (const d of drafts) {
      const base = GANTT_GROUP_LABELS[d.label] ?? d.label;
      d.label = `${base} (${spanLabel(d.start, d.end)})`;
    }

    // Greedy first-fit row packing, earliest start first.
    const rowEnds: number[] = [];
    const bars: GanttBar[] = drafts
      .sort((a, b) => a.start - b.start || b.end - a.end)
      .map(d => {
        const left = pct(d.start);
        const w = Math.max(1.4, pct(d.end) - left);
        // Back-to-back roles (Orion ending as Torus begins) should share a
        // row, so bars may abut; the rendered width sheds a hair to keep a
        // visible seam between them.
        let row = rowEnds.findIndex(end => left >= end - 1e-6);
        if (row === -1) { rowEnds.push(0); row = rowEnds.length - 1; }
        rowEnds[row] = left + w;
        return {
          left: Math.max(0, left),
          w: Math.max(1.2, Math.min(w, 100 - Math.max(0, left)) - 0.3),
          top: 1 + row * GANTT_STRIDE,
          h: GANTT_BAR_H,
          cat: d.cat,
          label: d.label,
          lenses: d.lenses,
          match: d.match,
          ...(d.name ? { big: true, name: d.name } : {}),
        };
      });

    return { ...meta, bars, rows: Math.max(1, rowEnds.length) };
  });
}

export const WORK_GANTT_LANES: GanttLane[] = buildGanttLanes();

export const WORK_FEATURED_V5: WorkFeaturedV5[] = [
  {
    name: "Torus", group: "work",
    cat: "yellow", scope: "Founding Member of Technical Staff · YC S26", deploy: "physical infrastructure",
    url: "https://usetorus.com", essay: null, private: false,
    blurb: "Agentic engineering for physical infrastructure. Torus drafts engineering packages for plants, pipelines and substations, bringing drawings and calculations across process, piping, electrical and controls into one coordinated set. It checks consistency across documents and redrafts affected sheets when project information changes, with engineers reviewing and approving the work.",
    metrics: ["engineering packages", "cross-discipline checks", "project email", "engineer review"],
    lenses: ["eng", "ml"],
  },
  {
    name: "Orion intelligence platform", group: "work",
    cat: "teal", scope: "founding-eng · 2024–26", deploy: "in production",
    url: null, essay: null, private: true,
    blurb: "Geospatial intelligence over H3 spatial indexing — data infrastructure for high-volume multi-source streams, ML anomaly detection and confidence-weighted signal fusion, and backend services in Python and Golang. Joined as one of the first two hires, built the data stack from scratch, and rewrote the LLM-driven search system end-to-end — tool schemas, decision-tree system prompts, few-shot disambiguation, and output evaluation.",
    metrics: ["H3 spatial index", "Python · Go", "multi-source fusion", "LLM search rewrite"],
    lenses: ["ml", "data"],
  },
  {
    name: "fashion-web", group: "personal",
    cat: "ochre", scope: "deployed · solo", deploy: "last deploy · 2026",
    url: "https://fashion-web-psi.vercel.app", essay: "fashion-trends", private: false,
    blurb: "Fashion-trend forecasting with a Holt-smoothed signal, an LMSR prediction market and outfit recognition. Recent work repairs editorial feeds and historical coverage, checks observations against publication evidence, and makes data gaps visible.",
    metrics: ["250+ terms", "source coverage", "LMSR · b=100", "Brier-scored"],
    lenses: ["ml", "data"],
  },
];

export const WORK_BUILDS_LIST_V5: WorkBuildItemV5[] = [
  { name: "Local Provision Finder", group: "work", cat: "yellow", scope: "UK government · 2026", url: "https://github.com/shubhangithub/local-provision-finder", essay: null, lenses: ["eng", "ml", "data"], blurb: "Built for UK government work and presented at 10 Downing Street. Finds local support services through everyday-language search and a map, with staff-reviewed directory updates, printable shortlists and live meeting transcription that brings up relevant services as people talk.", metrics: ["React · TypeScript", "semantic + keyword search", "reviewed service directory", "live meeting support"] },
  { name: "platypus-learn", group: "personal",                    cat: "purple", scope: "deployed · solo",       url: "https://platypus-learn.vercel.app",                         essay: null,            lenses: ["ml"],              blurb: "Turns PDFs and YouTube videos into structured courses with assessments, a goals dashboard, and an email digest.",                                                                   metrics: ["PDF · video → course", "Next.js · Supabase", "Claude API"] },
  { name: "Taylor Swift recommendation engine", group: "personal", cat: "ochre",  scope: "open",                 url: "https://shubz-taylor-recommendation-engine.vercel.app",     essay: "six-engines",   lenses: ["ml"],              blurb: "Six engines in parallel — SBERT, a VAE on audio features, node2vec, neural CF, contrastive SSL, and a consensus-boosted ensemble.",                                           metrics: ["6 engines", "<200ms", "SBERT · VAE · node2vec", "TS + FastAPI"] },
  { name: "MFoCS thesis · immune biomarkers", group: "research",  cat: "red",    scope: "Oxford · 2024",        url: null,                                                         essay: "threshold-gate", lenses: ["research", "ml"],  blurb: "Two problems in automated biomarker detection on real tumour data — four thresholding methods, and constrained spectral clustering.",                                          metrics: ["4 thresholding methods", "spectral clustering", "beat 5/7 baselines"] },
  { name: "Flipkart–Walmart merger NLP", group: "research",        cat: "purple",  scope: "academic · Best Paper", url: "https://ieeexplore.ieee.org/document/11284272",                                                        essay: null,            lenses: ["ml", "research"],  blurb: "Theme extraction and sentiment mining across four years of coverage of the $16B acquisition.",                                                                                metrics: ["4 yrs coverage", "Best Paper", "1,240 → 220 accepted"] },
  { name: "JAYA protein feature selection", group: "research",     cat: "purple", scope: "open · research",      url: "https://github.com/shubhangithub/inbix22",                  essay: "jaya",          lenses: ["ml", "research"],  blurb: "A parameter-free stochastic optimiser improved with a size-penalty fitness function and elitism for protein function identification.",                                        metrics: ["3 datasets", "smaller feature sets", "INBIX'22 · PP-28"] },
  { name: "GNSS water-vapour ML", group: "research",               cat: "prompt", scope: "honours thesis",       url: null,                                                         essay: null,            lenses: ["research", "ml"],  blurb: "Tropospheric water-vapour estimation from GNSS signals, beating linear baselines on accuracy and robustness to atmospheric variability.",                                    metrics: ["beat linear baselines", "honours thesis"] },
  { name: "Nand2Tetris — 16-bit computer", group: "personal",      cat: "cyan",   scope: "coursework",           url: null,                                                         essay: null,            lenses: ["data"],            blurb: "A working general-purpose computer from NAND gates up — HDL through machine language, VM, compiler, and a minimal OS.",                                                     metrics: ["NAND → OS", "all 13 projects"] },
  { name: "this site", group: "personal",                          cat: "yellow", scope: "open",                 url: "https://github.com/shubhangithub/shubz-portfolio",            essay: null,            lenses: ["community"],       blurb: "Astro + React islands with interactive SVG and canvas diagrams, a connected project graph, and an illustrated notebook.",                                                                                        metrics: ["Astro · React islands", "SVG · canvas diagrams", "open source"] },
  { name: "Taylor Swift rec engine — R/Shiny", group: "personal", cat: "ochre",  scope: "open · 2022",          url: "https://shubz.shinyapps.io/shubz-taylor-rec-engine-folder/", essay: null,            lenses: ["ml", "eng"],       blurb: "UBCF hybrid recommender in R — 10 separate audio-feature models (danceability, energy, acousticness, valence, tempo, loudness, popularity, speechiness, liveness, album membership) merged via recommenderlab's HybridRecommender. Visualisations break down why each song was chosen. The predecessor to the six-engine Python rebuild.",                metrics: ["10 UBCF models", "hybrid recommender", "shinyapps.io · live"] },
  { name: "IoT weather bot", group: "personal",                    cat: "cyan",   scope: "open · 2022",          url: "https://github.com/shubhangithub/IoT-weather-bot",           essay: null,            lenses: ["eng"],             blurb: "Arduino/ESP8266 temperature and humidity monitor with RGB status LEDs, a buzzer, a servo fan, and ThingSpeak cloud logging. Rate-aware uploads every 7 loop iterations to respect ThingSpeak's 15-second ingest limit. Full 7-iteration evolution of the codebase preserved in the repo.",                                                              metrics: ["Arduino · ESP8266", "ThingSpeak · Wi-Fi", "7 iterations"] },
  { name: "layered cipher", group: "personal",                     cat: "magenta", scope: "open · 2022",         url: "https://github.com/shubhangithub/layered-cipher",            essay: null,            lenses: ["eng"],             blurb: "Four-layer Python cipher (scatter → wheel-spin → binary transform → matrix + ASCII) with SHA-256 tamper detection and 2,000+ round-trip tests. Grew from a linear-algebra module; the matrix layer's reversibility condition came directly from lecture notes. CI runs on every push.",                                                              metrics: ["4 layers", "SHA-256 integrity", "2,000+ tests · CI"] },
];

export const WORK_CORE_CARDS: CoreCard[] = [
  { name: "Geospatial ML · H3 indexing",   group: "Geospatial",     cat: "teal",    tier: "daily driver",    count: "1 role",        link: "orion · /work",           href: "/work/",                                              essay: null,            lenses: ["ml", "data"] },
  { name: "LLM eng · tool schemas · evals", group: "AI/ML",         cat: "purple",  tier: "daily driver",    count: "orion search",  link: "Orion search",             href: "/builds/?project=Orion%20intelligence%20platform#project-orion-intelligence-platform",                                               essay: null,            lenses: ["ml"] },
  { name: "Python",                          group: "AI/ML",         cat: "purple",  tier: "daily driver",    count: "6 projects",    link: "six engines",             href: "/six-engines/",                                       essay: "six-engines",   lenses: ["ml", "data", "research"] },
  { name: "Rust · Golang",                   group: "Geospatial",    cat: "teal",    tier: "daily driver",    count: "1 role",        link: "orion · /work",           href: "/work/",                                              essay: null,            lenses: ["data"] },
  { name: "AI alignment research",           group: "AI safety",     cat: "blue",    tier: "studied · funded", count: "BDI grant",    link: "bending the curve",       href: "/bluedot-unit1/",                                     essay: "bluedot-unit1", essayCat: "blue", lenses: ["research"] },
  { name: "LMSR prediction markets",         group: "fintech",       cat: "ochre",   tier: "shipped",         count: "fashion-web",   link: "fashion-web",             href: "https://fashion-web-psi.vercel.app",                                    essay: "fashion-trends", lenses: ["ml", "data"] },
  { name: "Recommendation systems",          group: "fintech",       cat: "ochre",   tier: "shipped",         count: "2 projects",    link: "six engines",             href: "/six-engines/",                                       essay: "six-engines",   lenses: ["ml"] },
  { name: "Claude API · Anthropic SDK",      group: "AI/ML",         cat: "purple",  tier: "daily driver",    count: "2 projects",    link: "platypus-learn",          href: "https://platypus-learn.vercel.app",                   essay: null,            lenses: ["ml"] },
  { name: "PyTorch · scikit-learn",          group: "AI/ML",         cat: "purple",  tier: "shipped",         count: "2 projects",    link: "Oxford biomarker thesis", href: "/builds/?project=MFoCS%20thesis%20%C2%B7%20immune%20biomarkers#project-mfocs-thesis-immune-biomarkers",                                    essay: "threshold-gate", lenses: ["ml", "research"] },
  { name: "Quantum Information · ZX",        group: "Physics",       cat: "prompt",  tier: "studied",         count: "Oxford",        link: "Oxford MFoCS · CV",        href: CV_PDF,                                       essay: "zx-calculus",   essayCat: "prompt", lenses: ["research"] },
  { name: "Computational Game Theory",       group: "Mathematics",   cat: "magenta", tier: "studied",         count: "Oxford MFoCS",  link: "Oxford module · cv",      href: CV_PDF,                                                essay: null,            lenses: ["research"] },
  { name: "Bioinformatics",                  group: "Biotech",       cat: "red",     tier: "shipped",         count: "2 projects",    link: "JAYA protein research",    href: "https://github.com/shubhangithub/inbix22",                                              essay: "jaya",          lenses: ["research", "ml"] },
  { name: "Astro · React islands",           group: "Infrastructure", cat: "yellow", tier: "daily driver",   count: "this site",     link: "this site repo",          href: "https://github.com/shubhangithub/shubz-portfolio",      essay: null,            lenses: ["community"] },
  { name: "Founding / building from zero",   group: "Outreach",      cat: "orange",  tier: "daily driver",    count: "2 ventures",    link: "orion · day one",         href: "/work/",                                              essay: null,            lenses: ["community"] },
];

export const WORK_FULL_GROUPS: FullGroup[] = [
  { group: "AI safety",       cat: "blue",    items: ["AI alignment research", "AI ethics & governance"] },
  { group: "AI/ML",           cat: "purple",  items: ["Python", "R", "NumPy · SciPy · Pandas", "PyTorch · scikit-learn", "SpaCy · NLTK · Gensim", "Claude API", "Gemini API", "Prompt engineering · few-shot · decision trees", "LLM evaluation", "Feature selection", "Genetic algorithms", "Regression modelling", "Sentiment + theme extraction", "Web scraping"] },
  { group: "Mathematics",     cat: "magenta", items: ["Computational Game Theory", "Geometric Deep Learning", "Graph Theory", "Category Theory", "Collective Decision Making", "Computational Complexity", "Cryptography · number theory", "Linear algebra · transforms"] },
  { group: "Physics",         cat: "prompt",  items: ["Quantum Information", "ZX-rewriting", "GNSS atmospheric modelling", "Satellite remote sensing", "PyHDF · NetCDF"] },
  { group: "Biotech",         cat: "red",     items: ["Bioinformatics", "Constrained · spectral clustering", "Automated thresholding", "Image processing (multiplex IF)", "Explainable AI (WOE binning)", "Lotka–Volterra dynamics"] },
  { group: "Geospatial",      cat: "teal",    items: ["Rust · Golang", "Geospatial ML · H3 indexing", "Anomaly detection", "Confidence-weighted fusion", "ETL · data pipelines"] },
  { group: "fintech",         cat: "ochre",   items: ["LMSR prediction markets", "Time-series forecasting · Holt-Winters", "Calibration · Brier scoring", "Recommendation systems", "Ensemble methods"] },
  { group: "Hardware",        cat: "cyan",    items: ["C++", "IoT · microcontrollers · ThingSpeak", "Compiler · VM design", "HDL · gate-level design"] },
  { group: "Infrastructure",  cat: "yellow",  items: ["TypeScript", "SQL · PostgreSQL", "Astro · React islands", "Next.js · Supabase · Resend", "Vercel", "AWS · EC2 · S3", "Tableau", "Flask", "Google APIs", "Git · CI/CD", "SVG · canvas diagrams", "FastAPI", "UI / UX design"] },
  { group: "Outreach",        cat: "orange",  items: ["Team leadership", "STEM teaching & mentoring", "Technical & research writing", "Conference talks", "Event organising", "Cross-cultural collaboration", "Stakeholder comms", "Founding from zero", "Digital marketing · SEO", "Graphic · product design", "Qualitative research"] },
];

// Old links and search terms resolve to the combined inventory record.
export const TOOL_ALIASES: Record<string, string> = {
  "Prompt engineering": "Prompt engineering · few-shot · decision trees",
  "Few-shot disambiguation": "Prompt engineering · few-shot · decision trees",
  "Decision-tree prompts": "Prompt engineering · few-shot · decision trees",
  "Rust": "Rust · Golang", "Golang": "Rust · Golang",
  "Time-series forecasting": "Time-series forecasting · Holt-Winters",
  "statsmodels · Holt-Winters": "Time-series forecasting · Holt-Winters",
  "IoT": "IoT · microcontrollers · ThingSpeak",
  "ThingSpeak · microcontrollers": "IoT · microcontrollers · ThingSpeak",
  "D3 · hand-rolled SVG": "SVG · canvas diagrams",
  "Mentoring": "STEM teaching & mentoring", "Teaching": "STEM teaching & mentoring",
  "STEM-ed outreach": "STEM teaching & mentoring",
  "Research writing": "Technical & research writing", "Technical docs": "Technical & research writing",
};
export const canonicalToolName = (name: string) => TOOL_ALIASES[name] || name;
export const toolSearchTerms = (name: string) => [name, ...Object.keys(TOOL_ALIASES).filter(alias => TOOL_ALIASES[alias] === name)].join(" ");
