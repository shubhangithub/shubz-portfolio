// @ts-nocheck
import React, { useState } from 'react';

const READINGS = [
  {
    id: "rand",
    label: "RAND",
    x: -0.50, y: 0.05,
    cluster: "risk",
    thesis: "MAIM is both infeasible and strategically destabilising — preventive AI sabotage would heighten rather than reduce great-power instability.",
  },
  {
    id: "vox",
    label: "Vox · Samuel",
    x: -0.72, y: -0.52,
    cluster: "risk",
    thesis: "Market incentives in frontier AI are structurally incompatible with self-imposed safety commitments; government — not corporate governance — must do the regulatory work.",
  },
  {
    id: "toner",
    label: "Toner",
    x: -0.22, y: 0.25,
    cluster: "framing",
    thesis: "Safe superhuman AI requires a dynamist endgame — decentralised, plural, messy — not a stasist one of permanent global control.",
  },
  {
    id: "bregman",
    label: "Bregman",
    x: -0.10, y: 0.52,
    cluster: "framing",
    thesis: "Material progress has succeeded so completely that affluent societies have lost the ability to imagine a substantively better future.",
  },
  {
    id: "solarpunk",
    label: "Solarpunk",
    x: 0.18, y: 0.78,
    cluster: "framing",
    thesis: "A genre of regenerative, decentralised, hope-based futures is more useful for confronting technological crises than dystopian cynicism.",
  },
  {
    id: "ifp",
    label: "IFP",
    x: 0.55, y: 0.65,
    cluster: "shaping",
    thesis: "The right response to AI risk is to shape which capabilities are built first, using US leverage over compute supply chains and R&D priorities.",
  },
  {
    id: "amodei",
    label: "Amodei",
    x: 0.72, y: 0.88,
    cluster: "shaping",
    thesis: "If alignment is solved, powerful AI compresses 50–100 years of biological and developmental progress into 5–10, producing a future radical enough to move people to tears.",
  },
  {
    id: "altman_gs",
    label: "Altman · GS",
    x: 0.84, y: 0.93,
    cluster: "inevitable",
    thesis: "Superintelligence is already arriving gradually; the transition doesn't feel weird because it's continuous. Solve alignment, then ensure cheap and widely-distributed access.",
  },
  {
    id: "altman_ia",
    label: "Altman · IA",
    x: 0.79, y: 0.85,
    cluster: "inevitable",
    thesis: "Deep learning worked and scaling carries us to superintelligence within a few thousand days. The binding constraints are compute, energy, and human will.",
  },
];

const CLUSTER_COLORS = {
  risk:      "#B04040",
  framing:   "#4F7A50",
  shaping:   "#3A5AA8",
  inevitable:"#7A4F8A",
};

const CLUSTER_LABELS = {
  risk:      "risk & restraint",
  framing:   "framing",
  shaping:   "shaping",
  inevitable:"inevitability",
};

export function ReadingCluster({ palette: p }) {
  const [hovered, setHovered] = useState(null);

  const W = 520, H = 400, PAD = 52;
  const toX = (v) => PAD + ((v + 1) / 2) * (W - 2 * PAD);
  const toY = (v) => (H - PAD) - ((v + 1) / 2) * (H - 2 * PAD);

  const hov = READINGS.find(r => r.id === hovered);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem", alignItems: "start" }}>
      {/* scatter */}
      <div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
          {/* grid lines */}
          <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke={p.line} strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
          <line x1={W / 2} y1={PAD} x2={W / 2} y2={H - PAD} stroke={p.line} strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />

          {/* axis labels */}
          <text x={PAD + 2} y={H / 2 - 6} fontFamily="var(--f-mono)" fontSize="8.5" fill={p.muted}>← structural diagnosis</text>
          <text x={W - PAD - 2} y={H / 2 - 6} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8.5" fill={p.muted}>prescriptive vision →</text>
          <text x={W / 2 + 5} y={PAD + 10} fontFamily="var(--f-mono)" fontSize="8.5" fill={p.muted}>↑ upside-first</text>
          <text x={W / 2 + 5} y={H - PAD - 4} fontFamily="var(--f-mono)" fontSize="8.5" fill={p.muted}>↓ risk-first</text>

          {/* cluster region fills */}
          <rect x={PAD} y={H / 2} width={W / 2 - PAD} height={H / 2 - PAD} fill={CLUSTER_COLORS.risk} fillOpacity="0.07" rx="3" />
          <text x={PAD + 7} y={H - PAD - 7} fontFamily="var(--f-ui)" fontSize="9" fill={CLUSTER_COLORS.risk}>risk & restraint</text>
          <rect x={W / 2} y={PAD} width={W / 2 - PAD} height={H / 2 - PAD} fill={CLUSTER_COLORS.shaping} fillOpacity="0.06" rx="3" />
          <text x={W - PAD - 7} y={PAD + 14} textAnchor="end" fontFamily="var(--f-ui)" fontSize="9" fill={CLUSTER_COLORS.shaping}>shaping / inevitability</text>
          <rect x={PAD} y={PAD} width={W / 2 - PAD} height={H / 2 - PAD} fill={CLUSTER_COLORS.framing} fillOpacity="0.055" rx="3" />
          <text x={PAD + 7} y={PAD + 14} fontFamily="var(--f-ui)" fontSize="9" fill={CLUSTER_COLORS.framing}>framing</text>

          {/* readings */}
          {READINGS.map(r => {
            const cx = toX(r.x);
            const cy = toY(r.y);
            const isHov = r.id === hovered;
            const col = CLUSTER_COLORS[r.cluster];
            return (
              <g key={r.id}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={cx} cy={cy}
                  r={isHov ? 9 : 6.5}
                  fill={col}
                  fillOpacity={isHov ? 0.80 : 0.32}
                  stroke={col}
                  strokeWidth={isHov ? 1.5 : 0.9}
                  style={{ transition: "r 200ms var(--ease-out), fill-opacity 200ms" }}
                />
                <text
                  x={cx} y={cy - 11}
                  textAnchor="middle"
                  fontFamily="var(--f-ui)" fontSize="9"
                  fill={isHov ? col : p.muted}
                  fontWeight={isHov ? "600" : "400"}
                  style={{ transition: "fill 200ms" }}
                >{r.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* detail panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        <div style={{
          minHeight: 80, fontFamily: "var(--f-ui)", fontSize: 11, lineHeight: 1.55,
          color: hov ? p.ink : p.muted,
          padding: "0.6rem 0.7rem",
          border: `1px solid ${p.line}`,
          background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`,
          borderRadius: 3,
          transition: "color 180ms",
        }}>
          {hov
            ? <><strong style={{ color: CLUSTER_COLORS[hov.cluster], display: "block", marginBottom: 4 }}>{hov.label}</strong>{hov.thesis}</>
            : "Hover a reading to see its core thesis."
          }
        </div>

        {/* legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(CLUSTER_LABELS).map(([k, label]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--f-ui)", fontSize: 10, color: p.muted }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: CLUSTER_COLORS[k], opacity: 0.7, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
