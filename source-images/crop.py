"""Crops the raw social/menu photos down to food/drink/place only (no logos or overlay text)."""
from PIL import Image
import os
S = os.path.dirname(os.path.abspath(__file__))
O = os.path.join(S, '..', 'public', 'img')
crops = {
 'steak':        ('880 platillo 1.jpg', (30, 300, 1050, 940)),
 'aguachile':    ('880 platillo 2.jpg', (0, 230, 1080, 1350)),
 'aguachile2':   ('880 platillo 3.jpg', (0, 200, 1080, 1350)),
 'coctel':       ('880 platillo 4.jpg', (0, 200, 1080, 1150)),
 'fajitas':      ('880 platillo 5.jpg', (0, 540, 1080, 1300)),
 'enchiladas':   ('880 platillo 6.jpg', (500, 350, 1470, 742)),
 'mesa':         ('880 mesa 1.jpg',     (560, 470, 1080, 1230)),
 'aguas':        ('880 bebidas 1.jpg',  (40, 500, 1122, 1340)),
 'mezcal':       ('880 bebidas 2.jpg',  (0, 200, 1080, 1350)),
 'clamato':      ('880 bebidas 3.jpg',  (120, 410, 720, 1198)),
 'colada':       ('880 bebidas 4.jpg',  (390, 300, 1010, 1130)),
 'tajin':        ('880 babidas 3.jpg',  (0, 0, 1080, 1150)),
 'bar':          ('880 lugar 1.jpg',    None),
 'parrillada':   ('880 menu 3.jpg',     (170, 30, 920, 500)),
 'molcajete':    ('880 menu 2.jpg',     (250, 1500, 830, 1920)),
 'pastel':       ('880 menu 4.jpg',     (150, 1655, 780, 1920)),
}
for name, (src, box) in crops.items():
    im = Image.open(os.path.join(S, src)).convert('RGB')
    if box: im = im.crop(box)
    im.thumbnail((1400, 1400))
    im.save(os.path.join(O, name + '.webp'), quality=82)
    print(name, im.size)

# logo: key out the black background so it sits on wood/black alike
lg = Image.open(os.path.join(S, 'ocho80 logo.jpg')).convert('RGB').crop((150, 330, 1140, 820))
r, g, b = lg.split()
from PIL import ImageChops
a = ImageChops.lighter(ImageChops.lighter(r, g), b).point(lambda v: min(255, int(v * 3)))
lg = lg.convert('RGBA'); lg.putalpha(a)
lg.save(os.path.join(O, 'logo.png'))
print('logo', lg.size)
