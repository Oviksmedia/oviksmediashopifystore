import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const theme = path.join(root, '../shopify-skincare/theme');
const dist = path.join(root, 'dist');
fs.mkdirSync(path.join(dist, 'assets'), {recursive: true});
const conceptOrder = ['sable', 'daybreak', 'arc', 'side-b'];
const concepts = conceptOrder.flatMap(slug => {
  const folder = path.join(root, 'projects', slug);
  if (!fs.existsSync(path.join(folder, 'integration.json'))) return [];
  const spec = JSON.parse(fs.readFileSync(path.join(folder, 'integration.json'), 'utf8'));
  if (spec.slug !== slug) throw new Error(`Wrong module identity: ${slug}`);
  return [{slug, folder, spec}];
});
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stores = JSON.parse(fs.readFileSync(path.join(root,'../shopify-stores/stores.json'),'utf8'));
function shopifyCase(content, slug) {
  const store = stores[slug];
  if (store.status !== 'published') throw new Error(`Shopify store is not published: ${slug}`);
  const url = `https://${store.domain}/`;
  content = content.replaceAll(`${slug}-demo.html`,url);
  // Show access instructions beside the first storefront action.
  content = content.replace(/(<a\b[^>]*href="https:\/\/[^\"]+\.myshopify\.com\/[^\"]*"[^>]*>[\s\S]*?<\/a>)/,
    `$1<p class="store-access-note">Visitor password: <strong>${escapeHtml(store.password)}</strong></p>`);
  return content + `<aside class="shopify-access"><div><p class="eyebrow">WORKING SHOPIFY DEMO</p><h2>Explore the store.</h2><p>Visitor password: <strong>${escapeHtml(store.password)}</strong>. Enter it on the store’s password screen. This is a fictional portfolio project with native Shopify products and a demo bag. No checkout or real fulfillment.</p></div><a class="portfolio-link" href="${url}">Open Shopify demo ↗</a></aside>`;
}
const assetOwners = new Set();
function copyConceptAssets(source, destination) {
  fs.mkdirSync(destination, {recursive:true});
  for (const entry of fs.readdirSync(source, {withFileTypes:true})) {
    const from = path.join(source, entry.name), to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyConceptAssets(from, to);
    else if (entry.isFile()) {
      if (assetOwners.has(to)) throw new Error(`Asset collision: ${to}`);
      assetOwners.add(to);
      fs.copyFileSync(from, to);
    } else throw new Error(`Unsupported asset entry: ${from}`);
  }
}

