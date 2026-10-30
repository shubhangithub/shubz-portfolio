/** Qualitative object sketches, keyed to the complete original project index. */
export type ProjectStudyKind =
  | "engineering"
  | "map"
  | "fashion"
  | "course"
  | "mixer"
  | "slide"
  | "press"
  | "features"
  | "satellite"
  | "computer"
  | "site"
  | "record"
  | "weather"
  | "cipher";
export const PROJECT_STUDIES: Record<
  string,
  { kind: ProjectStudyKind; caption: string }
> = {
  "Torus": { kind: "engineering", caption: "Engineering packages / connected disciplines" },
  "Local Provision Finder": { kind: "site", caption: "Local services / search, review & shortlist" },
  "Orion intelligence platform": {
    kind: "map",
    caption: "H3 / spatial indexing",
  },
  "fashion-web": { kind: "fashion", caption: "Trends / prediction market" },
  "platypus-learn": { kind: "course", caption: "From source to course" },
  "Taylor Swift recommendation engine": {
    kind: "mixer",
    caption: "Six-engine mixing desk",
  },
  "MFoCS thesis · immune biomarkers": {
    kind: "slide",
    caption: "Immune biomarkers / research notes",
  },
  "Flipkart–Walmart merger NLP": {
    kind: "press",
    caption: "NLP / the coverage archive",
  },
  "JAYA protein feature selection": {
    kind: "features",
    caption: "Protein features / selection",
  },
  "GNSS water-vapour ML": {
    kind: "satellite",
    caption: "GNSS / atmospheric signals",
  },
  "Nand2Tetris — 16-bit computer": {
    kind: "computer",
    caption: "From NAND gates to an operating system",
  },
  "this site": { kind: "site", caption: "A notebook, built for the browser" },
  "Taylor Swift rec engine — R/Shiny": {
    kind: "record",
    caption: "The R / Shiny edition",
  },
  "IoT weather bot": {
    kind: "weather",
    caption: "Sensors, signals & a small fan",
  },
  "layered cipher": {
    kind: "cipher",
    caption: "Four layers / a reversible cipher",
  },
};
export const PROJECT_STUDY_COPY = {
  sheet: "PROJECT SHEET",
  sketch: "Pen study",
  register: "Subject register",
  follow: "Follow this ink",
  records: "Same subject",
  published: "published",
  draft: "draft",
};
