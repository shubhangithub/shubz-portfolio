// @ts-nocheck
import React, { useState } from 'react';

// Depicts a CNOT gate in circuit notation vs its ZX-diagram decomposition,
// then shows the Bell state preparation (H + CNOT on |00⟩) in ZX form.
// Three views: Circuit | ZX diagram | Rewrite (CNOT as bialgebra)

const VIEWS = ["circuit", "zx", "bialgebra"] as const;
const VIEW_LABELS = { circuit: "Circuit", zx: "ZX diagram", bialgebra: "Bialgebra rule" };

// colours
const Z_FILL  = "#4A7A50";  // green = Z-spider
const X_FILL  = "#8A3A3A";  // red   = X-spider
const H_FILL  = "#9A8A30";  // yellow-ish = Hadamard

export function ZXRewrite({ palette: p }) {
  const [view, setView] = useState<typeof VIEWS[number]>("circuit");

  const W = 500, H = 220;
  const q1y = H * 0.35;  // top qubit
  const q2y = H * 0.65;  // bottom qubit

  const btnStyle = (v: string) => ({
    all: "unset" as const, cursor: "pointer",
    padding: "4px 12px",
    fontFamily: "var(--f-mono)", fontSize: 10,
    border: `1px solid ${view === v ? p.accent : p.line}`,
    color: view === v ? p.accent : p.muted,
    borderRadius: 2,
    transition: "all 200ms",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {VIEWS.map(v => <button key={v} style={btnStyle(v)} onClick={() => setView(v)}>{VIEW_LABELS[v]}</button>)}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>

        {/* ── CIRCUIT VIEW ── */}
        {view === "circuit" && (
          <>
            {/* qubit labels */}
            <text x={12} y={q1y + 4} fontFamily="var(--f-mono)" fontSize="11" fill={p.ink}>|0⟩</text>
            <text x={12} y={q2y + 4} fontFamily="var(--f-mono)" fontSize="11" fill={p.ink}>|0⟩</text>

            {/* wires */}
            <line x1={40} y1={q1y} x2={W - 20} y2={q1y} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />
            <line x1={40} y1={q2y} x2={W - 20} y2={q2y} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />

            {/* H gate on qubit 1 */}
            <rect x={80} y={q1y - 16} width={32} height={32} rx={3}
              fill={H_FILL} fillOpacity="0.85" stroke={H_FILL} strokeWidth="1" />
            <text x={96} y={q1y + 5} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--f-mono)" fontSize="11" fontWeight="600" fill="white">H</text>

            {/* CNOT — control dot on q1, target circle on q2 */}
            <circle cx={200} cy={q1y} r={6} fill={p.ink} />
            <line x1={200} y1={q1y + 6} x2={200} y2={q2y - 18} stroke={p.ink} strokeWidth="1.5" />
            <circle cx={200} cy={q2y} r={18} fill="transparent" stroke={p.ink} strokeWidth="1.5" />
            <line x1={200 - 12} y1={q2y} x2={200 + 12} y2={q2y} stroke={p.ink} strokeWidth="1.5" />
            <line x1={200} y1={q2y - 12} x2={200} y2={q2y + 12} stroke={p.ink} strokeWidth="1.5" />

            {/* output label */}
            <text x={W - 16} y={q1y - 10} textAnchor="end" fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>|Φ+⟩</text>
            <text x={W - 16} y={q2y - 10} textAnchor="end" fontFamily="var(--f-mono)" fontSize="9" fill={p.muted}>(Bell)</text>

            {/* gate labels */}
            <text x={96} y={q1y + 30} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="9" fill={p.muted}>Hadamard</text>
            <text x={200} y={q1y - 20} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="9" fill={p.muted}>CNOT</text>

            <text x={W / 2} y={H - 14} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="10" fill={p.muted}>
              Standard circuit: |Φ+⟩ = (H ⊗ I) · CNOT · |00⟩
            </text>
          </>
        )}

        {/* ── ZX DIAGRAM VIEW ── */}
        {view === "zx" && (
          <>
            {/* input wires */}
            <text x={12} y={q1y + 4} fontFamily="var(--f-mono)" fontSize="11" fill={p.ink}>|0⟩</text>
            <text x={12} y={q2y + 4} fontFamily="var(--f-mono)" fontSize="11" fill={p.ink}>|0⟩</text>
            <line x1={40} y1={q1y} x2={110} y2={q1y} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />
            <line x1={40} y1={q2y} x2={260} y2={q2y} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />

            {/* Z-spider (green) on q1 — represents the "copy" in Z basis */}
            <circle cx={130} cy={q1y} r={18} fill={Z_FILL} fillOpacity={0.85} stroke={Z_FILL} strokeWidth="1.5" />
            <text x={130} y={q1y + 4} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--f-mono)" fontSize="9" fill="white">Z</text>

            {/* Hadamard box on q1 after Z-spider */}
            <line x1={148} y1={q1y} x2={200} y2={q1y} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />
            <rect x={200} y={q1y - 12} width={26} height={24} rx={2}
              fill={H_FILL} fillOpacity={0.85} stroke={H_FILL} strokeWidth="1" />
            <text x={213} y={q1y + 4} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--f-mono)" fontSize="9" fontWeight="600" fill="white">H</text>

            {/* wire from H to X-spider */}
            <line x1={226} y1={q1y} x2={280} y2={q1y} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />

            {/* X-spider (red) on q1 — the control side of CNOT */}
            <circle cx={300} cy={q1y} r={18} fill={X_FILL} fillOpacity={0.85} stroke={X_FILL} strokeWidth="1.5" />
            <text x={300} y={q1y + 4} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--f-mono)" fontSize="9" fill="white">X</text>

            {/* vertical wire connecting X-spider (control) to Z-spider (target) */}
            <line x1={300} y1={q1y + 18} x2={300} y2={q2y - 18} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />

            {/* Z-spider (green) on q2 — the copy/target */}
            <circle cx={300} cy={q2y} r={18} fill={Z_FILL} fillOpacity={0.85} stroke={Z_FILL} strokeWidth="1.5" />
            <text x={300} y={q2y + 4} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--f-mono)" fontSize="9" fill="white">Z</text>

            {/* output wires */}
            <line x1={318} y1={q1y} x2={W - 20} y2={q1y} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />
            <line x1={318} y1={q2y} x2={W - 20} y2={q2y} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />

            {/* labels */}
            <text x={130} y={q1y + 34} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="9" fill={Z_FILL} opacity="0.8">Z-spider (copy)</text>
            <text x={213} y={q1y - 22} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="9" fill={H_FILL} opacity="0.8">Hadamard</text>
            <text x={300} y={q1y - 26} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="9" fill={X_FILL} opacity="0.8">X-spider</text>
            <text x={300} y={q2y + 34} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="9" fill={Z_FILL} opacity="0.8">Z-spider</text>

            <text x={W / 2} y={H - 14} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="10" fill={p.muted}>
              ZX: green = Z-basis · red = X-basis · yellow = Hadamard
            </text>
          </>
        )}

        {/* ── BIALGEBRA VIEW ── */}
        {view === "bialgebra" && (
          <>
            {/* LHS: green spider copying into two, red spider receiving */}
            {/* Green spider */}
            <circle cx={120} cy={H / 2} r={20} fill={Z_FILL} fillOpacity={0.85} stroke={Z_FILL} strokeWidth="1.5" />
            <text x={120} y={H / 2 + 4} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--f-mono)" fontSize="9" fill="white">Z</text>

            {/* input wire to green */}
            <line x1={40} y1={H / 2} x2={100} y2={H / 2} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />
            {/* two output wires from green to two X-spiders */}
            <line x1={140} y1={H / 2 - 8} x2={200} y2={H / 2 - 40} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />
            <line x1={140} y1={H / 2 + 8} x2={200} y2={H / 2 + 40} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />

            {/* two X-spiders */}
            <circle cx={218} cy={H / 2 - 44} r={16} fill={X_FILL} fillOpacity={0.85} stroke={X_FILL} strokeWidth="1.5" />
            <text x={218} y={H / 2 - 40} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--f-mono)" fontSize="9" fill="white">X</text>
            <circle cx={218} cy={H / 2 + 44} r={16} fill={X_FILL} fillOpacity={0.85} stroke={X_FILL} strokeWidth="1.5" />
            <text x={218} y={H / 2 + 48} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--f-mono)" fontSize="9" fill="white">X</text>

            {/* equals sign */}
            <text x={270} y={H / 2 + 5} textAnchor="middle" fontFamily="var(--f-mono)" fontSize="18" fill={p.muted}>=</text>

            {/* RHS: X-spider copying, feeding into two Z-spiders */}
            <line x1={310} y1={H / 2 - 40} x2={340} y2={H / 2} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />
            <line x1={310} y1={H / 2 + 40} x2={340} y2={H / 2} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />

            <circle cx={290} cy={H / 2 - 44} r={16} fill={X_FILL} fillOpacity={0.85} stroke={X_FILL} strokeWidth="1.5" />
            <text x={290} y={H / 2 - 40} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--f-mono)" fontSize="9" fill="white">X</text>
            <circle cx={290} cy={H / 2 + 44} r={16} fill={X_FILL} fillOpacity={0.85} stroke={X_FILL} strokeWidth="1.5" />
            <text x={290} y={H / 2 + 48} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--f-mono)" fontSize="9" fill="white">X</text>

            <circle cx={360} cy={H / 2} r={20} fill={Z_FILL} fillOpacity={0.85} stroke={Z_FILL} strokeWidth="1.5" />
            <text x={360} y={H / 2 + 4} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--f-mono)" fontSize="9" fill="white">Z</text>
            <line x1={380} y1={H / 2} x2={W - 20} y2={H / 2} stroke={p.ink} strokeWidth="1.2" opacity="0.4" />

            <text x={W / 2} y={H - 14} textAnchor="middle" fontFamily="var(--f-ui)" fontSize="10" fill={p.muted}>
              Bialgebra: a green spider copying a red spider = a red spider copied by green
            </text>
          </>
        )}
      </svg>

      <div style={{ fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, lineHeight: 1.5 }}>
        {view === "circuit" && "The standard quantum circuit: Hadamard puts qubit 1 into superposition; CNOT entangles it with qubit 2. You can follow every gate — and still not see why entanglement is happening."}
        {view === "zx" && "The ZX-diagram exposes the causal structure. Green nodes (Z-spiders) copy in the computational basis. Red nodes (X-spiders) copy in the Hadamard basis. The vertical wire is the entanglement."}
        {view === "bialgebra" && "The bialgebra rule: a Z-spider copying an X-spider can be rewritten the other way around. This single rule underlies why CNOT behaves differently on Z-basis and X-basis inputs — and why quantum teleportation works."}
      </div>
    </div>
  );
}
