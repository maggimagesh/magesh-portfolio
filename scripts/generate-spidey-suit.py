"""
Generates the hero's "bug hunter" suit alter ego (an original design) and a background-free cutout from
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

# ---------- 3. panels: an original "bug hunter" armour suit ----------
# Charcoal base with red accent panels: a shoulder yoke that drops to a V at
# the sternum, side stripes down the torso, and a crest over the mask.
accent = Image.new('L', (W, H), 0)
ad = ImageDraw.Draw(accent)
ad.polygon([(262, 372), (740, 372), (752, 452), (612, 470), (500, 600), (388, 470), (250, 452)], fill=255)
ad.polygon([(330, 540), (372, 530), (392, 880), (350, 890)], fill=255)      # left torso stripe
ad.polygon([(628, 530), (670, 540), (650, 890), (608, 880)], fill=255)      # right torso stripe
ad.polygon([(443, 78), (476, 84), (452, 182), (434, 182), (410, 84)], fill=255)  # mask crest
accent = accent.filter(ImageFilter.GaussianBlur(1.5))
accm = np.array(accent).astype(float) / 255

# shading from the original photo
g = np.array(src.convert('L')).astype(float) / 255
g = np.clip((g - g[person].mean()) * 1.25 + 0.5, 0, 1)
# the helmet is a hard shell: blur away facial features inside the head
gb = np.array(Image.fromarray((g * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))).astype(float) / 255
hm = np.array(head).astype(float) / 255
hm[300:, :] = 0
g = g * (1 - hm) + (0.35 + 0.5 * gb) * hm
shade = (0.45 + 0.9 * g)[..., None]
BASE = np.array([40, 44, 58]); ACCENT = np.array([214, 30, 45])
col = (ACCENT * accm[..., None] + BASE * (1 - accm[..., None])) * shade
col = np.clip(col, 0, 255)

suit = Image.fromarray(col.astype(np.uint8)).convert('RGBA')

# ---------- 4. line art (drawn at 2x, then downsampled) ----------
def P(x, y): return (x * S, y * S)

# hexagonal armour plating, faint, on the charcoal panels
HX = Image.new('L', (W * S, H * S), 0)
hx = ImageDraw.Draw(HX)
R = 15
for row in range(0, int(H / (R * 1.5)) + 2):
    for colx in range(0, int(W / (R * 1.732)) + 2):
        cx = colx * R * 1.732 + (row % 2) * R * 0.866
        cy = row * R * 1.5
        pts = [P(cx + R * math.cos(math.radians(60 * k + 30)), cy + R * math.sin(math.radians(60 * k + 30))) for k in range(7)]
        hx.line(pts, fill=255, width=2 * S)
hexes = np.array(HX.resize((W, H), Image.LANCZOS)).astype(float) / 255 * (1 - accm)

# panel seams
edge = accent.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.MaxFilter(3))
edge_np = np.clip(np.array(edge).astype(float) / 255 * 2.2, 0, 1)

arr = np.array(suit).astype(float)
arr[..., :3] += hexes[..., None] * 26                      # lighter plating lines
arr[..., :3] *= (1 - edge_np[..., None] * 0.9)              # dark seams
arr[..., :3] = np.clip(arr[..., :3], 0, 255)
arr[..., 3] = sil * 255
suit = Image.fromarray(arr.astype(np.uint8))

# ---------- 5. visor + "bug hunter" chest emblem ----------
O = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
od = ImageDraw.Draw(O)

# one wraparound visor across both eyes, dipping slightly at the nose
def visor(inset):
    top, bot = [], []
    for i in range(41):
        t = i / 40
        x = 356 + inset + (530 - 2 * inset - 356) * t
        u = (t - 0.5) * 2
        yt = 182 + inset + 10 * u * u + 6 * math.exp(-(u * 4) ** 2)
        yb = 226 - inset - 4 * u * u + 8 * math.exp(-(u * 4) ** 2) * 0 - 10 * math.exp(-(u * 3) ** 2) * -0.6
        top.append(P(x, yt)); bot.append(P(x, yb))
    return top + bot[::-1]
od.polygon(visor(0), fill=(12, 14, 20, 255))
od.polygon(visor(5), fill=(40, 200, 235, 255))
glow = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
ImageDraw.Draw(glow).polygon(visor(9), fill=(190, 250, 255, 170))
glow = glow.filter(ImageFilter.GaussianBlur(10 * S))
O = Image.alpha_composite(O, glow)
od = ImageDraw.Draw(O)
od.line([P(372, 196), P(420, 192)], fill=(255, 255, 255, 220), width=3 * S)   # glint

# target ring with a beetle inside: the QA bug hunter's mark
ex, ey, er = 500, 548, 46
od.ellipse([P(ex - er - 6, ey - er - 6), P(ex + er + 6, ey + er + 6)], fill=(12, 14, 20, 255))
od.ellipse([P(ex - er, ey - er), P(ex + er, ey + er)], outline=(245, 245, 248, 255), width=5 * S)
for dx, dy in ((0, -1), (0, 1), (-1, 0), (1, 0)):
    od.line([P(ex + dx * (er - 12), ey + dy * (er - 12)), P(ex + dx * (er + 10), ey + dy * (er + 10))],
            fill=(245, 245, 248, 255), width=5 * S)
bug = (214, 30, 45, 255)
od.ellipse([P(ex - 14, ey - 12), P(ex + 14, ey + 24)], fill=bug)          # shell
od.ellipse([P(ex - 8, ey - 24), P(ex + 8, ey - 10)], fill=bug)            # head
od.line([P(ex, ey - 10), P(ex, ey + 23)], fill=(12, 14, 20, 255), width=2 * S)
for side in (-1, 1):
    for y0, y1 in ((-4, -12), (6, 6), (16, 26)):
        od.line([P(ex + side * 12, ey + y0), P(ex + side * 24, ey + y1)], fill=bug, width=3 * S)
    od.line([P(ex + side * 4, ey - 22), P(ex + side * 12, ey - 32)], fill=bug, width=2 * S)  # antennae
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
