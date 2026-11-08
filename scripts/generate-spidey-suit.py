"""
Generates the hero's spider-suit alter ego and a background-free cutout from
public/logos/me.png. Tuned for that photo (flat lavender background, subject
centred); the coordinates below (head ellipse, panel polygon, eyes, emblem)
need adjusting if the photo changes.

    pip install pillow numpy
    python3 scripts/generate-spidey-suit.py [src.png] [out_dir]

Writes suit.webp and me-cutout.webp to out_dir (default public/spidey).
"""
import math, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import numpy as np

SRC = sys.argv[1] if len(sys.argv) > 1 else 'public/logos/me.png'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'public/spidey'
S = 2  # supersample factor for drawn line-art

src = Image.open(SRC).convert('RGB')
W, H = src.size

# ---------- 1. cut the person out of the flat lavender background ----------
key = src.copy()
seeds = [(x, 2) for x in range(0, W, 40)] + [(2, y) for y in range(0, H, 40)] + \
        [(W - 3, y) for y in range(0, H, 40)] + [(x, H - 3) for x in range(0, 330, 40)] + \
        [(x, H - 3) for x in range(700, W, 40)]
for s in seeds:
    if key.getpixel(s) != (0, 255, 0):
        ImageDraw.floodfill(key, s, (0, 255, 0), thresh=38)
k = np.array(key)
person = ~((k[..., 0] == 0) & (k[..., 1] == 255) & (k[..., 2] == 0))
person[990:, 880:] = False          # stray watermark in the corner
pm = Image.fromarray((person * 255).astype(np.uint8))
pm = pm.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.2))

# real-photo cutout (keeps hair) for the reveal layer
cut = src.convert('RGBA'); cut.putalpha(pm)
cut.save(f'{OUT}/me-cutout.webp', quality=86, method=6)

# ---------- 2. costume silhouette: smooth masked head + body ----------
HC = (443, 206); HRX, HRY = 91, 129
head = Image.new('L', (W, H), 0)
hd = ImageDraw.Draw(head)
hd.ellipse([HC[0] - HRX, HC[1] - HRY, HC[0] + HRX, HC[1] + HRY], fill=255)
hd.rectangle([398, 290, 512, 350], fill=255)       # neck
head = head.filter(ImageFilter.GaussianBlur(1.2))
body = np.array(pm).astype(float) / 255
body[:300, :] = 0
body[300:350, :] *= (np.arange(300, 350)[:, None] - 300) / 50   # fade into neck
sil = np.maximum(body, np.array(head) / 255)

# ---------- 3. red / blue panels ----------
red = Image.new('L', (W, H), 0)
rd = ImageDraw.Draw(red)
rd.ellipse([HC[0] - HRX - 4, HC[1] - HRY - 4, HC[0] + HRX + 4, HC[1] + HRY + 4], fill=255)
rd.rectangle([390, 280, 520, 360], fill=255)
# chest + shoulders + upper arms + centre torso down to a belt
rd.polygon([(260, 360), (740, 360), (760, 470), (650, 520), (610, 600), (590, 860),
            (500, 900), (405, 860), (390, 600), (350, 520), (250, 470)], fill=255)
# gloves (hands)
red = red.filter(ImageFilter.GaussianBlur(1.5))
redm = np.array(red).astype(float) / 255

# shading from the original photo
g = np.array(src.convert('L')).astype(float) / 255
g = np.clip((g - g[person].mean()) * 1.25 + 0.5, 0, 1)
shade = (0.42 + 0.85 * g)[..., None]
RED = np.array([206, 22, 38]); BLUE = np.array([28, 58, 140])
col = (RED * redm[..., None] + BLUE * (1 - redm[..., None])) * shade
col = np.clip(col, 0, 255)

suit = Image.fromarray(col.astype(np.uint8)).convert('RGBA')

# ---------- 4. line art (drawn at 2x, then downsampled) ----------
L = Image.new('L', (W * S, H * S), 0)
ld = ImageDraw.Draw(L)
def P(x, y): return (x * S, y * S)

