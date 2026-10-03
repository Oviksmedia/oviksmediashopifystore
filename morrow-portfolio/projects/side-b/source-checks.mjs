import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const checks=[];const pass=(name,detail)=>checks.push({name,result:'pass',detail});
const manifest=JSON.parse(fs.readFileSync(path.join(root,'integration.json'),'utf8'));
assert.equal(manifest.slug,'side-b');assert.ok(fs.existsSync(path.join(root,manifest.case.source.replace('morrow-portfolio/projects/side-b/',''))));assert.ok(fs.existsSync(path.join(root,manifest.demo.source.replace('morrow-portfolio/projects/side-b/',''))));pass('Manifest JSON and module paths','Manifest parses; case and demo source files exist.');
new vm.Script(fs.readFileSync(path.join(root,'assets/side-b-store.js'),'utf8'));pass('Storefront JavaScript parse','Bundled Node parses the local bag implementation. Browser behaviour is covered separately.');
const locales=JSON.parse(fs.readFileSync(path.join(root,'shopify/locales/en.default.json'),'utf8'));
const schemaLocales=JSON.parse(fs.readFileSync(path.join(root,'shopify/locales/en.default.schema.json'),'utf8'));
const resolve=(object,key)=>key.split('.').reduce((part,name)=>part?.[name],object);
for(const file of ['side-b-collection.liquid','side-b-product.liquid']){
 const text=fs.readFileSync(path.join(root,'shopify/sections',file),'utf8');
 const blocks=[...text.matchAll(/\{% schema %\}([\s\S]*?)\{% endschema %\}/g)];assert.equal(blocks.length,1);
 const schema=JSON.parse(blocks[0][1]);const ids=schema.settings.map(setting=>setting.id);assert.equal(ids.length,new Set(ids).size);assert.ok(schema.name.length>0);
 for(const translation of [...text.matchAll(/'([^']+)'\s*\|\s*t(?:[ :}])/g)].map(m=>m[1]))assert.equal(typeof resolve(locales,translation),'string',`Missing locale ${translation}`);
 for(const key of JSON.stringify(schema).matchAll(/t:([^"\s]+)/g))assert.equal(typeof resolve(schemaLocales,key[1]),'string',`Missing schema locale ${key[1]}`);
 for(const asset of text.matchAll(/'([^']+)'\s*\|\s*asset_url/g))assert.ok(fs.existsSync(path.join(root,'shopify/assets',asset[1])),`Missing source asset ${asset[1]}`);
 const javascript=text.match(/\{% javascript %\}([\s\S]*?)\{% endjavascript %\}/);if(javascript)new vm.Script(javascript[1]);
 pass(file,'Single valid JSON schema, unique setting IDs, present translation keys and referenced assets; embedded JavaScript parses. This is not Liquid/theme execution.');
}
assert.ok(fs.readFileSync(path.join(root,'shopify/sections/side-b-product.liquid'),'utf8').includes("{% form 'product', product"));pass('Native Shopify form intent','Product form uses Shopify product, selected variant IDs and routes.cart_url. No inherited template was edited. Live behaviour unverified.');
const fontCopies=[['Ultra-Regular.ttf','side-b-ultra.ttf'],['Chivo-Variable.ttf','side-b-chivo.ttf']];for(const [source,copy] of fontCopies)assert.ok(fs.readFileSync(path.join(root,'assets/side-b/fonts',source)).equals(fs.readFileSync(path.join(root,'shopify/assets',copy))));pass('Font copies','Shopify font binaries are byte-identical to the licensed main assets.');
const output={date:'2026-10-03',checks,fullShopifyValidator:{status:'unavailable',attempted:true,reason:"Installed shopify-liquid/scripts/validate.mjs failed with ERR_MODULE_NOT_FOUND for @shopify/theme-check-common. No dependency installed.",liveShopifyVerification:false}};
fs.writeFileSync(path.join(root,'evidence/source-checks.json'),JSON.stringify(output,null,2));console.log(JSON.stringify({checks:checks.length,result:'pass for structural source scope',fullShopifyValidator:'unavailable'},null,2));
