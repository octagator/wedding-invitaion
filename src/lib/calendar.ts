import { content } from "@/content/invitation";

function icsStamp(iso: string): string {
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Text of the .ics file. No end time is given, so none is invented. */
export function buildIcs(url: string): string {
  const start = icsStamp(content.date.utc);
  const now = icsStamp(new Date().toISOString());
  const summary = content.share.title;
  const location = `${content.venue.name}, ${content.venue.hall}, ${content.venue.city}`;
  const description = `${content.share.description}\\n${url}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Youssef & Hana//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:youssef-hana-2026-10-31@${safeHost(url)}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function safeHost(url: string): string {
  try {
    return new URL(url).host || "invitation";
  } catch {
    return "invitation";
  }
}

export function downloadIcs(url: string): void {
  const blob = new Blob([buildIcs(url)], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = "youssef-hana-wedding.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

/** Google Calendar link. Start and end are the same instant: no end time was given. */
export function googleCalendarUrl(url: string): string {
  const start = icsStamp(content.date.utc);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: content.share.title,
    dates: `${start}/${start}`,
    ctz: content.date.timeZone,
    details: `${content.share.description}\n${url}`,
    location: `${content.venue.name}, ${content.venue.hall}, ${content.venue.city}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
