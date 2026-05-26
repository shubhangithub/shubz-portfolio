// @ts-nocheck
/* eslint-disable */
/**
 * WorkV5 — Port of design_handoff/work-page.jsx.
 *
 * Annotated CV: trajectory timeline → selected builds (with essay
 * provenance links) → toolbox chip grid → speaking & STEM outreach.
 * Right rail: cv.pdf stat block, open-to.md, based.md.
 *
 * Content lifted verbatim from WorkV4.tsx (events, builds, speaking) so the
 * existing curated prose is preserved — V5 only changes the chrome.
 */
import React from "react";
import { POSTS } from "../../data/posts";
import { nbTheme } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  NBPageShell, NBLastUpdated, NBPrompt, NBPromptHead, NBMarginalia,
} from "../chrome/NB";

type NavFn = (page: string, slug?: string | null) => void;

// Content lifted directly from WorkV4.tsx — same source of truth for now.
const WORK_EVENTS = [
  { year: "2026 —", what: "Elected MInstP · Institute of Physics", where: "London · Feb 2026", note: "The UK's professional body for physics. The certificate is small and unreasonably satisfying." },
  { year: "2025 —", what: "Founding Engineer · Orion", where: "London", note: "Building geospatial intelligence infrastructure from scratch — data pipelines for high-volume multi-source streams, ML anomaly detection over H3 spatial indexing, backend services in Python and Golang. The job description keeps getting shorter; the scope keeps getting wider. Joined as Data Engineer (Apr 2024 → Nov 2024), then Data & ML Engineer (Nov 2024 → Aug 2025), then Founding Engineer." },
  { year: "2025", what: "Best Paper · IEEE ICCUBEA-2025", where: "co-author · Aug 2025", note: "\"Decoding Flipkart-Walmart Merger\" — theme extraction and sentiment mining across four years of news coverage. 1,240 submissions, 220 accepted, one Best Paper. Co-authored with Prof. Chakraborty; started as a scrape, ended as an award." },
  { year: "2024", what: "MFoCS · Oxford · Lady Margaret Hall", where: "Mathematical & Computational Sciences", note: "Thesis: automated immune biomarker detection on multiplex immunofluorescence data from tumour samples. Modules included Geometric Deep Learning, Computational Game Theory, Quantum Information, and Category Theory. The place where everything I'd been doing separately started making sense together." },
  { year: "2023", what: "ML Engineering Intern · Natter", where: "London", note: "Content moderation models for bullying, mental-distress, and spam detection on social text, plus a user-matching recommender. First time building something that needed to work reliably for people who didn't know it existed." },
  { year: "2023", what: "BSc (Hons) Computer Science · FLAME University", where: "CGPA 8.53 · Dean's Roll of Honour", note: "Graduated ranked 3rd in cohort (from 41st in year one). Honours thesis on GNSS water-vapour estimation via ML, outperforming traditional linear baselines. Three years of learning how to work." },
  { year: "2022", what: "Research Intern · Prof. Jayaraman Valadi, FLAME", where: "Bioinformatics", note: "Improved the JAYA stochastic optimizer — size-penalised fitness function and elitism — for protein function identification on three biological datasets. Poster PP-28 at INBIX'22, VFSTR. First time a modification of mine made something measurably better." },
  { year: "2021", what: "Data Analyst & Researcher · Centre for Knowledge Alternatives", where: "Pune", note: "Cultural mapping of Kolhapur district for the Discover India Project — government datasets, Tableau, sector reports. First time data told a story about real places and real people." },
  { year: "2020", what: "Co-founder · UnisphereCo", where: "Hyderabad", note: "Online platform for the undergraduate-application process: mentors from 50+ universities, 200+ attendees per session. First time running something that other people depended on." },
  { year: "2019", what: "Founder · PrintedCraft", where: "Bangalore", note: "Personalised printing business. Built a Python connector to a cloud product database for real-time promotions. First time code made something happen in the physical world." },
];

