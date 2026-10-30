import React, { useEffect, useRef, useState } from "react";
import { nbTheme, type NBTheme } from "../../data/palette";
import { NOTEBOOK_NAV, NOTEBOOK_COPY, PENS, WORKBENCH_COPY, COMPANION_COPY, DISCOVERY_COPY } from "../../data/notebook";
import { SITE_LAST_UPDATED_DATE } from "../../data/site";
import { BIO, type Span } from "../../data/home";
import { JOURNAL } from "../../data/now";
import { useHeaderHidden } from "../../lib/v6";
import { VISIBLE_POSTS, isAvailableSiteLink } from "../../data/posts";

import { WorkbenchGrid } from "./WorkbenchGrid";
import { PaperclipProvider, PaperclipTray } from "./Paperclips";
import { FieldIndex } from "./FieldIndex";
import { WorkbenchSoundProvider, SoundSurface, SoundToggle, useWorkbenchSound } from "./WorkbenchSound";
import { NarratorSprite } from "./NarratorSprite";
import { CompanionProvider, CatCompanion, useCompanion } from "./RoboCat";

export type NotebookPage = "home" | "work" | "builds" | "writing" | "now" | "contact" | "essay" | "tty" | "not-found";
export type PageProps = { dark: boolean; toggleTheme: () => void; onNavigate: (page: string, slug?: string | null) => void };

export function Spans({ value, t = nbTheme("light") }: { value: Span[]; t?: NBTheme }) {
  return <>{value.map((s, i) => {
    if (typeof s === "string") return s;
    const style = { color: s.c ? t[s.c] : undefined };
    if ("em" in s) return <em key={i} style={style}>{s.em}</em>;
    if ("link" in s) return isAvailableSiteLink(s.href) ? <a key={i} href={s.href} style={style}>{s.link}</a> : <span key={i} style={style}>{s.link}</span>;
    return <span key={i} style={style}>{s.tag}</span>;
  })}</>;
}

export function NotebookMark() {
  return <svg className="notebook-monogram" width="40" height="46" viewBox="0 0 48 56" fill="none" aria-hidden="true">
    <path d="M8 7Q8 4 12 4H42V47H12Q6 47 6 51V11Q6 7 8 7Z" fill="currentColor" opacity=".08"/>
    <path d="M12 4H42V47H12Q6 47 6 51Q6 54 12 54H42M6 51V11Q6 4 12 4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M12 8V43M13 50H39" stroke="currentColor" strokeWidth="1" opacity=".55"/>
    <g stroke="currentColor" strokeWidth="2.7" strokeLinecap="round">
      <path d="M26 17C18 10 12 19 20 24C29 29 23 39 15 34"/>
      <path d="M37 21C29 14 23 23 31 28C40 33 34 43 26 38"/>
    </g>
    <path d="M33 4V12L36 10L39 12V4" fill="currentColor"/>
  </svg>;
}

