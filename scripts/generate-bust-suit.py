"""
Head-and-shoulders armour bust for the hanging About photo.

Builds an original black/red armoured suit (based on the owner's concept art)
over public/logos/me.png with height-map shading: every armour plate gets a
height field, normals are derived from it and lit from the top-left, so the
plates read as sculpted 3D pieces rather than flat paint.

Writes, cropped to head and shoulders (square):
  bust-photo-v2.webp   the plain photo
  bust-suit-v2.webp    the suit layer (transparent), aligned to the photo

    pip install pillow numpy
    python3 scripts/generate-bust-suit.py [src.png] [out_dir]
"""
import math, sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

SRC = sys.argv[1] if len(sys.argv) > 1 else 'public/logos/me.png'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'public/about'
CROP = (205, 55, 695, 545)           # square head-and-shoulders crop in source px
S = 2                                # supersampling for shape masks

src = Image.open(SRC).convert('RGB')
W, H = src.size

# ---------- person mask ----------
key = src.copy()
seeds = [(x, 2) for x in range(0, W, 40)] + [(2, y) for y in range(0, H, 40)] + \
        [(W - 3, y) for y in range(0, H, 40)]
for s in seeds:
    if key.getpixel(s) != (0, 255, 0):
        ImageDraw.floodfill(key, s, (0, 255, 0), thresh=38)
k = np.array(key)
person = ~((k[..., 0] == 0) & (k[..., 1] == 255) & (k[..., 2] == 0))
pm = Image.fromarray((person * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.0))
alpha_p = np.array(pm).astype(float) / 255
yy, xx = np.mgrid[0:H, 0:W].astype(float)

def mask(draw_fn, blur=0.0):
    m = Image.new('L', (W * S, H * S), 0)
    draw_fn(ImageDraw.Draw(m), lambda pts: [(x * S, y * S) for x, y in pts])
    m = m.resize((W, H), Image.LANCZOS)
    if blur:
        m = m.filter(ImageFilter.GaussianBlur(blur))
    return np.array(m).astype(float) / 255

