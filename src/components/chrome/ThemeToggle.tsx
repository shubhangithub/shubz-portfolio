// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// (no legacy imports needed)

export function ThemeToggle({ dark, toggleTheme, palette: p }) {
  if (!toggleTheme) return null;
  return (
    <button onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} style={{ all: "unset", cursor: "pointer", width: 36, height: 20, borderRadius: 10, background: dark ? p.accent : p.line, position: "relative", display: "inline-block", flexShrink: 0, transition: "background 300ms var(--ease-out)", verticalAlign: "middle" }}>
      <span style={{ position: "absolute", top: 2, left: dark ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: dark ? p.paper : "#fff", transition: "left 300ms var(--ease-out)", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>
        {dark ? "☀" : "☾"}
      </span>
    </button>
  );
}
