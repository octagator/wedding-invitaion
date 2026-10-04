import { plates } from "@/content/invitation";

/** The closed gatefold card, as designed: two carved leaves and the oval YH medallion. */
export function DoorsFace() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={plates.doorsClosed} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
    </div>
  );
}
