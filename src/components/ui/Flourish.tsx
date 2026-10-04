"use client";

import { forwardRef } from "react";

/**
 * The small dividers of the designs: a hairline, an ornament, a hairline.
 * `kind` picks the ornament: the fleuron, a heart, or a plain rule.
 */
export const Flourish = forwardRef<SVGSVGElement, { kind?: "fleuron" | "heart" | "rule"; color?: string; className?: string; style?: React.CSSProperties }>(
  function Flourish({ kind = "fleuron", color = "#5a553a", className = "", style }, ref) {
    return (
      <svg ref={ref} viewBox="0 0 200 20" className={className} style={style} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        <g stroke={color} strokeWidth="1" fill="none" strokeLinecap="round">
          <path d="M8 10 H78" />
          <path d="M122 10 H192" />
        </g>
        {kind === "fleuron" && (
          <g fill={color}>
            <path d="M100 2 C104 6, 104 8, 100 10 C96 8, 96 6, 100 2 Z" />
            <path d="M100 18 C104 14, 104 12, 100 10 C96 12, 96 14, 100 18 Z" />
            <path d="M92 10 C96 6, 98 6, 100 10 C98 14, 96 14, 92 10 Z" />
            <path d="M108 10 C104 6, 102 6, 100 10 C102 14, 104 14, 108 10 Z" />
            <circle cx="86" cy="10" r="1.2" />
            <circle cx="114" cy="10" r="1.2" />
          </g>
        )}
        {kind === "heart" && (
          <path
            d="M100 17 C94 12.5, 90 9.5, 90 6.3 C90 4, 91.8 2.5, 94 2.5 C96.2 2.5, 98.2 3.8, 100 6 C101.8 3.8, 103.8 2.5, 106 2.5 C108.2 2.5, 110 4, 110 6.3 C110 9.5, 106 12.5, 100 17 Z"
            fill="none"
            stroke={color}
            strokeWidth="1.2"
          />
        )}
      </svg>
    );
  },
);
