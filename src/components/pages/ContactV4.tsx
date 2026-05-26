// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { IndexRail, LetterReveal, PreciseFooter, PreciseNav, PreciseTopBar, TerminalPanel, useIsMobile, usePreciseScroll, useTelemetry, inputStyle, essayMeta } from '../legacy';

export function ContactV4({ palette: p, onNavigate, setCursorColor, dark, toggleTheme }) {
  React.useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; window.scrollTo(0, 0); }, []);
  const [from, setFrom] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sent, setSent] = React.useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!from.trim() || !message.trim()) return;
    const body = `From: ${from}\n\n${message}`;
    window.location.href = `mailto:hello@shubzsharma.com?subject=${encodeURIComponent(subject || "Hi from your site")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }
  const scrollPct = usePreciseScroll();
  const telemetryRow = useTelemetry();
  const isMobile = useIsMobile();

  const channels = [
    { label: "Email",    handle: "hello@shubzsharma.com",       note: "Best — read once a day in the morning.",          href: "mailto:hello@shubzsharma.com" },
    { label: "LinkedIn", handle: "linkedin.com/in/shubhangi-s-sharma", note: "Conventional channel; checked weekly-ish.", href: "https://www.linkedin.com/in/shubhangi-s-sharma/" },
  ];

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.28 }} />
      <PreciseTopBar palette={p} label="~/contact" dark={dark} toggleTheme={toggleTheme} />
      <PreciseNav palette={p} current="contact" onNavigate={onNavigate} />

      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>
          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={0}
              items={["Header", "Channels", "Compose"]}
              telemetry={[telemetryRow, ["page", "contact"], ["channels", String(channels.length).padStart(2, "0")], ["based", "london"]]}
              scrollPct={scrollPct} />
          </div>
          <div style={{ gridColumn: "3 / span 7" }}>
            <div className="ui caps" style={{ color: p.muted, marginBottom: "1rem", fontSize: 11, letterSpacing: "0.12em" }}>
              <span className="mono" style={{ color: "#28CA41", marginRight: 8 }}>§05</span>
              Contact
            </div>
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
              <LetterReveal stagger={26}>Say </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={26} delay={320}>hello.</LetterReveal></span>
              <span style={{ display: "block" }}>
                <LetterReveal stagger={26} delay={620}>I read everything</LetterReveal>
                <span style={{ display: "block" }}>
                  <LetterReveal stagger={26} delay={1080}>eventually.</LetterReveal>
                </span>
              </span>
            </h1>
            <p className="prose" style={{ fontSize: "1.06rem", lineHeight: 1.7, marginTop: "1.4rem", maxWidth: "54ch", color: p.ink }}>
              I prefer email. If you're writing about computational biology, geospatial ML, or music recommendations, you will get a longer reply than you expect.
            </p>
          </div>
          <div className="v4-rail-hide" style={{ gridColumn: "10 / span 3", paddingTop: "0.4rem" }}>
            <TerminalPanel
              label="contact.json"
              rows={[
                ["fig.01", "protocol"],
                ["preferred", "email"],
                ["cadence", "daily"],
                ["reply", "≤72h"],
                ["noise", "low"],
              ]}
              palette={p}
            />
          </div>
        </div>
      </section>

      {/* channels */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: "#28CA41", marginRight: 12 }}>02</span>
            Channels
          </h2>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {channels.map((c, i) => (
                <a key={i} href={c.href} onClick={(e) => { if (c.href === "#") e.preventDefault(); }} className="v4-stack-row" style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 60px", gap: "1.4rem", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline", color: p.ink }}>
                  <span className="caps mono" style={{ color: p.accent, fontSize: 11, letterSpacing: "0.1em" }}>{c.label}</span>
                  <span className="mono link-underline" style={{ fontSize: 13 }}>{c.handle}</span>
                  <span style={{ fontFamily: "var(--f-body)", fontSize: "0.95rem", color: p.muted, fontStyle: "italic" }}>{c.note}</span>
                  <span className="mono" style={{ color: p.accent, fontSize: 11, textAlign: "right" }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* compose box */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: "#28CA41", marginRight: 12 }}>03</span>
            Compose
          </h2>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginTop: "1rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <form onSubmit={handleSubmit} style={{ border: `1px solid ${p.line}`, padding: "1.4rem", background: `color-mix(in oklch, ${p.paper} 85%, ${p.ink})`, fontFamily: "var(--f-ui)" }}>
              <div className="mono caps" style={{ color: p.muted, fontSize: 11, letterSpacing: "0.12em", marginBottom: 12, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "1rem" }}>
                <span>To: hello@shubzsharma.com</span>
                <span></span>
                <span style={{ color: sent ? "#4F7A50" : p.accent }}>{sent ? "● sent" : "● ready"}</span>
              </div>
              {sent ? (
                <div style={{ fontFamily: "var(--f-body)", color: p.muted, fontStyle: "italic", padding: "1rem 0" }}>
                  Your mail client should have opened. If not, write directly to <a href="mailto:hello@shubzsharma.com" style={{ color: p.accent }}>hello@shubzsharma.com</a>.
                </div>
              ) : (
              <div style={{ display: "grid", gap: "0.7rem", fontFamily: "var(--f-body)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", alignItems: "center", borderBottom: `1px solid ${p.line}`, paddingBottom: 8 }}>
                  <span className="mono caps" style={{ color: p.muted, fontSize: 11 }}>From</span>
                  <input required placeholder="your name & email" value={from} onChange={e => setFrom(e.target.value)} style={inputStyle(p)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", alignItems: "center", borderBottom: `1px solid ${p.line}`, paddingBottom: 8 }}>
                  <span className="mono caps" style={{ color: p.muted, fontSize: 11 }}>Subject</span>
                  <input placeholder="what this is about" value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle(p)} />
                </div>
                <div style={{ paddingTop: 6 }}>
                  <textarea required rows="6" placeholder="What would you like to talk about?" value={message} onChange={e => setMessage(e.target.value)} style={{ ...inputStyle(p), width: "100%", resize: "vertical", lineHeight: 1.6 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                  <span className="mono" style={{ fontSize: 11, color: p.muted }}>opens your mail client · spam-screened by hand</span>
                  <button type="submit" style={{ all: "unset", cursor: "pointer", padding: "0.55rem 1rem", border: `1px solid ${p.ink}`, color: p.paper, background: p.ink, fontFamily: "var(--f-ui)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Send →</button>
                </div>
              </div>
              )}
            </form>
          </div>
        </div>
      </section>
      </main>

      <PreciseFooter palette={p} line="Hello back, in time." />
    </div>
  );
}
