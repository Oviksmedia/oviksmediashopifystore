# Oviks Media — graphic design & Shopify portfolio

A portfolio of self-initiated design concepts, with a working Morrow Shopify demo and a separate RIFT cycling storefront prototype.

## Published websites

- Public portfolio: https://oviks-morrow-portfolio.netlify.app
- Shopify demo: https://oviks-portfolio-demo.myshopify.com
- Hosting provider: Netlify. No Vercel deployment is configured.
- Shopify visitor password: **suweid**. This is a public demo credential, not an account login.

The `codex/portfolio-design-refinement` branch contains review changes. It has not been deployed to Netlify or uploaded to Shopify.

## Project folders and authored sources

- `morrow-portfolio/src/index.html`: portfolio introduction, project overview and approach.
- `morrow-portfolio/src/rift.html`: RIFT case-study content.
- `morrow-portfolio/src/rift-demo.html`: standalone RIFT storefront prototype.
- `morrow-portfolio/assets/portfolio.css`: shared portfolio shell, navigation and responsive layout.
- `morrow-portfolio/assets/rift.css` and `rift-demo.js`: RIFT identity, storefront styling and browser-local demo bag.
- `morrow-portfolio/assets/`: optimized portfolio imagery and actual Shopify screenshots.
- `morrow-portfolio/build-portfolio.mjs`: renders the Morrow Liquid case study, wraps case studies in the portfolio shell, copies assets and validates local links.
- `morrow-portfolio/dist/`: generated static portfolio, ready for Netlify after review.
- `morrow-portfolio/preview.mjs`: dependency-free local preview server.
- `shopify-skincare/theme/`: Shopify Horizon foundation and custom Morrow sections, styling, templates and original imagery.
- `shopify-skincare/catalog-v3.json`: product/collection reference data. Shopify products are managed separately from the theme.
- `docs/portfolio-review.md` and `docs/preview/`: change brief, verification records and review screenshots.
- `docs/rift-media.md`: RIFT art direction, image-generation prompts and bounded verification evidence.

Keep both project folders beside each other. The portfolio builder relies on that layout. Edit authored sources and regenerate; do not edit generated `dist` files alone.

The Morrow case-study content lives in `shopify-skincare/theme/sections/morrow-case-study.liquid`. Shared brand/case styling lives in `theme/assets/morrow-premium.css` and `morrow-case-study.css`; Shopify product/bag styling lives in `morrow-shopping.css`.

## Start locally

Node.js is the only requirement for building and previewing the portfolio. From the repository root:

```sh
node morrow-portfolio/build-portfolio.mjs
node morrow-portfolio/preview.mjs
```

Open http://127.0.0.1:4391. Stop the preview with Ctrl+C.

The build checks all four generated pages for unrendered Liquid, duplicate IDs, missing local assets, broken page links and broken fragments. The original skincare imagery remains in the theme; portfolio pages use optimized WebP copies.

## Browser verification

The optional browser scripts use an **existing** Playwright installation. They do not install packages. Set `PLAYWRIGHT_MODULE` to the existing module directory when it is not resolvable from the repository:

```sh
node morrow-portfolio/verify-preview.mjs
node morrow-portfolio/verify-shopify.mjs
node morrow-portfolio/verify-shopify.mjs --refined
```

Keep the local preview server running for `verify-preview.mjs`. It checks the generated pages, resources, responsive layouts and RIFT bag/keyboard behavior.

`verify-shopify.mjs` uses the public visitor password and a new visitor session to check product pages and the demo bag. It adds a fictional cleanser, updates quantity and removes it; it does not access the admin or place an order. `--refined` substitutes this branch's CSS responses locally in that browser session to inspect the proposed theme typography. It does **not** upload or publish a theme. Both modes exercise a real network service and should only be run against this authorized portfolio demo.

RIFT is a static prototype, not a Shopify theme. Its demo bag stays in browser localStorage and offers no checkout, inventory or payment integration.

## Publishing — after preview approval

Pushing GitHub commits alone does not update either published site.

For Netlify, deploy `morrow-portfolio/dist` to the existing `oviks-morrow-portfolio` project using authorized access. No build command is needed for the generated folder. Existing Netlify site ID: `649edcb7-78dc-4c1b-aa24-970925a92379`.

For Shopify, inspect the store and intended theme in the admin first. The Morrow Editorial v2 theme was originally created as ID `192208175421` and published by the owner; verify its current identity/status before any upload. Upload changes to a **draft** theme and review that theme before changing the live store. Theme upload does not create or change catalog products.

The current shopping flow includes three product pages, native product forms, quantity updates and removal. Preserve and recheck those behaviors after any upload. Repeat links, images, mobile layouts and shopping checks on the deployed Netlify/draft Shopify previews; local checks do not establish their behavior.

## Project honesty

Both brands are clearly labeled fictional, self-initiated concepts. AI assistance is disclosed. No client relationships, testimonials, research findings, clinical performance or sales results are represented. RIFT imagery has conceptual garment-detail variation; sizing and prices are illustrative.

## Collaborator access

GitHub repository access, Netlify access and Shopify access are separate. Cloning the repository grants no hosting or store account permissions.
