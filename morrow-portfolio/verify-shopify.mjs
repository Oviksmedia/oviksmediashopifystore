import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

// Explicitly exercises only the public demo password and an isolated visitor bag.
// --refined overlays this branch's CSS in the browser; it never uploads the theme.
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.dirname(fileURLToPath(import.meta.url));
const refined = process.argv.includes('--refined');
const base = 'https://oviks-portfolio-demo.myshopify.com';
const evidence = path.join(root, '../docs/preview');
fs.mkdirSync(evidence, {recursive:true});
const browser = await chromium.launch({headless:true});
const context = await browser.newContext({viewport:{width:1440,height:1000}});
if (refined) await context.route('**/morrow-*.css*', async route => {
  const filename = path.basename(new URL(route.request().url()).pathname);
  if (['morrow-premium.css','morrow-shopping.css','morrow-case-study.css'].includes(filename)) {
    await route.fulfill({contentType:'text/css', body:fs.readFileSync(path.join(root, '../shopify-skincare/theme/assets', filename), 'utf8')});
  } else await route.continue();
});
const page = await context.newPage();
const checks = [];
const label = refined ? 'theme-refinement' : 'shopify-live';
async function layout(route, width) {
  await page.setViewportSize({width,height:width === 1440 ? 1000 : 844});
  await page.goto(base + route);
  await page.evaluate(() => document.querySelectorAll('main img').forEach(image => {image.loading = 'eager';}));
  await page.waitForFunction(() => [...document.querySelectorAll('main img')].every(image => image.complete && image.naturalWidth > 0), {timeout:15000});
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  // Collect every baseline defect before reporting failure; branch CSS must pass each check.
  if (refined) assert.equal(overflow, false, `${route} overflow at ${width}`);
  checks.push({route,width,images:'loaded',overflow});
}
try {
  await page.goto(base);
  if (new URL(page.url()).pathname === '/password') {
    await page.getByLabel('Enter store password').fill('suweid');
    await Promise.all([page.waitForURL(url => url.pathname !== '/password'), page.getByRole('button', {name:'Enter',exact:true}).click()]);
  }
  for (const width of [320,390,768,1440]) {
    await layout('/', width);
    if (refined && (width === 390 || width === 1440)) await page.screenshot({path:path.join(evidence, label + '-home-' + width + '.jpg'),type:'jpeg',quality:88,fullPage:true});
    await layout('/collections/the-daily-edit', width);
    await layout('/products/the-daily-cleanser', width);
    assert.equal(await page.getByRole('button',{name:/Add to demo bag/}).isEnabled(), true);
    if (!refined && width === 1440) await page.screenshot({path:path.join(root, 'assets/morrow-shopify-product.jpg'),type:'jpeg',quality:85,fullPage:true});
    if (refined && (width === 390 || width === 1440)) await page.screenshot({path:path.join(evidence, label + '-product-' + width + '.jpg'),type:'jpeg',quality:88,fullPage:true});
  }
  for (const slug of ['the-daily-serum','the-daily-cream']) {
    await layout('/products/'+slug,390);
    assert.equal(await page.getByRole('button',{name:/Add to demo bag/}).isEnabled(), true);
  }
  if (!refined) {
    await layout('/collections/the-daily-edit',1440);
    await page.screenshot({path:path.join(root, 'assets/morrow-shopify-collection.jpg'),type:'jpeg',quality:85,fullPage:true});
  }
  await layout('/products/the-daily-cleanser',390);
  await Promise.all([page.waitForURL('**/cart'),page.getByRole('button',{name:/Add to demo bag/}).click()]);
  assert.match(await page.locator('main').innerText(), /\$28\.00 USD/);
  await page.getByLabel('Quantity',{exact:true}).fill('2');
  await Promise.all([page.waitForNavigation(),page.getByRole('button',{name:/Update bag/}).click()]);
  assert.match(await page.locator('main').innerText(), /\$56\.00 USD/);
  for (const width of [320,390,768,1440]) {
    await layout('/cart',width);
    if (refined && (width === 390 || width === 1440)) await page.screenshot({path:path.join(evidence, label + '-bag-' + width + '.jpg'),type:'jpeg',quality:88,fullPage:true});
  }
  if (!refined) await page.screenshot({path:path.join(root,'assets/morrow-shopify-bag.jpg'),type:'jpeg',quality:85,fullPage:true});
  await Promise.all([page.waitForNavigation(), page.getByRole('link',{name:/Remove The Daily Cleanser/}).click()]);
  assert.match(await page.locator('main').innerText(), /Your bag is waiting/);
  assert.equal(await page.getByRole('button',{name:/Checkout/}).count(), 0);
  const report = {date:'2026-10-03',environment:refined ? 'Shopify visitor session with LOCAL CSS response overlay; no theme uploaded' : 'Existing public Shopify demo, isolated visitor session',checks,bag:'Add cleanser $28, update 2 at $56, remove to empty',password:'accepted',existingDefects:checks.filter(check => check.overflow),limits:'No checkout, fulfillment, real-device or theme-upload validation.'};
  fs.writeFileSync(path.join(evidence, label+'-checks.json'), JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  if (report.existingDefects.length) process.exitCode = 1;
} finally {
  await browser.close();
}
