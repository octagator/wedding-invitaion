"use client";

import { forwardRef } from "react";

/**
 * A line-drawn pocket watch in olive ink, like the one in the design. The
 * hands are separate groups so a timeline can sweep them round and settle
 * exactly on 3:00.
 */
export const PocketWatch = forwardRef<SVGSVGElement, { className?: string; style?: React.CSSProperties }>(function PocketWatch({ className = "", style }, ref) {
  const ink = "#4f4a30";
  return (
    <svg ref={ref} viewBox="0 0 200 236" className={className} style={style} role="img" aria-label="A pocket watch showing three o'clock">
      {/* bow and crown */}
      <circle cx="100" cy="14" r="9" fill="none" stroke={ink} strokeWidth="3" />
      <rect x="92" y="24" width="16" height="9" rx="2" fill="none" stroke={ink} strokeWidth="2.4" />
      <rect x="96" y="33" width="8" height="7" fill={ink} />
      {/* case */}
      <circle cx="100" cy="136" r="92" fill="rgba(255, 250, 240, 0.55)" stroke={ink} strokeWidth="3" />
      <circle cx="100" cy="136" r="84" fill="none" stroke={ink} strokeWidth="1.2" />
      <circle cx="100" cy="136" r="78" fill="none" stroke={ink} strokeWidth="0.8" opacity="0.7" />
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i / 60) * Math.PI * 2;
        const major = i % 5 === 0;
        const r1 = major ? 68 : 72;
        return <line key={i} x1={100 + Math.sin(a) * r1} y1={136 - Math.cos(a) * r1} x2={100 + Math.sin(a) * 76} y2={136 - Math.cos(a) * 76} stroke={ink} strokeWidth={major ? 1.6 : 0.6} />;
      })}
      {["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"].map((n, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x = 100 + Math.sin(a) * 56;
        const y = 136 - Math.cos(a) * 56 + 4.5;
        return (
          <text key={n} x={x} y={y} textAnchor="middle" fontFamily="var(--font-serif), serif" fontSize="12.5" fill={ink}>
            {n}
          </text>
        );
      })}
      <g data-hand="hour">
        <path d="M100 136 L100 94" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      </g>
      <g data-hand="minute">
        <path d="M100 136 L100 76" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <g data-hand="second">
        <path d="M100 146 L100 72" stroke={ink} strokeWidth="1" strokeLinecap="round" />
      </g>
      <circle cx="100" cy="136" r="3.4" fill={ink} />
    </svg>
  );
});
