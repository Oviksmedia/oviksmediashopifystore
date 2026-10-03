import fs from 'node:fs/promises';
import vm from 'node:vm';
const source=await fs.readFile(new URL('shopify/sections/arc-object-gallery.liquid',import.meta.url),'utf8');
const locales=JSON.parse(await fs.readFile(new URL('shopify/locales/en.default.json',import.meta.url),'utf8'));
const schema=JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
const checks=[];
function check(name,passed){checks.push({name,passed:Boolean(passed)});}
check('schema parses',schema.name==='ARC object gallery'&&schema.settings.length===7&&schema.blocks.length===1);
check('schema setting IDs unique',new Set(schema.settings.map(s=>s.id)).size===schema.settings.length);
check('block setting IDs unique',schema.blocks.every(b=>new Set(b.settings.map(s=>s.id)).size===b.settings.length));
check('all UI translation keys exist',[...source.matchAll(/'([a-z_.]+)'\s*\|\s*t/g)].every(([,key])=>key.split('.').reduce((a,b)=>a?.[b],locales)));
check('real product setting',schema.settings.some(s=>s.id==='product'&&s.type==='product'));
check('catalog variants and prices',source.includes('for variant in arc_product.variants')&&source.includes('variant.price | money_with_currency'));
check('native product form',source.includes("form 'product', arc_product, id: arc_form_id")&&source.includes('select name="id"')&&source.includes('name="quantity"')&&source.includes('name="add"'));
check('catalog availability',source.includes('variant.available')&&source.includes('data-available'));
check('quantity rules change with variant',source.includes('variant.quantity_rule.increment')&&source.includes('quantity.min=option.dataset.min'));
check('namespaced IDs',!/<[^>]+id="(?!Arc)/.test(source));
check('no fabricated cart handler',!source.includes('/cart/add.js')&&!source.includes('localStorage'));
new vm.Script(source.match(/<script>([\s\S]*?)<\/script>/)[1]);check('inline JS syntax',true);
const css=source.match(/{% stylesheet %}([\s\S]*?){% endstylesheet %}/)[1];check('CSS braces balanced',[...css].filter(c=>c==='{').length===[...css].filter(c=>c==='}').length);
function ratio(a,b){const luminance=hex=>{const parts=hex.match(/\w\w/g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return .2126*parts[0]+.7152*parts[1]+.0722*parts[2];};const x=luminance(a),y=luminance(b);return Number(((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(2));}
const contrast={inkOnPaper:ratio('172329','f8faf9'),mutedOnPaper:ratio('4b5960','f8faf9'),mutedOnMineral:ratio('4b5960','e4e9e9'),whiteOnSignal:ratio('ffffff','bd3d16'),signalOnPaper:ratio('bd3d16','f8faf9'),controlOnPaper:ratio('68777e','f8faf9'),controlOnMineral:ratio('68777e','e4e9e9')};
check('normal text contrast >= 4.5',Object.entries(contrast).filter(([k])=>!k.startsWith('control')).every(([,v])=>v>=4.5));check('control boundary contrast >= 3',Object.entries(contrast).filter(([k])=>k.startsWith('control')).every(([,v])=>v>=3));
const report={checks,contrast,passed:checks.every(c=>c.passed),scope:'Static structure, JSON, translation references, native-form intent, JS syntax and contrast calculations. This is not a Liquid compilation or live Shopify validation.',shopifyValidator:{attempted:true,result:'Could not start: ERR_MODULE_NOT_FOUND for @shopify/theme-check-common. No dependencies installed.'}};
await fs.writeFile(new URL('evidence/arc-source-checks.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
