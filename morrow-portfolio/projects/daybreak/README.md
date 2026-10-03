# DAYBREAK — specialty coffee concept

## Brief, decided before production
Fictional audience: everyday home brewers who want an enjoyable coffee without learning a specialist vocabulary. Shopping task: compare three roast personalities, choose whole bean or a familiar grind, then inspect a clearly priced 250 g bag in a local demo bag. Voice: sunny, substantial, unpretentious.

Hero: a tactile still life of three matte, flat-bottom coffee pouches on blue and orange sculptural blocks. No text overlay on product labels. The big rounded headline sits beside the image, with a clear shop anchor.

Art direction: warm orange #F66A32, deep blue #173A84, pale butter paper #FFF5DB and dark brown ink #302217. Fredoka provides substantial rounded display letters; Epilogue keeps choices and labels precise. A common label grid pairs a large roast name, numeral, and original sunrise/arc mark. Day One is orange (balanced medium); High Noon is butter (light and bright); After Hours is blue (deep roast). Information uses both words and numbers; color never carries the choice alone. Flat-bottom bags have a sealed top, small side gussets and matte paper texture. Prices and taste descriptions are illustrative.

Rejected: beige craft-coffee minimalism with small serif text, because it makes everyday choice feel precious; neon kinetic cafe graphics with marquees, because they compete with packaging and shopping controls.

Motion decision: use stillness for the hero and all essential shopping targets. A user-triggered label-system preview in the case changes one original SVG label with a 160 ms opacity transition. Keyboard/touch use the same native controls. A repeated choice replaces the state immediately; no delayed content or queued animation. Reduced motion removes the transition synchronously. No library implementation is adapted: the semantic index supports simpler custom feedback, and the library's displacement/magnetic candidates are disproportionate. No scroll hijacking, intro, ongoing motion, or split text.

## Implementation boundary
R2 local feature. Only this module is changed. Non-goals: production publishing, real inventory, payments, customer accounts, checkout, Shopify upload. Highest-risk assumption: local persistence may be malformed or inaccessible. Evidence plan: browser flows, validation and fallback contexts, dialog keyboard/focus tests, narrow and short viewport inspection, local resources and image loads. Recovery: the module can be omitted from parent integration; no external state is changed.

Base: local commit f443014f815e393a783a396008436e6245b1d9a9; independent clone on codex/concept-daybreak. This base is not claimed to exist on GitHub.

## Local preview and verification

Module:
C:/Users/Oviks/OneDrive/Documents/ChatGPT/Sprinb board/portfolio-concepts/daybreak/workspace/morrow-portfolio/projects/daybreak

Run from that module directory:

```powershell
node preview.mjs
```

- Case: http://127.0.0.1:4402/daybreak.html
- Storefront: http://127.0.0.1:4402/daybreak-demo.html
- Stop the server with Ctrl+C. The server binds only to 127.0.0.1.
- No build or dependency install is necessary. The case preview wraps the semantic main fragment; the demo is already a complete HTML document.
- The portfolio return link serves the inherited index from this clone's existing dist folder. It does not add DAYBREAK to the shared overview. The parent owns that integration.

Existing bundled runtime for this host:
C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe

With the preview running:

```powershell
node verify.mjs
node capture-review.mjs
```

The verification helper requires Playwright via createRequire from the existing bundled node_modules directory. It installs nothing. Source images can be re-optimized with node optimize.mjs using bundled sharp and the recorded source paths, if those originals remain available. Preview and final optimized assets do not depend on source originals.

## File handoff and integration

- case.html: one semantic main-content fragment. Include assets/daybreak.css and deferred assets/daybreak-case.js in the parent page head. Do not nest another main around it.
- demo.html: copy unchanged to the final daybreak-demo.html.
- assets/: copy recursively into the portfolio dist/assets folder. Every filename is prefixed daybreak-; fonts have the unique daybreak/fonts directory.
- integration.json: exact title, category, cover, palette, type, output paths and integration ownership.
- shopify/daybreak-roast-collection.liquid: isolated source proposal. It is not uploaded and does not power the HTML prototype.
- evidence/: internal review materials. Do not copy screenshots or source originals into deploy assets. The case has a working demo link and no dependency on evidence images.

No shared builder, parent source, existing Morrow/RIFT page, inherited Shopify template, sibling concept or global configuration was edited. No push, store mutation, upload or deployment was performed.

## Imagery and graphic provenance

Four original built-in imagegen photographs were selected and inspected: the three-pouch campaign plus Day One, High Noon and After Hours catalog photographs. Each catalog prompt used the campaign as a packaging reference; High Noon and After Hours also used Day One for consistent framing. Full prompts, reference paths and original output paths are saved in evidence/daybreak-media-source.json. The High Noon result was recovered from its returned image data when its default saved file was incomplete; its original is preserved in evidence/daybreak-high-noon-original.png.

Optimized finals:
- assets/daybreak-campaign.webp: 1536 × 1024, 150,428 bytes.
- assets/daybreak-day-one.webp: 900 × 900, 52,028 bytes.
- assets/daybreak-high-noon.webp: 900 × 900, 40,622 bytes.
- assets/daybreak-after-hours.webp: 900 × 900, 49,026 bytes.

