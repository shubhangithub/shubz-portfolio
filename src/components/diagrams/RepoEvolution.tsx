// @ts-nocheck
import React, { useState } from 'react';
import { withAlpha } from '../../data/palette';

const OLD_URL = "https://github.com/shubhangithub/shubz-taylor-rec-engine-R";
const NEW_URL = "https://github.com/shubhangithub/updated-shubz-taylor-rec-engine";

const OLD_ROWS = [
  ["language",   "R"],
  ["ui",         "Shiny"],
  ["engines",    "1 (collab filtering)"],
  ["response",   "~2–3 s"],
  ["deploy",     "single-user local"],
  ["year",       "2023"],
];

const NEW_ROWS = [
  ["language",   "Python + TypeScript"],
  ["api",        "FastAPI"],
  ["ui",         "Next.js → Vercel"],
  ["engines",    "6 + ensemble"],
  ["response",   "< 200 ms"],
  ["year",       "2026"],
];

function Panel({ label, path, rows, url, accent, p, active, onEnter, onLeave }) {
  const headerBg = "color-mix(in srgb, #0F1320 94%, transparent)";
  const border = active
    ? `1px solid ${accent}`
    : `1px solid color-mix(in srgb, ${p.line} 70%, ${accent})`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ textDecoration: "none", flex: 1, minWidth: 0, display: "block" }}
    >
      <div style={{
        border,
        borderRadius: 6,
        overflow: "hidden",
        transition: "border-color 200ms, box-shadow 200ms",
        boxShadow: active ? `0 0 0 1px ${withAlpha(accent, "22")}` : "none",
        cursor: "pointer",
      }}>
        {/* traffic lights + path */}
        <div style={{
          background: headerBg,
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: `1px solid ${withAlpha(p.line, "33")}`,
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            {["#FF5F57","#FFBD2E","#28CA41"].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: accent, marginLeft: 4 }}>
            {path}
          </span>
        </div>

        {/* rows */}
        <div style={{ padding: "14px 16px", background: `color-mix(in srgb, ${p.paper} 92%, #0F1320)` }}>
          <div style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            color: p.muted,
            letterSpacing: "0.08em",
            marginBottom: 10,
            textTransform: "uppercase",
          }}>
            {label}
          </div>
          {rows.map(([k, v]) => (
            <div key={k} style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              padding: "4px 0",
              borderBottom: `1px solid ${withAlpha(p.line, "44")}`,
              fontFamily: "var(--f-mono)",
              fontSize: 12,
            }}>
              <span style={{ color: p.muted }}>{k}</span>
              <span style={{ color: p.ink, textAlign: "right" }}>{v}</span>
            </div>
          ))}
          <div style={{
            marginTop: 14,
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            color: active ? accent : p.muted,
            transition: "color 200ms",
          }}>
            → view on github ↗
          </div>
        </div>
      </div>
    </a>
  );
}

export function RepoEvolution({ palette: p }) {
  const [hover, setHover] = useState(null);
  const accent = "#28CA41";

  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
      <Panel
        label="v1 · 2023"
        path="~/taylor-rec-R"
        rows={OLD_ROWS}
        url={OLD_URL}
        accent={accent}
        p={p}
        active={hover === "old"}
        onEnter={() => setHover("old")}
        onLeave={() => setHover(null)}
      />

      {/* middle arrow */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
        gap: 6,
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: "var(--f-mono)",
          fontSize: 10,
          color: p.muted,
          textAlign: "center",
          lineHeight: 1.4,
        }}>
          3 yrs
        </div>
        <div style={{
          width: 1,
          flex: 1,
          maxHeight: 40,
          background: `linear-gradient(to bottom, ${withAlpha(p.line, "00")}, ${p.line}, ${withAlpha(p.line, "00")})`,
        }} />
        <div style={{ color: p.muted, fontSize: 16 }}>↓</div>
        <div style={{
          width: 1,
          flex: 1,
          maxHeight: 40,
          background: `linear-gradient(to bottom, ${withAlpha(p.line, "00")}, ${p.line}, ${withAlpha(p.line, "00")})`,
        }} />
        <div style={{
          fontFamily: "var(--f-mono)",
          fontSize: 10,
          color: p.muted,
          textAlign: "center",
        }}>
          rebuilt
        </div>
      </div>

      <Panel
        label="v2 · 2026"
        path="~/taylor-rec-v2"
        rows={NEW_ROWS}
        url={NEW_URL}
        accent={accent}
        p={p}
        active={hover === "new"}
        onEnter={() => setHover("new")}
        onLeave={() => setHover(null)}
      />
    </div>
  );
}
