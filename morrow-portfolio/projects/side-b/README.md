# SIDE B — records & cover design

## Concrete brief, before building

SIDE B is a fictional independent record imprint for visually curious record collectors who want to browse three releases by musical mood, inspect the printed sleeve, choose a physical format and try adding it to a bag. The audience and music are invented design premises, not research findings. The voice is direct, playful and informed: a record-shop counter, not luxury lifestyle copy.

The hero is a yellow shop poster beside a physical still life of the collection: **ON THE FLIP SIDE.** Ultra's heavy slab letterforms give the identity a wide, tactile poster voice; Chivo's open grotesque keeps titles, format labels and quantities readable. An ink-black frame and sharp yellow foundation make the store recognisable. Orange, cobalt and pale green belong to individual releases rather than changing every interface state. The collection is the primary navigation structure, with genre filters and explicit product-detail buttons.

Three fictional releases only: **Night Index / Mara Circuit** (electronic; orange angular loops), **Soft Static / Tender Relay** (ambient; cobalt halftone cloud), **After Hours / Niko Vale** (jazz; green stepped rhythm). Consistent catalogue numbers, margins, typographic placement and black-vinyl labels bind distinct cover compositions. Original vector cover and sleeve artwork will supply generation references. Photography must show paper, print and grooves, with no invented collaborations, sales claims or testimonials.

Rejected: (1) beige, spacious luxury merchandising because it suppresses the collection's graphic voice; (2) streaming-player chrome with fake play controls because no audio exists. Also rejected spinning records, magnetic targets and scroll-driven sleeve travel: they interrupt comparison without adding information.

Motion decision: **stillness**. The sleeve/detail selector changes the photograph immediately, in one fixed aspect-ratio region. Purpose: show packaging detail on request. Trigger: a native labeled gallery button. Property/state: selected image and pressed state. Timing: 0 ms, no easing or intermediate hidden content. Repeated input replaces the selected view immediately; closing the dialog cancels nothing. Reduced motion is already the default. Keyboard and touch use the same controls. Add-to-bag never moves. The motion-library skill and semantic index were read; no library effect was adapted and no exact effect reference was needed.

## Change brief

Objective: a reviewable cultural identity, original cover series, campaign application and usable standalone shop.
Non-goals: real music, checkout, inventory, payment, live Shopify integration or publication.
Changed surface: this module only, in an independent clone of local commit `f443014f815e393a783a396008436e6245b1d9a9`, branch `codex/concept-side-b`. The base is local and is not represented as a remote commit.
Highest-risk assumption: local bag persistence can fail or contain malformed data; UI must recover honestly.
Evidence plan: Chromium desktop/mobile, keyboard/dialog journeys, real loaded images/links, persistence/failure fixtures, totals and variant separation.
Recovery/approval boundary: reversible local artifacts; no parent edits, dependency installation, remote push, store upload or deployment.

## Delivered module

- `case.html`: semantic case-study article fragment. Parent wraps it in the portfolio main element and loads `assets/side-b.css`.
- `demo.html`: full standalone HTML shop. Copy it as `side-b-demo.html` for final integration.
- `assets/side-b.css`, `side-b-store.js`: namespaced styling and local interaction logic. The case requires CSS only.
- `assets/`: six original SVG graphics and their PNG renderings; five selected generated photographs as WebP; licensed fonts under `side-b/fonts/`.
- `shopify/`: confined namespaced collection/product source sections, native product form, assets and locale fragments. No source has been uploaded to Shopify.
- `integration.json`: exact paths, output names, cover/alt text, palette, typography, preview and parent-owned integration requirements.
- `evidence/`: real local-browser screenshots, verification JSON, media-size record and review. Evidence is not a deploy asset.

The parent README and existing Morrow/RIFT case sources were inspected as context. All authored changes are inside this module in the independent local clone. No shared builder, overview, portfolio CSS, inherited templates, products, native forms or existing bags were edited. No remote push, publication, store change, dependency install, credential access or cross-chat message occurred.

## Preview and checks

From the independent checkout root:

```powershell
node morrow-portfolio/projects/side-b/source-checks.mjs
node morrow-portfolio/projects/side-b/preview.mjs
```

Open the case at http://127.0.0.1:4404/side-b.html and the store at http://127.0.0.1:4404/side-b-demo.html. Port 4404 is reserved for SIDE B. Ctrl+C stops this preview.

No module build step is required: the preview reads authored HTML/CSS/JS directly, wraps the case fragment in a minimal accessible document and maps final output paths. Its `index.html#work` return route and inherited Morrow/RIFT routes are read from this clone's existing `morrow-portfolio/dist` for context; it does not regenerate or edit those pages. Parent owns the final shared-builder integration.

With the preview running, use a separate terminal:

```powershell
node morrow-portfolio/projects/side-b/verify.mjs
```

