// work.ts — editable copy for /work. The WorkV5 component imports
// everything here and lays it out; edit the constants to change the
// content. Open this file via "edit this page →" in the page footer.
//
// Sections in render order (V5 — see WorkV5.tsx):
//   1. Hero, lede, marginalia (top of page)
//   2. WORK_EVENTS_V5      — trajectory timeline (lens-filtered)
//   3. WORK_FEATURED_V5 / WORK_BUILDS_LIST_V5 — selected work
//   4. WORK_CORE_CARDS / WORK_FULL_GROUPS     — toolbox taxonomy
//   5. WORK_GANTT_LANES    — concurrency Gantt
//   6. Right-rail data (WORK_CV_STAT, WORK_BASED)

import type { NBAccentKey } from "./palette";
import type { Span } from "./home";

// ---------------------------------------------------------------------------
// Shared constants — referenced by toolbox links
// ---------------------------------------------------------------------------
export const CV_PDF = "/uploads/Shubhangi-Sharma-Resume-20260717.pdf";
export const PERSONAL_SITE_REPO = "https://github.com/shubhangithub/personal-site";

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
export const WORK_LAST_UPDATED_DATE = "17 jul 2026";


// ---------------------------------------------------------------------------
// RIGHT-RAIL data blocks
// ---------------------------------------------------------------------------
export const WORK_CV_STAT = {
  filename: "cv.pdf",
  span: "2019 — now",
  updatedDisplay: "17/07/2026",
  openText: "↗ open pdf",
  /** Sections shown on this /work page. Listed in the right-rail stat
   *  block so a visitor scanning the CV knows what's covered without
   *  scrolling. Update if you add a section onward. */
  sections: ["trajectory", "selected work", "toolbox"],
};

// WORK_OPEN_TO removed — the "open to collaboration on …" block moved to
// /contact (it's a communication preference, not a work artefact). See
// CONTACT_OPEN_TO in src/data/contact.ts.

export const WORK_BASED = {
  tz: "Europe/London (BST)",
  calls: "any reasonable tz",
};

// ---------------------------------------------------------------------------
// V5 overhaul — new types + data arrays (old V4 exports above unchanged)
// ---------------------------------------------------------------------------

export type WorkEventV5 = {
  year: string;
  what: string;
  where: string;
  track: "engineering" | "research" | "study" | "outreach";
  cat: NBAccentKey;
  big: boolean;
  lenses: string[];
  note: string;
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
};

