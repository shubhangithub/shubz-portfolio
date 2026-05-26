// work.ts — editable copy for /work. The WorkV5 component imports
// everything here and lays it out; edit the constants to change the
// content. Open this file via "edit this page →" in the page footer.
//
// Sections in render order:
//   1. Hero, lede, marginalia (top of page)
//   2. WORK_EVENTS    — trajectory timeline (§02)
//   3. WORK_BUILDS    — selected work (§03)
//   4. WORK_TOOLBOX   — full taxonomy of skills, 10 canonical topic groups (§04)
//   5. WORK_SPEAKING  — speaking + STEM outreach (§05)
//   6. Right-rail data (cv.pdf stat, open-to, based.md)

import type { NBAccentKey } from "./palette";
import type { Span } from "./home";

// ---------------------------------------------------------------------------
// Shared constants — referenced by toolbox links
// ---------------------------------------------------------------------------
export const CV_PDF = "/uploads/Shubhangi-Sharma-Resume-20260211.pdf";
export const PERSONAL_SITE_REPO = "https://github.com/shubhangithub/personal-site";

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
export const WORK_HERO: Span[] = [
  "Things I've ",
  { em: "built", c: "yellow" },
  " and ",
  { em: "almost", c: "yellow" },
  " finished.",
];

/** Lede sentence under the H1. The `pdfLink` substring is rendered as
 *  a link to CV_PDF; the rest is plain text. */
export const WORK_LEDE_PARTS = {
  before: "The CV with marginalia. Each entry has a footnote — what I actually did, what I would change, what I learned. Available as ",
  pdfLink: "PDF",
  after: " for the more conventional version.",
};

export const WORK_MARGINALIA = {
  /** Lines render with <br/> between them. The last line is a link to
   *  CV_PDF when `seeHereLink` is true — used to invite the visitor to
   *  the traditional CV alongside this annotated view. */
  lines: ["for the more", "traditional CV,", "see here →"],
  accent: "yellow" as NBAccentKey,
  /** When set, wraps "see here" in the last line with a link to this URL. */
  seeHereHref: CV_PDF,
};

export const WORK_LAST_UPDATED_LABEL = "WORK · CV WITH MARGINALIA";
export const WORK_LAST_UPDATED_DATE = "26 may 2026";

// ---------------------------------------------------------------------------
// §02 TRAJECTORY — career timeline, most-recent-first
// ---------------------------------------------------------------------------
export type WorkEvent = {
  year: string;
  what: string;
  where: string;
  note: string;
};

