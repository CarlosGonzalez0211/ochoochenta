"""Procedural, tileable wood textures (planks with grain, growth rings, pores, knots)."""
import numpy as np
from PIL import Image
import os
rng = np.random.default_rng(880)
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'img')

def aniso(h, w, sx, sy, seed=None):
    """Periodic gaussian-filtered noise, stretched: sx across the grain, sy along it."""
    r = np.random.default_rng(seed) if seed is not None else rng
    n = r.standard_normal((h, w))
    fy = np.fft.fftfreq(h)[:, None]; fx = np.fft.fftfreq(w)[None, :]
    k = np.exp(-2 * (np.pi ** 2) * ((fx * sx) ** 2 + (fy * sy) ** 2))
    o = np.real(np.fft.ifft2(np.fft.fft2(n) * k))
    o -= o.mean(); o /= o.std() + 1e-9
    return o

def lerp(a, b, t): return a + (b - a) * t[..., None]

def plank(pw, H, pal):
    dark, mid, light = [np.array(c, float) for c in pal]
    x = np.arange(pw)[None, :].repeat(H, 0).astype(float)
    y = np.arange(H)[:, None].repeat(pw, 1).astype(float)
    low = aniso(H, pw, 40, 260)
    phase = x * rng.uniform(0.028, 0.05) + low * rng.uniform(1.6, 2.6) + rng.uniform(0, 6)
    knot_dark = []
    for _ in range(rng.integers(0, 3)):          # knots bend the rings
        cx, cy = rng.uniform(0.2, 0.8) * pw, rng.uniform(0, H)
        s = rng.uniform(16, 30)
        d2 = (x - cx) ** 2 + ((y - cy + H / 2) % H - H / 2) ** 2 * 0.55
        phase += 2.2 * np.exp(-d2 / (2 * (s * 2.4) ** 2))
        phase += 1.1 * np.exp(-d2 / (2 * (s * 6) ** 2))
        knot_dark.append(np.exp(-d2 / (2 * (s * 0.5) ** 2)))
    rings = 0.5 + 0.5 * np.sin(phase * 2 * np.pi)
    rings = rings ** 1.6
    streak = aniso(H, pw, 0.9, 90)               # long fibres
    fine = aniso(H, pw, 0.5, 14)
    pores = np.clip(aniso(H, pw, 0.5, 5) - 1.8, 0, None)
    t = 0.42 + 0.17 * (rings - 0.5) + 0.17 * streak + 0.07 * fine + 0.07 * low
    for k in knot_dark: t = t - 0.28 * k
    t = np.clip(t + rng.uniform(-0.08, 0.06), 0, 1)
    img = np.where(t[..., None] < 0.5, lerp(dark, mid, np.clip(t * 2, 0, 1)), lerp(mid, light, np.clip(t * 2 - 1, 0, 1)))
    img = img * (1 - np.clip(pores, 0, 1)[..., None] * 0.55)
    # knot cores
    return img

def make(pal, pw, n, H, name, rotate=False, gap=3):
    cols = []
    for i in range(n):
        p = plank(pw, H, pal)
        p[:, :gap] *= 0.18; p[:, gap:gap + 2] *= 1.18       # dark seam + lit bevel
        p[:, -2:] *= 0.75
        cols.append(p)
    img = np.concatenate(cols, 1)
    # gentle overall light falloff variation so it doesn't look flat
    img *= (0.94 + 0.06 * aniso(H, pw * n, 200, 400)[..., None])
    img = np.clip(img, 0, 255).astype(np.uint8)
    im = Image.fromarray(img)
    if rotate: im = im.rotate(90, expand=True)
    im.save(os.path.join(OUT, name), quality=80)
    print(name, im.size, os.path.getsize(os.path.join(OUT, name)) // 1024, 'KB')

# dark walnut wall (vertical slats, like the restaurant's wall panels)
make(((22, 11, 6), (74, 40, 22), (132, 82, 46)), 200, 8, 1600, 'wood-wall.webp')
# warmer oak-walnut tabletop (horizontal planks)
make(((40, 22, 11), (110, 66, 34), (176, 118, 66)), 200, 8, 1600, 'wood-table.webp', rotate=True)