export type WorkFeaturedV5 = {
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
  { year: "Jun 2026 —",         what: "Technical AI Safety · BlueDot",              where: "BlueDot Impact",                track: "study",       cat: "blue",    big: false, lenses: ["ml"],              note: "Cohort course — mechanistic interpretability, RLHF, evaluations, AI control, scalable oversight." },
  { year: "Jun 2026",           what: "Certified · Hugging Face AI Agents course",  where: "two certificates",              track: "study",       cat: "purple",  big: false, lenses: ["ml"],              note: "Completed the Hugging Face Agents course — building, evaluating and deploying LLM agents. Two certificates earned." },
  { year: "2026 —",             what: "Google Cybersecurity Certificate",            where: "in progress",                   track: "study",       cat: "yellow",  big: false, lenses: ["eng"],             note: "A more formal grounding in security, alongside the safety work." },
  { year: "Apr 2026 —",         what: "AI Researcher · Independent",                where: "Funded by BDI Grants · Remote", track: "research",    cat: "blue",    big: true,  lenses: ["research", "ml"],  note: "AI safety, alignment, and multi-agent systems — independently, funded by BlueDot's grants programme, alongside Orion." },
  { year: "Apr — Jun 2026",     what: "AGI Strategy cohort · BlueDot",              where: "BlueDot Impact",                track: "study",       cat: "blue",    big: false, lenses: ["ml"],              note: "Pre-reading and weekly seminars on AGI strategy, alignment, and frontier-AI policy. Completed June 2026." },
  { year: "Feb 2026",           what: "Elected MInstP · Institute of Physics",      where: "London",                        track: "study",       cat: "prompt",  big: false, lenses: ["ml", "community"], note: "Member of the UK's professional body for physics." },
  { year: "Aug 2025",           what: "Best Paper · IEEE ICCUBEA-2025",             where: "co-author",                     track: "study",       cat: "purple",  big: false, lenses: ["ml"],              note: "Flipkart–Walmart merger NLP. 1,240 submissions, 220 accepted, one Best Paper. With Prof. Chakraborty." },
  { year: "2025 —",             what: "STEM Ambassador · InnovateHer",              where: "UK schools",                    track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "200+ students spoken to across UK schools about careers in tech; named an InnovateHer Ambassador for the year. Recent talks at the University of Liverpool Maths School and DACA London. DBS-checked." },
  { year: "2025 —",             what: "Mentor · Stemmettes",                        where: "STEM-ed outreach",              track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Workshops, panels and 1:1s for girls and non-binary young people moving toward engineering, maths and CS." },
  { year: "2025 —",             what: "Science Communicator · I'm a…",              where: "public engagement",             track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Answering school students' science questions live — CS and maths." },
  { year: "2025 —",             what: "Member · MLOps Community London",            where: "London",                        track: "engineering", cat: "yellow",  big: false, lenses: ["community", "eng"], note: "Local chapter of the global MLOps community — talks and meetups on running ML in production." },
  { year: "2025 —",             what: "MARS cohort · AI safety research",           where: "mentored research",             track: "research",    cat: "blue",    big: false, lenses: ["community", "ml"],  note: "Selected for the MARS cohort — mentored AI safety research." },
  { year: "2025 —",             what: "OSS maintainer · Taylor Swift rec engine, revamped", where: "open source · self-directed", track: "engineering", cat: "ochre",   big: true,  lenses: ["eng", "ml"],       note: "Rebuilt the original R/Shiny rec engine in Python + TypeScript. Six independent ML engines running in parallel — Sentence-BERT on lyrics, a VAE compressing Spotify audio features to 16 dimensions, Node2Vec graph embeddings, neural collaborative filtering, contrastive self-supervised learning, and a knowledge graph over 561 nodes. 801 songs, editorial bridges to 53 related artists. Recommendations in under 200ms. Live on Vercel." },
  { year: "Apr 2024 —",         what: "Founding Engineer · Orion",                  where: "London",                        track: "engineering", cat: "teal",    big: true,  lenses: ["ml", "data"],      note: "Building geospatial intelligence infrastructure from scratch — data pipelines for high-volume multi-source streams, ML anomaly detection over the H3 spatial indexing layer, confidence-weighted signal fusion, backend services in Python and Golang. One of the first two hires; joined as Data Engineer, became Data & ML Engineer in Nov 2024, then Founding Engineer. Currently rewriting the LLM-driven search system end-to-end — tool schemas, decision-tree system prompts, few-shot disambiguation, output evaluation." },
  { year: "Oct 2023 —",         what: "Ambassador · Oxford Mathematical Institute", where: "Oxford · LMH",                  track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Q&A panels and applicant support at the Mathematical Institute and Lady Margaret Hall." },
  { year: "Sep 2023 — Jul 2024", what: "MFoCS · Oxford · Lady Margaret Hall",      where: "Maths + CS",                    track: "study",       cat: "magenta", big: true,  lenses: ["ml", "community"], note: "Thesis: automated immune-biomarker detection on multiplex IF tumour data. Modules: Geometric Deep Learning, Game Theory, Quantum Information, Category Theory." },
  { year: "Sep 2023 · 1 mo",    what: "Machine Learning Researcher · FLAME",        where: "Pune · contract",               track: "research",    cat: "purple",  big: false, lenses: ["ml", "research"],  note: "Generative and reconstructive applications of Variational Autoencoders (VAEs) and associated algorithms." },
  { year: "Jun — Sep 2023",     what: "ML Engineering Intern · Natter",             where: "London",                        track: "engineering", cat: "purple",  big: false, lenses: ["ml", "data"],      note: "Content-moderation models (bullying, distress, spam) on social text, plus a user-matching recommender." },
  { year: "May 2023",           what: "BSc (Hons) CS · Dean's Roll · FLAME",       where: "CGPA 8.53",                     track: "study",       cat: "yellow",  big: false, lenses: ["eng", "community"], note: "Graduated with the Dean's Roll of Honour." },
  { year: "Sep 2022 — May 2023", what: "BSc Honours Thesis · GNSS water vapour",   where: "FLAME · Prof. Gopalan",          track: "study",       cat: "prompt",  big: false, lenses: ["ml"],              note: "Estimated tropospheric water-vapour from GNSS signals with regression ML, beating linear baselines on accuracy and robustness." },
  { year: "late 2022",          what: "OSS · Taylor Swift rec engine — original R/Shiny", where: "open source · FLAME final year", track: "engineering", cat: "ochre",  big: false, lenses: ["eng", "ml"],       note: "UBCF hybrid recommender in R — 10 separate audio-feature models (danceability, energy, acousticness, valence, tempo, loudness, popularity, speechiness, liveness, album membership) merged via recommenderlab's HybridRecommender. Visualisations break down why each song was chosen. Still live on shinyapps.io." },
  { year: "2022 — 2023",        what: "Founder + President · Dotslash",             where: "FLAME University",              track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Founded and led a 10+ person team running tech events pulling 100+ attendees per session." },
  { year: "2022 — 2023",        what: "Vice-Captain · Student Council",             where: "FLAME University",              track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Automated allocation of six annual student awards with Python + Google Sheets API." },
  { year: "May — Jul 2022",     what: "Backend Developer Intern · JobsForHer",      where: "Bangalore",                     track: "engineering", cat: "yellow",  big: false, lenses: ["data"],            note: "User flows in Flask, PostgreSQL, and scalable AWS deploys (EC2, S3, load balancers, CloudWatch, SNS)." },
  { year: "2022",               what: "OSS · IoT weather bot · layered cipher",     where: "open source · FLAME",           track: "engineering", cat: "cyan",    big: false, lenses: ["eng"],             note: "Arduino/ESP8266 temperature and humidity monitor — RGB status LEDs, buzzer, servo fan, ThingSpeak cloud logging with rate-aware uploads every 7 loop iterations. And a four-layer Python cipher (scatter → wheel-spin → binary transform → matrix + ASCII) with SHA-256 tamper detection and 2,000+ round-trip tests, rooted in a linear-algebra module." },
  { year: "Jan — Aug 2022",     what: "Research Intern · Prof. Valadi, FLAME",      where: "Bioinformatics",                track: "research",    cat: "red",     big: false, lenses: ["research", "ml"],  note: "Improved the JAYA optimiser (size-penalised fitness, elitism) for protein function ID. Poster PP-28 at INBIX'22." },
  { year: "Oct 2021 — Apr 2022", what: "Data Analyst · Centre for Knowledge Alternatives", where: "Pune",                  track: "research",    cat: "teal",    big: false, lenses: ["data", "research"], note: "Cultural mapping of Kolhapur for the Discover India Project — government datasets, Tableau. Led a five-person team." },
  { year: "Aug 2021 — Jan 2022", what: "Research Intern · Prof. Gopalan, FLAME",   where: "Atmospheric ML",                track: "research",    cat: "prompt",  big: false, lenses: ["research", "ml", "data"], note: "Derived cloud information from INSAT-3D satellite data — thresholding clear-sky vs cloudy pixels with NumPy, SciPy, PyHDF, NetCDF." },
  { year: "Jun 2020 — Jun 2021", what: "Co-founder · UnisphereCo",                 where: "Hyderabad",                     track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Platform for the undergrad-application process — mentors from 50+ universities, 200+ attendees per session." },
  { year: "Jul 2019 — Jul 2021", what: "Founder · PrintedCraft",                   where: "Bangalore",                     track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Personalised-printing business — Python connector to a cloud product DB, Google + Facebook Ads, 100+ designs." },
];

export const WORK_GANTT_LANES: GanttLane[] = [
  { key: "engineering", label: "eng", color: "teal", bars: [
    { left: 41,   w: 4,   top: 3, h: 10, cat: "yellow",  label: "JobsForHer · backend intern (2022)",             lenses: ["eng"],        match: ["JobsForHer"] },
    { left: 56,   w: 4,   top: 3, h: 10, cat: "purple",  label: "Natter · ML engineering intern (2023)",          lenses: ["ml", "eng"],  match: ["Natter"] },
    { left: 68,   w: 32,  top: 1, h: 14, cat: "teal",    label: "Orion · founding engineer (2024 — now)",         lenses: ["ml", "eng"],  big: true, name: "Orion →", match: ["Founding Engineer"] },
    { left: 84,   w: 16,  top: 12, h: 4, cat: "ochre",  label: "OSS · rec engine revamped, 6 ML engines (2025—)", lenses: ["eng", "ml"],  match: ["rec engine, revamped"] },
  ]},
  { key: "research", label: "research", color: "blue", bars: [
    { left: 30,   w: 6,   top: 1, h: 7,  cat: "prompt",  label: "Gopalan · atmospheric ML research (2021)",         lenses: ["ml"],             match: ["Prof. Gopalan"] },
    { left: 32,   w: 7,   top: 9, h: 7,  cat: "teal",    label: "Kolhapur · cultural mapping (2021–22)",            lenses: ["eng"],            match: ["Knowledge Alternatives"] },
    { left: 36,   w: 8,   top: 1, h: 7,  cat: "red",     label: "Valadi · bioinformatics, JAYA (2022)",             lenses: ["ml"],             match: ["Valadi"] },
    { left: 58,   w: 2,   top: 9, h: 7,  cat: "purple",  label: "FLAME · ML researcher, VAEs (Sep 2023)",           lenses: ["ml"],             match: ["Machine Learning Researcher"] },
    { left: 95,   w: 5,   top: 3, h: 11, cat: "blue",    label: "BlueDot · AI-safety research, funded (2026 — now)", lenses: ["ml"],           match: ["AI Researcher"] },
  ]},
  { key: "study", label: "study", color: "magenta", bars: [
    { left: 1,    w: 54,  top: 1, h: 7,  cat: "yellow",  label: "FLAME · BSc Computer Science (2019–23)",          lenses: ["eng", "community"], match: ["BSc (Hons)"] },
    { left: 46,   w: 10,  top: 9, h: 7,  cat: "prompt",  label: "Honours thesis · GNSS (2022–23)",                 lenses: ["ml"],               match: ["Honours Thesis"] },
    { left: 60,   w: 11,  top: 1, h: 7,  cat: "magenta", label: "Oxford · MFoCS, Maths + CS (2023–24)",            lenses: ["ml", "community"],  match: ["MFoCS"] },
    { left: 86,   w: 2,   top: 9, h: 7,  cat: "purple",  label: "IEEE ICCUBEA · Best Paper (2025)",                lenses: ["ml"],               match: ["Best Paper"] },
    { left: 93,   w: 2,   top: 9, h: 7,  cat: "prompt",  label: "Elected MInstP (2026)",                           lenses: ["ml", "community"],  match: ["MInstP"] },
    { left: 95.5, w: 4.5, top: 1, h: 7,  cat: "purple",  label: "HF Agents certs · Google cyber (2026)",          lenses: ["ml", "eng"],        match: ["Hugging Face", "Google Cybersecurity"] },
  ]},
  { key: "outreach", label: "outreach", color: "orange", bars: [
    { left: 1,    w: 28,  top: 1, h: 7,  cat: "orange",  label: "PrintedCraft · founder (2019–21)",                lenses: ["community"], match: ["PrintedCraft"] },
    { left: 14,   w: 14,  top: 9, h: 7,  cat: "orange",  label: "UnisphereCo · co-founder (2020–21)",              lenses: ["community"], faded: true, match: ["UnisphereCo"] },
    { left: 36,   w: 14,  top: 1, h: 7,  cat: "orange",  label: "Dotslash + Student Council (2022–23)",            lenses: ["community"], match: ["Dotslash", "Student Council"] },
    { left: 60,   w: 40,  top: 9, h: 7,  cat: "orange",  label: "Oxford Maths · ambassador (2023 — now)",          lenses: ["community"], faded: true, match: ["Oxford Mathematical"] },
    { left: 78,   w: 22,  top: 1, h: 7,  cat: "orange",  label: "Mentor · Stemmettes / InnovateHer (2025 — now)", lenses: ["community"], match: ["Mentor"] },
  ]},
];

export const WORK_FEATURED_V5: WorkFeaturedV5[] = [
  {
    name: "Orion intelligence platform",
    cat: "teal", scope: "founding-eng", deploy: "in production",
    url: null, essay: null, private: true,
    blurb: "Geospatial intelligence over H3 spatial indexing — data infrastructure for high-volume multi-source streams, ML anomaly detection and confidence-weighted signal fusion, backend services in Python and Golang. Joined as one of two founding engineers (first hires after the founders); building the data stack from scratch and currently rewriting the LLM-driven search system end-to-end — tool schemas, decision-tree system prompts, few-shot disambiguation, output evaluation.",
    metrics: ["H3 spatial index", "Python · Go", "multi-source fusion", "LLM search rewrite"],
    lenses: ["ml", "data"],
  },
  {
    name: "fashion-web",
    cat: "ochre", scope: "deployed · solo", deploy: "last deploy · 2026",
    url: "https://fashion-web-psi.vercel.app", essay: "fashion-trends", private: false,
    blurb: "Predicts which fashion micro-trends peak 30 days out — five live sources merged into a Holt-smoothed composite signal, an LMSR prediction market (b=100) against the house model, and Gemini 2.5 Flash outfit recognition matched against runway collections.",
    metrics: ["250+ terms", "5 live sources", "LMSR · b=100", "Brier-scored"],
    lenses: ["ml", "data"],
  },
];

export const WORK_BUILDS_LIST_V5: WorkBuildItemV5[] = [
  { name: "platypus-learn",                    cat: "purple", scope: "deployed · solo",       url: "https://platypus-learn.vercel.app",                         essay: null,            lenses: ["ml"],              blurb: "Turns PDFs and YouTube videos into structured courses with assessments, a goals dashboard, and an email digest.",                                                                   metrics: ["PDF · video → course", "Next.js · Supabase", "Claude API"] },
  { name: "Taylor Swift recommendation engine", cat: "ochre",  scope: "open",                 url: "https://shubz-taylor-recommendation-engine.vercel.app",     essay: "six-engines",   lenses: ["ml"],              blurb: "Six engines in parallel — SBERT, a VAE on audio features, node2vec, neural CF, contrastive SSL, and a consensus-boosted ensemble.",                                           metrics: ["6 engines", "<200ms", "SBERT · VAE · node2vec", "TS + FastAPI"] },
  { name: "MFoCS thesis · immune biomarkers",  cat: "red",    scope: "Oxford · 2024",        url: null,                                                         essay: "threshold-gate", lenses: ["research", "ml"],  blurb: "Two problems in automated biomarker detection on real tumour data — four thresholding methods, and constrained spectral clustering.",                                          metrics: ["4 thresholding methods", "spectral clustering", "beat 5/7 baselines"] },
  { name: "Flipkart–Walmart merger NLP",        cat: "ochre",  scope: "academic · Best Paper", url: null,                                                        essay: null,            lenses: ["ml", "research"],  blurb: "Theme extraction and sentiment mining across four years of coverage of the $16B acquisition.",                                                                                metrics: ["4 yrs coverage", "Best Paper", "1,240 → 220 accepted"] },
  { name: "JAYA protein feature selection",     cat: "purple", scope: "open · research",      url: "https://github.com/shubhangithub/inbix22",                  essay: "jaya",          lenses: ["ml", "research"],  blurb: "A parameter-free stochastic optimiser improved with a size-penalty fitness function and elitism for protein function identification.",                                        metrics: ["3 datasets", "smaller feature sets", "INBIX'22 · PP-28"] },
  { name: "GNSS water-vapour ML",               cat: "prompt", scope: "honours thesis",       url: null,                                                         essay: null,            lenses: ["research", "ml"],  blurb: "Tropospheric water-vapour estimation from GNSS signals, beating linear baselines on accuracy and robustness to atmospheric variability.",                                    metrics: ["beat linear baselines", "honours thesis"] },
  { name: "Nand2Tetris — 16-bit computer",      cat: "cyan",   scope: "coursework",           url: null,                                                         essay: null,            lenses: ["data"],            blurb: "A working general-purpose computer from NAND gates up — HDL through machine language, VM, compiler, and a minimal OS.",                                                     metrics: ["NAND → OS", "all 13 projects"] },
  { name: "this site",                          cat: "yellow", scope: "open",                 url: "https://github.com/shubhangithub/personal-site",            essay: null,            lenses: ["community"],       blurb: "Astro + React islands, 40+ hand-coded animated diagrams, custom typography. No D3.",                                                                                        metrics: ["Astro · React islands", "40+ diagrams", "open source"] },
  { name: "Taylor Swift rec engine — R/Shiny", cat: "ochre",  scope: "open · 2022",          url: "https://shubz.shinyapps.io/shubz-taylor-rec-engine-folder/", essay: null,            lenses: ["ml", "eng"],       blurb: "UBCF hybrid recommender in R — 10 separate audio-feature models (danceability, energy, acousticness, valence, tempo, loudness, popularity, speechiness, liveness, album membership) merged via recommenderlab's HybridRecommender. Visualisations break down why each song was chosen. The predecessor to the six-engine Python rebuild.",                metrics: ["10 UBCF models", "hybrid recommender", "shinyapps.io · live"] },
  { name: "IoT weather bot",                    cat: "cyan",   scope: "open · 2022",          url: "https://github.com/shubhangithub/IoT-weather-bot",           essay: null,            lenses: ["eng"],             blurb: "Arduino/ESP8266 temperature and humidity monitor with RGB status LEDs, a buzzer, a servo fan, and ThingSpeak cloud logging. Rate-aware uploads every 7 loop iterations to respect ThingSpeak's 15-second ingest limit. Full 7-iteration evolution of the codebase preserved in the repo.",                                                              metrics: ["Arduino · ESP8266", "ThingSpeak · Wi-Fi", "7 iterations"] },
  { name: "layered cipher",                     cat: "magenta", scope: "open · 2022",         url: "https://github.com/shubhangithub/layered-cipher",            essay: null,            lenses: ["eng"],             blurb: "Four-layer Python cipher (scatter → wheel-spin → binary transform → matrix + ASCII) with SHA-256 tamper detection and 2,000+ round-trip tests. Grew from a linear-algebra module; the matrix layer's reversibility condition came directly from lecture notes. CI runs on every push.",                                                              metrics: ["4 layers", "SHA-256 integrity", "2,000+ tests · CI"] },
];

export const WORK_CORE_CARDS: CoreCard[] = [
  { name: "Geospatial ML · H3 indexing",   group: "Geospatial",     cat: "teal",    tier: "daily driver",    count: "1 role",        link: "orion · /work",           href: "/work/",                                              essay: null,            lenses: ["ml", "data"] },
  { name: "LLM eng · tool schemas · evals", group: "AI/ML",         cat: "purple",  tier: "daily driver",    count: "orion search",  link: "orion search · /now",     href: "/now/",                                               essay: null,            lenses: ["ml"] },
  { name: "Python",                          group: "AI/ML",         cat: "purple",  tier: "daily driver",    count: "6 projects",    link: "six engines",             href: "/six-engines/",                                       essay: "six-engines",   lenses: ["ml", "data", "research"] },
  { name: "Rust · Golang",                   group: "Geospatial",    cat: "teal",    tier: "daily driver",    count: "1 role",        link: "orion · /work",           href: "/work/",                                              essay: null,            lenses: ["data"] },
  { name: "AI alignment research",           group: "AI safety",     cat: "blue",    tier: "studied · funded", count: "BDI grant",    link: "bending the curve",       href: "/bluedot-unit1/",                                     essay: "bluedot-unit1", essayCat: "blue", lenses: ["research"] },
  { name: "LMSR prediction markets",         group: "fintech",       cat: "ochre",   tier: "shipped",         count: "fashion-web",   link: "pricing the next scarf",  href: "/fashion-trends/",                                    essay: "fashion-trends", lenses: ["ml", "data"] },
  { name: "Recommendation systems",          group: "fintech",       cat: "ochre",   tier: "shipped",         count: "2 projects",    link: "six engines",             href: "/six-engines/",                                       essay: "six-engines",   lenses: ["ml"] },
  { name: "Claude API · Anthropic SDK",      group: "AI/ML",         cat: "purple",  tier: "daily driver",    count: "2 projects",    link: "platypus-learn",          href: "https://platypus-learn.vercel.app",                   essay: null,            lenses: ["ml"] },
  { name: "PyTorch · scikit-learn",          group: "AI/ML",         cat: "purple",  tier: "shipped",         count: "2 projects",    link: "positive by how much",    href: "/threshold-gate/",                                    essay: "threshold-gate", lenses: ["ml", "research"] },
  { name: "Quantum Information · ZX",        group: "Physics",       cat: "prompt",  tier: "studied",         count: "Oxford",        link: "two colours, a Hadamard", href: "/zx-calculus/",                                       essay: "zx-calculus",   essayCat: "prompt", lenses: ["research"] },
  { name: "Computational Game Theory",       group: "Mathematics",   cat: "magenta", tier: "studied",         count: "Oxford MFoCS",  link: "Oxford module · cv",      href: CV_PDF,                                                essay: null,            lenses: ["research"] },
  { name: "Bioinformatics",                  group: "Biotech",       cat: "red",     tier: "shipped",         count: "2 projects",    link: "jaya · proteins",         href: "/jaya/",                                              essay: "jaya",          lenses: ["research", "ml"] },
  { name: "Astro · React islands",           group: "Infrastructure", cat: "yellow", tier: "daily driver",   count: "this site",     link: "this site repo",          href: "https://github.com/shubhangithub/personal-site",      essay: null,            lenses: ["community"] },
  { name: "Founding / building from zero",   group: "Outreach",      cat: "orange",  tier: "daily driver",    count: "2 ventures",    link: "orion · day one",         href: "/work/",                                              essay: null,            lenses: ["community"] },
];

export const WORK_FULL_GROUPS: FullGroup[] = [
  { group: "AI safety",       cat: "blue",    items: ["AI alignment research", "AI ethics & governance"] },
  { group: "AI/ML",           cat: "purple",  items: ["Python", "R", "NumPy · SciPy · Pandas", "PyTorch · scikit-learn", "SpaCy · NLTK · Gensim", "Claude API", "Gemini API", "Prompt engineering", "Few-shot disambiguation", "Decision-tree prompts", "LLM evaluation", "Feature selection", "Genetic algorithms", "Regression modelling", "Sentiment + theme extraction", "Web scraping"] },
  { group: "Mathematics",     cat: "magenta", items: ["Computational Game Theory", "Geometric Deep Learning", "Graph Theory", "Category Theory", "Collective Decision Making", "Computational Complexity", "Cryptography · number theory", "Linear algebra · transforms"] },
  { group: "Physics",         cat: "prompt",  items: ["Quantum Information", "ZX-rewriting", "GNSS atmospheric modelling", "Satellite remote sensing", "PyHDF · NetCDF"] },
  { group: "Biotech",         cat: "red",     items: ["Bioinformatics", "Constrained · spectral clustering", "Automated thresholding", "Image processing (multiplex IF)", "Explainable AI (WOE binning)", "Lotka–Volterra dynamics"] },
  { group: "Geospatial",      cat: "teal",    items: ["Rust", "Golang", "Geospatial ML · H3 indexing", "Anomaly detection", "Confidence-weighted fusion", "ETL · data pipelines"] },
  { group: "fintech",         cat: "ochre",   items: ["LMSR prediction markets", "Time-series forecasting", "statsmodels · Holt-Winters", "Calibration · Brier scoring", "Recommendation systems", "Ensemble methods"] },
  { group: "Hardware",        cat: "cyan",    items: ["C++", "IoT", "ThingSpeak · microcontrollers", "Compiler · VM design", "HDL · gate-level design"] },
  { group: "Infrastructure",  cat: "yellow",  items: ["TypeScript", "SQL · PostgreSQL", "Astro · React islands", "Next.js · Supabase · Resend", "Vercel", "AWS · EC2 · S3", "Tableau", "Flask", "Google APIs", "Git · CI/CD", "D3 · hand-rolled SVG", "FastAPI", "UI / UX design"] },
  { group: "Outreach",        cat: "orange",  items: ["Team leadership", "Mentoring", "Teaching", "STEM-ed outreach", "DBS-checked (UK)", "Research writing", "Conference talks", "Event organising", "Cross-cultural collaboration", "Technical docs", "Stakeholder comms", "Founding from zero", "Digital marketing · SEO", "Graphic · product design", "Qualitative research"] },
];
