#!/usr/bin/env bash
# Builds a copy of the site that can be published on a host which serves the
# page from a sub-folder and wraps it in its own document (the claude.ai
# preview): relative asset paths, font variables on :root, no map embed.
set -euo pipefail
OUT="${1:-preview}"
NEXT_PUBLIC_EMBED_MAP=0 NEXT_PUBLIC_SITE_URL="${SITE_URL:-https://octagator.github.io}" npx next build >/dev/null
rm -rf "$OUT" && mkdir -p "$OUT" && cp -r out/. "$OUT"/
cd "$OUT"
rm -rf og poster index.txt 404 404.html
mv _next next
sed -i 's#"/_next/#"./next/#g; s#href="/icon.svg"#href="./icon.svg"#g; s#href="/apple-icon.png"#href="./apple-icon.png"#g' index.html
sed -i 's#<script[^>]*polyfills[^>]*></script>##' index.html
rm -f next/static/chunks/polyfills-*.js
for f in $(grep -rl '_next/' next/static/chunks); do sed -i 's#"\./_next/#"./next/#g; s#"/_next/#"./next/#g' "$f"; done
# Site assets are referenced from the root; make them relative too.
for f in $(grep -rlE '"/(plates|audio)/|"/poster.jpg"' next/static/chunks); do sed -i 's#"/plates/#"./plates/#g; s#"/audio/#"./audio/#g; s#"/poster.jpg"#"./poster.jpg"#g' "$f"; done
for f in next/static/css/*.css; do
  sed -i 's#url(/_next/static/media/#url(../media/#g; s/\.__variable_[a-z0-9]*{/:root{/g' "$f"
done
echo "preview ready in $OUT"
