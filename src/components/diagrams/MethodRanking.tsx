// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function MethodRanking({ palette: p }) {
  const [hover, setHover] = React.useState(null);
  const methods = [
    { id: "agg",      label: "Agglomerative",  score: 0.82, note: "Simple hierarchy. Best overall — no constraints needed.", color: "#5B7A4F" },
    { id: "ours",     label: "Our approach",    score: 0.74, note: "Constraint-aware spectral. Beat most, not the simplest.", color: p.accent },
    { id: "spectral", label: "Spectral",        score: 0.66, note: "Good at non-convex shapes. Sensitive to kernel tuning.", color: "#8B5A89" },
    { id: "birch",    label: "BIRCH",           score: 0.62, note: "Fast. Tends to over-split in marker space.", color: "#C68A4F" },
    { id: "kmeans",   label: "KMeans",          score: 0.55, note: "Assumes spherical clusters. Immune data is not spherical.", color: "#4F7A8B" },
    { id: "meanshift",label: "Mean-Shift",      score: 0.48, note: "Bandwidth-sensitive. Missed small populations.", color: p.muted },
    { id: "hdbscan",  label: "HDBSCAN",         score: 0.40, note: "Density-based. Labelled too many cells as noise.", color: p.muted },
  ];
  const W = 460, H = 240;
  const left = 140, right = W - 30, top = 20, rowH = 28;

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 240 }}>
        <text x={left - 4} y={14} textAnchor="end" fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>method</text>
        <text x={right} y={14} textAnchor="end" fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>relative performance →</text>
        <line x1={left} y1={top} x2={left} y2={top + methods.length * rowH} stroke={p.line} strokeWidth="0.5" />
        {methods.map((m, i) => {
          const y = top + i * rowH + rowH / 2;
          const barEnd = left + m.score * (right - left);
          const isHov = hover === m.id;
          const isOurs = m.id === "ours";
          return (
            <g key={m.id} onMouseEnter={() => setHover(m.id)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
              <text x={left - 8} y={y + 4} textAnchor="end" fontFamily="var(--f-ui)" fontSize={isOurs ? 11 : 10} fill={isHov ? m.color : isOurs ? p.accent : p.ink} fontWeight={isOurs ? 600 : 400} style={{ transition: "fill 240ms" }}>{m.label}</text>
              <line x1={left} y1={y} x2={barEnd} y2={y} stroke={m.color} strokeWidth={isHov || isOurs ? 3 : 2} strokeLinecap="round" opacity={isHov ? 1 : 0.7} style={{ transition: "all 240ms var(--ease-out)" }} />
              <circle cx={barEnd} cy={y} r={isHov || isOurs ? 5 : 3.5} fill={m.color} opacity={isHov ? 1 : 0.85} style={{ transition: "all 240ms var(--ease-out)" }} />
            </g>
          );
        })}
      </svg>
      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.55 }}>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 8 }}>Ranking · hover for detail</div>
        <div style={{ minHeight: 60, fontSize: 11, color: hover ? p.ink : p.muted, transition: "color 200ms", lineHeight: 1.5 }}>
          {hover ? methods.find(m => m.id === hover).note : "Hover a method to see what it got right — and what it missed."}
        </div>
        <div style={{ marginTop: 10, fontSize: 10, color: p.muted, lineHeight: 1.5 }}>Scale is relative, not absolute. Our method sits second — ahead of the textbooks, behind the simplest hierarchy.</div>
      </div>
    </div>
  );
}
