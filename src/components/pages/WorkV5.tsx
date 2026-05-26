// @ts-nocheck
/* eslint-disable */
/**
 * WorkV5 — Port of design_handoff/work-page.jsx.
 *
 * Annotated CV: trajectory timeline → selected builds (with essay
 * provenance links) → toolbox chip grid → speaking & STEM outreach.
 * Right rail: cv.pdf stat block, open-to.md, based.md.
 *
 * Content lifted verbatim from WorkV4.tsx (events, builds, speaking) so the
 * existing curated prose is preserved — V5 only changes the chrome.
 */
import React from "react";
import { POSTS } from "../../data/posts";
import { nbTheme } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  NBPageShell, NBLastUpdated, NBPrompt, NBPromptHead, NBMarginalia,
} from "../chrome/NB";

type NavFn = (page: string, slug?: string | null) => void;

// Content lifted directly from WorkV4.tsx — same source of truth for now.
const WORK_EVENTS = [
  { year: "2026 —", what: "Elected MInstP · Institute of Physics", where: "London · Feb 2026", note: "The UK's professional body for physics. The certificate is small and unreasonably satisfying." },
  { year: "2025 —", what: "Founding Engineer · Orion", where: "London", note: "Building geospatial intelligence infrastructure from scratch — data pipelines for high-volume multi-source streams, ML anomaly detection over H3 spatial indexing, backend services in Python and Golang. The job description keeps getting shorter; the scope keeps getting wider. Joined as Data Engineer (Apr 2024 → Nov 2024), then Data & ML Engineer (Nov 2024 → Aug 2025), then Founding Engineer." },
  { year: "2025", what: "Best Paper · IEEE ICCUBEA-2025", where: "co-author · Aug 2025", note: "\"Decoding Flipkart-Walmart Merger\" — theme extraction and sentiment mining across four years of news coverage. 1,240 submissions, 220 accepted, one Best Paper. Co-authored with Prof. Chakraborty; started as a scrape, ended as an award." },
  { year: "2024", what: "MFoCS · Oxford · Lady Margaret Hall", where: "Mathematical & Computational Sciences", note: "Thesis: automated immune biomarker detection on multiplex immunofluorescence data from tumour samples. Modules included Geometric Deep Learning, Computational Game Theory, Quantum Information, and Category Theory. The place where everything I'd been doing separately started making sense together." },
  { year: "2023", what: "ML Engineering Intern · Natter", where: "London", note: "Content moderation models for bullying, mental-distress, and spam detection on social text, plus a user-matching recommender. First time building something that needed to work reliably for people who didn't know it existed." },
  { year: "2023", what: "BSc (Hons) Computer Science · FLAME University", where: "CGPA 8.53 · Dean's Roll of Honour", note: "Graduated ranked 3rd in cohort (from 41st in year one). Honours thesis on GNSS water-vapour estimation via ML, outperforming traditional linear baselines. Three years of learning how to work." },
  { year: "2022", what: "Research Intern · Prof. Jayaraman Valadi, FLAME", where: "Bioinformatics", note: "Improved the JAYA stochastic optimizer — size-penalised fitness function and elitism — for protein function identification on three biological datasets. Poster PP-28 at INBIX'22, VFSTR. First time a modification of mine made something measurably better." },
  { year: "2021", what: "Data Analyst & Researcher · Centre for Knowledge Alternatives", where: "Pune", note: "Cultural mapping of Kolhapur district for the Discover India Project — government datasets, Tableau, sector reports. First time data told a story about real places and real people." },
  { year: "2020", what: "Co-founder · UnisphereCo", where: "Hyderabad", note: "Online platform for the undergraduate-application process: mentors from 50+ universities, 200+ attendees per session. First time running something that other people depended on." },
  { year: "2019", what: "Founder · PrintedCraft", where: "Bangalore", note: "Personalised printing business. Built a Python connector to a cloud product database for real-time promotions. First time code made something happen in the physical world." },
];

