import { content } from "@/content/invitation";

/**
 * The oval YH medallion on the doors. `half` renders only the left or
 * right half so the two leaves can carry it apart.
 */
export function Medallion({
  width = 120,
  half,
  className = "",
}: {
  width?: number;
  half?: "left" | "right";
  className?: string;
}) {
  const height = width * 1.3;
  const clip = half === "left" ? "inset(0 50% 0 0)" : half === "right" ? "inset(0 0 0 50%)" : undefined;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 130"
      className={className}
      style={{ clipPath: clip }}
      aria-hidden={half ? true : undefined}
      role={half ? undefined : "img"}
      aria-label={half ? undefined : `${content.monogram.first} ${content.monogram.second} medallion`}
    >
      <defs>
        <linearGradient id="medGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ecdcb0" />
          <stop offset="0.5" stopColor="#c8a86a" />
          <stop offset="1" stopColor="#9a7a3f" />
        </linearGradient>
        <radialGradient id="medPaper" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#fbf4ea" />
          <stop offset="1" stopColor="#ecdcc5" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="65" rx="46" ry="60" fill="url(#medGold)" />
      <ellipse cx="50" cy="65" rx="41" ry="55" fill="url(#medPaper)" />
      <ellipse cx="50" cy="65" rx="37" ry="50" fill="none" stroke="url(#medGold)" strokeWidth="0.9" />
      {/* small floral sprigs */}
      <g fill="none" stroke="#8a9a6b" strokeWidth="1" strokeLinecap="round" opacity="0.8">
        <path d="M22 96 q10 -10 22 -6" />
        <path d="M78 96 q-10 -10 -22 -6" />
        <path d="M30 92 q-2 -6 2 -8" />
        <path d="M70 92 q2 -6 -2 -8" />
      </g>
      <text
        x="50"
        y="78"
        textAnchor="middle"
        fontFamily="var(--font-script), cursive"
        fontSize="40"
        fill="#4b503c"
      >
        {content.monogram.first}
        {content.monogram.second}
      </text>
    </svg>
  );
}
