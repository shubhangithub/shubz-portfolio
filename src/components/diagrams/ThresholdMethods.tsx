// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function ThresholdMethods({ palette: p }) {
  const markers = [
    { id: "cd66b", label: "CD66b", shape: "bimodal", valley: 0.42 },
    { id: "cd4",   label: "CD4",   shape: "skew-right", valley: 0.38 },
    { id: "cd8",   label: "CD8",   shape: "bimodal-wide", valley: 0.44 },
    { id: "ctla4", label: "CTLA-4", shape: "flat", valley: 0.35 },
    { id: "cd56",  label: "CD56",  shape: "right-tail", valley: 0.40 },
    { id: "cd20",  label: "CD20",  shape: "sharp-peak", valley: 0.30 },
  ];
  const methods = [
    { id: "pathologist", label: "Pathologist", color: p.ink, dash: "" },
    { id: "otsu",    label: "Otsu",    color: p.accent, dash: "" },
    { id: "isodata", label: "IsoData", color: "#5B7A4F", dash: "" },
    { id: "gmm",     label: "GMM",     color: "#8B5A89", dash: "4 3" },
  ];
  const [activeMarker, setActiveMarker] = React.useState("cd66b");
  const [hover, setHover] = React.useState(null);

  // seeded PRNG for reproducible synthetic histograms
  const histData = React.useMemo(() => {
    const out = {};
    markers.forEach(mk => {
      let s = mk.id.charCodeAt(0) * 137 + 31;
      const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      // box-muller helper
      const gauss = (mu, sd) => { const u1 = Math.max(1e-6, rng()), u2 = rng(); return mu + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); };
      const bins = new Array(40).fill(0);
      const N = 600;
      for (let i = 0; i < N; i++) {
        let v;
        if (mk.shape === "bimodal") { v = rng() < 0.65 ? gauss(0.22, 0.09) : gauss(0.68, 0.11); }
        else if (mk.shape === "bimodal-wide") { v = rng() < 0.55 ? gauss(0.25, 0.12) : gauss(0.72, 0.14); }
        else if (mk.shape === "skew-right") { v = rng() < 0.70 ? gauss(0.20, 0.08) : gauss(0.60, 0.15); }
        else if (mk.shape === "flat") { v = gauss(0.38, 0.22); }
        else if (mk.shape === "right-tail") { v = rng() < 0.78 ? gauss(0.18, 0.07) : gauss(0.65, 0.18); }
        else { v = rng() < 0.82 ? gauss(0.15, 0.06) : gauss(0.55, 0.10); }
        const bin = Math.max(0, Math.min(39, Math.floor(v * 40)));
        bins[bin]++;
      }
      // method thresholds (synthetic, plausible, NOT real)
      const base = mk.valley;
      const spread = mk.shape === "flat" ? 0.12 : 0.04;
      out[mk.id] = {
        bins, max: Math.max(...bins),
        thresholds: {
          pathologist: base,
          otsu: base + (mk.shape === "flat" ? -0.08 : 0.01),
          isodata: base + (mk.shape === "flat" ? 0.05 : -0.01),
          gmm: base + (mk.shape === "flat" ? 0.10 : 0.02),
        },
      };
    });
    return out;
  }, []);

  const mk = markers.find(m => m.id === activeMarker);
  const hd = histData[activeMarker];
  const W = 420, H = 220;
  const left = 30, right = W - 10, bottom = H - 30, top = 16;
  const barW = (right - left) / 40;

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <div>
        <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
          {markers.map(m => (
            <button key={m.id} onClick={() => setActiveMarker(m.id)} style={{ all: "unset", cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 10, padding: "2px 8px", border: `1px solid ${activeMarker === m.id ? p.accent : p.line}`, color: activeMarker === m.id ? p.accent : p.muted, letterSpacing: "0.04em", transition: "all 240ms var(--ease-out)" }}>{m.label}</button>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 220 }}>
          {hd.bins.map((count, i) => {
            const x = left + i * barW;
            const h = hd.max > 0 ? (count / hd.max) * (bottom - top) : 0;
            return <rect key={i} x={x} y={bottom - h} width={barW - 1} height={h} fill={p.muted} opacity={0.3} />;
          })}
          {methods.map(m => {
            const tx = hd.thresholds[m.id];
            const px = left + tx * (right - left);
            const isHov = hover === m.id;
            return (
              <g key={m.id} onMouseEnter={() => setHover(m.id)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
                <line x1={px} y1={top} x2={px} y2={bottom} stroke={m.color} strokeWidth={isHov ? 2.4 : 1.4} strokeDasharray={m.dash} opacity={isHov ? 1 : 0.7} style={{ transition: "all 240ms var(--ease-out)" }} />
                <text x={px} y={top - 3} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="8" fill={m.color} opacity={isHov ? 1 : 0.6}>{m.id === "pathologist" ? "PATH" : m.id.toUpperCase()}</text>
              </g>
            );
          })}
          <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={p.muted} strokeWidth="1" />
          <text x={right} y={bottom + 16} textAnchor="end" fontFamily="var(--f-ui)" fontSize="10" fill={p.muted}>intensity →</text>
          <text x={left} y={bottom + 16} fontFamily="var(--f-ui)" fontSize="10" fill={p.muted}>0</text>
        </svg>
      </div>
      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.55 }}>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 8 }}>Methods · hover to highlight</div>
        {methods.map(m => (
          <div key={m.id} onMouseEnter={() => setHover(m.id)} onMouseLeave={() => setHover(null)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", cursor: "pointer", color: hover === m.id ? m.color : p.ink, transition: "color 240ms var(--ease-out)" }}>
            <span style={{ width: 16, height: 2, background: m.color, display: "inline-block", opacity: hover === m.id ? 1 : 0.6 }} />
            <span style={{ fontSize: 11 }}>{m.label}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, fontSize: 10, color: p.muted, lineHeight: 1.5 }}>
          {mk.shape === "flat"
            ? "CTLA-4: no valley. The methods scatter — each guesses differently."
            : mk.shape === "bimodal"
            ? "Clean bimodal valley. All methods converge within a narrow band."
            : "Methods agree roughly, but small differences shift populations."}
        </div>
      </div>
    </div>
  );
}
