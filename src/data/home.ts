// home.ts — all editable copy for the homepage. The HomeV5 component is a
// pure renderer: it imports these constants and lays them out. Edit this
// file to change what shows up at `/`. No JSX changes are needed for copy.
//
// Anything tied to the canonical 10-category colour system uses keys from
// NBAccentKey (see src/data/palette.ts + DECISIONS-v5.md §14).
//
// V5 architecture note: this file mirrors the pattern that
// src/data/now.ts already establishes — components are pure, content
// lives in `src/data/<page>.ts`.

import type { NBAccentKey } from "./palette";
import { SITE_LAST_UPDATED_DATE } from "./site";
// CV path is declared once in work.ts and re-used everywhere. Updating the
// PDF filename? Edit CV_PDF in src/data/work.ts — every chip on every page
// re-resolves automatically. (See EDITING.md → "Update the CV PDF".)
import { CV_PDF } from "./work";

export const HOME_PORTRAIT = {
  src: "/assets/portrait.jpg",
  alt: "Shubz Sharma",
};

// ---------------------------------------------------------------------------
// Inline-coloured prose. A line/paragraph is a list of `Span`s.
//   - plain string → renders as-is
//   - { em, c }    → italic display-serif span in the named accent
//   - { tag, c }   → coloured highlight (used in the bio paragraph)
// ---------------------------------------------------------------------------
export type Span =
  | string
  | { em: string; c?: NBAccentKey }
  | { tag: string; c?: NBAccentKey }
  | { link: string; href: string; c?: NBAccentKey };

// ---------------------------------------------------------------------------
// HERO — multi-coloured H1, two visual lines
// ---------------------------------------------------------------------------
export const HERO_LINE_A: Span[] = [
  "Read ",
  { em: "maths", c: "magenta" },
  " and ",
  { em: "CS", c: "magenta" },
  " at ",
  { em: "Oxford", c: "magenta" },
  ".",
];

export const HERO_LINE_B: Span[] = [
  "Currently working on ",
  { em: "agentic engineering", c: "purple" },
  " for physical infrastructure at ",
  { em: "Torus (YC S26)", c: "yellow" },
  ", researching ",
  { em: "AI safety", c: "blue" },
  ", and lots more.",
];

