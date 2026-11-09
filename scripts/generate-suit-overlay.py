"""
Generates an original tech-suit overlay for public/logos/me.png.

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
light = 0.5 + 0.35 * (1 - (yy - 330) / (H - 330)) - 0.18 * np.abs((xx - 470) / 330.0)  # soft key light from above
shade = np.clip(light + detail, 0.12, 1.25)

BASE = np.array([24, 26, 33])        # graphite
PLATE = np.array([72, 79, 96])       # sculpted armour plates
AMBER = np.array([255, 176, 46])

# ---------- 4. panels ----------
plates = Image.new('L', (W, H), 0)
pd = ImageDraw.Draw(plates)
# chest plate: broad chevron across the pecs, narrowing down the sternum
pd.polygon([(352, 392), (462, 368), (574, 392), (604, 470), (520, 530), (470, 640), (412, 530), (330, 470)], fill=255)
# shoulder armour
def pauldron(cx, cy, rx, ry, side):
    # rounded shoulder pad: a half-ellipse cap that curves down the arm
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
col += np.clip(bev - up, 0, 1)[..., None] * 150
col -= np.clip(up - bev, 0, 1)[..., None] * 110

# subtle woven fabric texture on the graphite areas
tex = ((np.sin(xx * 0.9 + yy * 0.9) + np.sin(xx * 0.9 - yy * 0.9)) * 0.5)
col += (tex * 4 * (1 - pl))[..., None]

# ---------- 5. glowing amber seams + emblem ----------
L = Image.new('L', (W * S, H * S), 0)
ld = ImageDraw.Draw(L)
def P(pts): return [(x * S, y * S) for x, y in pts]
seams = [
    [(330, 470), (412, 530), (470, 640), (520, 530), (604, 470)],   # under the chest plate
    [(352, 392), (330, 470)], [(574, 392), (604, 470)],
    [(470, 640), (470, 860)],                                       # centre line to the belt
    [(380, 860), (560, 860)],                                       # belt
    [(300, 690), (316, 860)], [(662, 690), (652, 860)],             # forearm guards
]
for sm in seams:
    ld.line(P(sm), fill=255, width=4 * S, joint='curve')
# original emblem: a split diamond with a check stroke (QA, "tested")
ex, ey = 468, 470
ld.polygon(P([(ex, ey - 26), (ex + 22, ey), (ex, ey + 26), (ex - 22, ey)]), outline=255, width=4 * S)
ld.line(P([(ex - 10, ey + 1), (ex - 2, ey + 9), (ex + 12, ey - 9)]), fill=255, width=4 * S, joint='curve')
lines = np.array(L.resize((W, H), Image.LANCZOS)).astype(float) / 255
glow = np.array(Image.fromarray((lines * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5))).astype(float) / 255
col = col * (1 - lines[..., None] * 0.95) + AMBER * lines[..., None] * 0.95
col += AMBER * (glow * 0.55)[..., None]

# rim light on the shoulders
rim = np.array(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(2))).astype(float) / 255
col += (rim * 70 * np.clip((640 - yy) / 260.0, 0, 1))[..., None]   # fades out smoothly

col = np.clip(col, 0, 255)
out = np.zeros((H, W, 4), dtype=np.uint8)
out[..., :3] = col.astype(np.uint8)
out[..., 3] = (cover * 255).astype(np.uint8)
Image.fromarray(out, 'RGBA').save(OUT, quality=88, method=6)
print('ok', OUT)
