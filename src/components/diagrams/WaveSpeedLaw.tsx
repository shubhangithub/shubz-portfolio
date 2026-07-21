// @ts-nocheck
// WaveSpeedLaw — the headline result of Fisher–KPP drawn as a picture.
// Travelling-wave solutions exist for every speed c ≥ c*, but a front
// started from localised (compactly-supported) data settles onto the
// slowest admissible one: c* = 2√(rD). The curve is that minimum; the
// shaded wedge above it is the continuum of faster waves nothing selects.
export function WaveSpeedLaw({ palette: p }) {
  const W = 460, H = 250;
  const left = 40, right = W - 16, top = 18, bottom = 196;
  const rMax = 2.5, cMax = 4.6;
  const X = (r) => left + (r / rMax) * (right - left);
  const Y = (c) => bottom - (c / cMax) * (bottom - top);

  const curve = (D) => {
    const N = 80;
    let d = "";
    for (let i = 0; i <= N; i++) {
      const r = (i / N) * rMax;
      const c = 2 * Math.sqrt(r * D);
      d += `${i ? "L" : "M"}${X(r).toFixed(1)} ${Y(Math.min(c, cMax)).toFixed(1)} `;
    }
    return d;
  };

  // Admissible-speed wedge: above the D = 1 curve, up to the frame top.
  const mainCurve = curve(1);
  const wedge = `${mainCurve} L${X(rMax)} ${top} L${left} ${top} Z`;

  // A marked reference point on the D = 1 curve (r = 1).
  const rMark = 1, cMark = 2 * Math.sqrt(rMark * 1);

  const xticks = [0, 0.5, 1, 1.5, 2, 2.5];
  const yticks = [0, 1, 2, 3, 4];

  return (
    <div className="v4-diagram-pair" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", alignItems: "start" }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
           aria-label="Minimum wave speed c-star equals two times the square root of r times D, plotted against growth rate r for three diffusion values. Faster wave speeds above the curve are admissible but not selected; localised initial data settles on the minimum-speed curve.">
        {/* admissible-speed wedge */}
        <path d={wedge} fill={p.muted} opacity="0.08" />
        <text x={X(1.75)} y={Y(3.9)} fontFamily="var(--f-mono)" fontSize="8.5" fill={p.muted}>waves exist for all c ≥ c*</text>
        <text x={X(1.75)} y={Y(3.55)} fontFamily="var(--f-mono)" fontSize="8.5" fill={p.muted}>(nothing selects them)</text>

        {/* axes */}
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={p.muted} strokeWidth="1" />
        <line x1={left} y1={top} x2={left} y2={bottom} stroke={p.muted} strokeWidth="1" />
        {xticks.map((r) => (
          <g key={`x${r}`}>
            <line x1={X(r)} y1={bottom} x2={X(r)} y2={bottom + 3} stroke={p.muted} strokeWidth="1" />
            <text x={X(r)} y={bottom + 13} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>{r}</text>
          </g>
        ))}
        {yticks.map((c) => (
          <g key={`y${c}`}>
            <line x1={left - 3} y1={Y(c)} x2={left} y2={Y(c)} stroke={p.muted} strokeWidth="1" />
            <text x={left - 5} y={Y(c) + 3} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>{c}</text>
          </g>
        ))}
        <text x={right} y={bottom + 13} textAnchor="end" fontFamily="var(--f-ui)" fontSize="9.5" fill={p.muted}>growth rate r →</text>
        <text x={left - 26} y={(top + bottom) / 2} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="9.5" fill={p.muted} transform={`rotate(-90 ${left - 26} ${(top + bottom) / 2})`}>wave speed c</text>

        {/* faint companion curves for other diffusions */}
        <path d={curve(2)} fill="none" stroke={p.muted} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
        <path d={curve(0.5)} fill="none" stroke={p.muted} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
        <text x={X(2.5) - 2} y={Y(2 * Math.sqrt(2.5 * 2)) + 2} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>D=2</text>
        <text x={X(2.5) - 2} y={Y(2 * Math.sqrt(2.5 * 0.5)) - 3} textAnchor="end" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}>D=0.5</text>

        {/* the selected minimum-speed curve, D = 1 */}
        <path d={mainCurve} fill="none" stroke={p.accent} strokeWidth="2.2" />
        <text x={X(2.32)} y={Y(2 * Math.sqrt(2.32)) - 5} textAnchor="end" fontFamily="var(--f-mono)" fontSize="9" fill={p.accent}>c* = 2√(rD)</text>

        {/* reference marker at r = 1 */}
        <line x1={X(rMark)} y1={bottom} x2={X(rMark)} y2={Y(cMark)} stroke={p.accent} strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
        <line x1={left} y1={Y(cMark)} x2={X(rMark)} y2={Y(cMark)} stroke={p.accent} strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
        <circle cx={X(rMark)} cy={Y(cMark)} r={3.5} fill={p.paper} stroke={p.accent} strokeWidth="1.5" />
        <text x={X(rMark) + 6} y={Y(cMark) - 5} fontFamily="var(--f-mono)" fontSize="8" fill={p.accent}>r=1, D=1 → c*=2</text>
      </svg>

      <div style={{ fontFamily: "var(--f-ui)", fontSize: 12, lineHeight: 1.55 }}>
        <div className="caps mono" style={{ color: p.muted, fontSize: 10, letterSpacing: "0.1em", marginBottom: 8 }}>The selected speed</div>
        <div style={{ fontSize: 11.5, color: p.ink, lineHeight: 1.6 }}>
          A front exists for every speed on or above the curve. But start from a bump of invaders sitting in a sea of zeros, and the wave locks onto the <em>slowest</em> one — <span className="mono" style={{ color: p.accent }}>c* = 2√(rD)</span>.
        </div>
        <div className="mono" style={{ borderTop: `1px solid ${p.line}`, marginTop: 10, paddingTop: 10, fontSize: 10, color: p.muted, lineHeight: 1.6 }}>
          double r → c* ×1.41<br />
          double D → c* ×1.41<br />
          the tip, where u≈0, sets the pace
        </div>
      </div>
    </div>
  );
}
