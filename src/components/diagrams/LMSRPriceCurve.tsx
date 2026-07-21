// @ts-nocheck
import React from 'react';

export function LMSRPriceCurve({ palette: p }) {
  const W = 460, H = 240;
  const b = 100; // liquidity parameter
  const [q, setQ] = React.useState(0);
  const [view, setView] = React.useState("price"); // "price" | "cost"
  const [dragging, setDragging] = React.useState(false);
  const svgRef = React.useRef(null);

  // marginal price (probability of YES) — sigmoid in q
  const price = (q) => 1 / (1 + Math.exp(-q / b));
  // log-cost C(q) = b · ln(e^{q/b} + 1). Normalised by 4b for plot scale.
  const cost = (q) => (b * Math.log(Math.exp(q / b) + 1)) / (4 * b);
  const f = view === "price" ? price : cost;

  const left = 40, right = W - 30, top = 30, bottom = H - 40;
  const qMin = -200, qMax = 400;
  const xToPx = (x) => left + ((x - qMin) / (qMax - qMin)) * (right - left);
  const pxToQ = (px) => qMin + ((px - left) / (right - left)) * (qMax - qMin);
  const yToPx = (y) => bottom - y * (bottom - top);

  const pts = [];
  for (let qi = qMin; qi <= qMax; qi += 5) {
    pts.push(`${qi === qMin ? "M" : "L"} ${xToPx(qi)} ${yToPx(f(qi))}`);
  }

  const onPointer = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    setQ(Math.max(qMin, Math.min(qMax, Math.round(pxToQ(px)))));
  };
  const onDown = (e) => { setDragging(true); onPointer(e); };
  const onMove = (e) => { if (dragging) onPointer(e); };
  const onUp = () => setDragging(false);

  const cursorY = yToPx(f(q));
  const cursorX = xToPx(q);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 6, fontFamily: "var(--f-mono)", fontSize: 10 }}>
        {[["price", "marginal price"], ["cost", "log-cost"]].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)} style={{ all: "unset", cursor: "pointer", padding: "2px 8px", border: `1px solid ${view === id ? p.accent : p.line}`, color: view === id ? p.accent : p.muted, letterSpacing: "0.04em" }}>{label}</button>
        ))}
      </div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 240, cursor: dragging ? "grabbing" : "grab", userSelect: "none", touchAction: "none" }}
           onPointerDown={(e) => { e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId); onDown(e); }}
           onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp} onPointerCancel={onUp}>
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={p.muted} strokeWidth="1" />
        <line x1={left} y1={top} x2={left} y2={bottom} stroke={p.muted} strokeWidth="1" />
        {view === "price" && <line x1={left} y1={yToPx(0.5)} x2={right} y2={yToPx(0.5)} stroke={p.muted} strokeDasharray="3 4" opacity="0.4" />}
        <text x={right} y={bottom + 16} textAnchor="end" fontFamily="var(--f-ui)" fontSize="10" fill={p.muted}>net YES shares (q) →</text>
        <text x={left - 6} y={top - 6} textAnchor="end" fontFamily="var(--f-ui)" fontSize="10" fill={p.muted}>{view === "price" ? "price (probability)" : "log-cost (norm.)"}</text>
        {view === "price" && <text x={left - 6} y={yToPx(0.5) + 4} textAnchor="end" fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>0.5</text>}
        <path d={pts.join(" ")} stroke={p.accent} strokeWidth="2" fill="none" />

        {/* draggable cursor line + marker */}
        <line x1={cursorX} y1={top} x2={cursorX} y2={bottom} stroke={p.ink} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.5" />
        <circle cx={cursorX} cy={cursorY} r="5" fill={p.accent} stroke={p.paper} strokeWidth="1.5" />

        <text x={right - 4} y={top + 14} textAnchor="end" fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>LMSR · b = {b}</text>
        <g fontFamily="var(--f-mono)" fontSize="10">
          <text x={cursorX + 8} y={cursorY - 10} fill={p.ink}>q = {q}</text>
          <text x={cursorX + 8} y={cursorY + 4} fill={p.muted}>{view === "price" ? `p = ${price(q).toFixed(3)}` : `C̃ = ${cost(q).toFixed(3)}`}</text>
        </g>
      </svg>
    </div>
  );
}
