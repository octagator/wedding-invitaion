import { content } from "@/content/invitation";
import { Crest } from "@/components/ui/Crest";
import { Divider } from "@/components/ui/Divider";
import { Poster } from "@/components/ui/Poster";

export const metadata = { robots: { index: false, follow: false } };

/** Renders the 1200×630 link preview, composed from the poster. */
export default function OgPage() {
  return (
    <main
      className="grain relative overflow-hidden"
      style={{ width: 1200, height: 630, background: "linear-gradient(120deg, #f4ebe1 0%, #e9d8c2 60%, #d8c0a0 100%)", color: "#4b503c" }}
    >
      <div className="absolute left-[80px] top-[70px] flex h-[490px] w-[560px] flex-col items-start justify-center">
        <Crest size={120} />
        <p className="font-serif mt-6 text-[26px] italic">{content.invitation.line1}</p>
        <p className="font-script mt-1 text-[60px] leading-none">{content.invitation.line2}</p>
        <Divider width={220} className="mt-5" />
        <h1 className="font-script mt-4 text-[84px] leading-none">{content.couple.names}</h1>
        <p className="caps mt-6 text-[24px]">{content.date.display}</p>
        <p className="caps mt-2 text-[20px] opacity-85">
          {content.venue.name} · {content.venue.city}
        </p>
      </div>
      <div className="absolute right-[90px] top-[46px] w-[360px] rotate-[4deg]" style={{ filter: "drop-shadow(0 24px 40px rgba(70,50,20,0.35))" }}>
        <Poster withPlate={false} />
      </div>
    </main>
  );
}