const WORK_BUILDS = [
  { name: "Orion intelligence platform",          c: "teal",    scope: "founding-eng",         year: "2024 —", essay: null,                      blurb: "Geospatial intelligence over H3 spatial indexing — data infrastructure for high-volume multi-source streams, ML anomaly detection and confidence-weighted signal fusion, backend services in Python and Golang. Built from scratch as the first engineer on the data stack." },
  { name: "fashion-web",                          c: "ochre",   scope: "deployed · solo",      year: "2026 —", essay: "fashion-trends",          url: "https://fashion-web-psi.vercel.app",                                blurb: "Predicts which fashion micro-trends will peak 30 days out. Five live sources (Google Trends, Bluesky firehose, Pinterest, Reddit, YouTube) merge into a Holt-smoothed composite signal tracking 250+ terms across silhouettes, colours, and aesthetics. A logarithmic prediction market (LMSR, b=100) lets traders compete against the house model with virtual StyleCoins. Gemini 2.5 Flash breaks down outfit photos and matches them against runway collections from eight major houses. House predictions are Brier-scored." },
  { name: "platypus-learn",                       c: "blue",    scope: "deployed · solo",      year: "2025 —", essay: null,                      url: "https://platypus-learn.vercel.app",                                 blurb: "Turns PDFs and YouTube videos into structured courses. Drop in a paper or a lecture; get back a coherent learning path with assessments, a weekly goals dashboard, and an email digest. Built with Next.js, Supabase, Claude API, and Resend." },
  { name: "Taylor Swift recommendation engine",   c: "purple",  scope: "open",                 year: "2026",   essay: "six-engines",             url: "https://shubz-taylor-recommendation-engine.vercel.app",             blurb: "Six engines running in parallel — Sentence-BERT on lyrics, a variational autoencoder compressing Spotify audio features to 16 dimensions, graph node2vec embeddings, neural collaborative filtering, contrastive self-supervised learning, and a weighted ensemble with a consensus boost for cross-engine agreement. Runs over Taylor's full discography plus hand-curated editorial bridges to related artists. Rebuilt from an R/Shiny original in TypeScript + FastAPI; recommendations in under 200ms." },
  { name: "MFoCS thesis · immune biomarkers",     c: "red",     scope: "Oxford · 2024",        year: "2024",   essay: "threshold-gate",          blurb: "Two problems in automated biomarker detection on multiplex immunofluorescence data from real tumour samples. First: four automated thresholding methods (Otsu, IsoData, custom GMM, minimum cross-entropy) competing to replicate a pathologist's gate — CTLA-4 resisted all of them, because the biology is genuinely ambiguous. Second: spectral clustering with biological co-expression constraints encoded directly in the similarity matrix, beating five of seven standard methods on plausibility. Thesis available in Oxford repository." },
  { name: "Flipkart–Walmart merger NLP",          c: "ochre",   scope: "academic · Best Paper", year: "2023–25", essay: null,                     blurb: "Theme extraction and sentiment mining across four years of news coverage of the $16B acquisition. Identified dominant narrative clusters and tracked sentiment shifts through deal stages using SpaCy, NLTK, Gensim, and TextBlob. Best Paper at IEEE ICCUBEA-2025 from 1,240 submissions." },
  { name: "JAYA protein feature selection",       c: "orange",  scope: "open · research",      year: "2022",   essay: "jaya",                    url: "https://github.com/Shubzthub/inbix22",                              blurb: "Modified a parameter-free stochastic optimizer with a size-penalty fitness function and elitism to improve feature selection for protein function identification. Tested on three biological datasets; consistently produced smaller feature sets without sacrificing classification accuracy. Poster PP-28 at INBIX'22." },
  { name: "GNSS water-vapour ML",                 c: "cyan",    scope: "honours thesis",       year: "2023",   essay: null,                      blurb: "Estimated tropospheric water-vapour content from GNSS signals using regression models, outperforming traditional linear baselines on accuracy and robustness to atmospheric variability. BSc honours thesis, FLAME University." },
  { name: "Nand2Tetris — 16-bit computer",        c: "prompt",  scope: "coursework",           year: "2022",   essay: null,                      blurb: "Built a working general-purpose computer from NAND gates up: all 13 projects from HDL gate design through machine language, VM translator, compiler, and a minimal operating system." },
  { name: "this site",                            c: "blue",    scope: "open",                 year: "2026",   essay: null,                      url: "https://github.com/Shubzthub/personal-site",                        blurb: "Started as a single-file HTML + CSS + inline React app; migrated to Astro during the astro-migration branch. Essays, animated diagrams, and an unreasonable amount of time spent on typography." },
];

