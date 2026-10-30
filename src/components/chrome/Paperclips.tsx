import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CLIP_RECORDS, CLIP_COPY as COPY } from "../../data/paperclips";
import { useWorkbenchSound } from "./WorkbenchSound";
import "../../styles/reading-tools.css";
const KEY = "notebook-paperclips-v1";
const known = new Set(CLIP_RECORDS.map((r) => r.id));
const parse = (raw: string | null): string[] => {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v)
      ? [
          ...new Set(
            v.filter(
              (id): id is string => typeof id === "string" && known.has(id),
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
};
const Context = createContext({
  ids: [] as string[],
  toggle: (_id: string) => {},
  clear: () => {},
  temporary: false,
});
export function PaperclipProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [temporary, setTemporary] = useState(false);
  const latest = useRef<string[]>([]);
  useEffect(() => {
    try {
      latest.current = parse(localStorage.getItem(KEY));
      setIds(latest.current);
    } catch {
      setTemporary(true);
    }
    const sync = (e: StorageEvent) => {
      if (e.key === KEY || e.key === null) {
        latest.current = parse(e.newValue);
        setIds(latest.current);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const update = (next: string[]) => {
    latest.current = next;
    setIds(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setTemporary(false);
    } catch {
      setTemporary(true);
    }
  };
  return (
    <Context.Provider
      value={{
        ids,
        temporary,
        clear: () => update([]),
        toggle: (id) => {
          if (known.has(id))
            update(
              latest.current.includes(id)
                ? latest.current.filter((x) => x !== id)
                : [...latest.current, id],
            );
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function ClipButton({ id }: { id: string }) {
  const { ids, toggle } = useContext(Context);
  const sound = useWorkbenchSound();
  const record = CLIP_RECORDS.find((r) => r.id === id);
  if (!record) return null;
  const saved = ids.includes(id);
  return (
    <button
      type="button"
      className="clip-button"
      data-clip-id={id}
      aria-pressed={saved}
      aria-label={`${saved ? COPY.remove : COPY.save}: ${record.title}`}
      onClick={() => {
        toggle(id);
        sound.play(saved ? "close" : "open");
      }}
    >
      <PaperclipMark />
      {saved ? COPY.saved : COPY.save}
    </button>
  );
}
function PaperclipMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 24"
      width="17"
      height="22"
      fill="none"
    >
      <path
        d="M7 16V6a4 4 0 0 1 8 0v12a6 6 0 0 1-12 0V7m4 9a2 2 0 0 0 4 0V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function PaperclipTray() {
  const { ids, toggle, clear, temporary } = useContext(Context);
  const sound = useWorkbenchSound();
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    closeButton = useRef<HTMLButtonElement>(null);
  const navigating = useRef(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const records = ids
    .map((id) => CLIP_RECORDS.find((r) => r.id === id)!)
    .filter(Boolean);
  const close = () => {
    dialog.current?.close();
    sound.play("close");
  };
  const remove = (id: string) => {
    toggle(id);
    requestAnimationFrame(() => closeButton.current?.focus());
  };
  return (
    <>
      <button
        type="button"
        className="paperclip-trigger"
        ref={trigger}
        onClick={() => {
          navigating.current = false;
          dialog.current?.showModal();
          closeButton.current?.focus();
          sound.play("open");
        }}
        aria-haspopup="dialog"
        aria-label={`${COPY.title}, ${ids.length} saved`}
      >
        <PaperclipMark />
        {COPY.trigger}
        {ids.length > 0 && <span className="clip-count">{ids.length}</span>}
      </button>
      {mounted &&
        createPortal(
          <dialog
            className="paperclip-tray"
            ref={dialog}
            aria-labelledby="paperclip-title"
            aria-describedby="paperclip-description"
            onKeyDown={(e) => {
              if (e.key !== "Tab") return;
              const controls = Array.from(
                e.currentTarget.querySelectorAll<HTMLElement>(
                  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
                ),
              ).filter((el) => el.getClientRects().length > 0);
              const first = controls[0],
                last = controls.at(-1);
              if (!first || !last) return;
              if (
                e.shiftKey &&
                (document.activeElement === first ||
                  !controls.includes(document.activeElement as HTMLElement))
              ) {
                e.preventDefault();
                last.focus();
              } else if (
                !e.shiftKey &&
                (document.activeElement === last ||
                  !controls.includes(document.activeElement as HTMLElement))
              ) {
                e.preventDefault();
                first.focus();
              }
            }}
            onCancel={(e) => {
              e.preventDefault();
              close();
            }}
            onClose={() => {
              if (!navigating.current) trigger.current?.focus();
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div className="paperclip-inner">
              <header>
                <div>
                  <span className="eyebrow">
                    ~/notebook · clips · {records.length}
                  </span>
                  <h2 id="paperclip-title">{COPY.title}</h2>
                </div>
                <button type="button" ref={closeButton} onClick={close} aria-label={COPY.close} title={COPY.close}>
                  ×
                </button>
              </header>
              <p id="paperclip-description">
                {temporary ? COPY.temporary : COPY.description}
              </p>
              <p className="sr-only" aria-live="polite">
                {records.length} saved items
              </p>
              {!records.length ? (
                <p className="clip-empty">{COPY.empty}</p>
              ) : (
                <ol>
                  {records.map((r) => (
                    <li
                      key={r.id}
                      style={
                        {
                          "--clip-pen": `var(--nb-${r.pen})`,
                        } as React.CSSProperties
                      }
                    >
                      <PaperclipMark />
                      <a
                        href={r.href}
                        onClick={(e) => {
                          if (
                            e.button === 0 &&
                            !e.metaKey &&
                            !e.ctrlKey &&
                            !e.shiftKey &&
                            !e.altKey
                          ) {
                            navigating.current = true;
                            dialog.current?.close();
                            const url = new URL(r.href, location.href);
                            if (
                              url.pathname === location.pathname &&
                              url.search === location.search
                            )
                              requestAnimationFrame(() => {
                                window.dispatchEvent(
                                  new HashChangeEvent("hashchange"),
                                );
                                const el = document.getElementById(
                                  decodeURIComponent(url.hash.slice(1)),
                                );
                                const target =
                                  el?.querySelector<HTMLElement>("summary") ||
                                  el;
                                if (target) {
                                  if (
                                    !target.matches(
                                      "summary, a, button, input, select, textarea, [tabindex]",
                                    )
                                  )
                                    target.tabIndex = -1;
                                  target.focus({ preventScroll: true });
                                }
                              });
                          }
                        }}
                      >
                        <small>{r.kind}</small>
                        <strong>{r.title}</strong>
                        <span aria-hidden="true">↗</span>
                      </a>
                      <button
                        type="button"
                        aria-label={`${COPY.remove}: ${r.title}`}
                        onClick={() => remove(r.id)}
                      >
                        {COPY.remove}
                      </button>
                    </li>
                  ))}
                </ol>
              )}
              {!!records.length && (
                <button
                  type="button"
                  className="clip-clear"
                  onClick={() => {
                    clear();
                    closeButton.current?.focus();
                  }}
                >
                  {COPY.clear}
                </button>
              )}
            </div>
          </dialog>,
          document.body,
        )}
    </>
  );
}
