/**
 * A cream plaster arch that frames a scene. Children are rendered inside
 * the opening; `behind` is what the arch looks out on.
 */
export function Arch({
  children,
  behind,
  tone = "#eadbc6",
  className = "",
}: {
  children?: React.ReactNode;
  behind?: React.ReactNode;
  tone?: string;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      <div className="absolute inset-0">{behind}</div>
      {/* The plaster wall with an arched opening cut out. */}
      <svg viewBox="0 0 100 178" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="archWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={tone} />
            <stop offset="0.7" stopColor={tone} />
            <stop offset="1" stopColor="#dfcbb0" />
          </linearGradient>
          <linearGradient id="archEdge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff8ee" stopOpacity="0.8" />
            <stop offset="1" stopColor="#b89a74" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          fill="url(#archWall)"
          d="M0 0 H100 V178 H0 Z M14 72 A36 36 0 0 1 86 72 V132 H14 Z"
        />
        <path d="M14 72 A36 36 0 0 1 86 72 V132" fill="none" stroke="url(#archEdge)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <path d="M11 73 A39 39 0 0 1 89 73 V134" fill="none" stroke="#c9ad86" strokeWidth="0.5" opacity="0.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