export const WORK_EVENTS: WorkEvent[] = [
  { year: "Feb 2026",                what: "Elected MInstP · Institute of Physics",                                       where: "London",            note: "The UK's professional body for physics. The certificate is small and unreasonably satisfying." },
  { year: "Apr 2024 —",              what: "Founding Engineer · Orion",                                                   where: "London",            note: "Building geospatial intelligence infrastructure from scratch — data pipelines for high-volume multi-source streams, ML anomaly detection over H3 spatial indexing, backend services in Python and Golang. The job description keeps getting shorter; the scope keeps getting wider. Joined as Data Engineer (Apr 2024 → Nov 2024), then Data & ML Engineer (Nov 2024 → Aug 2025), then Founding Engineer." },
  { year: "Oct 2023 —",              what: "Student Ambassador · Oxford Mathematical Institute",                         where: "Oxford · LMH",      note: "Working with prospective applicants at the Mathematical Institute and Lady Margaret Hall — answering questions, sitting on Q&A panels, demystifying the application process." },
  { year: "Aug 2025",                what: "Best Paper · IEEE ICCUBEA-2025",                                              where: "co-author",         note: "\"Decoding Flipkart-Walmart Merger\" — theme extraction and sentiment mining across four years of news coverage. 1,240 submissions, 220 accepted, one Best Paper. Co-authored with Prof. Chakraborty; started as a scrape, ended as an award." },
  { year: "Sep 2023 – Jul 2024",     what: "MFoCS · Oxford · Lady Margaret Hall",                                          where: "Math + CS",         note: "Thesis: automated immune biomarker detection on multiplex immunofluorescence data from tumour samples. Modules included Geometric Deep Learning, Computational Game Theory, Quantum Information, and Category Theory. The place where everything I'd been doing separately started making sense together." },
  { year: "Jun – Sep 2023",          what: "ML Engineering Intern · Natter",                                               where: "London",            note: "Content moderation models for bullying, mental-distress, and spam detection on social text, plus a user-matching recommender. First time building something that needed to work reliably for people who didn't know it existed." },
  { year: "Sep 2020 – May 2023",     what: "BSc (Hons) Computer Science · FLAME University",                              where: "CGPA 8.53 · Dean's", note: "Graduated ranked 3rd in cohort (from 41st in year one). Honours thesis on GNSS water-vapour estimation via ML, outperforming traditional linear baselines. Three years of learning how to work." },
  { year: "May – Jul 2022",          what: "Backend Developer Intern · JobsForHer",                                        where: "Bangalore",         note: "Built user-facing flows in Flask, queried PostgreSQL, configured and deployed scaleable services on AWS (EC2, S3, load balancers, CloudWatch, SNS). First production stack from request to deploy." },
  { year: "Jan – Aug 2022",          what: "Research Intern · Prof. Jayaraman Valadi, FLAME",                              where: "Bioinformatics",    note: "Improved the JAYA stochastic optimizer — size-penalised fitness function and elitism — for protein function identification on three biological datasets. Poster PP-28 at INBIX'22, VFSTR. First time a modification of mine made something measurably better." },
  { year: "Oct 2021 – Apr 2022",     what: "Data Analyst & Researcher · Centre for Knowledge Alternatives",                where: "Pune",              note: "Cultural mapping of Kolhapur district for the Discover India Project — government datasets, Tableau, sector reports. Led a five-person team analysing law and order data. First time data told a story about real places and real people." },
  { year: "Jun 2020 – Jun 2021",     what: "Co-founder · UnisphereCo",                                                     where: "Hyderabad",         note: "Online platform for the undergraduate-application process: mentors from 50+ universities, 200+ attendees per session. First time running something that other people depended on." },
  { year: "Jul 2019 – Jul 2021",     what: "Founder · PrintedCraft",                                                       where: "Bangalore",         note: "Personalised printing business. Built a Python connector to a cloud product database for real-time promotions. Integrated Google + Facebook Ads to land on Google's first page. 100+ product designs, suppliers across the country. First time code made something happen in the physical world." },
];

// ---------------------------------------------------------------------------
// §03 SELECTED WORK — builds, with optional essay provenance
// ---------------------------------------------------------------------------
export type WorkBuild = {
  name: string;
  c: NBAccentKey;
  scope: string;
  year: string;
  /** Optional in-site essay slug. If set, the build links to that essay. */
  essay: string | null;
  /** Optional external URL (project deploy, GitHub repo). */
  url?: string;
  blurb: string;
};

