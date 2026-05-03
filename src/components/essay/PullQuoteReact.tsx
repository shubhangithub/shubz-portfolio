// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';

export function PullQuote({ children, color }) {
  return (
    <blockquote style={{ margin: "3rem -2rem", padding: "1rem 2rem", borderLeft: `2px solid ${color}`, fontFamily: "var(--f-display)", fontSize: "1.95rem", lineHeight: 1.2, fontStyle: "italic", fontVariationSettings: '"opsz" 144, "SOFT" 100, "wght" 320', color: "inherit", textWrap: "balance" }}>
      {children}
    </blockquote>
  );
}