const WORK_BUILDS = [
  { name: "Orion intelligence platform",          c: "teal",    scope: "founding-eng",         year: "2024 —", essay: null,                      blurb: "Geospatial intelligence over H3 spatial indexing — data infrastructure for high-volume multi-source streams, ML anomaly detection and confidence-weighted signal fusion, backend services in Python and Golang. Built from scratch as the first engineer on the data stack." },
  { name: "fashion-web",                          c: "ochre",   scope: "deployed · solo",      year: "2026 —", essay: "fashion-trends",          url: "https://fashion-web-psi.vercel.app",                                blurb: "Predicts which fashion micro-trends will peak 30 days out. Five live sources (Google Trends, Bluesky firehose, Pinterest, Reddit, YouTube) merge into a Holt-smoothed composite signal tracking 250+ terms across silhouettes, colours, and aesthetics. A logarithmic prediction market (LMSR, b=100) lets traders compete against the house model with virtual StyleCoins. Gemini 2.5 Flash breaks down outfit photos and matches them against runway collections from eight major houses. House predictions are Brier-scored." },
  { name: "platypus-learn",                       c: "blue",    scope: "deployed · solo",      year: "2025 —", essay: null,                      url: "https://platypus-learn.vercel.app",                                 blurb: "Turns PDFs and YouTube videos into structured courses. Drop in a paper or a lecture; get back a coherent learning path with assessments, a weekly goals dashboard, and an email digest. Built with Next.js, Supabase, Claude API, and Resend." },
  { name: "Taylor Swift recommendation engine",   c: "purple",  scope: "open",                 year: "2026",   essay: "six-engines",             url: "https://shubz-taylor-recommendation-engine.vercel.app",             blurb: "Six engines running in parallel — Sentence-BERT on lyrics, a variational autoencoder compressing Spotify audio features to 16 dimensions, graph node2vec embeddings, neural collaborative filtering, contrastive self-supervised learning, and a weighted ensemble with a consensus boost for cross-engine agreement. Runs over Taylor's full discography plus hand-curated editorial bridges to related artists. Rebuilt from an R/Shiny original in TypeScript + FastAPI; recommendations in under 200ms." },
  { name: "MFoCS thesis · immune biomarkers",     c: "red",     scope: "Oxford · 2024",        year: "2024",   essay: "threshold-gate",          blurb: "Two problems in automated biomarker detection on multiplex immunofluorescence data from real tumour samples. First: four automated thresholding methods (Otsu, IsoData, custom GMM, minimum cross-entropy) competing to replicate a pathologist's gate — CTLA-4 resisted all of them, because the biology is genuinely ambiguous. Second: spectral clustering with biological co-expression constraints encoded directly in the similarity matrix, beating five of seven standard methods on plausibility. Thesis available in Oxford repository." },
  { name: "Flipkart–Walmart merger NLP",          c: "ochre",   scope: "academic · Best Paper", year: "2023–25", essay: null,                     blurb: "Theme extraction and sentiment mining across four years of news coverage of the $16B acquisition. Identified dominant narrative clusters and tracked sentiment shifts through deal stages using SpaCy, NLTK, Gensim, and TextBlob. Best Paper at IEEE ICCUBEA-2025 from 1,240 submissions." },
  { name: "JAYA protein feature selection",       c: "orange",  scope: "open · research",      year: "2022",   essay: "jaya",                    url: "https://github.com/Shubzthub/inbix22",                              blurb: "Modified a parameter-free stochastic optimizer with a size-penalty fitness function and elitism to improve feature selection for protein function identification. Tested on three biological datasets; consistently produced smaller feature sets without sacrificing classification accuracy. Poster PP-28 at INBIX'22." },
  { name: "GNSS water-vapour ML",                 c: "cyan",    scope: "honours thesis",       year: "2023",   essay: null,                      blurb: "Estimated tropospheric water-vapour content from GNSS signals using regression models, outperforming traditional linear baselines on accuracy and robustness to atmospheric variability. BSc honours thesis, FLAME University." },
  { name: "Nand2Tetris — 16-bit computer",        c: "prompt",  scope: "coursework",           year: "2022",   essay: null,                      blurb: "Built a working general-purpose computer from NAND gates up: all 13 projects from HDL gate design through machine language, VM translator, compiler, and a minimal operating system." },
  { name: "this site",                            c: "blue",    scope: "open",                 year: "2026",   essay: null,                      url: "https://github.com/Shubzthub/personal-site",                        blurb: "Started as a single-file HTML + CSS + inline React app; migrated to Astro during the astro-migration branch. Essays, animated diagrams, and an unreasonable amount of time spent on typography." },
];

