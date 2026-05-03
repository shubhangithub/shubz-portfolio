// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';

export function LetterReveal({ children, className = "", delay = 0, stagger = 28, as: Tag = "span" }) {
  const text = typeof children === "string" ? children : "";
  // Split on regular spaces so spaces between words stay breakable for line-wrap.
  // Letters within each word still animate individually with the staggered delay.
  const words = text.split(" ");
  let charIdx = 0;
  return (
    <Tag className={`letter-reveal ${className}`} aria-label={text}>
      {words.map((word, w) => (
        <React.Fragment key={w}>
          {w > 0 ? " " : null}
          {word.split("").map((ch) => {
            const i = charIdx++;
            return (
              <span
                key={i}
                aria-hidden="true"
                style={{ animationDelay: `${delay + i * stagger}ms` }}
              >
                {ch}
              </span>
            );
          })}
        </React.Fragment>
      ))}
    </Tag>
  );
}
