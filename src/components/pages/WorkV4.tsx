// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { IndexRail, LetterReveal, PreciseFooter, PreciseNav, PreciseTopBar, TerminalPanel, useIsMobile, usePreciseScroll, useTelemetry } from '../legacy';

export function WorkV4({ palette: p, onNavigate, setCursorColor, dark, toggleTheme }) {
  React.useEffect(() => { setCursorColor(p.accent); document.body.style.background = p.paper; window.scrollTo(0, 0); }, []);
  const scrollPct = usePreciseScroll();
  const telemetryRow = useTelemetry();
  const isMobile = useIsMobile();

  const events = [
    { year: "2026 —", what: "Elected MInstP · Institute of Physics", where: "London · Feb 2026", note: "Member of the UK's professional body for physics." },
    { year: "2025 —", what: "Founding Engineer · Orion", where: "London", note: "Building geospatial intelligence infrastructure from scratch — data pipelines for high-volume multi-source streams, ML anomaly detection over H3 spatial indexing, backend services in Python and Golang. Joined as Data Engineer (Apr 2024 → Nov 2024), then Data & ML Engineer (Nov 2024 → Aug 2025), then Founding Engineer." },
    { year: "2025", what: "Best Paper · IEEE ICCUBEA-2025", where: "co-author · Aug 2025", note: "\"Decoding Flipkart-Walmart Merger\" — theme extraction and sentiment mining across four years of news coverage. 1,240 submissions, 220 accepted, one Best Paper. Co-authored with Prof. Chakraborty." },
    { year: "2024", what: "MFoCS · Oxford · Lady Margaret Hall", where: "Mathematical & Computational Sciences", note: "Thesis: automated immune biomarker detection on multiplex immunofluorescence data from tumour samples. Modules included Geometric Deep Learning, Computational Game Theory, Quantum Information, and Category Theory." },
    { year: "2023", what: "ML Engineering Intern · Natter", where: "London", note: "Content moderation models for bullying, mental-distress, and spam detection on social text, plus a user-matching recommender." },
    { year: "2023", what: "BSc (Hons) Computer Science · FLAME University", where: "CGPA 8.53 · Dean's Roll of Honour", note: "Graduated ranked 3rd in cohort (from 41st in year one). Honours thesis on GNSS water-vapour estimation via ML, outperforming traditional linear baselines." },
    { year: "2022", what: "Research Intern · Prof. Jayaraman Valadi, FLAME", where: "Bioinformatics", note: "Improved the JAYA stochastic optimizer — size-penalised fitness function and elitism — for protein function identification on three biological datasets. Poster PP-28 at INBIX'22, VFSTR." },
    { year: "2021", what: "Data Analyst & Researcher · Centre for Knowledge Alternatives", where: "Pune", note: "Cultural mapping of Kolhapur district for the Discover India Project — government datasets, Tableau, sector reports." },
    { year: "2020", what: "Co-founder · UnisphereCo", where: "Hyderabad", note: "Online platform for the undergraduate-application process: mentors from 50+ universities, 200+ attendees per session." },
    { year: "2019", what: "Founder · PrintedCraft", where: "Bangalore", note: "Personalised printing business. Built a Python connector to a cloud product database for real-time promotions." },
  ];

  const builds = [
    { name: "Orion intelligence platform", scope: "founding-eng", role: "Geospatial intelligence over H3 spatial indexing — data infrastructure for high-volume multi-source streams, ML anomaly detection and confidence-weighted signal fusion, backend services in Python and Golang. Built from scratch as the first engineer on the data stack.", year: "2024 —" },
    { name: "fashion-web", scope: "deployed · solo", role: "Predicts which fashion micro-trends will peak 30 days out. Five live sources (Google Trends, Bluesky firehose, Pinterest, Reddit, YouTube) merge into a Holt-smoothed composite signal tracking 250+ terms across silhouettes, colours, and aesthetics. A logarithmic prediction market (LMSR, b=100) lets traders compete against the house model with virtual StyleCoins. Gemini 2.5 Flash breaks down outfit photos and matches them against runway collections from eight major houses. House predictions are Brier-scored.", year: "2026 —", url: "https://fashion-web-psi.vercel.app" },
    { name: "platypus-learn", scope: "deployed · solo", role: "Turns PDFs and YouTube videos into structured courses. Drop in a paper or a lecture; get back a coherent learning path with assessments, a weekly goals dashboard, and an email digest. Built with Next.js, Supabase, Claude API, and Resend.", year: "2025 —", url: "https://platypus-learn.vercel.app" },
    { name: "Taylor Swift recommendation engine", scope: "open", role: "Six engines running in parallel — Sentence-BERT on lyrics, a variational autoencoder compressing Spotify audio features to 16 dimensions, graph node2vec embeddings, neural collaborative filtering, contrastive self-supervised learning, and a weighted ensemble with a consensus boost for cross-engine agreement. Runs over Taylor's full discography plus hand-curated editorial bridges to related artists. Rebuilt from an R/Shiny original in TypeScript + FastAPI; recommendations in under 200ms.", year: "2026", url: "https://shubz-taylor-recommendation-engine.vercel.app" },
    { name: "MFoCS thesis: immune biomarkers", scope: "Oxford · 2024", role: "Two problems in automated biomarker detection on multiplex immunofluorescence data from real tumour samples. First: four automated thresholding methods (Otsu, IsoData, custom GMM, minimum cross-entropy) competing to replicate a pathologist's gate — CTLA-4 resisted all of them, because the biology is genuinely ambiguous. Second: spectral clustering with biological co-expression constraints encoded directly in the similarity matrix, beating five of seven standard methods on plausibility. Thesis available in Oxford repository.", year: "2024" },
    { name: "Flipkart-Walmart merger NLP", scope: "academic · Best Paper", role: "Theme extraction and sentiment mining across four years of news coverage of the $16B acquisition. Identified dominant narrative clusters and tracked sentiment shifts through deal stages using SpaCy, NLTK, Gensim, and TextBlob. Best Paper at IEEE ICCUBEA-2025 from 1,240 submissions.", year: "2023–25" },
    { name: "JAYA protein feature selection", scope: "open · research", role: "Modified a parameter-free stochastic optimizer with a size-penalty fitness function and elitism to improve feature selection for protein function identification. Tested on three biological datasets; consistently produced smaller feature sets without sacrificing classification accuracy. Poster PP-28 at INBIX'22.", year: "2022", url: "https://github.com/Shubzthub/inbix22" },
    { name: "GNSS water-vapour ML", scope: "honours thesis", role: "Estimated tropospheric water-vapour content from GNSS signals using regression models, outperforming traditional linear baselines on accuracy and robustness to atmospheric variability. BSc honours thesis, FLAME University.", year: "2023" },
    { name: "Nand2Tetris — 16-bit computer", scope: "coursework", role: "Built a working general-purpose computer from NAND gates up: all 13 projects from HDL gate design through machine language, VM translator, compiler, and a minimal operating system.", year: "2022" },
    { name: "this site", scope: "open", role: "Started as a single-file HTML + CSS + inline React app; migrated to Astro during the astro-migration branch. Essays, animated diagrams, custom typography.", year: "2026", url: "https://github.com/Shubzthub/personal-site" },
  ];

  const speaking = [
    { event: "Stemmettes", talk: "Mentoring girls and non-binary young people into engineering, maths, and computer science", year: "2025 —" },
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
              <span className="mono" style={{ color: "#28CA41", marginRight: 8 }}>§03</span>
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
              The CV with marginalia. Each entry has a footnote — what I actually did, what I would change, what I learned. Available in <a href="uploads/Shubhangi-Sharma-Resume-20260211.pdf" target="_blank" className="link-underline" style={{ color: p.accent }}>PDF</a> for the more conventional version.
            </p>
          </div>
          <div className="v4-rail-hide" style={{ gridColumn: "10 / span 3", paddingTop: "0.4rem" }}>
            <TerminalPanel
              label="cv.json"
              rows={[
                ["fig.01", "record"],
                ["entries", String(events.length)],
                ["span", "2019 — now"],
                ["updated", new Date().toISOString().slice(0,10).split('-').reverse().join('/')],
                ["cv.pdf", "↗ open", "uploads/Shubhangi-Sharma-Resume-20260211.pdf"],
              ]}
              palette={p}
            />
          </div>
        </div>
      </section>

      {/* trajectory */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.6rem 0", position: "relative", zIndex: 2 }}>
        <div className="v4-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.6rem", marginBottom: "1.2rem" }}>
          <h2 className="display" style={{ gridColumn: "3 / span 5", fontSize: "1.6rem", margin: 0, fontWeight: 380 }}>
            <span className="mono" style={{ fontSize: 12, color: "#28CA41", marginRight: 12 }}>02</span>
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
            <span className="mono" style={{ fontSize: 12, color: "#28CA41", marginRight: 12 }}>03</span>
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
            <span className="mono" style={{ fontSize: 12, color: "#28CA41", marginRight: 12 }}>04</span>
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
