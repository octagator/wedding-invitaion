/** Palm fronds framing the top corners of a scene. */
export function Palms({ className = "", opacity = 0.9 }: { className?: string; opacity?: number }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true" style={{ opacity }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMinYMin slice" className="absolute -left-6 -top-6 w-[70%]">
        <g className="sway" fill="#6f7f55">
          {Array.from({ length: 7 }).map((_, i) => (
            <path
              key={i}
              d={`M20 10 C${60 + i * 20} ${10 + i * 22}, ${110 + i * 26} ${30 + i * 30}, ${150 + i * 28} ${40 + i * 36} C${110 + i * 20} ${34 + i * 28}, ${70 + i * 12} ${26 + i * 16}, 20 10Z`}
              opacity={0.9 - i * 0.08}
            />
          ))}
        </g>
      </svg>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMaxYMin slice" className="absolute -right-6 -top-6 w-[70%]">
        <g className="sway-slow" fill="#6f7f55" transform="translate(400 0) scale(-1 1)">
          {Array.from({ length: 7 }).map((_, i) => (
            <path
              key={i}
              d={`M20 10 C${60 + i * 20} ${10 + i * 22}, ${110 + i * 26} ${30 + i * 30}, ${150 + i * 28} ${40 + i * 36} C${110 + i * 20} ${34 + i * 28}, ${70 + i * 12} ${26 + i * 16}, 20 10Z`}
              opacity={0.9 - i * 0.08}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
