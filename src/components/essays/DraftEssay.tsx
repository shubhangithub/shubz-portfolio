// @ts-nocheck
import React from 'react';
// (no diagram imports needed)

export function DraftEssay({ post, palette: p, onNavigate }) {
  return (
    <>
      <p className="drop-cap" style={{ fontSize: "1.18rem", lineHeight: 1.72, margin: "0 0 1.2rem" }}>
        This essay is in the drawer. The kicker — <em>{post.kicker.replace(/^Essay · /, "").replace(/^Notes · /, "")}</em> — is real, the research is real, the argument is half-formed.
      </p>

      <p>Until I'm willing to defend it in print, here's what it'll cover:</p>

      <p style={{ fontSize: "1.06rem", lineHeight: 1.7, color: p.ink, padding: "1.4rem 1.6rem", borderLeft: `2px solid ${p.accent}`, background: `color-mix(in oklch, ${p.paper} 75%, ${p.ink})`, margin: "1.4rem 0" }}>
        {post.dek}
      </p>

      <h2 className="display" style={{ fontSize: "1.4rem", fontWeight: 400, marginTop: "2.4rem", marginBottom: "1rem", color: p.muted }}>
        While you wait
      </h2>

      <p>You can read <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("essay", "jaya"); }} className="link-underline" style={{ color: p.accent }}>JAYA, improved</a> — published — or have a look at the <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("work"); }} className="link-underline" style={{ color: p.accent }}>annotated CV</a> for the underlying research.</p>

      <p style={{ marginTop: "2.4rem", color: p.muted, fontStyle: "italic", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}` }}>— draft note, last touched {new Date().toISOString().slice(0, 10)}.</p>
    </>
  );
}
