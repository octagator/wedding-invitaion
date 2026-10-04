"use client";

import { forwardRef } from "react";
import { plates } from "@/content/invitation";
import { PlateImage } from "./PlateImage";

/**
 * The circular frame for the photo of the two children. The photo itself is
 * never regenerated: it is shown as-is when the file exists, and the frame
 * stays an empty recessed circle of cream plaster until then.
 */
export const ChildrenPhoto = forwardRef<HTMLDivElement, { size?: string; className?: string }>(function ChildrenPhoto(
  { size = "46%", className = "" },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`relative rounded-full ${className}`}
      style={{
        width: size,
        aspectRatio: "1 / 1",
        background: "radial-gradient(circle at 50% 40%, #ecdcc6 0%, #e2cdb2 100%)",
        boxShadow: "inset 0 6px 18px rgba(90, 65, 30, 0.22), inset 0 -2px 6px rgba(255,255,255,0.5), 0 0 0 3px #f5ecdf, 0 0 0 4.5px #c8a86a",
      }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <PlateImage src={plates.childrenPhoto} alt="Two children hugging" className="scale-[1.001]" />
      </div>
    </div>
  );
});
