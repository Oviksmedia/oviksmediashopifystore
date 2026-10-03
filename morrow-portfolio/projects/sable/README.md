# SABLE — leather accessories

Self-initiated portfolio concept by Oviks Media. Local base: `f443014f815e393a783a396008436e6245b1d9a9`, cloned from the parent checkout, on `codex/concept-sable`. This revision is local; it is not remote GitHub main. Authored changes are confined to this module. No store/admin access, dependency installation, push, upload or deployment occurred.

## Concrete brief, decided before building

Fictional audience: a style-conscious shopper choosing a compact evening-to-everyday bag, who wants to judge silhouette, surface and finish before adding it. The task is to compare Oxblood and Ink finishes of the Arc shoulder bag, inspect material/hardware, and pair it with the Fold cardholder. Two products only; no invented audience research.

Voice: sculptural, spare, assured. Object-led campaign language and ordinary functional labels.

Hero: the oxblood Arc sits on a dark stone plinth against chalk plaster. Hard directional light reveals a crescent body and the negative space below the arched strap. A very large upright SABLE wordmark and an offset black copy field frame the photograph without obscuring the silhouette.

Art direction: oxblood `#4D101C` carries the saturated brand field; near-black `#141211` frames the campaign; chalk `#F3EEE7` supports product comparison. Warm metal appears only in photographed hardware. Square corners, unequal columns, decisive cropping and generous image area create the fashion register. Quieter product surfaces give finish choices and specifications their own space.

Type: upright Bodoni Moda, 500 with optical sizing, provides tall high-contrast fashion lettering; compact Manrope, 400–700, carries shopping information. Georgia (Morrow's register), a heavy sports sans (RIFT's register), and default Playfair/Cormorant-style choices were rejected. No italic headline or decorative monospace.

Rejected generic approaches:

1. A centered luxury headline on a generic lifestyle photograph: it supplies no useful evidence of the object.
2. Equal product cards, soft gradients and perpetual parallax: they weaken the fashion composition and make finish comparison slower.

Motion contract: the named motion-library skill and semantic index were read. The relevant communication job is interaction feedback; stillness was selected for campaign/storytelling, and a small custom CSS behavior for controls. Trigger: hover/focus/press. Property: colour/background only. Duration: 140ms. Interruption: newest state replaces the previous one; no delayed action. Reduced motion: zero transition. Variant/gallery updates are immediate. Mobile and keyboard use native controls with labels and selected state. Magnetic buttons, distortion, forced intros, hidden reveals, split text and scroll control were rejected; no library effect was adapted.

## Scope, preview and integration

Objective: an independently integrable case study and working two-product storefront. Non-goals: checkout, real inventory, payments, store upload, publication or changes to inherited portfolio/Morrow/RIFT files. Highest-risk assumption: generated views preserve enough product identity for an honest concept; physical construction remains unverified. Evidence: browser shopping/failure flows, responsive captures, asset/link checks, keyboard/touch and reduced motion, plus bounded source/schema checks. Recovery: omit this isolated module from integration; no shared source changed.

No extra build or installation is required. From this isolated checkout:

```powershell
& 'C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' morrow-portfolio/projects/sable/preview.mjs
```

- Case: http://127.0.0.1:4401/sable.html
- Store: http://127.0.0.1:4401/sable-demo.html
- Stop preview: Ctrl+C. Port 4391 and the shared builder are untouched.

`preview.mjs` serves module assets first and reads inherited `morrow-portfolio/dist` only for return-to-portfolio links. Static sources are ready for the parent builder; no generated shared output was edited.

`integration.json` is the handoff manifest. Parent integration: wrap `case.html` in the shared `<main>`, load `assets/sable-case.css`, copy `demo.html` as `sable-demo.html`, and recursively copy `assets/` contents into final `dist/assets/`. Preserve `assets/sable/fonts/`; all other asset files start `sable-`. Do not copy evidence to deploy assets. The case links to `sable-demo.html`; demo links to `sable.html`; return links use `index.html#work`. Parent owns overview cards/navigation and final combined review.

## Fonts and imagery provenance

