// @ts-nocheck
export function PullQuote({ children, color }) {
  return (
    <blockquote style={{
      margin: "3rem -2rem",
      padding: "1rem 1.6rem",
      borderLeft: `3px solid ${color}`,
      background: `color-mix(in oklch, ${color} 5%, transparent)`,
      fontFamily: "var(--f-display)",
      fontSize: "1.95rem",
      lineHeight: 1.2,
      fontStyle: "italic",
      fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 320',
      color: "inherit",
      textWrap: "balance",
      position: "relative",
    }}>
      <span style={{
        position: "absolute",
        top: "0.6rem",
        left: "1.6rem",
        fontFamily: "var(--f-mono)",
        fontSize: "0.65rem",
        letterSpacing: "0.12em",
        color: color,
        opacity: 0.6,
        fontStyle: "normal",
        userSelect: "none",
      }}>// pull</span>
      <span style={{ display: "block", marginTop: "1.2rem" }}>{children}</span>
    </blockquote>
  );
}
