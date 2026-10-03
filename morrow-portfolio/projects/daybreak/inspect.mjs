import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:320,height:740}});
await page.goto('http://127.0.0.1:4402/daybreak.html');await page.evaluate(()=>document.fonts.ready);
console.log(await page.evaluate(()=>[...document.querySelectorAll('main *')].map(e=>({tag:e.tagName,cls:e.className,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width,text:e.textContent.slice(0,55)})).filter(x=>x.left<0||x.right>innerWidth)));
await browser.close();
