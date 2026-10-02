import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const theme = path.join(root, '../shopify-skincare/theme');
const dist = path.join(root, 'dist');
fs.mkdirSync(path.join(dist, 'assets'), {recursive: true});

// Edit the authored sources, then regenerate the deployable dist folder.
for (const file of fs.readdirSync(path.join(root, 'assets'))) {
  if (file.endsWith('-preview.png')) continue; // Review evidence belongs in docs, not deploy assets.
  fs.copyFileSync(path.join(root, 'assets', file), path.join(dist, 'assets', file));
}
for (const name of ['morrow-premium.css', 'morrow-case-study.css']) {
  fs.copyFileSync(path.join(theme, 'assets', name), path.join(dist, 'assets', name));
}
const favicon = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#202722"/><text x="16" y="23" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="20" fill="#fff">O</text></svg>');
const header = (active) => `<header class="portfolio-header"><a class="portfolio-wordmark" href="index.html" aria-label="Oviks Media portfolio home">OVIKS<span>MEDIA</span><span class="wordmark-dot" aria-hidden="true"></span></a><nav aria-label="Portfolio navigation"><a href="index.html#work"${active === 'index' ? ' aria-current="page"' : ''}>Selected work</a><a href="morrow.html"${active === 'morrow' ? ' aria-current="page"' : ''}>Morrow</a><a href="rift.html"${active === 'rift' ? ' aria-current="page"' : ''}>RIFT</a></nav></header>`;
const footer = `<footer class="portfolio-footer"><div><a class="footer-name" href="index.html">Oviks Media</a><p>Graphic design &amp; Shopify storefronts.<br>Self-initiated concepts. AI-assisted production.</p></div><nav aria-label="Footer navigation"><a href="index.html#work">Selected work</a><a href="https://github.com/Oviksmedia/oviksmediashopifystore">Project source on GitHub ↗</a><a href="#main">Back to top ↑</a></nav><span>© 2026 Oviks Media</span></footer>`;
function shell({name, title, description, content, styles = ''}) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Oviks Media</title><meta name="description" content="${description}"><link rel="icon" href="${favicon}"><link rel="stylesheet" href="assets/portfolio.css">${styles}</head><body class="portfolio-page page-${name}"><a class="skip-link" href="#main">Skip to content</a>${header(name)}<main id="main" tabindex="-1">${content}</main>${footer}</body></html>`;
}
let morrow = fs.readFileSync(path.join(theme, 'sections/morrow-case-study.liquid'), 'utf8').split('{% schema %}')[0];
morrow = morrow.replace(/\{\{ '([^']+)' \| asset_url \| stylesheet_tag \}\}/g, '')
  .replace(/\{\{ '([^']+)' \| asset_url \}\}/g, 'assets/$1')
  .replaceAll('{{ routes.root_url }}', 'https://oviks-portfolio-demo.myshopify.com/')
  .replaceAll('{{ routes.collections_url }}', 'https://oviks-portfolio-demo.myshopify.com/collections');
morrow = morrow.replace('assets/morrow-campaign-v2.png', 'assets/morrow-campaign.webp')
  .replace('assets/morrow-ritual-v2.png', 'assets/morrow-ritual.webp');
const screens = `<section class="mrw-case-screens" id="screens" aria-labelledby="screens-title"><div class="screen-heading"><div><p class="mrw-kicker">THE SHOPIFY EXPERIENCE</p><h2 id="screens-title">Follow the <em>shopping journey.</em></h2></div><p>Browser captures of the existing Shopify demo on 3 October 2026. The typography refinements in this branch await a separate theme upload.</p></div><div class="screen-grid"><figure><a href="assets/morrow-shopify-collection.jpg" aria-label="Open full collection screenshot"><img src="assets/morrow-shopify-collection.jpg" alt="Morrow Shopify collection showing cleanser, serum and cream with illustrative prices" width="1440" height="1000" loading="lazy"></a><figcaption><span>01 / Discover</span>All three essentials, in one focused collection.</figcaption></figure><figure><a href="assets/morrow-shopify-product.jpg" aria-label="Open full product screenshot"><img src="assets/morrow-shopify-product.jpg" alt="Morrow cleanser product page with product image, price, size, quantity and add to demo bag button" width="1440" height="1000" loading="lazy"></a><figcaption><span>02 / Choose</span>Product details and a clear path to the bag.</figcaption></figure></div><details class="bag-evidence"><summary>03 / The demo bag — see the quantity update</summary><figure><img src="assets/morrow-shopify-bag.jpg" alt="Shopify demo bag containing two Daily Cleansers at a 56 dollar subtotal" width="1440" height="1000" loading="lazy"><figcaption>One cleanser: $28. Two cleansers: $56. Removing the item returns the bag to its empty state. Checked on 3 October 2026.</figcaption></figure></details><aside class="demo-callout"><div><h3>Explore the Shopify build.</h3><p>Visitor password: <strong>suweid</strong>. Enter it on the storefront password screen. Fictional products; no purchase or fulfillment.</p></div><a class="mrw-button" href="https://oviks-portfolio-demo.myshopify.com/">Open Shopify demo <span aria-hidden="true">↗</span></a></aside></section>`;
morrow = morrow.replace('<section class="mrw-case-disclosure"', screens + '<section class="mrw-case-disclosure"');
morrow = '<div class="case-breadcrumb"><a href="index.html#work">← Selected work</a><span>01 / Morrow</span></div>' + morrow;
const pages = [
  {name:'index', title:'Brand worlds. Working storefronts.', description:'Selected self-initiated graphic design and storefront projects by Oviks Media: Morrow skincare on Shopify and RIFT cycling apparel.', content:fs.readFileSync(path.join(root,'src/index.html'),'utf8')},
  {name:'morrow', title:'Morrow — skincare identity & Shopify', description:'A self-initiated skincare identity and working Shopify storefront. Explore the brief, design decisions, product pages and demo bag.', content:morrow, styles:'<link rel="stylesheet" href="assets/morrow-premium.css"><link rel="stylesheet" href="assets/morrow-case-study.css">'},
  {name:'rift', title:'RIFT — cycling identity & storefront concept', description:'A self-initiated cycling apparel concept: bold identity, campaign art direction and an interactive storefront prototype.', content:fs.readFileSync(path.join(root,'src/rift.html'),'utf8'), styles:'<link rel="stylesheet" href="assets/rift.css">'}
];
for (const page of pages) fs.writeFileSync(path.join(dist, page.name + '.html'), shell(page));
fs.copyFileSync(path.join(root,'src/rift-demo.html'), path.join(dist,'rift-demo.html'));

// Validate each generated page, local asset, page link and fragment.
for (const filename of ['index.html','morrow.html','rift.html','rift-demo.html']) {
  const html = fs.readFileSync(path.join(dist, filename), 'utf8');
  if (html.includes('{{') || html.includes('{%')) throw new Error(`Unrendered Liquid in ${filename}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (ids.length !== new Set(ids).size) throw new Error(`Duplicate ids in ${filename}`);
  for (const [, reference] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(https?:|data:|mailto:)/.test(reference)) continue;
    const [file, fragment] = reference.split('#');
    const target = file ? path.resolve(dist, file) : path.join(dist, filename);
    if (!fs.existsSync(target)) throw new Error(`${filename}: missing ${reference}`);
    if (fragment && path.extname(target) === '.html' && !fs.readFileSync(target, 'utf8').includes(`id="${fragment}"`)) throw new Error(`${filename}: broken fragment ${reference}`);
  }
}
console.log('Built and validated 4 portfolio pages, local assets, links and fragments.');
