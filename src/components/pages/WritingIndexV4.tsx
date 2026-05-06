// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { IndexRail, LetterReveal, POSTS, PreciseFooter, PreciseNav, PreciseTopBar, useIsMobile, usePreciseScroll, useTelemetry } from '../legacy';
import { FeaturedPrecise } from './FeaturedPrecise';
import { PreciseEssayRow } from './PreciseEssayRow';

export function WritingIndexV4({ palette: p, onNavigate, setCursorColor, dark, toggleTheme }) {
  React.useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; window.scrollTo(0, 0); }, []);
  const scrollPct = usePreciseScroll();
  const telemetryRow = useTelemetry();
  const isMobile = useIsMobile();

  // earlier writing — real academic publications & posters
  const notes = [
    ["AI Safety Fundamentals", "2023-05", "Essay"],
    ["GNSS Water-Vapour estimation via ML (BSc honours thesis, FLAME)", "2023-05", "thesis note"],
    ["Explainable AI: Decoding protein sequences (research note)", "2023-04", "note"],
    ["Techniques to derive cloud information", "2022-01", "note"],
  ];

  // tag chips — match actual POSTS tags
  const tags = ["all", "ai safety", "physics", "biology", "forecasting", "ml", "nlp", "ecology"];
  const [activeTag, setActiveTag] = React.useState("all");
  const visiblePosts = activeTag === "all" ? POSTS : POSTS.filter(p => p.tag === activeTag);

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.28 }} />

      <PreciseTopBar palette={p} label="~/writing" dark={dark} toggleTheme={toggleTheme} />
      <PreciseNav palette={p} current="writing" onNavigate={onNavigate} />

      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>

          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={0}
              items={["Header", "Lede + count", "Featured", "All essays", "Earlier notes", "Subscribe"]}
              telemetry={[telemetryRow, ["page", "writing"], ["essays", String(POSTS.length).padStart(2, "0")], ["notes", "06"]]}
              scrollPct={scrollPct} />
          </div>

          <div style={{ gridColumn: "3 / span 7" }}>
            <div className="ui caps" style={{ color: p.muted, marginBottom: "1rem", fontFamily: "var(--f-ui)", fontSize: 11, letterSpacing: "0.12em" }}>
              <span className="mono" style={{ color: p.accent, marginRight: 8 }}>§02</span>
              The Garden · essays, notes, half-formed ideas
            </div>
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
              <LetterReveal stagger={26}>An essay garden,</LetterReveal>
              <span style={{ display: "block" }}>
                <LetterReveal stagger={26} delay={520}>growing </LetterReveal>
                <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={26} delay={920}>slowly.</LetterReveal></span>
              </span>
            </h1>
            <p className="prose" style={{ fontSize: "1.06rem", lineHeight: 1.7, marginTop: "1.4rem", maxWidth: "54ch", color: p.ink }}>
              Thinking about my projects, findings, interesting questions, machine learning, and the small obsessions in between. Some pieces are finished; some are still arguing with themselves.
            </p>
          </div>

          <div className="v4-rail-hide" style={{ gridColumn: "10 / span 3", paddingTop: "0.4rem" }}>
            <div className="mono" style={{ fontSize: 11, color: p.muted, lineHeight: 1.8 }}>
              <div style={{ color: p.ink, marginBottom: 4 }}>fig.01 — topics</div>
              {tags.filter(t => t !== "all").map(t => {
                const count = POSTS.filter(post => post.tag === t).length;
                return (
                  <div key={t} style={{ cursor: "pointer", color: activeTag === t ? p.accent : p.muted, display: "flex", justifyContent: "space-between" }} onClick={() => setActiveTag(t)}>
                    <span>{t}</span>
                    <span style={{ opacity: 0.5 }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* tag bar */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "baseline" }}>
          <span className="caps" style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, letterSpacing: "0.12em" }}>Filter</span>
          <div style={{ gridColumn: "3 / span 9", display: "flex", gap: 6, flexWrap: "wrap", fontFamily: "var(--f-ui)", fontSize: 12 }}>
            {tags.map(t => (
              <button key={t} onClick={() => setActiveTag(t)}
                style={{ all: "unset", cursor: "pointer", padding: "4px 10px", border: `1px solid ${activeTag === t ? p.ink : p.line}`, color: activeTag === t ? p.ink : p.muted, background: activeTag === t ? `color-mix(in oklch, ${p.paper} 80%, ${p.ink})` : "transparent", letterSpacing: "0.04em", transition: "all 180ms" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* featured */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2.4rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>03</span>
            Featured
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>currently · {POSTS[0].slug}</span>
        </div>
        <FeaturedPrecise post={POSTS[0]} palette={p} onNavigate={onNavigate} />
      </section>

      {/* full list */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2.4rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>04</span>
            All essays
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>{visiblePosts.length} of {POSTS.length}</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            {visiblePosts.map((post, i) => <PreciseEssayRow key={post.slug} post={post} palette={p} onNavigate={onNavigate} index={i} total={visiblePosts.length} />)}
          </div>
        </div>
      </section>

      {/* earlier notes */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2.4rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>05</span>
            Working notes
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>private until linked</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {notes.map(([t, d, k], i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()} className="v4-stack-row"
                  style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 80px", gap: "1.2rem", alignItems: "baseline", padding: "0.8rem 0", borderBottom: `1px solid ${p.line}`, color: p.ink }}>
                  <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="link-underline" style={{ fontFamily: "var(--f-body)", fontSize: "1rem" }}>{t}</span>
                  <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{d}</span>
                  <span className="mono caps" style={{ color: p.accent, fontSize: 10, letterSpacing: "0.1em", textAlign: "right" }}>{k}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* subscribe */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", borderTop: `1px solid ${p.line}`, paddingTop: "2rem" }}>
          <div className="caps" style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, letterSpacing: "0.12em" }}>Subscribe</div>
          <div style={{ gridColumn: "3 / span 6" }}>
            <div className="display" style={{ fontSize: "1.4rem", fontWeight: 380, lineHeight: 1.3, color: p.ink }}>
              An <em style={{ color: p.accent }}>occasional</em> letter — about one essay per month, no extra noise.
            </div>
            <form onSubmit={(e) => e.preventDefault()} style={{ marginTop: "1.2rem", display: "flex", gap: 0, maxWidth: 460, borderBottom: `1px solid ${p.ink}` }}>
              <input type="email" placeholder="you@somewhere.com" style={{ flex: 1, padding: "0.6rem 0", border: "none", outline: "none", background: "transparent", fontFamily: "var(--f-body)", fontSize: "1rem", color: p.ink }} />
              <button type="submit" className="mono" style={{ all: "unset", cursor: "pointer", padding: "0.6rem 0.4rem", color: p.accent, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Subscribe →</button>
            </form>
            <div style={{ marginTop: "0.8rem", fontFamily: "var(--f-ui)", fontSize: 12, color: p.muted }}>
              One essay roughly per month. No pitch deck, no sponsored slots.
            </div>
          </div>
        </div>
      </section>
      </main>

      <PreciseFooter palette={p} line="Writing is my preferred mode of yapping." />
    </div>
  );
}
