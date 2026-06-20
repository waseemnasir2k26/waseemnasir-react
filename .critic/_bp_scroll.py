from playwright.sync_api import sync_playwright
URL="http://localhost:3210/v/blueprint"; OUT=r"C:\Users\info\Downloads"
with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome")
    pg=b.new_page(viewport={"width":1440,"height":900},device_scale_factor=2)
    pg.goto(URL,wait_until="networkidle",timeout=60000)
    # scroll through to trigger whileInView, settle, then capture each section by id
    for sid in ["trust","how","stack","proof","about","convert"]:
        pg.eval_on_selector(f"#{sid}","el=>el.scrollIntoView({block:'center'})")
        pg.wait_for_timeout(900)
    # now scroll back top->bottom slowly and full-page shot
    pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(400)
    total=pg.evaluate("document.body.scrollHeight")
    step=700; y=0
    while y<total:
        pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(250); y+=step
    pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(600)
    pg.screenshot(path=OUT+r"\_bp_desktop_full2.png",full_page=True)
    # individual section shots
    for sid in ["how","proof","about"]:
        el=pg.query_selector(f"#{sid}")
        el.scroll_into_view_if_needed(); pg.wait_for_timeout(500)
        el.screenshot(path=OUT+rf"\_bp_sec_{sid}.png")
    b.close()
print("ok")
