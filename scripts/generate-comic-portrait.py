"""
Generates the hero's hover-to-reveal layers from public/logos/me.png:

  comic.webp      your photo as comic-poster art (ink lines, flat tones,
                  halftone shading) on a transparent background
  me-cutout.webp  the real photo with the background removed

Tuned for that photo (flat lavender background, subject centred).

    pip install pillow numpy
    python3 scripts/generate-comic-portrait.py [src.png] [out_dir]
"""
import math, sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

SRC = sys.argv[1] if len(sys.argv) > 1 else 'public/logos/me.png'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'public/spidey'

src = Image.open(SRC).convert('RGB')
W, H = src.size

# ---------- 1. cut the person out of the flat background ----------
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
alpha = np.array(pm).astype(float) / 255

cut = src.convert('RGBA'); cut.putalpha(pm)
cut.save(f'{OUT}/me-cutout.webp', quality=86, method=6)

# ---------- 2. tone: smoothed luminance, locally contrast-boosted ----------
flat = src
for _ in range(3):
    flat = flat.filter(ImageFilter.MedianFilter(5))
lum = np.array(flat.convert('L')).astype(float) / 255
m = lum[person]
lum = np.clip((lum - np.percentile(m, 4)) / (np.percentile(m, 97) - np.percentile(m, 4)), 0, 1)
lum = lum ** 0.9

PAPER = np.array([246, 239, 226])
RED = np.array([218, 32, 48])
NAVY = np.array([24, 38, 88])
INK = np.array([10, 12, 22])

# skin & shirt read as paper/red, the dark suit as navy; flat poster bands
out = np.zeros((H, W, 3))
T1, T2, T3 = 0.09, 0.29, 0.47
bands = [(0.0, T1, INK), (T1, T2, NAVY), (T2, T3, RED), (T3, 1.01, PAPER)]
for lo, hi, c in bands:
    sel = (lum >= lo) & (lum < hi)
    out[sel] = c

# ---------- 3. halftone shading across the band edges ----------
cell = 7
ht = Image.new('L', (W * 2, H * 2), 0)
hd = ImageDraw.Draw(ht)
ang = math.radians(45)
ca, sa = math.cos(ang), math.sin(ang)
small = Image.fromarray((lum * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))
la = np.array(small).astype(float) / 255
rng = int(max(W, H) * 1.5 / cell)
for i in range(-rng, rng):
    for j in range(-rng, rng):
        x = (i * ca - j * sa) * cell + W / 2
        y = (i * sa + j * ca) * cell + H / 2
        if not (0 <= x < W and 0 <= y < H) or not person[int(y), int(x)]:
            continue
        v = la[int(y), int(x)]
        # dots only where the tone sits near a band boundary: soft shading
        d = min(abs(v - T1), abs(v - T2), abs(v - T3))
        if d > 0.08:
            continue
        r = cell * 0.44 * (1 - d / 0.08) ** 1.1
        hd.ellipse([2 * (x - r), 2 * (y - r), 2 * (x + r), 2 * (y + r)], fill=255)
dots = np.array(ht.resize((W, H), Image.LANCZOS)).astype(float) / 255
# a dot darkens one band toward the next darker band
darker = {tuple(PAPER): RED, tuple(RED): NAVY, tuple(NAVY): INK, tuple(INK): INK}
dk = np.zeros_like(out)
for c, dcol in darker.items():
    sel = np.all(out == np.array(c), axis=-1)
    dk[sel] = dcol
out = out * (1 - dots[..., None] * 0.85) + dk * dots[..., None] * 0.85

# ---------- 4. ink lines (difference of Gaussians) + bold silhouette ----------
gray = Image.fromarray((np.array(src.convert('L'))).astype(np.uint8))
g1 = np.array(gray.filter(ImageFilter.GaussianBlur(1.4))).astype(float)
g2 = np.array(gray.filter(ImageFilter.GaussianBlur(2.6))).astype(float)
dog = g1 - 0.985 * g2
lines = np.clip((-dog - 2.0) / 6.0, 0, 1)
lines = np.array(Image.fromarray((lines * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(3))).astype(float) / 255
edge = pm.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(0.8))
sil = np.clip(np.array(edge).astype(float) / 255 * 2.5, 0, 1)
ink = np.clip(np.maximum(lines * 0.95, sil), 0, 1)
out = out * (1 - ink[..., None]) + INK * ink[..., None]

# ---------- 5. offset print shadow + save ----------
res = np.zeros((H, W, 4))
res[..., :3] = out
res[..., 3] = alpha * 255
comic = Image.fromarray(res.astype(np.uint8), 'RGBA')
shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
sh = np.zeros((H, W, 4), dtype=np.uint8)
sh[..., :3] = RED
shifted = np.zeros_like(alpha)
shifted[10:, 12:] = alpha[:-10, :-12]          # offset down-right, no wrap-around
sh[..., 3] = (shifted * 255).astype(np.uint8)
shadow = Image.fromarray(sh, 'RGBA')
final = Image.alpha_composite(shadow, comic)
final.save(f'{OUT}/comic.webp', quality=88, method=6)
print('ok')
