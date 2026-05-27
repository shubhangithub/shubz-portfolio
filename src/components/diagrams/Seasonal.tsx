// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useIsMobile, SEASONAL_THEMES } from '../legacy';

// SeasonalSpecimen
export function SeasonalSpecimen({ width = 200, height = 180, accent = "#1F3DBF", ink = "#0F1320", muted = "#6E7488", line = "#D5D6DC", compact = false }) {
  // Show May (Lotka–Volterra) starting today; from May 1 onwards the natural
  // calendar month takes over.
  const month = Math.max(4, new Date().getMonth());
  const theme = SEASONAL_THEMES[month];
  const monthName = new Date(2026, month, 1).toLocaleString("en", { month: "long" });
  // Some months have a fully-interactive variant (sliders, drag, etc) — those
  // replace the standard SVG specimen entirely. Others fall back to a static
  // animated SVG via SPECIMEN_VARIANTS.
  const Interactive = INTERACTIVE_VARIANTS[theme.id];
  if (Interactive) {
    return <Interactive width={width} height={height} accent={accent} ink={ink} muted={muted} line={line} theme={theme} monthName={monthName} compact={compact} />;
  }
  return <StaticSpecimen width={width} height={height} accent={accent} ink={ink} muted={muted} line={line} theme={theme} monthName={monthName} />;
}

