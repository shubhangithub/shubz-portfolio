// @ts-nocheck
import React from 'react';

export function TrendSignalFlow({ palette: p }) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setT(v => (v + 1) % 200), 60);
    return () => clearInterval(id);
  }, []);
  const W = 520, H = 280;
  const sources = [
    { id: "gt",   label: "Google Trends",     color: p.accent },
    { id: "bs",   label: "Bluesky firehose", color: "#8B5A89" },
    { id: "pt",   label: "Pinterest trends", color: "#5B7A4F" },
    { id: "rd",   label: "Reddit mentions",  color: "#C68A4F" },
    { id: "yt",   label: "YouTube volume",   color: "#4F7A8B" },
  ];
  // synthetic signal lines per source
  const path = (i, phase) => {
    const points = [];
    for (let x = 0; x <= 200; x += 4) {
      const y = 30 + i * 36
        + Math.sin((x + phase) * 0.06 + i) * 6
        + Math.sin((x + phase) * 0.13 + i * 1.7) * 3.5;
      points.push(`${x === 0 ? "M" : "L"} ${20 + x} ${y}`);
    }
    return points.join(" ");
  };
  // composite + forecast
  const compositePath = () => {
    const points = [];
    const baseY = 100;
    for (let x = 0; x <= 320; x += 4) {
      const sumOsc = sources.reduce((acc, _, i) => acc + Math.sin((x + t * 2) * 0.05 + i * 1.3) * (i % 2 ? 5 : 4), 0);
      // upward trend + oscillation
      const trend = x * 0.18;
      const y = baseY + sumOsc - trend * 0.25;
      points.push(`${x === 0 ? "M" : "L"} ${240 + x * 0.5} ${y + 30}`);
    }
    return points.join(" ");
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 260 }}>
        {/* source lanes */}
        {sources.map((s, i) => (
          <g key={s.id}>
            <text x="10" y={36 + i * 36} fontFamily="var(--f-ui)" fontSize="10" fill={s.color} textAnchor="start">{s.label}</text>
            <path d={path(i, t * 2)} stroke={s.color} strokeWidth="1.4" fill="none" opacity={0.75} />
          </g>
        ))}
        {/* merge bracket */}
        <path d={`M 220 30 L 240 130 L 220 230`} stroke={p.muted} strokeWidth="1" fill="none" opacity={0.5} strokeDasharray="3 3" />
        {/* composite + forecast */}
        <line x1="395" y1="20" x2="395" y2={H - 30} stroke={p.muted} strokeDasharray="2 4" opacity="0.4" />
        <text x="395" y="14" textAnchor="middle" fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>now</text>
        <text x={395 + 40} y={H - 14} fontFamily="var(--f-mono)" fontSize="9" fill={p.accent}>→ 30-day forecast</text>
        <path d={compositePath()} stroke={p.accent} strokeWidth="1.8" fill="none" />
        {/* moving pulse on composite */}
        <circle r="3" fill={p.accent}>
          <animateMotion dur="3s" repeatCount="indefinite" path={compositePath()} />
        </circle>
      </svg>
      <div style={{ fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, textAlign: "center" }}>five sources → composite → Holt-Winters forecast</div>
    </div>
  );
}
