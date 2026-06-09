// @ts-nocheck
import React, { useState } from 'react';

const W = 560, H = 340, PAD = { top: 30, right: 30, bottom: 48, left: 44 };
const X_MIN = 2020, X_MAX = 2028;
const Y_MIN = 0, Y_MAX = 1;

function toSvgX(year: number) {
  return PAD.left + ((year - X_MIN) / (X_MAX - X_MIN)) * (W - PAD.left - PAD.right);
}
function toSvgY(v: number) {
  return PAD.top + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.top - PAD.bottom);
}

// Aschenbrenner OOM curve — accelerating exponential-ish
function aschenbrennerPath() {
  const pts: [number, number][] = [];
  for (let x = 2020; x <= 2027.2; x += 0.1) {
    const t = (x - 2020) / 7;
    const y = Math.min(0.96, 0.02 + 0.94 * Math.pow(t, 2.2));
    pts.push([x, y]);
  }
  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`).join(" ");
}

// Erdil flat revenue line — horizontal at ~0.42
function erdilPath() {
  const y = 0.42;
  return `M${toSvgX(2020)},${toSvgY(y)} L${toSvgX(2028)},${toSvgY(y)}`;
}

// AI 2027 S-curve — relatively flat 2020-2024, steep 2025-2027
function ai2027Path() {
  const pts: [number, number][] = [];
  for (let x = 2020; x <= 2027.5; x += 0.08) {
    const t = (x - 2023.5) * 2.2;
    const y = 0.08 + 0.88 / (1 + Math.exp(-t));
    pts.push([x, y]);
  }
  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`).join(" ");
}

const ANCHORS = [
  {
    id: "openai-arr",
    label: "OpenAI $25B ARR",
    year: 2026.2,
    y: 0.64,
    tooltip: "OpenAI crossed $25B annualised revenue (end-February 2026). Extraordinary growth — but driven by quantity of inference compute, not revenue-per-unit.",
  },
  {
    id: "metr-horizon",
    label: "METR horizon ~12h",
    year: 2026.1,
    y: 0.46,
    tooltip: "METR Time Horizon 1.1 (Jan 2026): frontier models complete tasks up to ~12h human-equivalent at 50% reliability. Doubling time ~131 days.",
  },
  {
    id: "arc-agi-2",
    label: "ARC-AGI-2: 84.6%",
    year: 2026.2,
    y: 0.88,
    tooltip: "Gemini 3 Deep Think scored 84.6% on ARC-AGI-2 (Feb 2026) — above the ~60% human average. Scalar capability looks high.",
  },
  {
    id: "arc-agi-3",
    label: "ARC-AGI-3: 0.37%",
    year: 2026.3,
    y: 0.05,
    tooltip: "Same model, ARC-AGI-3 (Mar 2026): 0.37%. Humans score 100%. Capability collapses on novelty. Same model, same season, opposite verdict.",
  },
];

