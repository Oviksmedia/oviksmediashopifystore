import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

// Optional browser check: use an existing Playwright installation, no packages installed.
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.dirname(fileURLToPath(import.meta.url));
const evidence = path.join(root, '../docs/preview');
fs.mkdirSync(evidence, {recursive: true});
const base = process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:4391';
const browser = await chromium.launch({headless: true});
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {if (message.type() === 'error') errors.push(message.text());});
const results = [];
try {
  for (const route of ['index.html', 'morrow.html', 'rift.html', 'rift-demo.html']) {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({width, height:width === 1440 ? 1000 : 844});
      const response = await page.goto(`${base}/${route}`);
      assert.equal(response.status(), 200, route);
      // Force requested assets for the integrity check; visual checks retain authored lazy loading.
      await page.evaluate(() => {document.querySelectorAll('img').forEach(image => {image.loading = 'eager';});});
      await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0), {timeout:10000});
      const layout = await page.evaluate(() => ({
        overflow:document.documentElement.scrollWidth > window.innerWidth,
        headings:document.querySelectorAll('h1').length,
        missingAlt:[...document.images].filter(image => !image.hasAttribute('alt')).length
      }));
      assert.equal(layout.overflow, false, `${route} overflows at ${width}`);
      assert.equal(layout.headings, 1, `${route} must have one h1`);
      assert.equal(layout.missingAlt, 0, `${route} missing image descriptions`);
      if (width === 390 || width === 1440) await page.screenshot({path:path.join(evidence, route.replace('.html','') + (width === 390 ? '-mobile' : '-desktop') + '.jpg'), type:'jpeg', quality:88, fullPage:true});
      results.push({route, width, images:'loaded', overflow:false});
    }
  }
  // Follow every local link/resource from the generated HTML in the running server.
  for (const route of ['index.html', 'morrow.html', 'rift.html', 'rift-demo.html']) {
    await page.goto(`${base}/${route}`);
    const urls = await page.locator('a[href],link[href],script[src],img[src]').evaluateAll(elements => elements.map(element => element.href || element.src).filter(url => url.startsWith(location.origin)));
    for (const url of new Set(urls)) assert.equal((await context.request.get(url)).status(), 200, `Broken resource: ${url}`);
  }
  await page.goto(`${base}/rift-demo.html`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', {name:/Demo bag/}).click();
  assert.match(await page.locator('#rift-bag-items').innerText(), /empty/);
  await page.keyboard.press('Escape');
  await page.getByRole('button', {name:/Add to demo bag/}).click();
  assert.match(await page.locator('#rift-product-error').innerText(), /Choose a size/);
  await page.getByRole('radio', {name:'M', exact:true}).check();
  await page.getByRole('button', {name:/Add to demo bag/}).click();
  assert.equal(await page.locator('#rift-subtotal').innerText(), '£95');
  await page.getByRole('button', {name:'Increase size M quantity'}).click();
  assert.equal(await page.locator('#rift-subtotal').innerText(), '£190');
  await page.getByRole('button', {name:'Decrease size M quantity'}).click();
  assert.equal(await page.locator('#rift-subtotal').innerText(), '£95');
  await page.keyboard.press('Escape');
  await page.reload();
  await page.getByRole('button', {name:/Demo bag/}).click();
  assert.equal(await page.locator('#rift-subtotal').innerText(), '£95');
  for (let i = 0; i < 9; i++) await page.getByRole('button', {name:'Increase size M quantity'}).click();
  assert.equal(await page.locator('#rift-subtotal').innerText(), '£950');
  assert.equal(await page.getByRole('button', {name:'Increase size M quantity'}).isDisabled(), true);
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.querySelector('#rift-bag').contains(document.activeElement)), true, 'Focus must stay in open bag');
  }
  await page.getByRole('button', {name:'Remove size M jersey'}).click();
  assert.equal(await page.locator('#rift-subtotal').innerText(), '£0');
  await page.keyboard.press('Escape');
  await page.evaluate(() => localStorage.setItem('oviks-rift-concept-bag-v1', '{invalid'));
  await page.reload();
  await page.getByRole('button', {name:/Demo bag/}).click();
  assert.equal(await page.locator('#rift-subtotal').innerText(), '£0');
  assert.match(await page.locator('#rift-storage-note').innerText(), /could not be read/);
  await page.keyboard.press('Escape');
  await page.goto(`${base}/index.html`);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip-link').evaluate(link => document.activeElement === link), true);
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  assert.deepEqual(errors, [], 'Browser console/page errors');
  const report = {date:'2026-10-03', environment:'Local Chromium preview', layouts:results, resources:'all local links and assets return HTTP 200', bag:'empty, size validation, add, update, persistence, maximum, remove, corrupt storage', keyboard:'skip link, dialog focus containment, Escape', reducedMotion:'checked', errors, limits:'No real-device, Netlify deployment or Shopify theme-upload verification.'};
  fs.writeFileSync(path.join(evidence, 'local-checks.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
