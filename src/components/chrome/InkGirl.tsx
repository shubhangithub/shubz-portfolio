// @ts-nocheck
/**
 * InkGirl.tsx — the site's narrator (DESIGN-v6.md §1): the author's
 * self-portrait in her own margins. Pure stroke SVG, drawn in the site's ink
 * with one pen-colour accent (her notebook), so she reads as sketched by the
 * same hand as everything else.
 *
 * Poses: "stand" (holding her notebook), "wave", and "walk" (two-frame
 * cycle — groundwork for the /work walk in phase 4). Every path sets
 * pathLength=1 so the v6-inkdraw grammar can draw her in stroke by stroke;
 * the wrapper carries v6-idle for a barely-there breathing sway. Replaceable
 * later by hand-drawn Procreate frames without changing the call sites.
 */
import React from "react";

type Pose = "stand" | "wave" | "walk";

const STROKE = 2.1;

function P({ d, c, w = STROKE, delay = 0 }: { d: string; c: string; w?: number; delay?: number }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={c}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      style={{ ["--v6-path-delay" as any]: `${delay}ms` }}
    />
  );
}

export function InkGirl({
  t,
  pose = "stand",
  height = 110,
  accent,
  title = "the author, in the margin",
  style,
}: {
  t: any;
  pose?: Pose;
  height?: number;
  /** Pen colour for the notebook she carries. Defaults to outreach orange. */
  accent?: string;
  title?: string;
  style?: React.CSSProperties;
}) {
  const ink = t.ink;
  const soft = t.softInk;
  const a = accent || t.orange;
  const walking = pose === "walk";

  return (
    <span
      className={`v6-idle${walking ? " v6-walk" : ""}`}
      data-reveal="inkdraw"
      style={{ display: "inline-block", lineHeight: 0, ...style }}
    >
      <svg
        viewBox="0 0 90 182"
        height={height}
        role="img"
        aria-label={title}
        style={{ display: "block", overflow: "visible" }}
      >
        <title>{title}</title>

        {/* hair — dark wavy bob with a side part and outward flicks at the
            jaw, drawn FILLED so it reads at margin scale (the identity
            feature, from the portrait at /contact-portrait.jpg) */}
        <path
          fill={ink}
          stroke="none"
          d="M 52 9
             C 43 8.5, 36.5 15, 37 24
             C 37.4 32, 40 38.5, 44.5 42.5
             C 46 43.8, 43.6 45.6, 41.6 44.8
             C 47.5 46.2, 50.2 43, 49.3 39.5
             C 47.9 33.5, 47.8 28.9, 49 24.5
             C 51.5 21.8, 56.5 20.8, 60 21.8
             C 60.8 27, 60.4 33, 58.2 38.6
             C 57.4 40.8, 59.2 42.8, 61.4 42.4
             C 63.8 41.9, 66.2 39.4, 67.2 34.5
             C 68.6 28, 68 17.5, 63.5 12.5
             C 60.5 9.5, 56.5 8.8, 52 9 Z"
        />
        {/* face — chin and jaw in the hair's opening */}
        <P c={ink} w={1.7} delay={60} d="M 49.6 26 C 49.9 31.5, 51.5 36.2, 54.8 38.2 C 56.8 39.3, 58.6 39, 59.8 37.8" />

        {/* turtleneck — collar band under the jaw */}
        <P c={ink} delay={140} d="M 48.5 43 C 52 45, 56 45, 59.5 43" />
        <P c={ink} delay={170} d="M 48 47 C 52 49, 56.5 49, 60 47" />

        {/* shoulders — a touch wider, she's not a bobblehead */}
        <P c={ink} delay={210} d="M 39 51.5 C 46 47, 60 47, 66.5 51.5" />

        {/* torso — fitted top to the hip */}
        <P c={ink} delay={250} d="M 39 51.5 C 38 63.5, 38.5 75.5, 40 86" />
        <P c={ink} delay={280} d="M 66.5 51.5 C 67.5 63.5, 67 75.5, 65.5 86" />
        <P c={ink} delay={310} d="M 40 86 C 48 88.5, 58 88.5, 65.5 86" />

        {/* notebook at her chest, in pen colour — the site itself */}
        <P c={a} delay={380} d="M 38.5 61 L 57 64.5 L 55 78 L 36.5 74.5 Z" />
        <P c={a} w={1.3} delay={440} d="M 47.5 62.8 L 45.6 76.2" />

        {/* arm holding the notebook (from the far shoulder) */}
        <P c={ink} delay={350} d="M 64.5 54.5 C 66 61.5, 62 68, 54 69.5" />

        {/* near arm — pose-dependent */}
        {pose === "wave" ? (
          <>
            <P c={ink} delay={400} d="M 41 54.5 C 33.5 49, 26 40.5, 21.5 28" />
            <P c={ink} delay={480} d="M 21.5 28 L 17 24 M 21.5 28 L 23.5 21.5 M 21.5 28 L 27.5 24.5" />
          </>
        ) : (
          <P c={ink} delay={400} d="M 41 54.5 C 38.5 64.5, 38 74, 39.5 83.5" />
        )}

        {/* trousers + shoes — stance wide enough to survive small scale */}
        {walking ? (
          <>
            <g className="v6-legA">
              <P c={ink} delay={460} d="M 56 88 C 60.5 112.5, 65 138, 70.5 162 L 79 165.5" />
              <P c={ink} delay={500} d="M 49.5 88 C 45.5 112.5, 41 138, 36 160 L 42.5 164.5" />
            </g>
            <g className="v6-legB">
              <P c={ink} delay={460} d="M 54 88 C 54.5 113.5, 55 140, 55.5 164.5 L 64 167.5" />
              <P c={ink} delay={500} d="M 50 88 C 49 111.5, 48.5 132, 48 152.5 L 54 157" />
            </g>
          </>
        ) : (
          <>
            <P c={ink} delay={460} d="M 45 88 C 44.5 114, 44.5 141, 45 166 L 53.5 169.5" />
            <P c={ink} delay={500} d="M 61 88 C 61.5 114, 61.5 141, 61 166 L 69.5 169.5" />
          </>
        )}

        {/* ground — a single confident stroke she stands on */}
        <P c={soft} w={1.3} delay={620} d="M 26 173.5 C 44 175.5, 62 175.5, 82 173.5" />
      </svg>
    </span>
  );
}