export const WORK_BUILDS: WorkBuild[] = [
  { name: "Orion intelligence platform",        c: "teal",    scope: "founding-eng",          year: "2024 —", essay: null,              blurb: "Geospatial intelligence over H3 spatial indexing — data infrastructure for high-volume multi-source streams, ML anomaly detection and confidence-weighted signal fusion, backend services in Python and Golang. Built from scratch as the first engineer on the data stack." },
  { name: "fashion-web",                        c: "ochre",   scope: "deployed · solo",       year: "2026 —", essay: "fashion-trends",  url: "https://fashion-web-psi.vercel.app",                              blurb: "Predicts which fashion micro-trends will peak 30 days out. Five live sources (Google Trends, Bluesky firehose, Pinterest, Reddit, YouTube) merge into a Holt-smoothed composite signal tracking 250+ terms across silhouettes, colours, and aesthetics. A logarithmic prediction market (LMSR, b=100) lets traders compete against the house model with virtual StyleCoins. Gemini 2.5 Flash breaks down outfit photos and matches them against runway collections from eight major houses. House predictions are Brier-scored." },
  { name: "platypus-learn",                     c: "purple",  scope: "deployed · solo",       year: "2025 —", essay: null,              url: "https://platypus-learn.vercel.app",                                blurb: "Turns PDFs and YouTube videos into structured courses. Drop in a paper or a lecture; get back a coherent learning path with assessments, a weekly goals dashboard, and an email digest. Built with Next.js, Supabase, Claude API, and Resend." },
  { name: "Taylor Swift recommendation engine", c: "ochre",   scope: "open",                  year: "2026",   essay: "six-engines",     url: "https://shubz-taylor-recommendation-engine.vercel.app",            blurb: "Six engines running in parallel — Sentence-BERT on lyrics, a variational autoencoder compressing Spotify audio features to 16 dimensions, graph node2vec embeddings, neural collaborative filtering, contrastive self-supervised learning, and a weighted ensemble with a consensus boost for cross-engine agreement. Runs over Taylor's full discography plus hand-curated editorial bridges to related artists. Rebuilt from an R/Shiny original in TypeScript + FastAPI; recommendations in under 200ms." },
  { name: "MFoCS thesis · immune biomarkers",   c: "red",     scope: "Oxford · 2024",         year: "2024",   essay: "threshold-gate",  blurb: "Two problems in automated biomarker detection on multiplex immunofluorescence data from real tumour samples. First: four automated thresholding methods (Otsu, IsoData, custom GMM, minimum cross-entropy) competing to replicate a pathologist's gate — CTLA-4 resisted all of them, because the biology is genuinely ambiguous. Second: spectral clustering with biological co-expression constraints encoded directly in the similarity matrix, beating five of seven standard methods on plausibility. Thesis available in Oxford repository." },
  { name: "Flipkart–Walmart merger NLP",        c: "ochre",   scope: "academic · Best Paper", year: "2023–25", essay: null,             blurb: "Theme extraction and sentiment mining across four years of news coverage of the $16B acquisition. Identified dominant narrative clusters and tracked sentiment shifts through deal stages using SpaCy, NLTK, Gensim, and TextBlob. Best Paper at IEEE ICCUBEA-2025 from 1,240 submissions." },
  { name: "JAYA protein feature selection",     c: "purple",  scope: "open · research",       year: "2022",   essay: "jaya",            url: "https://github.com/Shubzthub/inbix22",                              blurb: "Modified a parameter-free stochastic optimizer with a size-penalty fitness function and elitism to improve feature selection for protein function identification. Tested on three biological datasets; consistently produced smaller feature sets without sacrificing classification accuracy. Poster PP-28 at INBIX'22." },
  { name: "GNSS water-vapour ML",               c: "prompt",  scope: "honours thesis",        year: "2023",   essay: null,              blurb: "Estimated tropospheric water-vapour content from GNSS signals using regression models, outperforming traditional linear baselines on accuracy and robustness to atmospheric variability. BSc honours thesis, FLAME University." },
  { name: "Nand2Tetris — 16-bit computer",      c: "cyan",    scope: "coursework",            year: "2022",   essay: null,              blurb: "Built a working general-purpose computer from NAND gates up: all 13 projects from HDL gate design through machine language, VM translator, compiler, and a minimal operating system." },
  { name: "this site",                          c: "yellow",  scope: "open",                  year: "2026",   essay: null,              url: "https://github.com/Shubzthub/personal-site",                        blurb: "Started as a single-file HTML + CSS + inline React app; migrated to Astro during the astro-migration branch. Essays, animated diagrams, and an unreasonable amount of time spent on typography." },
];