// Edit the authored sources, then regenerate the deployable dist folder.
for (const file of fs.readdirSync(path.join(root, 'assets'))) {
  if (file.endsWith('-preview.png')) continue; // Review evidence belongs in docs, not deploy assets.
  fs.copyFileSync(path.join(root, 'assets', file), path.join(dist, 'assets', file));
  assetOwners.add(path.join(dist, 'assets', file));
}
for (const name of ['morrow-premium.css', 'morrow-case-study.css']) {
  const css = fs.readFileSync(path.join(theme, 'assets', name),'utf8').replaceAll('morrow-catalog-v2.png','morrow-catalog.webp');
  fs.writeFileSync(path.join(dist, 'assets', name), css);
  assetOwners.add(path.join(dist, 'assets', name));
}
for (const concept of concepts) copyConceptAssets(path.join(concept.folder, 'assets'), path.join(dist, 'assets'));
const favicon = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#202722"/><text x="16" y="23" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="20" fill="#fff">O</text></svg>');
const header = (active) => `<header class="portfolio-header"><a class="portfolio-wordmark" href="index.html" aria-label="Overcomer Israel — Oviks Media portfolio home">OVIKS<span>MEDIA</span><span class="wordmark-dot" aria-hidden="true"></span></a><nav aria-label="Portfolio navigation"><a href="index.html#work"${active === 'index' ? ' aria-current="page"' : ''}>Selected work</a><a href="index.html#approach">Design approach</a><a href="index.html#contact">Contact</a></nav></header>`;
const footer = `<footer class="portfolio-footer"><div><a class="footer-name" href="index.html#contact">Overcomer Israel</a><p>Oviks Media · Graphic design &amp; Shopify</p><a class="footer-email" href="mailto:oviks.israel@gmail.com">oviks.israel@gmail.com</a></div><nav aria-label="Footer navigation"><a href="index.html#work">Selected work</a><a href="index.html#contact">About &amp; contact</a><a href="https://github.com/Oviksmedia/oviksmediashopifystore">Build files on GitHub ↗</a><a href="#main">Back to top ↑</a></nav><span>© 2026 Overcomer Israel · Oviks Media</span></footer>`;
function shell({name, title, description, content, styles = ''}) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Overcomer Israel — Oviks Media</title><meta name="author" content="Overcomer Israel"><meta name="description" content="${description}"><link rel="icon" href="${favicon}"><link rel="stylesheet" href="assets/portfolio.css">${styles}</head><body class="portfolio-page page-${name}"><a class="skip-link" href="#main">Skip to content</a>${header(name)}<main id="main" tabindex="-1">${content}</main>${footer}</body></html>`;
}
const allProjects = [{slug:'morrow',title:'Morrow'},{slug:'rift',title:'RIFT'},...concepts.map(c=>({slug:c.slug,title:c.spec.title}))];
function projectNavigation(name) {
  if (name === 'index') return '';
  return `<nav class="portfolio-project-nav" aria-label="Explore portfolio projects"><p>Explore another project</p><div>${allProjects.map(project=>`<a href="${project.slug}.html"${project.slug===name?' aria-current="page"':''}>${escapeHtml(project.title)}</a>`).join('')}</div></nav>`;
}
function conceptCard({slug, spec}, index) {
  const cover = spec.cover;
  const coverPath = cover.path || cover.src || cover.asset;
  if (!coverPath || !coverPath.startsWith('assets/')) throw new Error(`Missing concept cover: ${slug}`);
  return `<article class="project-card project-${slug}"><a class="project-cover" href="${slug}.html" aria-label="View ${escapeHtml(spec.title)} case study"><img src="${escapeHtml(coverPath)}" alt="${escapeHtml(cover.alt)}" width="${cover.width || 1536}" height="${cover.height || 1024}" loading="lazy"><span class="cover-label">${escapeHtml(spec.title)} / ${escapeHtml(spec.category)}</span><span class="cover-arrow" aria-hidden="true">↗</span></a><div class="project-heading"><h3><a href="${slug}.html">${escapeHtml(spec.title)}</a></h3><span>${String(index+3).padStart(2,'0')}</span></div><p class="project-scope">${escapeHtml(spec.category)} · Identity · Shopify / Liquid</p><p class="project-summary">${escapeHtml(spec.summary)}</p><div class="project-actions"><a class="portfolio-link" href="${slug}.html">View case study <span aria-hidden="true">↗</span></a><a href="https://${stores[slug].domain}/">Shopify demo ↗</a></div><p class="project-note">Self-initiated concept · Demo password: <strong>${escapeHtml(stores[slug].password)}</strong></p></article>`;
}
let overview = fs.readFileSync(path.join(root,'src/index.html'),'utf8');
overview = overview.replace('<!-- concept-projects -->', concepts.map(conceptCard).join('\n')).replaceAll('{{project_count}}', String(allProjects.length).padStart(2,'0'));
let morrow = fs.readFileSync(path.join(root, 'src/morrow.html'), 'utf8');
morrow = morrow.replace(/\{\{ '([^']+)' \| asset_url \| stylesheet_tag \}\}/g, '')
  .replace(/\{\{ '([^']+)' \| asset_url \}\}/g, 'assets/$1')
  .replaceAll('{{ routes.root_url }}', 'https://oviks-portfolio-demo.myshopify.com/')
  .replaceAll('{{ routes.collections_url }}', 'https://oviks-portfolio-demo.myshopify.com/collections');
morrow = morrow.replace('assets/morrow-campaign-v2.png', 'assets/morrow-campaign.webp')
  .replace('assets/morrow-ritual-v2.png', 'assets/morrow-ritual.webp');
const screens = `<section class="mrw-case-screens" id="screens" aria-labelledby="screens-title"><div class="screen-heading"><div><p class="mrw-kicker">THE SHOPIFY EXPERIENCE</p><h2 id="screens-title">Follow the <em>shopping journey.</em></h2></div><p>Explore the collection, product details and native Shopify bag. These captures show the demo on 3 October 2026.</p></div><div class="screen-grid"><figure><a href="assets/morrow-shopify-collection.jpg" aria-label="Open full collection screenshot"><img src="assets/morrow-shopify-collection.jpg" alt="Morrow Shopify collection showing cleanser, serum and cream with illustrative prices" width="1440" height="1000" loading="lazy"></a><figcaption><span>01 / Discover</span>All three essentials, in one focused collection.</figcaption></figure><figure><a href="assets/morrow-shopify-product.jpg" aria-label="Open full product screenshot"><img src="assets/morrow-shopify-product.jpg" alt="Morrow cleanser product page with product image, price, size, quantity and add to demo bag button" width="1440" height="1000" loading="lazy"></a><figcaption><span>02 / Choose</span>Product details and a clear path to the bag.</figcaption></figure></div><details class="bag-evidence"><summary>03 / The demo bag — see the quantity update</summary><figure><img src="assets/morrow-shopify-bag.jpg" alt="Shopify demo bag containing two Daily Cleansers at a 56 dollar subtotal" width="1440" height="1000" loading="lazy"><figcaption>One cleanser: $28. Two cleansers: $56. Removing the item returns the bag to its empty state. Checked on 3 October 2026.</figcaption></figure></details><aside class="demo-callout"><div><h3>Explore the Shopify build.</h3><p>Visitor password: <strong>suweid</strong>. Enter it on the storefront password screen. Fictional products; no purchase or fulfillment.</p></div><a class="mrw-button" href="https://oviks-portfolio-demo.myshopify.com/">Open Shopify demo <span aria-hidden="true">↗</span></a></aside></section>`;
morrow = morrow.replace('<section class="mrw-case-disclosure"', screens + '<section class="mrw-case-disclosure"');
morrow = '<div class="case-breadcrumb"><a href="index.html#work">← Selected work</a><span>01 / Morrow</span></div>' + morrow;
const pages = [
  {name:'index', title:'Graphic design & Shopify portfolio for FullPond', description:'Overcomer Israel’s portfolio prepared for FullPond’s Senior Graphic & Shopify Designer role. Six brand concepts, case studies and working Shopify demos.', content:overview},
  {name:'morrow', title:'Morrow — skincare identity & Shopify', description:'A self-initiated skincare identity and working Shopify storefront. Explore the brief, design decisions, product pages and demo bag.', content:morrow, styles:'<link rel="stylesheet" href="assets/morrow-premium.css"><link rel="stylesheet" href="assets/morrow-case-study.css">'},
  {name:'rift', title:'RIFT — cycling identity & Shopify', description:'A self-initiated cycling apparel concept: bold identity, campaign art direction and a working Shopify storefront.', content:shopifyCase(fs.readFileSync(path.join(root,'src/rift.html'),'utf8'),'rift'), styles:'<link rel="stylesheet" href="assets/rift.css">'}
];
for (const {slug,folder,spec} of concepts) {
  let content = fs.readFileSync(path.join(folder,spec.caseFile || 'case.html'),'utf8');
  content = content.replace(/^\s*<main\b([^>]*)>/, '<article$1>').replace(/<\/main>\s*$/, '</article>');
  const caseScript = path.join(folder,'assets',slug+'-case.js');
  const caseStyles = spec.styles || spec.stylesheets || spec.case?.styles || [`assets/${slug}.css`];
  const styles = caseStyles.map(file=>`<link rel="stylesheet" href="${escapeHtml(file)}">`).join('') + (fs.existsSync(caseScript)?`<script src="assets/${slug}-case.js" defer></script>`:'');
  pages.push({name:slug,title:`${spec.title} — ${spec.category} & Shopify`,description:escapeHtml(spec.summary),content:shopifyCase(content,slug),styles});
  fs.copyFileSync(path.join(folder,spec.demoFile || 'demo.html'),path.join(dist,slug+'-demo.html'));
}
for (const page of pages) fs.writeFileSync(path.join(dist, page.name + '.html'), shell({...page,content:page.content+projectNavigation(page.name)}));
fs.copyFileSync(path.join(root,'src/rift-demo.html'), path.join(dist,'rift-demo.html'));

// Validate each generated page, local asset, page link and fragment.
const generatedPages = [...pages.map(page=>page.name+'.html'), 'rift-demo.html', ...concepts.map(c=>c.slug+'-demo.html')];
for (const filename of generatedPages) {
  const html = fs.readFileSync(path.join(dist, filename), 'utf8');
  if (html.includes('{{') || html.includes('{%')) throw new Error(`Unrendered Liquid in ${filename}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (ids.length !== new Set(ids).size) throw new Error(`Duplicate ids in ${filename}`);
  if ([...html.matchAll(/<main\b/g)].length !== 1) throw new Error(`Expected one main landmark in ${filename}`);
  for (const [, reference] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(https?:|data:|mailto:)/.test(reference)) continue;
    const [file, fragment] = reference.split('#');
    const target = file ? path.resolve(dist, file) : path.join(dist, filename);
    if (!fs.existsSync(target)) throw new Error(`${filename}: missing ${reference}`);
    if (fragment && path.extname(target) === '.html' && !fs.readFileSync(target, 'utf8').includes(`id="${fragment}"`)) throw new Error(`${filename}: broken fragment ${reference}`);
  }
}
function validateStyles(folder) {
  for (const entry of fs.readdirSync(folder,{withFileTypes:true})) {
    const file = path.join(folder,entry.name);
    if (entry.isDirectory()) validateStyles(file);
    else if (entry.name.endsWith('.css')) {
      for (const [, reference] of fs.readFileSync(file,'utf8').matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g)) {
        if (/^(data:|https?:|#)/.test(reference)) continue;
        if (!fs.existsSync(path.resolve(folder,reference.split(/[?#]/)[0]))) throw new Error(`Missing CSS asset: ${reference} in ${file}`);
      }
    }
  }
}
validateStyles(path.join(dist,'assets'));
console.log(`Built and validated ${generatedPages.length} portfolio pages for ${allProjects.length} projects, assets, links, fragments and main landmarks.`);
