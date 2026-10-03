import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

const require = createRequire('C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const playwright = require('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(root, 'evidence');

const results = {
  timestamp: new Date().toISOString(),
  environment: {
    node: process.version,
    playwright: playwright.version || 'bundled',
    browser: 'Chromium'
  },
  tests: [],
  screenshots: []
};

function recordTest(name, passed, details = {}) {
  results.tests.push({ name, passed, details });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}`);
}

async function run() {
  const browser = await playwright.chromium.launch({ headless: true });
  const baseUrl = 'http://127.0.0.1:4401';

  // 1. Viewports test on sable.html and sable-demo.html
  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-320', width: 320, height: 568 },
    { name: 'landscape-568x320', width: 568, height: 320 }
  ];

  for (const pageName of ['sable.html', 'sable-demo.html']) {
    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      page.on('pageerror', err => consoleErrors.push(err.message));

      await page.goto(`${baseUrl}/${pageName}`, { waitUntil: 'networkidle' });

      // Scroll down to trigger lazy loading of images
      await page.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(r => setTimeout(r, 200));
        window.scrollTo(0, 0);
      });

      // Check overflow
      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
      });

      // Check image loading
      const imageStatus = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(img => ({
          src: img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          ok: img.complete && img.naturalWidth > 0
        }));
      });
      const brokenImages = imageStatus.filter(i => !i.ok);

      const pass = !overflow.hasOverflow && consoleErrors.length === 0 && brokenImages.length === 0;
      recordTest(`${pageName} at ${vp.name} (${vp.width}x${vp.height})`, pass, {
        overflow,
        consoleErrors,
        brokenImagesCount: brokenImages.length
      });

      // Capture screenshot
      const shotName = `${pageName.replace('.html', '')}-${vp.name}.png`;
      const shotPath = path.join(evidenceDir, shotName);
      await page.screenshot({ path: shotPath, fullPage: true });
      results.screenshots.push({ name: shotName, viewport: vp });

      await context.close();
    }
  }

  // 2. Interactive Storefront Testing
  console.log('\n--- Starting Interactive Storefront Tests ---');
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.goto(`${baseUrl}/sable-demo.html`, { waitUntil: 'networkidle' });

  // A. Finish Variant Switching
  const initialSrc = await page.evaluate(() => document.getElementById('sable-arc-image').src);
  await page.click('input[value="ink"]');
  const inkSrc = await page.evaluate(() => document.getElementById('sable-arc-image').src);
  const inkCaption = await page.evaluate(() => document.getElementById('sable-image-caption').textContent);
  const inkStatus = await page.evaluate(() => document.querySelector('#sable-arc-form [data-product-status]').textContent);

  const inkPassed = inkSrc.includes('sable-arc-ink.webp') && inkCaption.includes('Ink') && inkStatus.includes('Ink');
  recordTest('The Arc finish switch to Ink', inkPassed, { initialSrc, inkSrc, inkCaption, inkStatus });

  // Capture Ink variant screenshot
  const inkShotPath = path.join(evidenceDir, 'sable-demo-ink-variant-1440.png');
  await page.screenshot({ path: inkShotPath, fullPage: false });
  results.screenshots.push({ name: 'sable-demo-ink-variant-1440.png', description: 'Arc in Ink variant' });

  // B. Material Detail View Switching
  await page.click('button[data-view="detail"]');
  const detailSrc = await page.evaluate(() => document.getElementById('sable-arc-image').src);
  const detailCaption = await page.evaluate(() => document.getElementById('sable-image-caption').textContent);
  const detailAria = await page.evaluate(() => document.querySelector('button[data-view="detail"]').getAttribute('aria-pressed'));

  const detailPassed = detailSrc.includes('sable-detail.webp') && detailAria === 'true';
  recordTest('The Arc gallery switch to Material Detail', detailPassed, { detailSrc, detailCaption, detailAria });

  // Capture Material Detail screenshot
  const detailShotPath = path.join(evidenceDir, 'sable-demo-material-detail-1440.png');
  await page.screenshot({ path: detailShotPath, fullPage: false });
  results.screenshots.push({ name: 'sable-demo-material-detail-1440.png', description: 'Arc material detail macro view' });

  // Switch back to full form
  await page.click('button[data-view="form"]');

  // C. Quantity Validation
  await page.fill('#sable-arc-qty', '0');
  await page.click('#sable-arc-form button[type="submit"]');
  const zeroValidationMsg = await page.evaluate(() => document.querySelector('#sable-arc-form [data-product-status]').textContent);
  const bagStillClosed = await page.evaluate(() => !document.getElementById('sable-bag').open);
  recordTest('Quantity validation rejects 0', bagStillClosed && zeroValidationMsg.length > 0, { zeroValidationMsg });

  // D. Add to Bag & Dialog Accessibility
  await page.fill('#sable-arc-qty', '1');
  await page.click('#sable-arc-form button[type="submit"]');

  const bagOpened = await page.evaluate(() => document.getElementById('sable-bag').open);
  const focusedElementId = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  const liveStatus = await page.evaluate(() => document.getElementById('sable-bag-status').textContent);
  const bagTotal = await page.evaluate(() => document.getElementById('sable-total').textContent);
  const bagCount = await page.evaluate(() => document.getElementById('sable-count').textContent);

  const addPassed = bagOpened && focusedElementId === 'sable-bag-close' && liveStatus.includes('added') && bagTotal === '$280.00' && bagCount === '1';
  recordTest('Add Arc to demo bag with accessible modal focus and live announcement', addPassed, {
    bagOpened, focusedElementId, liveStatus, bagTotal, bagCount
  });

  // Capture open bag screenshot
  const bagShotPath = path.join(evidenceDir, 'sable-demo-bag-open-1440.png');
  await page.screenshot({ path: bagShotPath, fullPage: false });
  results.screenshots.push({ name: 'sable-demo-bag-open-1440.png', description: 'Modal bag open with Arc added' });

  // E. Tab Trap Containment Test (20 Tab cycles forward and backward)
  let focusTrapped = true;
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => {
      const bag = document.getElementById('sable-bag');
      return bag.contains(document.activeElement);
    });
    if (!inside) { focusTrapped = false; break; }
  }
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Shift+Tab');
    const inside = await page.evaluate(() => {
      const bag = document.getElementById('sable-bag');
      return bag.contains(document.activeElement);
    });
    if (!inside) { focusTrapped = false; break; }
  }
  recordTest('Dialog focus containment (20 forward/backward Tabs stay in dialog)', focusTrapped);

  // F. Escape key restores focus
  await page.keyboard.press('Escape');
  const bagClosed = await page.evaluate(() => !document.getElementById('sable-bag').open);
  const restoredFocusText = await page.evaluate(() => document.activeElement ? document.activeElement.textContent : null);
  recordTest('Escape closes dialog and restores focus', bagClosed && restoredFocusText.includes('Add to demo bag'), {
    bagClosed, restoredFocusText
  });

  // G. Multi-product Addition & Quantity Update
  // Add The Fold
  await page.click('#sable-fold-form button[type="submit"]');
  const multiCount = await page.evaluate(() => document.getElementById('sable-count').textContent);
  const multiTotal = await page.evaluate(() => document.getElementById('sable-total').textContent);
  recordTest('Add The Fold cardholder ($65), subtotal $345.00', multiCount === '2' && multiTotal === '$345.00', {
    multiCount, multiTotal
  });

  // Update Arc quantity in bag to 2
  const arcQtyInputSelector = '#sable-bag-qty-arc-ink';
  await page.fill(arcQtyInputSelector, '2');
  await page.dispatchEvent(arcQtyInputSelector, 'change');
  await page.waitForTimeout(100);
  const updatedTotal = await page.evaluate(() => document.getElementById('sable-total').textContent);
  const qtyLiveStatus = await page.evaluate(() => document.getElementById('sable-bag-status').textContent);
  recordTest('Update Arc quantity to 2, subtotal $625.00 with live announcement', updatedTotal === '$625.00' && qtyLiveStatus.includes('Quantity updated'), {
    updatedTotal, qtyLiveStatus
  });

  // H. Remove Item
  await page.click('#sable-remove-fold-ink');
  await page.waitForTimeout(100);
  const afterRemoveTotal = await page.evaluate(() => document.getElementById('sable-total').textContent);
  const removeStatus = await page.evaluate(() => document.getElementById('sable-bag-status').textContent);
  recordTest('Remove Fold, subtotal returns to $560.00 with live announcement', afterRemoveTotal === '$560.00' && removeStatus.includes('removed'), {
    afterRemoveTotal, removeStatus
  });

  // Remove remaining Arc
  await page.click('#sable-remove-arc-ink');
  const emptyTotal = await page.evaluate(() => document.getElementById('sable-total').textContent);
  const emptyMsg = await page.evaluate(() => document.querySelector('.sable-bag-empty') ? document.querySelector('.sable-bag-empty').textContent : '');
  recordTest('Remove Arc to empty bag state', emptyTotal === '$0.00' && emptyMsg.includes('room for an idea'), {
    emptyTotal, emptyMsg
  });

  // Close bag
  await page.click('#sable-bag-close');

  // I. Storage Persistence
  // Add 1 Arc Oxblood
  await page.click('input[value="oxblood"]');
  await page.click('#sable-arc-form button[type="submit"]');
  await page.reload({ waitUntil: 'networkidle' });
  const persistedCount = await page.evaluate(() => document.getElementById('sable-count').textContent);
  recordTest('localStorage persistence across reload', persistedCount === '1', { persistedCount });

  // J. Storage Recovery from Malformed Data
  await page.evaluate(() => localStorage.setItem('sable.demo-bag.v1', '{corrupted_json:invalid'));
  await page.reload({ waitUntil: 'networkidle' });
  const recoveredCount = await page.evaluate(() => document.getElementById('sable-count').textContent);
  const storageNote = await page.evaluate(() => document.getElementById('sable-storage-note').textContent);
  recordTest('Recovery from corrupted localStorage resets safely', recoveredCount === '0' && storageNote.includes('reset'), {
    recoveredCount, storageNote
  });

  // K. Reduced Motion Check
  await context.close();
  const motionContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(`${baseUrl}/sable-demo.html`, { waitUntil: 'networkidle' });
  const buttonTransition = await motionPage.evaluate(() => {
    const btn = document.querySelector('.sable-add');
    const cs = window.getComputedStyle(btn);
    return cs.transitionDuration;
  });
  recordTest('prefers-reduced-motion: reduce disables transitions (0s)', buttonTransition === '0s', { buttonTransition });
  await motionContext.close();

  await browser.close();

  // Write verification report
  const reportPath = path.join(evidenceDir, 'verification-results.json');
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nAll tests completed. Results saved to ${reportPath}`);
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
