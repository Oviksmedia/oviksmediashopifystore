# Combined portfolio review

Objective: present Morrow and RIFT with four distinct self-initiated concepts in a coherent, easily explored portfolio. The new modules retain their own typography, imagery and shopping prototypes; the surrounding portfolio carries consistent navigation and disclosure.

Non-goals: live store/catalog changes, Netlify deployment, Shopify uploads, dependency installation or GitHub pushes.

Changed boundary: copy completed modules into authored `morrow-portfolio/projects/`, extend the existing static builder and overview, and generate case/prototype pages. Preserve inherited Shopify templates and bag. Shopify source proposals stay inside modules and are excluded from deploy assets.

Highest-risk assumption: an isolated module may behave differently when its case is wrapped in shared styles and navigation. Verify the actual combined output, nested landmarks, namespaced assets, local links, keyboard focus, image/font loading, responsive layout, reduced motion and local shopping behavior. Asset collisions must fail the build.

Recovery: reversible local source changes on `codex/portfolio-design-refinement`. The integrated preview requires user review before any publishing. Module checks establish local Chromium behavior; they do not establish live Shopify, screen-reader, physical-device or production behavior.

## Integrated result — 3 October 2026

All four completed modules are copied into the parent repository. The generated portfolio has six project cards, six case studies, five browser storefronts and one overview: twelve pages. The shared navigation remains compact on mobile; each case offers all six project links. Each storefront retains its own identity, fonts and local shopping implementation.

The builder reads each module manifest, adapts DAYBREAK's main fragment into an article under the shared main, recursively copies only authored assets, rejects collisions, and validates every generated HTML link/fragment/landmark plus CSS asset references. The expanded check found an inherited reference to an absent Morrow catalog background in copied CSS. An optimized 33,588-byte WebP and a static-build URL rewrite resolve it without editing the Shopify source.

Fresh combined checks at http://127.0.0.1:4392:

- `node morrow-portfolio/build-portfolio.mjs`: all twelve pages, asset paths, local links/fragments, unique IDs, main landmarks and collisions pass.
- `verify-preview.mjs`: sixty page/viewport combinations across 320×740, 390×844, 768×1024, 1440×1000 and 568×320; images loaded, one h1/main, no overflow, local HTTP resources/links pass; RIFT bag, persistence, validation, removal, keyboard and reduced motion pass. No console/page errors. `docs/preview/local-checks.json` and screenshots record the run.
- SABLE `verify.mjs`: six behavior groups and ten case/demo viewport checks pass. `verify-accessibility.mjs`: both fonts, eighteen core mobile targets, touch flow, skip focus, no-JavaScript layout and five contrast pairs pass.
- DAYBREAK `verify.mjs`: thirteen behavior/source groups and ten viewport checks pass, including required grind choice, variant totals, persistence, corrupted storage, failed storage, cross-tab sync, focus and dynamic reduced motion.
- ARC `verify.mjs`: 255 bounded checks pass, including shared-shell local links, both finishes, quantity limits, totals, persistence, invalid saved data, storage failure, dialog focus and reduced motion.
- SIDE B `verify.mjs`: eleven behavior groups and ten viewport checks pass, including filters, detail views, format separation, exact totals, invalid quantities, persistence, storage recovery, touch, reduced motion and sequential dialogs.

Module verification scripts now accept `PORTFOLIO_PREVIEW_URL` so the recorded runs exercise the combined output. Their evidence is retained inside each module; deployable pages do not contain review evidence or Shopify source proposals. Desktop/mobile combined screenshots were visually inspected, alongside campaign, storefront and product views. No commissioned clients, testimonials or sales results are represented; fictional concepts and generated photography remain disclosed.

`git diff -- shopify-skincare` is empty for this integration. Existing Shopify templates, products and bag were not edited, uploaded or exercised by these local-only checks. No checkout/order was placed. Existing live-demo evidence belongs to the earlier review; it is not a new live verification.

Full Shopify Theme Check remains unavailable because its bundled helper lacks `@shopify/theme-check-common`; no dependency was installed. Source structural checks from module authors do not establish live rendering. Physical devices, assistive technology, Netlify hosting and Shopify draft-theme behavior remain unverified. Next action: user reviews the local combined preview, followed by a separately authorized publishing step.