Self-hosted original variable TTFs downloaded from Google Fonts source on 2026-10-03:

- Bodoni Moda: https://raw.githubusercontent.com/google/fonts/main/ofl/bodonimoda/BodoniModa%5Bopsz,wght%5D.ttf ; copyright 2020 The Bodoni Moda Project Authors. Local `assets/sable/fonts/sable-bodoni-moda.ttf` and `sable-bodoni-OFL.txt`.
- Manrope: https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/Manrope%5Bwght%5D.ttf ; copyright 2018 The Manrope Project Authors. Local `assets/sable/fonts/sable-manrope.ttf` and `sable-manrope-OFL.txt`.
- Both licenses were read: SIL Open Font License 1.1. Included notices permit bundled/embedded distribution under their conditions. Fonts are unmodified; SHA256 hashes are in `evidence/sable-font-hashes.json`. Fallbacks: Times New Roman / Arial, with `font-display: swap`. No runtime font-CDN request.

Five selected images are original built-in `image_gen` outputs: campaign, Oxblood Arc, Ink Arc, Fold, and Arc detail. The campaign establishes the invariant Arc; the Oxblood product view references it; Ink is a colour edit of Oxblood; the macro also references Oxblood. Fold is a separate original small-good study. `evidence/sable-media-provenance.json` records exact prompts, source PNG paths, reference lineage, selected filenames, dimensions and bytes.

All selected finals are saved as module WebP files. `optimize-media.mjs` uses already bundled Sharp to resize without enlarging and export quality-85 WebP. Five images total approximately 604 KiB; the two fonts total approximately 319 KiB. Campaign is 1536px wide, product/detail views 1120px. Reserved image dimensions, eager hero loading and lazy lower images keep layout and loading usable. The PNG originals remain at their recorded generated-image paths; viewing/integration has no dependency on those source paths.

AI disclosure appears in the case and storefront. Fine grain, stitching and hardware vary slightly; the macro's grain is more pronounced. These are fictional visual studies, not manufacturing samples or measured specifications. No stock brand photography, fake people, testimonials, client commissions, research or commercial results are used.

## Implemented shopping and interface states

- Arc Oxblood/Ink native radios: visible selection, immediate finish/image feedback. Full-form and explicitly labeled Oxblood material-detail reference; selecting a finish restores full form.
- Fold: one Ink/oxblood-interior finish, native quantity field and independent form.
- Bag: three variant keys, integer quantities 1–9, integer-cent totals, add/merge, adjustment, removal, empty state, cumulative limit feedback, reload persistence and cross-tab synchronization.
- Recovery: malformed JSON, unknown IDs, duplicate lines and invalid saved quantities reset with an explanation. Unexpected saved properties are discarded; stored prices do not control totals.
- Storage read/write failure: in-memory page-session bag remains usable with a notice inside the active dialog.
- Accessibility: semantic landmarks/headings, skip-link focus, labels, text alongside swatches, visible focus, native disclosures and modal dialog, Tab containment, Escape, restoration/removal focus recovery, and live feedback inside the dialog. Core mobile controls/label regions have 44px targets.
- No JavaScript: a clear explanation appears near the top; add/bag/gallery actions are hidden. No order can be submitted.
- Motion: still imagery/ordinary scrolling, immediate gallery state, only bounded colour feedback; zero transitions/animations under reduced motion.

## Shopify proposal and coordinator requirements

`shopify/sections/sable-product-collection.liquid` combines a featured product and a collection of up to three products. It reads actual selected product/variant objects, availability, prices, images and quantity rules. Native `{% form 'product', sable_product %}` submits genuine variant `id` and `quantity`. Sold-out options/actions are disabled. The truthful “From” price accompanies actual per-variant prices in the selector. JavaScript progressively updates image/quantity rules and feedback; host product URLs lead to existing full product pages. No browser-local bag code is mixed into the Liquid source.

Editable settings: eyebrow, heading, campaign image, disclosure, featured product, collection, collection heading, product limit, surface and button colour. IDs/classes and translation keys are namespaced. Merchant colour changes need their actual contrast checked. The source expects the two font files in theme assets under flattened filenames.

