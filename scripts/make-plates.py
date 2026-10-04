"""
Turns the nine design images into the plates the site uses.

- Removes only the baked-in lettering (and the painted watch) so every word
  can be live text, keeping flowers, arches, candles and shadows untouched.
- Crops the children's photo from image 4 exactly as it is.
- Crops the gatefold card from image 2 for the envelope and the door leaves.
- Writes WebP plates sized for phones into public/plates.

Run: python3 scripts/make-plates.py
"""
import cv2
import numpy as np
from pathlib import Path

SRC = Path("design")
OUT = Path("public/plates")
OUT.mkdir(parents=True, exist_ok=True)


def load(name):
    img = cv2.imread(str(SRC / name))
    if img is None:
        raise SystemExit(f"missing {name}")
    return img


def rect(img, x0, y0, x1, y1):
    h, w = img.shape[:2]
    return int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)


def stroke_mask(img, rois, mode="dark", thresh=14, blur=41, dilate=3):
    """Pixels inside the ROIs that are darker (or lighter) than the local
    surface: the lettering, not the shadows."""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
    local = cv2.GaussianBlur(gray, (blur, blur), 0)
    diff = (local - gray) if mode == "dark" else (gray - local)
    mask = np.zeros(gray.shape, np.uint8)
    for roi in rois:
        x0, y0, x1, y1 = rect(img, *roi)
        sub = diff[y0:y1, x0:x1] > thresh
        mask[y0:y1, x0:x1] = np.where(sub, 255, 0).astype(np.uint8)
    if dilate:
        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (dilate * 2 + 1, dilate * 2 + 1))
        mask = cv2.dilate(mask, k)
    return mask


def rect_mask(img, rois, feather=0):
    mask = np.zeros(img.shape[:2], np.uint8)
    for roi in rois:
        x0, y0, x1, y1 = rect(img, *roi)
        mask[y0:y1, x0:x1] = 255
    return mask


def inpaint(img, mask, radius=4):
    return cv2.inpaint(img, mask, radius, cv2.INPAINT_TELEA)


def save(img, name, width=1200, quality=82):
    h, w = img.shape[:2]
    if w > width:
        img = cv2.resize(img, (width, int(h * width / w)), interpolation=cv2.INTER_AREA)
    cv2.imwrite(str(OUT / name), img, [cv2.IMWRITE_WEBP_QUALITY, quality])
    print("wrote", OUT / name, img.shape[1], "x", img.shape[0])


# 1. Poster: the keepsake, untouched.
poster = load("01-poster.jpg")
save(poster, "poster.webp", 1024, 86)
cv2.imwrite("public/poster.jpg", poster, [cv2.IMWRITE_JPEG_QUALITY, 88])
# Crest cropped from the poster for the seal and the date scene.
x0, y0, x1, y1 = rect(poster, 0.405, 0.05, 0.595, 0.165)
cv2.imwrite(str(OUT / "crest.webp"), poster[y0:y1, x0:x1], [cv2.IMWRITE_WEBP_QUALITY, 90])

# 2. Closed doors: crop the card itself (the wall around it is not part of the leaves).
doors = load("02-doors-closed.jpg")
x0, y0, x1, y1 = rect(doors, 0.032, 0.04, 0.968, 0.955)
card = doors[y0:y1, x0:x1]
save(card, "doors-closed.webp", 1100, 86)

# 3. Doors open: the whole picture is what the guest sees once the leaves swing.
save(load("03-doors-open.jpg"), "doors-open.webp", 1100, 84)

# 4. Names scene: remove the lettering, keep the photo and the vines.
names = load("04-names.jpg")
h, w = names.shape[:2]
cx, cy, r = int(0.5 * w), int(0.566 * h), int(0.146 * w)
circle = np.zeros((h, w), np.uint8)
cv2.circle(circle, (cx, cy), r, 255, -1)
photo = names.copy()
alpha = circle.copy()
b, g, rch = cv2.split(photo)
cv2.imwrite(str(OUT / "children.png"), cv2.merge([b, g, rch, alpha])[cy - r : cy + r, cx - r : cx + r])
cv2.imwrite(str(OUT / "children.jpg"), photo[cy - r : cy + r, cx - r : cx + r], [cv2.IMWRITE_JPEG_QUALITY, 92])
mask = stroke_mask(
    names,
    [
        (0.36, 0.195, 0.64, 0.265),  # invite line + divider
        (0.39, 0.265, 0.61, 0.385),  # date block + divider
        (0.31, 0.385, 0.70, 0.46),  # names + divider
        (0.38, 0.675, 0.63, 0.755),  # arabic + dividers
    ],
    thresh=9,
)
mask = cv2.bitwise_or(mask, rect_mask(names, [(0.45, 0.24, 0.55, 0.265), (0.45, 0.365, 0.55, 0.39), (0.45, 0.445, 0.55, 0.47), (0.45, 0.67, 0.55, 0.695), (0.45, 0.735, 0.55, 0.76)]))
plate = inpaint(names, mask, 4)
# The photo frame is filled with plaster cloned from the clean wall above it,
# so the photo can fade up into an empty recessed circle.
inner = np.zeros((h, w), np.uint8)
cv2.circle(inner, (cx, cy + 3), r - 1, 255, -1)
inner = cv2.GaussianBlur(inner, (15, 15), 0).astype(np.float32) / 255.0
sx0, sy0, sx1, sy1 = rect(plate, 0.365, 0.265, 0.635, 0.455)
patch = cv2.resize(plate[sy0:sy1, sx0:sx1], (2 * r + 2, 2 * r + 2), interpolation=cv2.INTER_AREA)
patch = cv2.GaussianBlur(patch, (5, 5), 0)
canvas = plate.copy().astype(np.float32)
y0p, x0p = cy - r - 1, cx - r - 1
region = canvas[y0p : y0p + patch.shape[0], x0p : x0p + patch.shape[1]]
a = inner[y0p : y0p + patch.shape[0], x0p : x0p + patch.shape[1]][..., None]
canvas[y0p : y0p + patch.shape[0], x0p : x0p + patch.shape[1]] = region * (1 - a) + patch.astype(np.float32) * a
plate = canvas.astype(np.uint8)
save(plate, "plate-04.webp", 1200, 84)