def web(cx, cy, n, rings, rmax, w, start=0.0):
    angs = [start + i * 2 * math.pi / n for i in range(n)]
    for a in angs:
        ld.line([P(cx, cy), P(cx + math.cos(a) * rmax, cy + math.sin(a) * rmax)], fill=255, width=w * S)
    for r in rings:
        pts = []
        for i, a in enumerate(angs + [angs[0] + 2 * math.pi]):
            pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
        for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
            # sagging strand toward the centre
            mx, my = (x1 + x2) / 2, (y1 + y2) / 2
            sx, sy = cx + (mx - cx) * 0.9, cy + (my - cy) * 0.9
            seg = []
            for t in np.linspace(0, 1, 10):
                bx = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * sx + t ** 2 * x2
                by = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * sy + t ** 2 * y2
                seg.append(P(bx, by))
            ld.line(seg, fill=255, width=w * S)

# mask webbing radiating from between the eyes, chest webbing from the emblem
web(442, 222, 16, [30, 62, 98, 140], 200, 2, start=0.1)
web(495, 520, 18, [55, 110, 170, 235, 300, 370], 480, 2)
lines = L.resize((W, H), Image.LANCZOS)
lines_np = np.array(lines).astype(float) / 255 * redm   # webbing only on red panels

# seams between red and blue panels
edge = red.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.MaxFilter(3))
edge_np = np.clip(np.array(edge).astype(float) / 255 * 2.2, 0, 1)

ink = np.clip(np.maximum(lines_np * 0.95, edge_np), 0, 1)
arr = np.array(suit).astype(float)
arr[..., :3] *= (1 - ink[..., None] * 0.92)
arr[..., 3] = sil * 255
suit = Image.fromarray(arr.astype(np.uint8))

# ---------- 5. chest emblem + eye lenses ----------
O = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
od = ImageDraw.Draw(O)
ex, ey = 495, 515
# original eight-legged spider glyph
od.ellipse([P(ex - 15, ey - 32), P(ex + 15, ey + 2)], fill=(10, 10, 14, 255))
od.ellipse([P(ex - 20, ey - 2), P(ex + 20, ey + 52)], fill=(10, 10, 14, 255))
od.ellipse([P(ex - 9, ey - 50), P(ex + 9, ey - 30)], fill=(10, 10, 14, 255))
for side in (-1, 1):
    for (a, b, c) in [((14, -22), (48, -52), (58, -86)), ((15, -12), (58, -26), (76, -44)),
                      ((15, 6), (62, 20), (78, 52)), ((14, 18), (46, 46), (54, 92))]:
        pts = [P(ex + side * a[0], ey + a[1]), P(ex + side * b[0], ey + b[1]), P(ex + side * c[0], ey + c[1])]
        od.line(pts, fill=(10, 10, 14, 255), width=6 * S, joint='curve')

def lens(cx, cy, w, h, rot, mirror):
    pts = []
    for i in range(80):
        t = 2 * math.pi * i / 80
        x = math.cos(t) * w / 2
        y = math.sin(t) * h / 2
        # teardrop: pointier toward the nose, fuller at the temple
        x *= 1 + 0.18 * math.cos(t) * mirror
        y *= 1 - 0.35 * max(0, -math.cos(t) * mirror)
        r = math.radians(rot)
        pts.append((cx + x * math.cos(r) - y * math.sin(r), cy + x * math.sin(r) + y * math.cos(r)))
    return [P(x, y) for x, y in pts]

for cx, rot, m in ((401, -22, -1), (485, 22, 1)):
    poly = lens(cx, 202, 84, 58, rot, m)
    od.polygon(poly, fill=(14, 14, 18, 255))
    inner = lens(cx, 202, 66, 41, rot, m)
    od.polygon(inner, fill=(248, 248, 250, 255))
O = O.resize((W, H), Image.LANCZOS)
suit = Image.alpha_composite(suit, O)

# subtle specular on the mask
spec = Image.new('L', (W, H), 0)
ImageDraw.Draw(spec).ellipse([395, 105, 470, 160], fill=60)
spec = spec.filter(ImageFilter.GaussianBlur(18))
hl = Image.new('RGBA', (W, H), (255, 255, 255, 0)); hl.putalpha(ImageChops.multiply(spec, Image.fromarray((sil * 255).astype(np.uint8))))
suit = Image.alpha_composite(suit, hl)

suit.save(f'{OUT}/suit.webp', quality=86, method=6)
print('ok')