The checks use the already-bundled Playwright/Chromium through `createRequire`, without dependency installation. If `node` is not on PATH on this machine, the bundled executable is `C:/Users/Oviks/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.

For final parent integration: wrap `case.html` as `side-b.html`, copy `demo.html` as `side-b-demo.html`, and copy `assets/side-b-*` plus `assets/side-b/fonts` into the final `dist/assets` retaining their paths. Do not copy evidence or the Shopify source into deploy assets. Consult `integration.json` for the exact contract; cards/navigation/shared builder remain parent-owned.

## Original artwork and photography provenance

`create-art.mjs` is the source for the three cover designs, Night Index rear sleeve, yellow centre label and campaign poster. Vector geometry and typographic composition are original code-native work. Chromium rendered the matching PNG reference artwork using the self-hosted font. Re-running that script updates those original studies, not the accepted AI photography; it is not necessary for ordinary previewing.

The built-in imagegen tool produced five selected physical studies using those original graphics and approved generated references. All prompts, original output paths, and final module paths are recorded in `media-provenance.json`:

| Final selected image | Reference lineage | Art-direction decision |
| --- | --- | --- |
| `assets/side-b-campaign.webp` | Three original covers, poster, label | A record-shop display; orange foreground sleeve, cobalt/green behind, yellow poster and black vinyl, directional light and paper texture. |
| `assets/side-b-night-product.webp` | Approved campaign, Night Index cover, label | Cool-grey table; a legible printed sleeve and black vinyl; neutral product comparison frame. |
| `assets/side-b-soft-product.webp` | Night Index photo, Soft Static cover, campaign | Preserve the physical layout and light; change the sleeve print and label to Soft Static. |
| `assets/side-b-after-product.webp` | Night Index photo, After Hours cover, campaign | Preserve the layout and light; change the sleeve print and label to After Hours. |
| `assets/side-b-night-detail.webp` | Night Index photo, cover, label | A closer angle showing paper edge, print and grooves; same sleeve and vinyl identity. |

All five outputs were visually inspected. The main artwork and titles stay coherent; physical photographs contain small texture, colour and label-detail variation. They are not manufacturing proof. The three product views share a physical framing and material register. No stock photo, existing brand, actual artist/collaboration or customer image was used.

`optimize-media.mjs` uses the bundled existing sharp package to derive the selected WebP files from the recorded original sources; no generation is needed to run it. The five photos total **960,900 bytes** (about 938 KiB): campaign 247,800; Night Index 173,066; Soft Static 166,762; After Hours 121,222; detail 252,050. Detailed dimensions/sizes are in `evidence/media-output.json`. The original generation sources remain in the tool's generated-images directory; selected final imagery is persisted in this module.

Font sources, authors, licences, local files, CSS aliases and fallbacks are documented in `assets/side-b/fonts/SOURCE.md`. Ultra is from Google Fonts' `apache/ultra` directory under Apache 2.0; Chivo is from `ofl/chivo` under SIL OFL 1.1. Both font binaries are self-hosted, with licence files included. No font subscription or remote font service is needed at runtime.

## Implemented observable states

- Collection: all/electronic/ambient/jazz filters; pressed state and live visible-record count; hidden cards leave focus order.
- Product dialog: labeled record/cover-detail views; explicit format selection; quantity; invented track list; validation, added confirmation and view-bag action; feedback lives inside the active dialog.
- Formats: Black vinyl LP; LP + cover print. Night Index £28/£36, Soft Static £26/£34, After Hours £30/£38. All are illustrative GBP prices.
- Bag: empty/nonempty; separate product-format lines; fixed unit prices and correct subtotal; 1–9 whole quantities; duplicate-add limit; explicit Update and Remove controls; meaningful feedback; zero-total recovery.
- Persistence: namespaced `sideb.demo.bag.v1` storage; strict saved-data validation; unreadable data reset notice; read/write failure keeps a visit-only in-memory bag and explains the limit. Multiple tabs are not synchronized.
- Modal/input: native dialog containment plus Tab/Shift+Tab wrapping, visible focus, Escape, restoration to opener, body scroll lock and sequential product-to-bag transition. Labeled gallery buttons work with touch and keyboard. Actions remain stationary.
- No-JavaScript: collection remains visible; a notice explains that formats and bag need JavaScript. No checkout or audio affordance exists.

## Actual verification and remaining boundaries

`verify.mjs` completed **11 check groups**, covering the case and demo at **1440×1000, 320×740, 390×844, 768×1024 and 568×320**. It found no horizontal overflow, missing loaded images, duplicate IDs, broken local links, page errors or console errors. The lazy images were scrolled into view and decoded before the results were recorded. Non-dialog buttons/inputs/selects were checked at a minimum 44px height; dialog controls were exercised at narrow and short sizes.

Keyboard launch, Shift+Tab/Tab wrapping, Escape and restored focus passed. All genre filters passed. Unselected formats and blank/zero/negative/fractional/10 quantities were rejected. Two £28 LPs plus one £36 art edition produced two distinct lines and £92; updating to three LPs yielded £120; reload preserved four units; removal yielded £84 then an empty £0. Read/write storage failures and invalid/unknown/duplicate/fractional saved-data fixtures recovered with honest notices. Emulated touch and reduced-motion detail selection/add passed with no running animations. Defined contrast ratios are recorded; text and cover pairings exceed 4.5:1. These checks do not claim whole-site WCAG conformance.

Real local screenshots are in `evidence/`, including desktop/mobile case and demo, product and bag views, and the short-landscape bag. `evidence/verification.json` contains machine-readable results. Source/schema checks pass separately in `evidence/source-checks.json`. The installed Shopify Liquid validator was attempted but failed because `@shopify/theme-check-common` is absent from that bundle. No dependencies were installed. JSON schema/IDs, locale keys, source assets and embedded JavaScript were checked locally; full Liquid compilation remains unverified.

Residual limits: no live Shopify theme execution/upload, physical-device testing, assistive-technology/screen-reader testing, printing/manufacturing validation, actual music, checkout or real stock. AI image detail varies slightly. Store source requires alternate templates, three fictional catalog products, locale merging and native-theme cart review by the coordinating chat; see `shopify/README.md`. Existing Morrow behaviour must be preserved and rechecked by that integration owner.