export function NotebookShell({ current, mode, onToggle, children, label }: { current: NotebookPage; mode: "dark" | "light"; onToggle?: () => void; children: React.ReactNode; t?: NBTheme; onNavigate?: unknown; label?: string }) {
  const headerHidden = useHeaderHidden();
  const active = current === "essay" ? "writing" : current;
  const index = NOTEBOOK_NAV.findIndex(n => n.key === active);
  const next = NOTEBOOK_NAV[(index + 1) % NOTEBOOK_NAV.length];
  useEffect(() => {
    try {
      const pen = localStorage.getItem("notebook-pen");
      if (PENS.some(p => p.key === pen)) document.documentElement.style.setProperty("--folio-accent", `var(--nb-${pen})`);
    } catch {}
  }, []);
  return <WorkbenchSoundProvider><PaperclipProvider><CompanionProvider><SoundSurface><div className={`folio folio-${current}`}>
    <WorkbenchGrid/>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`folio-header ${headerHidden ? "folio-header-away" : ""}`}>
      <div className="notebook-window-bar">
        <div className="window-lights" aria-hidden="true"><i/><i/><i/></div>
        <span className="window-title">{label || `shubz — ~/${current === "home" ? "notebook" : active} — vim`}</span>
        <div className="header-toggles"><SoundToggle compact/><button type="button" className="theme-toggle" onClick={onToggle} aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`} title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">{mode === "dark" ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></> : <path d="M20.5 14A9 9 0 0 1 10 3a9 9 0 1 0 10.5 11Z"/>}</svg></button></div>
      </div>
      <div className="folio-header-inner">
        <a className="folio-brand" href="/" aria-label="Shubz Sharma, home"><NotebookMark/><span>{NOTEBOOK_COPY.brand}<small>{NOTEBOOK_COPY.subtitle}</small></span></a>
        <nav className="folio-nav" aria-label="Main navigation">{NOTEBOOK_NAV.map(n => <a key={n.key} href={n.path} aria-current={active === n.key ? "page" : undefined}><span>{n.act}</span><span className="nav-label-long">{n.label}</span><span className="nav-label-short">{n.short}</span></a>)}</nav>

      </div>
    </header>
    <div className="workbench-status"><span><i/>{WORKBENCH_COPY.edition}</span><span>{WORKBENCH_COPY.status}</span><div className="workbench-utilities"><FieldIndex/><PaperclipTray/></div></div>
    {children}
    {current !== "tty" && <footer className="folio-footer">
      <div className="folio-footer-top"><div><span className="eyebrow">The next page</span><a href={next.path}>{next.label}<span>↗</span></a></div><p>{NOTEBOOK_COPY.edition}</p><NotebookMark/></div>
      <div className="folio-colophon"><span>© Shubz Sharma</span><span>{NOTEBOOK_COPY.location} · last written {SITE_LAST_UPDATED_DATE}</span></div>
    </footer>}
  </div></SoundSurface></CompanionProvider></PaperclipProvider></WorkbenchSoundProvider>;
}

export function PageHero({ n, label, title, children, aside }: { n: string; label: string; title: React.ReactNode; children?: React.ReactNode; aside?: React.ReactNode }) {
  return <header className="page-hero"><div><div className="eyebrow"><span className="chapter">{n}</span>{label}</div><h1>{title}</h1>{children && <div className="page-lede">{children}</div>}</div>{aside && <aside>{aside}</aside>}</header>;
}

export function SectionLabel({ n, title, link, href }: { n?: string; title: string; link?: string; href?: string }) {
  return <div className="section-label"><h2>{n && <span>{n}</span>}{title}</h2>{href && <a href={href}>{link || "view all ↗"}</a>}</div>;
}

export function Photo({ src, alt, caption, tilt = -2 }: { src: string; alt: string; caption: string; tilt?: number }) {
  return <figure className="folio-photo" style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}><div className="photo-tape" aria-hidden="true"/><img src={src} alt={alt} loading="lazy"/><figcaption>{caption}</figcaption></figure>;
}

export function PenShelf() {
  const sound=useWorkbenchSound();
  return <div className="pen-shelf"><div><span className="eyebrow">Ten pens, ten subjects</span><span className="pen-caption">Follow an ink into the collection.</span></div><div className="pen-row">{PENS.map(p => <a href={`/builds/?topic=${p.key}#catalogue`} onClick={()=>sound.play("pen")} key={p.key} style={{ "--pen": `var(--nb-${p.key})` } as React.CSSProperties} title={p.label} aria-label={`Explore ${p.label}`}><span className="pen-tool"><i/><b/><em/></span><span className="pen-name">{p.label}</span></a>)}</div></div>;
}

