// @ts-nocheck
import React, { useState } from 'react';

const BRANCHES = [
  {
    id: "outcome",
    label: "Outcome property",
    sublabel: "model doesn't scheme",
    reading: "Alignment readings (Unit 2)",
    color: "#3BAF6A",
    endY: 60,
  },
  {
    id: "security",
    label: "Security posture",
    sublabel: "weights don't leak",
    reading: "RAND (Nevo et al. 2024)",
    color: "#4A7EC7",
    endY: 140,
  },
  {
    id: "resilience",
    label: "Civilisational resilience",
    sublabel: "society absorbs the shock",
    reading: "Buterin (d/acc, Jan 2025)",
    color: "#3AADA8",
    endY: 220,
  },
  {
    id: "capture",
    label: "Industry capture",
    sublabel: "labs deploy word to look responsible",
    reading: "Samuel / Vox (2024) · CAISI rebrand Jun 2025",
    color: "#C04040",
    endY: 300,
    breakNote: "CAISI rebrand\nJun 2025",
  },
];

const W = 680;
const H = 380;
const ENTRY_X = 60;
const FORK_X = 180;
const BREAK_X = 500;
const END_X = 620;
const ENTRY_Y = 190;
const LABEL_W = 155;
const LABEL_H = 42;

function smoothPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

export function SemanticDrift({ palette: p }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", maxWidth: W, height: "auto", display: "block" }}
        fontFamily="var(--f-ui)"
      >
        {/* ── unit labels ── */}
        {[
          { x: ENTRY_X,   label: "Unit 2" },
          { x: FORK_X,    label: "fork" },
          { x: END_X - 10, label: "Units 3–5" },
        ].map(({ x, label }) => (
          <text
            key={label}
            x={x}
            y={22}
            fontSize={9}
            fontFamily="var(--f-mono)"
            fill={p.muted}
            textAnchor="middle"
            letterSpacing="0.05em"
          >
            {label}
          </text>
        ))}

        {/* ── entry strand ── */}
        <line
          x1={ENTRY_X - 30}
          y1={ENTRY_Y}
          x2={FORK_X}
          y2={ENTRY_Y}
          stroke={p.muted}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <text
          x={ENTRY_X - 32}
          y={ENTRY_Y - 8}
          fontSize={11}
          fontFamily="var(--f-mono)"
          fill={p.ink}
          textAnchor="middle"
        >
          safety
        </text>

        {/* ── branches ── */}
        {BRANCHES.map(b => {
          const isHov = b.id === hovered;
          const opacity = hovered === null ? 1 : isHov ? 1 : 0.28;

          // for "capture" branch: draw to break point, then draw dashed remainder
          const mainEndX = b.breakNote ? BREAK_X : END_X;

          return (
            <g
              key={b.id}
              onMouseEnter={() => setHovered(b.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "default", transition: "opacity 180ms" }}
              opacity={opacity}
            >
              {/* main curve */}
              <path
                d={smoothPath(FORK_X, ENTRY_Y, mainEndX, b.endY)}
                fill="none"
                stroke={b.color}
                strokeWidth={isHov ? 3 : 2}
                strokeLinecap="round"
                style={{ transition: "stroke-width 150ms" }}
              />

              {/* break / dashed segment for "capture" */}
              {b.breakNote && (
                <>
                  <path
                    d={smoothPath(BREAK_X, b.endY, END_X, b.endY)}
                    fill="none"
                    stroke={b.color}
                    strokeWidth={isHov ? 2.5 : 1.5}
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    opacity={0.55}
                  />
                  {/* break mark */}
                  <line
                    x1={BREAK_X - 4}
                    y1={b.endY - 9}
                    x2={BREAK_X + 4}
                    y2={b.endY + 9}
                    stroke={b.color}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                  <line
                    x1={BREAK_X}
                    y1={b.endY - 9}
                    x2={BREAK_X + 8}
                    y2={b.endY + 9}
                    stroke={b.color}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                  {/* break annotation */}
                  <text
                    x={BREAK_X + 10}
                    y={b.endY - 12}
                    fontSize={7.5}
                    fontFamily="var(--f-mono)"
                    fill={b.color}
                    letterSpacing="0.03em"
                  >
                    CAISI rebrand
                  </text>
                  <text
                    x={BREAK_X + 10}
                    y={b.endY - 3}
                    fontSize={7.5}
                    fontFamily="var(--f-mono)"
                    fill={b.color}
                    letterSpacing="0.03em"
                  >
                    Jun 2025
                  </text>
                </>
              )}

              {/* label box */}
              <rect
                x={END_X + 4}
                y={b.endY - LABEL_H / 2}
                width={LABEL_W}
                height={LABEL_H}
                rx={2}
                fill={`color-mix(in srgb, ${b.color} 10%, ${p.paper})`}
                stroke={b.color}
                strokeWidth={isHov ? 1.4 : 0.8}
                style={{ transition: "stroke-width 150ms" }}
              />
              <text
                x={END_X + 10}
                y={b.endY - 7}
                fontSize={9.5}
                fontFamily="var(--f-ui)"
                fontWeight="600"
                fill={b.color}
              >
                {b.label}
              </text>
              <text
                x={END_X + 10}
                y={b.endY + 6}
                fontSize={8}
                fontFamily="var(--f-ui)"
                fill={p.muted}
              >
                {b.sublabel}
              </text>

              {/* hover tooltip: reading attribution */}
              {isHov && (
                <g>
                  <rect
                    x={FORK_X + 30}
                    y={b.endY + (b.endY < ENTRY_Y ? -38 : 12)}
                    width={200}
                    height={26}
                    rx={2}
                    fill={p.paper}
                    stroke={b.color}
                    strokeWidth={0.8}
                    opacity={0.97}
                  />
                  <text
                    x={FORK_X + 40}
                    y={b.endY + (b.endY < ENTRY_Y ? -21 : 29)}
                    fontSize={8.5}
                    fontFamily="var(--f-mono)"
                    fill={b.color}
                  >
                    {b.reading}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* ── fork dot ── */}
        <circle cx={FORK_X} cy={ENTRY_Y} r={4} fill={p.muted} opacity={0.6} />

        {/* ── axis line ── */}
        <line
          x1={ENTRY_X - 30}
          y1={H - 24}
          x2={END_X + LABEL_W + 4}
          y2={H - 24}
          stroke={p.line}
          strokeWidth={0.6}
          opacity={0.5}
        />
        <text x={ENTRY_X - 30} y={H - 12} fontSize={8} fontFamily="var(--f-mono)" fill={p.muted}>
          ← reading sequence →
        </text>
      </svg>
    </div>
  );
}
