/** Soft, slowly swaying leaf shadows, like dappled light through palms. */
export function LeafShadows({ opacity = 0.18, className = "" }: { opacity?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true" style={{ opacity }}>
      <svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" style={{ filter: "blur(10px)" }}>
        <g fill="#3f4a2e" className="sway">
          <path d="M-40 -20 C60 20, 90 120, 20 200 C70 150, 140 150, 180 90 C120 60, 80 10, -40 -20Z" />
          <path d="M0 -60 C120 -20, 190 60, 150 160 C200 110, 260 100, 320 40 C230 20, 150 -40, 0 -60Z" opacity="0.7" />
        </g>
        <g fill="#3f4a2e" className="sway-slow">
          <path d="M440 520 C340 540, 300 620, 360 720 C320 650, 250 650, 210 720 C290 700, 360 640, 440 520Z" />
          <path d="M420 400 C330 380, 280 440, 300 520 C330 470, 400 470, 440 440Z" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
