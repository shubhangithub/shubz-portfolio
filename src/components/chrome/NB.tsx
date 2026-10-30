// @ts-nocheck
/* eslint-disable */
/**
 * NB.tsx — V5 "Field notebook × terminal" chrome primitives.
 *
 * Single bundle (matches the design-handoff `nb-shared.jsx` layout) so the
 * V5 pages can `import { NBPageShell, NBPrompt, ... } from "../chrome/NB"`
 * with one statement.
 */
import React from "react";
import { NotebookShell } from "./Notebook";
import { NB_LIGHT, NB_DARK, nbTheme, withAlpha } from "../../data/palette";
import { JOURNAL } from "../../data/now";
import { SITE_SHELL_USER, SITE_LAST_UPDATED_DATE } from "../../data/site";
import { useIsMobile } from "../../lib/hooks";
import { useV6Reveals, useHeaderHidden, useHudSections } from "../../lib/v6";

export type NBPageKey = "home" | "writing" | "work" | "now" | "contact" | "essay";

// =============================================================================
// MAC CHROME — traffic lights + title bar + clickable mode indicator
// =============================================================================
export function NBMacChrome({
  t,
  mode,
  label = "shubz — ~/notebook — vim",
  onToggle,
}: {
  t: any;
  mode: "light" | "dark";
  label?: string;
  onToggle?: () => void;
}) {
  // Mode toggle is a real bordered button with a sun/moon glyph in the
  // accent colour, so it reads as obviously interactive rather than as
  // a passive chrome label. "100×42" easter egg stays in muted tone.
  const isDark = mode === "dark";
  const iconColor = isDark ? t.blue : t.ochre;
  return (
    <div style={{
      height: 32, background: t.chrome, display: "flex", alignItems: "center",
      padding: "0 12px", gap: 14, borderBottom: `1px solid ${t.rule}`,
      fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted,
    }}>
      <div style={{ display: "flex", gap: 7 }}>
        <span style={{ width: 12, height: 12, borderRadius: 999, background: "#FF5F57", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.2)" }} />
        <span style={{ width: 12, height: 12, borderRadius: 999, background: "#FEBC2E", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.2)" }} />
        <span style={{ width: 12, height: 12, borderRadius: 999, background: "#27C840", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.2)" }} />
      </div>
      <span style={{ flex: 1, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <button
        onClick={onToggle}
        aria-label={isDark ? "switch to light mode" : "switch to dark mode"}
        title={isDark ? "switch to light mode" : "switch to dark mode"}
        style={{
          all: "unset",
          cursor: onToggle ? "pointer" : "default",
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "3px 10px",
          border: `1px dashed ${t.muted}`,
          borderRadius: 3,
          fontFamily: "var(--f-mono)", fontSize: 11,
          color: t.ink,
          transition: "background 160ms var(--ease-out), border-color 160ms var(--ease-out)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderStyle = "solid";
          el.style.borderColor = iconColor;
          el.style.background = `${iconColor}14`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderStyle = "dashed";
          el.style.borderColor = t.muted;
          el.style.background = "transparent";
        }}
      >
        <span style={{ color: iconColor, fontSize: 13, lineHeight: 1 }}>
          {isDark ? "☾" : "☀"}
        </span>
        <span>{isDark ? "dark" : "light"}</span>
        <span style={{ color: t.muted }}>· 100×42</span>
      </button>
    </div>
  );
}

// =============================================================================
// TAB STRIP — ~/home etc. with live HH:MM GMT
// =============================================================================
export function NBTabStrip({
  t,
  current = "home",
  onNavigate,
}: {
  t: any;
  current?: NBPageKey;
  onNavigate?: (p: NBPageKey) => void;
}) {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const tabs: [string, NBPageKey][] = [
    ["~/home", "home"],
    ["~/now", "now"],
    ["~/work", "work"],
    ["~/writing", "writing"],
    ["~/contact", "contact"],
  ];
  const isMobile = useIsMobile();
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${t.rule}`, background: t.chrome, fontSize: 12, overflowX: "auto", scrollbarWidth: "none" }}>
      {tabs.map(([n, key]) => {
        const active = key === current || (current === "essay" && key === "writing");
        return (
          <a
            key={n}
            href={key === "home" ? "/" : `/${key}/`}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(key);
              }
            }}
            style={{
              padding: isMobile ? "8px 12px" : "8px 18px",
              background: active ? t.paper : "transparent",
              color: active ? t.ink : t.muted,
              borderRight: `1px solid ${t.rule}`,
              borderBottom: active ? `1px solid ${t.paper}` : "none",
              marginBottom: -1,
              fontFamily: "var(--f-mono)",
              cursor: "pointer",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {n}{active && <span style={{ color: t.muted, marginLeft: 6 }}>×</span>}
          </a>
        );
      })}
      <div style={{ flex: 1, minWidth: 12 }} />
      {!isMobile && (
        <div style={{ padding: "8px 14px", color: t.muted, display: "flex", gap: 14, fontFamily: "var(--f-mono)", whiteSpace: "nowrap" }}>
          <span style={{ color: t.prompt }}>●</span>
          <span>connected</span>
          <span>{hh}:{mm} GMT</span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// LAST UPDATED — rotated dashed-border stamp top-right
// =============================================================================
export function NBLastUpdated({
  t,
  label = "NOTEBOOK",
  date = "26 may 2026",
  accent,
  cwd,
  cmd,
  comment,
}: {
  t: any;
  label?: string;
  date?: string;
  accent?: string;
  cwd?: string;
  cmd?: string;
  comment?: string;
}) {
  const isMobile = useIsMobile();
  const stampColour = accent || t.yellow;
  return (
    <div style={{
      padding: isMobile ? "14px 20px 0" : "18px 64px 0",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted,
      letterSpacing: "0.04em", gap: 12, flexWrap: "wrap",
    }}>
      <span style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <span style={{ color: t.prompt }}>●</span>
        {cmd && <>
          <span style={{ color: t.prompt }}>{SITE_SHELL_USER}</span>
          {cwd && <span style={{ color: t.muted }}>{cwd}</span>}
          <span style={{ color: accent || t.blue }}>%</span>
          <span style={{ color: t.ink }}>{cmd}</span>
          {comment && <span style={{ color: t.muted }}># {comment}</span>}
        </>}
      </span>
      <span style={{
        padding: "4px 10px", border: `1.5px dashed ${t.muted}`, fontSize: 11,
        transform: "rotate(-1.2deg)", color: stampColour,
      }}>
        <span style={{ color: t.muted, marginRight: 6 }}>last updated</span>· {date}
      </span>
    </div>
  );
}

// =============================================================================
// PROMPT — current shell identity + ~/cwd % cmd # comment
// =============================================================================
export function NBPrompt({
  t,
  cwd = "~/home",
  cmd,
  comment,
  accent,
}: {
  t: any;
  cwd?: string;
  cmd: string;
  comment?: string;
  accent?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, color: t.softInk, fontFamily: "var(--f-mono)", fontSize: 13, marginBottom: 10, flexWrap: "wrap" }}>
      <span style={{ color: t.prompt }}>{SITE_SHELL_USER}</span>
      <span style={{ color: t.muted }}>{cwd}</span>
      <span style={{ color: accent || t.blue }}>%</span>
      <span style={{ color: t.ink }}>{cmd}</span>
      {comment && <span style={{ color: t.muted, marginLeft: 8 }}># {comment}</span>}
    </div>
  );
}

// =============================================================================
// PROMPT HEAD — shell prompt + display-serif §-numbered heading
// =============================================================================
export function NBPromptHead({
  t,
  n,
  command,
  title,
  accent,
  level = 32,
  comment,
  cwd,
  hud,
}: {
  t: any;
  n: string;
  command: string;
  title: React.ReactNode;
  accent: string;
  level?: number;
  comment?: string;
  cwd?: string;
  /** V6: label for the section HUD wayfinder. Defaults to the title when
   *  it's a plain string; pass explicitly for rich titles, or "" to opt out. */
  hud?: string;
}) {
  const hudLabel = hud ?? (typeof title === "string" ? title.toLowerCase() : undefined);
  const hudId = hudLabel
    ? `${n.replace("§", "s")}-${hudLabel.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`
    : undefined;
  return (
    <div
      id={hudId}
      data-hud={hudLabel || undefined}
      data-reveal="rise"
      style={{ marginBottom: 18, scrollMarginTop: 96 }}
    >
      <NBPrompt t={t} cwd={cwd} cmd={command} comment={comment} accent={accent} />
      <h2 style={{
        fontFamily: "var(--f-display)",
        fontVariationSettings: '"opsz" 144, "SOFT" 50',
        fontSize: level, margin: 0, color: t.ink,
        display: "flex", alignItems: "baseline", gap: 12,
        fontWeight: 400,
      }}>
        <span style={{ fontFamily: "var(--f-mono)", color: accent, fontSize: 14 }}>{n}</span>
        {title}
      </h2>
    </div>
  );
}

// =============================================================================
// BLINKER — terminal cursor blip
// =============================================================================
export function NBBlinker({ t }: { t: any }) {
  return <span className="v6-cursor" style={{
    display: "inline-block", width: 9, height: 16, background: t.prompt,
    verticalAlign: "text-bottom", marginLeft: 2,
    animation: "nb-blink 1s steps(2, end) infinite",
    ["--v6-glow-c" as any]: t.prompt,
  }} />;
}

// =============================================================================
// THUMBTACK — small pinhead svg
// =============================================================================
export function NBThumbtack({ color, ink, size = 14 }: { color: string; ink: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ display: "inline-block", marginRight: 8, verticalAlign: "middle", flexShrink: 0 }}>
      <circle cx="8" cy="7" r="5" fill={color} />
      <circle cx="6.4" cy="5.4" r="1.4" fill="rgba(255,255,255,0.5)" />
      <path d="M 8 11 L 8 14" stroke={ink} strokeWidth="1" />
    </svg>
  );
}

// =============================================================================
// THUMB — tilted polaroid frame (striped accent fill if no src)
// =============================================================================
export function NBThumb({
  t,
  accent,
  label = "img",
  alt,
  w = 120,
  h = 88,
  tilt = -1.5,
  src,
  caption,
}: {
  t: any;
  accent: string;
  label?: string;
  /** Descriptive alt text when `src` is set. Defaults to `label`. Empty
   *  string ("") marks the image as decorative. */
  alt?: string;
  w?: number;
  h?: number;
  tilt?: number;
  src?: string;
  /** Handwritten-style line inside the polaroid's bottom margin. */
  caption?: string;
}) {
  return (
    <div data-reveal="develop" style={{
      width: w + 8, height: caption ? "auto" : h + 18,
      padding: "4px 4px 12px",
      background: t.paper2,
      border: `1px solid ${t.rule}`,
      boxShadow: `0 2px 0 ${t.rule}, 0 6px 14px rgba(0,0,0,0.05)`,
      transform: `rotate(${tilt}deg)`,
      flex: "0 0 auto",
      position: "relative",
    }}>
      <div style={{
        width: w, height: h,
        background: src
          ? "transparent"
          : `repeating-linear-gradient(135deg, ${withAlpha(accent, "26")} 0px, ${withAlpha(accent, "26")} 2px, transparent 2px, transparent 7px), ${withAlpha(accent, "10")}`,
        border: `1px solid ${withAlpha(accent, "55")}`,
        position: "relative",
        overflow: "hidden",
      }}>
        {src ? (
          <img
            src={src}
            alt={alt ?? label}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span style={{
            position: "absolute", inset: 0, display: "grid", placeItems: "center",
            fontFamily: "var(--f-mono)", fontSize: 9, color: accent, letterSpacing: "0.06em",
          }}>{label}</span>
        )}
      </div>
      {caption && (
        <div style={{
          fontFamily: "var(--f-display)", fontStyle: "italic",
          fontSize: 13.5, lineHeight: 1.35, color: t.ink,
          padding: "9px 6px 2px",
        }}>{caption}</div>
      )}
    </div>
  );
}

// =============================================================================
// MARGINALIA — rotated italic, absolute-positioned. V5 canonical: pass the
// `accent` prop with the marginalia's TOPICAL colour (the topic the note's
// content belongs to). Defaults to red (legacy "red pen" pen-metaphor); the
// fully-aligned site overrides on every call. See DECISIONS-v5.md §14.
// =============================================================================
export function NBMarginalia({
  t,
  children,
  top = 130,
  right = -20,
  tilt = 2.5,
  accent,
}: {
  t: any;
  children: React.ReactNode;
  top?: number;
  right?: number;
  tilt?: number;
  /** V5: topical accent for this margin note. */
  accent?: string;
}) {
  const c = accent || t.red;
  return (
    <div className="nb-marginalia" style={{
      position: "absolute", right, top,
      transform: `rotate(${tilt}deg)`,
      fontFamily: "var(--f-display)", fontStyle: "italic",
      fontSize: 16, color: c, lineHeight: 1.3, maxWidth: 130,
      borderLeft: `2px solid ${c}`, paddingLeft: 8,
      pointerEvents: "none",
    }}>
      {children}
    </div>
  );
}

// =============================================================================
// STATUS FOOTER — engineering titleblock + zsh status row
// =============================================================================
export function NBStatusFooter({ t, page = "home" }: { t: any; page?: NBPageKey }) {
  const isMobile = useIsMobile();
  // Titleblock: the drawing-office block from an engineering sheet
  // (V6 chrome — see DESIGN-v6.md §4; stolen with pride from usetorus.com).
  const cell: React.CSSProperties = {
    padding: isMobile ? "7px 12px" : "8px 18px",
    borderLeft: `1px solid ${t.rule}`,
    display: "flex", flexDirection: "column", gap: 2, minWidth: 0,
  };
  const k: React.CSSProperties = { fontSize: 9, letterSpacing: "0.14em", color: t.muted };
  const v: React.CSSProperties = { fontSize: 11, color: t.softInk, whiteSpace: "nowrap" };
  return (
    <div style={{ marginTop: 32 }}>
      <div data-reveal="rise" style={{
        borderTop: `1px solid ${t.rule}`,
        display: "flex", justifyContent: "flex-end",
        fontFamily: "var(--f-mono)", textTransform: "uppercase",
        overflowX: "auto", scrollbarWidth: "none",
      }}>
        <div style={{ ...cell, borderLeft: "none", marginRight: "auto", justifyContent: "center" }}>
          <span style={{ ...v, textTransform: "none", fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 13 }}>
            field notebook · sheet /{page === "home" ? "" : page}
          </span>
        </div>
        <div style={cell}><span style={k}>drawn</span><span style={v}>shubz sharma</span></div>
        <div style={cell}><span style={k}>chk'd</span><span style={v}>the reader</span></div>
        <div style={cell}>
          <span style={k}>rev</span>
          <span data-reveal="stamp" style={{ ...v, color: t.ochre, display: "inline-block" }}>{SITE_LAST_UPDATED_DATE}</span>
        </div>
      </div>
      <div style={{
        borderTop: `1px solid ${t.rule}`,
        background: t.chrome,
        padding: isMobile ? "10px 20px" : "10px 64px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 8,
        fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted,
      }}>
        <span><span style={{ color: t.prompt }}>●</span> connected · zsh 5.9</span>
        <span style={{ fontFamily: "var(--f-display)", fontStyle: "italic", color: t.softInk, fontSize: 13 }}>Made in London.</span>
        <span>© Shubz Sharma · /{page === "home" ? "" : page}</span>
      </div>
    </div>
  );
}

// =============================================================================
// SECTION HUD — fixed mono wayfinder (V6). Reads [data-hud] sections from the
// page, lights the one under the reader, announces changes politely. Appears
// only mid-page on desktop; never on mobile, never over the footer.
// =============================================================================
export function NBSectionHud({ t, page }: { t: any; page?: NBPageKey }) {
  const isMobile = useIsMobile();
  const { sections, active, visible } = useHudSections(page);
  if (isMobile || sections.length < 2) return null;
  const activeLabel = sections.find((s) => s.id === active)?.label ?? "";
  return (
    <nav
      aria-label="section wayfinder"
      style={{
        position: "fixed", right: "clamp(10px, 2vw, 28px)", bottom: 24, zIndex: 60,
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3,
        fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.06em",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(6px)",
        transition: "opacity var(--v6-dur-fast) var(--v6-ease), transform var(--v6-dur-fast) var(--v6-ease)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {sections.map((s, i) => {
        const on = s.id === active;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            style={{
              color: on ? t.ink : t.muted,
              textDecoration: "none",
              padding: "1px 6px",
              borderRight: `2px solid ${on ? t.ochre : t.rule}`,
              background: on ? withAlpha(t.ochre, "14") : "transparent",
              transition: "color var(--v6-dur-fast) var(--v6-ease), border-color var(--v6-dur-fast) var(--v6-ease)",
            }}
          >
            §{String(i + 1).padStart(2, "0")} {on ? s.label : ""}
          </a>
        );
      })}
      <span aria-live="polite" style={{
        position: "absolute", width: 1, height: 1, overflow: "hidden",
        clipPath: "inset(50%)",
      }}>{activeLabel}</span>
    </nav>
  );
}

// =============================================================================
// MINI TERM — streaming cat .now (defaults to JOURNAL from src/data/now.ts)
// =============================================================================
type MiniLine = { d: string; c: string; txt: string };

export function NBMiniTerm({
  t,
  accent,
  lines = null,
  limit,
  autoplaySec = 5,
  cwd = "~/home",
  cmd = "cat .now",
}: {
  t: any;
  accent: string;
  lines?: MiniLine[] | null;
  limit?: number;
  autoplaySec?: number;
  cwd?: string;
  cmd?: string;
}) {
  // Build from JOURNAL if no explicit lines provided. Cycle accent colours
  // so each entry gets a stable colour in the streaming readout.
  const allLines: MiniLine[] = React.useMemo(() => {
    const palette = ["prompt", "teal", "ochre", "magenta", "purple", "red"];
    const src = lines ?? JOURNAL.map((j: any, i: number) => {
      // YYYY-MM → "mon yy"
      const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
      const [yr, mo] = (j.date || "").split("-");
      const d = mo && yr ? `${months[Number(mo) - 1]} ${yr.slice(-2)}` : (j.date || "—");
      // Home rule: the mini-term streams the ≤10-word brief, never the essay.
      return { d, c: t[palette[i % palette.length]] || t.ink, txt: j.brief || j.note };
    });
    return limit ? src.slice(0, limit) : src;
  }, [lines, limit, t]);

  const [shown, setShown] = React.useState(1);
  const [playing, setPlaying] = React.useState(true);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setShown((n) => (n >= allLines.length ? 1 : n + 1));
    }, autoplaySec * 1000);
    return () => clearInterval(id);
  }, [playing, allLines.length, autoplaySec]);

  return (
    <div className="v6-crt v6-glow" style={{
      background: t.paper2, border: `1px solid ${t.rule}`, borderRadius: 3,
      padding: "12px 14px 14px", fontFamily: "var(--f-mono)", fontSize: 12,
      lineHeight: 1.7, minHeight: 240, overflow: "hidden", position: "relative",
      ["--v6-glow-c" as any]: accent,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, paddingBottom: 8, borderBottom: `1px dashed ${t.rule}` }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: "#FF5F57" }} />
        <span style={{ width: 7, height: 7, borderRadius: 999, background: "#FEBC2E" }} />
        <span style={{ width: 7, height: 7, borderRadius: 999, background: "#27C840" }} />
        <span style={{ color: t.muted, fontSize: 10, marginLeft: 6, flex: 1 }}>{cwd} — {cmd}</span>
        <button
          onClick={() => setPlaying((p) => !p)}
          style={{
            background: "transparent", border: `1px solid ${withAlpha(t.muted, "55")}`,
            color: playing ? t.prompt : t.ochre, fontFamily: "var(--f-mono)",
            fontSize: 10, padding: "2px 7px", borderRadius: 2, cursor: "pointer",
            letterSpacing: "0.04em",
          }}
          title={playing ? "pause autoplay" : "play autoplay"}
        >
          {playing ? "‖ pause" : "▶ play"}
        </button>
      </div>
      <div style={{ display: "flex", gap: 6, color: t.ink, marginBottom: 8 }}>
        <span style={{ color: t.prompt }}>shubz</span>
        <span style={{ color: accent }}>%</span>
        <span>{cmd}</span>
      </div>
      {allLines.slice(0, shown).map((l, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "4px 0" }}>
          <span style={{ color: l.c, flex: "0 0 48px" }}>{l.d}</span>
          <span style={{ color: t.softInk, fontFamily: "var(--f-body)", fontStyle: "italic", fontSize: 13 }}>{l.txt}</span>
        </div>
      ))}
      <div style={{ display: "flex", gap: 6, color: t.ink, marginTop: 8 }}>
        <span style={{ color: t.prompt }}>shubz</span>
        <span style={{ color: accent }}>%</span>
        {playing && <NBBlinker t={t} />}
      </div>
    </div>
  );
}

// =============================================================================
// DIAGRAM PLACEHOLDER — striped fill + shimmer, used inside featured cards
// =============================================================================
export function NBDiagramPlaceholder({
  t,
  accent,
  w = "100%",
  h = 280,
  label = "diagram",
  caption,
}: {
  t: any;
  accent: string;
  w?: number | string;
  h?: number | string;
  label?: string;
  caption?: string;
}) {
  return (
    <div style={{ marginBottom: 8, width: w as any, height: h as any, position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `repeating-linear-gradient(135deg, ${withAlpha(accent, "1f")} 0px, ${withAlpha(accent, "1f")} 1px, transparent 1px, transparent 8px), ${withAlpha(accent, "08")}`,
        border: `1px solid ${withAlpha(accent, "55")}`,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(110deg, transparent 30%, ${withAlpha(accent, "22")} 50%, transparent 70%)`,
          backgroundSize: "200% 100%",
          animation: "nb-shimmer 5.4s linear infinite",
        }} />
        <div style={{
          position: "absolute", top: 10, left: 12,
          fontFamily: "var(--f-mono)", fontSize: 10, color: accent, opacity: 0.8,
        }}>fig — {label}</div>
        <div style={{
          position: "absolute", inset: 0, display: "grid", placeItems: "center",
          fontFamily: "var(--f-mono)", fontSize: 12, color: accent, opacity: 0.55,
          textAlign: "center", padding: "0 20px",
        }}>react diagram → {label}</div>
      </div>
      {caption && (
        <div style={{ marginTop: 8, fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 14, color: t.softInk, maxWidth: "62ch" }}>
          {caption}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PAGE SHELL — wraps every V5 page (mac chrome, tabs, graph bg, footer)
// =============================================================================
export function NBPageShell({
  t,
  mode,
  current,
  label = "shubz — ~/notebook — vim",
  onNavigate,
  onToggle,
  children,
}: {
  t: any;
  mode: "light" | "dark";
  current: NBPageKey;
  label?: string;
  onNavigate?: (p: NBPageKey) => void;
  onToggle?: () => void;
  children: React.ReactNode;
}) {
  return <NotebookShell t={t} mode={mode} current={current} onToggle={onToggle} label={label}>{children}</NotebookShell>;
}

export { NB_LIGHT, NB_DARK, nbTheme };
