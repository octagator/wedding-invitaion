# Youssef & Hana · 31 October 2026

The wedding invitation itself: a sealed envelope, a pair of carved doors, and a scroll
through the wedding day from afternoon light to candle-lit dusk. Built as a static
Next.js site with no backend, no tracking and no cookies.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export into ./out
npm start          # serve ./out on port 3000
```

Personalised links write the guest's name on the envelope:

```
https://<your-domain>/?to=Uncle%20Ahmed%20%26%20family
https://<your-domain>/?to=%D8%B9%D9%85%D9%88%20%D8%A3%D8%AD%D9%85%D8%AF%20%D9%88%D8%A7%D9%84%D8%B9%D8%A7%D8%A6%D9%84%D8%A9
```

## Deploy to Vercel

1. Import this repository at vercel.com (framework preset: Next.js, nothing else to set).
2. Add an environment variable `NEXT_PUBLIC_SITE_URL` with the final address,
   e.g. `https://youssef-hana.vercel.app`, so the WhatsApp preview image resolves.
3. Deploy. Every push to `main` redeploys.

## Where things live

| What | Where |
| --- | --- |
| Every word, the maps link, the countdown instant, the music cue | `src/content/invitation.ts` |
| The song (drop in) | `public/audio/song.mp3` |
| Text-free image plates (drop in, optional) | `public/plates/` |
| The children's photo, untouched (drop in) | `public/plates/children.jpg` |
| Saved poster, link preview, Apple icon | `public/poster.jpg`, `public/og.jpg`, `public/apple-icon.png` |
| Envelope, doors, scroll journey | `src/components/` |

### Plates

Each scene paints its own backdrop in CSS and SVG. When a file exists at one of
these paths it is shown on top automatically; nothing else changes:

```
public/plates/poster.webp         image 1  (keepsake)
public/plates/doors-closed.webp   image 2
public/plates/doors-open.webp     image 3
public/plates/plate-04.webp       image 4  names scene (text-free)
public/plates/plate-05.webp       image 5  date and venue (text-free)
public/plates/plate-06.webp       image 6  be on time (text-free)
public/plates/plate-07.webp       image 7  countdown (text-free)
public/plates/plate-08.webp       image 8  note from the bride (text-free)
public/plates/plate-09.webp       image 9  location (text-free)
public/plates/children.jpg        the photo of the two children, cropped as is
```

WebP or AVIF at about 1200 px on the long side is plenty for phones.

### Music

Put the track at `public/audio/song.mp3` (AAC/MP3 at 128 kbps is a good balance).
The song starts on the seal tap, fades in over two seconds and loops. To open the
doors on a swell in the music, set `music.doorCueSeconds` in the content file.

## Regenerating the poster and link preview

```bash
npm run build && npm start &
PW_CHROMIUM=/path/to/chromium npm run render:images   # omit PW_CHROMIUM if Playwright has its own browser
```

## Walking through the whole journey

```bash
npm run build && npm start &
npm run screenshots   # screenshots of every scene at 360×800, 390×844, 768×1024, 1440×900
```
