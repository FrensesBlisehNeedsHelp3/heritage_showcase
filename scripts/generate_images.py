"""
Generates flat-illustration placeholder imagery for the Pangasinan Heritage
Digital Showcase. These are original vector-style illustrations (gradients +
simple shapes drawn with Pillow) so the project ships with zero external
photo dependencies / licensing concerns. Swap the files in public/images/
with real photography whenever it's available -- the component code does
not need to change since filenames stay the same.
"""
import math
import random
from PIL import Image, ImageDraw, ImageFilter

random.seed(7)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def vertical_gradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", size, top)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        c = lerp(top, bottom, t)
        for x in range(w):
            px[x, y] = c
    return img


def add_grain(img, amount=6):
    w, h = img.size
    noise = Image.effect_noise((w, h), amount).convert("L")
    noise_rgb = Image.merge("RGB", (noise, noise, noise))
    return Image.blend(img, noise_rgb, 0.035)


def add_mist(draw, size, band_y, color, opacity=60, height=140):
    w, h = size
    overlay = Image.new("RGBA", size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse([-w * 0.2, band_y - height / 2, w * 1.2, band_y + height / 2],
               fill=color + (opacity,))
    return overlay


def draw_sun(img, center, radius, color):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse([center[0] - radius, center[1] - radius,
                center[0] + radius, center[1] + radius], fill=color)
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius * 0.06))
    composited = Image.alpha_composite(img.convert("RGBA"), overlay)
    img.paste(composited, (0, 0))


# ---------------------------------------------------------------- HERO -----
def make_hero(path, size=(1920, 1200)):
    w, h = size
    img = vertical_gradient(size, (96, 132, 118), (168, 190, 150)).convert("RGBA")
    d = ImageDraw.Draw(img)

    # soft sun, upper right
    draw_sun(img, (w * 0.80, h * 0.20), w * 0.11, (255, 236, 196, 130))
    d = ImageDraw.Draw(img)

    # rolling hills (rice-terrace inspired ridgelines), lightest -> darkest
    ridge_colors = [(112, 140, 108), (86, 114, 84), (60, 88, 60), (38, 62, 40), (24, 42, 28)]
    for i, base_c in enumerate(ridge_colors):
        base_y = h * (0.44 + i * 0.095)
        pts = [(0, h)]
        segments = 10
        for s in range(segments + 1):
            x = w * s / segments
            wobble = math.sin(s * 1.3 + i * 2) * (30 - i * 3) + math.sin(s * 0.6 + i) * 16
            pts.append((x, base_y + wobble))
        pts.append((w, h))
        d.polygon(pts, fill=base_c)

    # winding coastal road through the hills
    road_pts = []
    for s in range(0, 21):
        t = s / 20
        x = w * (0.12 + 0.62 * t)
        y = h * (0.60 + 0.30 * t) + math.sin(t * 7) * 26
        road_pts.append((x, y))
    d.line(road_pts, fill=(224, 217, 196, 235), width=9, joint="curve")

    # lighthouse silhouette on a bluff (Bolinao nod), left-of-center
    lx, ly = w * 0.185, h * 0.475
    d.polygon([(lx - 15, ly), (lx + 15, ly), (lx + 10, ly - 100), (lx - 10, ly - 100)],
              fill=(22, 34, 24, 255))
    d.polygon([(lx - 18, ly - 100), (lx + 18, ly - 100), (lx, ly - 128)], fill=(22, 34, 24, 255))
    d.rectangle([lx - 4, ly - 143, lx + 4, ly - 128], fill=(255, 236, 196, 255))
    beam = Image.new("RGBA", size, (0, 0, 0, 0))
    bd = ImageDraw.Draw(beam)
    bd.polygon([(lx, ly - 136), (lx - w * 0.22, ly - 210), (lx - w * 0.22, ly - 110)],
                fill=(255, 244, 214, 55))
    beam = beam.filter(ImageFilter.GaussianBlur(5))
    img = Image.alpha_composite(img, beam)
    d = ImageDraw.Draw(img)

    # distant sea + small islands (Hundred Islands nod), right side
    sea_top = h * 0.90
    d.rectangle([0, sea_top, w, h], fill=(34, 56, 50, 255))
    d.rectangle([0, sea_top, w, sea_top + 6], fill=(210, 224, 210, 160))
    for isl in range(7):
        ix = w * (0.52 + isl * 0.068) + random.uniform(-12, 12)
        iy = sea_top - random.uniform(4, 20)
        ir = random.uniform(20, 42)
        d.ellipse([ix - ir, iy - ir * 0.5, ix + ir, iy + ir * 0.5], fill=(20, 34, 26, 255))

    # soft mist bands for depth
    mist1 = add_mist(d, size, h * 0.52, (240, 240, 228), opacity=55, height=70)
    img = Image.alpha_composite(img, mist1)
    d = ImageDraw.Draw(img)
    mist2 = add_mist(d, size, h * 0.70, (240, 240, 228), opacity=40, height=55)
    img = Image.alpha_composite(img, mist2)
    d = ImageDraw.Draw(img)

    # gentle darkening only along the very top-left, enough for white nav/hero text
    grad = Image.new("L", size, 0)
    gpx = grad.load()
    for y in range(h):
        t = max(0.0, 1 - (y / (h * 0.55)))
        val = int(95 * t)
        for x in range(w):
            xt = max(0.0, 1 - (x / (w * 0.55)))
            gpx[x, y] = int(val * (0.35 + 0.65 * xt))
    black = Image.new("RGBA", size, (8, 16, 10, 255))
    img = Image.composite(black, img, grad)

    img = img.convert("RGB")
    img = add_grain(img, amount=6)
    img.save(path, quality=90)


