"""
Generates an original black-and-red armoured tech-suit overlay for
public/logos/me.png, plus a suited cut-out for the hero.

The overlay is the same size as the photo with a transparent background and
covers only the body (from the collar down), so the face stays visible. It
keeps the photo's real folds and lighting, so the suit reads as worn.

    pip install pillow numpy
    python3 scripts/generate-suit-overlay.py [src.png] [out.webp]
"""
import math, sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

SRC = sys.argv[1] if len(sys.argv) > 1 else 'public/logos/me.png'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'public/about/suit.webp'
S = 2  # supersampling for line work

src = Image.open(SRC).convert('RGB')
W, H = src.size

# ---------- 1. person mask (flat background flood-fill) ----------
key = src.copy()
seeds = [(x, 2) for x in range(0, W, 40)] + [(2, y) for y in range(0, H, 40)] + \
        [(W - 3, y) for y in range(0, H, 40)] + [(x, H - 3) for x in range(0, 330, 40)] + \
        [(x, H - 3) for x in range(700, W, 40)]
for s in seeds:
    if key.getpixel(s) != (0, 255, 0):
        ImageDraw.floodfill(key, s, (0, 255, 0), thresh=38)
k = np.array(key)
person = ~((k[..., 0] == 0) & (k[..., 1] == 255) & (k[..., 2] == 0))
person[990:, 880:] = False
pm = Image.fromarray((person * 255).astype(np.uint8))
pm = pm.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.0))
alpha = np.array(pm).astype(float) / 255

# ---------- 2. suit area: everything below a collar line ----------
yy, xx = np.mgrid[0:H, 0:W]
# collar dips at the throat and rises toward the shoulders
collar = 328 + 14 * np.exp(-((xx - 455) / 38.0) ** 2) - 0.0006 * (xx - 455) ** 2
suit_m = (yy > collar).astype(float)
suit_m = np.array(Image.fromarray((suit_m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))).astype(float) / 255
cover = alpha * suit_m

