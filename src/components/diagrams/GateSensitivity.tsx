// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function GateSensitivity({ palette: p }) {
  const [thresh, setThresh] = React.useState(0.44); // normalised 0..1
  const [dragging, setDragging] = React.useState(false);
  const svgRef = React.useRef(null);

  // synthetic CD4-like distribution: skewed bimodal
  const bins = React.useMemo(() => {
    let s = 55;
    const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const gauss = (mu, sd) => { const u1 = Math.max(1e-6, rng()), u2 = rng(); return mu + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); };
    const b = new Array(50).fill(0);
    for (let i = 0; i < 800; i++) {
      const v = rng() < 0.68 ? gauss(0.22, 0.09) : gauss(0.62, 0.13);
      const bin = Math.max(0, Math.min(49, Math.floor(v * 50)));
      b[bin]++;
    }
    return b;
  }, []);

  const total = bins.reduce((a, b) => a + b, 0);
  const threshBin = Math.floor(thresh * 50);
  const pos = bins.slice(threshBin).reduce((a, b) => a + b, 0);
  const neg = total - pos;
  const posPct = total > 0 ? (pos / total * 100) : 0;
  const negPct = 100 - posPct;

  const W = 420, H = 250;
  const left = 36, right = W - 10, bottom = 160, top = 20;
  const barW = (right - left) / 50;
  const max = Math.max(...bins);

  const onPointer = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * W;
    const v = (sx - left) / (right - left);
    setThresh(Math.max(0.05, Math.min(0.95, v)));
  };

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 250, cursor: dragging ? "grabbing" : "default", userSelect: "none", touchAction: "none" }}
           onPointerMove={(e) => { if (dragging) onPointer(e); }} onPointerUp={() => setDragging(false)} onPointerLeave={() => setDragging(false)}>
        {bins.map((count, i) => {
          const x = left + i * barW;
          const h = max > 0 ? (count / max) * (bottom - top) : 0;
          const isPos = i >= threshBin;
          return <rect key={i} x={x} y={bottom - h} width={barW - 0.5} height={h} fill={isPos ? p.accent : p.muted} opacity={0.45} style={{ transition: "fill 120ms" }} />;
        })}
        {/* threshold line + drag handle */}
        {(() => {
          const tx = left + thresh * (right - left);
          return (
            <g>
              <line x1={tx} y1={top} x2={tx} y2={bottom} stroke={p.accent} strokeWidth="1.6" strokeDasharray="4 3" />
              <rect x={tx - 14} y={top} width={28} height={bottom - top} fill="transparent" style={{ cursor: "ew-resize", touchAction: "none" }} onPointerDown={(e) => { e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); onPointer(e); }} />
              <circle cx={tx} cy={(top + bottom) / 2} r={6} fill={p.paper} stroke={p.accent} strokeWidth="1.5" pointerEvents="none" />
              <circle cx={tx} cy={(top + bottom) / 2} r={2.5} fill={p.accent} pointerEvents="none" />
              <text x={tx} y={top - 4} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="9" fill={p.accent}>gate = {(thresh * 10).toFixed(2)}</text>
            </g>
          );
        })()}
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={p.muted} strokeWidth="1" />
        <text x={right} y={bottom + 14} textAnchor="end" fontFamily="var(--f-ui)" fontSize="10" fill={p.muted}>CD4 intensity →</text>
        {/* population bars */}
        <rect x={left} y={bottom + 26} width={(right - left) * negPct / 100} height={10} fill={p.muted} opacity={0.5} style={{ transition: "width 120ms" }} />
        <rect x={left + (right - left) * negPct / 100} y={bottom + 26} width={(right - left) * posPct / 100} height={10} fill={p.accent} opacity={0.6} style={{ transition: "all 120ms" }} />
        <text x={left} y={bottom + 50} fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>negative {negPct.toFixed(1)}%</text>
        <text x={right} y={bottom + 50} textAnchor="end" fontFamily="var(--f-mono)" fontSize="9" fill={p.accent}>positive {posPct.toFixed(1)}%</text>
      </svg>
      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.55 }}>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 8 }}>Gate position · drag the line</div>
        <div className="mono" style={{ borderTop: `1px solid ${p.line}`, paddingTop: 10, fontSize: 10, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 8, rowGap: 6, color: p.ink }}>
          <span style={{ color: p.muted }}>gate</span><span>{(thresh * 10).toFixed(2)}</span>
          <span style={{ color: p.muted }}>positive</span><span>{pos} cells · {posPct.toFixed(1)}%</span>
          <span style={{ color: p.muted }}>negative</span><span>{neg} cells · {negPct.toFixed(1)}%</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 10, color: p.muted, lineHeight: 1.5 }}>Drag the gate by half a unit — watch the positive count shift.</div>
      </div>
    </div>
  );
}