export function DeskScene() {
  const sound=useWorkbenchSound();
  const [open, setOpen] = useState(false);
  return <div className={`desk-scene ${open ? "book-is-open" : ""}`}>
    <div className="desk-objects">
    <div className="desk-orbit" aria-hidden="true"><span>notes from a work in progress</span></div>
    <div className="desk-book">
      <div className="book-leaves"><span className="eyebrow">Contents</span><p>{NOTEBOOK_COPY.bookInscription}</p>{NOTEBOOK_NAV.slice(1).map(n => <a href={n.path} key={n.key}><span>{n.act}</span>{n.label}<span>↗</span></a>)}</div>
      <button type="button" className="book-cover" onClick={() => {sound.play(open?"close":"open");setOpen(!open);}} aria-expanded={open} aria-label={open ? NOTEBOOK_COPY.bookClose : NOTEBOOK_COPY.bookHint}><span className="book-cover-front"><span className="book-cover-top">OBSERVATIONS / EXPERIMENTS</span><span className="book-emblem"><NotebookMark/></span><strong>{NOTEBOOK_COPY.bookTitle}</strong><span className="book-cover-byline">{NOTEBOOK_COPY.bookByline}</span><span className="book-band"/><span className="book-open-label">{NOTEBOOK_COPY.bookHint} ↗</span></span><span className="book-cover-back" aria-hidden="true"><NotebookMark/><span>Shubz Sharma</span></span></button>
    </div>
    <NarratorSprite className="desk-girl"/>
    <CatCompanion placement="desk"/>
    <span className="desk-caption">fig. 01 / the author, in the margin</span>
    </div>
    {open && <button className="book-close text-button" onClick={() => {sound.play("close");setOpen(false);}}>{NOTEBOOK_COPY.bookClose} ↶</button>}
  </div>;
}