# ---------- 3. fabric shading: keep folds, drop the shirt/blazer colour ----------
g = np.array(src.convert('L')).astype(float) / 255
low = np.array(Image.fromarray((g * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(28))).astype(float) / 255
detail = np.clip((g - low) * 2.4, -0.45, 0.45)               # creases and folds
detail *= np.clip(1.6 - low * 1.6, 0.35, 1.0)                # the white shirt shouldn't show through
light = 0.5 + 0.35 * (1 - (yy - 330) / (H - 330)) - 0.18 * np.abs((xx - 470) / 330.0)  # soft key light from above
shade = np.clip(light + detail, 0.12, 1.25)

BASE = np.array([16, 17, 21])        # matte black
PLATE = np.array([27, 29, 35])       # armour plates, dark gunmetal
RED = np.array([232, 28, 52])        # glowing accents

# ---------- 4. armour plates (segmented, dark) ----------
plates = Image.new('L', (W, H), 0)
pd = ImageDraw.Draw(plates)
# chest plate: broad shield across the pecs
pd.polygon([(352, 392), (462, 372), (574, 392), (606, 468), (540, 520), (470, 548), (400, 520), (330, 468)], fill=255)
# abdominal segments
for i, y0 in enumerate((572, 618, 664)):
    w = 52 - i * 5
    pd.rounded_rectangle([470 - w, y0, 470 + w, y0 + 34], radius=14, fill=255)
def pauldron(cx, cy, rx, ry, side):
    pts = []
    for i in range(41):
        t = math.pi * (i / 40)
        pts.append((cx + side * rx * math.cos(t) * -1, cy - ry * math.sin(t) * 0.55 + ry * 0.45 * (1 - math.sin(t))))
    pts.append((cx + side * rx * 0.55, cy + ry * 0.95))
    pts.append((cx - side * rx * 0.75, cy + ry * 0.7))
    return pts
pd.polygon(pauldron(306, 410, 46, 62, -1), fill=255)
pd.polygon(pauldron(640, 410, 48, 62, 1), fill=255)
# forearm guards
pd.polygon([(262, 700), (300, 690), (316, 860), (276, 870)], fill=255)
pd.polygon([(662, 690), (704, 700), (694, 870), (652, 860)], fill=255)
plates = plates.filter(ImageFilter.GaussianBlur(1.2))
pl = np.array(plates).astype(float) / 255

col = (BASE * (1 - pl[..., None]) + PLATE * pl[..., None]) * shade[..., None]

# plate bevel: light top edge, dark lower edge
bev = np.array(plates.filter(ImageFilter.GaussianBlur(4))).astype(float) / 255
up = np.roll(bev, 3, axis=0)
col += np.clip(bev - up, 0, 1)[..., None] * 85
col -= np.clip(up - bev, 0, 1)[..., None] * 70

# carbon-weave texture on the fabric areas
weave = (((xx // 4 + yy // 4) % 2) * 2 - 1) * (np.sin((xx - yy) * 0.8) * 0.5 + 0.5)
col += (weave * 7 * (1 - pl))[..., None]

# ---------- 5. glowing red accent panels + chevron emblem ----------
A = Image.new('L', (W * S, H * S), 0)
ad2 = ImageDraw.Draw(A)
def P(pts): return [(x * S, y * S) for x, y in pts]
# shoulder accent stripes sweeping down the outer arm
ad2.polygon(P([(270, 400), (300, 382), (296, 470), (276, 560), (262, 556), (268, 470)]), fill=255)
ad2.polygon(P([(674, 400), (644, 382), (650, 470), (668, 560), (682, 556), (676, 470)]), fill=255)
# collar-bone accents leading to the emblem
ad2.polygon(P([(352, 398), (420, 382), (430, 392), (362, 412)]), fill=255)
ad2.polygon(P([(574, 398), (506, 382), (496, 392), (564, 412)]), fill=255)
# side ribs
for y0 in (600, 650, 700):
    ad2.polygon(P([(352, y0), (392, y0 - 6), (394, y0 + 6), (354, y0 + 12)]), fill=255)
    ad2.polygon(P([(588, y0), (548, y0 - 6), (546, y0 + 6), (586, y0 + 12)]), fill=255)
# forearm bands and glove cuffs
for (x1, x2, y) in ((268, 304, 760), (274, 310, 800), (658, 696, 760), (652, 690, 800)):
    ad2.polygon(P([(x1, y), (x2, y - 4), (x2, y + 8), (x1, y + 12)]), fill=255)
for (x1, x2) in ((282, 326), (668, 714)):   # thin glove cuffs at the wrist
    ad2.polygon(P([(x1, 884), (x2, 880), (x2, 890), (x1, 894)]), fill=255)
# belt line
ad2.rectangle(P([(380, 856), (560, 864)]), fill=255)
# emblem: an angular downward chevron with a notch (original)
ex, ey = 468, 452
emb = [(ex - 46, ey - 26), (ex - 14, ey - 12), (ex, ey - 30), (ex + 14, ey - 12), (ex + 46, ey - 26),
       (ex + 26, ey + 8), (ex + 10, ey + 6), (ex, ey + 40), (ex - 10, ey + 6), (ex - 26, ey + 8)]
ad2.polygon(P(emb), fill=255)
acc = np.array(A.resize((W, H), Image.LANCZOS)).astype(float) / 255
glow = np.array(Image.fromarray((acc * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(7))).astype(float) / 255
# accents keep the fabric shading so they read as lit panels, not stickers
lit = np.clip(0.55 + 0.6 * shade, 0.5, 1.3)[..., None]
col = col * (1 - acc[..., None]) + RED * lit * acc[..., None]
col += RED * (glow * 0.65)[..., None] * (1 - acc[..., None])
# hot core on the emblem
core = Image.new('L', (W, H), 0)
ImageDraw.Draw(core).polygon([(ex - 18, ey - 10), (ex, ey - 20), (ex + 18, ey - 10), (ex, ey + 24)], fill=255)
core = np.array(core.filter(ImageFilter.GaussianBlur(5))).astype(float) / 255
col += np.array([255, 120, 120])[None, None, :] * (core * 0.45)[..., None]

# rim light on the shoulders
rim = np.array(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(2))).astype(float) / 255
col += (rim * 60 * np.clip((640 - yy) / 260.0, 0, 1))[..., None]

col = np.clip(col, 0, 255)
out = np.zeros((H, W, 4), dtype=np.uint8)
out[..., :3] = col.astype(np.uint8)
out[..., 3] = (cover * 255).astype(np.uint8)
suit_img = Image.fromarray(out, 'RGBA')
suit_img.save(OUT, quality=88, method=6)

# hero layer: the cut-out photo wearing the suit (transparent background)
HERO = OUT.replace('suit.webp', 'suited-cutout.webp')
cut = src.convert('RGBA'); cut.putalpha(pm)
Image.alpha_composite(cut, suit_img).save(HERO, quality=88, method=6)
print('ok', OUT, HERO)
