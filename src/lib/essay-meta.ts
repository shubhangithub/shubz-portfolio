// @ts-nocheck

export function essayMeta(slug) {
  const meta = {
    "jaya": {
      tags: "optimisation, feature selection, bioinformatics",
      toc: ["Header", "Lede", "JAYA, briefly", "Two modifications", "Three protein datasets", "What improved means"],
      sources: [
        ['[1] Rao, R. V. (2016). ', '"Jaya: A simple and new optimization algorithm." Int. J. Industrial Engineering Computations.'],
        ['[2] Gandhi, N., Sharma, S., Rawat, O., Bhosale, H., Sane, A., & Jayaraman, V. K. (2022). ', '"Improved Jaya algorithm for identification of protein functions." Poster PP-28, INBIX\'22, VFSTR.'],
        ['[3] ', "github.com/Shubzthub/inbix22"],
      ],
      sidenotes: 4,
    },
    "threshold-gate": {
      tags: "computational biology, thresholding",
      toc: ["Header", "Lede", "Six markers, one panel", "Four ways to draw a line", "The marker that broke everything", "What 0.11 units hides"],
      sources: [
        ['[1] Otsu, N. (1979). ', '"A threshold selection method from gray-level histograms." IEEE Trans. Systems, Man, and Cybernetics.'],
        ['[2] Sharma, S. (2024). ', "Analysing and Advancing Automated Immune Biomarker Detection. MFoCS thesis, Oxford · Lady Margaret Hall."],
        ['[3] Wilson, C. M., et al. (2021). ', '"Challenges and opportunities in the statistical analysis of multiplex immunofluorescence data." Cancers 13(12).'],
      ],
      sidenotes: 4,
    },
    "constraint-clustering": {
      tags: "computational biology, clustering",
      toc: ["Header", "Lede", "Why not just threshold?", "What the textbook misses", "Teaching the distance metric", "The honest result"],
      sources: [
        ['[1] Ng, A., Jordan, M., & Weiss, Y. (2001). ', '"On spectral clustering: Analysis and an algorithm." NIPS 14.'],
        ['[2] Ward, J. H. (1963). ', '"Hierarchical grouping to optimize an objective function." J. American Statistical Association.'],
        ['[3] Sharma, S. (2024). ', "Analysing and Advancing Automated Immune Biomarker Detection. MFoCS thesis, Oxford · Lady Margaret Hall."],
        ['[4] Wagstaff, K. L. (2011). ', '"Constrained clustering." Encyclopedia of Machine Learning, Springer.'],
      ],
      sidenotes: 5,
    },
    "merger-themes": {
      tags: "nlp, m&a",
      toc: ["Header", "Draft in progress"],
      sources: [],
      sidenotes: 0,
    },
    "may-2026": {
      tags: "mathematical ecology, ODE, predator–prey",
      toc: ["Header", "Lede", "What the sliders teach", "For Robert May"],
      sources: [
        ['[1] Lotka, A. J. (1925). ', '"Elements of Physical Biology." Williams & Wilkins.'],
        ['[2] Volterra, V. (1926). ', '"Variazioni e fluttuazioni del numero d\'individui in specie animali conviventi." Mem. R. Acc. Lincei.'],
        ['[3] May, R. M. (1976). ', '"Simple mathematical models with very complicated dynamics." Nature 261.'],
      ],
      sidenotes: 4,
    },
    "six-engines": {
      tags: "recommendation, music",
      toc: ["Header", "Lede", "Six engines, one query", "The dataset that made it tractable", "Why the ensemble works", "What the demo actually feels like"],
      sources: [
        ['[1] Mikolov, T., et al. (2013). ', "Efficient estimation of word representations in vector space."],
        ['[2] Grover, A., & Leskovec, J. (2016). ', "node2vec: Scalable feature learning for networks. KDD."],
        ['[3] He, X., et al. (2017). ', "Neural Collaborative Filtering. WWW."],
        ['[4] ', "shubz-taylor-recommendation-engine.vercel.app · Taylor's full discography + editorial bridges."],
      ],
      sidenotes: 3,
    },
    "fashion-trends": {
      tags: "forecasting, computer vision, LMSR",
      toc: ["Header", "Lede", "Five signals, one composite", "The Trend Exchange", "What the camera sees", "What I'm optimising for"],
      sources: [
        ['[1] Hanson, R. (2003). ', '"Combinatorial Information Market Design." Information Systems Frontiers.'],
        ['[2] ', "fashion-web-psi.vercel.app — live platform, Next.js / Vercel edge / LMSR exchange."],
        ['[3] ', "Google Trends (trendspyg), Bluesky firehose, Pinterest, Reddit, YouTube — five-source ingestion pipeline."],
        ['[4] ', "Gemini 2.5 Flash — garment detection, colour palette extraction, runway matching."],
      ],
      sidenotes: 3,
    },
  };
  return meta[slug] || meta["jaya"];
}

export function inputStyle(p) {
  return { all: "unset", flex: 1, padding: "4px 0", fontFamily: "var(--f-body)", fontSize: "1rem", color: p.ink, width: "100%", outline: "none" };
}
