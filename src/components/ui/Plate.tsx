"use client";

import { forwardRef } from "react";

/**
 * A design plate laid over the stage with the same geometry as
 * object-fit: cover, so children positioned in percentages of the plate
 * land exactly where the design put them, on every screen. Font sizes in
 * cqw scale with the artwork.
 */
export const Plate = forwardRef<HTMLDivElement, {
  src: string;
  width: number;
  height: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  eager?: boolean;
}>(function Plate({ src, width, height, children, className = "", style, eager }, ref) {
  return (
    <div ref={ref} className={`plate ${className}`} style={{ ["--r" as string]: width / height, aspectRatio: `${width} / ${height}`, ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="absolute inset-0 h-full w-full" draggable={false} decoding="async" loading={eager ? "eager" : "lazy"} />
      {children}
    </div>
  );
});

/** A block of live text pinned to a vertical position on the plate. */
export function PlateText({
  top,
  left = "0",
  width = "100%",
  children,
  className = "",
  style,
  innerRef,
}: {
  top: string;
  left?: string;
  width?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={innerRef} className={`absolute text-center ${className}`} style={{ top, left, width, ...style }}>
      {children}
    </div>
  );
}