// ---------------------------------------------------------------------------
// §04 TOOLBOX — full taxonomy of skills, 10 canonical topic groups.
// Groups ARE the colour codes; every chip in a group shares its `primary`
// colour. See DECISIONS-v5.md §14 for slotting rules.
// ---------------------------------------------------------------------------
export type ChipLink = { label: string; href: string };
export type ToolItem = { name: string; links: ChipLink[] };
export type ToolGroup = { group: string; primary: NBAccentKey; items: ToolItem[] };

export const WORK_TOOLBOX: ToolGroup[] = [
  { group: "AI safety & alignment", primary: "blue", items: [
    { name: "AI alignment research", links: [
      { label: "a unit on bending the curve", href: "/bluedot-unit1/" },
      { label: "bluedot AGI strategy cohort · /now", href: "/now/" },
    ] },
    { name: "AI ethics & governance", links: [
      { label: "bluedot AGI strategy cohort · /now", href: "/now/" },
    ] },
  ] },
  { group: "ML technical research", primary: "purple", items: [
    { name: "Python",            links: [
      { label: "jaya, improved", href: "/jaya/" },
      { label: "positive by how much", href: "/threshold-gate/" },
      { label: "six engines", href: "/six-engines/" },
      { label: "honours thesis · GNSS · CV", href: CV_PDF },
    ] },
    { name: "R",                 links: [
      { label: "taylor rec (original R/Shiny) · CV", href: CV_PDF },
      { label: "FLAME peer tutoring · CV", href: CV_PDF },
    ] },
    { name: "NumPy · SciPy · Pandas", links: [
      { label: "jaya", href: "/jaya/" },
      { label: "honours thesis · CV", href: CV_PDF },
    ] },
    { name: "matplotlib",        links: [{ label: "jaya plots", href: "/jaya/" }] },
    { name: "PyTorch · scikit-learn", links: [
      { label: "positive by how much", href: "/threshold-gate/" },
      { label: "cells that can't exist", href: "/constraint-clustering/" },
    ] },
    { name: "SpaCy · NLTK · Gensim · TextBlob", links: [{ label: "flipkart-walmart merger NLP · CV", href: CV_PDF }] },
    { name: "ggplot · dplyr · tidyr · shiny · purrr", links: [{ label: "taylor rec (R/Shiny) · CV", href: CV_PDF }] },
    { name: "Claude API · Anthropic SDK", links: [
      { label: "platypus-learn (PDFs/videos → courses)", href: "https://platypus-learn.vercel.app" },
      { label: "used to redesign fashion-web · /now", href: "/now/" },
    ] },
    { name: "Gemini API (2.5 Flash)", links: [{ label: "fashion-web outfit recognition", href: "https://fashion-web-psi.vercel.app" }] },
    { name: "Prompt engineering · tool schemas", links: [{ label: "orion search system · /now", href: "/now/" }] },
    { name: "Few-shot disambiguation", links: [{ label: "orion search · /now", href: "/now/" }] },
    { name: "Decision-tree system prompts", links: [{ label: "orion search system · /now", href: "/now/" }] },
    { name: "LLM evaluation · output testing", links: [{ label: "orion search rewrites · /now", href: "/now/" }] },
    { name: "Feature selection (JAYA-style)", links: [{ label: "jaya, improved", href: "/jaya/" }] },
    { name: "Genetic algorithms · crossover/mutation", links: [{ label: "jaya, improved", href: "/jaya/" }] },
    { name: "Regression modelling", links: [{ label: "honours thesis · GNSS water vapour · CV", href: CV_PDF }] },
    { name: "Sentiment + theme extraction", links: [{ label: "flipkart-walmart merger · CV", href: CV_PDF }] },
    { name: "Web scraping",      links: [
      { label: "merger NLP · CV", href: CV_PDF },
      { label: "natter data collection · CV", href: CV_PDF },
    ] },
  ] },
  { group: "Mathematics", primary: "magenta", items: [
    { name: "Computational Game Theory",   links: [{ label: "Oxford MFoCS module · CV", href: CV_PDF }] },
    { name: "Geometric Deep Learning",     links: [{ label: "Oxford MFoCS module · CV", href: CV_PDF }] },
    { name: "Graph Theory",                links: [{ label: "Oxford MFoCS module · CV", href: CV_PDF }] },
    { name: "Category Theory",             links: [{ label: "Oxford MFoCS module · CV", href: CV_PDF }] },
    { name: "Algorithmic Foundations of Collective Decision Making", links: [{ label: "Oxford MFoCS module · CV", href: CV_PDF }] },
    { name: "Computational Complexity",    links: [{ label: "Oxford MFoCS module · CV", href: CV_PDF }] },
    { name: "Cryptography · number theory", links: [{ label: "cipher program (5-layer) · CV", href: CV_PDF }] },
    { name: "Linear algebra · transforms", links: [
      { label: "GNSS regression · CV", href: CV_PDF },
      { label: "cipher program · CV", href: CV_PDF },
    ] },
  ] },
  { group: "Physics", primary: "prompt", items: [
    { name: "Quantum Information",         links: [
      { label: "Oxford MFoCS module · CV", href: CV_PDF },
      { label: "two colours and a Hadamard", href: "/zx-calculus/" },
    ] },
    { name: "ZX-rewriting",                links: [{ label: "two colours and a Hadamard", href: "/zx-calculus/" }] },
    { name: "GNSS atmospheric modelling",  links: [{ label: "honours thesis · water vapour · CV", href: CV_PDF }] },
    { name: "Satellite remote sensing",    links: [{ label: "INSAT-3D cloud detection · CV", href: CV_PDF }] },
    { name: "PyHDF · NetCDF",              links: [{ label: "INSAT-3D cloud detection · CV", href: CV_PDF }] },
  ] },
  { group: "Biotech", primary: "red", items: [
    { name: "Bioinformatics",              links: [
      { label: "jaya · proteins", href: "/jaya/" },
      { label: "MFoCS thesis · biomarkers", href: "/threshold-gate/" },
    ] },
    { name: "Constrained · spectral clustering", links: [{ label: "cells that can't exist", href: "/constraint-clustering/" }] },
    { name: "Automated thresholding",      links: [{ label: "positive by how much", href: "/threshold-gate/" }] },
    { name: "Image processing (multiplex IF)", links: [{ label: "MFoCS thesis · biomarkers", href: "/threshold-gate/" }] },
    { name: "Explainable AI (WOE binning)", links: [{ label: "protein sequence decoding · CV", href: CV_PDF }] },
    { name: "Lotka–Volterra dynamics",     links: [{ label: "predator and prey", href: "/may-2026/" }] },
  ] },
  { group: "Geospatial", primary: "teal", items: [
    { name: "Rust",   links: [{ label: "orion (founding) · /work", href: "/work/" }] },
    { name: "Golang", links: [{ label: "orion (founding) · /work", href: "/work/" }] },
    { name: "Geospatial ML · H3 indexing", links: [{ label: "orion · /work", href: "/work/" }] },
    { name: "Anomaly detection",           links: [{ label: "orion · ML over H3 · /work", href: "/work/" }] },
    { name: "Confidence-weighted signal fusion", links: [{ label: "orion · multi-source fusion · /work", href: "/work/" }] },
    { name: "ETL · data pipelines",        links: [{ label: "orion · multi-source ingestion · /work", href: "/work/" }] },
  ] },
  { group: "Markets, predictions & fintech", primary: "ochre", items: [
    { name: "LMSR prediction markets",     links: [{ label: "pricing the next scarf", href: "/fashion-trends/" }] },
    { name: "Time-series forecasting",     links: [{ label: "fashion-web (Holt-smoothed composite)", href: "https://fashion-web-psi.vercel.app" }] },
    { name: "statsmodels · Holt-Winters",  links: [{ label: "fashion-web composite signal", href: "https://fashion-web-psi.vercel.app" }] },
    { name: "Calibration · Brier scoring", links: [{ label: "fashion-web (house predictions)", href: "https://fashion-web-psi.vercel.app" }] },
    { name: "Recommendation systems",      links: [
      { label: "six engines", href: "/six-engines/" },
      { label: "natter user matching · CV", href: CV_PDF },
    ] },
    { name: "Ensemble methods",            links: [{ label: "six engines · consensus boost", href: "/six-engines/" }] },
  ] },
  { group: "Hardware", primary: "cyan", items: [
    { name: "C++",                          links: [{ label: "IoT weather bot · ThingSpeak · CV", href: CV_PDF }] },
    { name: "IoT",                          links: [{ label: "IoT weather bot · CV", href: CV_PDF }] },
    { name: "ThingSpeak · microcontrollers", links: [{ label: "IoT weather bot · CV", href: CV_PDF }] },
    { name: "Compiler · VM design",         links: [{ label: "Nand2Tetris (all 13 projects) · /work", href: "/work/" }] },
    { name: "HDL · gate-level design",      links: [{ label: "Nand2Tetris (NAND → computer) · /work", href: "/work/" }] },
  ] },
  { group: "Infrastructure & craft", primary: "yellow", items: [
    { name: "TypeScript", links: [
      { label: "this site repo", href: PERSONAL_SITE_REPO },
      { label: "six engines (TS + FastAPI rebuild)", href: "/six-engines/" },
      { label: "fashion-web", href: "https://fashion-web-psi.vercel.app" },
    ] },
    { name: "SQL · PostgreSQL", links: [{ label: "jobsforher backend · CV", href: CV_PDF }] },
    { name: "Astro · React islands",     links: [{ label: "this site repo", href: PERSONAL_SITE_REPO }] },
    { name: "Next.js · Supabase · Resend", links: [{ label: "platypus-learn (deployed)", href: "https://platypus-learn.vercel.app" }] },
    { name: "Vercel",                    links: [
      { label: "platypus-learn", href: "https://platypus-learn.vercel.app" },
      { label: "fashion-web", href: "https://fashion-web-psi.vercel.app" },
      { label: "taylor rec engine", href: "https://shubz-taylor-recommendation-engine.vercel.app" },
    ] },
    { name: "AWS · EC2 · S3 · CloudWatch · SNS", links: [{ label: "jobsforher deploy + monitor · CV", href: CV_PDF }] },
    { name: "Tableau",                   links: [{ label: "kolhapur cultural mapping · CV", href: CV_PDF }] },
    { name: "Flask",                     links: [{ label: "jobsforher web app · CV", href: CV_PDF }] },
    { name: "Google APIs · Sheets",      links: [{ label: "student council awards automation · CV", href: CV_PDF }] },
    { name: "Git · CI/CD",               links: [{ label: "all engineering work · /work", href: "/work/" }] },
    { name: "D3 · hand-rolled SVG",      links: [
      { label: "all essay diagrams", href: "/writing/" },
      { label: "jaya figures", href: "/jaya/" },
    ] },
    { name: "FastAPI",                   links: [{ label: "six engines backend", href: "/six-engines/" }] },
    { name: "UI / UX design",            links: [
      { label: "this site", href: "/" },
      { label: "Kurukshetra fest pages · CV", href: CV_PDF },
      { label: "PrintedCraft CMS · CV", href: CV_PDF },
    ] },
  ] },
  { group: "Outreach, community & teaching", primary: "orange", items: [
    { name: "Team leadership", links: [
      { label: "Dotslash tech club (10+ people) · CV", href: CV_PDF },
      { label: "Kolhapur project (5 people) · CV", href: CV_PDF },
      { label: "Student Council vice-captain · CV", href: CV_PDF },
    ] },
    { name: "Mentoring under-represented young people", links: [
      { label: "Stemmettes + InnovateHer · /work", href: "/work/" },
      { label: "Oxford Mathematical Institute Ambassador · CV", href: CV_PDF },
    ] },
    { name: "Teaching",                  links: [{ label: "FLAME Quantitative Centre peer tutor (R + Python) · CV", href: CV_PDF }] },
    { name: "STEM-ed outreach",          links: [{ label: "Stemmettes · InnovateHer · I'm a… Programme · /work", href: "/work/" }] },
    { name: "DBS-checked (UK)",          links: [{ label: "cleared for under-18s work · /work", href: "/work/" }] },
    { name: "Research writing · academic papers", links: [
      { label: "IEEE ICCUBEA-2025 Best Paper · /work", href: "/work/" },
      { label: "INBIX'22 poster PP-28 · /work", href: "/work/" },
      { label: "MFoCS thesis · biomarkers · /work", href: "/work/" },
      { label: "BSc honours thesis · GNSS · CV", href: CV_PDF },
    ] },
    { name: "Conference presentations",  links: [
      { label: "INBIX'22 (VFSTR) · CV", href: CV_PDF },
      { label: "IEEE ICCUBEA-2025 · /work", href: "/work/" },
    ] },
    { name: "Event organising · community building", links: [
      { label: "Dotslash (100+ attendees / event) · CV", href: CV_PDF },
      { label: "UnisphereCo (200+ attendees / session) · CV", href: CV_PDF },
      { label: "Kurukshetra inter-collegiate fest · CV", href: CV_PDF },
    ] },
    { name: "Cross-cultural collaboration", links: [{ label: "India ↔ UK working contexts · /work", href: "/work/" }] },
    { name: "Technical documentation",   links: [{ label: "Natter — docs + stakeholder presentations · CV", href: CV_PDF }] },
    { name: "Stakeholder communication", links: [{ label: "Natter — docs + cross-team presentations · CV", href: CV_PDF }] },
    { name: "Founding / building from zero", links: [
      { label: "PrintedCraft · CV", href: CV_PDF },
      { label: "UnisphereCo (200+ attendees) · CV", href: CV_PDF },
      { label: "orion (first eng on data stack) · /work", href: "/work/" },
    ] },
    { name: "Digital marketing · SEO · Google/Facebook Ads", links: [{ label: "PrintedCraft (Google front-page) · CV", href: CV_PDF }] },
    { name: "Graphic · product design",  links: [{ label: "PrintedCraft (100+ designs) · CV", href: CV_PDF }] },
    { name: "Qualitative · cultural research", links: [{ label: "kolhapur · Discover India Project · CV", href: CV_PDF }] },
  ] },
];

