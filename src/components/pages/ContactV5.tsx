// @ts-nocheck
/* eslint-disable */
/**
 * ContactV5 — pure renderer. All copy in `src/data/contact.ts`.
 * Edit channels / preferences / calendar / protocol there and the page
 * picks it up automatically. PGP block omitted by design (no real key).
 */
import React from "react";
import { nbTheme } from "../../data/palette";
import { useIsMobile } from "../../lib/hooks";
import {
  NBPageShell, NBLastUpdated, NBPrompt, NBPromptHead, NBMarginalia,
  NBThumb, NBThumbtack,
} from "../chrome/NB";
import {
  CONTACT_HERO_LINES, CONTACT_LEDE, CONTACT_MARGINALIA,
  CONTACT_LAST_UPDATED_LABEL, CONTACT_LAST_UPDATED_DATE,
  CONTACT_CHANNELS, CONTACT_COMPOSE,
  CONTACT_PROTOCOL, CONTACT_OPEN_TO,
} from "../../data/contact";
import type { Span } from "../../data/home";

type NavFn = (page: string, slug?: string | null) => void;

function renderSpans(spans: Span[], t: any) {
  return spans.map((s, i) => {
    if (typeof s === "string") return s;
    if ("em" in s) {
      return <em key={i} style={{ fontStyle: "italic", color: s.c ? t[s.c] : undefined }}>{s.em}</em>;
    }
    return <span key={i} style={{ color: s.c ? t[s.c] : undefined }}>{s.tag}</span>;
  });
}

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

  // CONTACT_CHANNELS lives in src/data/contact.ts — see DECISIONS-v5.md §14.
  const channels = CONTACT_CHANNELS;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = `From: ${from}\n\n${message}`;
    if (typeof window !== "undefined") {
      window.location.href = `mailto:${CONTACT_COMPOSE.toAddress}?subject=${encodeURIComponent(subject || CONTACT_COMPOSE.defaultSubject)}&body=${encodeURIComponent(body)}`;
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
      <NBLastUpdated t={t} label={CONTACT_LAST_UPDATED_LABEL} date={CONTACT_LAST_UPDATED_DATE} accent={t.orange} cwd="~/contact" cmd="mail -h" comment="how to reach me" />

      <div style={{
        padding: PAGE_PAD,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
        gap: isMobile ? 36 : 56,
      }}>
        <main id="main" tabIndex={-1}>
          {/* Title */}
          <div style={{ borderBottom: `2px solid ${t.ink}`, paddingBottom: 22, marginBottom: 32, position: "relative" }}>
            <h1 style={{
              fontFamily: "var(--f-display)",
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
              fontWeight: 400,
              fontSize: isMobile ? "clamp(2.2rem, 9vw, 3.2rem)" : "clamp(2.4rem, 6vw, 4.8rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: 0, color: t.ink, maxWidth: "16ch",
            }}>
              {CONTACT_HERO_LINES.map((line, i) => (
                <React.Fragment key={i}>
                  {renderSpans(line, t)}
                  {i < CONTACT_HERO_LINES.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.6, color: t.softInk, maxWidth: "56ch", marginTop: 26 }}>
              {renderSpans(CONTACT_LEDE, t)}
            </p>
            {!isMobile && (
              <NBMarginalia t={t} top={120} tilt={-2.4} accent={t[CONTACT_MARGINALIA.accent]}>
                {CONTACT_MARGINALIA.lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < CONTACT_MARGINALIA.lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
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

          {/* §03 Compose → Outreach (orange). */}
          <NBPromptHead t={t} n="§03" command="mail compose --to hello@" title="Compose" accent={t.orange} level={isMobile ? 22 : 28} />
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
              <span>{CONTACT_COMPOSE.toLabel} <span style={{ color: t.prompt }}>{CONTACT_COMPOSE.toAddress}</span></span>
              <span></span>
              <span style={{ color: t.prompt }}>{CONTACT_COMPOSE.readyLabel}</span>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "100px 1fr", gap: isMobile ? 4 : 14, alignItems: isMobile ? "stretch" : "center", borderBottom: `1px dashed ${t.muted}33`, paddingBottom: 8 }}>
                <span style={{ fontSize: 11, color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>From</span>
                <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder={CONTACT_COMPOSE.fromPlaceholder} style={inputBase} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "100px 1fr", gap: isMobile ? 4 : 14, alignItems: isMobile ? "stretch" : "center", borderBottom: `1px dashed ${t.muted}33`, paddingBottom: 8 }}>
                <span style={{ fontSize: 11, color: t.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Subject</span>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={CONTACT_COMPOSE.subjectPlaceholder} style={inputBase} />
              </div>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder={CONTACT_COMPOSE.bodyPlaceholder} style={{ ...inputBase, resize: "vertical", padding: "10px 0", lineHeight: 1.55 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 11, color: t.muted }}>{CONTACT_COMPOSE.footerNote}</span>
                <button type="submit" style={{
                  all: "unset", cursor: "pointer",
                  padding: "8px 18px",
                  background: t.ink, color: t.paper,
                  fontFamily: "var(--f-mono)", fontSize: 12,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>{CONTACT_COMPOSE.sendButton}</button>
              </div>
            </div>
          </form>
        </main>

        {/* Right rail */}
        <aside>
          {/* Portrait polaroid — pinned at the top of the rail. */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28, position: "relative" }}>
            <div style={{ position: "relative" }}>
              <NBThumb t={t} accent={t.orange} label="shubz" alt="Portrait of Shubhangi Sharma" w={180} h={180} tilt={-1.8} src="/contact-portrait.jpg" />
              <div style={{ position: "absolute", top: -6, right: 18 }}>
                <NBThumbtack color={t.orange} ink={t.ink} size={16} />
              </div>
            </div>
          </div>

          {/* Protocol pre block → Outreach (orange). */}
          <NBPrompt t={t} cwd="~/contact" cmd="cat .protocol" comment="how I read mail" accent={t.orange} />
          {/* Protocol pre — data from CONTACT_PROTOCOL. JSON syntax
              highlighting is an explicit exception (DECISIONS-v5.md §14). */}
          <pre style={{
            background: t.paper2, border: `1px solid ${t.rule}`,
            padding: "12px 14px", borderRadius: 3,
            fontFamily: "var(--f-mono)", fontSize: 12, lineHeight: 1.8,
            color: t.softInk, margin: 0, whiteSpace: "pre-wrap",
          }}>{"{\n"}{Object.entries(CONTACT_PROTOCOL).map(([k, v], i, arr) => {
            const pad = " ".repeat(Math.max(0, 9 - k.length));
            return (
              <React.Fragment key={k}>
                {"  "}<span style={{ color: t.blue }}>"{k}"</span>:{pad}<span style={{ color: t.ochre }}>"{v}"</span>{i < arr.length - 1 ? "," : ""}{"\n"}
              </React.Fragment>
            );
          })}{"}"}</pre>

          {/* Open-to block — moved here from /work. It's a communication
              preference (who I'd love to hear from), not a CV item. */}
          <div style={{ marginTop: 28 }}>
            <NBPrompt t={t} cwd="~/contact" cmd="cat ./open-to.md" comment="collab" accent={t.orange} />
            <div style={{
              background: t.paper2, border: `1px solid ${t.rule}`,
              padding: "14px 16px", borderRadius: 3,
              fontFamily: "var(--f-body)", fontSize: 14, lineHeight: 1.55,
              color: t.softInk,
            }}>
              {renderSpans(CONTACT_OPEN_TO, t)}
            </div>
          </div>
        </aside>
      </div>
    </NBPageShell>
  );
}
