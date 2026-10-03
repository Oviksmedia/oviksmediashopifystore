import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const stores=JSON.parse(fs.readFileSync(path.join(root,'stores.json'),'utf8'));
const configs=JSON.parse(fs.readFileSync(path.join(root,'catalogs.json'),'utf8'));
const published=process.argv.includes('--published');
const results=[];
// Independent visitor sessions exercise Shopify's actual HTTP forms without JS.
for(const [slug,config] of Object.entries(configs)){
  const store=stores[slug],origin='https://'+store.domain,cookies=new Map();
  const query=published?'':'?preview_theme_id='+store.themeId;
  async function request(url,options={}){
    url=new URL(url,origin);assert.equal(url.hostname,store.domain);
    const response=await fetch(url,{...options,redirect:'manual',headers:{'User-Agent':'Oviks-Portfolio-Verification/1.0',Accept:'text/html',Cookie:[...cookies].map(([k,v])=>k+'='+v).join('; '),...options.headers}});
    for(const line of response.headers.getSetCookie()){const pair=line.split(';')[0],equal=pair.indexOf('=');cookies.set(pair.slice(0,equal),pair.slice(equal+1));}
    if(response.status>=300&&response.status<400){return request(response.headers.get('location'));}
    assert.equal(response.status,200,'HTTP '+response.status+' at '+url.pathname);
    return response.text();
  }
  let html=await request('/'+query);
  assert.match(html,/name="password"/,'Fresh visitor sees password form');
  await request('/password',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({form_type:'storefront_password',utf8:'✓',password:store.password}).toString()});
  html=await request('/'+query);
  assert.match(html,/store-commerce\.js/,'Correct custom theme after visitor login');
  assert.doesNotMatch(html,/Liquid error|translation missing/i);
  const receipt=JSON.parse(fs.readFileSync(path.join(root,slug,'catalog-receipt.json'),'utf8'));
  const receiptProducts=receipt.products;
  const collection=await request('/collections/all'+query);
  for(const product of receiptProducts){
    assert.match(collection,new RegExp('/products/'+product.handle),'Published collection product '+product.handle);
    const page=await request('/products/'+product.handle+query);
    assert.match(page,/class="native-buy"/,'Native product form');
    assert.doesNotMatch(page,/Liquid error|translation missing/i);
    for(const variant of product.variants.nodes){assert.ok(page.includes('value="'+variant.id.split('/').pop()+'"'),'Catalog variant rendered '+variant.title);}
  }
  const product=receiptProducts[0],variant=product.variants.nodes.at(-1),id=variant.id.split('/').pop();
  html=await request('/cart/add',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({id,quantity:'1',return_to:'/cart'+query}).toString()});
  assert.match(html,/id="native-cart-form"/,'Native cart after add');
  assert.ok(html.includes(variant.title),'Exact chosen variant in cart');
  const unit=Number(variant.price);
  assert.ok(html.includes(unit.toFixed(2)),'Actual unit price');
  html=await request('/cart',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({'updates[]':'2',update:'Update demo bag'}).toString()});
  assert.ok(/name="updates\[\]"[^>]*value="2"/.test(html),'Server-side quantity update');
  assert.ok(html.includes((unit*2).toFixed(2)),'Recalculated subtotal');
  const remove=html.match(/href="([^"]+)"[^>]*aria-label="Remove /)?.[1];assert.ok(remove,'Native removal URL');
  html=await request(remove.replaceAll('&amp;','&'));
  assert.match(html,/Your bag is empty\./,'Native removal and empty state');
  assert.match(html,/Explore the collection/,'Empty-state recovery');
  results.push({slug,domain:store.domain,themeId:store.themeId,mode:published?'published':'draft',visitorAccess:true,products:receiptProducts.length,variants:receiptProducts.flatMap(p=>p.variants.nodes).length,chosenVariant:variant.title,unitPrice:unit,updatedQuantity:2,updatedSubtotal:unit*2,cartEmptyAfterRemoval:true,transport:'HTTP form posts with fresh cookies; no JavaScript',checkedAt:new Date().toISOString()});
  console.log(slug+': visitor access, collection, every product/variant, native add/update/remove PASS');
}
fs.mkdirSync(path.join(root,'evidence'),{recursive:true});
fs.writeFileSync(path.join(root,'evidence',published?'published-http.json':'draft-http.json'),JSON.stringify(results,null,2)+'\n');
