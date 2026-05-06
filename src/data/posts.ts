// Essay metadata. Mirrors the frontmatter of each MDX file in
// src/content/essays/ — kept here as a typed module for layouts that need
// to enumerate posts (the home page, the writing index, the article rail).

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
};

export const POSTS: Post[] = [
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
  },
  {
    slug: "bluedot-unit1",
    title: "A unit on bending the curve",
    kicker: "Essay · AI Strategy & Policy",
    dek: "Nine readings on who shapes artificial intelligence — and what 'shape' actually means when nobody can name the shaper.",
    minutes: 22,
    illustration: "wave",
    cardBg: "#E6E8F2",
    accent: "#1F3DBF",
    tag: "ai safety",
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
  },
  {
    slug: "merger-themes",
    title: "What the merger said",
    kicker: "Essay · NLP & M&A",
    dek: "Theme extraction and sentiment mining on the Flipkart-Walmart merger.",
    minutes: 9,
    illustration: "wave",
    cardBg: "#EFE8E5",
    accent: "#1F3DBF",
    tag: "nlp",
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
  },
];

export function findPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
