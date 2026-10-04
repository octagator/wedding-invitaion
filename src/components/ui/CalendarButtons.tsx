"use client";

import { content } from "@/content/invitation";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";

/**
 * "Add to calendar": the main button saves an .ics file; the small round
 * button beside it opens the same event in Google Calendar.
 */
export function CalendarButtons({ tone = "light" }: { tone?: "light" | "dark" }) {
  const url = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
  const cls = tone === "dark" ? "btn-quiet" : "btn-quiet";
  return (
    <div className="flex items-center justify-center gap-2">
      <button type="button" className={cls} onClick={() => downloadIcs(url)}>
        <CalendarIcon />
        {content.ui.addToCalendar}
      </button>
      <a
        className={`${cls} !px-0 w-11`}
        href={googleCalendarUrl(url)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${content.ui.addToCalendar} (Google Calendar)`}
      >
        <GoogleCalendarIcon />
      </a>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function GoogleCalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M10 14h4M12 12v6" />
    </svg>
  );
}
