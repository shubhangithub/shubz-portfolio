// @ts-nocheck
/* eslint-disable */
/**
 * ContactV5 — Port of design_handoff/contact-page.jsx.
 *
 * Vim-mail-buffer compose form + channels + preferences. Right rail:
 * protocol stat, cal mini-table. PGP block from spec omitted (no real
 * key yet; would invent data otherwise) — placeholder kept commented for
 * when a real fingerprint is ready.
 *
 * Channel handles use real values matching ContactV4: Shubzthub on GitHub,
 * Shubz-s-sharma on LinkedIn, hello@shubzsharma.com for email.
 */
import React from "react";
import { nbTheme } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  NBPageShell, NBLastUpdated, NBPrompt, NBPromptHead, NBMarginalia,
} from "../chrome/NB";

type NavFn = (page: string, slug?: string | null) => void;

export function ContactV5({
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

  const [from, setFrom] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  const inputBase: React.CSSProperties = {
    all: "unset" as any,
    width: "100%",
    fontFamily: "var(--f-body)",
    fontSize: 15,
    color: t.ink,
    background: "transparent",
    padding: "2px 0",
  };

  // V5 canonical: Email + LinkedIn are communication/outreach channels →
  // orange. GitHub is code/infrastructure → yellow. See DECISIONS-v5.md §14.
  const channels = [
    { label: "Email",    handle: "hello@shubzsharma.com",          note: "Best — read once a day in the morning.",   c: "orange", href: "mailto:hello@shubzsharma.com" },
    { label: "LinkedIn", handle: "linkedin.com/in/Shubz-s-sharma", note: "Conventional channel; checked weekly-ish.", c: "orange", href: "https://www.linkedin.com/in/Shubz-s-sharma/" },
    { label: "GitHub",   handle: "github.com/Shubzthub",           note: "For code or issues on the open repos.",     c: "yellow", href: "https://github.com/Shubzthub" },
  ];

  // V5 canonical: each preference's accent maps to its topical content.
  //   Will read   → orange (Outreach — public-facing topic announcement)
  //   Won't read  → orange (Outreach — public-facing etiquette rule)
  //   Reply time  → yellow (Infrastructure & craft — process metadata)
  //   Based       → teal   (Geospatial — location)
  const preferences: [string, string, string][] = [
    ["Will read",  "AI safety, geospatial ML, quantum computation, computational biology, recommendation systems, fashion forecasting, or anything at the intersection of maths and something unexpected.", "orange"],
    ["Won't read", "Generic outreach. \"Quick question\" emails. Anything with the word 'leverage'.",                                                                                                       "orange"],
    ["Reply time", "≤ 72 hours for substantive emails. Faster if it makes me laugh.",                                                                                                                       "yellow"],
    ["Based",      "London — happy on calls in any reasonable timezone.",                                                                                                                                   "teal"],
  ];

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = `From: ${from}\n\n${message}`;
    if (typeof window !== "undefined") {
      window.location.href = `mailto:hello@shubzsharma.com?subject=${encodeURIComponent(subject || "Hi from your site")}&body=${encodeURIComponent(body)}`;
    }
  }

  const PAGE_PAD = isMobile ? "16px 20px 0" : "20px 64px 0";

  return (
    <NBPageShell
      t={t} mode={mode} current="contact"
      label="shubz — ~/contact — mail"
      onNavigate={onNavigate as any}
      onToggle={toggleTheme}
    >
      <NBLastUpdated t={t} label="CONTACT · CHANNELS + COMPOSE" date="26 may 2026" accent={t.orange} />

      <div style={{
        padding: PAGE_PAD,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
        gap: isMobile ? 36 : 56,
      }}>
        <main id="main" tabIndex={-1}>
          {/* Title */}
          <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 32, position: "relative" }}>
            {/* Contact page title prompt → Outreach (orange). */}
            <NBPrompt t={t} cwd="~/contact" cmd="mail -h" comment="how to reach me" accent={t.orange} />
            <h1 style={{
              fontFamily: "var(--f-display)",
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
              fontWeight: 400,
              fontSize: isMobile ? "clamp(2.2rem, 9vw, 3.2rem)" : "clamp(2.4rem, 6vw, 4.8rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: 0, color: t.ink, maxWidth: "16ch",
            }}>
              {/* V5 canonical: greeting + communication → Outreach (orange). */}
              Say <em style={{ color: t.orange, fontStyle: "italic" }}>hello</em>.<br/>
              I read everything <em style={{ color: t.orange, fontStyle: "italic" }}>eventually</em>.
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.6, color: t.softInk, maxWidth: "56ch", marginTop: 26 }}>
              I prefer email. If you're writing about <span style={{ color: t.red }}>computational biology</span>, <span style={{ color: t.teal }}>geospatial ML</span>, or <span style={{ color: t.purple }}>music recommendations</span>, you will get a longer reply than you expect.
            </p>
            {!isMobile && (
              /* Marginalia about communication etiquette → Outreach (orange). */
              <NBMarginalia t={t} top={120} tilt={-2.4} accent={t.orange}>
                don't begin with<br/>"quick question."
              </NBMarginalia>
            )}
          </div>

          {/* §02 Channels */}
          {/* §02 Channels → Outreach (orange). */}
          <NBPromptHead t={t} n="§02" command="ls ./channels/" comment={`${channels.length} ways in`} title="Channels" accent={t.orange} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 56, borderTop: `1px solid ${t.muted}55` }}>
            {channels.map((c, i) => (
              <a key={i} href={c.href} target={c.href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer" style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "auto 1fr auto" : "100px 1fr 1fr 40px",
                gap: isMobile ? 12 : 22, alignItems: "baseline",
                padding: "16px 0",
                borderBottom: `1px dashed ${t.muted}33`,
                color: t.ink, textDecoration: "none",
              }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t[c.c], textTransform: "uppercase", letterSpacing: "0.08em" }}>● {c.label}</span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: t.ink, borderBottom: `1px solid ${t[c.c]}66`, alignSelf: "baseline", justifySelf: "start", paddingBottom: 1 }}>{c.handle}</span>
                {!isMobile && (
                  <span style={{ fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 14, color: t.softInk }}>{c.note}</span>
                )}
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: t[c.c], textAlign: "right" }}>↗</span>
                {isMobile && (
                  <span style={{ gridColumn: "1 / -1", fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 13, color: t.softInk }}>{c.note}</span>
                )}
              </a>
            ))}
          </div>

          {/* §03 Preferences */}
          {/* §03 Preferences → Outreach (orange). */}
          <NBPromptHead t={t} n="§03" command="cat ./preferences.md" title="Preferences" accent={t.orange} level={isMobile ? 22 : 28} />
          <div style={{ marginBottom: 56, borderTop: `1px solid ${t.muted}55` }}>
            {preferences.map(([k, v, c], i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: isMobile ? "1fr" : "180px 1fr",
                gap: isMobile ? 4 : 22, alignItems: "baseline",
                padding: "14px 0",
                borderBottom: `1px dashed ${t.muted}33`,
              }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: t[c], textTransform: "uppercase", letterSpacing: "0.08em" }}>{k}</span>
                <span style={{ fontFamily: "var(--f-body)", fontSize: 15, color: t.ink, lineHeight: 1.55 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* §04 Compose */}
          {/* §04 Compose → Outreach (orange). */}
          <NBPromptHead t={t} n="§04" command="mail compose --to hello@" comment="opens your mail client" title="Compose" accent={t.orange} level={isMobile ? 22 : 28} />
          <form onSubmit={onSubmit} style={{
            border: `2px solid ${t.ink}`, padding: isMobile ? "14px 16px" : "18px 22px",
            background: t.paper2, marginBottom: 56,
            fontFamily: "var(--f-mono)",
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "auto 1fr auto",
              gap: 14, fontSize: 11, color: t.muted, marginBottom: 16,
              paddingBottom: 10, borderBottom: `1px dashed ${t.muted}33`,
            }}>
              <span>To: <span style={{ color: t.prompt }}>hello@shubzsharma.com</span></span>
              <span></span>
              <span style={{ color: t.prompt }}>● ready</span>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "100px 1fr", gap: isMobile ? 4 : 14, alignItems: isMobile ? "stretch" : "center", borderBottom: `1px dashed ${t.muted}33`, paddingBottom: 8 }}>
                <span style={{ fontSize: 11, color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>From</span>
                <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="your name & email" style={inputBase} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "100px 1fr", gap: isMobile ? 4 : 14, alignItems: isMobile ? "stretch" : "center", borderBottom: `1px dashed ${t.muted}33`, paddingBottom: 8 }}>
                <span style={{ fontSize: 11, color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Subject</span>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="what this is about" style={inputBase} />
              </div>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="don't begin with 'quick question'." style={{ ...inputBase, resize: "vertical", padding: "10px 0", lineHeight: 1.55 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 11, color: t.muted }}>opens your mail client · spam-screened by hand</span>
                <button type="submit" style={{
                  all: "unset", cursor: "pointer",
                  padding: "8px 18px",
                  background: t.ink, color: t.paper,
                  fontFamily: "var(--f-mono)", fontSize: 12,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>Send →</button>
              </div>
            </div>
          </form>
        </main>

        {/* Right rail */}
        <aside>
          {/* Protocol pre block → Outreach (orange). */}
          <NBPrompt t={t} cwd="~/contact" cmd="cat .protocol" comment="how I read mail" accent={t.orange} />
          <pre style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "12px 14px", borderRadius: 3,
            fontFamily: "var(--f-mono)", fontSize: 11, lineHeight: 1.8,
            color: t.softInk, margin: 0, whiteSpace: "pre-wrap",
          }}>{`{
  `}<span style={{ color: t.blue }}>"preferred"</span>{`: `}<span style={{ color: t.ochre }}>"email"</span>{`,
  `}<span style={{ color: t.blue }}>"cadence"</span>{`:   `}<span style={{ color: t.ochre }}>"daily, am"</span>{`,
  `}<span style={{ color: t.blue }}>"reply"</span>{`:     `}<span style={{ color: t.ochre }}>"≤72h"</span>{`,
  `}<span style={{ color: t.blue }}>"noise"</span>{`:     `}<span style={{ color: t.ochre }}>"low"</span>{`
}`}</pre>

          <div style={{ marginTop: 28 }}>
            {/* Calendar block — V5 canonical: communication days = orange
                (Outreach); rowing/piano on weekends ALSO orange (community/
                personal — same category). Visual differentiation comes from
                weight (mon-thu solid, sat-sun muted). */}
            <NBPrompt t={t} cwd="~/contact" cmd="cal" accent={t.orange} />
            <div style={{
              background: t.paper2, border: `1px solid ${t.rule}`,
              padding: "12px 14px", borderRadius: 3,
              fontFamily: "var(--f-mono)", fontSize: 11, color: t.softInk, lineHeight: 1.8,
            }}>
              <div style={{ color: t.muted }}>typical replies</div>
              <div><span style={{ color: t.orange }}>mon–thu</span> &nbsp;am, before 09:00</div>
              <div><span style={{ color: t.orange }}>fri</span> &nbsp;mixed</div>
              <div><span style={{ color: t.muted }}>sat–sun</span> &nbsp;rowing / piano</div>
            </div>
          </div>
        </aside>
      </div>
    </NBPageShell>
  );
}
