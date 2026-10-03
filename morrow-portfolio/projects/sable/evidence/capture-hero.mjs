import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire('C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://127.0.0.1:4401/sable-demo.html',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
await page.locator('.sable-hero').screenshot({path:path.join(path.dirname(fileURLToPath(import.meta.url)),'sable-storefront-hero.jpg'),type:'jpeg',quality:88});await browser.close();
