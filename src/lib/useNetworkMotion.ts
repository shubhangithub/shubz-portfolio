import { useEffect, useRef, useState, type RefObject } from "react";
import type { NetworkPoint } from "./networkLayout";

/** Bounded O(nodes + edges) display motion; the seeded force layout stays authoritative. */
export function useNetworkMotion(
  svg: RefObject<SVGSVGElement | null>,
  points: NetworkPoint[],
  held: string | null,
  dragging: RefObject<{ id?: string } | null>,
) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const effective = useRef(new Map(points.map((p) => [p.id, p])));
  const offsets = useRef(new Map<string, { x: number; y: number }>());
  const springs = useRef(
    new Map<string, { x: number; y: number; vx: number; vy: number }>(),
  );
  const clock = useRef(0);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    let intersecting = false;
    const visibility = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver((entries) => {
      intersecting = entries[0].isIntersecting;
      visibility();
    });
    if (svg.current) observer.observe(svg.current);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [svg]);
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const groups = Array.from(
      element.querySelectorAll<SVGGElement>("[data-graph-node]"),
    );
    const lines = Array.from(
      element.querySelectorAll<SVGLineElement>("[data-edge-from]"),
    );
    const base = new Map(points.map((p) => [p.id, p]));
    let frame = 0,
      previous = 0;
    const paint = (dt: number) => {
      const active = !paused && !reduced && visible;
      if (active) clock.current += dt;
      const time = clock.current;
      for (const group of groups) {
        const id = group.dataset.graphNode!,
          p = base.get(id)!;
        const colour = group.style.getPropertyValue("--node-ink");
        const seed = Array.from(colour).reduce(
          (a, c) => a + c.charCodeAt(0),
          0,
        );
        let offset = offsets.current.get(id) || { x: 0, y: 0 };
        if (reduced) offset = { x: 0, y: 0 };
        else if (
          active &&
          !held?.split("|").includes(id) &&
          id !== dragging.current?.id
        ) {
          const ramp = Math.min(1, time / 1.5);
          const target = {
            x: Math.sin(time * 0.65 + seed) * 6 * ramp,
            y: Math.sin(time * 0.49 + seed * 0.7) * 7 * ramp,
          };
          const ease = 1 - Math.exp(-dt * 4);
          offset = {
            x: offset.x + (target.x - offset.x) * ease,
            y: offset.y + (target.y - offset.y) * ease,
          };
        }
        offsets.current.set(id, offset);
        const spring = springs.current.get(id);
        if (spring && active && id !== dragging.current?.id) {
          spring.vx += (-spring.x * 65 - spring.vx * 7) * dt;
          spring.vy += (-spring.y * 65 - spring.vy * 7) * dt;
          spring.x += spring.vx * dt;
          spring.y += spring.vy * dt;
          if (
            Math.abs(spring.x) +
              Math.abs(spring.y) +
              Math.abs(spring.vx) +
              Math.abs(spring.vy) <
            0.02
          )
            springs.current.delete(id);
        }
        const q = {
          ...p,
          x: p.x + offset.x + (reduced ? 0 : spring?.x || 0),
          y: p.y + offset.y + (reduced ? 0 : spring?.y || 0),
        };
        effective.current.set(id, q);
        group.setAttribute("transform", `translate(${q.x} ${q.y})`);
        const halo =
          group.querySelector<SVGCircleElement>(".network-node-halo");
        if (halo) {
          const pulse = active ? Math.sin(time * 1.25 + seed) : 0;
          halo.setAttribute("r", String(p.r + 5 + pulse * 2));
          halo.setAttribute("opacity", String(0.13 + pulse * 0.05));
        }
      }
      for (const line of lines) {
        const a = effective.current.get(line.dataset.edgeFrom!)!,
          b = effective.current.get(line.dataset.edgeTo!)!;
        const dx = b.x - a.x,
          dy = b.y - a.y,
          d = Math.hypot(dx, dy) || 1;
        line.setAttribute("x1", String(a.x + (dx / d) * a.r));
        line.setAttribute("y1", String(a.y + (dy / d) * a.r));
        line.setAttribute("x2", String(b.x - (dx / d) * (b.r + 3)));
        line.setAttribute("y2", String(b.y - (dy / d) * (b.r + 3)));
      }
    };
    paint(0);
    const tick = (now: number) => {
      const dt = previous ? Math.min(0.033, (now - previous) / 1000) : 0;
      previous = now;
      paint(dt);
      frame = requestAnimationFrame(tick);
    };
    if (!paused && !reduced && visible) frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  });
  return {
    paused,
    reduced,
    effective,
    toggle: () => setPaused((p) => !p),
    release: (id: string) => {
      if (!paused && !reduced)
        springs.current.set(id, {
          x: springs.current.get(id)?.x || 0,
          y: springs.current.get(id)?.y || 0,
          vx: 24,
          vy: -34,
        });
    },
    offset: (id: string) => {
      const o = offsets.current.get(id),
        s = springs.current.get(id);
      return {
        x: (o?.x || 0) + (reduced ? 0 : s?.x || 0),
        y: (o?.y || 0) + (reduced ? 0 : s?.y || 0),
      };
    },
  };
}
