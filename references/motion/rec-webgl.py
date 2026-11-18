import sys, asyncio
from playwright.async_api import async_playwright

out = sys.argv[1]
SITES = {
    "lando": "https://landonorris.com",
    "messenger": "https://messenger.abeto.co",
    "oryzo": "https://oryzo.ai",
    "igloo": "https://www.igloo.inc",
    "lusion": "https://lusion.co",
    "zentry": "https://zentry.com",
}
ARGS = ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist",
        "--autoplay-policy=no-user-gesture-required"]


async def one(pw, k, u):
    b = await pw.chromium.launch(args=ARGS)
    ctx = await b.new_context(viewport={"width": 1280, "height": 800},
                              record_video_dir=f"{out}/{k}",
                              record_video_size={"width": 1280, "height": 800})
    p = await ctx.new_page()
    try:
        await p.goto(u, wait_until="load", timeout=90000)
    except Exception as e:
        print(k, "goto", type(e).__name__)
    try:
        await p.wait_for_load_state("networkidle", timeout=60000)
    except Exception:
        print(k, "idle timeout")
    await p.wait_for_timeout(12000)
    await p.mouse.move(640, 400)
    try:
        await p.mouse.click(640, 400)
    except Exception:
        pass
    await p.wait_for_timeout(3000)
    for i in range(22):
        await p.mouse.wheel(0, 250)
        await p.mouse.move(200 + i * 40, 250 + (i % 4) * 90, steps=8)
        await p.wait_for_timeout(700)
    await p.wait_for_timeout(1500)
    await ctx.close()
    await b.close()
    print(k, "ok", flush=True)


async def main():
    async with async_playwright() as pw:
        for k, u in SITES.items():
            await one(pw, k, u)

asyncio.run(main())
