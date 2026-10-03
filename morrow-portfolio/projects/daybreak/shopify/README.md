# DAYBREAK Shopify source proposal

No store calls, upload or publishing was performed. The HTML bag has no Shopify integration.

`daybreak-roast-collection.liquid` is a namespaced, configurable Online Store 2.0 section. It exposes three product blocks and submits selected actual variant IDs through native product forms. Option text contains the exact variant title and price; unavailable variants are disabled. It does not replace the existing theme cart, product templates or Morrow forms.

Integration requires the coordinating chat to review a draft theme and catalog first; create or choose separately approved DAYBREAK products, define grind/250 g variants, prices, inventory and final truthful copy, upload approved product assets, select those products in the section editor, and load the licensed font files through theme asset URLs. This section intentionally has no fabricated variant IDs or handles. Native form errors remain present. Stock, discount, localization and tax behavior depend on the real catalog and theme.

The source CSS uses scoped daybreak-liquid classes. Font files are supplied under ../assets/daybreak/fonts; self-hosting must adapt the URLs via asset_url in the host theme.

Primary docs inspected:
- https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema
- https://shopify.dev/docs/api/liquid/tags/form
- https://shopify.dev/docs/storefronts/themes/product-merchandising/variants

App Builder guidance was read for a focused section proposal. Shopify Liquid's bundled search_docs.mjs ran. Its validate.mjs cannot start because @shopify/theme-check-common is absent. No package installation is authorized. Local schema JSON, unique settings and tag-balance checks are provided by verify.mjs; they are not Shopify rendering or Theme Check.

Before upload: run Theme Check in the coordinating environment, preview section editor defaults/empty product states, sold out and price-varied variants, actual additions and native cart updates, render fonts in the target theme, and check keyboard/mobile/screen-reader behavior. Preserve all existing Morrow product pages and native bag.
