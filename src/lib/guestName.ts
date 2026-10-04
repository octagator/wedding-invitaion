import { content } from "@/content/invitation";

/**
 * Reads ?to=... from the link and returns it as plain text, trimmed to the
 * allowed length. Arabic names pass through untouched. Anything that is not
 * a printable character is dropped so the value can never carry markup.
 */
export function readGuestName(search: string): string {
  try {
    const raw = new URLSearchParams(search).get("to");
    if (!raw) return "";
    // Remove control characters and collapse whitespace.
    const clean = raw
      .replace(/[\u0000-\u001f\u007f<>]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return Array.from(clean).slice(0, content.maxGuestNameLength).join("");
  } catch {
    return "";
  }
}

/** True when the name contains Arabic letters, so it can be set right-to-left. */
export function isArabic(text: string): boolean {
  return /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/.test(text);
}
