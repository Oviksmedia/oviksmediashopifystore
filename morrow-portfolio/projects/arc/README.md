# ARC — Sculptural lighting

## Brief and committed direction
Fictional audience: a design-conscious home shopper selecting a compact table light for a shelf, sideboard or reading corner. Shopping task: understand the silhouette and room scale, compare two finishes, inspect illustrative dimensions, and try a clearly local bag. Brand voice: concise, precise, observant; no invented performance or craft claims.

Hero: one continuous inverted-U metal arch, a broad flat band with rounded shoulders and two straight ends resting on a surface. A recessed warm diffuser follows the inner arch. It occupies an architectural plinth; the page frames the whole object before inviting closer inspection. One anchor product, ARC 01, in Brushed aluminium and Graphite. No extra collection filler.

Art direction: blue-grey mineral planes, brushed cool metal, hard side light, warm illumination confined to the inside of the arch. Type: licensed self-hosted Space Grotesk, deliberate geometric letterforms at regular/medium weights. Ink #172329, mineral #e4e9e9, signal orange #bd3d16, white #f8faf9. Orange identifies editorial indices and action states. Fine measured rules and a large open product canvas form the hierarchy.

Rejected: a beige lifestyle product-card grid (weak silhouette and interchangeable category codes); a black stage with floating typography and perpetual 3D rotation (less room-scale information, extra interaction cost). The storefront uses a split object/annotation hero, a full-width room study, then a two-column finish workbench. The case study documents those actual decisions.

Motion contract: still hero/gallery. Pointer or keyboard activation changes native selection state immediately. Only control background/border changes transition for 140ms ease-out; new input replaces the previous target without queues. Finish images swap immediately without fades. Dialog opens/closes immediately. Reduced motion removes transitions; touch and keyboard receive the same selected labels, announcements and stable targets. Motion-library skill and semantic index consulted; no library effect adapted.

## Authorized change boundary
Only this module in the independent local clone. Base f443014f815e393a783a396008436e6245b1d9a9, cloned from the local parent branch, not remote main. Local branch codex/concept-arc. No production effects, remote push, inherited template changes, dependency installation, or changes to siblings.

R2 local feature: highest-risk assumption is continuity of the generated lamp across campaign/product/finish images. Verify visually and disclose conceptual detail variation. Bag evidence must exercise storage failure, malformed persisted data, quantity limits and variant totals. Shopify is source intent pending platform validation and upload.

## Preview and integration
Exact independent checkout: `C:/Users/Oviks/OneDrive/Documents/ChatGPT/Sprinb board/portfolio-concepts/arc/workspace`.

From that checkout, run `node morrow-portfolio/projects/arc/preview.mjs`. Preview case: http://127.0.0.1:4403/arc.html. Storefront: http://127.0.0.1:4403/arc-demo.html. The server listens only on localhost and requires no packages. It is currently running for review. Stop with Ctrl+C in its owning session.

No shared build is changed. `case.html` is a semantic article fragment for the parent’s main content, styled by `assets/arc.css`. Copy module assets into the combined `dist/assets/`, retaining `fonts/`, and emit `demo.html` as `arc-demo.html`. Case destination is `arc.html`. `integration.json` contains the exact copy list, palette/type, cover and return routes. The preview’s `index.html#work` is a clearly labelled isolated landing stub; the parent owns the real overview and navigation. Do not copy `evidence/` into deployment assets.

## Media provenance and original prompts
All four raster studies were generated with the built-in imagegen tool in this chat. No stock imagery or existing brand photographs are used. Exact complete prompts: `evidence/arc-media-prompts.json`; optimized output sizes and source paths: `evidence/arc-media-manifest.json`.

- Campaign: source `C:/Users/Oviks/.codex/generated_images/01a0ff09-a143-7440-bfac-3ad13064c1c1/exec-53aa2ccb-06de-49b1-9178-0e99475e0440.png`; output `assets/arc-campaign.webp`, 1536 × 1024. Prompt: architectural photo of one broad brushed aluminium inverted-U table lamp, recessed inner warm diffuser, mineral plinth, cool doorway, hard side light, no text or other lamps.
- Studio: source `C:/Users/Oviks/.codex/generated_images/01a0ff09-a143-7440-bfac-3ad13064c1c1/exec-b369edd8-3f4f-4a8e-9f58-98cd995f5c10.png`; output `assets/arc-silver.webp`, 1000 × 1000. Campaign supplied as product identity reference; same lamp on a pale mineral seamless surface, three-quarter view and no props.
- Graphite: source `C:/Users/Oviks/.codex/generated_images/01a0ff09-a143-7440-bfac-3ad13064c1c1/exec-e596dda6-b874-47c6-ac80-87c8be933826.png`; output `assets/arc-graphite.webp`, 1000 × 1000. Studio supplied as edit target; change only the exterior material to satin graphite, preserve camera, scale, geometry, diffuser and shadow.
- Detail: imagegen returned image data while disk space was exhausted. The selected original was persisted as `evidence/arc-detail-original.png`; output `assets/arc-detail.webp`, 1200 × 800. Studio supplied as reference; macro of the same upper shoulder, grain, depth and recessed light. A redundant transfer file was removed after successful persistence. No other work was removed.

Visually inspected all generation results and the rendered pages. Graphite closely retains the studio silhouette; room/studio/detail use the same continuous arch concept. Surface, recess and curvature details remain AI interpretations. None establishes manufacture or performance. `prepare-media.mjs` regenerates optimized WebP files using the already bundled sharp package. Four imagery assets total approximately 222 KB; the actual storefront screenshot adds a separate optimized WebP.

