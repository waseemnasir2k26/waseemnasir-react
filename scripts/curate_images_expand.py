import os
from PIL import Image, ImageOps

SRC = r"C:\Users\info\OneDrive\Desktop\GITHUB\WASEEM IMAGES\PROFESSIONAL"
DST = r"C:\Users\info\OneDrive\Desktop\GITHUB\waseemnasir-react\public\img\pro"
MAX = 1700
Q = 82

# 30 ADDITIONAL curated images (not in the original 54). Picked for:
# strong portraits, sharp founder-at-laptop, striking travel/scenery landscapes
# (every good landscape kept for full-bleed panels), a few EVENT social proof.
NEW = [
    # CAFE-WORK / founder-at-laptop (Bali nomad set)
    "BALI-2026-05-06-cafe-arch-working-smile.JPG",
    "BALI-2026-05-06-cafe-arch-builder-portrait.JPG",
    "BALI-2026-05-12-poolside-nomad-laptop.JPG",
    "BALI-2026-05-13-blue-polo-phone-work.JPG",
    "LIFESTYLE-2026-06-09-cafe-couch-latte-cookies-smile.jpg",   # landscape
    "LIFESTYLE-behind-cafe-counter-blue-wall-smiling.jpg",
    "LIFESTYLE-2025-08-05-coffee-cup-raise-bamboo-cafe.jpg",
    # PORTRAIT (best additional)
    "PORTRAIT-2025-08-14-sunglasses-headphones-clifftop-ocean-view.jpg",  # landscape full-bleed
    "PORTRAIT-2026-05-18-window-seat-sunglasses-facing-camera-relaxed.jpg",
    "PORTRAIT-2026-05-24-aframe-villas-smile-blue-polo.jpg",
    "PORTRAIT-2026-05-24-profile-sunglasses-jungle-ridge.jpg",
    "PORTRAIT-2026-05-24-river-rock-smile-palms-sunglasses.jpg",
    "PORTRAIT-2026-05-18-standing-full-body-black-kurta-poster-wall.jpg",
    "PORTRAIT-lakefront-railing-adidas-hoodie-cap.jpg",
    "PORTRAIT-mural-closeup-cream-relaxed-tee.jpg",
    "PORTRAIT-snow-portrait-beanie-adidas-front-smile.jpg",
    "PORTRAIT-2026-03-29-smiling-hoodie-selfie-misty-valley.jpg",
    "PORTRAIT-2026-05-07-garden-stool-striped-shirt-tropical-greenery.jpg",
    # TRAVEL / SCENERY (landscapes prioritized for full-bleed/horizontal panels)
    "TRAVEL-2025-05-17-beach-standing-smile-moody-sky.jpg",
    "TRAVEL-2025-05-31-broken-beach-arch-selfie-foliage.jpg",   # landscape
    "TRAVEL-2025-05-31-cliff-bucket-hat-crossbody-ocean.jpg",
    "TRAVEL-2026-03-27-khyber-pakhtunkhwa-welcome-arch-backpack.jpg",
    "TRAVEL-2026-03-29-trail-selfie-backpack-mountain-sky.jpg",
    "TRAVEL-2026-05-24-boulder-crosslegged-river-wide.jpg",
    "TRAVEL-2026-05-24-jungle-rail-lean-sunglasses-candid.jpg",
    "TRAVEL-sitting-roadside-barrier-mountain-valley.jpg",
    "TRAVEL-wheat-field-shalwar-kameez-standing.jpg",
    "TRAVEL-island-boat-thailand-hat-shades.jpg",               # landscape
    # EVENT (social proof)
    "EVENT-wedding-portrait-marigold-backdrop-sherwani.jpg",
    "EVENT-black-sherwani-yellow-roses.jpg",                    # landscape
]

os.makedirs(DST, exist_ok=True)
ok = 0
miss = []
added_bytes = 0
for name in NEW:
    sp = os.path.join(SRC, name)
    if not os.path.exists(sp):
        miss.append(name + " (NOT FOUND)")
        continue
    # normalize output extension to .jpg (some sources are .JPG)
    base = os.path.splitext(name)[0]
    out_name = base + ".jpg"
    dp = os.path.join(DST, out_name)
    try:
        im = Image.open(sp)
        im = ImageOps.exif_transpose(im).convert("RGB")
        w, h = im.size
        scale = min(1.0, MAX / max(w, h))
        if scale < 1.0:
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        im.save(dp, "JPEG", quality=Q, optimize=True, progressive=True)
        added_bytes += os.path.getsize(dp)
        ok += 1
    except Exception as e:
        miss.append(name + " ERR:" + str(e))

print("ADDED", ok, "of", len(NEW))
print("ADDED MB:", round(added_bytes / 1048576, 2))
if miss:
    print("MISSING/ERR:")
    for m in miss:
        print("  ", m)

# Rebuild manifest from EVERY .jpg currently in DST (old + new), sorted, with dims.
entries = []
for f in sorted(os.listdir(DST)):
    if not f.lower().endswith(".jpg"):
        continue
    try:
        im = Image.open(os.path.join(DST, f))
        w, h = im.size
        orient = "portrait" if h > w else ("landscape" if w > h else "square")
        entries.append((f, w, h, orient))
    except Exception as e:
        miss.append(f + " MANIFEST-ERR:" + str(e))

with open(os.path.join(DST, "_manifest.txt"), "w", encoding="utf-8") as f:
    for name, w, h, orient in entries:
        f.write(f"{name}\t{w}x{h}\t{orient}\n")

total = sum(os.path.getsize(os.path.join(DST, f)) for f in os.listdir(DST) if f.lower().endswith(".jpg"))
print("DST TOTAL FILES:", len(entries))
print("DST TOTAL MB:", round(total / 1048576, 1))
print("manifest written:", len(entries), "entries")
