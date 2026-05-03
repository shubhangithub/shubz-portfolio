// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function ConstraintEffect({ palette: p }) {
  const [view, setView] = React.useState("before"); // "before" | "after"
  // synthetic 2-D scatter: cells with cluster assignments
  const cells = React.useMemo(() => {
    let s = 33;
    const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const gauss = (mu, sd) => { const u1 = Math.max(1e-6, rng()), u2 = rng(); return mu + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); };
    const out = [];
    // cluster 0: "no marker" — tight, bottom-left
    for (let i = 0; i < 40; i++) out.push({ x: gauss(0.18, 0.05), y: gauss(0.18, 0.05), before: 0, after: 0 });
    // cluster 1: CD4+ — mid-left
    for (let i = 0; i < 25; i++) out.push({ x: gauss(0.35, 0.06), y: gauss(0.55, 0.07), before: 1, after: 1 });
    // cluster 2: CD8+ — mid-right
    for (let i = 0; i < 22; i++) out.push({ x: gauss(0.65, 0.06), y: gauss(0.50, 0.07), before: 2, after: 2 });
    // cluster 3: CD66b — top-right
    for (let i = 0; i < 18; i++) out.push({ x: gauss(0.75, 0.05), y: gauss(0.80, 0.05), before: 3, after: 3 });
    // "violation" cells — before: wrongly merged with cluster 1; after: correctly split out
    for (let i = 0; i < 8; i++) out.push({ x: gauss(0.42, 0.04), y: gauss(0.70, 0.05), before: 1, after: 4 });
    // outlier cells — before: in cluster 0; after: reassigned or flagged
    for (let i = 0; i < 5; i++) out.push({ x: gauss(0.50, 0.08), y: gauss(0.22, 0.04), before: 0, after: 5 });
    return out;
  }, []);

  const clusterColors = [p.muted, "#5B7A4F", p.accent, "#C68A4F", "#C2452A", "#4F7A8B"];
  const clusterLabels = ["no marker", "CD4+", "CD8+", "CD66b", "violation (split)", "outlier (flagged)"];
  const W = 360, H = 280;
  const px = (v) => 30 + v * (W - 50);
  const py = (v) => H - 30 - v * (H - 50);

  const activeClusters = view === "before" ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5];

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, fontFamily: "var(--f-mono)", fontSize: 10 }}>
          {[["before", "standard"], ["after", "constraint-aware"]].map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} style={{ all: "unset", cursor: "pointer", padding: "2px 8px", border: `1px solid ${view === id ? p.accent : p.line}`, color: view === id ? p.accent : p.muted, letterSpacing: "0.04em" }}>{label}</button>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 260 }}>
          {cells.map((c, i) => {
            const k = view === "before" ? c.before : c.after;
            const isViolation = view === "after" && (k === 4 || k === 5);
            return (
              <circle key={i} cx={px(c.x)} cy={py(c.y)} r={isViolation ? 4 : 3} fill={clusterColors[k]} opacity={0.8} stroke={isViolation ? p.ink : "none"} strokeWidth={isViolation ? 0.8 : 0} style={{ transition: "all 300ms var(--ease-out)" }} />
            );
          })}
          {view === "before" && (
            <g>
              <ellipse cx={px(0.38)} cy={py(0.60)} rx={55} ry={45} fill="none" stroke="#C2452A" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.6" />
              <text x={px(0.38) + 58} y={py(0.60)} fontFamily="var(--f-mono)" fontSize="8" fill="#C2452A">violation?</text>
            </g>
          )}
          <text x={px(0)} y={H - 6} fontFamily="var(--f-ui)" fontSize="9" fill={p.muted}>UMAP dimension 1 →</text>
        </svg>
      </div>
      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.55 }}>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 8 }}>Clusters · toggle view</div>
        {activeClusters.map(k => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: clusterColors[k], flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: p.ink }}>{clusterLabels[k]}</span>
          </div>
        ))}
        <div style={{ marginTop: 10, fontSize: 10, color: p.muted, lineHeight: 1.5 }}>
          {view === "before"
            ? "Standard clustering merges biologically impossible cells into the CD4+ group. The dashed ring marks the violations."
            : "Constraint-aware clustering splits violations out and flags outliers. The biology is respected."}
        </div>
      </div>
    </div>
  );
}
