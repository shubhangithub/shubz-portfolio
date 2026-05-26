// Essay metadata. Mirrors the frontmatter of each MDX file in
// src/content/essays/ — kept here as a typed module for layouts that need
// to enumerate posts (the home page, the writing index, the article rail).
//
// V5 fields (`family`, `nbAccent`) are optional and additive — V4 keeps
// using `accent` (cobalt site-wide); V5 reads `nbAccent` to pull a
// per-essay colour from NB_LIGHT/NB_DARK in palette.ts. If `nbAccent`
// is missing, V5 falls back to "blue". See AGENTS-v5.md (in
// design_handoff_v5_field_notebook/) for the topic-family rules.

import type { NBAccentKey } from "./palette";

export type Post = {
  slug: string;
  title: string;
  kicker: string;
  dek: string;
  minutes: number;
  illustration: "hex" | "wave" | "skate" | "protocol";
  cardBg: string;
  accent: string;
  tag: string;
  /**
   * V5 — meta-topic this essay rolls up to. One of the 10 canonical
   * categories (see palette.ts header + DECISIONS-v5.md §14). Specific
   * sub-topics like "ecology" or "immunology" both colour as `biotech`;
   * "game theory" and "graph theory" both colour as `math`. The family
   * value drives the chip colour via `nbAccent`.
   */
  family?:
    | "ai-safety"   // blue   — alignment, ethics, governance
    | "ml-research" // purple — classical ML, NLP, LLM eng, optim
    | "math"        // magenta — game/cat/graph theory, complexity, GDL, crypto
    | "physics"     // prompt-green — quantum, atmospheric, GNSS, satellite
    | "biotech"     // red    — biology, ecology, bioinformatics, biomarkers
    | "geospatial"  // teal   — geospatial ML, GIS, H3, mapping
    | "markets"     // ochre  — LMSR, time-series, recommendations, forecasting
    | "hardware"    // cyan   — IoT, embedded, HDL, compiler/VM
    | "infra"       // yellow — data arch, UI/UX, web stack, cloud
    | "outreach";   // orange — mentoring, leadership, STEM-ed, comms
  /** V5 — per-essay accent key into NB_LIGHT/NB_DARK in palette.ts. */
  nbAccent?: NBAccentKey;
  /** ISO date the essay was published. Drives Article schema `datePublished`
   *  and the article:published_time OG meta. Format: "YYYY-MM-DD". */
  publishedAt?: string;
  /** ISO date the essay was substantively revised. Drives Article schema
   *  `dateModified`. Leave unset if never revised; the schema falls back
   *  to `publishedAt`. */
  updatedAt?: string;
  /** Slugs of related essays to surface in the "Related" block on the
   *  article page. Max 3. Pick by family adjacency + topical overlap. */
  related?: string[];
};

export const POSTS: Post[] = [
  {
    slug: "bluedot-unit1",
    title: "A unit on bending the curve",
    kicker: "Essay · AI Strategy & Policy",
    dek: "Who shapes artificial intelligence and what 'shape' means.",
    minutes: 22,
    illustration: "wave",
    cardBg: "#E6E8F2",
    accent: "#1F3DBF",
    tag: "ai safety",
    family: "ai-safety",
    nbAccent: "blue",
    publishedAt: "2026-05-20",
  },
  {
    slug: "zx-calculus",
    title: "Two colours and a Hadamard",
    kicker: "Essay · Quantum Computation",
    dek: "ZX-calculus as a way of picturing — and actually proving things about — quantum circuits.",
    minutes: 11,
    illustration: "hex",
    cardBg: "#E4EAE6",
    accent: "#1F3DBF",
    tag: "physics",
    family: "physics",
    nbAccent: "prompt",
    publishedAt: "2025-09-15",
    related: ["threshold-gate", "constraint-clustering"],
  },
  {
    slug: "jaya",
    title: "JAYA, improved",
    kicker: "Essay · Optimisation & Bioinformatics",
    dek: "Improving a parameter-free optimiser with a fitness trade-off and elitism.",
    minutes: 12,
    illustration: "hex",
    cardBg: "#E5E8F0",
    accent: "#1F3DBF",
    tag: "biology",
    family: "ml-research",
    nbAccent: "purple",
    publishedAt: "2025-08-10",
    related: ["threshold-gate", "constraint-clustering"],
  },
  {
    slug: "fashion-trends",
    title: "Pricing the next scarf",
    kicker: "Essay · Forecasting & Markets",
    dek: "Five-source forecasting and an LMSR prediction market on fashion micro-trends.",
    minutes: 9,
    illustration: "wave",
    cardBg: "#ECEAE3",
    accent: "#1F3DBF",
    tag: "forecasting",
    family: "markets",
    nbAccent: "ochre",
    publishedAt: "2026-04-15",
    related: ["six-engines"],
  },
  {
    slug: "threshold-gate",
    title: "Positive by how much",
    kicker: "Essay · Computational biology",
    dek: "Four automated methods replicating a pathologist's threshold on immune cell data.",
    minutes: 9,
    illustration: "hex",
    cardBg: "#EFEEE7",
    accent: "#1F3DBF",
    tag: "biology",
    family: "biotech",
    nbAccent: "red",
    publishedAt: "2025-09-20",
    related: ["constraint-clustering", "jaya"],
  },
  {
    slug: "constraint-clustering",
    title: "Cells that can't exist",
    kicker: "Essay · Computational biology",
    dek: "A standard clustering algorithm, plus nine immunology constraints.",
    minutes: 10,
    illustration: "hex",
    cardBg: "#EDE9E4",
    accent: "#1F3DBF",
    tag: "biology",
    family: "biotech",
    nbAccent: "red",
    publishedAt: "2025-10-12",
    related: ["threshold-gate", "jaya"],
  },
  {
    slug: "six-engines",
    title: "Six engines for one songbook",
    kicker: "Essay · Recommendation",
    dek: "Five base models plus an ensemble on Taylor's full catalogue.",
    minutes: 7,
    illustration: "wave",
    cardBg: "#EBE8EE",
    accent: "#1F3DBF",
    tag: "ml",
    family: "markets",
    nbAccent: "ochre",
    publishedAt: "2026-01-22",
    related: ["fashion-trends"],
  },
  {
    slug: "may-2026",
    title: "Predator and prey, on a closed loop",
    kicker: "Note · Mathematical ecology",
    dek: "The May figure: Lotka–Volterra, drawn for Robert May.",
    minutes: 4,
    illustration: "wave",
    cardBg: "#E8EEF0",
    accent: "#1F3DBF",
    tag: "ecology",
    family: "biotech",
    nbAccent: "red",
    publishedAt: "2026-05-01",
    related: ["threshold-gate", "constraint-clustering"],
  },
];

export function findPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/**
 * Slugs whose polaroid thumbnail exists in `public/thumbs/<slug>.jpg`.
 * Add a slug here after dropping its image in. HomeV5 + WritingIndexV5
 * call `thumbUrlFor(slug)` to decide whether to render a real image or
 * fall back to NBThumb's striped accent placeholder.
 */
export const ESSAY_THUMB_SLUGS: ReadonlySet<string> = new Set([
  "bluedot-unit1",
  "zx-calculus",
  "jaya",
  "fashion-trends",
  "threshold-gate",
]);

export function thumbUrlFor(slug: string): string | undefined {
  return ESSAY_THUMB_SLUGS.has(slug) ? `/thumbs/${slug}.jpg` : undefined;
}