For separately authorized draft-theme integration:

1. Add a new section; preserve inherited Morrow sections, templates, native forms and cart.
2. Merge the `sable` object from `shopify/locales/sable-en.default.json` into the actual locale file. This is a merge fragment, not a replacement locale.
3. Add `sable-bodoni-moda.ttf` and `sable-manrope.ttf` as theme assets; retain their license notices. Media uploads require separate authorization.
4. Configure real catalog products/variants and variant images, then select the product and collection in the section. This module creates no catalog records.
5. Test draft-theme rendering/editor reloads, actual prices/markets, availability, empty settings/collections, quantity rules, native add-to-cart redirect, host CSS, keyboard/mobile and the existing Morrow bag.
6. The simple dropdown serves this small catalog. High-variant products need the newer option-selection approach. Special per-variant quantity rules without JavaScript require the host full product page; the fallback directs there.

Primary documentation checked:

- https://shopify.dev/docs/api/liquid/tags/form
- https://shopify.dev/docs/storefronts/themes/product-merchandising/variants
- https://shopify.dev/docs/api/liquid/objects/variant
- https://shopify.dev/docs/api/liquid/objects/quantity_rule
- https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema
- https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings

The Shopify Liquid skill's documentation search succeeded. Its validation helper was attempted and failed before parsing: missing installed `@shopify/theme-check-common`. No package was installed. App Builder Liquid/schema guidance was also read. `verify-source.mjs` passes schema JSON, unique IDs, name/range/default bounds, locale references, balanced blocks, embedded JavaScript syntax and native form/data-reference checks. These are bounded structural checks; full Theme Check, Liquid rendering and live Shopify behavior remain unverified. The source is a proposal.

## Verification and evidence

Run with the preview active:

```powershell
& 'C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' morrow-portfolio/projects/sable/verify.mjs
& 'C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' morrow-portfolio/projects/sable/verify-accessibility.mjs
& 'C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' morrow-portfolio/projects/sable/verify-source.mjs
& 'C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' --check morrow-portfolio/projects/sable/assets/sable-store.js
```

Bundled Playwright/Chromium is loaded with `createRequire`; no install. Final machine records: `sable-browser-verification.json`, `sable-accessibility-verification.json`, and `sable-source-verification.json` in evidence. Desktop/mobile case/store screenshots and mobile/short-landscape bag screenshots accompany them. Earlier supplementary `run-verification.mjs`, `verification-results.json` and PNG captures are preserved; the final JSON records above cover the current source.

Passed on 2026-10-03:

- Both pages at 1440×1000, 320×720, 390×844, 768×1024 and 568×320: no horizontal overflow, broken loaded images, duplicate IDs, broken local links/fragments, JS or console errors. All lazy images are loaded before checks/captures.
- Finish/gallery selection, modal sizing, live feedback placement, Tab containment, Escape and focus restoration at every size.
- Native invalid quantity; all three variant/product lines; exact totals; update and invalid correction (0, fractional, >9); removal/empty; cumulative cap; persistence after reload.
- Malformed JSON, unknown ID, invalid stored quantity and duplicate-line recovery. Storage reads and writes independently blocked; page-session add/remove remains usable.
- Reduced motion: immediate variant state, zero transition duration, no running animations.
- Both self-hosted fonts loaded; 18 visible core 44px mobile control/label targets; touch-emulated finish/add/remove; skip-link focus; readable no-JavaScript 320px layout.
- Five contrast pairs: body/campaign 16.18:1, secondary text 5.74:1, oxblood action/status 12.94:1, focus on chalk 4.78:1. Targeted evidence, not full WCAG conformance.
- Desktop/mobile case/store and 390px bag screenshots inspected: the silhouette remains unobscured, product choices legible, and dialog contained.

Residual limits: no physical-device, screen-reader, Safari/Firefox, production-network, actual inventory, checkout/payment or live Shopify verification. Full Theme Check remains unavailable. Materials, dimensions, capacity, manufacturing, colour fidelity and care are fictional/unvalidated. Final portfolio integration and release belong to the coordinating chat.
