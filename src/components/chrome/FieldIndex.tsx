import React, { useEffect, useRef, useState } from "react";
import { searchFieldIndex, SUBJECT_ATLAS } from "../../data/discovery";
import { DISCOVERY_COPY as COPY } from "../../data/notebook";
import { useWorkbenchSound } from "./WorkbenchSound";

export function FieldIndex() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  const destination = useRef<{ url: URL; unchanged: boolean } | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"search" | "atlas">("search");
  const sound = useWorkbenchSound();
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = searchFieldIndex(query);
  const open = () => {
    previous.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    setView("search");
    setQuery("");
    input.current?.focus();
    sound.play("open");
  };
  const followResult = (
    event: React.MouseEvent<HTMLAnchorElement>,
    cue: "step" | "pen",
  ) => {
    sound.play(cue);
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const url = new URL(event.currentTarget.href, location.href);
    destination.current = { url, unchanged: url.href === location.href };
    dialog.current?.close();
  };
  const close = () => {
    dialog.current?.close();
    sound.play("close");
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else {
          previous.current = document.activeElement as HTMLElement;
          dialog.current?.showModal();
          setView("search");
          setQuery("");
          input.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const arrows = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
      return;
    }
    if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
    const links = Array.from(
      dialog.current?.querySelectorAll<HTMLAnchorElement>(
        ".field-results a, .atlas-node",
      ) || [],
    );
    if (!links.length) return;
    e.preventDefault();
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next =
      current < 0
        ? e.key === "ArrowDown"
          ? 0
          : links.length - 1
        : (current + (e.key === "ArrowDown" ? 1 : -1) + links.length) %
          links.length;
    links[next].focus();
  };
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="workbench-find"
        aria-haspopup="dialog"
        onClick={open}
      >
        <span aria-hidden="true">⌕</span>
        {COPY.find}
        <kbd>⌘ K</kbd>
      </button>
      <dialog
        className="field-index"
        ref={dialog}
        aria-labelledby="field-index-title"
        aria-describedby="field-index-description"
        onClose={() => {
          const navigation = destination.current;
          destination.current = null;
          if (navigation) {
            const { url, unchanged } = navigation;
            if (
              url.origin === location.origin &&
              url.pathname === location.pathname &&
              url.search === location.search
            ) {
              if (unchanged && url.hash)
                window.dispatchEvent(new HashChangeEvent("hashchange"));
              requestAnimationFrame(() => {
                let id = "main";
                try {
                  id = decodeURIComponent(url.hash.slice(1)) || "main";
                } catch {}
                const target = document.getElementById(id);
                const focusTarget = target?.matches(
                  "[tabindex],a,button,input,summary",
                )
                  ? target
                  : target?.querySelector<HTMLElement>("summary,a,button");
                focusTarget?.focus({ preventScroll: true });
              });
            }
            return;
          }
          if (previous.current?.isConnected) previous.current.focus();
          else trigger.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={arrows}
      >
        <div className="field-index-inner">
          <header className="field-index-heading">
            <div>
              <span className="eyebrow">~/notebook / index</span>
              <h2 id="field-index-title">{COPY.title}</h2>
            </div>
            <button type="button" aria-label={COPY.close} onClick={close}>
              ×
            </button>
          </header>
          <p id="field-index-description">{COPY.description}</p>
          <div
            className="field-mode"
            role="group"
            aria-label="Explore the notebook"
          >
            <button
              aria-pressed={view === "search"}
              onClick={() => {
                setView("search");
                requestAnimationFrame(() => input.current?.focus());
              }}
            >
              {COPY.index}
            </button>
            <button
              aria-pressed={view === "atlas"}
              onClick={() => {
                setView("atlas");
                sound.play("pen");
              }}
            >
              {COPY.atlas}
              <span>10</span>
            </button>
          </div>
          {view === "search" ? (
            <>
              <label className="field-search">
                <span aria-hidden="true">⌕</span>
                <span className="sr-only">{COPY.search}</span>
                <input
                  ref={input}
                  autoFocus
                  type="search"
                  placeholder={COPY.placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-controls="field-results"
                />
              </label>
              <div className="field-result-count" role="status">
                {results.length} {results.length === 1 ? "match" : "matches"}
                {!words.length ? " · pages to start with" : ""}
              </div>
              <ul id="field-results" className="field-results">
                {results.map((e, i) => (
                  <li key={e.href + i}>
                    <a
                      href={e.href}
                      style={
                        {
                          "--index-ink": `var(--nb-${e.cat || "cyan"})`,
                        } as React.CSSProperties
                      }
                      onClick={(event) => followResult(event, "step")}
                    >
                      <span className="field-result-kind">{e.kind}</span>
                      <strong>{e.title}</strong>
                      <small>{e.detail}</small>
                      <span className="field-result-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              {!results.length && <p className="field-empty">{COPY.empty}</p>}
            </>
          ) : (
            <>
              <p className="atlas-intro">{COPY.atlasNote}</p>
              <div className="subject-atlas">
                <svg
                  className="atlas-wiring"
                  viewBox="0 0 600 500"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M300 20V480M40 50H560M40 150H560M40 250H560M40 350H560M40 450H560" />
                  <circle cx="300" cy="250" r="70" />
                  <circle cx="300" cy="250" r="135" />
                </svg>
                {SUBJECT_ATLAS.map((p, i) => (
                  <a
                    className="atlas-node"
                    key={p.key}
                    href={`/builds/?topic=${p.key}#tools`}
                    style={
                      {
                        "--index-ink": `var(--nb-${p.key})`,
                      } as React.CSSProperties
                    }
                    onClick={(event) => followResult(event, "pen")}
                  >
                    <span className="atlas-number">
                      {String(i + 1).padStart(2, "0")}
                      <i />
                    </span>
                    <strong>{p.label}</strong>
                    <span className="atlas-counts">
                      <span>
                        <b>{p.essays}</b> published{" "}
                        {p.essays === 1 ? "essay" : "essays"}
                      </span>
                      <span>
                        <b>{p.projects}</b>{" "}
                        {p.projects === 1 ? "project" : "projects"}
                      </span>
                      <span>
                        <b>{p.tools}</b> {p.tools === 1 ? "tool" : "tools"}
                      </span>
                    </span>
                    <span className="atlas-open">open drawer ↗</span>
                  </a>
                ))}
              </div>
            </>
          )}
          <footer className="field-index-footer">{COPY.keyboard}</footer>
        </div>
      </dialog>
    </>
  );
}
