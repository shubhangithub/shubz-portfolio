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
  /** Optional series label. Consecutive essays sharing one are grouped
   *  under it on /writing/ (the AGI Strategy Course set, the monthly Notes). */
  series?: string;
  /** Unpublished work: excluded from all public surfaces and routes. */
  draft?: boolean;
  /** Temporarily remove from every public surface, including its direct route. */
  hidden?: boolean;
};

// Published essay metadata for this public source snapshot.
export const POSTS: Post[] = [
  {
    slug: "october-feedback",
    title: "The correction arrives late · October '26",
    kicker: "Essay · Infrastructure",
    dek: "What happens when a controller keeps correcting an error that has already changed.",
    minutes: 7,
    illustration: "wave",
    cardBg: "#F0EAE8",
    accent: "#1F3DBF",
    tag: "infrastructure",
    family: "infra",
    nbAccent: "yellow",
    publishedAt: "2026-10-29",
    updatedAt: "2026-10-30",
  },
  {
    slug: "september-queue",
    title: "The queue at ninety per cent · September '26",
    kicker: "Essay · Infrastructure",
    dek: "Why spare capacity matters, and what an average can hide about waiting.",
    minutes: 7,
    illustration: "wave",
    cardBg: "#F0EAE8",
    accent: "#1F3DBF",
    tag: "infrastructure",
    family: "infra",
    nbAccent: "yellow",
    publishedAt: "2026-10-29",
    updatedAt: "2026-10-30",
  },
  {
    slug: "ross-threshold",
    title: "The last mosquito · August '26",
    kicker: "Essay · Mathematical biology",
    dek: "How malaria transmission can fall below its threshold while mosquitoes remain.",
    minutes: 7,
    illustration: "wave",
    cardBg: "#F0EAE8",
    accent: "#1F3DBF",
    tag: "mathematical biology",
    family: "biotech",
    nbAccent: "red",
    publishedAt: "2026-10-29",
    updatedAt: "2026-10-30",
  },

  {
    slug: "bluedot-unit1",
    series: "AGI Strategy Course",
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
    series: "AGI Strategy Course",
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
    slug: "bluedot-civilization",
    series: "AGI Strategy Course",
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
    series: "AGI Strategy Course",
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
    series: "Monthly notes · mathematical biology",
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
    series: "Monthly notes · mathematical biology",
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
    series: "Monthly notes · mathematical biology",
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

/** Posts available on public routes, indexes, feeds and navigation. */
export const VISIBLE_POSTS: Post[] = POSTS.filter((post) => !post.hidden && !post.draft);

export function findPost(slug: string): Post | undefined {
  return VISIBLE_POSTS.find((p) => p.slug === slug);
}

/**
 * Slugs whose polaroid thumbnail exists in `public/thumbs/<slug>.jpg`.
 * Add a slug here after dropping its image in. HomeV5 + WritingIndexV5
 * call `thumbUrlFor(slug)` to decide whether to render a real image or
 * fall back to NBThumb's striped accent placeholder.
 */
export const ESSAY_THUMB_SLUGS: ReadonlySet<string> = new Set([
  "ross-threshold",
  "september-queue",
  "october-feedback",
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

// Only unavailable route identifiers enter public code, never their editorial metadata.
const UNAVAILABLE_POST_SLUGS = new Set(["bluedot-vocabulary", "zx-calculus", "jaya", "fashion-trends", "threshold-gate", "constraint-clustering"]);

/** Suppress links to unpublished/hidden essays while retaining their local source. */
export function isAvailableSiteLink(href: string | null | undefined): href is string {
  if (!href) return false;
  try {
    const url = new URL(href, 'https://shubzsharma.com');
    if (url.hostname !== 'shubzsharma.com') return true;
    const slug = url.pathname.replace(/^\/+|\/+$/g, '');
    return !UNAVAILABLE_POST_SLUGS.has(slug) && !POSTS.some(post => post.slug === slug && (post.hidden || post.draft));
  } catch { return false; }
}