// ---------------------------------------------------------------------------
// BIO PARAGRAPH (mixed italic + coloured tags)
// ---------------------------------------------------------------------------
export const BIO: Span[] = [
  "I'm a founding member of technical staff at ",
  { link: "Torus", href: "https://www.usetorus.com/", c: "yellow" },
  " ",
  { link: "(YC S26)", href: "https://www.ycombinator.com/companies/torus", c: "yellow" },
  ". Alongside, I do AI safety research (with funding through grants and awards by ",
  { link: "BlueDot", href: "https://bluedot.org/programs/rapid-grants", c: "blue" },
  ", ",
  { link: "Cosmos Institute", href: "https://blog.cosmos-institute.org/p/announcing-80-new-cosmos-grantees", c: "blue" },
  ", and ",
  { link: "FIRE", href: "https://www.fire.org/news/fire-and-cosmos-institute-launch-1-million-grant-program-ai-advances-truth-seeking", c: "blue" },
  "). I also work on ",
  { link: "OSS", href: "https://github.com/UKGovernmentBEIS/inspect_evals", c: "yellow" },
  " projects (including work with the United Kingdom Government on AI). I’m a full elected member of the ",
  { link: "IOP", href: "https://www.iop.org/", c: "prompt" },
  " (MInstP), and member of the ",
  { link: "IMA", href: "https://ima.org.uk/", c: "magenta" },
  ". I’m also an ambassador for STEM and AI — with ",
  { link: "Thinking About Thinking Fellowship", href: "https://www.thinkingaboutthinking.org/fellowship", c: "orange" },
  ", Andrew Ng's DeepLearning.AI (",
  { link: "Pie & AI", href: "https://www.deeplearning.ai/events", c: "orange" },
  ")",
  ", ",
  { link: "InnovateHer", href: "https://www.innovateher.co.uk/", c: "orange" },
  ", ",
  { link: "Stemettes", href: "https://stemettes.org/", c: "orange" },
  ", and the \"",
  { link: "I'm a Scientist", href: "https://imascientist.org.uk/", c: "orange" },
  "\" programme. I write ",
  { link: "here", href: "/writing/", c: "yellow" },
  ", and build side projects (including fashion predictors, recommendation systems, IoT artifacts, and more). I like reading and learning new things; the current list lives at ",
  { link: "/now", href: "/now/", c: "orange" },
  ". I studied maths (and dabbled in physics) at ",
  { link: "Oxford", href: "https://www.ox.ac.uk/admissions/graduate/courses/msc-mathematics-and-foundations-of-computer-science", c: "magenta" },
  " and computer science at ",
  { link: "FLAME University", href: "https://www.flame.edu.in/", c: "yellow" },
  ", and have held research and software roles across universities and startups. I was previously Techstars-backed ",
  { link: "Orion", href: "https://www.prnewswire.com/news-releases/orion-raises-3-5-million-to-scale-its-ai-powered-risk-intelligence-platform-for-real-world-threat-response-302619603.html", c: "teal" },
  "'s first engineering hire, to founding engineer, building the 0→1 data + ML spatiotemporal backbone that raised $3.5M. I have worked on research projects across fields- my Oxford thesis advanced automated immune-biomarker detection on multiplex-immunofluorescence tumour data. Earlier, I researched VAEs, a modified optimiser for protein-function prediction, NLP on the ",
  { link: "Flipkart–Walmart merger", href: "https://doi.org/10.1109/ICCUBEA65967.2025.11284272", c: "purple" },
  " (Best Paper, IEEE ICCUBEA 2025), water-vapour estimation from GNSS signals, and cloud detection from INSAT-3D imagery). Away from work, I ",
  { link: "row", href: "https://www.strava.com/athletes/155447309", c: "orange" },
  ", make art, ride horses, and spend an unreasonable amount of time making ",
  { link: "interactive diagrams", href: "/writing/", c: "magenta" },
  ".",
];

// ---------------------------------------------------------------------------
// FOOTER under the toolbox — links to the full /work/#toolbox view
// ---------------------------------------------------------------------------
export const TOOLBOX_TEASER = "this is the teaser · the full taxonomy lives in";
export const TOOLBOX_TEASER_PATH = "./work/toolbox.md";

// ---------------------------------------------------------------------------
// §03 SELECTED BUILDS — currently-deployed projects
// ---------------------------------------------------------------------------
export type HomeBuild = {
  name: string;
  c: NBAccentKey;
  /** One plain sentence, a few words, on what the thing does for someone. */
  line: string;
  blurb: string;
  year: string;
  url: string;
};

// V5 canonical: each build's `c` = its primary topic.
//   fashion-web        → ochre  (markets / predictions / fintech)
//   taylor-rec-engine  → ochre  (recommendations roll up to markets)
//   platypus-learn     → purple (ML technical research — LLM-driven learning)
export const HOME_BUILDS: HomeBuild[] = [
  { name: "fashion-web",        c: "ochre",  line: "Forecasts fashion trends, then lets you bet on them.", blurb: "ML trend intelligence + LMSR exchange.",                year: "2026 —", url: "https://fashion-web-psi.vercel.app" },
  { name: "taylor-rec-engine",  c: "ochre",  line: "Six models argue about what to play next.",             blurb: "Six recommendation engines on one songbook.",            year: "2026",   url: "https://shubz-taylor-recommendation-engine.vercel.app" },
  { name: "platypus-learn",     c: "purple", line: "Any PDF or video, turned into a course.",               blurb: "AI learning platform — PDFs and YouTube → courses.",    year: "2025 —", url: "https://platypus-learn.vercel.app" },
];

