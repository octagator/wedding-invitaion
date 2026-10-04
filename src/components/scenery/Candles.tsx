/** A row of candles with softly flickering flames. */
export function Candles({
  count = 7,
  className = "",
  scale = 1,
  bottom = "6%",
}: {
  count?: number;
  className?: string;
  scale?: number;
  bottom?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute left-0 right-0 flex items-end justify-center gap-[6%] ${className}`}
      style={{ bottom, transform: `scale(${scale})`, transformOrigin: "50% 100%" }}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => {
        const h = 28 + ((i * 7) % 3) * 14;
        return (
          <div key={i} className="relative flex flex-col items-center">
            <div
              className="flame absolute"
              style={{
                bottom: h - 2,
                width: 9,
                height: 16,
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                background: "radial-gradient(ellipse at 50% 70%, #fff5cf 0%, #ffd27a 45%, rgba(255, 170, 60, 0.3) 75%, transparent 100%)",
                boxShadow: "0 0 18px 6px rgba(255, 190, 90, 0.35), 0 0 40px 14px rgba(255, 170, 60, 0.12)",
              }}
            />
            <div
              style={{
                width: 7,
                height: h,
                background: "linear-gradient(90deg, #efe4cf 0%, #fff8ea 45%, #e3d3b5 100%)",
                borderRadius: 2,
                boxShadow: "0 6px 14px rgba(60, 40, 10, 0.25)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
