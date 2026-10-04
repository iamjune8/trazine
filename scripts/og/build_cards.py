"""
Renders the 1200x627 Open Graph share cards (LinkedIn's recommended size) in the
site's editorial style: paper panel with the "Travel Magazine" wordmark on the
left, photo on the right. Prices are never printed on a card — they can be
switched off in admin Settings, and a card can't follow that toggle.

Usage (from the repo root):
    OG_PLAYFAIR_TTF=/path/to/PlayfairDisplay-Regular.ttf python3 scripts/og/build_cards.py

Edit scripts/og/cards.json to add or change a card, bump "version" when the
artwork of an already-shared card changes (LinkedIn caches og:image by URL),
then re-run. It writes the JPGs under public/og/ and the slug lists in
src/data/ogCards.ts; pages fall back to their normal photo for any slug that
has no card.
"""
import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
S = 2  # supersample
W, H = 1200 * S, 627 * S
PANEL_W = 540 * S
PAD_L = 56 * S
TEXT_W = PANEL_W - PAD_L - 52 * S

PAPER = (251, 249, 245)
INK = (23, 20, 15)
INK2 = (59, 53, 44)
BRASS = (169, 122, 43)
BRASS_DEEP = (127, 90, 28)

PLAYFAIR = os.environ.get("OG_PLAYFAIR_TTF", "")
SANS = "/System/Library/Fonts/HelveticaNeue.ttc"
if not Path(PLAYFAIR).is_file():
    sys.exit("Set OG_PLAYFAIR_TTF to a PlayfairDisplay-Regular.ttf file (Google Fonts, OFL).")

TIER_LABEL = {"premium": "Premium Luxury", "easy": "Easy & Affordable"}


def font(path, size, index=0):
    return ImageFont.truetype(path, round(size * S), index=index)


def resolve_photo(value):
    rel = value.lstrip("/") if value.startswith("/") else f"images/catalogue/{value}.jpg"
    path = ROOT / "public" / rel
    if not path.is_file():
        sys.exit(f"Missing photo: {path}")
    return path


NBSP = "\u00a0"


def wrap(draw, text, fnt, width):
    # "&" is bound to its neighbours so a line never starts with a lone "&".
    text = text.replace(" & ", f"{NBSP}&{NBSP}")
    lines, line = [], ""
    for word in text.split(" "):
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=fnt) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return [ln.replace(NBSP, " ") for ln in lines]


def tracked(draw, text, xy, fnt, fill, spacing):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + spacing * S


def render(card, out_path):
    canvas = Image.new("RGB", (W, H), PAPER)
    photo = Image.open(resolve_photo(card["photo"])).convert("RGB")
    scale = max((W - PANEL_W) / photo.width, H / photo.height)
    photo = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
    left = round((photo.width - (W - PANEL_W)) * card.get("fx", 0.5))
    top = round((photo.height - H) * card.get("fy", 0.5))
    canvas.paste(photo.crop((left, top, left + W - PANEL_W, top + H)), (PANEL_W, 0))

    d = ImageDraw.Draw(canvas)
    d.rectangle((PANEL_W - 8 * S, 0, PANEL_W, H), fill=BRASS)
    tracked(d, "Travel Magazine", (PAD_L, 60 * S), font(PLAYFAIR, 40), INK, 0.8)

    eyebrow_y = 166 * S
    tracked(d, card["eyebrow"].upper(), (PAD_L, eyebrow_y), font(SANS, 14, 10), BRASS_DEEP, 3.0)

    top_y, bottom_y = 200 * S, 494 * S
    sub_size, sub_leading, para_gap = 23, 33, 8
    sub_font = font(SANS, sub_size)
    sub_lines = []
    for para in [p for p in card.get("sub", "").split("\n") if p]:
        sub_lines += wrap(d, para, sub_font, TEXT_W) + [None]
    sub_lines = sub_lines[:-1] if sub_lines else []
    sub_h = (
        sum(para_gap * S if ln is None else round(sub_leading * S) for ln in sub_lines) + 18 * S
        if sub_lines
        else 0
    )
    for size in range(60, 33, -2):
        title_font = font(PLAYFAIR, size)
        title_lines = wrap(d, card["title"], title_font, TEXT_W)
        title_h = len(title_lines) * round(size * 1.2 * S)
        fits_width = all(d.textlength(ln, font=title_font) <= TEXT_W for ln in title_lines)
        if fits_width and len(title_lines) <= 4 and top_y + title_h + sub_h <= bottom_y:
            break
    else:
        sys.exit(f"Text does not fit: {card['title']!r}")

    y = top_y
    for line in title_lines:
        d.text((PAD_L, y), line, font=title_font, fill=INK)
        y += round(size * 1.2 * S)
    y += 18 * S
    for line in sub_lines:
        if line is None:
            y += para_gap * S
            continue
        d.text((PAD_L, y), line, font=sub_font, fill=INK2)
        y += round(sub_leading * S)

    d.rectangle((PAD_L, 508 * S, PAD_L + 40 * S, 510 * S), fill=BRASS)
    tracked(d, "TRAVZINE.IN", (PAD_L, 528 * S), font(SANS, 15, 1), BRASS_DEEP, 3.0)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.resize((1200, 627), Image.LANCZOS).save(out_path, "JPEG", quality=88, optimize=True, progressive=True)
    return out_path.stat().st_size // 1024


def main():
    spec = json.loads((ROOT / "scripts/og/cards.json").read_text())
    v = spec["version"]
    out = ROOT / "public/og"
    made = []

    for c in spec["pages"]:
        made.append((f"pages/{c['file']}-{v}.jpg", render(c, out / "pages" / f"{c['file']}-{v}.jpg")))

    for c in spec["destinations"]:
        card = {"eyebrow": TIER_LABEL[c["tier"]], "title": c["name"], "sub": c["tagline"], **{k: c[k] for k in ("photo", "fx", "fy") if k in c}}
        made.append((f"destinations/{c['slug']}-{v}.jpg", render(card, out / "destinations" / f"{c['slug']}-{v}.jpg")))

    for c in spec["packages"]:
        inc = "Flights, stay and sightseeing included." if c["flights"] else "Land package, flights not included."
        card = {"eyebrow": f"Fixed departure · {c['code']}", "title": c["name"], "sub": f"{c['route']}\n{inc}", **{k: c[k] for k in ("photo", "fx", "fy") if k in c}}
        made.append((f"packages/{c['slug']}-{v}.jpg", render(card, out / "packages" / f"{c['slug']}-{v}.jpg")))

    ts = (
        "// Generated by scripts/og/build_cards.py — do not edit by hand.\n"
        "// Slugs that have a share card in public/og/. Anything missing falls back to its normal photo.\n"
        f'export const OG_CARD_VERSION = "{v}";\n\n'
        "export const OG_CARD_SLUGS = {\n"
        f"  destinations: {json.dumps([c['slug'] for c in spec['destinations']])},\n"
        f"  packages: {json.dumps([c['slug'] for c in spec['packages']])},\n"
        "} as const;\n"
    )
    (ROOT / "src/data/ogCards.ts").write_text(ts)
    for name, kb in made:
        print(f"{name:55s} {kb} KB")


if __name__ == "__main__":
    main()