type TerminalEntry = { command: string; output: React.ReactNode };
export function NotebookTerminal({ full = false, onTheme }: { full?: boolean; onTheme?: () => void }) {
  const companion = useCompanion();
  const sound=useWorkbenchSound();
  const [showIntro,setShowIntro] = useState(true);
  const [command, setCommand] = useState("");
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const intro = <>{JOURNAL.slice(0,2).map((j,i) => <p key={i}><span className="terminal-date">{j.date}</span>{j.brief || j.note}</p>)}</>;
  const run = (raw: string) => {
    const cmd = raw.trim(); if (!cmd) return;
    if(!/^(pet|sound)(\s|$)/i.test(cmd))sound.play(cmd.toLowerCase().startsWith("pen ")?"pen":"terminal");
    const [verb, ...rest] = cmd.toLowerCase().split(/\s+/); const arg = rest.join(" ");
    let output: React.ReactNode = NOTEBOOK_COPY.terminalUnknown;
    if (verb === "clear") { setEntries([]); setCommand(""); setShowIntro(false); setHistoryIndex(-1); return; }
    if (verb === "help") output = NOTEBOOK_COPY.terminalHelp + " Clear the screen with clear; switch the light with theme. Pixel responds to pet, pet sleep and pet quiet. " + DISCOVERY_COPY.soundHelp;
    if (verb === "pet" && companion) {
      if (!arg) { companion.pet(); output = COMPANION_COPY.purring; }
      else if (arg === "sleep") { companion.rest(true); output = COMPANION_COPY.sleeping; }
      else if (arg === "wake" || arg === "follow") { companion.rest(false);companion.hide(false);output = COMPANION_COPY.idle; }
      else if (arg === "quiet") { companion.silence(true);output = COMPANION_COPY.quietResponse; }
      else if (arg === "motion") { companion.silence(false);output = COMPANION_COPY.motionResponse; }
      else if (arg === "hide") { companion.hide(true);output = COMPANION_COPY.hiddenResponse; }
      else if (arg === "show") { companion.hide(false);output = COMPANION_COPY.shownResponse; }
      else output = COMPANION_COPY.help;
    }
    if (verb === "sound") {
      if(!sound.available)output=DISCOVERY_COPY.soundUnavailable;
      else if(arg==="on"){if(!sound.enabled)sound.toggle();output=DISCOVERY_COPY.soundEnabled;}
      else if(arg==="off"){if(sound.enabled)sound.toggle();output=DISCOVERY_COPY.soundDisabled;}
      else if(arg==="test"){if(sound.enabled)sound.play("terminal");output=sound.enabled?DISCOVERY_COPY.soundTest:DISCOVERY_COPY.soundMuted;}
      else output=DISCOVERY_COPY.soundHelp;
    }
    if (verb === "pwd") output = "~/notebook";
    if (verb === "ls") output = <div className="terminal-links">{NOTEBOOK_NAV.map(n => <a href={n.path} key={n.key}>{n.label} <span>{n.path}</span> ↗</a>)}</div>;
    if (verb === "cat" && arg === ".now") output = intro;
    if (verb === "cat" && ["bio", "bio.md", "about.md"].includes(arg)) output = <span className="terminal-bio"><Spans value={BIO}/></span>;
    if (verb === "open") {
      const path = arg.replace(/^\/+|\/+$/g, "");
      const target = path ? `/${path}/` : "/";
      const safe = NOTEBOOK_NAV.some(n => n.path === target) || VISIBLE_POSTS.some(p => `/${p.slug}/` === target);
      output = safe ? <a href={target}>Open {target} ↗</a> : "Try open /work, open /builds or open /writing.";
      if (safe) window.location.assign(target);
    }
    if (verb === "pen") {
      const pen = PENS.find(p => p.key === arg || p.label.toLowerCase() === arg);
      if (pen) {
        document.documentElement.style.setProperty("--folio-accent", `var(--nb-${pen.key})`);
        try { localStorage.setItem("notebook-pen", pen.key); } catch {}
        output = `Writing with ${pen.label.toLowerCase()} ink.`;
      } else output = "Pens: " + PENS.map(p => p.key).join(", ") + ".";
    }
    if (verb === "theme") { onTheme?.(); output = "Switched the desk light."; }
    if (cmd.toLowerCase() === "sudo hire-me") output = <a href="/contact/">That probably calls for a letter. /contact ↗</a>;
    setEntries(e => [...e, { command: cmd, output }].slice(-30)); setCommand(""); setHistoryIndex(-1);
    input.current?.focus();
  };
  useEffect(() => { if (log.current && entries.length) log.current.scrollTop = log.current.scrollHeight; }, [entries]);
  return <section className={`notebook-terminal ${full ? "terminal-full" : ""}`} aria-label={NOTEBOOK_COPY.terminalTitle}>
    <div className="terminal-bar"><span className="terminal-light"/>{full ? "~/notebook" : "Notebook"} <span>interactive</span>{full && <a href="/">back to the desk ↗</a>}</div>
    <div className="terminal-log" ref={log} role="log" aria-live="polite" aria-relevant="additions">
      {showIntro && <><div className="terminal-command"><span>~ %</span> cat .now</div>{intro}</>}
      {entries.map((entry,i) => <div key={i}><div className="terminal-command"><span>~ %</span> {entry.command}</div><div className="terminal-output">{entry.output}</div></div>)}
    </div>
    <form className="terminal-input" onSubmit={e => {e.preventDefault();run(command);}}><label htmlFor={full ? "tty-command" : "desk-command"}>~ %</label><input ref={input} id={full ? "tty-command" : "desk-command"} value={command} onChange={e => setCommand(e.target.value)} onKeyDown={e => {if (e.key === "ArrowUp" || e.key === "ArrowDown") {e.preventDefault();const next = Math.min(entries.length - 1, Math.max(-1, historyIndex + (e.key === "ArrowUp" ? 1 : -1)));setHistoryIndex(next);setCommand(next === -1 ? "" : entries[entries.length - 1 - next]?.command || "");}}} placeholder="type a command…" autoComplete="off" autoCapitalize="none" spellCheck={false} aria-label="Terminal command"/><button type="submit" aria-label="Run command">↵</button></form>
    <div className="terminal-chips">{NOTEBOOK_COPY.terminalChips.map(c => <button key={c} type="button" onClick={() => run(c)}>{c}</button>)}</div>
  </section>;
}