// Toolbox v5 — 10 canonical topic categories. Groups ARE the colour codes;
// every chip in a group shares its colour. Skills are placed under their
// PRIMARY-topic group (so Python lives under ML technical research, Rust
// under Geospatial, C++ under Hardware, etc.). A skill that serves
// multiple topics picks one as primary — the others show up via essay
// link-colours inside the chip.
//
// 10 canonical groups (see DECISIONS-v5.md §14):
//   1. AI safety & alignment       (blue)
//   2. ML technical research       (purple)
//   3. Mathematics                  (magenta)
//   4. Physics                      (prompt-green)
//   5. Biotech                      (red)
//   6. Geospatial                   (teal)
//   7. Markets, predictions & fintech (ochre)
//   8. Hardware                     (cyan)
//   9. Infrastructure & craft       (yellow)
//   10. Outreach, community & teaching (orange)
//
// Each `link` is a real href:
//   /<slug>/                  → in-site essay (text uses essay accent)
//   /work/, /, /contact/      → in-site route (text uses category primary)
//   https://…                 → external (project URL, GitHub repo)
//   CV_PDF                    → resume PDF (fallback for CV-only entries)
const CV_PDF = "/uploads/Shubhangi-Sharma-Resume-20260211.pdf";
const PERSONAL_SITE_REPO = "https://github.com/shubhangithub/personal-site";

type ChipLink = { label: string; href: string };
type ToolGroup = { group: string; primary: string; items: { name: string; links: ChipLink[] }[] };

