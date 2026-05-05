// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Footer, IndexRail, LetterReveal, PALETTE_V4, POSTS, PreciseNav, SeasonalSpecimen, ThemeToggle, useIsMobile, usePreciseScroll, useTelemetry } from '../legacy';
import { NOW_TICKER } from '../../data/now';

export function HomeV4({ onNavigate, setCursorColor, dark, toggleTheme, palette }) {
  const { useEffect, useState, useRef } = React;
  const p = palette || PALETTE_V4;

  useEffect(() => {
    setCursorColor(p.accent);
    document.body.style.background = p.paper;
  }, []);

  // ticker
  const [tickerIdx, setTickerIdx] = useState(0);
  const ticker = ["~/london", "~/orion · founding-eng", "~/oxford-mfocs", "~/minstp · 2026"];
  useEffect(() => {
    const id = setInterval(() => setTickerIdx(i => (i + 1) % ticker.length), 2400);
    return () => clearInterval(id);
  }, []);

  // live cursor coords + scroll % for instrument margin (throttled)
  const telemetryRow = useTelemetry(); // ['cursor', 'x,y'] desktop · ['viewport', 'WxH'] touch
  const scrollPct = usePreciseScroll();
  const isMobile = useIsMobile();

  // gradient descent state for status copy
  // gdState removed — specimens moved to /now

  // local time tick
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      {/* fixed-grid baseline (desktop only — looks noisy on mobile) */}
      {!isMobile && (
        <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.28 }} />
      )}

      {/* top precision bar */}
      <div style={{ borderBottom: `1px solid ${p.line}`, position: "relative", zIndex: 5, fontFamily: "var(--f-ui)", fontSize: isMobile ? 11 : 12, color: p.muted, padding: isMobile ? "0.5rem 1rem" : "0.7rem 1.6rem", display: "flex", justifyContent: "space-between", alignItems: "center", letterSpacing: "0.04em" }}>
        <span className="mono">Shubz SHARMA</span>
        {!isMobile && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.accent, animation: "blip 2s ease-in-out infinite" }} />
            <span className="mono" style={{ color: p.ink }}>{ticker[tickerIdx]}</span>
          </span>
        )}
        <span style={{ display: "inline-flex", alignItems: "center", gap: isMobile ? 8 : 14 }}>
          {!isMobile && <span className="mono">v.2026.04 · {hh}:{mm}:{ss} GMT</span>}
          <ThemeToggle dark={dark} toggleTheme={toggleTheme} palette={p} />
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} style={{ display: "inline-block", width: 26, height: 26, borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${p.line}`, flexShrink: 0, transition: "border-color 240ms var(--ease-out)" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = p.accent} onMouseLeave={(e) => e.currentTarget.style.borderColor = p.line}>
            <img src="assets/portrait.png" alt="Contact" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </a>
        </span>
        <style>{`@keyframes blip { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
      </div>

      <PreciseNav palette={p} current="home" onNavigate={onNavigate} />

      {/* HERO — 12-col on desktop · single-column stack on mobile */}
      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "1.2rem 1rem 1.6rem" : "2rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>

          {/* col 1-2 — shared IndexRail (matches every other page's rail) */}
          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={0}
              items={["Header", "Recent writing", "Selected builds", "Now ticker"]}
              telemetry={[telemetryRow, ["page", "home"], ["essays", `${POSTS.filter(x => x.slug !== "merger-themes").length} polished`], ["builds", "03"]]}
              scrollPct={scrollPct} />
          </div>

          {/* col 3-9 — portrait + display + lede (or full width on mobile) */}
          <div style={{ gridColumn: isMobile ? "1" : "3 / span 10" }}>
            {/* circle portrait — above title, angled left */}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} style={{ display: "inline-block", width: isMobile ? 44 : 52, height: isMobile ? 44 : 52, borderRadius: "50%", overflow: "hidden", border: `2px solid ${p.line}`, marginBottom: isMobile ? "0.8rem" : "1rem", transform: "rotate(-6deg)", transition: "border-color 240ms var(--ease-out), transform 300ms var(--ease-out)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = p.accent; e.currentTarget.style.transform = "rotate(0deg)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = p.line; e.currentTarget.style.transform = "rotate(-6deg)"; }}>
              <img src="assets/portrait.png" alt="Shubz — click for contact" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </a>
            <div className="ui caps" style={{ color: p.muted, marginBottom: "1rem", fontFamily: "var(--f-ui)", fontSize: 11, letterSpacing: "0.12em" }}>
              <span className="mono" style={{ color: p.accent, marginRight: 8 }}>§01</span>
              Home · the front door
            </div>

            {/* === HERO HARMONISE TRY · 2026-04-29 ============================
                To REVERT to the previous look:
                  1. Delete the two NEW-* blocks below.
                  2. Uncomment the OLD-H1 block (remove the surrounding /‍* and *‍/).
                  3. Uncomment the inner lede paragraph further down (look for OLD-LEDE).
                ============================================================== */}

            {/* OLD-H1 (kept commented for easy revert)
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
              <LetterReveal stagger={22}>Read </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={22} delay={140}>maths and CS</LetterReveal></span>
              <LetterReveal stagger={22} delay={400}> at Oxford. Currently building geospatial ML at Orion, easily </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={22} delay={1900}>distracted</LetterReveal></span>
              <LetterReveal stagger={22} delay={2160}> by other problems.</LetterReveal>
            </h1>
            */}

            {/* NEW-H1 — natural reflow with balanced line breaks */}
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em", textWrap: "balance" }}>
              <LetterReveal stagger={22}>Read </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={22} delay={140}>maths and CS</LetterReveal></span>
              <LetterReveal stagger={22} delay={400}> at Oxford. Currently building geospatial ML at Orion, easily </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={22} delay={1900}>distracted</LetterReveal></span>
              <LetterReveal stagger={22} delay={2160}> by other problems.</LetterReveal>
            </h1>

            {/* NEW-LEDE — pulled into the standard 54ch slot directly under the h1 */}
            <p className="prose" style={{ fontSize: "1.06rem", lineHeight: 1.7, marginTop: "1.4rem", maxWidth: "54ch", color: p.ink }}>
              I'm a founding engineer at <em>Orion</em>, where I build geospatial ML that pays attention to <em>where</em> things happen, and how confidently. Before that I read maths (dabbled in some physics) at Oxford and computer science at FLAME. I am also, in inconvenient order: a Thames rower on Sundays, active in STEM ed outreach, a hobby pianist, a fashion enthusiast, and very into interactive diagrams.
            </p>

            {/* fig.01 — compact square (phase loop only). Full interactive figure lives in the May essay. */}
            <div style={{ marginTop: isMobile ? "1.8rem" : "2rem", width: isMobile ? 240 : 280 }}>
              <SeasonalSpecimen
                width={isMobile ? 240 : 280}
                height={isMobile ? 240 : 280}
                accent={p.accent}
                ink={p.ink}
                muted={p.muted}
                line={p.line}
                compact={true}
              />
              <div className="mono" style={{ marginTop: 8, fontSize: 10, color: p.muted, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span style={{ color: p.ink }}>fig.01 — predator–prey · may</span>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("essay", "may-2026"); }} className="link-underline" style={{ color: p.accent, fontSize: 10 }}>see the math →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WRITING + BUILDS — side by side */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "1.6rem 1rem 2rem" : "2rem 1.6rem 2.4rem", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "3fr 2fr", gap: isMobile ? "2rem" : "2.4rem", alignItems: "start" }}>
          {/* LEFT — essays */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.2rem" }}>
              <h2 className="display" style={{ fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
                <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>02</span>
                Recent writing
              </h2>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("writing"); }} className="caps mono" style={{ color: p.accent, fontSize: 11, letterSpacing: "0.1em" }}>all essays →</a>
            </div>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {POSTS.filter(x => x.slug !== "merger-themes").slice(0, 4).reverse().map((post, i) => (
                <a key={post.slug} href="#" onClick={(e) => { e.preventDefault(); onNavigate("essay", post.slug); }}
                   className="v4-stack-row"
                   style={{ display: "grid", gridTemplateColumns: "36px 1fr 56px", gap: "1rem", alignItems: "baseline", padding: "1rem 0", borderBottom: `1px solid ${p.line}`, color: p.ink }}>
                  <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <span className="link-underline" style={{ fontFamily: "var(--f-body)", fontSize: "1rem" }}>{post.title}</span>
                    <div style={{ fontSize: "0.85rem", color: p.muted, marginTop: 3, fontStyle: "italic", lineHeight: 1.5, maxWidth: "50ch" }}>{post.dek}</div>
                  </div>
                  <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{post.minutes}m</span>
                </a>
              ))}
            </div>
          </div>
          {/* RIGHT — builds */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.2rem" }}>
              <h2 className="display" style={{ fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
                <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>03</span>
                Selected builds
              </h2>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("work"); }} className="caps mono" style={{ color: p.accent, fontSize: 11, letterSpacing: "0.1em" }}>annotated cv →</a>
            </div>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {[
                { name: "fashion-web", role: "ML trend intelligence + LMSR exchange", year: "2026 —", url: "https://fashion-web-psi.vercel.app" },
                { name: "taylor-rec-engine", role: "six recommendation engines", year: "2026", url: "https://shubz-taylor-recommendation-engine.vercel.app" },
                { name: "platypus-learn", role: "AI learning platform", year: "2025 —", url: "https://platypus-learn.vercel.app" },
              ].map((b, i) => (
                <a key={i} href={b.url} target="_blank" rel="noreferrer"
                   className="v4-stack-row"
                   style={{ display: "grid", gridTemplateColumns: "36px 1fr 64px", gap: "1rem", alignItems: "baseline", padding: "1rem 0", borderBottom: `1px solid ${p.line}`, color: p.ink }}>
                  <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <span className="link-underline mono" style={{ color: p.accent, fontSize: 12 }}>{b.name} ↗</span>
                    <div style={{ fontSize: "0.85rem", color: p.muted, marginTop: 3, fontStyle: "italic", lineHeight: 1.5 }}>{b.role}</div>
                  </div>
                  <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{b.year}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOW — horizontal ticker */}
      {(() => {
        const nowItems = NOW_TICKER;
        const tickerContent = [...nowItems, ...nowItems].map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap", paddingRight: isMobile ? "1.6rem" : "2.4rem" }}>
            <span className="mono" style={{ color: p.accent, fontSize: isMobile ? 9 : 10, letterSpacing: "0.12em" }}>{item.kind}</span>
            <span style={{ color: p.ink, fontSize: isMobile ? 11 : 13, fontFamily: "var(--f-ui)" }}>{item.what}</span>
            <span style={{ color: p.muted, fontSize: 11 }}>·</span>
          </span>
        ));
        return (
          <section style={{ position: "relative", zIndex: 2, borderTop: `1px solid ${p.line}`, borderBottom: `1px solid ${p.line}`, overflow: "hidden", cursor: "pointer" }}
                   onClick={(e) => { e.preventDefault(); onNavigate("now"); }}>
            <div style={{ display: "flex", alignItems: "center", padding: "0.9rem 0" }}>
              <div style={{ display: "inline-flex", alignItems: "center", animation: "now-ticker 40s linear infinite", whiteSpace: "nowrap" }}>
                {tickerContent}
              </div>
            </div>
            <style>{`@keyframes now-ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: isMobile ? 40 : 80, background: `linear-gradient(to right, ${p.paper}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: isMobile ? 40 : 80, background: `linear-gradient(to left, ${p.paper}, transparent)`, zIndex: 1, pointerEvents: "none" }} />
            <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onNavigate("now"); }} className="mono link-underline" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", zIndex: 2, fontSize: 10, color: p.accent, background: p.paper, padding: "2px 8px" }}>/now →</a>
          </section>
        );
      })()}

      </main>

      <Footer palette={p} line="Made in London." />
    </div>
  );
}
