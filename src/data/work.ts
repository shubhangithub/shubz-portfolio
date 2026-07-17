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
// §02 TRAJECTORY — career timeline, most-recent-first
// ---------------------------------------------------------------------------
export type WorkEvent = {
  year: string;
  what: string;
  where: string;
  note: string;
};

export const WORK_EVENTS: WorkEvent[] = [
  { year: "Jun 2026 —",              what: "Technical AI Safety · BlueDot Impact",                                          where: "BlueDot Impact",    note: "Part-time cohort course (~6 weeks, ~5h/week). Topics: alignment and RLHF, mechanistic interpretability, evaluations and red-teaming, AI control, scalable oversight, training safer models. Small peer group, twice-weekly Zoom sessions with AI safety researchers." },
  { year: "Apr – Jun 2026",         what: "AGI Strategy cohort · BlueDot Impact",                                          where: "BlueDot Impact",    note: "Pre-reading + weekly seminars on AGI strategy, alignment, and the policy landscape around frontier AI. Completed June 2026." },
  { year: "Apr 2026 —",             what: "AI Researcher · Independent (part-time)",                                       where: "Funded by BDI Grants · Remote", note: "Researching AI safety, alignment, and multi-agent systems — independently, funded by Bluedot Impact's grants programme. Runs alongside Orion full-time. Research skills: AI safety, alignment, multi-agent systems." },
  { year: "Feb 2026",                what: "Elected MInstP · Institute of Physics",                                       where: "London",            note: "Member of the UK's professional body for physics." },
  { year: "2025 —",                  what: "Mentor · Stemmettes, InnovateHer, I'm a… Programme",                          where: "STEM-ed outreach",  note: "Three orgs running workshops, panels, and one-on-ones for girls, non-binary kids, and under-represented young people moving toward engineering, maths, and CS. DBS-checked." },
  { year: "Apr 2024 —",              what: "Founding Engineer · Orion",                                                   where: "London",            note: "Building geospatial intelligence infrastructure from scratch — data pipelines for high-volume multi-source streams, ML anomaly detection over H3 spatial indexing, backend services in Python and Golang. Joined as Data Engineer (Apr 2024 → Nov 2024), then Data & ML Engineer (Nov 2024 → Aug 2025), then Founding Engineer." },
  { year: "Oct 2023 —",              what: "Student Ambassador · Oxford Mathematical Institute",                          where: "Oxford · LMH",      note: "Working with prospective applicants at the Mathematical Institute and Lady Margaret Hall — answering questions, sitting on Q&A panels, supporting the application process." },
  { year: "Aug 2025",                what: "Best Paper · IEEE ICCUBEA-2025",                                              where: "co-author",         note: "\"Decoding Flipkart-Walmart Merger\" — theme extraction and sentiment mining across four years of news coverage. 1,240 submissions, 220 accepted, one Best Paper. Co-authored with Prof. Chakraborty." },
  { year: "Sep 2023 – Jul 2024",     what: "MFoCS · Oxford · Lady Margaret Hall",                                          where: "Math + CS",         note: "Thesis: automated immune biomarker detection on multiplex immunofluorescence data from tumour samples. Modules included Geometric Deep Learning, Computational Game Theory, Quantum Information, and Category Theory." },
  { year: "Sep 2022 – May 2023",     what: "BSc Honours Thesis · GNSS atmospheric water vapour",                          where: "FLAME · Prof. Gopalan", note: "Estimated tropospheric water-vapour content from GNSS signals using regression-based ML models, outperforming traditional linear baselines on accuracy and robustness to atmospheric variability." },
  { year: "Jun – Sep 2023",          what: "ML Engineering Intern · Natter",                                               where: "London",            note: "Content moderation models for bullying, mental-distress, and spam detection on social text, plus a user-matching recommender." },
  { year: "May 2023",                what: "BSc (Hons) Computer Science · Dean's Roll of Honour · FLAME University",      where: "CGPA 8.53",         note: "Graduated ranked 3rd in cohort (from 41st in year one)." },
  { year: "May – Jul 2022",          what: "Backend Developer Intern · JobsForHer",                                        where: "Bangalore",         note: "Built user-facing flows in Flask, queried PostgreSQL, configured and deployed scaleable services on AWS (EC2, S3, load balancers, CloudWatch, SNS)." },
  { year: "Jan – Aug 2022",          what: "Research Intern · Prof. Jayaraman Valadi, FLAME",                              where: "Bioinformatics",    note: "Improved the JAYA stochastic optimizer — size-penalised fitness function and elitism — for protein function identification on three biological datasets. Poster PP-28 at INBIX'22, VFSTR." },
  { year: "2022 – 2023",             what: "Founder + President · Dotslash, The Technology Club",                          where: "FLAME University",  note: "Founded and led a 10+ person team running technology events — interactive workshops, quizzes, talks — pulling 100+ attendees per session." },
  { year: "2022 – 2023",             what: "Vice-Captain · Student Council",                                               where: "FLAME University",  note: "Automated the manual process for allocating six annual student awards using Python and the Google Sheets API. Sat on the council that ran the year's events." },
  { year: "Oct 2021 – Apr 2022",     what: "Data Analyst & Researcher · Centre for Knowledge Alternatives",                where: "Pune",              note: "Cultural mapping of Kolhapur district for the Discover India Project — government datasets, Tableau, sector reports. Led a five-person team analysing law and order data." },
  { year: "Aug 2021 – Jan 2022",     what: "Research Intern · Prof. Kaushik Gopalan, FLAME",                                where: "Atmospheric ML",    note: "Novel technique to derive cloud information from INSAT-3D satellite data — pre-processed, thresholded, and adjusted radiation data to separate clear-sky and cloudy pixels in half-hourly satellite images using NumPy, SciPy, PyHDF and NetCDF. Visualised 20+ cloud-incidence results across India." },
  { year: "Jun 2020 – Jun 2021",     what: "Co-founder · UnisphereCo",                                                     where: "Hyderabad",         note: "Online platform for the undergraduate-application process: mentors from 50+ universities, 200+ attendees per session." },
  { year: "Jul 2019 – Jul 2021",     what: "Founder · PrintedCraft",                                                       where: "Bangalore",         note: "Personalised printing business. Built a Python connector to a cloud product database for real-time promotions. Integrated Google + Facebook Ads to land on Google's first page. 100+ product designs, suppliers across the country." },
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
  { name: "Orion intelligence platform",        c: "teal",    scope: "founding-eng",          year: "2024 —", essay: null,              blurb: "Geospatial intelligence over H3 spatial indexing — data infrastructure for high-volume multi-source streams, ML anomaly detection and confidence-weighted signal fusion, backend services in Python and Golang. Joined as one of two founding engineers (first hires after the founders); building the data stack from scratch and currently rewriting the LLM-driven search system end-to-end — tool schemas, decision-tree system prompts, few-shot disambiguation, output evaluation." },
  { name: "fashion-web",                        c: "ochre",   scope: "deployed · solo",       year: "2026 —", essay: "fashion-trends",  url: "https://fashion-web-psi.vercel.app",                              blurb: "Predicts which fashion micro-trends will peak 30 days out. Five live sources (Google Trends, Bluesky firehose, Pinterest, Reddit, YouTube) merge into a Holt-smoothed composite signal tracking 250+ terms across silhouettes, colours, and aesthetics. A logarithmic prediction market (LMSR, b=100) lets traders compete against the house model with virtual StyleCoins. Gemini 2.5 Flash breaks down outfit photos and matches them against runway collections from eight major houses. House predictions are Brier-scored." },
  { name: "platypus-learn",                     c: "purple",  scope: "deployed · solo",       year: "2025 —", essay: null,              url: "https://platypus-learn.vercel.app",                                blurb: "Turns PDFs and YouTube videos into structured courses. Drop in a paper or a lecture; get back a coherent learning path with assessments, a weekly goals dashboard, and an email digest. Built with Next.js, Supabase, Claude API, and Resend." },
  { name: "Taylor Swift recommendation engine", c: "ochre",   scope: "open",                  year: "2026",   essay: "six-engines",     url: "https://shubz-taylor-recommendation-engine.vercel.app",            blurb: "Six engines running in parallel — Sentence-BERT on lyrics, a variational autoencoder compressing Spotify audio features to 16 dimensions, graph node2vec embeddings, neural collaborative filtering, contrastive self-supervised learning, and a weighted ensemble with a consensus boost for cross-engine agreement. Runs over Taylor's full discography plus hand-curated editorial bridges to related artists. Rebuilt from an R/Shiny original in TypeScript + FastAPI; recommendations in under 200ms." },
  { name: "MFoCS thesis · immune biomarkers",   c: "red",     scope: "Oxford · 2024",         year: "2024",   essay: "threshold-gate",  blurb: "Two problems in automated biomarker detection on multiplex immunofluorescence data from real tumour samples. First: four automated thresholding methods (Otsu, IsoData, custom GMM, minimum cross-entropy) competing to replicate a pathologist's gate — CTLA-4 resisted all of them, because the biology is genuinely ambiguous. Second: spectral clustering with biological co-expression constraints encoded directly in the similarity matrix, beating five of seven standard methods on plausibility. Thesis available in Oxford repository." },
  { name: "Flipkart–Walmart merger NLP",        c: "ochre",   scope: "academic · Best Paper", year: "2023–25", essay: null,             blurb: "Theme extraction and sentiment mining across four years of news coverage of the $16B acquisition. Identified dominant narrative clusters and tracked sentiment shifts through deal stages using SpaCy, NLTK, Gensim, and TextBlob. Best Paper at IEEE ICCUBEA-2025 from 1,240 submissions." },
  { name: "JAYA protein feature selection",     c: "purple",  scope: "open · research",       year: "2022",   essay: "jaya",            url: "https://github.com/shubhangithub/inbix22",                              blurb: "Modified a parameter-free stochastic optimizer with a size-penalty fitness function and elitism to improve feature selection for protein function identification. Tested on three biological datasets; consistently produced smaller feature sets without sacrificing classification accuracy. Poster PP-28 at INBIX'22." },
  { name: "GNSS water-vapour ML",               c: "prompt",  scope: "honours thesis",        year: "2023",   essay: null,              blurb: "Estimated tropospheric water-vapour content from GNSS signals using regression models, outperforming traditional linear baselines on accuracy and robustness to atmospheric variability. BSc honours thesis, FLAME University." },
  { name: "Nand2Tetris — 16-bit computer",      c: "cyan",    scope: "coursework",            year: "2022",   essay: null,              blurb: "Built a working general-purpose computer from NAND gates up: all 13 projects from HDL gate design through machine language, VM translator, compiler, and a minimal operating system." },
  { name: "this site",                          c: "yellow",  scope: "open",                  year: "2026",   essay: null,              url: "https://github.com/shubhangithub/personal-site",                        blurb: "Started as a single-file HTML + CSS + inline React app; migrated to Astro during the astro-migration branch. Essays, animated diagrams, custom typography." },
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
  { group: "AI safety", primary: "blue", items: [
    { name: "AI alignment research", links: [
      { label: "a unit on bending the curve", href: "/bluedot-unit1/" },
      { label: "bluedot AGI strategy cohort · /now", href: "/now/" },
    ] },
    { name: "AI ethics & governance", links: [
      { label: "bluedot AGI strategy cohort · /now", href: "/now/" },
    ] },
  ] },
  { group: "AI/ML", primary: "purple", items: [
    { name: "Python",            links: [
      { label: "orion backend services · /work", href: "/work/" },
      { label: "six engines (2026)", href: "/six-engines/" },
    ] },
    { name: "R",                 links: [
      { label: "taylor rec (original R/Shiny) · CV", href: CV_PDF },
      { label: "FLAME peer tutoring · CV", href: CV_PDF },
    ] },
    { name: "NumPy · SciPy · Pandas", links: [
      { label: "positive by how much (MFoCS, 2024)", href: "/threshold-gate/" },
      { label: "six engines (2026)", href: "/six-engines/" },
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
  { group: "fintech", primary: "ochre", items: [
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
  { group: "Infrastructure", primary: "yellow", items: [
    { name: "TypeScript", links: [
      { label: "this site repo", href: PERSONAL_SITE_REPO },
      { label: "six engines (TS + FastAPI rebuild)", href: "/six-engines/" },
    ] },
    { name: "SQL · PostgreSQL", links: [{ label: "jobsforher backend · CV", href: CV_PDF }] },
    { name: "Astro · React islands",     links: [{ label: "this site repo", href: PERSONAL_SITE_REPO }] },
    { name: "Next.js · Supabase · Resend", links: [{ label: "platypus-learn (deployed)", href: "https://platypus-learn.vercel.app" }] },
    { name: "Vercel",                    links: [
      { label: "fashion-web", href: "https://fashion-web-psi.vercel.app" },
      { label: "platypus-learn", href: "https://platypus-learn.vercel.app" },
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
      { label: "PrintedCraft CMS (100+ designs) · CV", href: CV_PDF },
    ] },
  ] },
  { group: "Outreach", primary: "orange", items: [
    { name: "Team leadership", links: [
      { label: "Dotslash tech club (10+ people) · CV", href: CV_PDF },
      { label: "Kolhapur project (5 people) · CV", href: CV_PDF },
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
      { label: "MFoCS thesis · biomarkers (Oxford, 2024)", href: "/threshold-gate/" },
    ] },
    { name: "Conference presentations",  links: [
      { label: "INBIX'22 (VFSTR) · CV", href: CV_PDF },
      { label: "IEEE ICCUBEA-2025 · /work", href: "/work/" },
    ] },
    { name: "Event organising · community building", links: [
      { label: "UnisphereCo (200+ attendees / session) · CV", href: CV_PDF },
      { label: "Dotslash (100+ attendees / event) · CV", href: CV_PDF },
    ] },
    { name: "Cross-cultural collaboration", links: [{ label: "India ↔ UK working contexts · /work", href: "/work/" }] },
    { name: "Technical documentation",   links: [{ label: "Natter — docs + stakeholder presentations · CV", href: CV_PDF }] },
    { name: "Stakeholder communication", links: [{ label: "Natter — docs + cross-team presentations · CV", href: CV_PDF }] },
    { name: "Founding / building from zero", links: [
      { label: "orion (one of two founding engineers) · /work", href: "/work/" },
      { label: "UnisphereCo (200+ attendees) · CV", href: CV_PDF },
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
  { event: "University of Liverpool Maths School", talk: "Research and industry projects across maths and CS — Oxford, FLAME, and Orion (via InnovateHer)", year: "2026" },
  { event: "FLAME University",  talk: "Choice theory, and some honest thoughts on grad school",                                    year: "2026" },
  { event: "Stemmettes",        talk: "Mentoring girls and non-binary young people into engineering, maths, and computer science", year: "2025 —" },
  { event: "InnovateHer",       talk: "STEM Ambassador — 200+ students spoken to across UK schools about careers in tech",         year: "2025 —" },
  { event: "\"I'm a… Programme\"", talk: "Science communicator, CS & Mathematics",                                                 year: "2025 —" },
];

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
   *  scrolling. Update if you add a §06 onward. */
  sections: ["trajectory", "selected work", "toolbox", "speaking"],
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
  { year: "2025 —",             what: "Mentor · Stemmettes, InnovateHer, I'm a…",   where: "STEM-ed outreach",              track: "outreach",    cat: "orange",  big: false, lenses: ["community"],       note: "Workshops, panels and 1:1s for girls, non-binary and under-represented young people moving toward STEM. DBS-checked." },
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
