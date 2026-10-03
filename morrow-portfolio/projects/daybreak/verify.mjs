import {createRequire} from 'node:module';
import {readFile,writeFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const root=new URL('.',import.meta.url),base=process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:4392';
const results={date:new Date().toISOString(),environment:'Bundled Playwright / Chromium, localhost only',checks:[],viewports:[],errors:[]};
const check=(name,fn)=>async()=>{await fn();results.checks.push({name,status:'pass'});};
const browser=await chromium.launch({headless:true});
const context=await browser.newContext();
const page=await context.newPage();
page.on('pageerror',error=>results.errors.push(error.message));
page.on('response',r=>{if(r.status()>=400)results.errors.push(r.status()+' '+r.url());});
async function loaded(p){await p.evaluate(async()=>{for(const img of document.images){img.loading='eager';}await document.fonts.ready;await Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=img.onerror=resolve})));});}
try{
 for(const [w,h]of [[1440,1000],[320,740],[390,844],[768,1024],[568,320]]){
  await page.setViewportSize({width:w,height:h});
  for(const pathname of ['/daybreak-demo.html','/daybreak.html']){
   await page.goto(base+pathname);await loaded(page);
   const metrics=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,images:[...document.images].every(img=>img.complete&&img.naturalWidth>0),fontDisplay:document.fonts.check('600 24px "Daybreak Fredoka"'),fontBody:document.fonts.check('400 16px "Daybreak Epilogue"'),badTargets:[...document.querySelectorAll('button,select,summary')].filter(x=>x.getClientRects().length&&x.getBoundingClientRect().height<44).map(x=>x.textContent)}));
   assert(metrics.scroll<=metrics.width,'Horizontal overflow '+pathname+' '+w);
   assert(metrics.images,'Unloaded image '+pathname+' '+w);assert(metrics.fontDisplay&&metrics.fontBody,'Font not loaded');assert.equal(metrics.badTargets.length,0);
   const slug=pathname.includes('demo')?'demo':'case';
   await page.screenshot({path:fileURLToPath(new URL('evidence/daybreak-'+slug+'-'+w+'x'+h+'.jpg',root)),fullPage:true,type:'jpeg',quality:78});
   results.viewports.push({page:pathname,width:w,height:h,...metrics,status:'pass'});
  }
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/daybreak-demo.html');await loaded(page);
 await page.screenshot({path:fileURLToPath(new URL('evidence/daybreak-demo-desktop-hero.jpg',root)),type:'jpeg',quality:85});
 // Local links/resources, including portfolio return document and fragments.
 for(const pathname of ['/daybreak.html','/daybreak-demo.html']){
  await page.goto(base+pathname);await loaded(page);
  const links=await page.locator('a[href]').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')));
  for(const href of new Set(links)){
   const url=new URL(href,page.url());if(url.origin!==base)continue;
   const response=await context.request.get(url.origin+url.pathname);assert.equal(response.status(),200,'Broken '+href);
   if(url.hash){const html=await response.text();assert(html.includes('id="'+url.hash.slice(1)+'"'),'Broken fragment '+href);}
  }
 }
 results.checks.push({name:'All case/demo local links, images and fonts after eager/lazy loading',status:'pass'});
 const key='oviks-daybreak-demo-bag-v1',bag=page.locator('#daybreak-bag');
 await page.goto(base+'/daybreak-demo.html');await page.evaluate(k=>localStorage.removeItem(k),key);await page.reload();
 await check('Empty bag, Escape and focus restoration',async()=>{
  await page.locator('#daybreak-open').click();await page.locator('#daybreak-bag').waitFor({state:'visible'});assert.match(await page.locator('#daybreak-items').innerText(),/empty/);
  await page.keyboard.press('Escape');assert.equal(await bag.isVisible(),false);assert.equal(await page.locator('#daybreak-open').evaluate(x=>x===document.activeElement),true);
 })();
 await check('Required grind validation',async()=>{
  await page.locator('[data-daybreak-product="day-one"] button').click();assert.equal(await bag.isVisible(),false);
  assert.equal(await page.locator('#daybreak-grind-day-one').evaluate(x=>x.validity.valueMissing),true);assert.equal(await page.locator('#daybreak-count').innerText(),'0');
 })();
 const add=async(product,grind)=>{await page.locator('#daybreak-grind-'+product).selectOption(grind);await page.locator('[data-daybreak-product="'+product+'"] button').click();};
 await check('Add confirmation is inside active dialog and keyboard containment',async()=>{
  await add('day-one','whole-bean');assert.equal(await bag.isVisible(),true);assert.match(await bag.locator('[role="status"]').innerText(),/Day One.*Whole bean added/);
  assert.equal(await page.locator('#daybreak-close').evaluate(x=>x===document.activeElement),true);
  await page.keyboard.press('Shift+Tab');assert.equal(await page.locator('#daybreak-continue').evaluate(x=>x===document.activeElement),true);
  await page.keyboard.press('Tab');assert.equal(await page.locator('#daybreak-close').evaluate(x=>x===document.activeElement),true);
 })();
 await page.keyboard.press('Escape');
 await check('Variant distinctions, repeated additions and accurate subtotal',async()=>{
  await add('day-one','filter');await page.keyboard.press('Escape');await add('high-noon','espresso');await page.keyboard.press('Escape');await add('day-one','whole-bean');
  assert.equal(await page.locator('.daybreak-bag-line').count(),3);assert.equal(await page.locator('#daybreak-total').innerText(),'$66.00');assert.equal(await page.locator('#daybreak-count').innerText(),'4');
 })();
 await check('Quantity validation, exact totals and maximum quantity',async()=>{
  const qty=page.locator('#daybreak-qty-day-one-whole-bean');
  await qty.fill('3');await qty.press('Tab');assert.equal(await page.locator('#daybreak-total').innerText(),'$82.00');
  for(const invalid of ['0','-1','1.5','99','']){await qty.fill(invalid);await qty.press('Tab');assert.equal(await qty.inputValue(),'3');assert.match(await bag.locator('[role="status"]').innerText(),/whole-number/);}
  await qty.fill('12');await qty.press('Tab');assert.equal(await page.locator('#daybreak-total').innerText(),'$226.00');
  await page.keyboard.press('Escape');await add('day-one','whole-bean');assert.match(await bag.locator('[role="status"]').innerText(),/limit/);assert.equal(await page.locator('#daybreak-count').innerText(),'14');
 })();
 await check('Removal, persistent reload and empty bag',async()=>{
  await page.locator('[data-daybreak-remove="day-one:filter"]').click();assert.equal(await page.locator('#daybreak-total').innerText(),'$210.00');
  await page.keyboard.press('Escape');await page.reload();await page.locator('#daybreak-open').click();assert.equal(await page.locator('.daybreak-bag-line').count(),2);
  await page.locator('#daybreak-empty').click();assert.equal(await page.locator('#daybreak-total').innerText(),'$0.00');assert.equal(await page.locator('#daybreak-count').innerText(),'0');assert.match(await bag.locator('[role="status"]').innerText(),/emptied/);
  await page.keyboard.press('Escape');await page.reload();assert.equal(await page.locator('#daybreak-count').innerText(),'0');
 })();
 await check('Malformed and untrusted stored bag recovery',async()=>{
  for(const raw of ['{bad',JSON.stringify([{product:'<img onerror=alert(1)>',grind:'whole-bean',qty:1}]),JSON.stringify([{product:'day-one',grind:'filter',qty:0}]),JSON.stringify([{product:'day-one',grind:'filter',qty:1},{product:'day-one',grind:'filter',qty:1}]),JSON.stringify([{product:'toString',grind:'filter',qty:1}])]){
   await page.evaluate(([k,r])=>localStorage.setItem(k,r),[key,raw]);await page.reload();await page.locator('#daybreak-open').click();assert.equal(await page.locator('#daybreak-count').innerText(),'0');assert.match(await page.locator('#daybreak-storage').innerText(),/unreadable/);await page.keyboard.press('Escape');
  }
 })();
 await check('Cross-tab bag synchronization',async()=>{
  const other=await context.newPage();await other.goto(base+'/daybreak-demo.html');await other.locator('#daybreak-grind-after-hours').selectOption('french-press');await other.locator('[data-daybreak-product="after-hours"] button').click();await page.waitForFunction(()=>document.getElementById('daybreak-count').textContent==='1');
  await other.close();
 })();
 await check('Unavailable and quota-failed storage still permits session bag',async()=>{
  for(const mode of ['unavailable','quota']){
   const ctx=await browser.newContext();await ctx.addInitScript(mode=>{
    if(mode==='unavailable')Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError')}});
    else Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError')};
   },mode);
   const p=await ctx.newPage();await p.goto(base+'/daybreak-demo.html');await p.locator('#daybreak-grind-day-one').selectOption('filter');await p.locator('[data-daybreak-product="day-one"] button').click();assert.equal(await p.locator('#daybreak-total').innerText(),'$16.00');assert.match(await p.locator('#daybreak-storage').innerText(),/visit only/);await ctx.close();
  }
 })();
 await check('Reduced-motion immediate final labels and dynamic preference change',async()=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/daybreak.html');await page.locator('#daybreak-label-select').selectOption('after-hours');assert.equal(await page.locator('#daybreak-label-name').textContent(),'After Hours');
  assert.equal(await page.locator('.daybreak-label-art').evaluate(x=>getComputedStyle(x).transitionDuration),'0s');assert.equal(await page.locator('.daybreak-label-art').evaluate(x=>getComputedStyle(x).opacity),'1');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#daybreak-label-select').selectOption('high-noon');await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.daybreak-label-art').evaluate(x=>getComputedStyle(x).opacity),'1');
 })();
 await check('Touch at 390px and short-landscape dialog visibility',async()=>{
  const ctx=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();await p.goto(base+'/daybreak-demo.html');await p.locator('#daybreak-grind-day-one').selectOption('filter');await p.locator('[data-daybreak-product="day-one"] button').tap();assert.equal(await p.locator('#daybreak-total').innerText(),'$16.00');await p.screenshot({path:fileURLToPath(new URL('evidence/daybreak-bag-mobile.jpg',root)),type:'jpeg',quality:85});await ctx.close();
  await page.setViewportSize({width:568,height:320});await page.goto(base+'/daybreak-demo.html');await page.locator('#daybreak-open').click();assert(await page.locator('#daybreak-close').isVisible());assert(await page.locator('#daybreak-close').evaluate(x=>x.getBoundingClientRect().bottom<=innerHeight));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.keyboard.press('Escape');
 })();
 // Static source checks are deliberately distinct from Theme Check.
 const liquid=await readFile(new URL('shopify/daybreak-roast-collection.liquid',root),'utf8');
 const schema=JSON.parse(liquid.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
 for(const scope of [schema,...schema.blocks]){const ids=scope.settings.map(x=>x.id);assert.equal(new Set(ids).size,ids.length);}
 assert.equal(new Set(schema.blocks.map(x=>x.type)).size,schema.blocks.length);
 for(const tag of ['if','for','form','capture','unless','schema','stylesheet','comment']){assert.equal((liquid.match(new RegExp('{%\\s*'+tag+'(?:\\s|%)','g'))||[]).length,(liquid.match(new RegExp('{%\\s*end'+tag+'\\s*%}','g'))||[]).length,'Liquid '+tag+' balance');}
 results.checks.push({name:'Liquid section schema parse, unique settings/block IDs and balanced tags (not Theme Check)',status:'pass'});
 assert.equal(results.errors.length,0,'Browser resource or JS errors');
 results.status='pass';
}catch(error){results.status='fail';results.failure=error.stack;console.error(error);}
await writeFile(new URL('evidence/daybreak-qa.json',root),JSON.stringify(results,null,2));
await browser.close();console.log(JSON.stringify({status:results.status,checks:results.checks.length,viewports:results.viewports.length,errors:results.errors,failure:results.failure},null,2));if(results.status!=='pass')process.exitCode=1;
