// Site palette tokens. The site has two modes — cool ivory + cobalt (light)
// and midnight + cobalt (dark). Diagram components and chrome both pull from
// the active palette so colours stay consistent across light/dark switches.

export type Palette = {
  id: string;
  label: string;
  paper: string;
  ink: string;
  muted: string;
  accent: string;
  line: string;
};

export const PALETTE_LIGHT: Palette = {
  id: "cobalt",
  label: "cool ivory + cobalt",
  paper: "#F2F1EC",
  ink: "#0F1320",
  muted: "#6E7488",
  accent: "#1F3DBF",
  line: "#D5D6DC",
};

export const PALETTE_DARK: Palette = {
  id: "cobalt-dark",
  label: "midnight + cobalt",
  paper: "#0F1320",
  ink: "#E8E6E1",
  muted: "#8B8FA4",
  accent: "#6B8AFF",
  line: "#252A3A",
};
