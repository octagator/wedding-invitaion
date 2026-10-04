import { plates } from "@/content/invitation";
import { Medallion } from "@/components/ui/Medallion";
import { PlateImage } from "@/components/ui/PlateImage";

/** One carved floral spray for the door panels, drawn as SVG. */
function Spray({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 100 220" className="h-full w-full" aria-hidden="true" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      <g fill="none" stroke="#c7ae84" strokeWidth="1.3" strokeLinecap="round">
        <path d="M50 210 C40 160, 30 120, 48 70 C58 40, 70 30, 78 20" />
        <path d="M44 150 C30 140, 24 128, 26 112" />
        <path d="M50 120 C64 112, 72 100, 72 86" />
        <path d="M42 95 C30 90, 22 80, 24 66" />
        <path d="M54 60 C66 56, 72 46, 70 34" />
      </g>
      <g fill="#d8c3a0" opacity="0.9">
        <path d="M26 112 q-10 -2 -12 -12 q10 2 12 12z" />
        <path d="M72 86 q10 -4 10 -14 q-10 4 -10 14z" />
        <path d="M24 66 q-10 -4 -10 -14 q10 4 10 14z" />
        <path d="M70 34 q8 -6 6 -16 q-8 6 -6 16z" />
      </g>
      <g fill="#e9d7bd" stroke="#c7ae84" strokeWidth="0.6">
        <circle cx="78" cy="20" r="6" />
        <circle cx="36" cy="40" r="5" />
        <circle cx="62" cy="130" r="5.5" />
        <circle cx="30" cy="170" r="4.5" />
      </g>
    </svg>
  );
}

/**
 * The closed gatefold card: two carved cream leaves with an oval medallion
 * on the centre seam. Used as the face of the card inside the envelope and
 * as the two door leaves. If the closed-doors plate exists it covers the
 * painted version.
 */
export function DoorsFace({ side, withMedallion = true }: { side?: "left" | "right"; withMedallion?: boolean }) {
  const leaf = (which: "left" | "right") => (
    <div
      className="relative h-full overflow-hidden"
      style={{
        width: side ? "100%" : "50%",
        background: "linear-gradient(180deg, #f3e8d9 0%, #ecdcc6 55%, #e3cfb3 100%)",
        boxShadow: which === "left" ? "inset -10px 0 24px rgba(90, 65, 30, 0.12)" : "inset 10px 0 24px rgba(90, 65, 30, 0.12)",
      }}
    >
      <div
        className="absolute inset-[7%] rounded-[46%_46%_6%_6%/30%_30%_4%_4%]"
        style={{ border: "1.5px solid rgba(199, 174, 132, 0.9)", boxShadow: "inset 0 0 0 5px rgba(243, 232, 217, 1), inset 0 0 0 6.5px rgba(199, 174, 132, 0.6)" }}
      />
      <div className="absolute inset-[11%] top-[12%] bottom-[14%]">
        <Spray flip={which === "right"} />
      </div>
      {/* seam shading */}
      <div
        className="absolute inset-y-0 w-[6%]"
        style={{
          [which === "left" ? "right" : "left"]: 0,
          background: which === "left" ? "linear-gradient(90deg, transparent, rgba(80, 55, 20, 0.18))" : "linear-gradient(270deg, transparent, rgba(80, 55, 20, 0.18))",
        }}
      />
      <div className="grain absolute inset-0" />
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      {(!side || side === "left") && leaf("left")}
      {(!side || side === "right") && leaf("right")}
      {!side && <PlateImage src={plates.doorsClosed} alt="" />}
      {withMedallion && !side && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "30%" }}>
          <Medallion width={0} className="h-auto w-full" />
        </div>
      )}
    </div>
  );
}
