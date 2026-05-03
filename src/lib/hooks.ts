// @ts-nocheck
// Site-wide React hooks. Used by chrome (top bar, index rail, telemetry)
// and the article body (cursor, viewport).
import React, { useEffect, useRef, useState } from 'react';

export function usePreciseScroll() {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const onS = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
    };
    window.addEventListener("scroll", onS, { passive: true });
    onS();
    return () => window.removeEventListener("scroll", onS);
  }, []);
  return pct;
}

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(() => typeof window !== "undefined" && window.innerWidth <= breakpoint);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [breakpoint]);
  return isMobile;
}

export function useIsTouch() {
  const [isTouch, setIsTouch] = React.useState(() => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: none)").matches);
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(hover: none)");
    const onChange = (e) => setIsTouch(e.matches);
    setIsTouch(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  return isTouch;
}

export function useViewportSize() {
  const [size, setSize] = React.useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 0,
    h: typeof window !== "undefined" ? window.innerHeight : 0,
  }));
  React.useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize, { passive: true });
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

export function useCursorCoords() {
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    let last = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 100) return; // 10Hz
      last = now;
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return coords;
}

export function useTelemetry() {
  // returns the [label, value] tuple to slot into IndexRail telemetry.
  // desktop → live cursor coords; touch → live viewport WxH (always fresh, no fake 0,0).
  const isTouch = useIsTouch();
  const coords = useCursorCoords();
  const viewport = useViewportSize();
  if (isTouch) {
    return ["viewport", `${String(viewport.w).padStart(4, "0")}×${String(viewport.h).padStart(4, "0")}`];
  }
  return ["cursor", `${String(coords.x).padStart(4, "0")}, ${String(coords.y).padStart(4, "0")}`];
}

export function cursorTelemetry({ x, y }) {
  return ["cursor", `${String(x).padStart(4, "0")}, ${String(y).padStart(4, "0")}`];
}