// StaticSpecimen
export function StaticSpecimen({ width, height, accent, ink, muted, line, theme, monthName }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf, lastT = 0;
    const loop = (now) => {
      if (now - lastT > 33) { lastT = now; setTick(t => (t + 1) % 100000); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const Variant = SPECIMEN_VARIANTS[theme.id] || SPECIMEN_VARIANTS.quantum;
  return (
    <div style={{ position: "relative", width, fontFamily: "var(--f-ui)", fontSize: 11, color: muted }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }} role="img" aria-label={`${theme.label} specimen`}>
        <Variant w={width} h={height} t={tick} accent={accent} ink={ink} muted={muted} line={line} />
      </svg>
      <div className="mono" style={{ marginTop: 6, color: muted, fontSize: 10, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: ink }}>fig.01 — {theme.caption}</span>
        <span>{monthName.toLowerCase()}</span>
      </div>
      <div style={{ marginTop: 8, fontFamily: "var(--f-body)", fontSize: 12, color: muted, fontStyle: "italic", lineHeight: 1.5 }}>
        {theme.why}
      </div>
    </div>
  );
}

// LotkaVolterra
export function LotkaVolterra({ width, height, accent, ink, muted, line, theme, monthName, compact = false }) {
  const isMobile = (typeof useIsMobile === "function") ? useIsMobile() : (typeof window !== "undefined" && window.innerWidth <= 768);
  const ALPHA = 1.0, DELTA = 0.4;          // fixed
  const [beta, setBeta] = React.useState(0.4);
  const [gamma, setGamma] = React.useState(1.0);
  const stateRef = React.useRef({ x: 1.5, y: 0.8, trail: [], series: [] });
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf, lastFrame = 0, lastRender = 0;
    const dt = 0.02;
    const loop = (now) => {
      if (now - lastFrame > 16) {
        lastFrame = now;
        const s = stateRef.current;
        // Two RK4 sub-steps per visible frame for smoother integration
        for (let k = 0; k < 2; k++) {
          const dx = ALPHA * s.x - beta * s.x * s.y;
          const dy = DELTA * s.x * s.y - gamma * s.y;
          s.x = Math.max(0.02, Math.min(6, s.x + dx * dt));
          s.y = Math.max(0.02, Math.min(5.5, s.y + dy * dt));
        }
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 240) s.trail.shift();
        s.series.push({ x: s.x, y: s.y });
        if (s.series.length > 110) s.series.shift();
        // Throttle React re-renders to ~30Hz
        if (now - lastRender > 33) {
          lastRender = now;
          setTick(t => (t + 1) % 100000);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [beta, gamma]);

  const reset = () => {
    stateRef.current = { x: 1.5, y: 0.8, trail: [], series: [] };
    setTick(t => t + 1);
  };

  // Layout slices of the SVG canvas — sized to fill the box's natural dimensions
  // on desktop (the box stretches to match the lede column ≈ 460px). No JS
  // measurement, no feedback loop — just generous intrinsic values.
  // compact mode: square phase plot only (no series strip, no sliders/why-line below)
  const phaseH = compact ? width : (isMobile ? 180 : 250);
  const seriesH = compact ? 0 : (isMobile ? 0 : 42);
  const padX = 12;
  const xMax = 6, yMax = 6.5;
  const px = (x) => padX + (x / xMax) * (width - padX * 2);
  const py = (y) => phaseH - 18 - (y / yMax) * (phaseH - 30);
  const sx = (i) => padX + (i / 110) * (width - padX * 2);
  const sy = (v) => phaseH + seriesH - 4 - (v / 5) * (seriesH - 10);

  const s = stateRef.current;
  const trailPath = s.trail.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.x).toFixed(1)} ${py(p.y).toFixed(1)}`).join(" ");
  const head = s.trail.length ? s.trail[s.trail.length - 1] : { x: 1.5, y: 0.8 };
  const eqX = gamma / DELTA;
  const eqY = ALPHA / beta;
  const seriesPrey = s.series.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(i).toFixed(1)} ${sy(p.x).toFixed(1)}`).join(" ");
  const seriesPred = s.series.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(i).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(" ");

  return (
    <div style={{ position: "relative", width: "100%", fontFamily: "var(--f-ui)", fontSize: 11, color: muted }}>
      <svg width="100%" height={phaseH + seriesH} viewBox={`0 0 ${width} ${phaseH + seriesH}`} preserveAspectRatio="xMidYMid meet" style={{ display: "block" }} role="img" aria-label="Lotka–Volterra predator–prey loop">
        {/* axes */}
        <line x1={padX} y1={phaseH - 18} x2={width - padX} y2={phaseH - 18} stroke={line} strokeWidth="0.6" />
        <line x1={padX} y1={12} x2={padX} y2={phaseH - 18} stroke={line} strokeWidth="0.6" />
        <text x={width - padX - 2} y={phaseH - 6} textAnchor="end" fontSize="9" fontFamily="var(--f-mono)" fill={muted}>prey →</text>
        <text x={padX + 4} y={16} fontSize="9" fontFamily="var(--f-mono)" fill={muted}>predator ↑</text>
        {/* equilibrium crosshair */}
        {eqX < xMax && eqY < yMax && (
          <g opacity="0.55">
            <line x1={px(eqX) - 4} y1={py(eqY)} x2={px(eqX) + 4} y2={py(eqY)} stroke={muted} strokeWidth="0.6" />
            <line x1={px(eqX)} y1={py(eqY) - 4} x2={px(eqX)} y2={py(eqY) + 4} stroke={muted} strokeWidth="0.6" />
            <text x={px(eqX) + 6} y={py(eqY) + 3} fontSize="8" fontFamily="var(--f-mono)" fill={muted}>eq</text>
          </g>
        )}
        {/* trail (the loop) */}
        <path d={trailPath} fill="none" stroke={accent} strokeWidth="1.1" strokeOpacity="0.75" />
        {/* current point */}
        <circle cx={px(head.x)} cy={py(head.y)} r="3.4" fill={accent} stroke={`color-mix(in oklch, ${accent} 50%, white)`} strokeWidth="1" />
        {/* time-series strip */}
        {seriesH > 0 && (
          <g transform={`translate(0, ${phaseH})`}>
            <line x1={padX} y1={seriesH - 4} x2={width - padX} y2={seriesH - 4} stroke={line} strokeWidth="0.4" />
            <path d={seriesPrey} fill="none" stroke={accent} strokeWidth="0.9" strokeOpacity="0.85" />
            <path d={seriesPred} fill="none" stroke={ink} strokeWidth="0.9" strokeOpacity="0.6" strokeDasharray="2 2" />
            <text x={width - padX - 2} y={11} textAnchor="end" fontSize="8" fontFamily="var(--f-mono)" fill={muted}>— prey · - predator</text>
          </g>
        )}
      </svg>

      {!compact && (
        <>
          {/* sliders + reset */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "2px 0.5rem", alignItems: "center", marginTop: 6, fontSize: 10, fontFamily: "var(--f-mono)", color: muted }}>
            <span>predation β</span>
            <input type="range" min="0.25" max="0.6" step="0.01" value={beta} onChange={e => setBeta(+e.target.value)} style={{ width: "100%", accentColor: accent, height: 18 }} />
            <span style={{ color: ink, minWidth: 28, textAlign: "right" }}>{beta.toFixed(2)}</span>
            <span>fox death γ</span>
            <input type="range" min="0.6" max="1.5" step="0.01" value={gamma} onChange={e => setGamma(+e.target.value)} style={{ width: "100%", accentColor: accent, height: 18 }} />
            <span style={{ color: ink, minWidth: 28, textAlign: "right" }}>{gamma.toFixed(2)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
            <button onClick={reset} style={{ all: "unset", cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 10, padding: "2px 8px", border: `1px solid ${line}`, color: accent, letterSpacing: "0.06em" }}>RESET</button>
            <span className="mono" style={{ fontSize: 9, color: muted }}>{monthName.toLowerCase()}</span>
          </div>

          <div className="mono" style={{ marginTop: 6, color: muted, fontSize: 10 }}>
            <span style={{ color: ink }}>fig.01 — {theme.caption}</span>
          </div>
          <div style={{ marginTop: 4, fontFamily: "var(--f-body)", fontSize: 12, color: muted, fontStyle: "italic", lineHeight: 1.45 }}>
            {theme.why}
          </div>
        </>
      )}
    </div>
  );
}