Total selected raster payload: 292,104 bytes. Sharp performed resizing/compression only; visual packaging edits were made through imagegen. The original sunrise SVG, three editable label SVGs, inline cup illustration and label preview are code-native graphics. SVG masters use named licensed fonts; open them in a design application with the supplied fonts for exact type. No stock photo, existing brand image, fake customer or testimonial is used.

AI generation introduces minor letterform, crease and material-detail variation. These concept photographs represent the same packaging brief, not exact manufactured objects. The editable label grid remains the precise graphic reference. Labels are not production dielines or print proofs. All roast/tasting descriptions, product names, sizes and prices are fictional and illustrative. No origin or producer claim is made.

## Font provenance

Display: Fredoka variable (600), substantial and rounded. Body/UI: Epilogue variable (400–700), precise and readable. Both are self-hosted unmodified TTF files with font-display: swap, suitable Arial-based fallbacks, license copies and checksums in assets/daybreak/fonts/daybreak-provenance.json.

Primary sources downloaded and inspected:
- https://github.com/google/fonts/blob/main/ofl/fredoka/Fredoka%5Bwdth,wght%5D.ttf
- https://github.com/google/fonts/blob/main/ofl/fredoka/OFL.txt
- https://github.com/google/fonts/blob/main/ofl/epilogue/Epilogue%5Bwght%5D.ttf
- https://github.com/google/fonts/blob/main/ofl/epilogue/OFL.txt

Copyright: The Fredoka Project Authors (2016); The Epilogue Project Authors (2020). Both SIL Open Font License 1.1. License files are retained alongside fonts. The two-font payload is 362,180 bytes. No external font request is needed by the delivered pages.

## Motion contract

Purpose: confirm a visitor-selected packaging label and make the common label grid apparent.
Trigger: change the case's labeled native select, by mouse, touch or keyboard.
Affected state: label name, roast number, sunrise color and background change immediately; the nonessential artwork briefly changes opacity.
Timing: 160 ms opacity transition, ease; a 160 ms return timer. No content entrance or action delay.
Interruption: selecting again replaces the state and clears the prior timer. A reduced-motion preference change clears the timer and removes the transient class.
Reduced motion: no transition and immediate opacity 1; all label information is present.
Fallback: all three product photographs and descriptions remain available if the case script is disabled; default editable label remains visible. Essential storefront actions are not animated.
Library decision: motion-library SKILL.md and its semantic index were read. No effect implementation was adapted; simple CSS feedback fits the job with less cost. Magnetic/displacement behavior, scroll choreography, forced intros, perpetual motion, hover-only actions, hidden focusable content and split typography were rejected.

## Implemented interface states

Shopping: all three products visible; explicit required whole-bean/grind choice; clear 250 g pack and illustrative USD price; native input validity blocks incomplete additions.
Bag: empty, added, repeated addition, distinct roast/grind lines, quantity edit, invalid edit with prior value retained, per-variant demo limit of 12, removal, empty-all, accurate integer-cent totals, persisted reload, cross-tab update, malformed saved-data reset, unavailable storage and failed writes.
Storage is namespaced as oviks-daybreak-demo-bag-v1. Untrusted stored prices/names are not used. Catalog constants define prices, labels and permitted variants.
Dialog: native showModal, visible title/description, live feedback inside active dialog, autofocus, Tab/Shift+Tab containment, Escape, explicit Close/Keep exploring controls, focus restoration; internally scrollable at short viewports.
No JavaScript: product information remains available and a noscript explanation is shown; add buttons remain disabled.
No checkout, payment, real stock or HTML-to-Shopify integration exists.

## QA results and limits

Final verify.mjs run: PASS, 13 named behavior/source checks and 10 viewport checks; zero page errors and zero HTTP resource errors. Exact results: evidence/daybreak-qa.json.
Case and demo checked at 1440×1000, 320×740, 390×844, 768×1024 and 568×320. Images were forced to load before validity checks and screenshots; both actual fonts were verified loaded. No horizontal overflow at those sizes, no missing local link/fragment, no broken image, and visible native controls have at least 44 px height.
The browser suite exercises add/variants/totals, quantity boundaries, remove/empty, persistence, corrupt/untrusted storage, unavailable/quota-failed storage, cross-tab update, dialog keyboard containment/restoration, touch emulation, short-landscape dialog and reduced-motion changes. Desktop/mobile/full-page and first-view screenshots are under evidence/.
Visual review corrected the narrow case title and stacked the tablet hero so the bag family is not heavily cropped. Palette pair calculations and their scope are in evidence/daybreak-contrast.json. Orange section small text uses dark brown rather than blue; blue/orange is reserved for large original label type and graphics. This is not a full WCAG conformance claim.

Shopify Liquid's source search helper ran and primary form/schema/variant docs were inspected. Its validate.mjs was attempted against the actual source, but cannot start because @shopify/theme-check-common is missing. No dependencies were installed. Local checks parse schema JSON, check unique setting/block IDs and count balanced tags only. Theme Check, draft rendering and live forms remain unverified.

Real phones/tablets, screen readers, user research, physical packaging/print proofs, catalog setup, Shopify theme editor/rendering, real native bag/checkout, performance on physical networks and production hosting were not tested. No sales, usability-research, sourcing or manufacturing results are claimed. See shopify/README.md for the coordinating chat's integration requirements and preserve the existing Morrow products and forms.

Next action: parent integrates this module locally using integration.json and conducts combined review. Any store upload or publishing requires the parent's separate authorized release step.
