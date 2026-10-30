// atmosphere.ts — V6 living night layer (dark mode only): neon-lit rain on
// a full-page canvas, drifting fog, and occasional delivery drones crossing
// the sky with blinking nav lights. Self-gating: does nothing under
// prefers-reduced-motion, sleeps when the tab is hidden or the theme is
// light, and never intercepts pointer events.

const RAIN_TINTS = [
  "170,195,255", "170,195,255", "170,195,255", "170,195,255",
  "217,70,160", "0,255,245",
];

const DRONE_SVG = `
<svg viewBox="0 0 72 30" width="72" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#7ff7ef" stroke-width="1.4" stroke-linecap="round">
    <path d="M 26 15 L 46 15 M 30 15 L 22 8 M 42 15 L 50 8" />
    <rect x="29" y="13" width="14" height="7" rx="2.5" fill="#0c1420" />
    <ellipse cx="22" cy="7" rx="7" ry="1.6" class="v6-rotor" />
    <ellipse cx="50" cy="7" rx="7" ry="1.6" class="v6-rotor" />
  </g>
  <circle cx="29" cy="21.5" r="1.5" fill="#ff3b5c" class="v6-nav v6-nav-a" />
  <circle cx="43" cy="21.5" r="1.5" fill="#27C840" class="v6-nav v6-nav-b" />
</svg>`;

export function mountAtmosphere() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const isDark = () => document.documentElement.dataset.theme === "dark";

  // ---- rain --------------------------------------------------------------
  const canvas = document.createElement("canvas");
  canvas.id = "v6-rain";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  type Drop = { x: number; y: number; len: number; v: number; a: number; c: string };
  const resize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };
  resize();
  addEventListener("resize", resize);

  const SLANT = 0.16;
  const spawn = (fromTop = true): Drop => ({
    x: Math.random() * (innerWidth + 140) - 70,
    y: fromTop ? -40 - Math.random() * 80 : Math.random() * innerHeight,
    len: 12 + Math.random() * 26,
    v: 360 + Math.random() * 460,
    a: 0.045 + Math.random() * 0.11,
    c: RAIN_TINTS[(Math.random() * RAIN_TINTS.length) | 0],
  });
  const density = () => Math.min(110, Math.round(innerWidth / 15));
  const drops: Drop[] = Array.from({ length: density() }, () => spawn(false));

  let last = performance.now();
  const tick = (now: number) => {
    requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (document.hidden || !isDark()) {
      if (canvas.style.opacity !== "0") {
        canvas.style.opacity = "0";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }
    canvas.style.opacity = "1";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    for (const d of drops) {
      d.y += d.v * dt;
      d.x += d.v * SLANT * dt;
      if (d.y - d.len > innerHeight) Object.assign(d, spawn());
      const grad = ctx.createLinearGradient(d.x, d.y - d.len, d.x + d.len * SLANT, d.y);
      grad.addColorStop(0, `rgba(${d.c},0)`);
      grad.addColorStop(1, `rgba(${d.c},${d.a})`);
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y - d.len);
      ctx.lineTo(d.x + d.len * SLANT, d.y);
      ctx.stroke();
    }
  };
  requestAnimationFrame(tick);

  // ---- fog ---------------------------------------------------------------
  const fog = document.createElement("div");
  fog.className = "v6-fog";
  fog.setAttribute("aria-hidden", "true");
  document.body.appendChild(fog);

  // ---- drones ------------------------------------------------------------
  const spawnDrone = () => {
    schedule();
    if (document.hidden || !isDark()) return;
    const el = document.createElement("div");
    const reversed = Math.random() < 0.45;
    el.className = `v6-drone${reversed ? " v6-drone-rev" : ""}`;
    el.style.top = `${4 + Math.random() * 30}vh`;
    el.style.setProperty("--v6-drone-dur", `${15 + Math.random() * 10}s`);
    el.style.setProperty("--v6-drone-scale", `${0.55 + Math.random() * 0.75}`);
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `<div class="v6-drone-bob">${DRONE_SVG}</div>`;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
    // Safety net in case animationend is swallowed (e.g. theme flip mid-flight).
    setTimeout(() => el.remove(), 30000);
  };
  let timer = 0;
  const schedule = () => {
    clearTimeout(timer);
    timer = window.setTimeout(spawnDrone, 16000 + Math.random() * 26000);
  };
  window.setTimeout(spawnDrone, 5000 + Math.random() * 7000);
}
