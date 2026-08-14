// Captures every README screenshot. Run with the project served on :8765.
const { chromium } = require('playwright');
const path = require('path');

const OUT = path.join(__dirname, 'screenshots');
const URL = 'http://127.0.0.1:8765/index.html';
const W = 1440, H = 900, DSF = 1;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function page(browser) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle' });
  return { ctx, p };
}

// Boot is click-skippable and login takes any password, so the desktop is two
// clicks away from a cold load.
async function desktop(browser) {
  const { ctx, p } = await page(browser);
  await sleep(900);
  await p.locator('.boot-root').click();
  await sleep(1300);
  await p.locator('.login-avatar').click();
  await p.waitForSelector('.d-icon', { timeout: 15000 });
  await sleep(900);
  return { ctx, p };
}

// Dock <img>s have pointer-events:none and the rAF magnification loop shifts
// them under the cursor, so converge on the live box before clicking.
async function dockBox(p, alt) {
  const img = p.locator(`.dock-fixed-wrap img[alt="${alt}"]`);
  let box = await img.boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  for (let i = 0; i < 12; i++) {
    await sleep(80);
    box = await img.boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  }
  await sleep(200);
  return img.boundingBox();
}

async function clickDock(p, alt) {
  const box = await dockBox(p, alt);
  await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await sleep(900);
}

async function moveWindow(p, sel, tx, ty) {
  const win = p.locator(sel).first();
  const box = await win.boundingBox();
  const grabX = box.x + box.width / 2, grabY = box.y + 20;
  await p.mouse.move(grabX, grabY);
  await p.mouse.down();
  await p.mouse.move(grabX + (tx - box.x), grabY + (ty - box.y), { steps: 12 });
  await p.mouse.up();
  await sleep(250);
}

(async () => {
  const browser = await chromium.launch();

  // boot.png + login.png
  {
    const { ctx, p } = await page(browser);
    await sleep(2100);
    await p.screenshot({ path: path.join(OUT, 'boot.png') });
    console.log('✓ boot.png');
    await p.locator('.boot-root').click();
    await sleep(1400);
    await p.locator('.login-avatar').hover();
    await sleep(800);
    await p.screenshot({ path: path.join(OUT, 'login.png') });
    console.log('✓ login.png');
    await ctx.close();
  }

  // desktop.png + dock.png + menubar.png
  {
    const { ctx, p } = await desktop(browser);
    await p.mouse.move(W / 2, 260);
    await sleep(500);
    await p.screenshot({ path: path.join(OUT, 'desktop.png') });
    console.log('✓ desktop.png');

    await dockBox(p, 'Projects');
    await sleep(500);
    await p.screenshot({
      path: path.join(OUT, 'dock.png'),
      clip: { x: W / 2 - 400, y: H - 230, width: 800, height: 230 },
    });
    console.log('✓ dock.png');

    await p.mouse.move(W / 2, 400);
    await sleep(400);
    await p.locator('.mb-menu', { hasText: 'View' }).first().click();
    await sleep(350);
    await p.screenshot({ path: path.join(OUT, 'menubar.png'), clip: { x: 0, y: 0, width: 760, height: 280 } });
    console.log('✓ menubar.png');
    await ctx.close();
  }

  // control-center.png
  {
    const { ctx, p } = await desktop(browser);
    await p.locator('[aria-label="Control Center"]').click();
    await sleep(600);
    await p.screenshot({ path: path.join(OUT, 'control-center.png'), clip: { x: W - 520, y: 0, width: 520, height: 400 } });
    console.log('✓ control-center.png');
    await ctx.close();
  }

  // spotlight.png
  {
    const { ctx, p } = await desktop(browser);
    await clickDock(p, 'Projects');
    await p.screenshot({ path: path.join(OUT, 'spotlight.png') });
    console.log('✓ spotlight.png');
    await ctx.close();
  }

  // finder.png — the project browser
  {
    const { ctx, p } = await desktop(browser);
    await p.locator('.d-icon', { hasText: 'cub3D' }).first().dblclick();
    await sleep(1000);
    await moveWindow(p, '.win-finder', 250, 110);
    await p.mouse.move(W / 2, 300);
    await sleep(500);
    await p.screenshot({ path: path.join(OUT, 'finder.png') });
    console.log('✓ finder.png');
    await ctx.close();
  }

  // terminal.png
  {
    const { ctx, p } = await desktop(browser);
    await clickDock(p, 'Terminal');
    await sleep(2600);                       // let it auto-type `help`
    await p.locator('.term-input').fill('stack');
    await p.keyboard.press('Enter');
    await sleep(700);
    await moveWindow(p, '.win-terminal', 370, 150);
    await p.mouse.move(W / 2, 200);
    await sleep(500);
    await p.screenshot({ path: path.join(OUT, 'terminal.png') });
    console.log('✓ terminal.png');
    await ctx.close();
  }

  // windows.png — several windows, focus states
  {
    const { ctx, p } = await desktop(browser);
    await p.locator('.d-icon', { hasText: 'Quanta' }).first().dblclick();
    await sleep(900);
    await moveWindow(p, '.win-finder', 40, 100);
    await clickDock(p, 'Terminal');
    await moveWindow(p, '.win-terminal', 700, 420);
    await clickDock(p, 'About');
    await moveWindow(p, '.win-about', 880, 90);
    await p.mouse.move(W / 2, 70);
    await sleep(600);
    await p.screenshot({ path: path.join(OUT, 'windows.png') });
    console.log('✓ windows.png');
    await ctx.close();
  }

  await browser.close();
  console.log('done');
})();
