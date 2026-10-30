import { useEffect, useRef, useState } from 'react';
import '../../styles/workbench-grid.css';
import { ResearchBackdrop } from './ResearchBackdrop';

/** A viewport-sized decorative mesh; no React renders in the animation loop. */
export function WorkbenchGrid() {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setRunning(!media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    const shell = canvas?.closest<HTMLElement>('.folio');
    if (!canvas || !ctx || !shell) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let width = 0, height = 0, frame = 0, last = 0, elapsed = 0;
    let pointerX = -1000, pointerY = -1000, targetX = -1000, targetY = -1000;
    let strength = 0, targetStrength = 0, scrollEnergy = 0, previousScroll = scrollY;
    let colour = '', shown = false;
    const readColour = () => { colour = getComputedStyle(shell).getPropertyValue('--nb-cyan').trim(); };
    const resize = () => {
      width = document.documentElement.clientWidth; height = innerHeight;
      // Bound backing-store memory on large/high-DPI screens.
      const ratio = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(2_000_000 / (width * height)));
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      readColour(); draw(0);
    };
    const point = (x: number, y: number): [number, number] => {
      if (!running) return [x, y];
      const time = elapsed / 1000;
      // A broad, slow wave keeps touch devices alive without requiring a gesture.
      const wave = (fine.matches ? 2.5 : 4) + scrollEnergy;
      let dx = Math.sin(y / 230 + time * .19) * wave;
      let dy = Math.sin(x / 270 + time * .16) * wave;
      if (strength > .001) {
        const px = x - pointerX, py = y - pointerY;
        const distance = Math.hypot(px, py), radius = 210;
        const weight = Math.exp(-(distance * distance) / (radius * radius));
        // Pull a small crease towards the pointer; nearby squares stay legible.
        dx -= px * .16 * weight * strength;
        dy -= py * .16 * weight * strength;
      }
      return [x + dx, y + dy];
    };
    const draw = (delta: number) => {
      elapsed += delta;
      // On touch screens the same moving centre drives both the crease and its light.
      if (running && !fine.matches) {
        const time = elapsed / 1000;
        targetX = width * (.5 + Math.sin(time * .13) * .26);
        targetY = height * (.46 + Math.cos(time * .11) * .22);
        targetStrength = .45 + scrollEnergy * .12;
        if (!shown) { pointerX = targetX; pointerY = targetY; shown = true; }
      }
      const ease = 1 - Math.exp(-delta / 180);
      pointerX += (targetX - pointerX) * ease;
      pointerY += (targetY - pointerY) * ease;
      strength += (targetStrength - strength) * ease;
      scrollEnergy *= Math.exp(-delta / 450);
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = colour; ctx.lineWidth = 1;
      const gap = 48, sample = 24;
      const drift = running ? (elapsed * .0012) % gap : 0;
      const offsetX = (width / 2) % gap + drift;
      ctx.beginPath();
      for (let x = offsetX - gap * 2; x <= width + gap; x += gap) {
        for (let y = -gap; y <= height + gap; y += sample) {
          const [a, b] = point(x, y);
          if (y === -gap) ctx.moveTo(a, b); else ctx.lineTo(a, b);
        }
      }
      for (let y = drift - gap * 2; y <= height + gap; y += gap) {
        for (let x = -gap; x <= width + gap; x += sample) {
          const [a, b] = point(x, y);
          if (x === -gap) ctx.moveTo(a, b); else ctx.lineTo(a, b);
        }
      }
      ctx.stroke();
      if (running && strength > .001) {
        // Reuse the mesh path: only the bent lines brighten, with a very faint pool below.
        const glow = ctx.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, 190);
        glow.addColorStop(0, colour); glow.addColorStop(1, 'transparent');
        ctx.globalAlpha = strength * .18;
        ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = strength;
        ctx.strokeStyle = glow; ctx.lineWidth = 2.4; ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };
    const tick = (now: number) => {
      if (document.hidden || !running) { frame = 0; return; }
      const delta = last ? now - last : 34;
      // 30Hz is sufficient for this slow surface, including on touch devices.
      if (delta >= 32) { draw(Math.min(delta, 65)); last = now; }
      frame = requestAnimationFrame(tick);
    };
    const visibility = () => {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      if (!document.hidden && running) frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType === 'touch') return;
      targetX = event.clientX; targetY = event.clientY; targetStrength = 1;
      if (!shown) { pointerX = targetX; pointerY = targetY; shown = true; }
    };
    const leave = () => { targetStrength = 0; };
    const scroll = () => {
      if (!fine.matches) scrollEnergy = Math.min(3, scrollEnergy + Math.abs(scrollY - previousScroll) * .012);
      previousScroll = scrollY;
    };
    const theme = new MutationObserver(() => { readColour(); if (!running) draw(0); });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    resize(); shell.dataset.liveGrid = 'true'; visibility();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    if (running) {
      window.addEventListener('pointermove', move, { passive: true });
      document.documentElement.addEventListener('pointerleave', leave);
      window.addEventListener('blur', leave);
      window.addEventListener('scroll', scroll, { passive: true });
    }
    return () => {
      cancelAnimationFrame(frame); theme.disconnect(); delete shell.dataset.liveGrid;
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      window.removeEventListener('scroll', scroll);
    };
  }, [running]);
  return <><canvas ref={ref} className="workbench-grid" aria-hidden="true" /><ResearchBackdrop /></>;
}
