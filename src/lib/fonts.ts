import localFont from "next/font/local";

/** Copperplate script for names and titles. */
export const script = localFont({
  src: "../fonts/pinyon-script-latin-400-normal.woff2",
  variable: "--font-script",
  display: "block",
  preload: true,
  fallback: ["Snell Roundhand", "cursive"],
});

/** Refined serif for capitals and body. */
export const serif = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-serif",
  display: "block",
  preload: true,
  fallback: ["Cormorant Garamond", "Garamond", "Georgia", "serif"],
});

/** Arabic face for the one Arabic line. */
export const arabic = localFont({
  src: "../fonts/amiri-arabic-400-normal.woff2",
  variable: "--font-arabic",
  display: "block",
  preload: true,
  fallback: ["Amiri", "Scheherazade", "serif"],
});