def blur(a, r):
    return np.array(Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(float) / 255

CX = 458  # body centre line

# ---------- armour pieces (source coordinates) ----------
neck = mask(lambda d, P: d.polygon(P([(410, 334), (430, 322), (458, 318), (486, 322), (506, 334), (514, 372), (402, 372)]), fill=255))
collar_ring = mask(lambda d, P: d.polygon(P([(398, 362), (518, 362), (540, 390), (376, 390)]), fill=255))
def pec(side):
    return mask(lambda d, P: d.polygon(P([
        (CX + side * 6, 392), (CX + side * 70, 388), (CX + side * 112, 410), (CX + side * 118, 470),
        (CX + side * 92, 512), (CX + side * 34, 524), (CX + side * 6, 500)]), fill=255))
pecL, pecR = pec(-1), pec(1)
def pauldron(side):
    cx, cy = CX + side * 140, 424
    return mask(lambda d, P: d.ellipse(P([(cx - 50, cy - 32), (cx + 50, cy + 38)]), fill=255))
def pauldron_band(side, k):
    cx, cy = CX + side * 146, 460 + k * 19
    return mask(lambda d, P: d.ellipse(P([(cx - 42 + k * 4, cy - 13), (cx + 42 - k * 4, cy + 13)]), fill=255))
paulL, paulR = pauldron(-1), pauldron(1)
bands = sum(pauldron_band(s, k) for s in (-1, 1) for k in (0, 1))
def clav(side):
    return mask(lambda d, P: d.polygon(P([(CX + side * 64, 360), (CX + side * 128, 380), (CX + side * 118, 404), (CX + side * 66, 396)]), fill=255))
clavs = clav(-1) + clav(1)

# ---------- height field: each plate is a rounded dome ----------
def dome(m, r, h):
    # blurred mask ~ distance from edge -> smooth rounded profile, clipped to the plate
    return np.sqrt(np.clip(blur(m, r), 0, 1)) * h * (m > 0.5)

height = (
    dome(neck, 5, 7) + dome(collar_ring, 4, 9) +
    dome(pecL, 14, 16) + dome(pecR, 14, 16) +
    dome(clavs, 4, 7) +
    dome(paulL, 14, 20) + dome(paulR, 14, 20) +
    dome(bands, 5, 8) * (1 - np.clip(paulL + paulR, 0, 1) * 0.7)
)
plates = np.clip(neck + collar_ring + pecL + pecR + clavs + paulL + paulR + bands, 0, 1)

# fabric between plates: the photo's own folds as fine relief
g = np.array(src.convert('L')).astype(float) / 255
low = blur(g, 20)
fabric_h = np.clip((g - low) * 3.0, -0.4, 0.4) * 6
weave = np.sin((xx + yy) * 1.1) * np.sin((xx - yy) * 1.1) * 0.12
height = height + (fabric_h + weave) * (1 - plates)
height = blur(height / 60.0, 1.2) * 60.0

# ---------- lighting ----------
gy, gx = np.gradient(height)
nx, ny, nz = -gx * 1.4, -gy * 1.4, np.ones_like(height)
nl = np.sqrt(nx * nx + ny * ny + nz * nz)
nx, ny, nz = nx / nl, ny / nl, nz / nl
L = np.array([-0.55, -0.65, 0.52]); L = L / np.linalg.norm(L)
V = np.array([0.0, 0.0, 1.0])
Hh = (L + V) / np.linalg.norm(L + V)
diff = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
spec = np.clip(nx * Hh[0] + ny * Hh[1] + nz * Hh[2], 0, 1)
rim = np.clip(1 - nz, 0, 1) ** 2

ARMOUR = np.array([46, 48, 58])
FABRIC = np.array([20, 21, 26])
albedo = ARMOUR * plates[..., None] + FABRIC * (1 - plates)[..., None]
shine = (spec ** 70) * (0.75 * plates + 0.15 * (1 - plates))
col = albedo * (0.35 + 0.9 * diff)[..., None] + 255 * shine[..., None] + np.array([90, 20, 30]) * (rim * 0.35)[..., None]
# ambient occlusion in the gaps between plates
ao = np.clip(blur(plates, 4) - plates, 0, 1) + np.clip(plates - blur(plates, 2.5), 0, 1) * 0.6
col *= (1 - ao * 0.75)[..., None]

# ---------- glowing red accents ----------
RED = np.array([255, 36, 64])
def strokes(d, P):
    for side in (-1, 1):
        cx, cy = CX + side * 140, 424
        # accent along the pauldron's outer edge
        pts = [(cx + side * 48 * math.cos(t), cy + 35 * math.sin(t)) for t in np.linspace(-1.3, 0.7, 20)]
        d.line(P(pts), fill=255, width=5 * S, joint='curve')
        # band edges
        for k in (0, 1):
            bx, by = CX + side * 146, 460 + k * 19
            d.line(P([(bx - 32, by + 11), (bx + 32, by + 11)]), fill=200, width=3 * S)
        # chest accent running from the collar to the emblem
        d.line(P([(CX + side * 100, 402), (CX + side * 56, 428), (CX + side * 24, 460)]), fill=255, width=4 * S, joint='curve')
    # collar rim
    d.line(P([(400, 364), (516, 364)]), fill=255, width=3 * S)
accent = mask(strokes)
ex, ey = CX, 470
emb = mask(lambda d, P: d.polygon(P([(ex - 40, ey - 22), (ex - 12, ey - 10), (ex, ey - 26), (ex + 12, ey - 10), (ex + 40, ey - 22),
                                     (ex + 22, ey + 6), (ex + 8, ey + 4), (ex, ey + 34), (ex - 8, ey + 4), (ex - 22, ey + 6)]), fill=255))
glow_src = np.clip(accent + emb, 0, 1)
glow = blur(glow_src, 8) * 0.9 + blur(glow_src, 20) * 0.5
col = col * (1 - glow_src[..., None]) + (RED * (0.85 + 0.3 * diff)[..., None]) * glow_src[..., None]
col += RED * glow[..., None] * 0.55
core = blur(emb, 3)
col += np.array([255, 170, 170]) * (core * 0.35)[..., None]

col = np.clip(col, 0, 255)

# ---------- coverage: body below the neck guard, plus armour bulk ----------
below = (yy > 330).astype(float)
cover = np.clip(np.maximum(alpha_p * below, plates), 0, 1)
cover = np.maximum(cover, np.clip(glow * 0.0, 0, 1))
out = np.zeros((H, W, 4), dtype=np.uint8)
out[..., :3] = col.astype(np.uint8)
out[..., 3] = (cover * 255).astype(np.uint8)

suit = Image.fromarray(out, 'RGBA').crop(CROP)
photo = src.crop(CROP)
suit.save(f'{OUT}/bust-suit-v2.webp', quality=90, method=6)
photo.save(f'{OUT}/bust-photo-v2.webp', quality=90, method=6)
print('ok', suit.size)
