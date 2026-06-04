// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function JayaSwarm({ palette: p }) {
  const [running, setRunning] = React.useState(true);
  const [popSize, setPopSize] = React.useState(30);
  const [crossover, setCrossover] = React.useState(0.4);
  const [seed, setSeed] = React.useState(1);
  const [pop, setPop] = React.useState(null);
  const [gen, setGen] = React.useState(0);

  // landscape: f(x, y) = -((x-0.7)^2 + (y-0.4)^2). Best at (0.7, 0.4) → fitness 0.
  const target = { x: 0.7, y: 0.4 };
  const fit = React.useCallback((c) => -((c.x - target.x) ** 2 + (c.y - target.y) ** 2), []);

  // (re)seed population whenever popSize or seed changes
  React.useEffect(() => {
    let s = seed * 9001 + 17;
    const r = () => { s = (s * 1103515245 + 12345) % 2147483647; return s / 2147483647; };
    const next = Array.from({ length: popSize }, () => ({ x: r(), y: r() }));
    setPop(next);
    setGen(0);
  }, [popSize, seed]);

  // step the JAYA + crossover update on a 90ms tick when running
  React.useEffect(() => {
    if (!running || !pop) return;
    const id = setInterval(() => {
      setPop(prev => {
        if (!prev) return prev;
        let bestI = 0, worstI = 0, bestF = -Infinity, worstF = Infinity;
        for (let i = 0; i < prev.length; i++) {
          const f = fit(prev[i]);
          if (f > bestF) { bestF = f; bestI = i; }
          if (f < worstF) { worstF = f; worstI = i; }
        }
        const xb = prev[bestI], xw = prev[worstI];
        return prev.map((c, i) => {
          // JAYA update on each coordinate
          const r1x = Math.random(), r2x = Math.random();
          const r1y = Math.random(), r2y = Math.random();
          let nx = c.x + r1x * (xb.x - Math.abs(c.x)) - r2x * (xw.x - Math.abs(c.x));
          let ny = c.y + r1y * (xb.y - Math.abs(c.y)) - r2y * (xw.y - Math.abs(c.y));
          // single-point crossover with a random partner, fired with probability `crossover`
          if (Math.random() < crossover) {
            const partner = prev[(i + 1 + Math.floor(Math.random() * (prev.length - 1))) % prev.length];
            // swap one coordinate at random
            if (Math.random() < 0.5) nx = partner.x; else ny = partner.y;
          }
          return {
            x: Math.max(0.02, Math.min(0.98, nx)),
            y: Math.max(0.02, Math.min(0.98, ny)),
          };
        });
      });
      setGen(g => g + 1);
    }, 90);
    return () => clearInterval(id);
  }, [running, pop, crossover, fit]);

  const W = 420, H = 260;
  const rings = [0.08, 0.18, 0.28, 0.4];
  const bestFitness = pop ? Math.max(...pop.map(fit)) : 0;
  const ctrlInputStyle = { width: "100%", accentColor: p.accent };
  const ctrlLabelStyle = { fontFamily: "var(--f-mono)", fontSize: 10, color: p.muted, letterSpacing: "0.04em", display: "flex", justifyContent: "space-between", marginBottom: 2 };
  const ctrlBlock = { marginBottom: 12 };

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 240, background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`, border: `1px solid ${p.line}` }}>
        {rings.map((r, i) => (
          <ellipse key={i} cx={target.x * W} cy={(1 - target.y) * H} rx={r * W * 0.9} ry={r * H * 0.9} fill="none" stroke={p.muted} strokeOpacity={0.18} strokeDasharray="2 4" />
        ))}
        <circle cx={target.x * W} cy={(1 - target.y) * H} r="4" fill={p.accent} />
        <text x={target.x * W + 8} y={(1 - target.y) * H + 4} fontFamily="var(--f-mono)" fontSize="9" fill={p.accent}>x_b</text>
        {pop && pop.map((pt, i) => (
          <circle key={i} cx={pt.x * W} cy={(1 - pt.y) * H} r="3" fill={p.ink} opacity={0.7} style={{ transition: "all 240ms var(--ease-out)" }} />
        ))}
        <text x="10" y={H - 8} fontFamily="var(--f-ui)" fontSize="10" fill={p.muted} className="mono">gen {gen}</text>
      </svg>
      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.5, color: p.ink }}>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 10 }}>Controls</div>

        <div style={ctrlBlock}>
          <div style={ctrlLabelStyle}><span>population</span><span style={{ color: p.ink }}>{popSize}</span></div>
          <input type="range" min={10} max={60} step={2} value={popSize} onChange={e => setPopSize(+e.target.value)} style={ctrlInputStyle} />
        </div>

        <div style={ctrlBlock}>
          <div style={ctrlLabelStyle}><span>crossover</span><span style={{ color: p.ink }}>{crossover.toFixed(2)}</span></div>
          <input type="range" min={0} max={1} step={0.05} value={crossover} onChange={e => setCrossover(+e.target.value)} style={ctrlInputStyle} />
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 14, marginBottom: 14 }}>
          <button onClick={() => setRunning(r => !r)} style={{ flex: 1, fontFamily: "var(--f-mono)", fontSize: 10, padding: "4px 6px", border: `1px solid ${p.line}`, background: "transparent", color: p.accent, cursor: "pointer", letterSpacing: "0.06em" }}>{running ? "PAUSE" : "RUN"}</button>
          <button onClick={() => setSeed(s => s + 1)} style={{ flex: 1, fontFamily: "var(--f-mono)", fontSize: 10, padding: "4px 6px", border: `1px solid ${p.line}`, background: "transparent", color: p.accent, cursor: "pointer", letterSpacing: "0.06em" }}>RESEED</button>
        </div>

        <div className="mono" style={{ borderTop: `1px solid ${p.line}`, paddingTop: 10, fontSize: 10, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 8, rowGap: 4, color: p.ink }}>
          <span style={{ color: p.muted }}>best f</span><span>{bestFitness.toFixed(4)}</span>
          <span style={{ color: p.muted }}>gen</span><span>{gen}</span>
        </div>
      </div>
    </div>
  );
}
