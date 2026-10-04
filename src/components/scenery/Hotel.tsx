/** The hotel entrance at sunset: a warm silhouette with lit windows. */
export function Hotel({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax meet" className={`absolute bottom-0 left-0 w-full ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="hotelWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9b58d" />
          <stop offset="1" stopColor="#a8825a" />
        </linearGradient>
        <linearGradient id="hotelSteps" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0e0c8" />
          <stop offset="1" stopColor="#c9ad88" />
        </linearGradient>
      </defs>
      {/* palms behind */}
      <g fill="#5f6b48" opacity="0.8">
        <path d="M40 150 c-30 -40 -40 -70 -10 -100 c0 40 10 60 30 80z" />
        <path d="M40 150 c-5 -50 10 -80 40 -95 c-20 30 -30 60 -30 95z" />
        <path d="M360 150 c30 -40 40 -70 10 -100 c0 40 -10 60 -30 80z" />
        <path d="M360 150 c5 -50 -10 -80 -40 -95 c20 30 30 60 30 95z" />
        <rect x="37" y="120" width="6" height="60" fill="#6d5438" />
        <rect x="357" y="120" width="6" height="60" fill="#6d5438" />
      </g>
      {/* building */}
      <rect x="70" y="60" width="260" height="130" fill="url(#hotelWall)" />
      <rect x="60" y="54" width="280" height="8" fill="#c99f73" />
      <path d="M150 60 h100 v-22 a50 20 0 0 0 -100 0z" fill="#c99f73" />
      {/* windows */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x={85 + i * 42} y="76" width="20" height="26" rx="10" fill="#ffd79a" opacity="0.9" />
          <rect x={85 + i * 42} y="112" width="20" height="26" rx="10" fill="#ffd79a" opacity="0.75" />
        </g>
      ))}
      {/* entrance */}
      <path d="M170 190 v-50 a30 30 0 0 1 60 0 v50z" fill="#fff0cf" />
      <path d="M176 190 v-48 a24 24 0 0 1 48 0 v48z" fill="#ffe2ad" opacity="0.9" />
      <rect x="140" y="146" width="120" height="6" fill="#e3c89c" />
      {/* steps */}
      <rect x="120" y="190" width="160" height="8" fill="url(#hotelSteps)" />
      <rect x="100" y="198" width="200" height="8" fill="url(#hotelSteps)" opacity="0.9" />
      <rect x="80" y="206" width="240" height="8" fill="url(#hotelSteps)" opacity="0.8" />
      <rect x="0" y="214" width="400" height="6" fill="#bfa27a" />
      {/* lanterns */}
      {[130, 270].map((x) => (
        <g key={x}>
          <rect x={x - 1.5} y="140" width="3" height="50" fill="#6b4f33" />
          <circle cx={x} cy="138" r="6" fill="#ffd79a" />
          <circle cx={x} cy="138" r="12" fill="#ffd79a" opacity="0.25" />
        </g>
      ))}
    </svg>
  );
}
