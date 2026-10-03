import {createRequire} from 'node:module';
import {writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire('C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium} = require('playwright');
const root = path.dirname(fileURLToPath(import.meta.url));
const report={date:'2026-10-03',environment:'Bundled Playwright / headless Chromium / local preview',viewports:[],checks:[],errors:[],limitations:['No physical devices or screen reader tested.','No live Shopify theme, cart or inventory tested.','No checkout exists.']};
const browser=await chromium.launch({headless:true});
const base=process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:4392';
const checked=(name)=>report.checks.push({name,passed:true});
async function loaded(page){await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));await document.fonts.ready;});}
try {
  for(const viewport of [{width:1440,height:1000},{width:320,height:720},{width:390,height:844},{width:768,height:1024},{width:568,height:320}]){
    const context=await browser.newContext({viewport});
    const page=await context.newPage();
    page.on('pageerror',error=>report.errors.push(error.message));
    page.on('console',msg=>{if(msg.type()==='error')report.errors.push(msg.text());});
    for(const file of ['sable.html','sable-demo.html']){
      await page.goto(base+'/'+file,{waitUntil:'networkidle'});await loaded(page);
      const health=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.images].filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.src),duplicateIds:[...document.querySelectorAll('[id]')].map(x=>x.id).filter((id,i,all)=>all.indexOf(id)!==i)}));
      assert.equal(health.overflow,false,`Overflow ${file} ${viewport.width}x${viewport.height}`);assert.deepEqual(health.images,[]);assert.deepEqual(health.duplicateIds,[]);
      const links=await page.locator('a[href]').evaluateAll(elements=>elements.map(a=>a.href));
      for(const url of [...new Set(links)]){const parsed=new URL(url);if(parsed.origin!==base)continue;const response=await context.request.get(parsed.origin+parsed.pathname);assert.equal(response.status(),200,`Link ${url}`);if(parsed.hash){const html=await response.text();assert.ok(html.includes(`id="${parsed.hash.slice(1)}"`),`Missing fragment ${url}`);}}
      if(viewport.width===1440||viewport.width===390){await page.screenshot({path:path.join(root,`evidence/sable-${file==='sable.html'?'case':'demo'}-${viewport.width===1440?'desktop':'mobile'}.jpg`),fullPage:true,quality:85});}
      if(file==='sable-demo.html'){
        await page.locator('#sable-arc-form input[value=ink]').check();assert.ok((await page.locator('#sable-arc-image').getAttribute('src')).includes('arc-ink'));
        await page.locator('[data-view=detail]').click();assert.equal(await page.locator('[data-view=detail]').getAttribute('aria-pressed'),'true');assert.ok((await page.locator('#sable-image-caption').textContent()).includes('Oxblood reference'));
        await page.locator('#sable-arc-form button[type=submit]').click();assert.equal(await page.locator('#sable-bag').evaluate(x=>x.open),true);
        assert.equal(await page.locator('#sable-bag-status').evaluate(x=>x.closest('dialog').open),true);
        assert.equal(await page.evaluate(()=>document.activeElement.id),'sable-bag-close');
        const modal=await page.locator('#sable-bag').evaluate(d=>({overflow:d.scrollWidth>d.clientWidth+1,height:d.getBoundingClientRect().height}));assert.equal(modal.overflow,false);assert.ok(modal.height<=viewport.height);
        if(viewport.width===390||viewport.width===568)await page.screenshot({path:path.join(root,`evidence/sable-bag-${viewport.width}x${viewport.height}.jpg`),quality:85});
        await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'sable-continue');
        await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'sable-bag-close');
        await page.keyboard.press('Escape');assert.equal(await page.locator('#sable-bag').evaluate(x=>x.open),false);assert.equal(await page.evaluate(()=>document.activeElement.closest('form')?.id),'sable-arc-form');
        await page.locator('.sable-bag-open').click();await page.locator('[data-remove]').click();await page.locator('#sable-bag-close').click();
      }
      report.viewports.push({page:file,...viewport,...health,passed:true});
    }
    await context.close();
  }
  checked('Responsive case/demo, eager-loaded images, duplicate IDs, all local links and fragments, finish/gallery and modal flow at 1440/320/390/768/568x320');
  const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();await page.goto(base+'/sable-demo.html');
  await page.locator('#sable-arc-qty').fill('0');await page.locator('#sable-arc-form button[type=submit]').click();assert.equal(await page.locator('#sable-bag').evaluate(x=>x.open),false);assert.equal(await page.locator('#sable-arc-qty').evaluate(x=>x.validity.valid),false);
  await page.locator('#sable-arc-qty').fill('2');await page.locator('#sable-arc-form button[type=submit]').click();assert.equal(await page.locator('#sable-total').textContent(),'$560.00');await page.locator('#sable-bag-close').click();
  await page.locator('#sable-arc-form input[value=ink]').check();await page.locator('#sable-arc-qty').fill('1');await page.locator('#sable-arc-form button[type=submit]').click();assert.equal(await page.locator('.sable-bag-row').count(),2);assert.equal(await page.locator('#sable-total').textContent(),'$840.00');await page.locator('#sable-bag-close').click();
  await page.locator('#sable-fold-form button[type=submit]').click();assert.equal(await page.locator('#sable-total').textContent(),'$905.00');assert.equal(await page.locator('.sable-bag-row').count(),3);await page.locator('#sable-bag-close').click();
  await page.reload();await page.locator('.sable-bag-open').click();assert.equal(await page.locator('.sable-bag-row').count(),3);assert.equal(await page.locator('#sable-total').textContent(),'$905.00');
  await page.locator('#sable-bag-qty-arc-oxblood').fill('3');await page.locator('#sable-bag-qty-arc-oxblood').press('Tab');assert.equal(await page.locator('#sable-total').textContent(),'$1,185.00');
  await page.locator('#sable-bag-qty-arc-oxblood').fill('0');await page.locator('#sable-bag-qty-arc-oxblood').press('Tab');assert.equal(await page.locator('#sable-bag-qty-arc-oxblood').inputValue(),'3');
  await page.locator('#sable-bag-qty-arc-oxblood').fill('2.5');await page.locator('#sable-bag-qty-arc-oxblood').press('Tab');assert.equal(await page.locator('#sable-bag-qty-arc-oxblood').inputValue(),'3');
  await page.locator('#sable-bag-qty-arc-oxblood').fill('10');await page.locator('#sable-bag-qty-arc-oxblood').press('Tab');assert.equal(await page.locator('#sable-bag-qty-arc-oxblood').inputValue(),'3');
  await page.locator('#sable-remove-arc-ink').click();assert.equal(await page.locator('#sable-total').textContent(),'$905.00');await page.locator('#sable-remove-fold-ink').click();await page.locator('#sable-remove-arc-oxblood').click();assert.equal(await page.locator('#sable-total').textContent(),'$0.00');assert.equal(await page.locator('#sable-count').textContent(),'0');await page.locator('#sable-bag-close').click();
  await page.locator('#sable-arc-qty').fill('9');await page.locator('#sable-arc-form button[type=submit]').click();await page.locator('#sable-bag-close').click();await page.locator('#sable-arc-qty').fill('1');await page.locator('#sable-arc-form button[type=submit]').click();assert.equal(await page.locator('#sable-bag').evaluate(x=>x.open),false);assert.ok((await page.locator('#sable-arc-form [data-product-status]').textContent()).includes('up to 9'));
  checked('Native validation, three distinct variant/product lines, exact integer-cent totals, quantity correction, removal/empty, persistence, cumulative quantity cap');
  await context.close();
  for(const value of ['bad-json',JSON.stringify([{id:'alien',qty:1}]),JSON.stringify([{id:'arc-ink',qty:0}]),JSON.stringify([{id:'arc-ink',qty:1},{id:'arc-ink',qty:2}])]){
    const c=await browser.newContext();await c.addInitScript(value=>localStorage.setItem('sable.demo-bag.v1',value),value);const p=await c.newPage();await p.goto(base+'/sable-demo.html');await p.locator('.sable-bag-open').click();assert.equal(await p.locator('#sable-total').textContent(),'$0.00');assert.ok((await p.locator('#sable-storage-note').textContent()).includes('reset'));await c.close();
  }
  checked('Malformed JSON, unknown variant, invalid stored quantity and duplicate lines reset safely');
  for(const type of ['read','write']){
    const c=await browser.newContext();await c.addInitScript(type=>{Object.defineProperty(Storage.prototype,type==='read'?'getItem':'setItem',{value(){throw new DOMException('Unavailable','SecurityError');}});},type);const p=await c.newPage();await p.goto(base+'/sable-demo.html');await p.locator('#sable-arc-form button[type=submit]').click();assert.equal(await p.locator('#sable-total').textContent(),'$280.00');assert.ok((await p.locator('#sable-storage-note').textContent()).includes('page session'));await p.locator('[data-remove]').click();assert.equal(await p.locator('#sable-total').textContent(),'$0.00');await c.close();
  }
  checked('Storage read and write failure: in-session add/remove remains usable with explicit warning');
  const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});const p=await reduced.newPage();await p.goto(base+'/sable-demo.html');await p.locator('#sable-arc-form input[value=ink]').check();assert.ok((await p.locator('#sable-arc-image').getAttribute('src')).includes('ink'));assert.equal(await p.locator('.sable-add').first().evaluate(x=>getComputedStyle(x).transitionDuration),'0s');assert.equal(await p.evaluate(()=>document.getAnimations().length),0);await reduced.close();checked('Reduced motion: zero transitions/animations and immediate variant state');
  assert.deepEqual(report.errors,[]);checked('No browser JavaScript or console errors in viewport runs');
  report.passed=true;
} catch(error){report.passed=false;report.failure=error.stack;console.error(error.stack);process.exitCode=1;} finally {await browser.close();await writeFile(path.join(root,'evidence/sable-browser-verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,viewports:report.viewports.length,failure:report.failure},null,2));}
