import time
from playwright.sync_api import sync_playwright
URL="http://localhost:3210/v/blueprint"; OUT=r"C:\Users\info\Downloads"
def run():
    with sync_playwright() as p:
        b=p.chromium.launch(channel="chrome")
        # NO-SCROLL full page (simulates static/PDF judge) — reduced motion to be strict
        pg=b.new_page(viewport={"width":1440,"height":900},device_scale_factor=2,reduced_motion="reduce")
        pg.goto(URL,wait_until="networkidle",timeout=60000); pg.wait_for_timeout(1500)
        pg.screenshot(path=OUT+r"\_bp_STATIC_full.png",full_page=True)
        # also emulate print media
        pg.emulate_media(media="print"); pg.wait_for_timeout(300)
        pg.screenshot(path=OUT+r"\_bp_PRINT_full.png",full_page=True)
        b.close()
    print("static shots ok")
for i in range(30):
    try: run(); break
    except Exception as e:
        if i==29: print("FAIL",e)
        time.sleep(2)
