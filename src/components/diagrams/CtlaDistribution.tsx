// @ts-nocheck
import React from 'react';

export function CtlaDistribution({ palette: p }) {
  const [hover, setHover] = React.useState(null); // "cd66b" | "ctla4" | null
  // synthetic histograms — CD66b (clean bimodal) vs CTLA-4 (flat/ambiguous)
  const data = React.useMemo(() => {
    const mkHist = (seed, gen) => {
      let s = seed;
      const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      const gauss = (mu, sd) => { const u1 = Math.max(1e-6, rng()), u2 = rng(); return mu + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); };
      const bins = new Array(32).fill(0);
      for (let i = 0; i < 500; i++) {
        const v = gen(rng, gauss);
        const bin = Math.max(0, Math.min(31, Math.floor(v * 32)));
        bins[bin]++;
      }
      return bins;
    };
    return {
      cd66b: mkHist(42, (r, g) => r() < 0.6 ? g(0.18, 0.07) : g(0.72, 0.09)),
      ctla4: mkHist(77, (r, g) => g(0.36, 0.20)),
    };
  }, []);

  const methodLines = {
    cd66b: [
      { label: "Otsu", x: 0.41, color: p.accent },
      { label: "IsoData", x: 0.43, color: "#5B7A4F" },
      { label: "GMM", x: 0.44, color: "#8B5A89" },
    ],
    ctla4: [
      { label: "Otsu", x: 0.25, color: p.accent },
      { label: "IsoData", x: 0.40, color: "#5B7A4F" },
      { label: "GMM", x: 0.52, color: "#8B5A89" },
    ],
  };

  const W = 480, H = 200;
  const drawPanel = (bins, key, xOff, panelW) => {
    const max = Math.max(...bins);
    const barW = (panelW - 20) / bins.length;
    const bottom = H - 30, tp = 30;
    const isHov = hover === key;
    const lines = methodLines[key];
    return (
      <g style={{ opacity: hover && !isHov ? 0.4 : 1, transition: "opacity 240ms var(--ease-out)" }}>
        <text x={xOff + panelW / 2} y={18} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="11" fill={isHov ? p.accent : p.ink}>{key === "cd66b" ? "CD66b" : "CTLA-4"}</text>
        <text x={xOff + panelW / 2} y={H - 6} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="9" fill={p.muted}>{key === "cd66b" ? "clean valley — methods converge" : "no valley — methods scatter"}</text>
        <rect x={xOff} y={tp} width={panelW} height={bottom - tp} fill="none" stroke={p.line} strokeWidth="0.5" onMouseEnter={() => setHover(key)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }} />
        {bins.map((count, i) => {
          const x = xOff + 10 + i * barW;
          const h = max > 0 ? (count / max) * (bottom - tp - 10) : 0;
          return <rect key={i} x={x} y={bottom - h} width={barW - 0.5} height={h} fill={p.muted} opacity={0.3} />;
        })}
        {lines.map((ln, j) => {
          const px = xOff + 10 + ln.x * (panelW - 20);
          return (
            <g key={j}>
              <line x1={px} y1={tp + 4} x2={px} y2={bottom} stroke={ln.color} strokeWidth="1.4" strokeDasharray="3 3" />
              <text x={px} y={tp + 2} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="7" fill={ln.color}>{ln.label}</text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 200 }}>
      {drawPanel(data.cd66b, "cd66b", 0, 228)}
      <line x1="238" y1="40" x2="238" y2={H - 35} stroke={p.line} strokeDasharray="2 4" />
      {drawPanel(data.ctla4, "ctla4", 248, 228)}
    </svg>
  );
}
