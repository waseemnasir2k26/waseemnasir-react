import time, sys
from playwright.sync_api import sync_playwright

URL = "http://localhost:3210/v/blueprint"
OUT = r"C:\Users\info\Downloads"

def shot():
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome")
        # desktop
        pg = b.new_page(viewport={"width":1440,"height":900}, device_scale_factor=2)
        pg.goto(URL, wait_until="networkidle", timeout=60000)
        pg.wait_for_timeout(1800)
        pg.screenshot(path=OUT+r"\_bp_desktop_hero.png")
        pg.screenshot(path=OUT+r"\_bp_desktop_full.png", full_page=True)
        pg.close()
        # mobile
        m = b.new_page(viewport={"width":390,"height":844}, device_scale_factor=2)
        m.goto(URL, wait_until="networkidle", timeout=60000)
        m.wait_for_timeout(1500)
        m.screenshot(path=OUT+r"\_bp_mobile_full.png", full_page=True)
        m.close()
        b.close()
    print("shots done")

# retry until server is up
for i in range(30):
    try:
        shot(); break
    except Exception as e:
        if i==29:
            print("FAIL", e); sys.exit(1)
        time.sleep(2)