export function TimelineAnchors({ palette: p }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const hovAnchor = ANCHORS.find(a => a.id === hovered);

  // tick years
  const xTicks = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];

  // ARC pair — draw dashed vertical between them
  const arcHigh = ANCHORS.find(a => a.id === "arc-agi-2")!;
  const arcLow  = ANCHORS.find(a => a.id === "arc-agi-3")!;
  const arcMidX = toSvgX((arcHigh.year + arcLow.year) / 2);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.6rem" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }} role="img" aria-label="Predictions vs mid-2026 reality timeline">

        {/* background grid */}
        {xTicks.map(yr => (
          <line key={yr}
            x1={toSvgX(yr)} y1={PAD.top}
            x2={toSvgX(yr)} y2={H - PAD.bottom}
            stroke={p.line} strokeWidth="1" strokeDasharray="2 4" opacity="0.5"
          />
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <line key={v}
            x1={PAD.left} y1={toSvgY(v)}
            x2={W - PAD.right} y2={toSvgY(v)}
            stroke={p.line} strokeWidth="1" strokeDasharray="2 4" opacity="0.35"
          />
        ))}

        {/* x axis */}
        <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke={p.line} strokeWidth="1" />
        {xTicks.map(yr => (
          <text key={yr}
            x={toSvgX(yr)} y={H - PAD.bottom + 14}
            textAnchor="middle" fontFamily="var(--f-mono)" fontSize="8.5" fill={p.muted}
          >{yr}</text>
        ))}

        {/* y axis label */}
        <text
          x={PAD.left - 8} y={(PAD.top + H - PAD.bottom) / 2}
          textAnchor="middle" fontFamily="var(--f-mono)" fontSize="8" fill={p.muted}
          transform={`rotate(-90, ${PAD.left - 8}, ${(PAD.top + H - PAD.bottom) / 2})`}
        >capability / revenue index</text>

        {/* Aschenbrenner OOM curve */}
        <path d={aschenbrennerPath()} fill="none" stroke="#6A8FD0" strokeWidth="2" strokeDasharray="none" opacity="0.8" />
        <text x={toSvgX(2026.6)} y={toSvgY(0.82)} fontFamily="var(--f-ui)" fontSize="9" fill="#6A8FD0" textAnchor="start">Aschenbrenner</text>
        <text x={toSvgX(2026.6)} y={toSvgY(0.82) + 11} fontFamily="var(--f-ui)" fontSize="8" fill="#6A8FD0" opacity="0.75" textAnchor="start">OOM scaling</text>

        {/* Erdil flat line */}
        <path d={erdilPath()} fill="none" stroke="#A07850" strokeWidth="1.8" strokeDasharray="6 3" opacity="0.8" />
        <text x={toSvgX(2027.1)} y={toSvgY(0.42) - 5} fontFamily="var(--f-ui)" fontSize="9" fill="#A07850" textAnchor="start">Erdil</text>
        <text x={toSvgX(2027.1)} y={toSvgY(0.42) + 7} fontFamily="var(--f-ui)" fontSize="8" fill="#A07850" opacity="0.75" textAnchor="start">$10K/H100 flat</text>

        {/* AI 2027 S-curve */}
        <path d={ai2027Path()} fill="none" stroke="#7A8A5A" strokeWidth="2" strokeDasharray="none" opacity="0.75" />
        <text x={toSvgX(2021.2)} y={toSvgY(0.16)} fontFamily="var(--f-ui)" fontSize="9" fill="#7A8A5A" textAnchor="start">AI 2027</text>
        <text x={toSvgX(2021.2)} y={toSvgY(0.16) + 11} fontFamily="var(--f-ui)" fontSize="8" fill="#7A8A5A" opacity="0.75" textAnchor="start">capability S-curve</text>

        {/* dashed vertical connecting ARC-AGI-2 and ARC-AGI-3 */}
        <line
          x1={toSvgX(arcHigh.year)} y1={toSvgY(arcHigh.y)}
          x2={toSvgX(arcLow.year)}  y2={toSvgY(arcLow.y)}
          stroke="#C44" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.75"
        />
        <text
          x={toSvgX((arcHigh.year + arcLow.year) / 2) + 5}
          y={(toSvgY(arcHigh.y) + toSvgY(arcLow.y)) / 2}
          fontFamily="var(--f-mono)" fontSize="7.5" fill="#C44" opacity="0.85"
          textAnchor="start"
        >same model,</text>
        <text
          x={toSvgX((arcHigh.year + arcLow.year) / 2) + 5}
          y={(toSvgY(arcHigh.y) + toSvgY(arcLow.y)) / 2 + 10}
          fontFamily="var(--f-mono)" fontSize="7.5" fill="#C44" opacity="0.85"
          textAnchor="start"
        >same season</text>

        {/* mid-2026 anchor dots */}
        {ANCHORS.map(a => {
          const cx = toSvgX(a.year);
          const cy = toSvgY(a.y);
          const isHov = hovered === a.id;
          return (
            <g key={a.id}
              onMouseEnter={() => setHovered(a.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={cx} cy={cy}
                r={isHov ? 8.5 : 5.5}
                fill={p.accent}
                fillOpacity={isHov ? 0.85 : 0.5}
                stroke={p.accent}
                strokeWidth={isHov ? 1.8 : 1.1}
                style={{ transition: "r 180ms, fill-opacity 180ms" }}
              />
              <text
                x={cx}
                y={cy - 10}
                textAnchor="middle"
                fontFamily="var(--f-ui)" fontSize="8.5"
                fill={isHov ? p.ink : p.muted}
                fontWeight={isHov ? "600" : "400"}
                style={{ transition: "fill 180ms" }}
              >{a.label}</text>
            </g>
          );
        })}

        {/* "mid-2026 anchors" label */}
        <text x={toSvgX(2026.5)} y={PAD.top + 10} fontFamily="var(--f-mono)" fontSize="8" fill={p.muted} textAnchor="middle" opacity="0.7">↑ mid-2026 anchors</text>

      </svg>

      {/* tooltip panel */}
      <div style={{
        minHeight: 54,
        padding: "0.55rem 0.75rem",
        border: `1px solid ${p.line}`,
        background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`,
        borderRadius: 3,
        fontFamily: "var(--f-ui)",
        fontSize: 11,
        lineHeight: 1.58,
        color: hovAnchor ? p.ink : p.muted,
        transition: "color 180ms",
      }}>
        {hovAnchor
          ? <><strong style={{ color: p.accent }}>{hovAnchor.label} </strong>{hovAnchor.tooltip}</>
          : "Hover a dot to read the mid-2026 data point."
        }
      </div>
    </div>
  );
}
