// @ts-nocheck

export function essayMeta(slug) {
  const meta = {
    "jaya": {
      tags: "optimisation, feature selection, bioinformatics",
      toc: ["Header", "Lede", "JAYA, briefly", "Two modifications", "Three protein datasets", "What improved means"],
      sources: [
        ['[1] Rao, R. V. (2016). ', '"Jaya: A simple and new optimization algorithm." Int. J. Industrial Engineering Computations.'],
        ['[2] Gandhi, N., Sharma, S., Rawat, O., Bhosale, H., Sane, A., & Jayaraman, V. K. (2022). ', '"Improved Jaya algorithm for identification of protein functions." Poster PP-28, INBIX\'22, VFSTR.'],
        ['[3] ', "github.com/shubhangithub/inbix22"],
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
    "turing-morphogenesis": {
      tags: "mathematical biology, reaction-diffusion, morphogenesis",
      toc: ["Header", "Lede", "What the figure shows", "The condition", "Does it actually happen", "For Alan Turing"],
      sources: [
        ['[1] Turing, A.M. (1952). ', '"The Chemical Basis of Morphogenesis." Phil. Trans. R. Soc. Lond. B 237(641):37–72.'],
        ['[2] Castets, V., Dulos, E., Boissonade, J. & De Kepper, P. (1990). ', '"Experimental evidence of a sustained standing Turing-type nonequilibrium chemical pattern." Phys. Rev. Lett. 64(24):2953–2956.'],
        ['[3] Kondo, S. & Asai, R. (1995). ', '"A reaction-diffusion wave on the skin of the marine angelfish Pomacanthus." Nature 376:765–768.'],
        ['[4] Nakamasu, A. et al. (2009). ', '"Interactions between zebrafish pigment cells responsible for the generation of Turing patterns." PNAS 106(21):8429–8434.'],
        ['[5] Sick, S. et al. (2006). ', '"WNT and DKK determine hair follicle spacing through a reaction-diffusion mechanism." Science 314(5804):1447–1450.'],
        ['[6] Gierer, A. & Meinhardt, H. (1972). ', '"A theory of biological pattern formation." Kybernetik 12:30–39.'],
        ['[7] Gray, P. & Scott, S.K. (1983–84). ', 'Chem. Eng. Sci. 38(1):29–43 and 39(6):1087–1097.'],
      ],
      sidenotes: 7,
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
    "bluedot-assumptions": {
      tags: "ai strategy, epistemology, governance",
      toc: ["Header", "Lede", "Capability is scalar", "Compute is the binding lever", "The developer is well-intentioned", "Timelines are short", "Western actors write the rules", "Defence is the goal"],
      sources: [
        ['[1] Chollet, F. (2019). ', '"On the Measure of Intelligence." arXiv 1911.01547.'],
        ['[2] Erdil, E. / Epoch (2025). ', '"A case for multi-decade AI timelines."'],
        ['[3] METR (Jan 2026). ', '"Time Horizon 1.1 update."'],
        ['[4] ARC Prize Foundation (Feb 2026). ', 'ARC-AGI-2 evaluation results.'],
        ['[5] Davidson, T., Finnveden, L. & Hadshar, R. (Apr 2025). ', '"AI-Enabled Coups." Forethought.'],
      ],
      sidenotes: 1,
    },
    "bluedot-vocabulary": {
      tags: "ai strategy, language, policy",
      toc: ["Header", "Lede", "Alignment", "Coordination", "Race", "Control", "Safety", "Capability", "AGI"],
      sources: [
        ['[1] Jones, A. / BlueDot (2025). ', '"What is AI alignment?"'],
        ['[2] Aschenbrenner, L. (Jun 2024). ', '"Situational Awareness: IV. The Project."'],
        ['[3] Buterin, V. (Jan 2025). ', '"d/acc one year later."'],
        ['[4] Samuel, S. / Vox (2024). ', '"It\'s Practically Impossible to Run a Big AI Company Ethically."'],
        ['[5] CAISI rebrand (Jun 2025). ', 'US Commerce Department announcement.'],
      ],
      sidenotes: 0,
    },
    "bluedot-civilization": {
      tags: "ai strategy, governance, civilisation",
      toc: ["Header", "Lede", "The Toner→Chollet move", "Four readings, one unit", "Sorting the course", "What shifts", "Honest tensions", "Why the frame matters"],
      sources: [
        ['[1] Chollet, F. (2019). ', '"On the Measure of Intelligence." arXiv 1911.01547.'],
        ['[2] Buterin, V. (Jan 2025). ', '"d/acc: one year later."'],
        ['[3] Narayanan, A. & Kapoor, S. (Apr 2025). ', '"AI as Normal Technology." Knight First Amendment Institute.'],
        ['[4] DeepMind (Sep 2024). ', 'AlphaProteo protein binder results.'],
        ['[5] Hayek, F. A. (1945). ', '"The Use of Knowledge in Society." American Economic Review.'],
      ],
      sidenotes: 0,
    },
    "bluedot-killchain": {
      tags: "ai safety, control, alignment",
      toc: ["Header", "Lede", "Phase by phase", "Unit 1 visions", "Unit 2 empirical claims", "Unit 3–4 defences", "Unit 5 leverage"],
      sources: [
        ['[1] Apollo Research (Dec 2024). ', '"Frontier Models are Capable of In-context Scheming."'],
        ['[2] Greenblatt, R. et al. (2023). ', '"AI Control: Improving Safety Despite Intentional Subversion." arXiv 2312.06942.'],
        ['[3] Becker, A. et al. (Jul 2025). ', '"METR developer productivity RCT." arXiv 2507.09089.'],
        ['[4] Nevo, S. et al. / RAND (2024). ', '"Securing AI Model Weights."'],
        ['[5] Ngo, R. (Oct 2024). ', '"Reframing AGI Threat Models."'],
      ],
      sidenotes: 1,
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