// ---------------------------------------------------------------------------
// §04 TOOLBOX — condensed teaser. The full taxonomy with provenance lives
// on /work under §04 (see src/data/work.ts WORK_TOOLBOX).
// ---------------------------------------------------------------------------
export type ChipLink = { label: string; href: string };
export type ToolItem = { name: string; links: ChipLink[] };
export type ToolGroup = { group: string; primary: NBAccentKey; items: ToolItem[] };

export const HOME_TOOLBOX: ToolGroup[] = [
  { group: "AI safety", primary: "blue", items: [
    { name: "AI alignment research", links: [{ label: "a unit on bending the curve", href: "/bluedot-unit1/" }] },
    { name: "AI ethics & governance", links: [{ label: "bluedot AGI cohort · /now", href: "/now/" }] },
  ] },
  { group: "AI/ML", primary: "purple", items: [
    { name: "Python",                     links: [{ label: "jaya, threshold, six engines", href: "/jaya/" }] },
    { name: "Claude API · Anthropic SDK", links: [{ label: "platypus-learn", href: "https://platypus-learn.vercel.app" }] },
    { name: "Prompt engineering · few-shot", links: [{ label: "orion search · /now", href: "/now/" }] },
  ] },
  { group: "Mathematics", primary: "magenta", items: [
    { name: "Computational Game Theory", links: [{ label: "Oxford MFoCS · CV", href: CV_PDF }] },
    { name: "Category Theory",           links: [{ label: "Oxford MFoCS · CV", href: CV_PDF }] },
  ] },
  { group: "Physics", primary: "prompt", items: [
    { name: "Quantum Information",        links: [{ label: "two colours and a Hadamard", href: "/zx-calculus/" }] },
    { name: "GNSS atmospheric modelling", links: [{ label: "honours thesis · CV", href: CV_PDF }] },
  ] },
  { group: "Biotech", primary: "red", items: [
    { name: "Bioinformatics",         links: [{ label: "jaya · proteins", href: "/jaya/" }] },
    { name: "Lotka–Volterra dynamics", links: [{ label: "predator and prey", href: "/may-2026/" }] },
  ] },
  { group: "Geospatial", primary: "teal", items: [
    { name: "Rust · Golang",               links: [{ label: "orion · /work", href: "/work/" }] },
    { name: "Geospatial ML · H3 indexing", links: [{ label: "orion · /work", href: "/work/" }] },
  ] },
  { group: "fintech", primary: "ochre", items: [
    { name: "LMSR prediction markets", links: [{ label: "pricing the next scarf", href: "/fashion-trends/" }] },
    { name: "Recommendation systems",  links: [{ label: "six engines", href: "/six-engines/" }] },
  ] },
  { group: "Hardware", primary: "cyan", items: [
    { name: "C++ · embedded", links: [{ label: "IoT weather bot · CV", href: CV_PDF }] },
    { name: "Compiler · HDL", links: [{ label: "Nand2Tetris · /work", href: "/work/" }] },
  ] },
  { group: "Infrastructure", primary: "yellow", items: [
    { name: "Astro · React islands", links: [{ label: "this site", href: "https://github.com/shubhangithub/shubz-portfolio" }] },
    { name: "Next.js · Supabase",    links: [{ label: "platypus-learn", href: "https://platypus-learn.vercel.app" }] },
    { name: "UI / UX",               links: [{ label: "this site", href: "/" }] },
  ] },
  { group: "Outreach", primary: "orange", items: [
    { name: "Team leadership",                  links: [{ label: "Dotslash · Council · CV", href: CV_PDF }] },
    { name: "Mentoring under-represented kids", links: [{ label: "Stemmettes · InnovateHer", href: "/work/" }] },
    { name: "DBS-checked (UK)",                 links: [{ label: "cleared for under-18s · /work", href: "/work/" }] },
  ] },
];

// ---------------------------------------------------------------------------
// CONTACT SLIP — right-rail card. Each row is one channel.
// ---------------------------------------------------------------------------
export type ContactRow = { label: string; handle?: string; href: string };

