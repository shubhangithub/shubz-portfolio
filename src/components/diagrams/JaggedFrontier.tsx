// @ts-nocheck
import React, { useState, useEffect } from 'react';

const DOMAINS_DEF = [
  { id: "cyberD",  label: "cyber-defence",     defensePriority: 0.9, offensePriority: 0.3, safetyRisk: 0.2  },
  { id: "bioB",    label: "bio (benign)",       defensePriority: 0.8, offensePriority: 0.4, safetyRisk: 0.25 },
  { id: "interpD", label: "interpretability",  defensePriority: 0.85,offensePriority: 0.2, safetyRisk: 0.15 },
  { id: "cyberO",  label: "cyber-offence",      defensePriority: 0.3, offensePriority: 0.9, safetyRisk: 0.75 },
  { id: "bioW",    label: "bio (dual-use)",     defensePriority: 0.3, offensePriority: 0.85,safetyRisk: 0.85 },
  { id: "disinf",  label: "disinformation",     defensePriority: 0.2, offensePriority: 0.9, safetyRisk: 0.80 },
];

const TICKS = 60;
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 2);

function capCurve(priority, t, phase) {
  const raw = priority * easeOut(Math.min(1, t * 1.4));
  const osc = Math.sin(t * 8 + phase) * 0.025 * (1 - t);
  return Math.max(0, Math.min(1, raw + osc));
}

export function JaggedFrontier({ palette: p }) {
  const [mode, setMode] = useState("defense"); // "defense" | "offense"
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick(v => (v + 1) % (TICKS + 20)), 55);
    return () => clearInterval(id);
  }, [running]);

  const t = Math.min(1, tick / TICKS);

  const W = 480, H = 260, padL = 48, padR = 16, padT = 20, padB = 36;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const toX = (frac) => padL + frac * plotW;
  const toY = (v) => padT + (1 - v) * plotH;

  const DOMAIN_COLORS = {
    cyberD:  "#3A5AA8",
    bioB:    "#4F7A50",
    interpD: "#7A4F8A",
    cyberO:  "#C68A4F",
    bioW:    "#B04040",
    disinf:  "#8B5A89",
  };

  const pts = DOMAINS_DEF.map(d => {
    const priority = mode === "defense" ? d.defensePriority : d.offensePriority;
    const points = [];
    for (let i = 0; i <= 80; i++) {
      const frac = i / 80;
      const cap = capCurve(priority, Math.min(frac, t), d.safetyRisk * 0.3);
      points.push(`${toX(frac)},${toY(cap)}`);
    }
    return { ...d, points };
  });

  // safety threshold line (at 0.6)
  const safeY = toY(0.62);

  const btnStyle = (active) => ({
    padding: "4px 12px",
    fontFamily: "var(--f-mono)",
    fontSize: 10,
    border: `1px solid ${active ? p.accent : p.line}`,
    color: active ? p.accent : p.muted,
    background: active ? `color-mix(in oklch, ${p.accent} 8%, transparent)` : "transparent",
    cursor: "pointer",
    borderRadius: 2,
    transition: "all 200ms",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--f-ui)", fontSize: 10, color: p.muted, marginRight: 4 }}>build order:</span>
        <button style={btnStyle(mode === "defense")} onClick={() => { setMode("defense"); setTick(0); }}>defence-first</button>
        <button style={btnStyle(mode === "offense")} onClick={() => { setMode("offense"); setTick(0); }}>capability-first</button>
        <button style={{ ...btnStyle(false), marginLeft: "auto" }} onClick={() => { setTick(0); setRunning(true); }}>↺ reset</button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {/* grid */}
        {[0.25, 0.5, 0.75, 1].map(v => (
          <line key={v} x1={padL} y1={toY(v)} x2={W - padR} y2={toY(v)} stroke={p.line} strokeWidth="0.6" opacity="0.5" />
        ))}
        {/* safety threshold */}
        <line x1={padL} y1={safeY} x2={W - padR} y2={safeY} stroke="#B04040" strokeWidth="1" strokeDasharray="4 3" opacity="0.55" />
        <text x={W - padR - 2} y={safeY - 4} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill="#B04040" opacity="0.7">safety threshold</text>

        {/* axes */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={p.muted} strokeWidth="0.8" opacity="0.5" />
        <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke={p.muted} strokeWidth="0.8" opacity="0.5" />
        <text x={padL - 4} y={toY(0)} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>max</text>
        <text x={padL - 4} y={toY(0.5)} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>0.5</text>
        <text x={padL - 4} y={toY(1)} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>0</text>
        <text x={padL} y={H - 4} fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>2025</text>
        <text x={W - padR} y={H - 4} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>2030</text>
        <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>capability level →</text>

        {/* curves */}
        {pts.map(d => (
          <polyline key={d.id}
            points={d.points.join(" ")}
            stroke={DOMAIN_COLORS[d.id]}
            strokeWidth="1.5"
            fill="none"
            opacity="0.75"
          />
        ))}

        {/* end labels at current t */}
        {pts.map(d => {
          const priority = mode === "defense" ? d.defensePriority : d.offensePriority;
          const cap = capCurve(priority, t, d.safetyRisk * 0.3);
          const x = toX(t);
          const y = toY(cap);
          return (
            <g key={d.id + "_label"}>
              <circle cx={x} cy={y} r={3} fill={DOMAIN_COLORS[d.id]} opacity="0.8" />
              {t > 0.05 && (
                <text x={x + 5} y={y + 4} fontFamily="var(--f-ui)" fontSize="8.5" fill={DOMAIN_COLORS[d.id]} opacity="0.9">
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, lineHeight: 1.5 }}>
        {mode === "defense"
          ? "Defence-first ordering: interpretability, cyber-defence, and benign-use biology are built before dual-use capabilities. Dangerous domains stay below the safety threshold during the build-out."
          : "Capability-first ordering: cyber-offence, dual-use biology, and disinformation tools race ahead. Several dangerous capabilities cross the safety threshold before safety research catches up."
        }
      </div>
    </div>
  );
}
