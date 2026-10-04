"use client";

import { useEffect, useState } from "react";
import { imageExists } from "@/lib/device";

/**
 * Shows an image plate when the file exists in /public and renders nothing
 * otherwise, so each scene's painted backdrop stays visible until the
 * plate is dropped in.
 */
export function PlateImage({
  src,
  alt = "",
  className = "",
  style,
  onReady,
}: {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onReady?: (exists: boolean) => void;
}) {
  const [exists, setExists] = useState(false);
  useEffect(() => {
    let alive = true;
    imageExists(src).then((ok) => {
      if (!alive) return;
      setExists(ok);
      onReady?.(ok);
    });
    return () => {
      alive = false;
    };
  }, [src, onReady]);
  if (!exists) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      style={style}
      draggable={false}
    />
  );
}
