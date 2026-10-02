# Oviks Media — Morrow portfolio

Handover of a self-initiated Shopify skincare concept and its public portfolio case study.

## Published websites

- Public portfolio: https://oviks-morrow-portfolio.netlify.app
- Shopify demo: https://oviks-portfolio-demo.myshopify.com
- Hosting provider: Netlify. No Vercel deployment is configured.

The public portfolio displays the Shopify visitor password beside its demo links. It is a public demo credential, not an account login.

## Project folders

- `morrow-portfolio/dist`: complete static portfolio ready for Netlify.
- `morrow-portfolio/build-portfolio.mjs`: generates the portfolio from the sibling Shopify case-study section, adds screenshots, and writes the portfolio-specific styling.
- `morrow-portfolio/preview.mjs`: local preview server.
- `shopify-skincare/theme`: Shopify Horizon foundation and custom Morrow sections, styling, templates, and images.
- `shopify-skincare/catalog-v3.json`: existing product and collection reference data. Shopify products are managed separately from the theme.

Keep both folders beside each other. The portfolio builder relies on that layout.

## Start locally

Install Node.js if needed, clone this repository, and run these commands from the repository root:

```sh
node morrow-portfolio/build-portfolio.mjs
node morrow-portfolio/preview.mjs
```

Open http://127.0.0.1:4391. Stop the preview with Ctrl+C. There are no required portfolio package dependencies.

## Editing

The Shopify case study lives in `shopify-skincare/theme/sections/morrow-case-study.liquid`. Its styles are in `theme/assets/morrow-case-study.css` and `morrow-premium.css`.

Portfolio-only additions, the compact introduction, and visitor access instructions are authored in `build-portfolio.mjs`. Regenerate after changes; do not rely on editing generated `dist` files alone.

The current Shopify shopping flow includes three products, product forms, quantity updates, and removal from the demo bag. Preserve and recheck those behaviors when changing the theme.

## Publishing

Use your own authorized access to Netlify and Shopify. Authentication data is intentionally excluded from this repository.

For Netlify, deploy `morrow-portfolio/dist` to the existing `oviks-morrow-portfolio` project. No build command is needed for that generated folder. Existing Netlify site ID: `649edcb7-78dc-4c1b-aa24-970925a92379`.

For Shopify, verify the store and intended theme in the admin first. The Morrow Editorial v2 theme was created as ID `192208175421` and subsequently published by the owner. Do not assume its current status without checking. Review changes in a draft theme before changing the live store.

## Next work

Refine the existing portfolio, then add one or two distinct projects with their own imagery, story, and working examples. Clearly label fictional work as self-initiated concepts. Do not invent client relationships, testimonials, sales results, or clinical claims.

Before publishing, check desktop and mobile layouts, links, images, and any changed shopping behavior. The smaller portfolio introduction and visible visitor password were published on 2026-10-02. The visitor password was accepted by the Shopify form during verification.

## Sharing with your brother

Prefer a private GitHub repository and invite his GitHub account as a collaborator. He can then clone, create a branch, commit changes, and open a pull request. Netlify and Shopify account access must be granted separately; cloning this repository does not grant it.
