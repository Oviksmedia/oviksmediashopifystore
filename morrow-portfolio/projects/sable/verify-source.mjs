import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';
import assert from 'node:assert/strict';
const root=path.dirname(fileURLToPath(import.meta.url));
const source=await readFile(path.join(root,'shopify/sections/sable-product-collection.liquid'),'utf8');
const schema=JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
assert.ok(schema.name.length<=25);const ids=schema.settings.map(s=>s.id);assert.equal(new Set(ids).size,ids.length);
for(const s of schema.settings){if(s.type==='range'){assert.ok(s.min<s.max);assert.ok((s.max-s.min)/s.step>=2);assert.ok(s.default>=s.min&&s.default<=s.max);}}
const locale=JSON.parse(await readFile(path.join(root,'shopify/locales/sable-en.default.json'),'utf8'));
const keys=[...source.matchAll(/'sable\.ui\.([a-z_]+)'\s*\|\s*t/g)].map(match=>match[1]);for(const key of keys)assert.equal(typeof locale.sable.ui[key],'string');
const stack=[];const blocks=new Set(['if','unless','for','form','style','stylesheet','javascript','schema']);
for(const match of source.matchAll(/{%\s*(\w+)[\s\S]*?%}/g)){const tag=match[1];if(blocks.has(tag))stack.push(tag);if(tag.startsWith('end'))assert.equal(stack.pop(),tag.slice(3));}assert.equal(stack.length,0);
new Script(source.match(/{% javascript %}([\s\S]*?){% endjavascript %}/)[1]);
assert.ok(source.includes("form 'product', sable_product"));assert.ok(source.includes('name="id"'));assert.ok(source.includes('sable_product.variants'));assert.ok(source.includes('sable_option.price | money'));assert.ok(source.includes('quantity_rule.min'));
const report={date:'2026-10-03',passed:true,checks:['Schema JSON parses','Unique setting IDs','Section name <=25 characters','Range setting boundaries and defaults','Translation key resolution','Balanced Liquid block tags','Embedded JS parses','Native product form and actual product/variant/price/quantity rule references'],fullThemeCheck:{passed:false,available:false,reason:'Installed Shopify helper cannot import @shopify/theme-check-common. No packages installed.'},liveShopifyValidated:false};
await writeFile(path.join(root,'evidence/sable-source-verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
