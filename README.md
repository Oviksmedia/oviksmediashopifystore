# Oviks Media — graphic design & Shopify portfolio

Six fictional, self-initiated brands with published Shopify development demos: Morrow, RIFT, SABLE, DAYBREAK, ARC and SIDE B. They have native product catalogs, product pages and demo bags. AI assistance is disclosed; no client commissions or sales results are claimed.

## Published portfolio and access

Application URL: https://oviks-morrow-portfolio.netlify.app/

| Store | Shopify URL | Visitor password |
| --- | --- | --- |
| MORROW | https://oviks-portfolio-demo.myshopify.com/ | suweid |
| RIFT | https://rift-portfolio-demo.myshopify.com/ | lowcia |
| SABLE | https://sable-portfolio-demo.myshopify.com/ | chowck |
| DAYBREAK | https://daybreak-portfolio-demo.myshopify.com/ | nowped |
| ARC | https://arc-portfolio-demo.myshopify.com/ | reepro |
| SIDE-B | https://side-b-portfolio-demo.myshopify.com/ | yeitwu |

These visitor passwords are for fictional demos, not account logins. The portfolio opens without a password and supplies the correct password beside each store link. Hosting is Netlify; no Vercel deployment is configured.

## Sources and build

- `morrow-portfolio/src/`: authored overview and RIFT case study.
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

Open http://127.0.0.1:4391/. Keep the project folders beside one another; the portfolio builder reads Morrow’s case source and the store access manifest.

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

Netlify site ID: `649edcb7-78dc-4c1b-aa24-970925a92379`. Deploy only the rebuilt `morrow-portfolio/dist` from this repository. Sibling standalone folders outside this repository are older copies. GitHub pushes do not automatically update Shopify.

All stores remain password-protected development demonstrations with fictional products. Checkout, payments, real fulfillment, manufacturing, physical-device and screen-reader validation are outside this release. See the migration handover for precisely what was tested.
