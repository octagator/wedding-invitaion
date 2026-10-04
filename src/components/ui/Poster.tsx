import { content, plates } from "@/content/invitation";
import { Crest } from "./Crest";
import { Divider } from "./Divider";
import { Candles } from "@/components/scenery/Candles";
import { PlateImage } from "./PlateImage";

/**
 * The keepsake card: the complete invitation on one poster, composed from
 * live text so it always matches the locked wording. If the poster plate
 * exists it is shown on top as the printed artwork.
 */
export function Poster({ className = "", withPlate = true }: { className?: string; withPlate?: boolean }) {
  return (
    <div
      className={`grain relative overflow-hidden ${className}`}
      style={{
        aspectRatio: "1024 / 1536",
        background: "linear-gradient(180deg, #f4ebe1 0%, #efe0cc 55%, #d8c0a0 100%)",
        color: "var(--olive)",
        boxShadow: "0 20px 60px rgba(70, 50, 20, 0.3), inset 0 0 0 1px rgba(200,168,106,0.5)",
        containerType: "inline-size",
      }}
    >
      {/* candle-lit aisle and gazebo, painted */}
      <div className="absolute inset-x-0 bottom-0 h-[42%]" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(214, 170, 110, 0.35) 40%, rgba(150, 110, 60, 0.45) 100%)" }} />
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet" className="absolute bottom-0 left-0 w-full opacity-80" aria-hidden="true">
        <path d="M200 60 l-70 40 v120 h140 v-120z" fill="#f5e9d6" opacity="0.7" />
        <path d="M118 102 L200 52 L282 102" fill="none" stroke="#c8a86a" strokeWidth="3" />
        <rect x="136" y="104" width="6" height="116" fill="#d9c3a1" />
        <rect x="258" y="104" width="6" height="116" fill="#d9c3a1" />
        <path d="M0 300 L150 220 H250 L400 300Z" fill="#e3cfae" opacity="0.8" />
      </svg>
      <Candles count={9} bottom="4%" scale={0.9} />
      <div className="absolute inset-0 flex flex-col items-center px-[8%] pt-[7%] text-center">
        <Crest size={0} className="w-[26cqw] h-auto" />
        <p className="font-serif mt-[3cqw] text-[3.2cqw] italic leading-snug">{content.invitation.line1}</p>
        <p className="font-script mt-[1cqw] text-[9cqw] leading-none">{content.invitation.line2}</p>
        <Divider className="mt-[3cqw] w-[40cqw] h-auto" />
        <h1 className="font-script mt-[3cqw] text-[12cqw] leading-none">{content.couple.names}</h1>
        <p className="font-arabic mt-[1cqw] text-[4.6cqw]" lang="ar" dir="rtl">
          {content.invitation.arabic}
        </p>
        <Divider className="mt-[3cqw] w-[40cqw] h-auto" />
        <p className="caps mt-[3cqw] text-[3cqw]">{content.date.display}</p>
        <p className="caps mt-[1.2cqw] text-[2.8cqw] opacity-90">{content.date.time}</p>
        <p className="font-script mt-[4cqw] text-[6.6cqw] leading-none">{content.venue.name}</p>
        <p className="caps mt-[1.6cqw] text-[2.6cqw]">
          {content.venue.city} · {content.venue.hall} · {content.venue.setting}
        </p>
      </div>
      {withPlate && <PlateImage src={plates.poster} alt={content.share.title} />}
    </div>
  );
}
