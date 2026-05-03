// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';

export function Figure({ children, caption, palette }) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <figure ref={ref} className="v4-figure" style={{ margin: "2.4rem -3rem", transform: on ? "translateY(0)" : "translateY(20px)", opacity: on ? 1 : 0, transition: "all 720ms var(--ease-out)" }}>
      <div style={{ background: "rgba(0,0,0,0.025)", padding: "1.4rem", border: `1px solid ${palette.line}` }}>
        {children}
      </div>
      <figcaption style={{ marginLeft: "1.4rem" }}>{caption}</figcaption>
    </figure>
  );
}
