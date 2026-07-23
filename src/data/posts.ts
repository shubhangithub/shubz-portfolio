// Essay metadata shared by the home page, writing index and article rail.
//
// `nbAccent` selects a per-essay colour from the notebook palette. If it is
// missing, page components fall back to blue. See DECISIONS-v5.md §14 for
// the topic-family rules.

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
  /** Hide from writing index and home; accessible via direct URL. */
  draft?: boolean;
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
    slug: "bluedot-assumptions",
    title: "Underlying Assumptions on the AGI Strategy Course",
    kicker: "Essay · AI Strategy & Policy",
    dek: "Six assumptions the AGI Strategy readings share, that almost none of them defends.",
    minutes: 18,
    illustration: "wave",
    cardBg: "#E6E8F2",
    accent: "#1F3DBF",
    tag: "ai safety",
    family: "ai-safety",
    nbAccent: "blue",
    publishedAt: "2026-06-07",
    related: ["bluedot-unit1", "bluedot-vocabulary", "bluedot-civilization"],
  },
  {
    slug: "bluedot-vocabulary",
    draft: true,
    title: "The same word, five meanings",
    kicker: "Essay · AI Strategy & Policy",
    dek: "How most AI debates dissolve once you say whose dictionary you're using.",
    minutes: 14,
    illustration: "wave",
    cardBg: "#E6E8F2",
    accent: "#1F3DBF",
    tag: "ai safety",
    family: "ai-safety",
    nbAccent: "blue",
    publishedAt: "2026-06-07",
    related: ["bluedot-assumptions", "bluedot-killchain", "bluedot-unit1"],
  },
  {
    slug: "bluedot-civilization",
    title: "The civilisation frame",
    kicker: "Essay · AI Strategy & Policy",
    dek: "Four readings, four ideologies, one shared unit of analysis.",
    minutes: 16,
    illustration: "wave",
    cardBg: "#E6E8F2",
    accent: "#1F3DBF",
    tag: "ai safety",
    family: "ai-safety",
    nbAccent: "blue",
    publishedAt: "2026-06-07",
    related: ["bluedot-killchain", "bluedot-assumptions", "bluedot-unit1"],
  },
  {
    slug: "bluedot-killchain",
    title: "Tracing a Kill Chain Through the AGI Strategy Course",
    kicker: "Essay · AI Strategy & Policy",
    dek: "One concrete failure story walked backwards through all five units.",
    minutes: 20,
    illustration: "wave",
    cardBg: "#E6E8F2",
    accent: "#1F3DBF",
    tag: "ai safety",
    family: "ai-safety",
    nbAccent: "blue",
    publishedAt: "2026-06-07",
    related: ["bluedot-civilization", "bluedot-assumptions", "bluedot-unit1"],
  },
  {
    slug: "zx-calculus",
    draft: true,
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
    draft: true,
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
    draft: true,
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
    draft: true,
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
    draft: true,
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
    slug: "fisher-wave",
    title: "The wave of advance · July '26",
    kicker: "Note · Mathematical biology",
    dek: "Five muskrats, one equation, and the square-root speed limit on how fast anything — a gene, a species, a bad idea — can spread.",
    minutes: 7,
    illustration: "wave",
    cardBg: "#E8EEF0",
    accent: "#1F3DBF",
    tag: "biology",
    family: "biotech",
    nbAccent: "red",
    publishedAt: "2026-07-17",
    related: ["turing-morphogenesis", "may-2026"],
  },
  {
    slug: "turing-morphogenesis",
    title: "Turing's last equation · June '26",
    kicker: "Note · Mathematical biology",
    dek: "How diffusion, usually a smoothing force, can write a pattern from nothing.",
    minutes: 8,
    illustration: "wave",
    cardBg: "#EAE8F0",
    accent: "#1F3DBF",
    tag: "biology",
    family: "biotech",
    nbAccent: "red",
    publishedAt: "2026-06-23",
    related: ["may-2026", "threshold-gate", "constraint-clustering"],
  },
  {
    slug: "may-2026",
    title: "Predator and prey, on a closed loop · May '26",
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
  "bluedot-assumptions",
  "bluedot-civilization",
  "bluedot-killchain",
  "may-2026",
  "six-engines",
  "fisher-wave",
  "turing-morphogenesis",
  "zx-calculus",
  "jaya",
  "fashion-trends",
  "threshold-gate",
]);

export function thumbUrlFor(slug: string): string | undefined {
  return ESSAY_THUMB_SLUGS.has(slug) ? `/thumbs/${slug}.jpg` : undefined;
}
