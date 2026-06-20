import time, os
from playwright.sync_api import sync_playwright
URL="http://localhost:3210/v/blueprint"
OUT=os.path.dirname(os.path.abspath(__file__))
def P(name): return os.path.join(OUT, name)

def run():
    with sync_playwright() as p:
        b=p.chromium.launch(channel="chrome")
        # ---- DESKTOP, reduced-motion, NO scroll = the static/PDF judge ----
        d=b.new_page(viewport={"width":1440,"height":900},device_scale_factor=2,reduced_motion="reduce")
        d.goto(URL,wait_until="networkidle",timeout=60000); d.wait_for_timeout(1500)
        d.screenshot(path=P("r2_desktop_hero.png"))
        d.screenshot(path=P("r2_desktop_STATIC_full.png"),full_page=True)
        for sid in ["proof","how","about"]:
            el=d.query_selector(f"#{sid}"); el.scroll_into_view_if_needed(); d.wait_for_timeout(400)
            el.screenshot(path=P(f"r2_sec_{sid}.png"))
        d.close()
        # ---- MOBILE, reduced-motion, NO scroll = void test ----
        m=b.new_page(viewport={"width":390,"height":844},device_scale_factor=2,reduced_motion="reduce")
        m.goto(URL,wait_until="networkidle",timeout=60000); m.wait_for_timeout(1500)
        # hide fixed els so full_page stitch doesn't duplicate them
        m.add_style_tag(content="header,.bp-nav-fb,[class*='fixed']{position:absolute!important}")
        m.wait_for_timeout(300)
        m.screenshot(path=P("r2_mobile_STATIC_full.png"),full_page=True)
        # per-section proof of content on mobile
        for sid in ["trust","how","stack","proof","about","convert"]:
            el=m.query_selector(f"#{sid}")
            if el:
                el.scroll_into_view_if_needed(); m.wait_for_timeout(350)
                el.screenshot(path=P(f"r2_m_{sid}.png"))
        m.close()
        b.close()
    print("R2 capture done ->", OUT)

for i in range(30):
    try: run(); break
    except Exception as e:
        if i==29: print("FAIL",e)
        time.sleep(2)
