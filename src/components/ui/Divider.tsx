/** A fine gold divider with a small heart, redrawn as SVG. */
export function Divider({ width = 160, className = "" }: { width?: number; className?: string }) {
  return (
    <svg width={width} height="14" viewBox="0 0 160 14" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="divGold" x1="0" x2="1">
          <stop offset="0" stopColor="#c8a86a" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c8a86a" />
          <stop offset="1" stopColor="#c8a86a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 7 H68" stroke="url(#divGold)" strokeWidth="1" />
      <path d="M92 7 H160" stroke="url(#divGold)" strokeWidth="1" />
      <path
        d="M80 11 C76 8, 73 6, 73 3.6 C73 2, 74.4 1, 76 1 C77.6 1, 79 2, 80 3.4 C81 2, 82.4 1, 84 1 C85.6 1, 87 2, 87 3.6 C87 6, 84 8, 80 11 Z"
        fill="#c8a86a"
      />
    </svg>
  );
}
