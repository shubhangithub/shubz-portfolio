import { useEffect } from "react";

/**
 * Lets the visitor pick up a drawn object and let it go: the element follows
 * the pointer (clamped), then springs back on release. A click under the
 * drag threshold is left alone, so buttons inside keep working. Vertical
 * touch panning stays native (touch-action: pan-y on the element).
 */
export function useNudge(ref: React.RefObject<HTMLElement | null>, { limit = 70, threshold = 6 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = -1, sx = 0, sy = 0, moved = false;
    const clamp = (v: number) => Math.max(-limit, Math.min(limit, v));
    const down = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      id = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false;
      el.classList.add("is-held");
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < threshold) return;
      if (!moved) { moved = true; el.classList.add("is-nudging"); try { el.setPointerCapture(id); } catch {} }
      // Soft resistance: the further it goes, the less it moves.
      const soft = (v: number) => clamp(v * 0.75);
      el.style.setProperty("--nudge-x", `${soft(dx)}px`);
      el.style.setProperty("--nudge-y", `${soft(dy)}px`);
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      el.classList.remove("is-held");
      if (moved) {
        el.classList.remove("is-nudging");
        el.style.setProperty("--nudge-x", "0px");
        el.style.setProperty("--nudge-y", "0px");
        // Swallow the click that follows a drag so the object doesn't also open.
        const stop = (c: Event) => { c.stopPropagation(); c.preventDefault(); };
        el.addEventListener("click", stop, { capture: true, once: true });
        window.setTimeout(() => el.removeEventListener("click", stop, { capture: true } as EventListenerOptions), 0);
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [ref, limit, threshold]);
}
