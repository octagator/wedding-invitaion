/** A crystal chandelier drawn in SVG, with occasional sparkles. */
export function Chandelier({ size = 180, className = "", style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  const sparkles = [
    [40, 70],
    [80, 60],
    [120, 66],
    [60, 100],
    [100, 96],
    [84, 128],
    [52, 124],
    [116, 122],
  ];
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 160 176" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id="chGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e2b4" />
          <stop offset="1" stopColor="#b8954f" />
        </linearGradient>
        <radialGradient id="chGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe9b8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M80 0 v26" stroke="url(#chGold)" strokeWidth="1.4" />
      <ellipse cx="80" cy="30" rx="6" ry="4" fill="url(#chGold)" />
      <path d="M80 34 v30" stroke="url(#chGold)" strokeWidth="1.2" />
      <g fill="none" stroke="url(#chGold)" strokeWidth="1.2">
        <path d="M80 64 C50 64, 30 80, 24 100" />
        <path d="M80 64 C110 64, 130 80, 136 100" />
        <path d="M80 64 C62 70, 50 84, 48 104" />
        <path d="M80 64 C98 70, 110 84, 112 104" />
        <path d="M80 64 v44" />
      </g>
      {[24, 48, 80, 112, 136].map((x, i) => (
        <g key={i}>
          <rect x={x - 3} y={i === 2 ? 104 : i % 2 ? 100 : 96} width="6" height="10" rx="1" fill="url(#chGold)" />
          <ellipse cx={x} cy={(i === 2 ? 104 : i % 2 ? 100 : 96) - 6} rx="7" ry="9" fill="url(#chGlow)" />
        </g>
      ))}
      {/* crystals */}
      <g fill="#fffaf0" stroke="#d7c08e" strokeWidth="0.5">
        {Array.from({ length: 18 }).map((_, i) => {
          const x = 20 + i * 7;
          const len = 10 + ((i * 5) % 4) * 6;
          return (
            <g key={i}>
              <path d={`M${x} 110 v${len}`} stroke="#e8d8b0" strokeWidth="0.7" />
              <path d={`M${x} ${110 + len} l-2.5 5 l2.5 7 l2.5 -7 z`} />
            </g>
          );
        })}
      </g>
      {sparkles.map(([x, y], i) => (
        <g key={i} className="sparkle" style={{ animationDelay: `${(i * 0.7) % 2.8}s` }} transform={`translate(${x} ${y})`}>
          <path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z" fill="#fff6d8" />
        </g>
      ))}
    </svg>
  );
}
