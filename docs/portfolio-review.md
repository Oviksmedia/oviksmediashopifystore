# Portfolio review — 3 October 2026

## Change brief

Objective: make the Senior Graphic & Shopify Designer application portfolio easy to explore and credible through two distinct, self-initiated projects.
Non-goals: fabricate client history or sales evidence; add checkout; change Shopify catalog data; publish Netlify or upload Shopify without review.
Branch: codex/portfolio-design-refinement, cloned from origin/main.
Changed surfaces: portfolio overview/navigation, Morrow case-study content, shared Morrow CSS, new RIFT identity/case/prototype, builder and preview verification.
Highest-risk assumptions: portfolio imagery and template references must survive a fresh build; shared theme CSS must preserve mobile product/bag controls; browser-local RIFT quantities and feedback must remain correct.
Recovery: local Git changes only. Netlify and Shopify remain separate release boundaries.

## What changed

- A project overview leads to independent Morrow and RIFT case studies through consistent navigation.
- Morrow keeps its paper/olive identity and original imagery. The case study ties color, typography, materials and routine structure to the brief, with actual Shopify collection/product/bag screenshots.
- Theme typography, control sizes and phone layouts were refined. An inherited two-column footer caused overflow at 320 px; the proposed theme uses independent rows below 520 px. Product and cart Liquid logic remains unchanged.
- RIFT adds a cobalt/acid cycling identity, graphic line system, two original AI-generated concept images and a working static jersey storefront. It demonstrates a different visual register without claiming Shopify integration.
- RIFT offers explicit size selection, validation, local bag updates/removal, empty and storage-failure states, and a keyboard-contained native dialog.
- Fictional work and AI assistance are disclosed throughout. No clients, testimonials, research findings, clinical performance or commercial results are invented.
- The builder generates four pages and validates local assets, page links, fragments, duplicate IDs and unrendered Liquid. README documents source ownership.
- Portfolio Morrow imagery uses WebP copies (121,088 and 154,532 bytes) while the original theme PNGs are retained. RIFT image prompts, original paths and concept caveats are in docs/rift-media.md.

## Evidence actually run

- node morrow-portfolio/build-portfolio.mjs — four generated pages and their local references validated.
- Node syntax checks for builder, preview server, both verification scripts and RIFT bag JavaScript; Morrow Liquid schema parsed as JSON.
- node morrow-portfolio/verify-preview.mjs — Chromium at 320, 390, 768 and 1440 px across all four pages; images loaded, local resources HTTP 200, no horizontal overflow or recorded console/page errors.
- RIFT browser checks — missing-size feedback, add £95, update £190, decrement, reload persistence, max 10 at £950, removal to £0, corrupt storage, keyboard containment, skip link and reduced motion. Implementer also checked unavailable storage.
- Existing Shopify demo — visitor password accepted; all three product pages and images loaded; cleanser add $28, update quantity to two at $56 and remove to empty all passed.
- node morrow-portfolio/verify-shopify.mjs --refined — real Shopify visitor session with this branch's CSS intercepted locally, no upload. Homepage, collection, cleanser and bag at 320/390/768/1440 plus serum/cream at 390 passed image/layout and shopping checks.
- Existing published Shopify baseline — 390/768/1440 layouts passed. The 320 px footer overflows on homepage, collection, product and bag; the live-check script records these defects and exits 1. The fix is verified in the local CSS overlay and still requires theme upload.
- Independent 6.1 SOL high-effort Assurance — reviewed requirements, diff, generated sources, browser paths, multiple sizes/storage/focus behavior and 568 × 320 layout. It found one modal-live-region issue and stale README editing guidance.
- Both findings corrected. Assurance rechecked the generated RIFT dialog after rebuilding: add/update/remove status exposed in Chromium's accessibility tree as status, live polite, atomic true, ignored false; totals £95 → £190 → £0 passed.
- Bounded contrast calculations for selected color roles and rendered visual checks are evidence for these pairings, not a complete WCAG audit.

Browser records and screenshots: docs/preview/local-checks.json, shopify-live-checks.json and theme-refinement-checks.json; desktop/mobile JPGs in that same directory.

## Limits and next action

No physical-device test, complete WCAG assessment, actual screen-reader speech test, Shopify Theme Check or draft-theme upload was performed. Shopify CLI is not installed here; no dependencies were installed. Browser CSS substitution is a local preview, not evidence that Shopify accepted an upload.

Review the portfolio at http://127.0.0.1:4391. Review theme-refinement screenshots for the proposed storefront typography. After approval, separately deploy the generated dist folder to the existing Netlify site and upload a draft Shopify theme using authorized access, then repeat relevant live checks. The existing live 320 px footer defect remains until that upload. No push, PR, production deployment or theme upload was performed during this task.
