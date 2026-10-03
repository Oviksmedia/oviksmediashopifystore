# Five Shopify storefronts

Objective: transition RIFT, SABLE, DAYBREAK, ARC and SIDE B from browser-local prototypes to separate Shopify development stores, preserving their visual direction while using actual Shopify product/variant data and native carts. Morrow remains the existing independent skincare demo.

Review base: `12dd7c8`, with implementation on `codex/shopify-store-migration`.

Non-goals: real sales, payment activation, fulfillment, invented clients, new imagery, a paid plan or changing Morrow's catalog/theme. All products remain fictional portfolio concepts.

Changes: generated complete themes in `shopify-stores/{slug}/theme`, catalog inputs in `shopify-stores/catalogs.json`, and public store/verification records. The authored portfolio prototypes remain available until new storefronts are verified. New native product, collection and cart pages share each brand's shell. Homepage headings and hero images are editable in Shopify's theme editor.

Highest-risk assumptions: variant IDs/prices and availability must come from each exact store's catalog; file/font URLs must survive Shopify's flat assets structure; gallery controls and finish choices must remain distinct; empty and populated carts must work without browser-local storage. Catalog imports target only the five fresh development stores and use stable handles to prevent duplicate products on retry.

Evidence plan: deterministic theme generation, Shopify Theme Check, draft upload with correct target store, browser desktop/mobile inspection, product/variant selection, native add, quantity update/removal, empty/sold-out states, links/images/fonts and visitor-password verification. Static checks alone do not establish Shopify rendering or native cart behavior.

Recovery: draft themes can be replaced without altering existing live themes; fictional catalog products can be left unpublished if verification fails. No checkout action or payment configuration is included. Store creation/catalog setup is authorized by the owner's request to transition all five projects. Any unavoidable provider login/authorization step is handed to the owner while local preparation continues.

Status: all five custom themes are published; catalog, visitor access and native shopping checks passed.


## Completed migration — 3 October 2026

All five intended themes are published and their exact live IDs verified through Shopify CLI listings. Catalog imports created ten fictional products with twenty-eight unique variants and published them to their Online Store channels. `shopify-stores/stores.json` records URLs, public visitor passwords and theme IDs; each `catalog-receipt.json` records actual catalog data.

### Verification actually performed

- Official Shopify CLI 4.8.4 Theme Check: zero errors/warnings for all five complete themes. The plugin helper’s missing dependency does not prevent this official check.
- Independent source/receipt assurance checked isolation, currency, every product/variant/title/price, retry identifiers, generated JSON and flat asset/font references. Its price, gallery-caption and button-contrast findings were corrected in authored source and regenerated.
- Fresh-cookie HTTP checks ran on draft previews and normal published URLs. They verified visitor access, custom home theme, collection links, every product page and all twenty-eight rendered variant IDs. One selected variant per store was added, updated to two with its recalculated subtotal, then removed to an empty bag. These were actual form posts without JavaScript.
- Browser tests: ARC Graphite showed 440 USD and two units gave 880 USD; removal restored the empty bag. SABLE Ink retained its correct caption/alt after returning from material detail. RIFT required a size; DAYBREAK required a preparation. SIDE B Ambient showed only Soft Static and All records restored three records.
- Narrow layout checks found no horizontal overflow at 390px in RIFT, SABLE, DAYBREAK and SIDE B, with loaded images present. The seven combined portfolio overview/case pages also passed 390px checks and displayed correct access details. ARC’s actual published empty-cart button was verified as white text on its dark background. Evidence is under `shopify-stores/evidence/`.
- The portfolio builder validates all twelve generated pages, main landmarks, local resources, links/fragments and CSS paths. Primary overview/case actions now lead to Shopify. New case studies place their own password near the first store action and in a closing access block.
- Netlify production deploy `6ac114640eb1202022094da2` serves the updated portfolio at https://oviks-morrow-portfolio.netlify.app/. All seven overview/case pages returned HTTP 200 with visible text matching the build and their exact Shopify links/passwords; the published shared stylesheet matched the build byte for byte. The public browser showed all six access notes, loaded images and no desktop overflow. Netlify rewrites local links to clean URLs and inserts a hosting comment, so raw HTML bytes differ. See `evidence/netlify-public.json` and `evidence/portfolio-live.jpg`.

### Scope and limits

These are published Shopify development demos accessed with their supplied visitor passwords. Morrow’s existing catalog/theme was not altered by this migration. Prototype screenshots retained in case studies stay labeled as prototype captures.

No checkout, payment activation, real fulfillment, verified product specifications, sales evidence or client relationships were added. All variants are currently available; sold-out rendering was source-reviewed rather than tested by changing the catalog. Physical devices and screen readers were not tested. HTTP evidence proves the tested form flows, not commercial launch readiness or every variant’s complete UI path.

### Future work

Edit shared authored files under `shopify-stores/source/` and the theme builder, regenerate, and review a Shopify draft before substantial publication changes. Homepage heading, hero image and product choices can also be edited in Shopify; capture those merchant settings before regeneration/upload if they need to be retained. Rebuild and deploy the portfolio separately when links, passwords or case descriptions change. Use the complete themes, rather than historical module source proposals.
