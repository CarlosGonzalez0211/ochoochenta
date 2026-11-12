"""Cuts fighters out of their photo background for the VS flyers.
   python3 scripts/cutout.py            (needs: pip install "rembg[cpu]")
Reads flyers/assets/{custom,cache}/<slug>.(jpg|png|webp) for every participant with kind=fighter and writes
flyers/assets/cache/<slug>-cut.png (transparent, cropped to the person). Skips ones already done unless --force."""
import json, sys
from pathlib import Path
from PIL import Image
from rembg import new_session, remove

def keep_largest(im):
    """Drop stray people/fragments: keep only the largest opaque blob."""
    try:
        import numpy as np
        from scipy import ndimage
    except ImportError:
        return im
    a = np.array(im)
    lab, n = ndimage.label(a[..., 3] > 40)
    if n <= 1:
        return im
    sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
    a[..., 3][lab != (int(np.argmax(sizes)) + 1)] = 0
    return Image.fromarray(a)


root = Path(__file__).resolve().parent.parent
assets = root / "flyers" / "assets"
people = json.loads((root / "src/data/events/participants.json").read_text())
force = "--force" in sys.argv
session = None

for slug, p in people.items():
    if slug.startswith("_") or p.get("kind") != "fighter":
        continue
    out = assets / "cache" / f"{slug}-cut.png"
    if out.exists() and not force:
        continue
    src = next((f for d in ("custom", "cache") for ext in ("png", "jpg", "jpeg", "webp")
                if (f := assets / d / f"{slug}.{ext}").exists()), None)
    if not src:
        print(f"- {slug}: no photo")
        continue
    raw = Image.open(src)
    if raw.mode == "RGBA" and raw.getchannel("A").getextrema()[0] < 10:
        cut = raw  # already a transparent cutout (e.g. an official athlete render): keep it as is
    else:
        session = session or new_session("u2net_human_seg")
        img = raw.convert("RGB")
        img.thumbnail((1400, 1400))
        cut = remove(img, session=session, post_process_mask=True)
    cut = keep_largest(cut)
    bbox = cut.getbbox()
    if bbox:
        cut = cut.crop(bbox)
    cut.save(out)
    print(f"✓ {slug} -> {out.relative_to(root)} {cut.size}")
