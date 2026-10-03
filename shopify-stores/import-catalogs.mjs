import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const catalogs=JSON.parse(fs.readFileSync(path.join(root,'catalogs.json'),'utf8'));
const cli=process.env.SHOPIFY_CLI_ENTRY || path.join(os.homedir(),'AppData/Roaming/npm/node_modules/@shopify/cli/bin/run.js');
if(!fs.existsSync(cli)) throw new Error('Set SHOPIFY_CLI_ENTRY to the existing Shopify CLI entry. No install is performed.');
const selected=process.argv.slice(2);const slugs=selected.length?selected:Object.keys(catalogs);
for(const slug of slugs) if(!catalogs[slug]) throw new Error('Unknown demo '+slug);
function execute(slug,operation,variables){
  const directory=path.join(root,slug,'operations');fs.mkdirSync(directory,{recursive:true});
  const args=['store','execute','--store',catalogs[slug].domain,'--query-file',path.join(root,'operations',operation+'.graphql'),'--version','2026-10','--json'];
  if(variables){const file=path.join(directory,operation+'-variables.json');fs.writeFileSync(file,JSON.stringify(variables,null,2)+'\n');args.push('--variable-file',file,'--allow-mutations');}
  const result=spawnSync(process.execPath,[cli,...args],{encoding:'utf8',env:{...process.env,CI:'1'},timeout:180000,maxBuffer:5*1024*1024});
  if(result.error) throw result.error;
  if(result.status!==0) throw new Error(slug+'/'+operation+': '+result.stderr+' '+result.stdout);
  const data=JSON.parse(result.stdout);
  if(data.errors?.length) throw new Error(JSON.stringify(data.errors));
  return data.data || data;
}
for(const slug of slugs){
  const config=catalogs[slug],info=execute(slug,'bootstrap');
  if(info.shop.myshopifyDomain!==config.domain) throw new Error('Wrong target store for '+slug);
  if(info.shop.currencyCode!==config.currency) throw new Error('Store currency differs from designed currency: '+slug+' '+info.shop.currencyCode);
  const publication=info.publications.nodes.find(node=>node.name==='Online Store');
  if(!publication)throw new Error('Online Store publication missing for '+slug);
  const receipt={domain:config.domain,checkedAt:new Date().toISOString(),currency:info.shop.currencyCode,products:[]};
  const receiptFile=path.join(root,slug,'catalog-receipt.json');
  for(const product of config.products){
    const files=product.images.map((image,index)=>({originalSource:'https://oviks-morrow-portfolio.netlify.app/assets/'+image,filename:image,alt:product.title+' / '+(index===0?'Product view':'Additional concept view'),contentType:'IMAGE',duplicateResolutionMode:'REPLACE'}));
    const input={handle:product.handle,title:product.title,descriptionHtml:'<p>'+product.description+'</p><p>Self-initiated portfolio concept by Oviks Media. AI-generated product imagery. No real purchase or fulfillment.</p>',status:'ACTIVE',vendor:product.vendor||config.brand,productType:product.type,tags:['Oviks Media','Fictional portfolio concept',config.brand],files,productOptions:[{name:product.option,position:1,values:product.values.map(name=>({name}))}],variants:product.values.map((value,index)=>({optionValues:[{optionName:product.option,name:value}],price:product.prices[index]||product.prices[0],inventoryItem:{tracked:false,sku:slug+'-'+product.handle+'-'+(index+1)},inventoryPolicy:'CONTINUE',taxable:false,...(product.variantImages?{file:files[product.variantImages[index]]}:{})}))};
    const result=execute(slug,'product-set',{identifier:{handle:product.handle},input}).productSet;
    if(result.userErrors.length)throw new Error(slug+'/'+product.handle+': '+JSON.stringify(result.userErrors));
    if(result.product.variants.nodes.length!==product.values.length)throw new Error('Variant count mismatch for '+slug+'/'+product.handle);
    const published=execute(slug,'publish',{id:result.product.id,publication:publication.id}).publishablePublish;
    if(published.userErrors.length)throw new Error(JSON.stringify(published.userErrors));
    receipt.products.push(result.product);fs.writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n');
    console.log(slug+': '+product.title+' / '+result.product.variants.nodes.length+' variants published to Online Store');
  }
}