const WORK_TOOLBOX = [
  { group: "Languages", items: [
    { name: "Python",     c: "orange",  links: [["jaya, improved", "jaya"], ["positive by how much", "threshold-gate"], ["six engines", "six-engines"]] },
    { name: "Rust",       c: "teal",    links: [["orion (founding)", null]] },
    { name: "TypeScript", c: "blue",    links: [["this site", null], ["six engines", "six-engines"]] },
    { name: "R",          c: "red",     links: [["cells that can't exist", "constraint-clustering"]] },
    { name: "Golang",     c: "teal",    links: [["orion (founding)", null]] },
  ] },
  { group: "Methods", items: [
    { name: "Geospatial ML",           c: "teal",    links: [["orion (founding)", null]] },
    { name: "JAYA-style optimisation", c: "orange",  links: [["jaya, improved", "jaya"]] },
    { name: "LMSR markets",            c: "ochre",   links: [["pricing the next scarf", "fashion-trends"]] },
    { name: "Constrained clustering",  c: "red",     links: [["cells that can't exist", "constraint-clustering"]] },
    { name: "ZX-rewriting",            c: "prompt",  links: [["two colours and a Hadamard", "zx-calculus"]] },
    { name: "Ensemble recommendation", c: "purple",  links: [["six engines for one songbook", "six-engines"]] },
    { name: "Lotka–Volterra",          c: "teal",    links: [["predator and prey", "may-2026"]] },
  ] },
  { group: "Tools", items: [
    { name: "PyTorch · scikit-learn",  c: "red",     links: [["ML work, generally", null]] },
    { name: "Astro · React islands",   c: "blue",    links: [["this site", null]] },
    { name: "D3 · hand-rolled SVG",    c: "purple",  links: [["all essay diagrams", null]] },
    { name: "FastAPI",                 c: "prompt",  links: [["six engines", "six-engines"]] },
  ] },
];

const WORK_SPEAKING = [
  { event: "Stemmettes",        talk: "Mentoring girls and non-binary young people into engineering, maths, and computer science", year: "2025 —" },
  { event: "InnovateHer",       talk: "STEM Ambassador — running sessions for under-represented students in tech",                  year: "2025 —" },
  { event: "\"I'm a… Programme\"", talk: "Science communicator, CS & Mathematics",                                                 year: "2025 —" },
];

