// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { IndexRail, LetterReveal, PreciseFooter, PreciseNav, PreciseTopBar, TerminalPanel, useIsMobile, usePreciseScroll, useTelemetry } from '../legacy';
import { CONDITIONS, FOCUSES, JOURNAL } from '../../data/now';

export function NowV4({ palette: p, onNavigate, setCursorColor, dark, toggleTheme }) {
  React.useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; window.scrollTo(0, 0); }, []);
  const scrollPct = usePreciseScroll();
  const telemetryRow = useTelemetry();
  const isMobile = useIsMobile();

  const focuses = FOCUSES;
  const journal = JOURNAL;

  // weather/london mock telemetry
  const localTime = new Date();
  const tempC = 11 + Math.round((Math.sin(localTime.getDate() / 5)) * 2);
  const rainPct = 30 + Math.round(Math.cos(localTime.getDate() / 3) * 20);

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.28 }} />
      <PreciseTopBar palette={p} label="~/now" dark={dark} toggleTheme={toggleTheme} />
      <PreciseNav palette={p} current="now" onNavigate={onNavigate} />

      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>
          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={0}
              items={["Header", "Right now", "Field journal", "Conditions"]}
              telemetry={[telemetryRow, ["page", "now"], ["entries", String(journal.length).padStart(2, "0")], ["focuses", String(focuses.length).padStart(2, "0")]]}
              scrollPct={scrollPct} />
          </div>
          <div style={{ gridColumn: "3 / span 7" }}>
            <div className="ui caps" style={{ color: p.muted, marginBottom: "1rem", fontSize: 11, letterSpacing: "0.12em" }}>
              <span className="mono" style={{ color: "#28CA41", marginRight: 8 }}>§04</span>
              Now · field journal · updated weekly-ish
            </div>
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
              <LetterReveal stagger={26}>What I'm </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={26} delay={420}>actually</LetterReveal></span>
              <span style={{ display: "block" }}>
                <LetterReveal stagger={26} delay={760}>doing this week.</LetterReveal>
              </span>
            </h1>
            <p className="prose" style={{ fontSize: "1.06rem", lineHeight: 1.7, marginTop: "1.4rem", maxWidth: "54ch", color: p.ink }}>
              What I'm doing <a className="link-underline" style={{ color: p.accent }} href="https://nownownow.com/about" target="_blank" rel="noreferrer">/now</a>. What's on my plate, what I'm reading, where my attention is going.
            </p>
          </div>
          <div className="v4-rail-hide" style={{ gridColumn: "10 / span 3", paddingTop: "0.4rem" }}>
            <TerminalPanel
              label="now.json"
              rows={[
                ["fig.01", "london"],
                ["temp", `${tempC}°C`],
                ["rain", `${rainPct}%`],
                ["updated", new Date().toISOString().slice(0,10).split('-').reverse().join('/')],
              ]}
              palette={p}
            />
          </div>
        </div>
      </section>

      {/* right now */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: "#28CA41", marginRight: 12 }}>02</span>
            Right now
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>five concurrent threads</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {focuses.map((f, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "120px 1fr 60px", gap: isMobile ? "0.3rem" : "1.4rem", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline" }}>
                  <div style={{ display: isMobile ? "flex" : "contents", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span className="caps mono" style={{ color: p.accent, fontSize: 11, letterSpacing: "0.1em" }}>{f.kind}</span>
                    {isMobile && <span className="mono" style={{ color: p.muted, fontSize: 11 }}>0{i + 1}/0{focuses.length}</span>}
                  </div>
                  <span style={{ fontFamily: "var(--f-body)", fontSize: "1.02rem", color: p.ink, lineHeight: 1.55 }}>{f.what}</span>
                  {!isMobile && <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>0{i + 1}/0{focuses.length}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* field journal */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: "#28CA41", marginRight: 12 }}>03</span>
            Field journal
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>shortest entry · 1 line</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {journal.map((j, i) => (
                <div key={i} className="v4-stack-row" style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "1.4rem", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline" }}>
                  <span className="mono" style={{ color: p.muted, fontSize: 12 }}>{j.date}</span>
                  <span style={{ fontFamily: "var(--f-body)", fontSize: "1rem", color: p.ink, lineHeight: 1.6 }}>{j.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* conditions */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", borderTop: `1px solid ${p.line}`, paddingTop: "2rem" }}>
          <div className="caps" style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, letterSpacing: "0.12em" }}>Conditions</div>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
              {CONDITIONS.map(({ k, v, sub }, i) => {
                const dotColors = [p.accent, "#FFBD2E", "#28CA41", "#FF5F57"];
                return (
                  <div key={i} style={{ borderRadius: 4, overflow: "hidden" }}>
                    {/* mini terminal header */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 5, padding: "5px 8px",
                      background: "color-mix(in oklch, #0F1320 94%, transparent)",
                      border: `1px solid color-mix(in oklch, ${p.line} 70%, #28CA41)`,
                      borderBottom: "none",
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColors[i] || "#28CA41", flexShrink: 0 }} />
                      <span className="caps mono" style={{ fontSize: 9, color: "#28CA41", letterSpacing: "0.1em", opacity: 0.8 }}>{k}</span>
                    </div>
                    {/* content */}
                    <div style={{
                      padding: "0.6rem 0.7rem",
                      background: `color-mix(in oklch, ${p.paper} 88%, #000000)`,
                      border: `1px solid color-mix(in oklch, ${p.line} 70%, #28CA41)`,
                      borderTop: "none",
                    }}>
                      <div style={{ color: p.ink, fontFamily: "var(--f-display)", fontSize: "1.25rem", fontWeight: 380, fontStyle: "italic", lineHeight: 1.2 }}>{v}</div>
                      <div style={{ color: p.muted, fontFamily: "var(--f-mono)", fontSize: 10, marginTop: 5 }}>{sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      </main>

      <PreciseFooter palette={p} line="A snapshot, not a profile." />
    </div>
  );
}
