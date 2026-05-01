// Seasonal figure rotation. One theme per month — January through December.
// The home page renders the current month's figure as fig.01.

export type SeasonalTheme = {
  id: string;
  label: string;
  caption: string;
  why: string;
};

export const SEASONAL_THEMES: SeasonalTheme[] = [
  { id: "skating",       label: "Skating",         caption: "trochoid · wheel along a line",
    why: "January, when the rinks are full." },
  { id: "cellular",      label: "Cellular",        caption: "Wolfram rule 110 · 1-D automaton",
    why: "February, after Darwin's birthday — the smallest rules that look like life." },
  { id: "topology",      label: "Topology",        caption: "non-orientable surface · möbius",
    why: "March, around Pi Day. A surface with one side." },
  { id: "astronomy",     label: "Astronomy",       caption: "Kepler orbit · e = 0.4",
    why: "April is Global Astronomy Month. An ellipse, with the sun off-centre." },
  { id: "lotkavolterra", label: "Predator–prey",   caption: "Lotka–Volterra · α=1, δ=0.4",
    why: "May 22 is International Day for Biological Diversity. Predator and prey, locked in one closed loop — for Robert May." },
  { id: "fluids",        label: "Fluids",          caption: "Kármán vortex street · Re ≈ 100",
    why: "June, around World Oceans Day. Water past a column." },
  { id: "relativity",    label: "Relativity",      caption: "light cone · Minkowski",
    why: "July, on the anniversary of Apollo 11. A light cone." },
  { id: "optics",        label: "Optics",          caption: "double-slit · path difference",
    why: "August, watching the Perseids. Two slits, one pattern." },
  { id: "crypto",        label: "Lattices",        caption: "LLL basis reduction",
    why: "September, Programmer's Day. Lattice basis reduction." },
  { id: "h3",            label: "H3 hexagons",     caption: "hex lattice · resolution 8",
    why: "October, Powers of Ten Day. Indexing the world on hexes." },
  { id: "quantum",       label: "Quantum",         caption: "interference of two stationary states",
    why: "November, around World Science Day. Two stationary states, beating." },
  { id: "neural",        label: "Latent space",    caption: "random walk in 2-D embedding",
    why: "December, taking stock. A random walk through latent space." },
];

// Returns the theme for a given calendar month index (0–11). On dates before
// May 1 we still want to surface the May Lotka-Volterra figure (it was added
// a few days early), so clamp the lower bound at index 4.
export function currentTheme(now = new Date()): SeasonalTheme {
  const month = Math.max(4, now.getMonth());
  return SEASONAL_THEMES[month] ?? SEASONAL_THEMES[0];
}
