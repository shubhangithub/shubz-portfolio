// @ts-nocheck
import React, { useState, useEffect } from 'react';

const RINGS = [
  {
    r: 155,
    label: "humanity",
    sub: "~8 billion people",
    detail: "The implied beneficiary in the civilisational 'we': 'we will cure most diseases', 'we will end poverty'. These actors are the subject of every prediction but have no seat at the table.",
  },
  {
    r: 112,
    label: "democratic coalition",
    sub: "US + allied governments",
    detail: "The geopolitical 'we' in IFP and Amodei: the coalition of democracies that should leverage AI advantage to set global terms. Real actors; contested mandate.",
  },
  {
    r: 70,
    label: "5–6 frontier labs",
    sub: "Anthropic, OpenAI, Google DeepMind, Meta, xAI…",
    detail: "Where most frontier capability decisions actually get made. The 'we' in 'we're building powerful AI' and 'we believe safety comes first'. Roughly 5 organisations.",
  },
  {
    r: 32,
    label: "~200 decision-makers",
    sub: "executives, researchers, a handful of policymakers",
    detail: "The functional 'we' doing the shaping: the people whose decisions about training runs, deployment timelines, and safety thresholds will determine the trajectory. The room is small.",
  },
];

export function WhoIsWe({ palette: p }) {
  const [active, setActive] = useState(null);
  const [pulse, setPulse] = useState(3);

  useEffect(() => {
    const id = setInterval(() => {
      setPulse(v => (v + 3) % (RINGS.length * 4) < 4 ? Math.floor((v + 1) % RINGS.length) : (v + 1) % (RINGS.length * 4));
    }, 900);
    return () => clearInterval(id);
  }, []);

  // simpler pulse: just cycle through ring indices
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep(v => (v + 1) % RINGS.length), 1100);
    return () => clearInterval(id);
  }, []);

  const hov = active !== null ? RINGS[active] : RINGS[step];
  const W = 340, H = 340, cx = W / 2, cy = H / 2;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.8rem", alignItems: "start" }}>
      {/* concentric circles */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 340, height: "auto" }}>
        {RINGS.map((ring, i) => {
          const isActive = active === i;
          const isPulse = active === null && step === i;
          const lit = isActive || isPulse;
          return (
            <g key={ring.label}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={cx} cy={cy} r={ring.r}
                fill={p.accent}
                fillOpacity={lit ? 0.12 : 0.04}
                stroke={p.accent}
                strokeWidth={lit ? 1.5 : 0.8}
                strokeOpacity={lit ? 0.75 : 0.25}
                style={{ transition: "fill-opacity 350ms, stroke-opacity 350ms, stroke-width 300ms" }}
              />
              <text
                x={cx} y={cy - ring.r + 14}
                textAnchor="middle"
                fontFamily="var(--f-mono)" fontSize="9"
                fill={lit ? p.ink : p.muted}
                style={{ transition: "fill 300ms", pointerEvents: "none" }}
              >{ring.label}</text>
            </g>
          );
        })}
        {/* centre label */}
        <text x={cx} y={cy - 5} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="9" fill={p.muted} style={{ pointerEvents: "none" }}>who is</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="14" fill={p.accent} style={{ pointerEvents: "none" }}>"we"?</text>
      </svg>

      {/* detail */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <div style={{
          fontFamily: "var(--f-ui)", fontSize: 11, lineHeight: 1.58,
          color: p.ink,
          padding: "0.6rem 0.7rem",
          border: `1px solid ${p.line}`,
          background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`,
          borderRadius: 3,
          minHeight: 90,
        }}>
          <strong style={{ color: p.accent, display: "block", marginBottom: 3 }}>{hov.label}</strong>
          <span style={{ fontSize: 10, color: p.muted, display: "block", marginBottom: 6 }}>{hov.sub}</span>
          {hov.detail}
        </div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: p.muted }}>
          {active !== null ? "hover to explore" : "cycling — hover to pause"}
        </div>
      </div>
    </div>
  );
}
