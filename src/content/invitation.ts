/**
 * Youssef & Hana · 31 October 2026
 *
 * Every word the guest reads lives here, once. Nothing is typed twice.
 * The wording is locked: do not reword, translate, shorten or add to it.
 */

import { withBase } from "@/lib/paths";

export const content = {
  monogram: { first: "Y", second: "H" },

  couple: { names: "Youssef & Hana", first: "Youssef", second: "Hana" },

  invitation: {
    line1: "Together with our families we joyfully invite you to",
    line2: "Our Wedding",
    namesScene: "We invite you to celebrate our wedding",
    arabic: "يوسف لَقى هناه",
  },

  date: {
    display: "Saturday · 31 October 2026",
    time: "03:00 PM",
    /**
     * Ceremony: 31 October 2026, 15:00 Africa/Cairo.
     * Egypt has left daylight saving by then, so Cairo is UTC+2 and the
     * instant is 13:00 UTC. The countdown and calendar files use this.
     */
    utc: "2026-10-31T13:00:00Z",
    timeZone: "Africa/Cairo",
  },

  venue: {
    name: "Hilton King's Ranch",
    city: "Alexandria",
    hall: "Cascadia",
    setting: "Open Air",
  },

  beOnTime: {
    line1: "Please be on time at 03:00 PM",
    line2:
      "as the Katb El-Kitab will be the first part of our wedding day, and it is the most important moment for us. We don't want you to miss it.",
  },

  note: {
    title: "A Note from the Bride",
    body: "Our little guests (our precious kids) are a very special part of our celebration. We want them to feel the joy and magic of this day too.",
    dressCode: {
      girls: "Girls: White wedding dresses",
      boys: "Boys: Suits or at least classic attire",
    },
  },

  location: {
    title: "Location",
    label: "Hilton King's Ranch · Cascadia",
    button: "Open in Google Maps",
    /** The pin shared by the couple. */
    mapsUrl: "https://maps.app.goo.gl/eQQBxU3PyLdE3dRc7?g_st=iw",
    /** Real map inside the illustrated card. No API key needed. */
    embedUrl:
      "https://www.google.com/maps?q=Hilton+Alexandria+King%27s+Ranch&z=15&output=embed",
  },

  countdown: {
    title: "The Big Day",
    labels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
  },

  closing: "We can't wait to celebrate this special day with you",

  /** The only extra words allowed: small interface hints. */
  ui: {
    tapToOpen: "Tap to open",
    scratch: "Scratch to reveal the date",
    scroll: "Scroll",
    addToCalendar: "Add to calendar",
    save: "Save the invitation",
    share: "Share",
    musicOn: "Music on",
    musicOff: "Music off",
  },

  share: {
    title: "Youssef & Hana · 31 October 2026",
    description: "Together with our families we joyfully invite you to our wedding",
  },

  /** Longest guest name written on the envelope (?to=). */
  maxGuestNameLength: 40,
} as const;

/**
 * Music. Drop the song at public/audio/song.mp3 (and optionally song.ogg).
 * The site keeps working quietly if the file is missing.
 */
export const music = {
  src: withBase("/audio/song.mp3"),
  /** Seconds to fade the song in after the seal is tapped. */
  fadeInSeconds: 2,
  /**
   * Seconds after the seal tap at which the doors are allowed to open on
   * their own if the guest has not touched the medallion. Line this up
   * with a swell in the track. Set to 0 to always wait for the tap.
   */
  doorCueSeconds: 0,
  /** Seconds from the seal tap to the first scene when everything is tapped promptly. */
  overtureSeconds: 8,
} as const;

/**
 * Image plates. Each scene paints its own backdrop in CSS/SVG and will use
 * the matching file here automatically once it exists in public/plates.
 * Text-free versions of the nine designs belong at these paths.
 */
export const plates = {
  poster: withBase("/plates/poster.webp"),
  doorsClosed: withBase("/plates/doors-closed.webp"),
  doorsOpen: withBase("/plates/doors-open.webp"),
  names: withBase("/plates/plate-04.webp"),
  dateVenue: withBase("/plates/plate-05.webp"),
  beOnTime: withBase("/plates/plate-06.webp"),
  countdown: withBase("/plates/plate-07.webp"),
  note: withBase("/plates/plate-08.webp"),
  location: withBase("/plates/plate-09.webp"),
  /** The photo of the two children, cropped from image 4, untouched. */
  childrenPhoto: withBase("/plates/children.jpg"),
} as const;

export type Content = typeof content;
