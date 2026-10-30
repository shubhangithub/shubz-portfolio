// @ts-nocheck
import { FigureCaption } from "../shared/FigureCaption";

// Derive a short "filename" from the caption for the terminal title bar
function toLabel(caption: string): string {
  if (!caption) return 'figure.py';
  const slug = caption
    .split(/[\s—·,.(]/)[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  return slug ? `${slug}.py` : 'figure.py';
}

export function Figure({ children, caption, palette: p }) {
  const label = toLabel(caption);

  return (
    <figure
      className="v4-figure"
      style={{
        margin: "2.4rem 0",
      }}
    >
      {/* terminal title bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 12px",
        background: "color-mix(in oklch, #0F1320 94%, transparent)",
        border: `1px solid color-mix(in oklch, ${p.line} 80%, #28CA41)`,
        borderBottom: "none",
        borderRadius: "6px 6px 0 0",
      }}>
        {/* traffic lights */}
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28CA41", flexShrink: 0 }} />
        <span style={{
          fontFamily: "var(--f-mono)",
          fontSize: 10,
          color: "#28CA41",
          marginLeft: 8,
          letterSpacing: "0.06em",
          opacity: 0.75,
        }}>
          ~/shubzsharma.com/{label}
        </span>
      </div>

      {/* content area */}
      <div style={{
        background: `color-mix(in srgb, ${p.paper} 88%, ${p.ink})`,
        padding: "1.4rem",
        border: `1px solid color-mix(in oklch, ${p.line} 80%, #28CA41)`,
        borderTop: "none",
        borderRadius: "0 0 4px 4px",
      }}>
        {children}
      </div>

      <FigureCaption color={p.muted}>{caption}</FigureCaption>
    </figure>
  );
}