const WORK_TOOLBOX: ToolGroup[] = [
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

const WORK_SPEAKING = [
  { event: "Stemmettes",        talk: "Mentoring girls and non-binary young people into engineering, maths, and computer science", year: "2025 —" },
  { event: "InnovateHer",       talk: "STEM Ambassador — running sessions for under-represented students in tech",                  year: "2025 —" },
  { event: "\"I'm a… Programme\"", talk: "Science communicator, CS & Mathematics",                                                 year: "2025 —" },
];

export function WorkV5({
  dark,
  toggleTheme,
  onNavigate,
}: {
  dark: boolean;
  toggleTheme: () => void;
  onNavigate: NavFn;
}) {
  const mode: "light" | "dark" = dark ? "dark" : "light";
  const t = nbTheme(mode);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.background = t.paper;
    }
  }, [t.paper]);

  // Map slug → theme-resolved accent, for provenance link colours.
  const essayBySlug = React.useMemo(() => {
    const map: Record<string, { title: string; c: string }> = {};
    for (const p of POSTS) {
      const key = p.nbAccent || "blue";
      map[p.slug] = { title: p.title, c: t[key] };
    }
    return map;
  }, [t]);

  const PAGE_PAD = isMobile ? "16px 20px 0" : "20px 64px 0";

  return (
    <NBPageShell
      t={t} mode={mode} current="work"
      label="shubz — ~/work — vim"
      onNavigate={onNavigate as any}
      onToggle={toggleTheme}
    >
      <NBLastUpdated t={t} label="WORK · CV WITH MARGINALIA" date="26 may 2026" />

      <div style={{
        padding: PAGE_PAD,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
        gap: isMobile ? 36 : 56,
      }}>
        <main id="main" tabIndex={-1}>
          {/* Title */}
          <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 32, position: "relative" }}>
            <NBPrompt t={t} cwd="~/work" cmd="cat ./cv.md" comment="annotated · chronological reverse" accent={t.prompt} />
            <h1 style={{
              fontFamily: "var(--f-display)",
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
              fontWeight: 400,
              fontSize: isMobile ? "clamp(2.2rem, 9vw, 3.2rem)" : "clamp(2.4rem, 6vw, 4.8rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: 0, color: t.ink, maxWidth: "18ch",
            }}>
              Things I've <em style={{ color: t.teal, fontStyle: "italic" }}>built</em> and{" "}
              <em style={{ color: t.ochre, fontStyle: "italic" }}>almost</em> finished.
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.6, color: t.softInk, maxWidth: "56ch", marginTop: 26 }}>
              The CV with marginalia. Each entry has a footnote — what I actually did, what I would change, what I learned. Available as <a href="/uploads/Shubhangi-Sharma-Resume-20260211.pdf" target="_blank" rel="noreferrer" style={{ color: t.blue, borderBottom: `1px solid ${t.blue}66` }}>PDF</a> for the more conventional version.
            </p>
            {!isMobile && (
              <NBMarginalia t={t} top={120} tilt={-1.8}>
                every tool here<br/>links to the essay<br/>where it earned<br/>its place.
              </NBMarginalia>
            )}
          </div>

          {/* §02 Trajectory */}
          <NBPromptHead t={t} n="§02" command="git log --since=2019 --reverse | tac" comment="2019 → present" title="Trajectory" accent={t.ochre} level={isMobile ? 22 : 28} />
          <div style={{ position: "relative", paddingLeft: isMobile ? 24 : 36, marginBottom: 56 }}>
            <div style={{ position: "absolute", left: 6, top: 8, bottom: 8, width: 2, background: t.rule }} />
            {WORK_EVENTS.map((e, i) => (
              <div key={i} style={{ position: "relative", paddingBottom: 22 }}>
                <div style={{
                  position: "absolute", left: isMobile ? -24 : -36, top: 6,
                  width: 14, height: 14, borderRadius: 999,
                  background: t.paper, border: `3px solid ${i === 0 ? t.prompt : t.muted}`,
                }} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "90px 1fr 160px", gap: isMobile ? 8 : 18, alignItems: "baseline" }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: i === 0 ? t.prompt : t.ochre }}>{e.year}</span>
                  <div>
                    <div style={{ fontFamily: "var(--f-body)", fontSize: isMobile ? 15 : 17, color: t.ink, lineHeight: 1.3 }}>{e.what}</div>
                    {e.note && <div style={{ fontSize: 14, color: t.softInk, marginTop: 4, fontStyle: "italic", maxWidth: "58ch", lineHeight: 1.55 }}>{e.note}</div>}
                  </div>
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, textAlign: "right" }}>{e.where}</span>
                  )}
                  {isMobile && (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted }}>{e.where}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* §03 Selected builds */}
          <NBPromptHead t={t} n="§03" command="ls -la ./builds/" comment="selected · open · founding" title="Selected work" accent={t.teal} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 56 }}>
            {WORK_BUILDS.map((b, i, arr) => {
              const linkedEssay = b.essay ? essayBySlug[b.essay] : null;
              const tagColor = t[b.c] || t.blue;
              return (
                <a key={b.name} href={b.url || "#"} target={b.url ? "_blank" : undefined} rel={b.url ? "noreferrer" : undefined} style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "auto 1fr" : "auto 1fr auto auto",
                  gap: isMobile ? 14 : 20, alignItems: "baseline",
                  padding: "20px 0",
                  borderBottom: i === arr.length - 1 ? "none" : `1px dashed ${t.muted}55`,
                  color: t.ink, textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, width: 28 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: "var(--f-display)", fontVariationSettings: '"opsz" 144, "SOFT" 50',
                      fontSize: 22, color: tagColor, lineHeight: 1.2,
                    }}>
                      {b.name} {b.url && <span style={{ fontSize: 14, fontFamily: "var(--f-mono)" }}>↗</span>}
                    </div>
                    <div style={{ fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 15, color: t.softInk, marginTop: 4, maxWidth: "60ch", lineHeight: 1.5 }}>
                      {b.blurb}
                    </div>
                    {linkedEssay && (
                      <div style={{ marginTop: 8, fontFamily: "var(--f-mono)", fontSize: 11 }}>
                        <span style={{ color: t.muted }}>written up: </span>
                        <a href={`/${b.essay}/`} onClick={(e) => { e.preventDefault(); onNavigate("essay", b.essay); }} style={{
                          color: linkedEssay.c,
                          borderBottom: `1px solid ${linkedEssay.c}66`,
                          paddingBottom: 1,
                          textDecoration: "none",
                        }}>↗ {linkedEssay.title}</a>
                      </div>
                    )}
                    {isMobile && (
                      <div style={{ marginTop: 8, display: "flex", gap: 12, fontFamily: "var(--f-mono)", fontSize: 10 }}>
                        <span style={{ color: tagColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>{b.scope}</span>
                        <span style={{ color: t.muted, marginLeft: "auto" }}>{b.year}</span>
                      </div>
                    )}
                  </div>
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: tagColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>{b.scope}</span>
                  )}
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, textAlign: "right" }}>{b.year}</span>
                  )}
                </a>
              );
            })}
          </div>

          {/* §04 Toolbox — id="toolbox" so HomeV5's "see all skills →" link
              can deep-link straight to this section via /work/#toolbox. */}
          <div id="toolbox" style={{ scrollMarginTop: 80 }}>
          <NBPromptHead t={t} n="§04" command="cat ./toolbox.md" comment="what built what" title="Toolbox" accent={t.purple} level={isMobile ? 22 : 28} />
          <div style={{ border: `2px solid ${t.ink}`, padding: isMobile ? "18px 16px" : "22px 26px", background: t.bgCard, marginBottom: 56 }}>
            {WORK_TOOLBOX.map((g, gi, arr) => {
              const groupColor = t[g.primary] || t.blue;
              return (
              <div key={g.group} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "140px 1fr",
                gap: isMobile ? "8px" : "12px 24px",
                paddingBottom: 18, marginBottom: 18,
                borderBottom: gi === arr.length - 1 ? "none" : `1px dashed ${t.muted}55`,
                alignItems: "start",
              }}>
                <div style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 18, color: groupColor, paddingTop: 6 }}>
                  {g.group}.
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {g.items.map((it) => (
                    <span key={it.name} style={{
                      display: "inline-flex", flexDirection: "column", gap: 4,
                      padding: "8px 14px 10px",
                      background: t.paper2,
                      border: `1px solid ${groupColor}44`,
                      borderLeft: `3px solid ${groupColor}`,
                      borderRadius: 2,
                      minWidth: isMobile ? 0 : 200,
                      maxWidth: "100%",
                    }}>
                      <span style={{ fontFamily: "var(--f-body)", fontSize: 15, color: t.ink, lineHeight: 1.2 }}>{it.name}</span>
                      <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {it.links.map((l, j) => {
                          // Resolve link colour: essay route → essay's accent;
                          // anything else → category primary.
                          const essayMatch = l.href.match(/^\/([^\/]+)\/$/);
                          const post = essayMatch ? POSTS.find((p) => p.slug === essayMatch[1]) : null;
                          const linkColor = post ? t[post.nbAccent || "blue"] : groupColor;
                          const isExternal = /^https?:/.test(l.href);
                          const isInSiteRoute = l.href.startsWith("/") && !l.href.startsWith("/uploads/");
                          const navHandler = post
                            ? (e: React.MouseEvent) => { e.preventDefault(); onNavigate("essay", post.slug); }
                            : isInSiteRoute && l.href === "/work/"
                              ? (e: React.MouseEvent) => { e.preventDefault(); onNavigate("work"); }
                              : isInSiteRoute && l.href === "/writing/"
                                ? (e: React.MouseEvent) => { e.preventDefault(); onNavigate("writing"); }
                                : isInSiteRoute && l.href === "/"
                                  ? (e: React.MouseEvent) => { e.preventDefault(); onNavigate("home"); }
                                  : undefined;
                          return (
                            <a
                              key={j}
                              href={l.href}
                              target={isExternal || l.href.endsWith(".pdf") ? "_blank" : undefined}
                              rel={isExternal ? "noreferrer" : undefined}
                              onClick={navHandler}
                              style={{
                                fontFamily: "var(--f-mono)", fontSize: 10.5, color: linkColor,
                                letterSpacing: "0.02em",
                                borderBottom: `1px solid ${linkColor}44`,
                                alignSelf: "flex-start",
                                textDecoration: "none",
                              }}
                            >↗ {l.label}</a>
                          );
                        })}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
          </div>{/* /#toolbox */}

          {/* §05 Speaking — V5 canonical: outreach/community/teaching = orange. */}
          <NBPromptHead t={t} n="§05" command="cat ./speaking.md" title="Speaking & STEM outreach" accent={t.orange} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 60, borderTop: `1px solid ${t.muted}55` }}>
            {WORK_SPEAKING.map((s, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr 80px",
                gap: isMobile ? 4 : 18, alignItems: "baseline",
                padding: "14px 0",
                borderBottom: `1px solid ${t.muted}33`,
              }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.orange, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.event}</span>
                <span style={{ fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 15, color: t.softInk }}>{s.talk}</span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, textAlign: isMobile ? "left" : "right" }}>{s.year}</span>
              </div>
            ))}
          </div>
        </main>

        {/* Right rail */}
        <aside>
          <NBPrompt t={t} cwd="~/work" cmd="stat cv.pdf" accent={t.blue} />
          <div style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "14px 16px", borderRadius: 3, marginBottom: 28,
            fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.8,
            color: t.softInk,
          }}>
            <div style={{ color: t.muted }}>cv.pdf</div>
            <div><span style={{ color: t.muted }}>entries</span> <span style={{ color: t.ink }}>{WORK_EVENTS.length}</span></div>
            <div><span style={{ color: t.muted }}>span</span> <span style={{ color: t.ink }}>2019 — now</span></div>
            <div><span style={{ color: t.muted }}>updated</span> <span style={{ color: t.ink }}>26/05/2026</span></div>
            <div style={{ marginTop: 8 }}>
              <a href="/uploads/Shubhangi-Sharma-Resume-20260211.pdf" target="_blank" rel="noreferrer" style={{ color: t.blue, borderBottom: `1px solid ${t.blue}66`, textDecoration: "none" }}>↗ open pdf</a>
            </div>
          </div>

          <NBPrompt t={t} cwd="~/work" cmd="cat ./open-to.md" comment="collab" accent={t.prompt} />
          <div style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "14px 16px", borderRadius: 3, marginBottom: 28,
            fontFamily: "var(--f-body)", fontSize: 14, lineHeight: 1.55,
            color: t.softInk,
          }}>
            Open to collaboration on <span style={{ color: t.teal }}>geospatial ML</span>, <span style={{ color: t.blue }}>AI safety</span>, <span style={{ color: t.red }}>computational biology</span>, <span style={{ color: t.prompt }}>STEM-ed outreach</span>, or anything that crosses these.
            <div style={{ marginTop: 12 }}>
              <a href="/contact/" onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} style={{ color: t.prompt, fontFamily: "var(--f-mono)", fontSize: 11, borderBottom: `1px solid ${t.prompt}66`, textDecoration: "none" }}>↗ get in touch</a>
            </div>
          </div>

          <NBPrompt t={t} cwd="~/work" cmd="cat ./based.md" accent={t.ochre} />
          <div style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "14px 16px", borderRadius: 3, marginBottom: 28,
            fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.8,
            color: t.softInk,
          }}>
            <div><span style={{ color: t.muted }}>lat</span> 51.51°N</div>
            <div><span style={{ color: t.muted }}>lon</span> -0.13°W</div>
            <div><span style={{ color: t.muted }}>tz</span> Europe/London (BST)</div>
            <div><span style={{ color: t.muted }}>calls</span> any reasonable tz</div>
          </div>
        </aside>
      </div>
    </NBPageShell>
  );
}
