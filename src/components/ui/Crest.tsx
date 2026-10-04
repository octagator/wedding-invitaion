import { content } from "@/content/invitation";

/** The crowned YH crest, redrawn as crisp SVG. */
export function Crest({ size = 120, className = "" }: { size?: number; className?: string }) {
  const id = "crestGold";
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 120 138"
      className={className}
      role="img"
      aria-label={`${content.monogram.first} ${content.monogram.second} crest`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9d6a4" />
          <stop offset="0.45" stopColor="#c8a86a" />
          <stop offset="1" stopColor="#9e7f44" />
        </linearGradient>
      </defs>
      {/* crown */}
      <g fill={`url(#${id})`}>
        <path d="M38 30 L46 42 L60 26 L74 42 L82 30 L84 48 L36 48 Z" />
        <circle cx="38" cy="29" r="2.4" />
        <circle cx="60" cy="25" r="2.6" />
        <circle cx="82" cy="29" r="2.4" />
        <rect x="36" y="49" width="48" height="3" rx="1.5" />
      </g>
      {/* laurel */}
      <g fill="none" stroke={`url(#${id})`} strokeWidth="1.6" strokeLinecap="round">
        <path d="M22 120 C8 100, 8 76, 24 60" />
        <path d="M98 120 C112 100, 112 76, 96 60" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <path d={`M${15 + i * 1.6} ${110 - i * 11} q-8 -3 -9 -10 q8 1 9 10z`} fill={`url(#${id})`} strokeWidth="0.6" />
            <path d={`M${105 - i * 1.6} ${110 - i * 11} q8 -3 9 -10 q-8 1 -9 10z`} fill={`url(#${id})`} strokeWidth="0.6" />
          </g>
        ))}
      </g>
      {/* ring */}
      <circle cx="60" cy="88" r="34" fill="none" stroke={`url(#${id})`} strokeWidth="1.4" />
      <circle cx="60" cy="88" r="30" fill="none" stroke={`url(#${id})`} strokeWidth="0.6" opacity="0.7" />
      <text
        x="60"
        y="104"
        textAnchor="middle"
        fontFamily="var(--font-script), cursive"
        fontSize="44"
        fill="#4b503c"
      >
        {content.monogram.first}
        {content.monogram.second}
      </text>
      <path d="M48 122 h24" stroke={`url(#${id})`} strokeWidth="1" />
    </svg>
  );
}
