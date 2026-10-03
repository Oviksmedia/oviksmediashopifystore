# Portfolio maintainer guide

## Sources and build

- `morrow-portfolio/src/`: authored overview, Morrow and RIFT case studies.
- `morrow-portfolio/projects/{sable,daybreak,arc,side-b}/`: authored case studies, integration specs, imagery, fonts/licenses and retained HTML prototypes.
- `morrow-portfolio/build-portfolio.mjs`: generates and checks all twelve portfolio pages; inserts published Shopify access details.
- `morrow-portfolio/assets/portfolio.css`: shared portfolio layout.
- `morrow-portfolio/dist/`: generated Netlify deployment. Edit the authored files, then rebuild.
- `shopify-stores/catalogs.json`: authored five-brand catalog inputs.
- `shopify-stores/build-themes.mjs` and `source/`: complete Liquid theme generation and shared native shopping components.
- `shopify-stores/{slug}/theme/`: generated complete themes. Do not edit generated copies alone.
- `shopify-stores/stores.json`: store domains, visitor passwords and published theme IDs.
- `shopify-skincare/theme/`: existing independent Morrow theme.
- `docs/shopify-migration.md` and `shopify-stores/evidence/`: migration and verification handover.

The original browser demos and older module Liquid proposals remain as historical sources. Primary portfolio links now use Shopify; current Shopify work should use the complete themes under `shopify-stores/`.

Node.js is sufficient for building and previewing; no package installation is required.

```sh
node shopify-stores/build-themes.mjs
node morrow-portfolio/build-portfolio.mjs
node morrow-portfolio/preview.mjs
```

Open http://127.0.0.1:4391/. Keep the project folders beside one another; the portfolio builder reads the store access manifest.

## Shopify edits and verification

Use your own authorized Shopify CLI session. Account access is separate from cloning GitHub. Do not commit authentication tokens or session files.

```sh
shopify theme check --path shopify-stores/rift/theme
shopify theme push --store rift-portfolio-demo.myshopify.com --path shopify-stores/rift/theme --unpublished
node shopify-stores/verify-storefronts.mjs --published
```

The final command uses fresh visitor sessions, renders all ten product pages and twenty-eight variant IDs, and exercises one fictional add/update/remove bag flow per store without JavaScript. It does not access admin or place an order. Review drafts before publishing them. Theme uploads do not import products.

`shopify-stores/import-catalogs.mjs` validates each exact store domain and currency before catalog writes. Stable handles support retries. Product/publication access must be authorized separately for each store.

Homepage heading, hero image and product choices are also editable through the theme editor. Capture merchant setting changes before regeneration/upload if you want to preserve them.

## Deployment and handover

GitHub: https://github.com/Oviksmedia/oviksmediashopifystore

Netlify project: `oviksmedia-portfolio`, https://oviksmedia-portfolio.netlify.app/. Site ID: `649edcb7-78dc-4c1b-aa24-970925a92379`. Deploy only the rebuilt `morrow-portfolio/dist` from this repository. Sibling standalone folders outside this repository are older copies. GitHub pushes do not automatically update Shopify.

The project was renamed from `oviks-morrow-portfolio` on 3 October 2026 to represent all six brands. Use the new address for applications and shared links. Earlier verification receipts retain the address used when their checks ran. The rename keeps the existing deployment and Shopify store access details.

All stores remain password-protected development demonstrations with fictional products. Checkout, payments, real fulfillment, manufacturing, physical-device and screen-reader validation are outside this release. See the migration handover for precisely what was tested.

## Candidate presentation

The portfolio identifies Overcomer Israel and is tailored to the FullPond application. Edit the overview/contact panel in morrow-portfolio/src/index.html, shared header/footer/metadata in the builder, and portrait in morrow-portfolio/assets/overcomer-israel.jpg. The standalone Morrow portfolio case now lives in src/morrow.html; its copy is independent from the existing Shopify theme. Photo and email are published at the owner’s request. Media provenance remains recorded in the project source folders.

### Latest presentation release — 3 October 2026

Production deployment: `6ac1249d53392df0f3341030` at https://oviksmedia-portfolio.netlify.app/.

The overview and contact panel identify Overcomer Israel, show the supplied portrait, link to oviks.israel@gmail.com and frame the selection for FullPond's Senior Graphic & Shopify Designer role. All seven overview/case pages retain their exact store URLs and visitor passwords. The repeated production-tool banners were replaced with project descriptions; the fictional development-demo scope and source provenance records remain accurate. DAYBREAK's case description now reflects its native Shopify bag rather than the historical prototype dialog.

Evidence: the builder validated twelve generated pages and local links/assets; seven portfolio pages passed narrow-layout checks at 390px with contact links present; the contact panel also fit 320px. Keyboard focus was visible, and reduced-motion navigation reached the contact section without animation. Public HTTP checks matched the seven pages' visible text, the stylesheet and portrait to the build. Screenshots and receipts are in `docs/evidence/`. Desktop browser review confirmed the live portrait and contact details. These checks do not represent physical-device or screen-reader validation.

GitHub's About description and homepage now lead with the portfolio purpose. The README offers the live portfolio, contact information, six-project table, demo access and a separate maintainer guide. The application field only needs the portfolio URL; GitHub is supporting build documentation.
