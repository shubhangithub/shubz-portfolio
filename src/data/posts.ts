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
  /** V5 — topic family. */
  family?: "ai" | "quantum" | "bio" | "optim" | "markets" | "ml" | "ecology" | "physics";
  /** V5 — per-essay accent key into NB_LIGHT/NB_DARK in palette.ts. */
  nbAccent?: NBAccentKey;
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
    family: "ai",
    nbAccent: "blue",
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
    family: "quantum",
    nbAccent: "prompt",
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
    family: "optim",
    nbAccent: "orange",
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
    family: "bio",
    nbAccent: "magenta",
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
    family: "bio",
    nbAccent: "red",
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
    family: "ml",
    nbAccent: "purple",
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
    family: "ecology",
    nbAccent: "teal",
  },
];

export function findPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
