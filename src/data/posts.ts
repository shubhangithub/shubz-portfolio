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
};

export const POSTS: Post[] = [
  {
    slug: "jaya",
    title: "JAYA, improved",
    kicker: "Essay · Optimisation & Bioinformatics",
    dek: "Improving a parameter-free optimiser with a fitness trade-off and elitism.",
    minutes: 12,
    illustration: "hex",
    cardBg: "#E5E8F0",
    accent: "#1F3DBF",
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
  },
];

export function findPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
