import { Poster } from "@/components/ui/Poster";

export const metadata = { robots: { index: false, follow: false } };

/** Renders the keepsake at 1024×1536 for the saved image. */
export default function PosterPage() {
  return (
    <main style={{ width: 1024, height: 1536, overflow: "hidden", background: "#efe5dc" }}>
      <Poster withPlate={false} className="h-[1536px] w-[1024px]" />
    </main>
  );
}
