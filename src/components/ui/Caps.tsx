"use client";

import { forwardRef } from "react";

/**
 * Spaced capitals split into letters so a timeline can ease each one in
 * and let the letter spacing settle (transform and opacity only).
 */
export const Caps = forwardRef<HTMLSpanElement, {
  children: string;
  className?: string;
  as?: "span" | "p" | "h2" | "h3";
  style?: React.CSSProperties;
}>(function Caps({ children, className = "", as = "span", style }, ref) {
  const Tag = as;
  return (
    <Tag ref={ref as never} className={`caps ${className}`} style={style} aria-label={children}>
      {Array.from(children).map((ch, i) => (
        <span key={i} className="caps-letter" aria-hidden="true" style={{ display: "inline-block", whiteSpace: "pre" }}>
          {ch}
        </span>
      ))}
    </Tag>
  );
});
