import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true});
const base=process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:4392';
const checks=[],errors=[];
const check=(name,passed,detail='')=>{checks.push({name,passed:Boolean(passed),detail});if(!passed)errors.push(name);};
const url=file=>new URL('evidence/'+file,import.meta.url);
async function pageFor(context,viewport){const p=await context.newPage();await p.setViewportSize(viewport);p.on('pageerror',e=>errors.push('JS: '+e.message));p.on('response',r=>{if(r.status()>=400)errors.push('Resource '+r.status()+': '+r.url());});return p;}
const context=await browser.newContext();
for(const [name,viewport] of Object.entries({desktop:{width:1400,height:940},mobile320:{width:320,height:740},mobile390:{width:390,height:844},tablet768:{width:768,height:1024},landscape568:{width:568,height:320}})){
 for(const file of ['arc-demo.html','arc.html']){
  const p=await pageFor(context,viewport);await p.goto(base+'/'+file);await p.evaluate(()=>document.fonts.ready);
  for(const img of await p.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
  check(file+' '+name+' images loaded',await p.locator('img').evaluateAll(list=>list.every(i=>i.complete&&i.naturalWidth>0)));
  check(file+' '+name+' no overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  check(file+' '+name+' font loaded',await p.evaluate(()=>document.fonts.check('16px "Arc Grotesk"')));
  check(file+' '+name+' unique IDs',await p.locator('[id]').evaluateAll(list=>new Set(list.map(el=>el.id)).size===list.length));
  if(file==='arc-demo.html'){
   check(name+' shopping touch targets',await p.locator('#arc-add,.arc-finishes label,.arc-gallery-controls button,#arc-bag-open').evaluateAll(list=>list.every(el=>{const r=el.getBoundingClientRect();return r.width>=44&&r.height>=44;})));
   await p.locator('#arc-add').focus();check(name+' visible focus outline',await p.locator('#arc-add').evaluate(el=>getComputedStyle(el).outlineWidth==='3px'));
  }
  const links=await p.locator('a[href]').evaluateAll(list=>list.map(a=>a.href));
  for(const href of new Set(links)){const u=new URL(href);if(u.origin!==base)continue;const r=await p.request.get(u.href);check(name+' local link '+u.pathname+u.hash,r.status()===200);if(u.hash){const body=await r.text();check(name+' fragment '+u.hash,body.includes('id="'+u.hash.slice(1)+'"'));}}
  await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:fileURLToPath(url(file.replace('.html','')+'-'+name+'.jpg')),type:'jpeg',quality:75,fullPage:name!=='landscape568'});
  if(file==='arc-demo.html'&&name!=='desktop'){
   await p.locator('#arc-shop').scrollIntoViewIfNeeded();await p.locator('input[value="graphite"]').check();await p.locator('#arc-add').click();check(name+' modal fits viewport',await p.locator('#arc-bag').evaluate(d=>d.getBoundingClientRect().width<=innerWidth&&d.getBoundingClientRect().height<=innerHeight));check(name+' bag add',await p.locator('#arc-total').textContent()==='$440.00 USD');await p.screenshot({path:fileURLToPath(url('arc-bag-'+name+'.jpg')),type:'jpeg',quality:80});await p.keyboard.press('Escape');await p.locator('#arc-bag-open').click();await p.locator('#arc-empty').click();await p.keyboard.press('Escape');
  }
  await p.close();
 }
}
const p=await pageFor(context,{width:1400,height:940});await p.goto(base+'/arc-demo.html');
await p.locator('#arc-add').click();check('finish required',await p.locator('#arc-form-status').textContent()==='Choose a finish before adding to your demo bag.');check('validation focuses radio',await p.locator('input[value=silver]').evaluate(el=>el===document.activeElement));
await p.locator('input[value=silver]').check();for(const invalid of ['0','1.5','21','']){await p.locator('#arc-quantity').fill(invalid);await p.locator('#arc-add').click();check('reject quantity '+JSON.stringify(invalid),!(await p.locator('#arc-bag').evaluate(d=>d.open)));}
await p.locator('#arc-quantity').fill('2');await p.locator('#arc-add').click();check('add silver two / total',await p.locator('#arc-total').textContent()==='$840.00 USD');check('announcement inside dialog',await p.locator('#arc-bag #arc-bag-status').textContent().then(t=>t.includes('added')));
await p.keyboard.press('Shift+Tab');check('focus wraps backwards',await p.locator('#arc-continue').evaluate(el=>el===document.activeElement));await p.keyboard.press('Tab');check('focus wraps forwards',await p.locator('#arc-bag-close').evaluate(el=>el===document.activeElement));
for(let i=0;i<15;i++){await p.keyboard.press('Tab');check('dialog containment '+i,await p.evaluate(()=>document.querySelector('#arc-bag').contains(document.activeElement)));}
await p.keyboard.press('Escape');check('Escape closes dialog',!(await p.locator('#arc-bag').evaluate(d=>d.open)));check('focus restored to add',await p.locator('#arc-add').evaluate(el=>el===document.activeElement));
await p.locator('input[value=graphite]').check();await p.locator('[data-view=silver]').click();check('gallery does not alter finish',await p.locator('input[value=graphite]').isChecked());await p.locator('#arc-quantity').fill('1');await p.locator('#arc-add').click();check('variant distinctions and total',await p.locator('.arc-bag-line').count()===2&&await p.locator('#arc-total').textContent()==='$1,280.00 USD');
await p.locator('#arc-line-silver').fill('3');await p.locator('#arc-line-silver').dispatchEvent('change');check('update quantity total',await p.locator('#arc-total').textContent()==='$1,700.00 USD');
await p.locator('#arc-line-silver').fill('30');await p.locator('#arc-line-silver').dispatchEvent('change');check('bad update retained',await p.locator('#arc-line-silver').inputValue()==='3'&&await p.locator('#arc-total').textContent()==='$1,700.00 USD');check('bad update feedback',await p.locator('#arc-bag-status').textContent().then(t=>t.includes('Previous quantity kept')));
await p.locator('#arc-remove-silver').click();check('remove / totals',await p.locator('.arc-bag-line').count()===1&&await p.locator('#arc-total').textContent()==='$440.00 USD');await p.keyboard.press('Escape');await p.reload();check('persistence',await p.locator('#arc-count').textContent()==='1');await p.locator('#arc-bag-open').click();await p.locator('#arc-empty').click();check('empty state',await p.locator('#arc-bag-lines').textContent().then(t=>t.includes('bag is empty')));check('empty summary hidden',await p.locator('#arc-bag-summary').isHidden());await p.keyboard.press('Escape');
await p.locator('input[value=silver]').check();await p.locator('#arc-quantity').fill('20');await p.locator('#arc-add').click();await p.keyboard.press('Escape');await p.locator('#arc-quantity').fill('1');await p.locator('#arc-add').click();check('per finish cumulative limit',await p.locator('#arc-form-status').textContent().then(t=>t.includes('limit is 20')));await p.locator('#arc-bag-open').click();await p.locator('#arc-empty').click();await p.keyboard.press('Escape');
await p.emulateMedia({reducedMotion:'reduce'});check('reduced motion immediate',await p.locator('#arc-add').evaluate(el=>getComputedStyle(el).transitionDuration==='0s'));await p.locator('input[value=graphite]').check();check('reduced motion image safe final state',await p.locator('#arc-product-image').getAttribute('src')==='assets/arc-graphite.webp');
await p.close();await context.close();
for(const [name,seed] of Object.entries({malformed:'{broken',unknown:'[{"id":"fake","qty":1}]',fraction:'[{"id":"silver","qty":1.5}]',duplicate:'[{"id":"silver","qty":1},{"id":"silver","qty":2}]',tooMany:'[{"id":"silver","qty":21}]'})){
 const c=await browser.newContext();await c.addInitScript(value=>localStorage.setItem('arc.demo.bag.v1',value),seed);const q=await c.newPage();await q.goto(base+'/arc-demo.html');check(name+' recovered',await q.locator('#arc-count').textContent()==='0'&&await q.locator('#arc-form-status').textContent().then(t=>t.includes('invalid')));await q.locator('#arc-bag-open').click();check(name+' dialog recovery announcement',await q.locator('#arc-bag-status').textContent().then(t=>t.includes('invalid')));await c.close();
}
for(const mode of ['read-and-write','write-only']){
 const c=await browser.newContext();await c.addInitScript(mode=>{Storage.prototype.setItem=function(){throw new DOMException('Unavailable','QuotaExceededError');};if(mode==='read-and-write')Storage.prototype.getItem=function(){throw new DOMException('Unavailable','SecurityError');};},mode);const q=await c.newPage();await q.goto(base+'/arc-demo.html');await q.locator('input[value=silver]').check();await q.locator('#arc-add').click();check(mode+' storage fallback add',await q.locator('#arc-total').textContent()==='$420.00 USD');check(mode+' fallback announcement',await q.locator('#arc-bag-status').textContent().then(t=>t.includes('page session')));await q.locator('#arc-line-silver').fill('2');await q.locator('#arc-line-silver').dispatchEvent('change');check(mode+' fallback update',await q.locator('#arc-total').textContent()==='$840.00 USD');await q.locator('#arc-remove-silver').click();check(mode+' fallback remove',await q.locator('#arc-bag-lines').textContent().then(t=>t.includes('empty')));await c.close();
}
const report={date:'2026-10-03',environment:'Bundled Playwright / headless Chromium on Windows; localhost only',checks,errors,passed:!errors.length,limits:['No physical-device or screen-reader tests','No live Shopify render, catalog mutation or upload','Concept dimensions, light performance and materials are not physical evidence']};
await fs.writeFile(url('arc-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({checks:checks.length,errors,passed:report.passed},null,2));await browser.close();if(errors.length)process.exitCode=1;
