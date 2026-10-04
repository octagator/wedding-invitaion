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

One click: https://vercel.com/new/import?s=https%3A%2F%2Fgithub.com%2Foctagator%2Fwedding-invitaion

Leave every setting as Vercel proposes (framework: Next.js) and press Deploy. The site
reads its own production address from Vercel at build time, so the WhatsApp preview
image resolves without any environment variable. Every push to `main` redeploys.

Personalised links, once deployed (replace the host with yours):

```
https://youssef-hana.vercel.app/?to=Uncle%20Ahmed%20%26%20family
https://youssef-hana.vercel.app/?to=%D8%B9%D9%85%D9%88%20%D8%A3%D8%AD%D9%85%D8%AF%20%D9%88%D8%A7%D9%84%D8%B9%D8%A7%D8%A6%D9%84%D8%A9
```

If you want a custom domain later, add it in the Vercel project and set
`NEXT_PUBLIC_SITE_URL` to it so the preview image uses that address.

## GitHub Pages (alternative)

Every push to `main` also publishes the build to the `gh-pages` branch. To serve it,
open Settings → Pages, choose "Deploy from a branch", `gh-pages`, `/ (root)`, and the
site appears at `https://octagator.github.io/wedding-invitaion/`.

## Where things live

| What | Where |
| --- | --- |
| Every word, the maps link, the countdown instant, the music cue | `src/content/invitation.ts` |
| The song (drop in) | `public/audio/song.mp3` |
| The nine design images | `design/` |
| Plates made from them (text removed, photo and card cropped) | `public/plates/` |
| Saved poster, link preview, Apple icon | `public/poster.jpg`, `public/og.jpg`, `public/apple-icon.png` |
| Envelope, doors, scroll journey | `src/components/` |

### Plates

The nine design images live in `design/`. `scripts/make-plates.py` turns them into the
plates under `public/plates/`: it removes only the baked-in lettering (and the painted
watch) with OpenCV inpainting so every word is live text, crops the children's photo from
image 4 exactly as it is, crops the gatefold card from image 2 for the envelope and the
door leaves, and cuts the little girl and boy from image 8 as a soft-edged sprite.

```bash
pip install opencv-python-headless numpy
python3 scripts/make-plates.py
```

If you have cleaner text-free plates, drop them over the files in `public/plates/`
with the same names; nothing else changes.

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
