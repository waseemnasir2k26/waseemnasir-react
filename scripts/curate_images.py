import os
from PIL import Image, ImageOps

SRC = r"C:\Users\info\OneDrive\Desktop\GITHUB\WASEEM IMAGES\PROFESSIONAL"
DST = r"C:\Users\info\OneDrive\Desktop\GITHUB\waseemnasir-react\public\img\pro"
MAX = 1700
Q = 82

CURATED = [
    # CAFE-WORK (founder-at-laptop) — all 18
    "CAFE-WORK-2024-06-13-hotel-cafe-selfie-blue-polo-coffee.jpg",
    "CAFE-WORK-2025-03-30-glass-cafe-rattan-chair-cream-tee.jpg",
    "CAFE-WORK-2025-08-15-couch-laptop-brick-wall-cafe-candid.jpg",
    "CAFE-WORK-2026-02-14-night-rooftop-cafe-phone-city-lights.jpg",
    "CAFE-WORK-2026-02-27-olive-track-jacket-coffee-laptop-tea-sign.jpg",
    "CAFE-WORK-2026-02-27-smiling-headphones-neon-tea-sign-closeup.jpg",
    "CAFE-WORK-2026-03-29-closeup-laptop-sunglasses-valley-view.jpg",
    "CAFE-WORK-2026-03-29-rooftop-cafe-laptop-mountain-clouds.jpg",
    "CAFE-WORK-2026-03-30-dual-laptop-analytics-dashboard-coffee.jpg",
    "CAFE-WORK-2026-05-22-bali-terrace-typing-laptop-latte-sunglasses.jpg",
    "CAFE-WORK-2026-05-22-blue-hour-peace-sign-laptop-coconut.jpg",
    "CAFE-WORK-2026-05-22-rooftop-cafe-laptop-rainbow-mug-smile.jpg",
    "CAFE-WORK-2026-06-01-rooftop-laptop-dragonfruit-smoothie-smile.jpg",
    "CAFE-WORK-2026-06-01-rooftop-laptop-orange-juice-foreground.jpg",
    "CAFE-WORK-2026-06-02-night-beach-cafe-phone-laptop-stare.jpg",
    "CAFE-WORK-2026-06-02-night-cafe-typing-backlit-keyboard-candid.jpg",
    "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-phone-focus.jpg",
    "CAFE-WORK-2026-06-05-garden-cafe-blue-polo-smile-laptop.jpg",
    # WORK (with clients / coworking) — 5
    "WORK-2025-06-10-coworking-desk-focused-phone-candid.jpg",
    "WORK-2025-08-04-cafe-client-thumbs-up-smiles.jpg",
    "WORK-2025-08-06-night-coworking-team-laptops-selfie.jpg",
    "WORK-2026-05-24-rice-terrace-phone-powerbank-focus.jpg",
    "WORK-packing-gift-basket-laptop-desk.jpg",
    # PORTRAIT — 12 best
    "PORTRAIT-2026-05-18-prince-coat-sunglasses-phone-table.jpg",
    "PORTRAIT-2026-05-18-black-prince-coat-balcony-rail-sunglasses.jpg",
    "PORTRAIT-2026-03-29-beige-tracksuit-pockets-glass-building.jpg",
    "PORTRAIT-2026-05-18-arms-crossed-sunglasses-confident-table-pose.jpg",
    "PORTRAIT-2026-02-15-balcony-gray-adidas-soft-smile.jpg",
    "PORTRAIT-stool-portrait-navy-polo-framed-art.jpg",
    "PORTRAIT-travertine-wall-sky-headshot-flowers.jpg",
    "PORTRAIT-2026-05-08-black-kurta-soft-smile-wood-interior.jpg",
    "PORTRAIT-2025-05-08-cafe-table-arms-crossed-pensive.jpg",
    "PORTRAIT-restaurant-closeup-glasses-beige-shirt.jpg",
    "PORTRAIT-2026-05-24-rice-field-smile-palms-mountain.jpg",
    "PORTRAIT-mural-halfbody-smile-watch-raised.jpg",
    # TRAVEL — 10 (scenery + personality)
    "TRAVEL-2025-05-31-nusa-penida-arms-spread-cliffs.jpg",
    "TRAVEL-2026-03-27-tan-knit-sweater-mountain-ridge-portrait.jpg",
    "TRAVEL-2026-03-27-hilltop-backpack-sunglasses-city-vista.jpg",
    "TRAVEL-2025-05-17-beach-arms-spread-laughing-camera.jpg",
    "TRAVEL-2026-05-24-jungle-bridge-standing-sunglasses-front.jpg",
    "TRAVEL-google-office-sign-cream-outfit.jpg",
    "TRAVEL-2026-03-27-motorbike-helmet-backpack-mountain-road.jpg",
    "TRAVEL-sentosa-sign-hedge-cream-set.jpg",
    "TRAVEL-2025-03-28-canggu-beach-profile-cap-arms-crossed.jpg",
    "TRAVEL-2026-05-24-heart-frame-viewpoint-seated-sunglasses.jpg",
    # LIFESTYLE — 6
    "LIFESTYLE-2026-05-18-neon-limit-quote-sign-standing-black-outfit.jpg",
    "LIFESTYLE-2026-06-09-acoustic-guitar-smile-white-cafe.jpg",
    "LIFESTYLE-cafe-counter-espresso-machine-facing-camera.jpg",
    "LIFESTYLE-2026-03-29-night-cafe-armchair-relaxed-gaze.jpg",
    "LIFESTYLE-2026-05-18-black-bandhgala-sunglasses-phone-cafe-table.jpg",
    "LIFESTYLE-2025-08-08-rattan-chair-headphones-pavilion-relaxed.jpg",
    # EVENT — 2 (networking proof)
    "EVENT-expo-booth-navy-polo-chandelier-hall.jpg",
    "EVENT-2026-05-25-bali-cafe-coworking-group-meetup.jpg",
    # SCENERY — 1
    "SCENERY-2026-05-24-green-valley-hills-cloud-pano.jpg",
]

os.makedirs(DST, exist_ok=True)
ok = 0
miss = []
manifest = []
for name in CURATED:
    sp = os.path.join(SRC, name)
    if not os.path.exists(sp):
        miss.append(name)
        continue
    dp = os.path.join(DST, name)
    try:
        im = Image.open(sp)
        im = ImageOps.exif_transpose(im).convert("RGB")
        w, h = im.size
        scale = min(1.0, MAX / max(w, h))
        if scale < 1.0:
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        im.save(dp, "JPEG", quality=Q, optimize=True, progressive=True)
        ok += 1
        nw, nh = im.size
        manifest.append((name, nw, nh))
    except Exception as e:
        miss.append(name + " ERR:" + str(e))

print("COPIED", ok, "of", len(CURATED))
if miss:
    print("MISSING/ERR:")
    for m in miss:
        print("  ", m)
total = sum(os.path.getsize(os.path.join(DST, f)) for f in os.listdir(DST))
print("DST TOTAL MB:", round(total / 1048576, 1))
# write a manifest the build agents can read
with open(os.path.join(DST, "_manifest.txt"), "w", encoding="utf-8") as f:
    for name, w, h in manifest:
        orient = "portrait" if h > w else ("landscape" if w > h else "square")
        f.write(f"{name}\t{w}x{h}\t{orient}\n")
print("manifest written:", len(manifest), "entries")