# ---------------------------------------------------------- CARD IMAGES ----
def make_card(path, size, top, bottom, kind):
    w, h = size
    img = vertical_gradient(size, top, bottom).convert("RGBA")
    d = ImageDraw.Draw(img)

    if kind == "islands":
        # sea + limestone dome islands + a small banca boat
        d.rectangle([0, h * 0.62, w, h], fill=lerp(bottom, (10, 20, 22), 0.4))
        for i in range(7):
            ix = w * (0.08 + i * 0.13) + random.uniform(-12, 12)
            base_y = h * 0.62 - random.uniform(0, 10)
            ir = random.uniform(w * 0.06, w * 0.11)
            dome_h = ir * random.uniform(0.9, 1.3)
            d.ellipse([ix - ir, base_y - dome_h, ix + ir, base_y + ir * 0.3],
                      fill=lerp(bottom, (5, 10, 12), 0.75))
        # boat
        bx, by = w * 0.66, h * 0.70
        d.polygon([(bx - 40, by), (bx + 40, by), (bx + 26, by + 12), (bx - 26, by + 12)],
                   fill=(20, 20, 20, 255))
        d.line([(bx, by), (bx, by - 34)], fill=(20, 20, 20, 255), width=3)
        d.polygon([(bx, by - 34), (bx, by - 6), (bx + 20, by - 10)], fill=(235, 235, 225, 255))
        # sun glow
        draw_sun(img, (w * 0.78, h * 0.20), w * 0.14, (255, 226, 170, 150))

    elif kind == "lighthouse":
        # cliff
        d.polygon([(0, h), (0, h * 0.66), (w * 0.35, h * 0.58), (w * 0.55, h * 0.72), (w, h * 0.60), (w, h)],
                   fill=lerp(bottom, (20, 14, 10), 0.55))
        # lighthouse tower
        lx, ly = w * 0.42, h * 0.58
        stripe_w = 16
        for i in range(6):
            yy0 = ly - 20 - i * stripe_w
            yy1 = yy0 - stripe_w
            col = (255, 255, 255, 255) if i % 2 == 0 else (196, 60, 52, 255)
            top_w = 20 - i * 1.4
            d.polygon([(lx - top_w, yy0), (lx + top_w, yy0), (lx + top_w - 1, yy1), (lx - top_w + 1, yy1)],
                       fill=col)
        d.polygon([(lx - 22, ly - 20 - 6 * stripe_w), (lx + 22, ly - 20 - 6 * stripe_w),
                    (lx, ly - 20 - 6 * stripe_w - 26)], fill=(30, 24, 20, 255))
        d.rectangle([lx - 12, ly - 22 - 6 * stripe_w, lx + 12, ly - 20 - 6 * stripe_w],
                     fill=(255, 236, 179, 255))
        # light beam
        beam = Image.new("RGBA", size, (0, 0, 0, 0))
        bd = ImageDraw.Draw(beam)
        bd.polygon([(lx, ly - 20 - 6 * stripe_w), (lx + w * 0.5, ly - 20 - 6 * stripe_w - 90),
                     (lx + w * 0.5, ly - 20 - 6 * stripe_w - 10)], fill=(255, 244, 214, 60))
        beam = beam.filter(ImageFilter.GaussianBlur(6))
        img = Image.alpha_composite(img, beam)
        d = ImageDraw.Draw(img)
        # sea
        d.rectangle([0, h * 0.80, w, h], fill=lerp(bottom, (8, 10, 18), 0.5))
        draw_sun(img, (w * 0.80, h * 0.30), w * 0.16, (255, 195, 140, 160))

    elif kind == "hotspring":
        # tree line
        d.rectangle([0, h * 0.55, w, h], fill=lerp(bottom, (10, 22, 14), 0.35))
        for i in range(9):
            tx = w * (i / 8)
            th = random.uniform(h * 0.10, h * 0.22)
            d.polygon([(tx, h * 0.55), (tx + w * 0.05, h * 0.55 - th), (tx + w * 0.10, h * 0.55)],
                       fill=lerp(bottom, (6, 16, 10), 0.6))
        # pool
        d.ellipse([w * 0.10, h * 0.66, w * 0.90, h * 0.95], fill=lerp(bottom, (60, 150, 150), 0.35))
        d.ellipse([w * 0.16, h * 0.70, w * 0.84, h * 0.90], fill=lerp(bottom, (110, 195, 190), 0.30))
        # steam wisps
        steam = Image.new("RGBA", size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(steam)
        for i in range(5):
            sx = w * (0.28 + i * 0.11)
            sy = h * 0.62
            sd.ellipse([sx - 14, sy - 70, sx + 14, sy], fill=(255, 255, 255, 55))
        steam = steam.filter(ImageFilter.GaussianBlur(14))
        img = Image.alpha_composite(img, steam)

    elif kind == "heritage":
        # stylised heritage church / bell-tower silhouette (Pangasinan basilica nod)
        cx, base = w * 0.5, h * 0.72
        d.rectangle([cx - 70, base - 140, cx + 70, base], fill=lerp(top, (30, 22, 14), 0.7))
        d.polygon([(cx - 80, base - 140), (cx + 80, base - 140), (cx, base - 200)],
                   fill=lerp(top, (24, 17, 10), 0.75))
        d.rectangle([cx - 100, base - 90, cx - 70, base], fill=lerp(top, (30, 22, 14), 0.7))
        d.rectangle([cx + 70, base - 90, cx + 100, base], fill=lerp(top, (30, 22, 14), 0.7))
        d.polygon([(cx - 100, base - 90), (cx - 70, base - 90), (cx - 85, base - 130)],
                   fill=lerp(top, (24, 17, 10), 0.75))
        d.polygon([(cx + 70, base - 90), (cx + 100, base - 90), (cx + 85, base - 130)],
                   fill=lerp(top, (24, 17, 10), 0.75))
        d.rectangle([cx - 10, base - 60, cx + 10, base], fill=lerp(top, (60, 42, 24), 0.8))
        d.rectangle([0, base, w, h], fill=lerp(bottom, (18, 24, 18), 0.4))
        draw_sun(img, (w * 0.78, h * 0.18), w * 0.13, (255, 225, 170, 150))

    mist = add_mist(d, size, h * 0.58, (255, 255, 255), opacity=25, height=60)
    img = Image.alpha_composite(img, mist)
    img = img.convert("RGB")
    img = add_grain(img, amount=6)
    img.save(path, quality=88)


if __name__ == "__main__":
    import os
    out = os.path.join(os.path.dirname(__file__), "..", "public", "images")
    os.makedirs(out, exist_ok=True)

    make_hero(os.path.join(out, "hero-pangasinan.jpg"))
    make_card(os.path.join(out, "hundred-islands.jpg"), (900, 1100), (94, 158, 170), (18, 46, 58), "islands")
    make_card(os.path.join(out, "bolinao-lighthouse.jpg"), (900, 1100), (214, 150, 100), (58, 34, 30), "lighthouse")
    make_card(os.path.join(out, "balungao-hotspring.jpg"), (900, 1100), (120, 168, 120), (24, 46, 30), "hotspring")
    make_card(os.path.join(out, "about-heritage.jpg"), (1000, 1200), (222, 205, 173), (86, 66, 45), "heritage")
    print("done")
