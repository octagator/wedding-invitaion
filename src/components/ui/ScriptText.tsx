"use client";

import { forwardRef } from "react";

/**
 * A script line that can be "written on" from left to right. The parent
 * timeline animates the --write custom property from 0 to 1. A soft-edged
 * mask follows the pen so letters appear stroke by stroke.
 */
export const ScriptText = forwardRef<HTMLSpanElement, {
  children: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
  style?: React.CSSProperties;
}>(function ScriptText({ children, className = "", as = "span", style }, ref) {
  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={`font-script script-write ${className}`}
      style={{ ["--write" as string]: 1, ...style }}
    >
      {children}
      <style jsx>{`
        .script-write {
          display: inline-block;
          --edge: 8%;
          -webkit-mask-image: linear-gradient(
            100deg,
            #000 0%,
            #000 calc(var(--write) * (100% + var(--edge) * 2) - var(--edge) * 2),
            transparent calc(var(--write) * (100% + var(--edge) * 2) - var(--edge))
          );
          mask-image: linear-gradient(
            100deg,
            #000 0%,
            #000 calc(var(--write) * (100% + var(--edge) * 2) - var(--edge) * 2),
            transparent calc(var(--write) * (100% + var(--edge) * 2) - var(--edge))
          );
          padding: 0 0.15em;
        }
      `}</style>
    </Tag>
  );
});