export const HOME_CONTACT_ROWS: ContactRow[] = [
  { label: "github",   handle: "shubhangithub",          href: "https://github.com/shubhangithub" },
  { label: "linkedin", handle: "shubhangi-s-sharma",     href: "https://www.linkedin.com/in/shubhangi-s-sharma/" },
  { label: "email",    handle: "hello@shubzsharma.com", href: "mailto:hello@shubzsharma.com" },
  { label: "/contact", href: "/contact/" },
];

// ---------------------------------------------------------------------------
// MISC strings shown around the home page (small, but here for easy edit)
// ---------------------------------------------------------------------------
export const HOME_FIG_LABEL = "fig. 01 — the threshold";
export const HOME_FIG_CAPTION = "ross–macdonald · august '26";
export const HOME_FIG_LINK_TEXT = "see the equation →";

/** The home "Writing" section shows the essays marked `featured` in posts.ts
 *  (the same three that open /writing/). Edit `featured` there, not here. */
export const HOME_PINNED_SLUGS = [] as const;
export const HOME_PINNED_LABEL = "§03  PINNED · FEATURED WRITING";
export const HOME_PINNED_COMMENT = (count: number) => `${count} open on the desk`;
export const HOME_VIEW_ALL_TEXT = (count: number) => `all ${count} essays →`;

export const HOME_LAST_UPDATED_LABEL = "NOTEBOOK";
export const HOME_LAST_UPDATED_DATE = SITE_LAST_UPDATED_DATE;

export const HOME_CONTACT_HEADER = "contact —";
export const HOME_ANNOTATED_CV_LINK = "annotated cv →";
export const HOME_TOOLBOX_SEE_ALL = "see all skills + provenance →";

// ---------------------------------------------------------------------------
// ABOUTFETCH — the bio as a neofetch-style key–value panel (V6). Each row is
// one claim from BIO, ≤10 words, pen-coloured; `prose` is the original BIO
// sentence, shown when the row is hovered/tapped. The full BIO paragraph
// stays available behind the panel's "read as prose" toggle.
// ---------------------------------------------------------------------------
export type AboutRow = { key: string; value: Span[]; prose: string };

export const ABOUTFETCH_CMD = "aboutfetch";

