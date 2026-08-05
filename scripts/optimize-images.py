#!/usr/bin/env python3
"""Performance pass (2026-08-05): downscale + WebP-encode the images the site
actually references.

Measured regression: home page transferred ~4.9MB — the 6 testimonial avatars
are 1200x1200 PNGs (~500KB each) rendered at 40x40 CSS px, and blog/case-study
photos are large PNGs. WebP + size-capped encoding keeps visual fidelity at the
rendered sizes while cutting transfer ~85%.

Output: <base>.webp next to the source .png (sources kept for fidelity history).
"""
import os
from PIL import Image

IMG = 'public/images'

# (basename, max dimension, webp quality)
AVATARS = [
    '74bgmTCLhG1vjdwC6jrte1Upppk', 'u2w7SaaM0N5ieDRzqCOPmRhPOc',
    'IMZdofzqqJ3H2GANrvn50i2D9qo', 'h2VDy0wqXRFwGZ8MhoVaQt4qHME',
    'segnJi5cGsCMhvZ3MZQnn4lCk5w', 'YA3AGELH6hUZToUz17fZAzd0yo',
]
CASE_STUDIES = ['M5MY3Wk4Y4dsOCa2vifZ9R6pI', 'J7KZFcCw0ZrENLKo0wuCy6nASg', 'Tf9L4582eDStTX4KSFaUOoUP5Ys']
BLOG = ['vl5w99JCKqkuvW49lyswomsyhnY', 'WZnkJ0N8GjD8YGH73bVRdcc9tvI', 'Eu8lb04bFCoyCpFuitulq7gxSfM']


def convert(base: str, max_dim: int, quality: int) -> None:
    src = os.path.join(IMG, base + '.png')
    out = os.path.join(IMG, base + '.webp')
    if not os.path.exists(src):
        print(f'MISSING {src}')
        return
    im = Image.open(src).convert('RGB')
    w, h = im.size
    scale = min(1.0, max_dim / max(w, h))
    if scale < 1.0:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    im.save(out, 'WEBP', quality=quality, method=6)
    old_kb = os.path.getsize(src) / 1024
    new_kb = os.path.getsize(out) / 1024
    print(f'{base}.png {w}x{h} -> {im.width}x{im.height}.webp  {old_kb:.0f}kB -> {new_kb:.0f}kB')


for a in AVATARS:
    convert(a, 160, 82)
for c in CASE_STUDIES:
    convert(c, 1280, 80)
for b in BLOG:
    convert(b, 960, 80)
