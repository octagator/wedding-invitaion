import { content, plates } from "@/content/invitation";

/** The keepsake: the complete invitation on one card, as designed. */
export function Poster({ className = "" }: { className?: string; withPlate?: boolean }) {
  const alt = [
    content.invitation.line1,
    content.invitation.line2,
    content.couple.names,
    `${content.date.display} · ${content.date.time}`,
    `${content.venue.name} · ${content.venue.hall} · ${content.venue.setting}`,
  ].join(". ");
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: "1024 / 1536", boxShadow: "0 20px 60px rgba(70, 50, 20, 0.3)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={plates.poster} alt={alt} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
    </div>
  );
}