export function WorkV5({
  dark,
  toggleTheme,
  onNavigate,
}: {
  dark: boolean;
  toggleTheme: () => void;
  onNavigate: NavFn;
}) {
  const mode: "light" | "dark" = dark ? "dark" : "light";
  const t = nbTheme(mode);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.background = t.paper;
    }
  }, [t.paper]);

  // Map slug → theme-resolved accent, for provenance link colours.
  const essayBySlug = React.useMemo(() => {
    const map: Record<string, { title: string; c: string }> = {};
    for (const p of POSTS) {
      const key = p.nbAccent || "blue";
      map[p.slug] = { title: p.title, c: t[key] };
    }
    return map;
  }, [t]);

  const PAGE_PAD = isMobile ? "16px 20px 0" : "20px 64px 0";

  return (
    <NBPageShell
      t={t} mode={mode} current="work"
      label="shubz — ~/work — vim"
      onNavigate={onNavigate as any}
      onToggle={toggleTheme}
    >
      <NBLastUpdated t={t} label="WORK · CV WITH MARGINALIA" date="26 may 2026" />

      <div style={{
        padding: PAGE_PAD,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
        gap: isMobile ? 36 : 56,
      }}>
        <main id="main" tabIndex={-1}>
          {/* Title */}
          <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 32, position: "relative" }}>
            <NBPrompt t={t} cwd="~/work" cmd="cat ./cv.md" comment="annotated · chronological reverse" accent={t.prompt} />
            <h1 style={{
              fontFamily: "var(--f-display)",
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
              fontWeight: 400,
              fontSize: isMobile ? "clamp(2.2rem, 9vw, 3.2rem)" : "clamp(2.4rem, 6vw, 4.8rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: 0, color: t.ink, maxWidth: "18ch",
            }}>
              Things I've <em style={{ color: t.teal, fontStyle: "italic" }}>built</em> and{" "}
              <em style={{ color: t.ochre, fontStyle: "italic" }}>almost</em> finished.
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.6, color: t.softInk, maxWidth: "56ch", marginTop: 26 }}>
              The CV with marginalia. Each entry has a footnote — what I actually did, what I would change, what I learned. Available as <a href="/uploads/Shubhangi-Sharma-Resume-20260211.pdf" target="_blank" rel="noreferrer" style={{ color: t.blue, borderBottom: `1px solid ${t.blue}66` }}>PDF</a> for the more conventional version.
            </p>
            {!isMobile && (
              <NBMarginalia t={t} top={120} tilt={-1.8}>
                every tool here<br/>links to the essay<br/>where it earned<br/>its place.
              </NBMarginalia>
            )}
          </div>

          {/* §02 Trajectory */}
          <NBPromptHead t={t} n="§02" command="git log --since=2019 --reverse | tac" comment="2019 → present" title="Trajectory" accent={t.ochre} level={isMobile ? 22 : 28} />
          <div style={{ position: "relative", paddingLeft: isMobile ? 24 : 36, marginBottom: 56 }}>
            <div style={{ position: "absolute", left: 6, top: 8, bottom: 8, width: 2, background: t.rule }} />
            {WORK_EVENTS.map((e, i) => (
              <div key={i} style={{ position: "relative", paddingBottom: 22 }}>
                <div style={{
                  position: "absolute", left: isMobile ? -24 : -36, top: 6,
                  width: 14, height: 14, borderRadius: 999,
                  background: t.paper, border: `3px solid ${i === 0 ? t.prompt : t.muted}`,
                }} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "90px 1fr 160px", gap: isMobile ? 8 : 18, alignItems: "baseline" }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: i === 0 ? t.prompt : t.ochre }}>{e.year}</span>
                  <div>
                    <div style={{ fontFamily: "var(--f-body)", fontSize: isMobile ? 15 : 17, color: t.ink, lineHeight: 1.3 }}>{e.what}</div>
                    {e.note && <div style={{ fontSize: 14, color: t.softInk, marginTop: 4, fontStyle: "italic", maxWidth: "58ch", lineHeight: 1.55 }}>{e.note}</div>}
                  </div>
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, textAlign: "right" }}>{e.where}</span>
                  )}
                  {isMobile && (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted }}>{e.where}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* §03 Selected builds */}
          <NBPromptHead t={t} n="§03" command="ls -la ./builds/" comment="selected · open · founding" title="Selected work" accent={t.teal} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 56 }}>
            {WORK_BUILDS.map((b, i, arr) => {
              const linkedEssay = b.essay ? essayBySlug[b.essay] : null;
              const tagColor = t[b.c] || t.blue;
              return (
                <a key={b.name} href={b.url || "#"} target={b.url ? "_blank" : undefined} rel={b.url ? "noreferrer" : undefined} style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "auto 1fr" : "auto 1fr auto auto",
                  gap: isMobile ? 14 : 20, alignItems: "baseline",
                  padding: "20px 0",
                  borderBottom: i === arr.length - 1 ? "none" : `1px dashed ${t.muted}55`,
                  color: t.ink, textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, width: 28 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: "var(--f-display)", fontVariationSettings: '"opsz" 144, "SOFT" 50',
                      fontSize: 22, color: tagColor, lineHeight: 1.2,
                    }}>
                      {b.name} {b.url && <span style={{ fontSize: 14, fontFamily: "var(--f-mono)" }}>↗</span>}
                    </div>
                    <div style={{ fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 15, color: t.softInk, marginTop: 4, maxWidth: "60ch", lineHeight: 1.5 }}>
                      {b.blurb}
                    </div>
                    {linkedEssay && (
                      <div style={{ marginTop: 8, fontFamily: "var(--f-mono)", fontSize: 11 }}>
                        <span style={{ color: t.muted }}>written up: </span>
                        <a href={`/${b.essay}/`} onClick={(e) => { e.preventDefault(); onNavigate("essay", b.essay); }} style={{
                          color: linkedEssay.c,
                          borderBottom: `1px solid ${linkedEssay.c}66`,
                          paddingBottom: 1,
                          textDecoration: "none",
                        }}>↗ {linkedEssay.title}</a>
                      </div>
                    )}
                    {isMobile && (
                      <div style={{ marginTop: 8, display: "flex", gap: 12, fontFamily: "var(--f-mono)", fontSize: 10 }}>
                        <span style={{ color: tagColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>{b.scope}</span>
                        <span style={{ color: t.muted, marginLeft: "auto" }}>{b.year}</span>
                      </div>
                    )}
                  </div>
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: tagColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>{b.scope}</span>
                  )}
                  {!isMobile && (
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, textAlign: "right" }}>{b.year}</span>
                  )}
                </a>
              );
            })}
          </div>

          {/* §04 Toolbox */}
          <NBPromptHead t={t} n="§04" command="cat ./toolbox.md" comment="what built what" title="Toolbox" accent={t.purple} level={isMobile ? 22 : 28} />
          <div style={{ border: `2px solid ${t.ink}`, padding: isMobile ? "18px 16px" : "22px 26px", background: t.bgCard, marginBottom: 56 }}>
            {WORK_TOOLBOX.map((g, gi, arr) => (
              <div key={g.group} style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "140px 1fr",
                gap: isMobile ? "8px" : "12px 24px",
                paddingBottom: 18, marginBottom: 18,
                borderBottom: gi === arr.length - 1 ? "none" : `1px dashed ${t.muted}55`,
                alignItems: "start",
              }}>
                <div style={{ fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 18, color: t.softInk, paddingTop: 6 }}>
                  {g.group}.
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {g.items.map((it: any) => {
                    const ic = t[it.c] || t.blue;
                    return (
                      <span key={it.name} style={{
                        display: "inline-flex", flexDirection: "column", gap: 4,
                        padding: "8px 14px 10px",
                        background: t.paper2,
                        border: `1px solid ${ic}44`,
                        borderLeft: `3px solid ${ic}`,
                        borderRadius: 2,
                        minWidth: isMobile ? 0 : 200,
                        maxWidth: "100%",
                      }}>
                        <span style={{ fontFamily: "var(--f-body)", fontSize: 15, color: t.ink, lineHeight: 1.2 }}>{it.name}</span>
                        <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {it.links.map(([label, slug]: any, j: number) => {
                            const ess = slug ? essayBySlug[slug] : null;
                            const c = ess ? ess.c : t.muted;
                            return slug ? (
                              <a key={j} href={`/${slug}/`} onClick={(e) => { e.preventDefault(); onNavigate("essay", slug); }} style={{
                                fontFamily: "var(--f-mono)", fontSize: 10.5, color: c,
                                letterSpacing: "0.02em",
                                borderBottom: `1px solid ${c}44`,
                                alignSelf: "flex-start",
                                textDecoration: "none",
                              }}>↗ {label}</a>
                            ) : (
                              <span key={j} style={{
                                fontFamily: "var(--f-mono)", fontSize: 10.5, color: c,
                                letterSpacing: "0.02em",
                              }}>↗ {label}</span>
                            );
                          })}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* §05 Speaking */}
          <NBPromptHead t={t} n="§05" command="cat ./speaking.md" title="Speaking & STEM outreach" accent={t.magenta} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 60, borderTop: `1px solid ${t.muted}55` }}>
            {WORK_SPEAKING.map((s, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr 80px",
                gap: isMobile ? 4 : 18, alignItems: "baseline",
                padding: "14px 0",
                borderBottom: `1px solid ${t.muted}33`,
              }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.magenta, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.event}</span>
                <span style={{ fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 15, color: t.softInk }}>{s.talk}</span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted, textAlign: isMobile ? "left" : "right" }}>{s.year}</span>
              </div>
            ))}
          </div>
        </main>

        {/* Right rail */}
        <aside>
          <NBPrompt t={t} cwd="~/work" cmd="stat cv.pdf" accent={t.blue} />
          <div style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "14px 16px", borderRadius: 3, marginBottom: 28,
            fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.8,
            color: t.softInk,
          }}>
            <div style={{ color: t.muted }}>cv.pdf</div>
            <div><span style={{ color: t.muted }}>entries</span> <span style={{ color: t.ink }}>{WORK_EVENTS.length}</span></div>
            <div><span style={{ color: t.muted }}>span</span> <span style={{ color: t.ink }}>2019 — now</span></div>
            <div><span style={{ color: t.muted }}>updated</span> <span style={{ color: t.ink }}>26/05/2026</span></div>
            <div style={{ marginTop: 8 }}>
              <a href="/uploads/Shubhangi-Sharma-Resume-20260211.pdf" target="_blank" rel="noreferrer" style={{ color: t.blue, borderBottom: `1px solid ${t.blue}66`, textDecoration: "none" }}>↗ open pdf</a>
            </div>
          </div>

          <NBPrompt t={t} cwd="~/work" cmd="cat ./open-to.md" comment="collab" accent={t.prompt} />
          <div style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "14px 16px", borderRadius: 3, marginBottom: 28,
            fontFamily: "var(--f-body)", fontSize: 14, lineHeight: 1.55,
            color: t.softInk,
          }}>
            Open to collaboration on <span style={{ color: t.teal }}>geospatial ML</span>, <span style={{ color: t.blue }}>AI safety</span>, <span style={{ color: t.red }}>computational biology</span>, <span style={{ color: t.prompt }}>STEM-ed outreach</span>, or anything that crosses these.
            <div style={{ marginTop: 12 }}>
              <a href="/contact/" onClick={(e) => { e.preventDefault(); onNavigate("contact"); }} style={{ color: t.prompt, fontFamily: "var(--f-mono)", fontSize: 11, borderBottom: `1px solid ${t.prompt}66`, textDecoration: "none" }}>↗ get in touch</a>
            </div>
          </div>

          <NBPrompt t={t} cwd="~/work" cmd="cat ./based.md" accent={t.ochre} />
          <div style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "14px 16px", borderRadius: 3, marginBottom: 28,
            fontFamily: "var(--f-mono)", fontSize: 11.5, lineHeight: 1.8,
            color: t.softInk,
          }}>
            <div><span style={{ color: t.muted }}>lat</span> 51.51°N</div>
            <div><span style={{ color: t.muted }}>lon</span> -0.13°W</div>
            <div><span style={{ color: t.muted }}>tz</span> Europe/London (BST)</div>
            <div><span style={{ color: t.muted }}>calls</span> any reasonable tz</div>
          </div>
        </aside>
      </div>
    </NBPageShell>
  );
}
