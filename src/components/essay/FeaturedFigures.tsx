// @ts-nocheck
/**
 * FeaturedFigures — the one live figure each featured essay shows on the
 * /writing/ front door. Reuses the essay's own diagram component and the
 * caption it carries in the essay body, so the preview is the work itself
 * rather than a picture of it.
 */
import React from "react";
import { DelayedCorrection } from "../diagrams/OctoberFeedbackDiagrams";
import { MosquitoThreshold } from "../diagrams/RossThreshold";
import { BottleneckMap } from "../diagrams/BottleneckMap";
import { KillChainPhases } from "../diagrams/KillChainPhases";

type EssayPalette = {
  paper: string; ink: string; muted: string; line: string; accent: string;
  mode: "light" | "dark"; accentKey: string;
};

export type FeaturedFigure = {
  /** Terminal title-bar label, as the essay's Figure derives it. */
  file: string;
  caption: string;
  render: (p: EssayPalette) => React.ReactNode;
};

const FIGURES: Record<string, FeaturedFigure> = {
  "october-feedback": {
    file: "a.py",
    caption: "A correction based on the current error, compared with the same correction based on the previous sample. Both start from the same specified history; the signed vertical scale adapts to the trace.",
    render: (p) => <DelayedCorrection palette={p} />,
  },
  "ross-threshold": {
    file: "human.py",
    caption: "Human infection over 600 days, with the eventual equilibrium marked separately. The parameters illustrate the threshold; they are not fitted to a location or an outbreak.",
    render: (p) => <MosquitoThreshold palette={p} />,
  },
  "bluedot-unit1": {
    file: "five.py",
    caption: "Five domains of AI impact, broken down by bottleneck type. The blue fraction is where more intelligence would directly accelerate progress. Hover to read the detail for each domain.",
    render: (p) => <BottleneckMap palette={p} />,
  },
  "bluedot-killchain": {
    file: "five.py",
    caption: "Five phases of a self-reinforcing failure scenario. Click any phase to see the mid-2026 evidence it can fire, the course readings that defend against it, and a defence-strength rating.",
    render: (p) => <KillChainPhases palette={p} />,
  },
};

export function featuredFigureFor(slug: string): FeaturedFigure | undefined {
  return FIGURES[slug];
}
