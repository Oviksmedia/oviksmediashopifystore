import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire('C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true});
for(const [w,h]of [[390,844],[768,1024]]){
const page=await browser.newPage({viewport:{width:w,height:h}});
for(const type of ['demo','case']){
await page.goto('http://127.0.0.1:4402/daybreak'+(type==='demo'?'-demo':'')+'.html');
await page.evaluate(async()=>{for(const img of document.images)img.loading="eager";await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
await page.screenshot({path:fileURLToPath(new URL('evidence/daybreak-'+type+'-'+w+'-first-view.jpg',import.meta.url)),type:'jpeg',quality:85});
}
await page.close();}
await browser.close();