# 5. Date and venue.
dv = load("05-date-venue.jpg")
mask = stroke_mask(
    dv,
    [
        (0.28, 0.185, 0.72, 0.43),  # saturday, 31, october 2026, 03:00 pm, dividers
        (0.14, 0.44, 0.86, 0.61),  # venue lines + divider
    ],
    thresh=9,
)
mask = cv2.bitwise_or(mask, rect_mask(dv, [(0.45, 0.34, 0.55, 0.365), (0.45, 0.41, 0.55, 0.435), (0.45, 0.585, 0.55, 0.61)]))
save(inpaint(dv, mask, 4), "plate-05.webp", 1200, 84)

# 6. Be on time: the painted watch goes, so a drawn one can sweep.
bo = load("06-be-on-time.jpg")
mask = stroke_mask(
    bo,
    [
        (0.15, 0.43, 0.85, 0.545),  # please be on time + divider
        (0.14, 0.55, 0.86, 0.76),  # body + divider
    ],
    thresh=8,
    dilate=4,
)
watch = rect_mask(bo, [(0.415, 0.285, 0.595, 0.44), (0.45, 0.52, 0.55, 0.55), (0.45, 0.735, 0.55, 0.765)])
watch = cv2.dilate(watch, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31)))
mask = cv2.bitwise_or(mask, watch)
save(inpaint(bo, mask, 8), "plate-06.webp", 1200, 84)

# 7. Countdown: white script on the sky, title and boxes on the arch.
cd = load("07-countdown.jpg")
light = stroke_mask(cd, [(0.12, 0.07, 0.9, 0.26)], mode="light", thresh=16, blur=51, dilate=3)
dark = stroke_mask(cd, [(0.30, 0.44, 0.72, 0.505)], thresh=10)
boxes = stroke_mask(cd, [(0.25, 0.505, 0.76, 0.61)], thresh=7, blur=31, dilate=3)
mask = cv2.bitwise_or(cv2.bitwise_or(light, dark), boxes)
save(inpaint(cd, mask, 5), "plate-07.webp", 1200, 84)

# 8. Note from the bride: keep the little girl and boy.
note = load("08-note.jpg")
mask = stroke_mask(
    note,
    [
        (0.17, 0.16, 0.83, 0.375),  # title + heart divider
        (0.06, 0.39, 0.94, 0.54),  # body
        (0.15, 0.77, 0.85, 0.94),  # dress code + divider
    ],
    thresh=9,
)
mask = cv2.bitwise_or(mask, rect_mask(note, [(0.44, 0.335, 0.56, 0.38), (0.45, 0.845, 0.55, 0.875)]))
plate8 = inpaint(note, mask, 4)
save(plate8, "plate-08.webp", 1200, 84)
# The little girl and boy as a soft-edged sprite, so they can make a small entrance.
h8, w8 = plate8.shape[:2]
kx0, ky0, kx1, ky1 = rect(plate8, 0.13, 0.55, 0.62, 0.80)
sprite = plate8[ky0:ky1, kx0:kx1]
feather = np.zeros(sprite.shape[:2], np.uint8)
cv2.rectangle(feather, (14, 14), (sprite.shape[1] - 15, sprite.shape[0] - 15), 255, -1)
feather = cv2.GaussianBlur(feather, (29, 29), 0)
bb, gg, rr = cv2.split(sprite)
cv2.imwrite(str(OUT / "kids.png"), cv2.merge([bb, gg, rr, feather]))

# 9. Location: keep the card and the illustrated map; the title and divider become live.
loc = load("09-location.jpg")
mask = stroke_mask(loc, [(0.22, 0.04, 0.80, 0.19)], thresh=9)
mask = cv2.bitwise_or(mask, rect_mask(loc, [(0.44, 0.15, 0.56, 0.19)]))
# The illustrated pin and its label go too: the live pin drops onto the card.
mask = cv2.bitwise_or(mask, rect_mask(loc, [(0.32, 0.38, 0.75, 0.445)]))
save(inpaint(loc, mask, 5), "plate-09.webp", 1200, 84)
print("done")