export const ABOUTFETCH_ROWS: AboutRow[] = [
  { key: "role", prose: "I'm a founding member of technical staff at Torus (YC S26).",
    value: [{ link: "Torus", href: "https://www.usetorus.com/", c: "yellow" }, " ", { link: "(YC S26)", href: "https://www.ycombinator.com/companies/torus", c: "yellow" }, " · founding member of technical staff"] },
  { key: "research", prose: "Alongside, I’m working on DissentCheck, my Cosmos Institute × FIRE research project on evidence, dissent and consensus in AI committees.",
    value: [{ link: "DissentCheck", href: "/now/#focus-1", c: "blue" }, " — evidence, dissent and consensus in AI committees"] },
  { key: "funded by", prose: "AI safety research funded through grants and awards by BlueDot, the Cosmos Institute, and FIRE.",
    value: [{ link: "BlueDot", href: "https://bluedot.org/programs/rapid-grants", c: "blue" }, " · ", { link: "Cosmos Institute", href: "https://blog.cosmos-institute.org/p/announcing-80-new-cosmos-grantees", c: "blue" }, " · ", { link: "FIRE", href: "https://www.fire.org/news/fire-and-cosmos-institute-launch-1-million-grant-program-ai-advances-truth-seeking", c: "blue" }] },
  { key: "oss", prose: "I contribute AI evaluations to Inspect Evals; my NARCBench V2.2 register update merged in October 2026.",
    value: [{ link: "Inspect Evals", href: "https://github.com/UKGovernmentBEIS/inspect_evals/pull/2282", c: "blue" }, " · NARCBench V2.2 merged October 2026"] },
  { key: "bodies", prose: "I'm a full elected member of the IOP (MInstP), and member of the IMA.",
    value: ["Full elected member of ", { link: "IOP", href: "https://www.iop.org/", c: "prompt" }, " (MInstP) · member of ", { link: "IMA", href: "https://ima.org.uk/", c: "magenta" }] },
  { key: "ambassador", prose: "I'm also an ambassador for STEM and AI — with Thinking About Thinking Fellowship, Andrew Ng's DeepLearning.AI (Pie & AI), InnovateHer, Stemettes, and the \"I'm a Scientist\" programme.",
    value: [{ link: "ThAT", href: "https://www.thinkingaboutthinking.org/fellowship", c: "orange" }, " · ", { link: "Pie & AI", href: "https://www.deeplearning.ai/events", c: "orange" }, " · ", { link: "InnovateHer", href: "https://www.innovateher.co.uk/", c: "orange" }, " · ", { link: "Stemettes", href: "https://stemettes.org/", c: "orange" }, " · ", { link: "I'm a Scientist", href: "https://imascientist.org.uk/", c: "orange" }] },
  { key: "makes", prose: "I write here, and build side projects (including fashion predictors, recommendation systems, IoT artifacts, and more).",
    value: [{ link: "essays", href: "/writing/", c: "yellow" }, " · fashion predictors · rec systems · IoT artifacts"] },
  { key: "reading", prose: "I like reading and learning new things; the current list lives at /now.",
    value: ["always — the live list at ", { link: "/now", href: "/now/", c: "orange" }] },
  { key: "education", prose: "I studied maths (and dabbled in physics) at Oxford and computer science at FLAME University, and have held research and software roles across universities and startups.",
    value: [{ link: "Oxford", href: "https://www.ox.ac.uk/admissions/graduate/courses/msc-mathematics-and-foundations-of-computer-science", c: "magenta" }, " maths + CS · ", { link: "FLAME", href: "https://www.flame.edu.in/", c: "yellow" }, " CS"] },
  { key: "previously", prose: "I was previously Techstars-backed Orion's first engineering hire, to founding engineer, building the 0→1 data + ML spatiotemporal backbone that raised $3.5M.",
    value: ["Techstars-backed ", { link: "Orion", href: "https://www.prnewswire.com/news-releases/orion-raises-3-5-million-to-scale-its-ai-powered-risk-intelligence-platform-for-real-world-threat-response-302619603.html", c: "teal" }, " — first hire → founding engineer · the $3.5M data+ML backbone"] },
  { key: "research log", prose: "My Oxford thesis advanced automated immune-biomarker detection on multiplex-immunofluorescence tumour data. Earlier: VAEs, a modified optimiser for protein-function prediction, NLP on the Flipkart–Walmart merger (Best Paper, IEEE ICCUBEA 2025), water-vapour estimation from GNSS signals, and cloud detection from INSAT-3D imagery.",
    value: ["biomarkers · VAEs · JAYA · ", { link: "NLP (IEEE Best Paper)", href: "https://doi.org/10.1109/ICCUBEA65967.2025.11284272", c: "purple" }, " · GNSS · INSAT-3D"] },
  { key: "offline", prose: "Away from work, I row, make art, ride horses, and spend an unreasonable amount of time making interactive diagrams.",
    value: ["Away from work, I ", { link: "row", href: "https://www.strava.com/athletes/155447309", c: "orange" }, ", make art, ride horses, and spend an unreasonable amount of time making ", { link: "interactive diagrams", href: "/writing/", c: "magenta" }, "."] },
];

export const ABOUTFETCH_PROSE_TOGGLE = ["read as prose →", "← back to the panel"];

// Extra detail for the office display, not a paraphrase of the linked summary.
// ABOUTFETCH_ROWS.prose remains the full source record for other consumers.
export const OFFICE_CONTEXT: Record<string, string> = {
  ambassador: "ThAT is the Thinking About Thinking Fellowship; Pie & AI is Andrew Ng's DeepLearning.AI programme.",
  education: "I also dabbled in physics at Oxford, and have held research and software roles across universities and startups.",
  "research log": "My Oxford thesis advanced automated immune-biomarker detection on multiplex-immunofluorescence tumour data. The protein-function project used a modified optimiser, and the merger paper won Best Paper at IEEE ICCUBEA 2025. The satellite work estimated water vapour from GNSS signals and detected clouds in INSAT-3D imagery.",
};