## Font provenance
Space Grotesk by Florian Karsten / Space Grotesk Project Authors. Direct official upstream WOFF2 files, regular and medium, unmodified, self-hosted. License: SIL OFL 1.1, included in `assets/fonts/arc-OFL.txt`. Source repository: https://github.com/floriankarsten/space-grotesk. Verified upstream revision `03507d024a01282884232081fc6011c09ff4e849` on 2026-10-03. Downloads: `https://raw.githubusercontent.com/floriankarsten/space-grotesk/master/fonts/woff2/static/SpaceGrotesk-Regular.woff2` and corresponding `SpaceGrotesk-Medium.woff2`. Fallbacks Helvetica, Arial, sans-serif. Font files and sizes/hashes are recorded in `evidence/arc-font-provenance.json`.

The regular/medium geometric system differs from inherited RIFT’s Arial Black/Arial Narrow styling and the softer Morrow register. No runtime font request leaves the local site.

## Implemented interface states
Finish not selected and validation focus; selected finish with label, price and matched image; independent gallery view with pressed state and live caption; whole quantity validation 1–20; per-finish cumulative limit 20; successful add and modal feedback; separate variant lines; integer-cents totals; quantity update and invalid-update retention; removal and focus recovery; explicit empty bag; persistence under `arc.demo.bag.v1`; malformed, duplicate, unknown or out-of-range saved rows reset with explanation; read/write storage failures use page-session memory with visible notice. No checkout, inventory, payment or Shopify connection in HTML.

Native dialog opens without animation, contains live announcements, traps Tab/Shift+Tab, closes with Escape and restores focus. No hidden essential controls or moving targets. Mobile puts the object before the headline. Reduced motion sets all transitions to none; imagery and selected states change immediately.

## Shopify source intent and integration requirements
`shopify/sections/arc-object-gallery.liquid` selects an actual product (or product-page context), iterates catalog variants and uses real IDs, prices, availability, variant images and quantity rules. The native `{% form 'product' %}` submits `name=id` and `name=quantity`; it does not replace Morrow’s cart. Finish blocks map exact catalog variant IDs to optional presentation labels and comparison images. Campaign image/copy, caption and dimension disclosure are editable. Live storefront controls use translation keys; merge `shopify/locales/en.default.json`’s **arc namespace** into a target locale, never overwrite the target locale file.

Primary references checked: https://shopify.dev/docs/api/liquid/tags/form, https://shopify.dev/docs/storefronts/themes/product-merchandising/variants, https://shopify.dev/docs/api/liquid/objects/quantity_rule and https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings. Shopify skill documentation search ran for native product/variant forms and quantity rules.

The bundled Shopify validator was attempted with `--theme-path <module>/shopify --files sections/arc-object-gallery.liquid,locales/en.default.json --json`, but could not start: `ERR_MODULE_NOT_FOUND` for `@shopify/theme-check-common`. No dependency was installed. The source therefore remains **unverified by Shopify Theme Check**, not platform-validated. Static schema/locale parsing, translation references, namespaced IDs, form intent and inline JS syntax pass in `validate-source.mjs`.

The coordinating chat owns any future store access, product creation, exact variant-ID mappings, theme upload and publishing. Review in a draft theme only after authorization, integrate only this new section and arc translations, preserve existing Morrow templates/forms/products/bag, and test native add-to-cart, quantity rules, theme-editor reload, empty/all-unavailable catalog and translations. This source assumes a small conventional finish catalog; high-variant product discovery needs a different selector. Shopify styling inherits the target theme font unless ARC’s licensed fonts are deliberately added in that separate integration. HTML prices are unrelated to live catalog prices.

## Verification and residual limits
Commands from the independent checkout:

```text
node morrow-portfolio/projects/arc/capture.mjs
node morrow-portfolio/projects/arc/verify.mjs
node morrow-portfolio/projects/arc/validate-source.mjs
node --check morrow-portfolio/projects/arc/assets/arc-demo.js
git diff --check
```

Scripts use the existing bundled Playwright/Chromium and sharp through `createRequire`, with no installation. Runtime executable: `C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`. Module directory: `C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules`.

Evidence: `evidence/arc-verification.json` records browser checks; `evidence/arc-source-checks.json` records static/contrast checks. Desktop 1400 × 940, mobile 320 × 740 and 390 × 844, tablet 768 × 1024 and short landscape 568 × 320. Both pages checked for loaded lazy images, links/fragments, fonts, duplicate IDs and overflow. Storefront checked for focus, target sizes and actual bag flow. Desktop/mobile case/storefront and modal JPEGs are saved in `evidence/`. `assets/arc-storefront-preview.webp` is an actual desktop prototype screenshot used as case evidence, not generated UI imagery.

Final result: **200 browser checks passed, zero recorded errors**, plus 15 bounded source/contrast checks passed. The mobile bag trigger was corrected from 42 px to 44 px after the target-size check identified it. No overflow, broken local image/link, duplicate ID or JavaScript error was recorded. Final authored-source whitespace check passes. This is local Chromium evidence, not physical-device, screen-reader or production evidence.

Text contrast: ink/paper 15.31:1, muted/mineral 5.91:1, white/signal 5.46:1. Control borders/paper 4.42:1 and mineral 3.78:1. Calculations and rendered review are scoped checks, not a claim of full WCAG conformance.

Unverified: physical devices, screen-reader behavior, live Shopify render/cart/theme-editor compatibility, real product manufacturing, safety, material accuracy, dimensions, photometrics and commercial outcomes. No network account, checkout, upload or deployment was exercised. The next action is local design review and parent integration, followed by separately authorized platform validation. No global memory or shared source was edited.
