// @ts-nocheck
import React from 'react';

// A reusable terminal-window info panel for the right-column fig.01 boxes.
// rows: array of [key, value, href?] — href makes the value a link
export function TerminalPanel({ label, rows, palette: p }) {
  return (
    <div>
      {/* terminal title bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        background: "color-mix(in oklch, #0F1320 94%, transparent)",
        border: `1px solid color-mix(in oklch, ${p.line} 70%, #28CA41)`,
        borderBottom: "none",
        borderRadius: "5px 5px 0 0",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F57", flexShrink: 0 }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFBD2E", flexShrink: 0 }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28CA41", flexShrink: 0 }} />
        <span style={{
          fontFamily: "var(--f-mono)",
          fontSize: 9,
          color: "#28CA41",
          marginLeft: 6,
          letterSpacing: "0.06em",
          opacity: 0.75,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          ~/shubzsharma.com/{label}
        </span>
      </div>
      {/* content */}
      <div style={{
        background: `color-mix(in oklch, ${p.paper} 88%, #000000)`,
        border: `1px solid color-mix(in oklch, ${p.line} 70%, #28CA41)`,
        borderTop: "none",
        borderRadius: "0 0 4px 4px",
        padding: "0.6rem 0.7rem",
        fontFamily: "var(--f-mono)",
        fontSize: 11,
        lineHeight: 1.85,
        color: p.muted,
      }}>
        {rows.map(([key, value, href], i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.5rem" }}>
            <span style={{ opacity: 0.65, minWidth: 52 }}>{key}</span>
            {href
              ? <a href={href} target="_blank" rel="noreferrer" className="link-underline" style={{ color: "#28CA41" }}>{value}</a>
              : <span style={{ color: i === 0 ? p.ink : p.muted }}>{value}</span>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
