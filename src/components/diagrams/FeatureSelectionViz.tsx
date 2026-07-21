// @ts-nocheck
import React from 'react';

export function FeatureSelectionViz({ palette: p }) {
  const [running, setRunning] = React.useState(true);
  const [gen, setGen] = React.useState(0);
  const [tradeOff, setTradeOff] = React.useState(0.55); // slope of trade-off line
  const [dragging, setDragging] = React.useState(false);
  const svgRef = React.useRef(null);

  // seeded population: subset-size (x) vs accuracy (y)
  const [pop, setPop] = React.useState(null);
  const [seed, setSeed] = React.useState(1);

  React.useEffect(() => {
    let s = seed * 7919 + 13;
    const r = () => { s = (s * 1103515245 + 12345) % 2147483647; return s / 2147483647; };
    const next = Array.from({ length: 36 }, () => ({
      x: 0.1 + r() * 0.85, // subset fraction 0.1..0.95
      y: 0.2 + r() * 0.7,  // accuracy 0.2..0.9
    }));
    setPop(next);
    setGen(0);
  }, [seed]);

  // Pareto-optimal direction: move toward lower x (smaller subset) and higher y (better accuracy)
  React.useEffect(() => {
    if (!running || !pop) return;
    const id = setInterval(() => {
      setPop(prev => {
        if (!prev) return prev;
        return prev.map(c => {
          // nudge toward the Pareto front: lower-left → upper-left
          const target = { x: 0.08 + Math.random() * 0.15, y: 0.75 + Math.random() * 0.18 };
          const nx = c.x + (target.x - c.x) * (0.03 + Math.random() * 0.04);
          const ny = c.y + (target.y - c.y) * (0.03 + Math.random() * 0.04);
          // add noise so they don't all converge to one point
          return {
            x: Math.max(0.05, Math.min(0.95, nx + (Math.random() - 0.5) * 0.02)),
            y: Math.max(0.15, Math.min(0.95, ny + (Math.random() - 0.5) * 0.02)),
          };
        });
      });
      setGen(g => g + 1);
    }, 90);
    return () => clearInterval(id);
  }, [running, pop]);

  const W = 380, H = 280;
  const left = 44, right = W - 14, top = 16, bottom = H - 30;
  const px = (v) => left + v * (right - left);
  const py = (v) => bottom - v * (bottom - top);

  // trade-off line: y = tradeOff + slope * (1 - x)  — points ABOVE survive
  const lineY = (x) => tradeOff * 0.6 + (1 - x) * tradeOff * 0.7;
  const survives = (c) => c.y > lineY(c.x);
  const surviving = pop ? pop.filter(survives).length : 0;

  const onPointer = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const sy = ((e.clientY - rect.top) / rect.height) * H;
    const v = 1 - (sy - top) / (bottom - top);
    setTradeOff(Math.max(0.2, Math.min(0.9, v)));
  };

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 260, cursor: dragging ? "grabbing" : "default", userSelect: "none", touchAction: "none" }}
           onPointerMove={(e) => { if (dragging) onPointer(e); }} onPointerUp={() => setDragging(false)} onPointerLeave={() => setDragging(false)}>
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={p.muted} strokeWidth="1" />
        <line x1={left} y1={top} x2={left} y2={bottom} stroke={p.muted} strokeWidth="1" />
        <text x={right} y={bottom + 16} textAnchor="end" fontFamily="var(--f-ui)" fontSize="10" fill={p.muted}>subset size →</text>
        <text x={left - 6} y={top - 4} textAnchor="end" fontFamily="var(--f-ui)" fontSize="10" fill={p.muted}>accuracy ↑</text>
        {/* trade-off line */}
        <line x1={px(0)} y1={py(lineY(0))} x2={px(1)} y2={py(lineY(1))} stroke={p.accent} strokeWidth="1.4" strokeDasharray="5 4" opacity="0.7" />
        {/* drag hit area */}
        <rect x={left} y={top} width={right - left} height={bottom - top} fill="transparent" style={{ cursor: "ns-resize", touchAction: "none" }} onPointerDown={(e) => { e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); onPointer(e); }} />
        {/* drag handle on the line's left end */}
        <circle cx={px(0)} cy={py(lineY(0))} r={6} fill={p.paper} stroke={p.accent} strokeWidth="1.5" pointerEvents="none" />
        <circle cx={px(0)} cy={py(lineY(0))} r={2.5} fill={p.accent} pointerEvents="none" />
        {/* candidates */}
        {pop && pop.map((c, i) => {
          const alive = survives(c);
          return <circle key={i} cx={px(c.x)} cy={py(c.y)} r={alive ? 4 : 2.5} fill={alive ? p.accent : p.muted} opacity={alive ? 0.85 : 0.3} style={{ transition: "all 240ms var(--ease-out)" }} />;
        })}
        <text x={left + 6} y={bottom - 6} fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>gen {gen}</text>
        <text x={right - 4} y={top + 14} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={p.accent}>↑ above line = selected</text>
      </svg>
      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.55, color: p.ink }}>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 10 }}>Controls</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          <button onClick={() => setRunning(r => !r)} style={{ flex: 1, fontFamily: "var(--f-mono)", fontSize: 10, padding: "4px 6px", border: `1px solid ${p.line}`, background: "transparent", color: p.accent, cursor: "pointer", letterSpacing: "0.06em" }}>{running ? "PAUSE" : "RUN"}</button>
          <button onClick={() => setSeed(s => s + 1)} style={{ flex: 1, fontFamily: "var(--f-mono)", fontSize: 10, padding: "4px 6px", border: `1px solid ${p.line}`, background: "transparent", color: p.accent, cursor: "pointer", letterSpacing: "0.06em" }}>RESEED</button>
        </div>
        <div className="mono" style={{ borderTop: `1px solid ${p.line}`, paddingTop: 10, fontSize: 10, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 8, rowGap: 4, color: p.ink }}>
          <span style={{ color: p.muted }}>gen</span><span>{gen}</span>
          <span style={{ color: p.muted }}>selected</span><span>{surviving} / {pop ? pop.length : 0}</span>
          <span style={{ color: p.muted }}>trade-off</span><span>{tradeOff.toFixed(2)}</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 10, color: p.muted, lineHeight: 1.5 }}>Drag the dashed line to change the trade-off. Higher = stricter on accuracy. Candidates above the line survive.</div>
      </div>
    </div>
  );
}
