// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { IndexRail, LetterReveal, PreciseFooter, PreciseNav, PreciseTopBar, useIsMobile, usePreciseScroll, useTelemetry } from '../legacy';

export function WorkV4({ palette: p, onNavigate, setCursorColor, dark, toggleTheme }) {
  React.useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; window.scrollTo(0, 0); }, []);
  const scrollPct = usePreciseScroll();
  const telemetryRow = useTelemetry();
  const isMobile = useIsMobile();

  const events = [
    { year: "2026 —", what: "Elected MInstP, Member of the Institute of Physics", where: "London · Feb 2026", note: "Professional body for physics in the UK and Ireland. Elected route." },
    { year: "2025 —", what: "Founding engineer, Orion", where: "London", note: "Geospatial intelligence over H3 indexing. Built the data infrastructure for high-volume, multi-source intelligence streams; ML pipelines for anomaly detection and intelligent filtering; backend services in Python and Golang. Previously: Data & ML Engineer (Nov 2024 – Aug 2025); Data Engineer, part-time (Apr 2024 – Nov 2024)." },
    { year: "2025", what: "Best Paper Award · IEEE ICCUBEA-2025", where: "co-author · Aug 2025", note: "\"Decoding Flipkart-Walmart Merger: An Empirical Analysis of News using Theme Extraction, Sentiment Mining, for Indian M&A Insights.\" 1240 submissions, 220 selected, one Best Paper." },
    { year: "2024", what: "MFoCS · Mathematical Foundations of Computer Science", where: "Oxford · Lady Margaret Hall", note: "Thesis: \"Analysing and Advancing Automated Immune Biomarker Detection.\" Modules included Geometric Deep Learning, Computational Game Theory, Quantum Information." },
    { year: "2023", what: "ML Engineering Intern, Natter", where: "London", note: "Built models for bullying, mental-distress, and spam detection on social text. A user-matching recommender on top." },
    { year: "2023", what: "BSc (Hons) Computer Science", where: "FLAME University", note: "CGPA 8.53/10. Dean's Roll of Honour: Rank 41 → Rank 24 → Rank 3 across years." },
    { year: "2022", what: "Research intern · JAYA algorithm + protein function ID", where: "Prof. Jayaraman Valadi", note: "Improved the JAYA optimizer with a fitness trade-off and elitism for feature selection on protein identification datasets. Poster PP-28 at INBIX'22 (VFSTR)." },
    { year: "2021", what: "Data Analyst & Researcher, Centre for Knowledge Alternatives", where: "Pune", note: "Cultural mapping of Kolhapur district for the Discover India Project. Tableau, government datasets, sector reports." },
    { year: "2020", what: "Co-founder, UnisphereCo", where: "Hyderabad", note: "Online platform for the undergraduate-application process — mentors from 50+ universities, 200+ attendees per session." },
    { year: "2019", what: "Founder, PrintedCraft", where: "Bangalore", note: "Personalised printing — built a python connector to a cloud product DB for real-time promotions." },
  ];

  const builds = [
    { name: "Orion intelligence platform", scope: "founding-eng", role: "data infra, ML pipelines, backend services in Python + Golang", year: "2025 —" },
    { name: "fashion-web — ML trend intelligence + LMSR exchange", scope: "deployed · solo", role: "Next.js / TS / Vercel edge / Neon Postgres — five-source ingestion (Google Trends, Bluesky firehose, Pinterest, Reddit, YouTube), Holt smoothing forecasts, LMSR prediction market (b=100) with StyleCoins, Gemini 2.5 Flash CV for garment detection + runway matching, Brier-scored house predictions, hundreds of tracked terms", year: "2026 —", url: "https://fashion-web-psi.vercel.app" },
    { name: "platypus-learn — AI learning platform", scope: "deployed · solo", role: "Next.js / Supabase / Resend — ingests PDFs and YouTube, generates courses with Claude, weekly goals dashboard", year: "2025 —", url: "https://platypus-learn.vercel.app" },
    { name: "shubz-taylor-rec-engine", scope: "open", role: "six engines (Sentence-BERT lyrics, audio VAE 384→16D, graph node2vec 64D, neural collab filtering, contrastive SSL, weighted ensemble) on Taylor's full discography + editorial bridges · Next.js 14 + FastAPI · TS rebuild of the R/Shiny original", year: "2026", url: "https://shubz-taylor-recommendation-engine.vercel.app" },
    { name: "inbix22 — improved JAYA", scope: "open", role: "feature-selection variants for protein function ID; fitness trade-off + elitism", year: "2022", url: "https://github.com/Shubzthub/inbix22" },
    { name: "MFoCS thesis: immune biomarkers", scope: "academic", role: "consensus clustering (Birch + Agglomerative + Spectral) on 6-marker flow cytometry · CTLA4 surface-marker recovery at F1 = 0.70", year: "2024" },
    { name: "Flipkart-Walmart merger NLP", scope: "academic", role: "theme extraction + sentiment mining — SpaCy, NLTK, Gensim, TextBlob", year: "2024" },
    { name: "GNSS water-vapour ML", scope: "honours thesis", role: "regression models vs traditional linear baselines", year: "2023" },
    { name: "Nand2Tetris — 16-bit computer from gates up", scope: "coursework", role: "all 13 projects: HDL, assembly, VM, compiler, OS", year: "2022" },
    { name: "IoT Weather Bot", scope: "side", role: "C++ on a microcontroller, ThingSpeak, web dashboard", year: "2021" },
    { name: "Cipher program", scope: "side", role: "Python + NumPy five-layer encryptor with key schedule", year: "2021" },
    { name: "this site", scope: "open", role: "single-file HTML / CSS / inline React", year: "2026", url: "https://github.com/Shubzthub/personal-site" },
  ];

  const speaking = [
    { event: "Indian Conference on Bioinformatics", talk: "Improved JAYA algorithm for protein function ID (poster)", year: "2022" },
    { event: "IEEE ICCUBEA-2025", talk: "Decoding Flipkart-Walmart Merger (Best Paper, co-author)", year: "2025" },
    { event: "InnovateHer", talk: "STEM Ambassador — running sessions for under-represented students in tech", year: "2025 —" },
    { event: "\"I'm a... Programme\"", talk: "Science communicator, CS & Mathematics", year: "2025 —" },
  ];

  return (
    <div style={{ background: p.paper, color: p.ink, minHeight: "100vh", fontFamily: "var(--f-body)" }}>
      <div aria-hidden="true" className="v4-bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: `linear-gradient(to right, ${p.line} 1px, transparent 1px)`, backgroundSize: "calc(100%/12) 100%", opacity: 0.28 }} />
      <PreciseTopBar palette={p} label="~/work" dark={dark} toggleTheme={toggleTheme} />
      <PreciseNav palette={p} current="work" onNavigate={onNavigate} />

      <main id="main" tabIndex={-1} style={{ display: "block" }}>
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.6rem 1rem", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", alignItems: "start" }}>
          <div className="v4-rail-hide" style={{ gridColumn: "1 / span 2" }}>
            <IndexRail palette={p} currentIdx={0}
              items={["Header", "Trajectory", "Selected work", "Speaking", "Tooling", "Get in touch"]}
              telemetry={[telemetryRow, ["page", "work"], ["entries", String(events.length).padStart(2, "0")], ["builds", String(builds.length).padStart(2, "0")]]}
              scrollPct={scrollPct} />
          </div>
          <div style={{ gridColumn: "3 / span 7" }}>
            <div className="ui caps" style={{ color: p.muted, marginBottom: "1rem", fontSize: 11, letterSpacing: "0.12em" }}>
              <span className="mono" style={{ color: p.accent, marginRight: 8 }}>§03</span>
              Work · CV · annotated, in chronological reverse
            </div>
            <h1 className="display" style={{ fontSize: "clamp(1.9rem, 7vw, 4.6rem)", margin: 0, fontWeight: 360, lineHeight: 0.98, letterSpacing: "-0.02em" }}>
              <LetterReveal stagger={26}>Things I've </LetterReveal>
              <span style={{ fontStyle: "italic", color: p.accent }}><LetterReveal stagger={26} delay={520}>built </LetterReveal></span>
              <LetterReveal stagger={26} delay={820}>and almost</LetterReveal>
              <span style={{ display: "block" }}>
                <LetterReveal stagger={26} delay={1120}>finished.</LetterReveal>
              </span>
            </h1>
            <p className="prose" style={{ fontSize: "1.06rem", lineHeight: 1.7, marginTop: "1.4rem", maxWidth: "54ch", color: p.ink }}>
              The CV with marginalia. Each entry has a footnote — what I actually did, what I would change, what I learned. Available in <a href="uploads/Shubz-Sharma-Resume-20260211.pdf" target="_blank" className="link-underline" style={{ color: p.accent }}>PDF</a> for the more conventional version.
            </p>
          </div>
          <div className="v4-rail-hide" style={{ gridColumn: "10 / span 3", paddingTop: "0.4rem" }}>
            <div className="mono" style={{ fontSize: 11, color: p.muted, lineHeight: 1.8 }}>
              <div style={{ color: p.ink }}>fig.01 — record</div>
              <div>entries&nbsp;&nbsp;&nbsp;{events.length}</div>
              <div>span&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2019 — now</div>
              <div>updated&nbsp;{new Date().toISOString().slice(0, 10)}</div>
              <div style={{ marginTop: 12 }}>
                <a href="uploads/Shubz-Sharma-Resume-20260211.pdf" target="_blank" className="link-underline" style={{ color: p.accent }}>cv.pdf ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* trajectory */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>02</span>
            Trajectory
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>2019 — present</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {events.map((e, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "100px 1fr 200px", gap: isMobile ? "0.3rem" : "1.6rem", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline" }}>
                  <div style={{ display: isMobile ? "flex" : "contents", justifyContent: "space-between", alignItems: "baseline", gap: "0.8rem" }}>
                    <span className="mono" style={{ color: p.accent, fontSize: 12 }}>{e.year}</span>
                    {isMobile && <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{e.where}</span>}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--f-body)", fontSize: "1.05rem", color: p.ink }}>{e.what}</div>
                    {e.note && <div style={{ fontSize: "0.92rem", color: p.muted, marginTop: 4, fontStyle: "italic", maxWidth: "60ch" }}>{e.note}</div>}
                  </div>
                  {!isMobile && <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{e.where}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* selected work */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>03</span>
            Selected work
          </h2>
          <span className="caps mono" style={{ gridColumn: "10 / span 3", color: p.muted, alignSelf: "baseline", fontSize: 11, textAlign: "right" }}>open · internal · founding</span>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {builds.map((b, i) => isMobile ? (
                <a key={i}
                   href={b.url || "#"}
                   target={b.url ? "_blank" : undefined}
                   rel={b.url ? "noreferrer" : undefined}
                   onClick={(e) => { if (!b.url) e.preventDefault(); }}
                   style={{ display: "block", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, color: p.ink }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="mono caps" style={{ color: p.accent, fontSize: 10, letterSpacing: "0.1em" }}>{b.scope}</span>
                  </div>
                  <div className={b.url ? "link-underline" : ""} style={{ fontFamily: "var(--f-body)", fontSize: "1.05rem" }}>
                    {b.name}
                    {b.url && <span style={{ color: p.accent, marginLeft: 8, fontSize: "0.85em" }}>↗</span>}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: p.muted, marginTop: 4 }}>{b.role}</div>
                  <div className="mono" style={{ color: p.muted, fontSize: 11, marginTop: 6 }}>{b.year}</div>
                </a>
              ) : (
                <a key={i}
                   href={b.url || "#"}
                   target={b.url ? "_blank" : undefined}
                   rel={b.url ? "noreferrer" : undefined}
                   onClick={(e) => { if (!b.url) e.preventDefault(); }}
                   style={{ display: "grid", gridTemplateColumns: "60px 1fr 160px 80px", gap: "1.4rem", padding: "1.1rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline", color: p.ink }}>
                  <span className="mono" style={{ color: p.muted, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className={b.url ? "link-underline" : ""} style={{ fontFamily: "var(--f-body)", fontSize: "1.05rem" }}>
                      {b.name}
                      {b.url && <span style={{ color: p.accent, marginLeft: 8, fontSize: "0.85em" }}>↗</span>}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: p.muted, marginTop: 4 }}>{b.role}</div>
                  </div>
                  <span className="mono caps" style={{ color: p.accent, fontSize: 10, letterSpacing: "0.1em" }}>{b.scope}</span>
                  <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{b.year}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* speaking */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: p.muted, marginRight: 12 }}>04</span>
            Speaking
          </h2>
        </div>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem" }}>
          <div style={{ gridColumn: "3 / span 9" }}>
            <div style={{ borderTop: `1px solid ${p.line}` }}>
              {speaking.map((s, i) => (
                <div key={i} className="v4-stack-row" style={{ display: "grid", gridTemplateColumns: "200px 1fr 80px", gap: "1.4rem", padding: "0.9rem 0", borderBottom: `1px solid ${p.line}`, alignItems: "baseline", color: p.ink, fontFamily: "var(--f-body)", fontSize: "1rem" }}>
                  <span className="mono caps" style={{ color: p.muted, fontSize: 11, letterSpacing: "0.08em" }}>{s.event}</span>
                  <span style={{ fontStyle: "italic" }}>{s.talk}</span>
                  <span className="mono" style={{ color: p.muted, fontSize: 11, textAlign: "right" }}>{s.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* contact CTA */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", borderTop: `1px solid ${p.line}`, paddingTop: "2rem" }}>
          <div className="caps" style={{ gridColumn: "1 / span 2", fontFamily: "var(--f-ui)", fontSize: 11, color: p.muted, letterSpacing: "0.12em" }}>Get in touch</div>
          <div style={{ gridColumn: "3 / span 6" }}>
            <div className="display" style={{ fontSize: "1.6rem", fontWeight: 380, lineHeight: 1.3, color: p.ink }}>
              Open to <em style={{ color: p.accent }}>collaboration</em> on geospatial ML, AI safety, computational biology, STEM education outreach, or anything that crosses these.
            </div>
            <div style={{ marginTop: 18 }}>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} className="link-underline" style={{ color: p.accent, fontFamily: "var(--f-ui)", fontSize: 14 }}>get in touch →</a>
            </div>
          </div>
        </div>
      </section>
      </main>

      <PreciseFooter palette={p} line="Always a work in progress." />
    </div>
  );
}
