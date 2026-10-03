# SIDE B — confined Shopify source proposal

No Shopify store was changed. These sections are source intent and do not constitute an uploaded, complete or live-verified theme. The standalone HTML bag is unrelated to Shopify's native cart.

## Integration requirements for the coordinating chat

- Review the source in an isolated draft theme. Copy only namespaced sections/assets. Do not replace Morrow's sections, default product template, cart or native product forms.
- Merge the `side_b` objects from the two locale files into the existing matching locale files; never overwrite those existing files.
- Keep font licences with the distribution. Font files are identical copies of the main module's licensed font assets, renamed for Shopify's flat assets directory.
- Create an alternate SIDE B product template through the theme editor, containing `side-b-product`, and assign it only to the three fictional SIDE B releases. The source does not supply or modify any template.
- Create a SIDE B collection containing these three releases maximum, then select it in `side-b-collection`. The section intentionally renders at most three cards. Product type holds the genre; vendor holds the fictional artist. Proposed prices and formats are documented in the static demo, not sent to any service.
- Configure one product option, Format, with `Black vinyl LP` and `LP + cover print`; attach original physical mockups and alt text to products/variant media as needed. Do not claim real inventory or enable real purchase/fulfillment for fictional products.
- `side-b-product` submits a native product form with variant ID and quantity. The native cart link uses `routes.cart_url`; the existing theme owns its error, quantity, remove and checkout handling. Price and image update from selected variant data when JavaScript is available; without it, each select option includes its price and native form submission still uses the selected variant.
- Prototype genre filtering is implemented in the HTML demo. The Shopify collection section supplies product links; theme-native collection faceting/navigation remains a separate integration task. It must not be claimed as already implemented in Shopify.
- Check variant price/image changes, sold-out behaviour, form errors, native cart quantities/removal, theme-editor rerendering, all viewport sizes and screen-reader behaviour in the target draft theme. Static source checks do not establish those outcomes.

## Primary references checked on 3 October 2026

- https://shopify.dev/docs/api/liquid/tags/form
- https://shopify.dev/docs/api/liquid/objects/product
- https://shopify.dev/docs/storefronts/themes/product-merchandising/variants
- https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema

The installed Shopify Liquid and Shopify App Builder Liquid-theme skills were used for the source proposal. Their search/validation tools are documentation and source-checking aids, not store-access authorization. Validation results are recorded in the module's evidence folder.
