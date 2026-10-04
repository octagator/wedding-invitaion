"use client";

import { forwardRef } from "react";

/**
 * A drawn pocket watch. The hands are separate groups so a timeline can
 * sweep them round and settle exactly on 3:00.
 */
export const PocketWatch = forwardRef<SVGSVGElement, { size?: number; className?: string }>(function PocketWatch(
  { size = 180, className = "" },
  ref,
) {
  return (
    <svg ref={ref} width={size} height={size * 1.18} viewBox="0 0 200 236" className={className} role="img" aria-label="A pocket watch showing three o'clock">
      <defs>
        <linearGradient id="pwGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1dfae" />
          <stop offset="0.5" stopColor="#c9a86a" />
          <stop offset="1" stopColor="#9a7a3f" />
        </linearGradient>
        <radialGradient id="pwFace" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#fffaf1" />
          <stop offset="1" stopColor="#efe2cc" />
        </radialGradient>
      </defs>
      {/* chain */}
      <path d="M100 10 c-20 0 -20 14 -0 14 c20 0 20 -14 0 -14" fill="none" stroke="url(#pwGold)" strokeWidth="3" />
      <rect x="92" y="24" width="16" height="10" rx="3" fill="url(#pwGold)" />
      <rect x="96" y="33" width="8" height="8" fill="url(#pwGold)" />
      {/* case */}
      <circle cx="100" cy="136" r="92" fill="url(#pwGold)" />
      <circle cx="100" cy="136" r="84" fill="#e8d3a3" />
      <circle cx="100" cy="136" r="80" fill="url(#pwFace)" />
      <circle cx="100" cy="136" r="76" fill="none" stroke="#c9b48a" strokeWidth="0.8" />
      {/* hour marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r1 = i % 3 === 0 ? 62 : 68;
        const x1 = 100 + Math.sin(a) * r1;
        const y1 = 136 - Math.cos(a) * r1;
        const x2 = 100 + Math.sin(a) * 73;
        const y2 = 136 - Math.cos(a) * 73;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5b5340" strokeWidth={i % 3 === 0 ? 2 : 1} />;
      })}
      {["XII", "III", "VI", "IX"].map((n, i) => {
        const a = (i / 4) * Math.PI * 2;
        const x = 100 + Math.sin(a) * 52;
        const y = 136 - Math.cos(a) * 52 + 5;
        return (
          <text key={n} x={x} y={y} textAnchor="middle" fontFamily="var(--font-serif), serif" fontSize="14" fill="#4b503c">
            {n}
          </text>
        );
      })}
      {/* hands, rotated by the timeline about the centre */}
      <g data-hand="hour">
        <path d="M100 136 L100 92" stroke="#3f3a2a" strokeWidth="4.5" strokeLinecap="round" />
      </g>
      <g data-hand="minute">
        <path d="M100 136 L100 74" stroke="#3f3a2a" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g data-hand="second">
        <path d="M100 148 L100 70" stroke="#a8884a" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <circle cx="100" cy="136" r="4" fill="#a8884a" />
      <circle cx="100" cy="136" r="1.6" fill="#fff6e0" />
    </svg>
  );
});
