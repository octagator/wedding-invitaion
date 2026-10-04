/** Small helpers for behaviour that depends on the guest's phone. */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** A rough guess at a weak device, used only to lower particle counts. */
export function isWeakDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  return cores <= 4 || memory <= 3;
}

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/** One soft vibration, where the phone supports it. */
export function softHaptic(): void {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(18);
  } catch {
    /* ignore */
  }
}

type MotionPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

/**
 * Asks iOS for motion permission inside a user gesture. Fails silently
 * everywhere else and resolves to whether tilt events may be used.
 */
export async function requestMotionPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return false;
  const api = DeviceOrientationEvent as unknown as MotionPermission;
  if (typeof api.requestPermission !== "function") return true;
  try {
    return (await api.requestPermission()) === "granted";
  } catch {
    return false;
  }
}

/** Resolves true when an image at `src` exists and can be shown. */
export function imageExists(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 0);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}