// ---------------------------------------------------------------------------
// §05 SPEAKING & STEM OUTREACH
// ---------------------------------------------------------------------------
export type SpeakingEntry = { event: string; talk: string; year: string };

export const WORK_SPEAKING: SpeakingEntry[] = [
  { event: "Stemmettes",        talk: "Mentoring girls and non-binary young people into engineering, maths, and computer science", year: "2025 —" },
  { event: "InnovateHer",       talk: "STEM Ambassador — running sessions for under-represented students in tech",                  year: "2025 —" },
  { event: "\"I'm a… Programme\"", talk: "Science communicator, CS & Mathematics",                                                 year: "2025 —" },
];

// ---------------------------------------------------------------------------
// RIGHT-RAIL data blocks
// ---------------------------------------------------------------------------
export const WORK_CV_STAT = {
  filename: "cv.pdf",
  span: "2019 — now",
  updatedDisplay: "26/05/2026",
  openText: "↗ open pdf",
  /** Sections shown on this /work page. Listed in the right-rail stat
   *  block so a visitor scanning the CV knows what's covered without
   *  scrolling. Update if you add a §06 onward. */
  sections: ["trajectory", "selected work", "toolbox", "speaking"],
};

export const WORK_OPEN_TO: Span[] = [
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

export const WORK_BASED = {
  lat: "51.51°N",
  lon: "-0.13°W",
  tz: "Europe/London (BST)",
  calls: "any reasonable tz",
};
