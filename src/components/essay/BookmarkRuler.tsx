import { useEffect, useState } from "react";
import { CLIP_COPY as COPY } from "../../data/paperclips";
type Section = { id: string; title: string };
/** Reads the real essay headings; never inserts or rewrites essay prose. */
export function BookmarkRuler({
  slug,
  mobile = false,
}: {
  slug: string;
  mobile?: boolean;
}) {
  const [sections, setSections] = useState<Section[]>([]),
    [active, setActive] = useState("essay-title");
  useEffect(() => {
    const body = document.getElementById("essay-body");
    if (!body) return;
    const targets: HTMLElement[] = [];
    const title = document.getElementById("essay-title");
    if (title) targets.push(title);
    const lede = body.querySelector<HTMLElement>(".drop-cap");
    if (lede) {
      if (!lede.id) lede.id = `${slug}-opening`;
      targets.push(lede);
    }
    body.querySelectorAll<HTMLElement>("h2").forEach((el, i) => {
      if (!el.id) el.id = `${slug}-section-${i + 1}`;
      targets.push(el);
    });
    targets.forEach((el) => {
      el.tabIndex = -1;
      el.style.scrollMarginTop = "125px";
    });
    setSections(
      targets.map((el, i) => ({
        id: el.id,
        title:
          el === title
            ? COPY.header
            : el === lede
              ? COPY.opening
              : (el.textContent || `${i}`)
                  .replace(/^\s*§\s*\d+\s*[·.]?\s*/, "")
                  .trim(),
      })),
    );
    let pending = 0;
    const update = () => {
      pending = 0;
      const before = targets.filter(
        (el) => el.getBoundingClientRect().top <= 160,
      );
      setActive((before.at(-1) || targets[0])?.id || "essay-title");
    };
    const onScroll = () => {
      if (!pending) pending = requestAnimationFrame(update);
    };
    const restore = () => {
      let hash = "";
      try {
        hash = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      const el = targets.find((t) => t.id === hash);
      if (el) {
        el.scrollIntoView({ block: "start", behavior: "instant" });
        setActive(el.id);
      }
    };
    let restoreFrame = 0;
    let settleFrame = 0;
    // History traversal restores native scroll after popstate. Let that finish
    // before aligning our known section; unrelated hashes remain browser-owned.
    const scheduleRestore = () => {
      cancelAnimationFrame(settleFrame);
      cancelAnimationFrame(restoreFrame);
      settleFrame = requestAnimationFrame(() => {
        restoreFrame = requestAnimationFrame(restore);
      });
    };
    scheduleRestore();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", scheduleRestore);
    window.addEventListener("popstate", scheduleRestore);
    return () => {
      cancelAnimationFrame(settleFrame);
      cancelAnimationFrame(restoreFrame);
      cancelAnimationFrame(pending);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", scheduleRestore);
      window.removeEventListener("popstate", scheduleRestore);
    };
  }, [slug]);
  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const url = new URL(location.href);
    url.hash = id;
    if (url.href !== location.href) history.pushState(null, "", url);
    el.focus({ preventScroll: true });
    el.scrollIntoView({
      block: "start",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    setActive(id);
  };
  if (!sections.length) return null;
  return (
    <nav
      className={`bookmark-ruler ${mobile ? "bookmark-ruler-mobile" : ""}`}
      aria-label={COPY.ruler}
    >
      <div className="ruler-heading">
        <span aria-hidden="true">⌑</span>
        {COPY.ruler}
        <small>
          {Math.max(1, sections.findIndex((s) => s.id === active) + 1)} /{" "}
          {sections.length}
        </small>
      </div>
      {mobile ? (
        <label>
          {COPY.section}
          <select value={active} onChange={(e) => jump(e.target.value)}>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <ol>
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    e.preventDefault();
                    jump(s.id);
                  }
                }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