// SPECIMEN_VARIANTS
export const SPECIMEN_VARIANTS = {
  quantum: ({ w, h, t, accent, muted, line }) => {
    const N = 70, tau = t * 0.05, pts = [];
    for (let i = 0; i < N; i++) {
      const x = i / (N - 1);
      const re = Math.sin(Math.PI * x) * Math.cos(tau) + Math.sin(2 * Math.PI * x) * Math.cos(4 * tau);
      const im = -Math.sin(Math.PI * x) * Math.sin(tau) - Math.sin(2 * Math.PI * x) * Math.sin(4 * tau);
      pts.push({ x: 18 + x * (w - 36), y: h - 28 - (re*re + im*im) * (h - 56) / 2 });
    }
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    return (<g><line x1={18} x2={w-18} y1={h-28} y2={h-28} stroke={line} strokeWidth="0.6"/><line x1={18} x2={18} y1={18} y2={h-28} stroke={line} strokeWidth="0.6"/><text x={22} y={24} fontSize="9" fontFamily="var(--f-mono)" fill={muted}>|ψ(x,t)|²</text><path d={path} fill="none" stroke={accent} strokeWidth="1.4"/></g>);
  },
  topology: ({ w, h, t, accent, ink, muted }) => {
    const cx = w/2, cy = h/2 - 6, R = Math.min(w,h) * 0.30, rot = t * 0.012, lines = [];
    for (let i = 0; i < 36; i++) {
      const u = (i/36) * Math.PI * 2, inner = [];
      for (let v = -1; v <= 1; v += 2) {
        const x3 = (R + v*10*Math.cos(u/2)) * Math.cos(u + rot);
        const y3 = (R + v*10*Math.cos(u/2)) * Math.sin(u + rot);
        const z3 = v*10*Math.sin(u/2);
        inner.push({ x: cx + x3 + z3*0.3, y: cy + y3*0.5 - z3*0.4 });
      }
      lines.push(inner);
    }
    const M = 70, edge = [];
    for (let i = 0; i <= M; i++) {
      const u = (i/M) * Math.PI * 4;
      const x3 = (R + 10*Math.cos(u/2)) * Math.cos(u + rot);
      const y3 = (R + 10*Math.cos(u/2)) * Math.sin(u + rot);
      const z3 = 10*Math.sin(u/2);
      edge.push(`${i === 0 ? "M" : "L"} ${(cx+x3+z3*0.3).toFixed(1)} ${(cy+y3*0.5-z3*0.4).toFixed(1)}`);
    }
    return (<g>{lines.map((seg, i) => <line key={i} x1={seg[0].x} y1={seg[0].y} x2={seg[1].x} y2={seg[1].y} stroke={i%4===0?accent:muted} strokeWidth={i%4===0?"1.1":"0.55"} strokeOpacity={i%4===0?1:0.5}/>)}<path d={edge.join(" ")} fill="none" stroke={ink} strokeWidth="1"/></g>);
  },
  skating: ({ w, h, t, accent, ink, muted, line }) => {
    const r = 22, b = 12, phase = t * 0.04, ground = h - 26, N = 180, pts = [];
    for (let i = 0; i < N; i++) {
      const θ = (i/N) * Math.PI * 4 + phase * 0.3;
      pts.push({ x: 8 + (r*θ - b*Math.sin(θ)) * 0.42, y: ground - (r - b*Math.cos(θ)) });
    }
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    const θ0 = phase * 0.3 + Math.PI * 2;
    const wx = 8 + (r*θ0 - b*Math.sin(θ0)) * 0.42;
    return (<g><line x1={0} x2={w} y1={ground} y2={ground} stroke={line} strokeWidth="0.6"/><path d={path} fill="none" stroke={accent} strokeWidth="1.2" strokeOpacity="0.7"/><circle cx={wx} cy={ground - r*0.42} r={r*0.42} fill="none" stroke={ink} strokeWidth="1"/><circle cx={wx} cy={ground - r*0.42} r="1.4" fill={accent}/><rect x={wx-7} y={ground - r*0.42 - 12} width="14" height="5" fill="none" stroke={muted} strokeWidth="0.7"/></g>);
  },
  astronomy: ({ w, h, t, accent, ink, muted, line }) => {
    const cx = w/2, cy = h/2 - 4, a = Math.min(w,h)*0.30, e = 0.4, b = a*Math.sqrt(1 - e*e);
    const orb = [];
    for (let i = 0; i <= 100; i++) {
      const θ = (i/100) * Math.PI * 2;
      orb.push(`${i === 0 ? "M" : "L"} ${(cx + a*Math.cos(θ) - a*e).toFixed(1)} ${(cy + b*Math.sin(θ)).toFixed(1)}`);
    }
    const Mθ = t * 0.012;
    let E = Mθ;
    for (let k = 0; k < 5; k++) E = E - (E - e*Math.sin(E) - Mθ) / (1 - e*Math.cos(E));
    const px = cx + a*(Math.cos(E) - e), py = cy + b*Math.sin(E);
    return (<g>{[[16,16],[w-16,16],[16,h-16],[w-16,h-16]].map(([x,y], i) => (<g key={i}><line x1={x + (i%2 ? -7 : 7)} y1={y} x2={x} y2={y} stroke={muted} strokeWidth="0.7"/><line x1={x} y1={y + (i<2 ? 7 : -7)} x2={x} y2={y} stroke={muted} strokeWidth="0.7"/></g>))}<line x1={cx-4} y1={cy} x2={cx+4} y2={cy} stroke={line} strokeWidth="0.5"/><line x1={cx} y1={cy-4} x2={cx} y2={cy+4} stroke={line} strokeWidth="0.5"/><path d={orb.join(" ")} fill="none" stroke={muted} strokeWidth="0.8" strokeDasharray="2 3"/><circle cx={cx - a*e} cy={cy} r="3" fill={ink}/><circle cx={px} cy={py} r="2.4" fill={accent}/><line x1={cx - a*e} y1={cy} x2={px} y2={py} stroke={accent} strokeWidth="0.6" strokeOpacity="0.4"/></g>);
  },
  cellular: ({ w, h, t, accent, ink, muted }) => {
    const cellW = 4, cellH = 4;
    const cols = Math.floor((w - 16) / cellW), rows = Math.floor((h - 28) / cellH);
    const generation = Math.floor(t / 4);
    let row = new Array(cols).fill(0);
    row[Math.floor(cols/2)] = 1;
    const all = [row];
    for (let r = 0; r < rows + generation; r++) {
      const next = new Array(cols).fill(0);
      for (let c = 0; c < cols; c++) {
        const idx = (row[(c-1+cols)%cols] << 2) | (row[c] << 1) | row[(c+1)%cols];
        next[c] = (110 >> idx) & 1;
      }
      all.push(next); row = next;
    }
    const visible = all.slice(-rows), cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (visible[r][c]) cells.push(<rect key={r*cols+c} x={8 + c*cellW} y={18 + r*cellH} width={cellW-0.5} height={cellH-0.5} fill={r > rows-4 ? accent : ink} fillOpacity={r > rows-4 ? 1 : 0.85}/>);
    }
    return (<g>{cells}<text x={w-12} y={12} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">rule 110</text></g>);
  },
  fluids: ({ w, h, t, accent, ink, muted, line }) => {
    const cy = h/2 - 4, obstacleX = 32, N = 7, vortices = [];
    for (let i = 0; i < N; i++) {
      const phase = t * 0.02 - i * 1.4;
      const age = (phase * 12) % (w - obstacleX - 14);
      const sign = i % 2 === 0 ? 1 : -1;
      vortices.push({ x: obstacleX + age + obstacleX, y: cy + sign*12, sign, age });
    }
    return (<g>{[0.2,0.4,0.6,0.8].map((f, i) => <line key={i} x1={4} x2={obstacleX-3} y1={h*f} y2={h*f} stroke={line} strokeWidth="0.5"/>)}<circle cx={obstacleX} cy={cy} r="5" fill="none" stroke={ink} strokeWidth="1"/>{vortices.map((v, i) => {
      const sp = [];
      for (let k = 0; k < 22; k++) {
        const θ = (k/22) * Math.PI * 2.4 * v.sign;
        const r = 1 + k * 0.16;
        sp.push(`${k === 0 ? "M" : "L"} ${(v.x + r*Math.cos(θ)).toFixed(1)} ${(v.y + r*Math.sin(θ)).toFixed(1)}`);
      }
      return <path key={i} d={sp.join(" ")} fill="none" stroke={i%2===0 ? accent : muted} strokeWidth="0.8" strokeOpacity={Math.max(0.15, 1 - v.age/(w - obstacleX))}/>;
    })}</g>);
  },
  chaos: ({ w, h, t, accent, ink, muted }) => {
    if (!SPECIMEN_VARIANTS.chaos.state) SPECIMEN_VARIANTS.chaos.state = { x: 0.1, y: 0, z: 0, trail: [] };
    const s = SPECIMEN_VARIANTS.chaos.state, dt = 0.008;
    for (let k = 0; k < 4; k++) {
      const dx = 10*(s.y - s.x), dy = s.x*(28 - s.z) - s.y, dz = s.x*s.y - (8/3)*s.z;
      s.x += dx*dt; s.y += dy*dt; s.z += dz*dt;
      s.trail.push({ x: s.x, z: s.z });
      if (s.trail.length > 500) s.trail.shift();
    }
    const cx = w/2, cy = h/2 + 6, scale = Math.min(w,h)/55;
    const path = s.trail.map((p, i) => `${i === 0 ? "M" : "L"} ${(cx + p.x*scale).toFixed(1)} ${(cy - (p.z - 25)*scale*0.85).toFixed(1)}`).join(" ");
    const head = s.trail[s.trail.length - 1] || { x: 0, z: 25 };
    return (<g><path d={path} fill="none" stroke={accent} strokeWidth="0.7" strokeOpacity="0.65"/><circle cx={cx + head.x*scale} cy={cy - (head.z - 25)*scale*0.85} r="1.8" fill={ink}/><text x={w-6} y={12} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">Lorenz</text></g>);
  },
  h3: ({ w, h, t, accent, muted, line }) => {
    const r = 12, cols = 8, rows = 5, xStep = r * Math.sqrt(3), yStep = r * 1.5;
    const xOff = (w - cols*xStep) / 2 + xStep/2, yOff = (h - rows*yStep) / 2 - 4;
    const focusIdx = Math.floor(t * 0.04) % (cols * rows), hexes = [];
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
      const cx = xOff + col*xStep + (row % 2 ? xStep/2 : 0), cy = yOff + row*yStep, pts = [];
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI / 3) - Math.PI/2;
        pts.push(`${(cx + r*Math.cos(a)).toFixed(1)},${(cy + r*Math.sin(a)).toFixed(1)}`);
      }
      const idx = row*cols + col, isFocus = idx === focusIdx;
      hexes.push(<polygon key={idx} points={pts.join(" ")} fill={isFocus ? accent : "none"} fillOpacity={isFocus ? 0.18 : 0} stroke={isFocus ? accent : line} strokeWidth={isFocus ? "1.4" : "0.6"}/>);
    }
    return (<g>{hexes}<text x={w-6} y={h-6} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">res 8</text></g>);
  },
  neural: ({ w, h, t, ink, accent, line, muted }) => {
    if (!SPECIMEN_VARIANTS.neural.state) SPECIMEN_VARIANTS.neural.state = { trail: [{ x: 0.5, y: 0.5 }] };
    const s = SPECIMEN_VARIANTS.neural.state;
    const noiseX = Math.sin(t*0.03)*0.3 + Math.sin(t*0.011 + 1.3)*0.2;
    const noiseY = Math.cos(t*0.025)*0.3 + Math.cos(t*0.013 + 0.7)*0.2;
    const last = s.trail[s.trail.length - 1];
    const nx = Math.max(0.05, Math.min(0.95, last.x + (noiseX - last.x + 0.5) * 0.04));
    const ny = Math.max(0.05, Math.min(0.95, last.y + (noiseY - last.y + 0.5) * 0.04));
    if (t % 2 === 0) s.trail.push({ x: nx, y: ny });
    if (s.trail.length > 180) s.trail.shift();
    const grid = [];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) grid.push({ x: 0.1 + i*0.2, y: 0.18 + j*0.2 });
    return (<g>{grid.map((g, i) => <circle key={i} cx={g.x*w} cy={g.y*h} r="1.2" fill={line}/>)}<path d={s.trail.map((p, i) => `${i === 0 ? "M" : "L"} ${(p.x*w).toFixed(1)} ${(p.y*h).toFixed(1)}`).join(" ")} fill="none" stroke={accent} strokeWidth="0.8" strokeOpacity="0.6"/><circle cx={nx*w} cy={ny*h} r="2.4" fill={ink}/><text x={w-6} y={12} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">z ∈ ℝ²</text></g>);
  },
  optics: ({ w, h, t, accent, ink, muted, line }) => {
    const srcX = 12, slitX = 42, slitGap = 16, screenX = w - 18;
    const lambda = 6 + 2*Math.sin(t*0.01), N = 50, pts = [];
    for (let i = 0; i < N; i++) {
      const y = 16 + i*((h - 36) / (N - 1));
      const d1 = Math.hypot(screenX - slitX, y - (h/2 - slitGap/2));
      const d2 = Math.hypot(screenX - slitX, y - (h/2 + slitGap/2));
      const phase = 2*Math.PI*(d1 - d2)/lambda + t*0.04;
      pts.push({ y, I: (1 + Math.cos(phase))/2 });
    }
    return (<g><circle cx={srcX} cy={h/2} r="2" fill={accent}/><line x1={slitX} y1={16} x2={slitX} y2={h/2 - slitGap/2} stroke={ink} strokeWidth="1"/><line x1={slitX} y1={h/2 + slitGap/2} x2={slitX} y2={h-16} stroke={ink} strokeWidth="1"/><line x1={screenX} y1={16} x2={screenX} y2={h-16} stroke={line} strokeWidth="0.8"/>{pts.map((p, i) => <line key={i} x1={screenX} y1={p.y} x2={screenX + 12*p.I} y2={p.y} stroke={accent} strokeWidth="1.2"/>)}<text x={w-6} y={12} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">2-slit</text></g>);
  },
  crypto: ({ w, h, t, accent, ink, muted }) => {
    const cx = w/2, cy = h/2 - 4, phase = (Math.sin(t*0.012) + 1)/2;
    const a = 22, b = 18, k = 18 * (1 - phase), dots = [];
    for (let i = -3; i <= 3; i++) for (let j = -2; j <= 2; j++) {
      dots.push({ x: cx + i*a + j*k, y: cy + j*b, focus: i === 0 && j === 0 });
    }
    return (<g>{dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.focus ? 2.4 : 1.4} fill={d.focus ? ink : muted}/>)}<defs><marker id="cArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 8 5 L 0 10 z" fill={accent}/></marker></defs><line x1={cx} y1={cy} x2={cx + a} y2={cy} stroke={accent} strokeWidth="1.2" markerEnd="url(#cArr)"/><line x1={cx} y1={cy} x2={cx + k} y2={cy + b} stroke={accent} strokeWidth="1.2" markerEnd="url(#cArr)"/><text x={w-6} y={12} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">LLL</text></g>);
  },
  relativity: ({ w, h, t, accent, ink, muted, line }) => {
    const cx = w/2, cy = h/2 + 6, len = Math.min(w,h) * 0.32;
    const eventY = cy - (t*0.4) % (len*1.6) + len*0.3;
    return (<g><line x1={cx} y1={cy-len} x2={cx} y2={cy+len} stroke={line} strokeWidth="0.6"/><line x1={cx-len} y1={cy} x2={cx+len} y2={cy} stroke={line} strokeWidth="0.6"/><text x={cx+4} y={cy-len+4} fontSize="9" fontFamily="var(--f-mono)" fill={muted}>ct</text><line x1={cx} y1={cy} x2={cx-len} y2={cy-len} stroke={accent} strokeWidth="1"/><line x1={cx} y1={cy} x2={cx+len} y2={cy-len} stroke={accent} strokeWidth="1"/><line x1={cx} y1={cy} x2={cx-len} y2={cy+len} stroke={muted} strokeWidth="0.7" strokeDasharray="2 3"/><line x1={cx} y1={cy} x2={cx+len} y2={cy+len} stroke={muted} strokeWidth="0.7" strokeDasharray="2 3"/><line x1={cx+4} y1={cy-len} x2={cx-4} y2={cy+len} stroke={ink} strokeWidth="1"/><circle cx={cx + (eventY-cy)/len * -4} cy={eventY} r="2.2" fill={ink}/><text x={w-6} y={h-6} fontSize="9" fontFamily="var(--f-mono)" fill={muted} textAnchor="end">Minkowski</text></g>);
  },
};

// INTERACTIVE_VARIANTS
export const INTERACTIVE_VARIANTS = {
  lotkavolterra: LotkaVolterra,
};
