// @ts-nocheck
/* eslint-disable */
/**
 * NB.tsx — V5 "Field notebook × terminal" chrome primitives.
 *
 * Single bundle (matches the design-handoff `nb-shared.jsx` layout) so the
 * V5 pages can `import { NBPageShell, NBPrompt, ... } from "../chrome/NB"`
 * with one statement. V4 chrome in this same directory is untouched.
 *
 * Spec: design_handoff_v5_field_notebook/AGENTS-v5.md
 * Reversibility: deleting this file + flipping AppShell back to V4 restores
 *   the previous site without touching any data, content, or essay bodies.
 */
import React from "react";
import { NB_LIGHT, NB_DARK, nbTheme } from "../../data/palette";
import { JOURNAL } from "../../data/now";
import { useIsMobile } from "../../lib/hooks";

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
    ["~/writing", "writing"],
    ["~/work", "work"],
    ["~/now", "now"],
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
}: {
  t: any;
  label?: string;
  date?: string;
}) {
  const isMobile = useIsMobile();
  return (
    <div style={{
      padding: isMobile ? "14px 20px 0" : "18px 64px 0",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted,
      letterSpacing: "0.04em", gap: 12, flexWrap: "wrap",
    }}>
      <span><span style={{ color: t.prompt, marginRight: 8 }}>●</span>SHUBZ SHARMA · {label}</span>
      <span style={{
        padding: "4px 10px", border: `1.5px dashed ${t.muted}`, fontSize: 11,
        transform: "rotate(-1.2deg)", color: t.ochre,
      }}>
        <span style={{ color: t.muted, marginRight: 6 }}>last updated</span>· {date}
      </span>
    </div>
  );
}

// =============================================================================
// PROMPT — shubz@orion ~/cwd % cmd  # comment
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
      <span style={{ color: t.prompt }}>shubz@orion</span>
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
}: {
  t: any;
  n: string;
  command: string;
  title: React.ReactNode;
  accent: string;
  level?: number;
  comment?: string;
  cwd?: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
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
  return <span style={{
    display: "inline-block", width: 9, height: 16, background: t.prompt,
    verticalAlign: "text-bottom", marginLeft: 2,
    animation: "nb-blink 1s steps(2, end) infinite",
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
  w = 120,
  h = 88,
  tilt = -1.5,
  src,
}: {
  t: any;
  accent: string;
  label?: string;
  w?: number;
  h?: number;
  tilt?: number;
  src?: string;
}) {
  return (
    <div style={{
      width: w + 8, height: h + 18,
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
          ? `center / cover no-repeat url(${src})`
          : `repeating-linear-gradient(135deg, ${accent}26 0px, ${accent}26 2px, transparent 2px, transparent 7px), ${accent}10`,
        border: `1px solid ${accent}55`,
        position: "relative",
      }}>
        {!src && (
          <span style={{
            position: "absolute", inset: 0, display: "grid", placeItems: "center",
            fontFamily: "var(--f-mono)", fontSize: 9, color: accent, letterSpacing: "0.06em",
          }}>{label}</span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MARGINALIA — rotated red italic, absolute-positioned
// =============================================================================
export function NBMarginalia({
  t,
  children,
  top = 130,
  right = -20,
  tilt = 2.5,
}: {
  t: any;
  children: React.ReactNode;
  top?: number;
  right?: number;
  tilt?: number;
}) {
  return (
    <div className="nb-marginalia" style={{
      position: "absolute", right, top,
      transform: `rotate(${tilt}deg)`,
      fontFamily: "var(--f-display)", fontStyle: "italic",
      fontSize: 16, color: t.red, lineHeight: 1.3, maxWidth: 130,
      borderLeft: `2px solid ${t.red}`, paddingLeft: 8,
      pointerEvents: "none",
    }}>
      {children}
    </div>
  );
}

// =============================================================================
// STATUS FOOTER — zsh status row
// =============================================================================
export function NBStatusFooter({ t, page = "home" }: { t: any; page?: NBPageKey }) {
  const isMobile = useIsMobile();
  return (
    <div style={{
      marginTop: 32,
      borderTop: `1px solid ${t.rule}`,
      background: t.chrome,
      padding: isMobile ? "10px 20px" : "10px 64px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: 8,
      fontFamily: "var(--f-mono)", fontSize: 11, color: t.muted,
    }}>
      <span><span style={{ color: t.prompt }}>●</span> connected · zsh 5.9 · vol.04</span>
      <span style={{ fontFamily: "var(--f-display)", fontStyle: "italic", color: t.softInk, fontSize: 13 }}>Made in London — pen + tea.</span>
      <span>© Shubz Sharma · /{page === "home" ? "" : page}</span>
    </div>
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
  autoplaySec = 5,
  cwd = "~/home",
  cmd = "cat .now",
}: {
  t: any;
  accent: string;
  lines?: MiniLine[] | null;
  autoplaySec?: number;
  cwd?: string;
  cmd?: string;
}) {
  // Build from JOURNAL if no explicit lines provided. Cycle accent colours
  // so each entry gets a stable colour in the streaming readout.
  const allLines: MiniLine[] = React.useMemo(() => {
    if (lines) return lines;
    const palette = ["prompt", "teal", "ochre", "magenta", "purple", "red"];
    return JOURNAL.map((j: any, i: number) => {
      // YYYY-MM → "mon yy"
      const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
      const [yr, mo] = (j.date || "").split("-");
      const d = mo && yr ? `${months[Number(mo) - 1]} ${yr.slice(-2)}` : (j.date || "—");
      return { d, c: t[palette[i % palette.length]] || t.ink, txt: j.note };
    });
  }, [lines, t]);

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
    <div style={{
      background: t.paper2, border: `1px solid ${t.rule}`, borderRadius: 3,
      padding: "12px 14px 14px", fontFamily: "var(--f-mono)", fontSize: 12,
      lineHeight: 1.7, minHeight: 240, overflow: "hidden", position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, paddingBottom: 8, borderBottom: `1px dashed ${t.rule}` }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: "#FF5F57" }} />
        <span style={{ width: 7, height: 7, borderRadius: 999, background: "#FEBC2E" }} />
        <span style={{ width: 7, height: 7, borderRadius: 999, background: "#27C840" }} />
        <span style={{ color: t.muted, fontSize: 10, marginLeft: 6, flex: 1 }}>{cwd} — {cmd}</span>
        <button
          onClick={() => setPlaying((p) => !p)}
          style={{
            background: "transparent", border: `1px solid ${t.muted}55`,
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
        background: `repeating-linear-gradient(135deg, ${accent}1f 0px, ${accent}1f 1px, transparent 1px, transparent 8px), ${accent}08`,
        border: `1px solid ${accent}55`,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(110deg, transparent 30%, ${accent}22 50%, transparent 70%)`,
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
  const gridColor = mode === "dark" ? "rgba(126,148,255,0.07)" : t.rule;
  return (
    <div
      className="nb-graph-paper"
      style={{
        background: t.paper, color: t.ink, minHeight: "100vh",
        fontFamily: "var(--f-body)",
        // graph-paper grid colour follows the active theme.
        ["--nb-grid" as any]: gridColor,
      }}
    >
      <NBMacChrome t={t} mode={mode} label={label} onToggle={onToggle} />
      <NBTabStrip t={t} current={current} onNavigate={onNavigate} />
      {children}
      <NBStatusFooter t={t} page={current} />
    </div>
  );
}

export { NB_LIGHT, NB_DARK, nbTheme };
