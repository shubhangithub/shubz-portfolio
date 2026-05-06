// @ts-nocheck
import React, { useState, useEffect } from 'react';

const TAU = Math.PI * 2;

export function SpiderFusion({ palette: p }) {
  const [alpha, setAlpha] = useState(Math.PI / 3);
  const [beta, setBeta]   = useState(Math.PI / 2);
  const [fused, setFused] = useState(false);
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    if (!fused) { setAnimPct(0); return; }
    let frame;
    let start = null;
    const dur = 480;
    const step = (ts) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / dur);
      // ease-out cubic
      setAnimPct(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [fused]);

  const W = 480, H = 180;
  const midY = H / 2;

  // Positions: left spider, middle wire, right spider
  // After fusion they converge to centre
  const FUSE_X = W / 2;
  const lx = fused ? FUSE_X : W * 0.28;
  const rx = fused ? FUSE_X : W * 0.72;

  // animated positions
  const lxA = W * 0.28 + (FUSE_X - W * 0.28) * animPct;
  const rxA = W * 0.72 + (FUSE_X - W * 0.72) * animPct;
  const midOpacity = 1 - animPct;

  const phaseLabel = (a) => {
    if (Math.abs(a) < 0.01) return "0";
    if (Math.abs(a - Math.PI) < 0.01) return "π";
    if (Math.abs(a - Math.PI / 2) < 0.01) return "π/2";
    if (Math.abs(a - Math.PI / 3) < 0.02) return "π/3";
    if (Math.abs(a - TAU / 3) < 0.02) return "2π/3";
    return `${(a / Math.PI).toFixed(2)}π`;
  };

  const sumPhase = (alpha + beta) % TAU;

  const btnStyle = (active) => ({
    all: "unset", cursor: "pointer",
    padding: "4px 12px",
    fontFamily: "var(--f-mono)", fontSize: 10,
    border: `1px solid ${active ? p.accent : p.line}`,
    color: active ? p.accent : p.muted,
    borderRadius: 2,
    transition: "all 200ms",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {/* left input wire */}
        <line x1={0} y1={midY} x2={lxA - 18} y2={midY} stroke={p.ink} strokeWidth="1.5" opacity="0.5" />
        {/* middle connecting wire — fades on fusion */}
        <line x1={lxA + 18} y1={midY} x2={rxA - 18} y2={midY}
          stroke={p.ink} strokeWidth="1.5" opacity={midOpacity * 0.5} />
        {/* right output wire */}
        <line x1={rxA + 18} y1={midY} x2={W} y2={midY} stroke={p.ink} strokeWidth="1.5" opacity="0.5" />

        {/* left Z-spider (green) */}
        <circle cx={lxA} cy={midY} r={18} fill="#4A7A50" fillOpacity={0.85} stroke="#4A7A50" strokeWidth="1.5" />
        <text x={lxA} y={midY + 1} textAnchor="middle" dominantBaseline="middle"
          fontFamily="var(--f-mono)" fontSize="10" fill="white">{phaseLabel(alpha)}</text>

        {/* right Z-spider — fades out on fusion */}
        <circle cx={rxA} cy={midY} r={18} fill="#4A7A50" fillOpacity={0.85 * midOpacity} stroke="#4A7A50" strokeWidth="1.5" opacity={midOpacity} />
        <text x={rxA} y={midY + 1} textAnchor="middle" dominantBaseline="middle"
          fontFamily="var(--f-mono)" fontSize="10" fill="white" opacity={midOpacity}>{phaseLabel(beta)}</text>

        {/* fused result label */}
        {fused && animPct > 0.6 && (
          <text x={FUSE_X} y={midY + 34} textAnchor="middle"
            fontFamily="var(--f-mono)" fontSize="10" fill={p.muted} opacity={(animPct - 0.6) / 0.4}>
            {phaseLabel(alpha)} + {phaseLabel(beta)} = {phaseLabel(sumPhase)}
          </text>
        )}

        {/* labels when not fused */}
        {!fused && (
          <>
            <text x={lxA} y={midY + 32} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>α = {phaseLabel(alpha)}</text>
            <text x={rxA} y={midY + 32} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>β = {phaseLabel(beta)}</text>
            <text x={W / 2} y={midY - 28} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="9" fill={p.muted}>connecting wire</text>
            <line x1={W / 2} y1={midY - 20} x2={W / 2} y2={midY - 6} stroke={p.muted} strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
          </>
        )}
      </svg>

      {/* sliders */}
      {!fused && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: p.muted, marginBottom: 4 }}>
              α = {phaseLabel(alpha)}
            </div>
            <input type="range" min={0} max={TAU} step={0.05} value={alpha}
              onChange={e => setAlpha(+e.target.value)}
              style={{ width: "100%", accentColor: "#4A7A50" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: p.muted, marginBottom: 4 }}>
              β = {phaseLabel(beta)}
            </div>
            <input type="range" min={0} max={TAU} step={0.05} value={beta}
              onChange={e => setBeta(+e.target.value)}
              style={{ width: "100%", accentColor: "#4A7A50" }} />
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <button style={btnStyle(!fused)} onClick={() => { setFused(false); }}>separate</button>
        <button style={btnStyle(fused)} onClick={() => { setFused(true); }}>fuse →</button>
        <span style={{ fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, marginLeft: 8 }}>
          {fused
            ? `two Z-spiders with phases α+β fuse into one — phases add`
            : `drag the sliders, then fuse`}
        </span>
      </div>
    </div>
  );
}
