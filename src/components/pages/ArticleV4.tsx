// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { BluedotEssay, ConstraintClusterEssay, DraftEssay, FashionEssay, FourierMotif, IndexRail, JayaEssay, LetterReveal, MayEssay, POSTS, PreciseFooter, PreciseNav, PreciseTopBar, ReadingRuler, SixEnginesEssay, ThresholdEssay, ZXEssay, essayMeta, useIsMobile, usePreciseScroll, useTelemetry } from '../legacy';
import { PreciseEssayRow } from './PreciseEssayRow';

export function ArticleV4({ slug, palette: p, onNavigate, setCursorColor, dark, toggleTheme }) {
  React.useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; window.scrollTo(0, 0); }, [slug]);
  const scrollPct = usePreciseScroll();
  const telemetryRow = useTelemetry();
  const isMobile = useIsMobile();
  const post = POSTS.find(x => x.slug === slug) || POSTS[0];

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.18 }} />
      <ReadingRuler color={p.accent} />
      <PreciseTopBar palette={p} label={`~/writing/${slug}`} dark={dark} toggleTheme={toggleTheme} />
      <PreciseNav palette={p} current="writing" onNavigate={onNavigate} />

      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      {/* metadata strip — compact 2 rows on mobile, full 12-col on desktop */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "1rem 1rem 0" : "1.4rem 1.6rem 0", position: "relative", zIndex: 2, fontFamily: "var(--f-ui)", fontSize: 12 }}>
        {isMobile ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", color: p.muted, paddingBottom: "0.6rem", borderBottom: `1px dashed ${p.line}`, gap: "0.6rem" }}>
            <span className="mono" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>essay · {post.minutes} min · ~{Math.round(post.minutes * 240)} words</span>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("writing"); }} className="link-underline" style={{ color: p.accent, whiteSpace: "nowrap" }}>↤ index</a>
          </div>
        ) : (
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", color: p.muted, paddingBottom: "0.8rem", borderBottom: `1px dashed ${p.line}` }}>
          <span style={{ gridColumn: "1 / span 2" }} className="mono">essay · 01 of 03</span>
          <span style={{ gridColumn: "3 / span 3" }}>{post.kicker}</span>
          <span style={{ gridColumn: "6 / span 2" }}>April 2026</span>
          <span style={{ gridColumn: "8 / span 2" }} className="mono">~{Math.round(post.minutes * 240)} words · {post.minutes} min</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("writing"); }} style={{ gridColumn: "10 / span 3", textAlign: "right", color: p.accent }} className="link-underline">↤ back to index</a>
        </div>
        )}
      </section>

      {/* HEADER — 12-col, asymmetric */}
      <header style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "end" }}>
          <div style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, lineHeight: 1.7 }}>
            <div className="caps mono" style={{ marginBottom: 8 }}>fig.01</div>
            <div>title</div>
            <div style={{ color: p.ink }}>{post.title.toLowerCase()}</div>
            <div style={{ marginTop: 12 }}>kind</div>
            <div style={{ color: p.ink }}>standalone essay</div>
            <div style={{ marginTop: 12 }}>tags</div>
            <div style={{ color: p.ink }}>{essayMeta(post.slug).tags}</div>
          </div>
          <div style={{ gridColumn: "3 / span 7" }}>
            <h1 className="display" style={{ fontSize: "clamp(4rem, 9vw, 8rem)", margin: 0, fontWeight: 360, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
              <LetterReveal stagger={32}>{post.title}</LetterReveal>
            </h1>
            <p style={{ fontSize: "1.35rem", lineHeight: 1.5, marginTop: "1.6rem", maxWidth: "44ch", color: p.muted, fontStyle: "italic", fontFamily: "var(--f-display)", fontWeight: 360 }}>
              {post.dek}
            </p>
          </div>
          <div style={{ gridColumn: "10 / span 3", paddingBottom: "0.6rem" }}>
            <div style={{ border: `1px solid ${p.line}`, padding: "0.8rem", aspectRatio: "1 / 1", display: "grid", placeItems: "center", background: `color-mix(in oklch, ${p.paper} 85%, ${p.ink})` }}>
              <FourierMotif shape={post.illustration === "wave" ? "wave" : "hex"} size={200} density={26} strokeColor={p.accent} trailColor={`color-mix(in oklch, ${p.accent} 50%, transparent)`} epicycleColor={`color-mix(in oklch, ${p.ink} 8%, transparent)`} />
            </div>
            <div className="mono" style={{ marginTop: 10, color: p.muted, fontSize: 10, display: "flex", justifyContent: "space-between" }}>
              <span>fig.02 — fourier({post.illustration || "hex"})</span>
              <span>26 epi.</span>
            </div>
          </div>
        </div>
      </header>

      {/* author strip */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "1.4rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", paddingTop: "1.4rem", borderTop: `1px solid ${p.line}`, fontFamily: "var(--f-ui)", fontSize: 13, color: p.muted, alignItems: "baseline" }}>
          <span style={{ gridColumn: "1 / span 2" }} className="caps mono">By</span>
          <span style={{ gridColumn: "3 / span 5", color: p.ink }}>Shubz Sharma · founding-eng @ Orion · London</span>
          <span style={{ gridColumn: "8 / span 2" }} className="mono">first published · 2026.04.18</span>
          <span style={{ gridColumn: "10 / span 3", textAlign: "right" }}>
            {(() => {
              const [copied, setCopied] = React.useState(false);
              return (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                  }}
                  className="mono"
                  style={{ all: "unset", cursor: "pointer", fontSize: 11, color: copied ? "#4F7A50" : p.accent, letterSpacing: "0.04em", transition: "color 200ms" }}
                >
                  {copied ? "✓ link copied" : "share ↗"}
                </button>
              );
            })()}
          </span>
        </div>
      </section>

      {/* BODY — proper 12-col, body in 7, telemetry in left rail */}
      <article className="prose" style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 4rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>

          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={1}
              items={essayMeta(post.slug).toc}
              telemetry={[telemetryRow, ["essay", `${String(POSTS.findIndex(x => x.slug === post.slug) + 1).padStart(2, "0")}/${String(POSTS.length).padStart(2, "0")}`], ["read", `${post.minutes} min`], ["sidenotes", String(essayMeta(post.slug).sidenotes).padStart(2, "0")]]}
              scrollPct={scrollPct} />
          </div>

          <div style={{ gridColumn: "3 / span 7" }}>
            {(() => {
              switch (post.slug) {
                case "jaya": return <JayaEssay palette={p} />;
                case "threshold-gate": return <ThresholdEssay palette={p} />;
                case "constraint-clustering": return <ConstraintClusterEssay palette={p} />;
                case "six-engines": return <SixEnginesEssay palette={p} />;
                case "fashion-trends": return <FashionEssay palette={p} />;
                case "may-2026": return <MayEssay palette={p} />;
                case "zx-calculus": return <ZXEssay palette={p} />;
                case "bluedot-unit1": return <BluedotEssay palette={p} />;
                default: return <DraftEssay post={post} palette={p} onNavigate={onNavigate} />;
              }
            })()}
          </div>

          {/* right rail on desktop · "Endnotes" block at the bottom on mobile */}
          <aside style={{ gridColumn: isMobile ? "1 / -1" : "11 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, lineHeight: 1.7, position: isMobile ? "static" : "sticky", top: "1.2rem", marginTop: isMobile ? "2.4rem" : 0, paddingTop: isMobile ? "1.6rem" : 0, borderTop: isMobile ? `1px solid ${p.line}` : "none" }}>
            {isMobile && (
              <div className="caps" style={{ color: p.muted, marginBottom: 18, letterSpacing: "0.14em", fontSize: 11 }}>Endnotes</div>
            )}
            <div className="caps mono" style={{ marginBottom: 8, letterSpacing: "0.12em" }}>Cite as</div>
            <div className="mono" style={{ color: p.ink, fontSize: isMobile ? 11 : 10, lineHeight: 1.6 }}>
              Sharma, S. (2026).<br/>
              <em>{post.title}</em>.<br/>
              shubzsharma.com/{post.slug}
            </div>
            {essayMeta(post.slug).sources.length > 0 && (
              <>
                <div className="caps mono" style={{ marginTop: 22, marginBottom: 8, letterSpacing: "0.12em" }}>Sources</div>
                <div className="mono" style={{ color: p.ink, fontSize: isMobile ? 11 : 10, lineHeight: 1.6 }}>
                  {essayMeta(post.slug).sources.map(([prefix, body], i) => (
                    <div key={i} style={{ marginBottom: 4 }}>
                      <span>{prefix}</span><em>{body}</em>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="caps mono" style={{ marginTop: 22, marginBottom: 8, letterSpacing: "0.12em" }}>Share</div>
            <div className="mono" style={{ fontSize: isMobile ? 11 : 10, display: "flex", flexDirection: isMobile ? "row" : "column", gap: isMobile ? "1rem" : 0 }}>
              <a href="#" className="link-underline" style={{ color: p.accent }}>copy permalink</a>
              {!isMobile && <br/>}
              <a href="#" className="link-underline" style={{ color: p.accent }}>email this</a>
            </div>
          </aside>
        </div>
      </article>

      {/* read next */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.6rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", borderTop: `1px solid ${p.line}`, paddingTop: "2rem" }}>
          <div className="caps" style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, letterSpacing: "0.12em" }}>Read next</div>
          <div style={{ gridColumn: "3 / span 9" }}>
            {POSTS.filter(x => x.slug !== slug).map((other, i) => (
              <PreciseEssayRow key={other.slug} post={other} palette={p} onNavigate={onNavigate} index={i} total={POSTS.length - 1} />
            ))}
          </div>
        </div>
      </section>
      </main>

      <PreciseFooter palette={p} line="Diagrams are usually interactive. Opinions, if you ask nicely." />
    </div>
  );
}
