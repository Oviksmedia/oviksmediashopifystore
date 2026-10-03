import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url)),repo=path.dirname(root);
const configs=JSON.parse(fs.readFileSync(path.join(root,'catalogs.json'),'utf8'));
const portfolio='https://oviks-morrow-portfolio.netlify.app/';
const source=name=>fs.readFileSync(path.join(root,'source',name),'utf8');
const titleFonts={rift:"Impact,'Arial Black',Arial,sans-serif",sable:"SableBodoni,Georgia,serif",daybreak:"'Daybreak Fredoka',Arial,sans-serif",arc:"'Arc Grotesk',Arial,sans-serif",'side-b':"'SideB Ultra',Georgia,serif"};
function write(file,content){content=content.replace(/^[ \t]+$/gm,'');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content.endsWith('\n')?content:content+'\n');}
function collect(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?collect(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
function storefront(slug){return slug==='rift'?path.join(repo,'morrow-portfolio/src/rift-demo.html'):path.join(repo,'morrow-portfolio/projects',slug,'demo.html');}
function nativeForm(index,button,radios=false){return `{% render 'product-buy', item_product: demo_product_${index}, form_id: 'home-product-${index}', button_class: '${button}', radios: ${radios} %}`;}

for(const [slug,config] of Object.entries(configs)){
  const theme=path.join(root,slug,'theme');for(const dir of ['layout','assets','sections','snippets','templates','config','locales'])fs.mkdirSync(path.join(theme,dir),{recursive:true});
  const original=fs.readFileSync(storefront(slug),'utf8').replace(/\r\n/g,'\n');
  const bodyClass=original.match(/<body[^>]*class="([^"]+)"/)[1];
  const assetRoot=slug==='rift'?path.join(repo,'morrow-portfolio/assets'):path.join(repo,'morrow-portfolio/projects',slug,'assets');
  const assets=collect(assetRoot).filter(file=>/\.(css|svg|png|jpe?g|webp|ttf|woff2?|txt)$/.test(file)&&(slug!=='rift'||path.basename(file).startsWith('rift')));
  const map=new Map(),names=new Set();
  for(const file of assets){const name=path.basename(file);if(names.has(name))throw new Error('Flat asset collision '+slug+'/'+name);names.add(name);map.set(path.relative(assetRoot,file).replaceAll('\\','/'),name);}
  for(const file of assets){const name=path.basename(file);if(file.endsWith('.css')){
    const css=fs.readFileSync(file,'utf8').replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,(all,quote,url)=>{
      if(/^(data:|https?:|#)/.test(url))return all;
      const relative=path.relative(assetRoot,path.resolve(path.dirname(file),url)).replaceAll('\\','/');
      if(!map.has(relative))throw new Error('Missing font/image '+slug+'/'+relative);
      return `url('${map.get(relative)}')`;
    });write(path.join(theme,'assets',name),css);
  }else fs.copyFileSync(file,path.join(theme,'assets',name));}
  const assetUrls=html=>html.replace(/(?:src|href)="assets\/([^"]+)"/g,(match,file)=>{
    if(!map.has(file))throw new Error('Missing asset '+slug+'/'+file);
    return match.slice(0,match.indexOf('=')+1)+`"{{ '${map.get(file)}' | asset_url }}"`;
  });
  const links=html=>html.replace(/href="(?:index\.html#work|index\.html)"/g,`href="${portfolio}#work"`).replace(new RegExp(`href="${slug}\\.html"`,'g'),`href="${portfolio}${slug}"`).replace(new RegExp(`href="${slug}-demo\\.html"`,'g'),'href="{{ routes.root_url }}"');
  let main=original.match(/<main[\s\S]*?<\/main>/)[0].replace(/<noscript>[\s\S]*?<\/noscript>/g,'');
  main=main.replace(/<form\b[\s\S]*?<\/form>/g,(form)=>{
    if(slug==='rift')return nativeForm(1,'rift-add',true);
    if(slug==='sable')return nativeForm(form.includes('sable-arc-form')?1:2,'sable-add',form.includes('sable-arc-form'));
    if(slug==='arc')return nativeForm(1,'arc-action',true);
    const handle=form.match(/data-daybreak-product="([^"]+)"/)[1];return nativeForm(config.products.findIndex(p=>p.handle===handle)+1,'daybreak-button');
  });
  if(slug==='side-b'){
    const handles={'night':'night-index','soft':'soft-static','after':'after-hours'};
    main=main.replace(/<button\b([^>]*data-product="([^"]+)"[^>]*)>([\s\S]*?)<\/button>/g,(match,attrs,key,content)=>{
      const handle=handles[key];if(!handle)throw new Error('Unknown record '+key);
      attrs=attrs.replace(/\s(?:data-product|type|aria-haspopup)="[^"]+"/g,'');
      return `<a${attrs} href="{{ all_products['${handle}'].url }}">${content}</a>`;
    });
    for(const [index,product] of config.products.entries())main=main.replace(`From £${product.prices[0].split('.')[0]}`,`{{ demo_product_${index+1}.price | money_with_currency }}`);
    main=main.replace(/<noscript>[\s\S]*?<\/noscript>/g,'');
  }
  if(slug==='rift')main=main.replace(/<p class="rift-price">[\s\S]*?<\/p>/,'');
  if(slug==='sable')main=main.replace('<p>$280 <span>USD</span></p>','').replace(/<p class="sable-fold-price">[\s\S]*?<\/p>/,'');
  if(slug==='daybreak')for(const [index,product] of config.products.entries())main=main.replace(`$${product.prices[0]} <span>/ 250 g</span>`,`{{ demo_product_${index+1}.price | money_with_currency }} <span>/ 250 g</span>`);
  if(slug==='arc')main=main.replace(/<p class="arc-product-price"[^>]*>[\s\S]*?<\/p>/,'').replace(/<p class="arc-small" id="arc-storage-note">[\s\S]*?<\/p>/,'<p class="arc-small">Native Shopify demo bag. Fictional product; no checkout or real fulfillment.</p>');
  if(slug==='sable'){
    main=main.replace('data-view="form"','data-view="form" data-gallery-src="assets/sable-arc-oxblood.webp" data-gallery-alt="Full form / Oxblood"').replace('data-view="detail"','data-view="detail" data-gallery-src="assets/sable-detail.webp" data-gallery-alt="Material detail / Oxblood reference"');
  }
  if(slug==='arc'){
    for(const [view,image,alt] of [['silver','arc-silver.webp','Studio view / Brushed aluminium'],['graphite','arc-graphite.webp','Studio view / Graphite'],['detail','arc-detail.webp','Material detail / Aluminium reference']])main=main.replace(`data-view="${view}"`,`data-view="${view}" data-gallery-src="assets/${image}" data-gallery-alt="${alt}"`);
  }
  main=main.replace(/data-gallery-src="assets\/([^"]+)"/g,(match,file)=>`data-gallery-src="{{ '${map.get(file)}' | asset_url }}"`);
  main=assetUrls(links(main));
  main=main.replace(/<h1\b([^>]*)>[\s\S]*?<\/h1>/,`<h1$1>{{ section.settings.hero_heading | escape | newline_to_br }}</h1>`);
  const heroImage=main.match(/<img\b[^>]*fetchpriority="high"[^>]*>/)?.[0];
  if(heroImage){const altered=heroImage.replace(/src="([^"]+)"/,`{% if section.settings.hero_image %}src="{{ section.settings.hero_image | image_url: width: 2000 }}"{% else %}src="$1"{% endif %}`);main=main.replace(heroImage,altered);}
  const productSettings=config.products.map(product=>({type:'product',id:'product_'+product.handle.replaceAll('-','_'),label:product.title}));
  const assignProducts=config.products.map((product,index)=>`{% liquid\n  assign demo_product_${index+1} = section.settings.product_${product.handle.replaceAll('-','_')}\n  if demo_product_${index+1} == blank\n    assign demo_product_${index+1} = all_products['${product.handle}']\n  endif\n%}`).join('\n');
  const schema={name:config.brand+' storefront',settings:[{type:'textarea',id:'hero_heading',label:'Hero heading',default:config.heroHeading},{type:'image_picker',id:'hero_image',label:'Hero image'},...productSettings],presets:[{name:config.brand+' storefront'}]};
  write(path.join(theme,'sections/storefront-home.liquid'),assignProducts+'\n'+main+'\n{% schema %}\n'+JSON.stringify(schema,null,2)+'\n{% endschema %}');
  const firstMain=original.indexOf('<main'),bodyStart=original.indexOf('>',original.indexOf('<body'))+1;
  let header=original.slice(bodyStart,firstMain).trim().replace(/<noscript>[\s\S]*?<\/noscript>/g,'').replace(/Browser-local demo bag/g,'Native Shopify demo bag').replace('Local demo · No checkout','Shopify demo · No checkout');
  header=header.replace(/<button\b([^>]*(?:bag|daybreak-open)[^>]*)>([\s\S]*?)<\/button>/g,(match,attrs,content)=>{
    const buttonClass=attrs.match(/class="([^"]+)"/)?.[1]||'';
    const count=content.replace(/<span\b[^>]*>0<\/span>/,'<span>{{ cart.item_count }}</span>');
    return `<a href="{{ routes.cart_url }}" class="${buttonClass} native-bag">${count}</a>`;
  });
  header=header.replace(/href="#([^"\s]+)"/g,'href="{{ routes.root_url }}#$1"').replace(/href="#"/g,'href="{{ routes.root_url }}"');
  // Skip links must always target the current page rather than the homepage.
  header=header.replace(new RegExp(`href="\\{\\{ routes.root_url \\}\\}#${config.mainId}"(?=[^>]*>Skip)`),'href="#'+config.mainId+'"');
  if(slug==='rift')header=header.replace('Self-initiated concept · Demo bag only · No checkout','Shopify development demo · Fictional products · No checkout');
  const footer=links(original.match(/<footer\b[\s\S]*?<\/footer>/)[0]).replace(/Static prototype; no Shopify integration\./g,'Working Shopify development demo. No real orders.').replace(/No real inventory, checkout, payment or Shopify integration in this HTML prototype\./g,'Working Shopify development demo. Fictional products; no checkout or fulfillment.').replace(/No checkout, payments, real inventory or Shopify connection\./g,'Shopify development demo. Fictional products; no checkout or fulfillment.');
  write(path.join(theme,'snippets/store-header.liquid'),'{% doc %}Brand navigation with native Shopify cart count.{% enddoc %}\n'+assetUrls(links(header)));
  write(path.join(theme,'snippets/store-footer.liquid'),'{% doc %}Brand footer and portfolio return link.{% enddoc %}\n'+assetUrls(footer));
  const replaceTokens=text=>text.replaceAll('__MAIN_ID__',config.mainId).replaceAll('__BRAND__',config.brand).replaceAll('__BUTTON__',slug==='daybreak'?'daybreak-button':'native-button');
  for(const name of ['native-product','native-cart','native-collection'])write(path.join(theme,'sections',name+'.liquid'),replaceTokens(source(name+'.liquid')));
  write(path.join(theme,'snippets/product-buy.liquid'),source('product-buy.liquid'));
  write(path.join(theme,'assets/store-commerce.js'),source('store-commerce.js'));
  write(path.join(theme,'assets/shopify-native.css'),source('shopify-native.css'));
  const variables=`:root{--native-paper:${config.colors.paper};--native-ink:${config.colors.ink};--native-accent:${config.colors.accent};--native-button-text:${config.colors.buttonText};--native-title-font:${titleFonts[slug]}}`;
  const head=`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="canonical" href="{{ canonical_url }}"><title>{{ page_title | escape }} — ${config.brand}</title><meta name="description" content="{{ page_description | default: shop.description | escape }}">{{ '${config.stylesheet}' | asset_url | stylesheet_tag }}{{ 'shopify-native.css' | asset_url | stylesheet_tag }}<style>${variables}</style>{{ content_for_header }}`;
  write(path.join(theme,'layout/theme.liquid'),`<!doctype html><html lang="{{ request.locale.iso_code }}"><head>${head}<script src="{{ 'store-commerce.js' | asset_url }}" defer></script></head><body class="${bodyClass}">{% render 'store-header' %}{{ content_for_layout }}{% render 'store-footer' %}</body></html>`);
  write(path.join(theme,'layout/password.liquid'),`<!doctype html><html lang="{{ request.locale.iso_code }}"><head>${head}</head><body class="${bodyClass}">{{ content_for_layout }}</body></html>`);
  write(path.join(theme,'sections/native-password.liquid'),`<main class="native-password"><p>OVIKS MEDIA / SELF-INITIATED SHOPIFY PROJECT</p><h1>${config.brand}</h1><p>A fictional brand with a working Shopify storefront. Enter the visitor password supplied in the portfolio.</p>{% form 'storefront_password' %}{{ form.errors | default_errors }}<label for="visitor-password">Visitor password</label><input id="visitor-password" type="password" name="password" autocomplete="current-password" required><button type="submit" class="native-button">Enter demo store ↗</button>{% endform %}<a class="native-product-link" href="${portfolio}${slug}">View the case study ↗</a></main>{% schema %}{"name":"Visitor access","settings":[]}{% endschema %}`);
  write(path.join(theme,'sections/native-page.liquid'),replaceTokens('<main id="__MAIN_ID__" class="native-page" tabindex="-1"><h1>{{ page.title | escape }}</h1><div class="native-description">{{ page.content }}</div></main>{% schema %}{"name":"Page","settings":[]}{% endschema %}'));
  write(path.join(theme,'sections/native-search.liquid'),replaceTokens('<main id="__MAIN_ID__" class="native-page" tabindex="-1"><h1>Search the collection.</h1><form action="{{ routes.search_url }}" method="get" class="native-buy"><label for="search-query">Search products</label><input id="search-query" type="search" name="q" value="{{ search.terms | escape }}"><input type="hidden" name="type" value="product"><button class="native-button" type="submit">Search</button></form>{% paginate search.results by 20 %}<div class="native-collection-grid">{% for result in search.results %}<article><a href="{{ result.url }}"><h2>{{ result.title | escape }}</h2></a></article>{% endfor %}</div>{{ paginate | default_pagination }}{% endpaginate %}</main>{% schema %}{"name":"Search","settings":[]}{% endschema %}'));
  write(path.join(theme,'sections/native-404.liquid'),replaceTokens('<main id="__MAIN_ID__" class="native-page" tabindex="-1"><p>404</p><h1>Let’s find your way back.</h1><a class="native-button" href="{{ routes.root_url }}">Explore __BRAND__ ↗</a></main>{% schema %}{"name":"Page not found","settings":[]}{% endschema %}'));
  for(const [template,type] of Object.entries({index:'storefront-home',product:'native-product',cart:'native-cart',collection:'native-collection',password:'native-password',page:'native-page',search:'native-search','404':'native-404'})){
    const settings=template==='index'?Object.fromEntries(config.products.map(product=>['product_'+product.handle.replaceAll('-','_'),product.handle])):{};
    write(path.join(theme,'templates',template+'.json'),JSON.stringify({sections:{main:{type,settings}},order:['main']},null,2));
  }
  write(path.join(theme,'config/settings_schema.json'),JSON.stringify([{name:'theme_info',theme_name:config.brand+' Portfolio',theme_version:'1.0.0',theme_author:'Oviks Media',theme_documentation_url:portfolio+slug,theme_support_url:portfolio}],null,2));
  write(path.join(theme,'config/settings_data.json'),JSON.stringify({current:{}},null,2));
  write(path.join(theme,'locales/en.default.json'),'{}');
  console.log(config.brand+': complete theme generated / '+config.products.length+' product definitions');
}
