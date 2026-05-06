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
    "zx-calculus": {
      tags: "quantum computation, ZX-calculus, physics",
      toc: ["Header", "Lede", "What circuits hide", "Spiders", "Three rules", "Why teleportation is obvious", "Completeness and what comes after"],
      sources: [
        ['[1] Coecke, B. & Duncan, R. (2008). ', '"Interacting Quantum Observables." ICALP 2008.'],
        ['[2] Coecke, B. & Duncan, R. (2011). ', '"Interacting Quantum Observables: Categorical Algebra and Diagrammatics." New Journal of Physics 13.'],
        ['[3] van de Wetering, J. (2020). ', '"ZX-calculus for the working quantum computer scientist." arXiv 2012.13966.'],
        ['[4] Kissinger, A. & van de Wetering, J. ', 'PyZX — Python library for ZX-calculus circuit optimisation. github.com/Quantomatic/pyzx'],
        ['[5] Jeandel, E., Perdrix, S. & Vilmart, R. (2018). ', '"A Complete Axiomatisation of the ZX-Calculus for Clifford+T Quantum Mechanics." LICS.'],
        ['[6] Coecke, B. & Kissinger, A. (2017). ', 'Picturing Quantum Processes. Cambridge University Press.'],
      ],
      sidenotes: 4,
    },
    "bluedot-unit1": {
      tags: "ai strategy, policy, safety",
      toc: ["Header", "Lede", "The prize", "The structural obstacle", "What shaping actually looks like", "The international complication", "What kind of future, exactly?", "Who is 'we'?"],
      sources: [
        ['[1] Rehman, I., Mueller, K., Mazarr, M. (2024). ', '"Seeking Stability in the Competition for AI Advantage." RAND Corporation.'],
        ['[2] Samuel, S. (2024). ', '"It\'s Practically Impossible to Run a Big AI Company Ethically." Vox.'],
        ['[3] Toner, H. (2024). ', '"In Search of a Dynamist Vision for Safe Superhuman AI." CSET.'],
        ['[4] Fist, T., Burga, A., Hwang, T. (2024). ', '"Preparing for Launch." Institute for Progress.'],
        ['[5] Bregman, R. (2017). ', '"The Return of Utopia." Ch. 1 in Utopia for Realists. Little, Brown.'],
        ['[6] Amodei, D. (2024). ', '"Machines of Loving Grace." Personal essay, October 2024.'],
        ['[7] Altman, S. (2025). ', '"The Gentle Singularity." Personal essay, June 2025.'],
        ['[8] Altman, S. (2024). ', '"The Intelligence Age." Personal essay, September 2024.'],
        ['[9] Krook, J. (2023). ', '"Solarpunk: A Vision for a Sustainable Future."'],
      ],
      sidenotes: 5,
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
