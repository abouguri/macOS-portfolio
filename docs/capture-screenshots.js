// Captures every README screenshot. Run with the project served on :8765.
const { chromium } = require('playwright');
const path = require('path');

const OUT = path.join(__dirname, 'screenshots');
const URL = 'http://127.0.0.1:8765/index.html';
const W = 1440, H = 900, DSF = 1;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fresh(browser) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !document.querySelector('.intro-root'), { timeout: 15000 });
  await page.waitForSelector('.d-icon', { timeout: 15000 });
  await sleep(600);
  return { ctx, page };
}

// Dock <img>s have pointer-events:none and the rAF magnification loop shifts
// them under the cursor, so converge on the live box before clicking.
async function dockBox(page, alt) {
  const img = page.locator(`img[alt="${alt}"]`);
  let box = await img.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 12; i++) {
    await sleep(80);
    box = await img.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  }
  await sleep(200);
  return img.boundingBox();
}

async function clickDock(page, alt) {
  const box = await dockBox(page, alt);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await sleep(700);
}

async function moveWindow(page, title, tx, ty) {
  const win = page.locator('.win-root', { has: page.locator('.win-title', { hasText: title }) }).first();
  const box = await win.boundingBox();
  const grabX = box.x + box.width / 2, grabY = box.y + 20;
  await page.mouse.move(grabX, grabY);
  await page.mouse.down();
  await page.mouse.move(grabX + (tx - box.x), grabY + (ty - box.y), { steps: 12 });
  await page.mouse.up();
  await sleep(250);
}

async function spotlightOpen(page, query) {
  await page.keyboard.press('Control+k');
  await sleep(350);
  await page.keyboard.type(query, { delay: 60 });
  await sleep(400);
  await page.keyboard.press('Enter');
  await sleep(600);
}

(async () => {
  const browser = await chromium.launch();

  // desktop.png + dock.png + menubar.png
  {
    const { ctx, page } = await fresh(browser);
    await page.mouse.move(W / 2, 260);
    await sleep(500);
    await page.screenshot({ path: path.join(OUT, 'desktop.png') });
    console.log('✓ desktop.png');

    await dockBox(page, 'Projects');
    await sleep(500);
    await page.screenshot({
      path: path.join(OUT, 'dock.png'),
      clip: { x: W / 2 - 380, y: H - 230, width: 760, height: 230 },
    });
    console.log('✓ dock.png');

    await page.mouse.move(W / 2, 400);
    await sleep(400);
    await page.locator('.mb-menu', { hasText: 'File' }).first().click();
    await sleep(350);
    await page.screenshot({ path: path.join(OUT, 'menubar.png'), clip: { x: 0, y: 0, width: 720, height: 220 } });
    console.log('✓ menubar.png');
    await ctx.close();
  }

  // spotlight.png
  {
    const { ctx, page } = await fresh(browser);
    await clickDock(page, 'Projects');
    await page.screenshot({ path: path.join(OUT, 'spotlight.png') });
    console.log('✓ spotlight.png');
    await ctx.close();
  }

  // project-window.png
  {
    const { ctx, page } = await fresh(browser);
    await page.locator('.d-icon', { hasText: 'Quanta' }).first().dblclick();
    await sleep(700);
    await page.mouse.move(W / 2, 300);
    await sleep(400);
    await page.screenshot({ path: path.join(OUT, 'project-window.png') });
    console.log('✓ project-window.png');
    await ctx.close();
  }

  // windows.png
  {
    const { ctx, page } = await fresh(browser);
    await spotlightOpen(page, 'cub');
    await moveWindow(page, 'cub3D', 50, 110);
    await clickDock(page, 'Contact');
    await moveWindow(page, 'Contact', 905, 90);
    await clickDock(page, 'About');
    await moveWindow(page, 'About', 880, 540);
    await page.mouse.move(W / 2, 80);
    await sleep(600);
    await page.screenshot({ path: path.join(OUT, 'windows.png') });
    console.log('✓ windows.png');
    await ctx.close();
  }

  await browser.close();
  console.log('done');
})();
