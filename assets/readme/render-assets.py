"""Regenerate the GitHub-safe hero GIF and raster icons from local artwork."""

import json
from pathlib import Path

from PIL import Image, ImageDraw


HERE = Path(__file__).resolve().parent
PUBLIC = HERE.parents[1] / "public"


def hero_gif():
    spec = json.loads((HERE / "hero-motion.json").read_text(encoding="utf-8"))
    base = Image.open(HERE / "hero-static.png").convert("RGBA")
    fps, duration = spec["fps"], spec["duration"]
    count = round(fps * duration)
    last_frame_time = (count - 1) / fps
    sample = base.copy()
    for light in spec["lights"]:
        overlay = Image.new("RGBA", base.size)
        draw = ImageDraw.Draw(overlay)
        x, y = light["x"], light["y"]
        for radius, alpha in ((34, 7), (22, 11), (12, 20), (5, 80)):
            draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=(249, 211, 140, alpha))
        sample.alpha_composite(overlay)
    palette = sample.convert("RGB").quantize(colors=192)
    frames = []
    for index in range(count):
        t = index / fps
        frame = base.copy()
        overlay = Image.new("RGBA", base.size)
        draw = ImageDraw.Draw(overlay)
        for light in spec["lights"]:
            fade_in = max(0.0, min(1.0, (t - light["start"]) / 0.45))
            fade_out = max(0.0, min(1.0, (last_frame_time - t) / (last_frame_time - spec["fade_out_start"])))
            strength = fade_in * fade_out
            if strength <= 0:
                continue
            x, y = light["x"], light["y"]
            for radius, alpha in ((35, 8), (22, 13), (12, 28), (5, 115)):
                draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=(251, 216, 148, round(alpha * strength)))
        frame.alpha_composite(overlay)
        frames.append(frame.convert("RGB").quantize(palette=palette))
    frames[-1] = frames[0].copy()
    frames[0].save(HERE / "hero.gif", save_all=True, append_images=frames[1:], duration=round(1000 / fps), loop=0, optimize=True, disposal=1)


def icons():
    size = 720
    canvas = Image.new("RGB", (size, size), "#24140f")
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((52, 52, 668, 668), outline="#d4b57a", width=17)
    draw.ellipse((81, 81, 639, 639), outline="#957346", width=5)
    for x, y in ((360, 205), (515, 360), (360, 515), (205, 360)):
        draw.ellipse((x-78, y-78, x+78, y+78), outline="#dfc28b", width=16)
    draw.polygon(((360, 260), (460, 360), (360, 460), (260, 360)), fill="#802f24", outline="#e0bc7f")
    draw.polygon(((360, 311), (409, 360), (360, 409), (311, 360)), outline="#e7c98e")
    draw.ellipse((343, 343, 377, 377), fill="#e7c98e")
    canvas.resize((180, 180), Image.Resampling.LANCZOS).save(PUBLIC / "apple-touch-icon.png")
    canvas.resize((32, 32), Image.Resampling.LANCZOS).save(PUBLIC / "favicon-32.png")


if __name__ == "__main__":
    hero_gif()
    icons()
