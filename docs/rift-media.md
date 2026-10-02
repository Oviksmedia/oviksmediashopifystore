# RIFT — concept direction and media record

RIFT is fictional, self-initiated portfolio work for Oviks Media. No client relationship, customer research, garment testing or commercial results are claimed.

## Design intent

Audience hypothesis: club riders who value the collective experience and the appearance of their kit. One proposed jersey makes the release legible. A rising diagonal joins garment, identity and route graphic. Cobalt blue owns the large brand surfaces; acid yellow identifies the line and the main action. Heavy compact system sans typography deliberately borrows from race signage and avoids the warm serif register of Morrow. Native controls, visible selection and explicit bag totals support a direct product decision after the campaign introduction.

## Implementation brief

Objective: provide a distinct, reviewable case study and working static storefront concept.
Non-goals: checkout, real inventory, payment, signup, Shopify integration, deployment or product performance claims.
Owned surfaces: src/rift.html, src/rift-demo.html, assets/rift.css, assets/rift-demo.js and rift media.
Data boundary: size-indexed quantities 1–10 stored only in browser localStorage under oviks-rift-concept-bag-v1. Corrupt data is rejected; unavailable storage permits a temporary in-page bag with a visible explanation. Bag quantity updates and removal are reversible. No data is sent to a service.
Evidence plan: JavaScript parse, browser-local journey, narrow viewport overflow, images, dialog keyboard behavior and bounded colour checks. Production garment and real-device validation remain out of scope.

## Generated assets

Generated with the built-in imagegen tool on 2026-10-03. Art direction, prompt shaping, selection and page composition were part of this project. No stock provider or external brand photography was used.

- assets/rift-campaign.webp: 1672 × 941, 136064 bytes, optimized from the generated PNG with bundled sharp, WebP quality 85. Three adult cyclists in the concept jerseys, volcanic route at dawn. Original: C:/Users/Oviks/.codex/generated_images/01a0fed4-05b4-7162-9337-7f113c2360d3/exec-1ec05ab9-7ec7-4348-a638-9130b7806676.png.
- assets/rift-jersey.webp: 1100 × 1100, 141986 bytes, resized and optimized from the generated PNG with bundled sharp, WebP quality 85. Isolated front garment concept. Original: C:/Users/Oviks/.codex/generated_images/01a0fed4-05b4-7162-9337-7f113c2360d3/exec-fad8f7c7-47d3-4727-837a-7d16c031c5f3.png.
- The wordmark slash and route line are original code-native graphic elements. No third-party logo assets or web fonts are used.
- docs/preview/rift-demo-preview.png, docs/preview/rift-mobile-preview.png and docs/preview/rift-case-preview.png are local browser review evidence, not campaign assets. They are not referenced by the website.

The generated campaign and product view have variations in stripe width and fabric detail. These are illustrative concepts, not photographs of the same manufactured garment. Both case and demo disclose AI-assisted imagery. Size measurements and prices are illustrative. No material composition or technical performance is claimed.

### Campaign prompt

Use case: ads-marketing. Asset type: wide cinematic website campaign photograph for a fictional self-initiated cycling apparel identity RIFT. Three adult cyclists, diverse genders and skin tones, riding road bicycles in a close disciplined group on a clean curving asphalt road in a volcanic black landscape at dawn. They wear matching vivid cobalt blue short-sleeve cycling jerseys with a single sharp diagonal electric acid-yellow stripe across chest and sleeve, black cycling bib shorts and black helmets. Editorial sports photography, authentic bike proportions and anatomy, low side angle, strong forward movement, subtle background motion blur and sharp riders, austere grey sky. Compose riders predominantly center and right with a generous darker quiet area on left for separate HTML title; landscape 16:9. Detailed technical fabric but no claims. Premium purposeful sports campaign, natural photographic grain. No visible commercial brands, no text, no watermark, no trophies, no race numerals. The blue jersey and acid diagonal stripe must be immediately readable.

### Product prompt

Use case: product-mockup. Asset type: premium ecommerce product photograph, square 1:1. One fictional RIFT cycling jersey, displayed front-on on an invisible mannequin, short fitted sleeves, high neck and full-length central black zipper. Vivid cobalt blue technical fabric with exactly one clean diagonal acid-yellow stripe running from low left torso up to high right chest and continuing across sleeve, matching a cycling campaign identity. Subtle tonal seams, structured realistic textile, clean hem and symmetric front view, tiny plain black fabric neck label with no readable writing. Solid very pale cool grey studio backdrop and crisp directional side lighting, light soft grounding shadow. Shirt fills 76 percent of frame, generous outer breathing room, isolated single garment, magazine-quality product still life with detailed weave. No human head or limbs, no props, no existing commercial logos, no text, no watermark. This is a design concept, not a real garment.

## Verification record

- Bundled Node --check assets/rift-demo.js: passed.
- Bundled Playwright Chromium, local URL interception serving the authored source and assets: no horizontal overflow at 320, 390, 768 or 1440 px. This is local browser evidence, not hosting or device evidence.
- Empty bag, missing-size validation, M add at £95, increment to £190, decrement to £95, reload persistence, removal to £0 and corrupt saved data recovery: passed.
- No JavaScript page errors in that journey.
- Full-page storefront previews visually inspected at 1440 and 320 px. Case preview visually inspected with its project CSS in a minimal HTML wrapper at 1440 px.
- Both generated images decoded successfully after scrolling the lazy product image into view: campaign 1672 px wide, product 1100 px wide.
- Quantity ceiling reached at 10: subtotal £950, increment disabled, further add displayed an explicit maximum message. Unavailable localStorage write was simulated and kept the in-page bag usable with a visible temporary-storage explanation.
- Native dialog Escape returned focus to the product add button. Explicit first/last button wrap was added after Chromium allowed focus to reach browser chrome at the end of its native Tab cycle; 20 forward and 20 backward Tab presses then remained within the dialog.
- Styled case wrapper: no horizontal overflow at 320, 390, 768 or 1440 px. A raw fragment without its required stylesheet is not representative of integration.
- Reduced-motion media emulation active; no motion is required by the interface.
- Calculated foreground/background contrast: carbon/acid 16.58:1, white/cobalt 7.05:1, cobalt/paper 6.46:1, secondary text/paper 6.34:1, size-control border/paper 4.11:1. These are bounded pairing checks, not a complete WCAG conformance audit.
- No real iPhone, Android or live hosting tests were run. No deployment, platform integration or physical garment verification is claimed.
- After parent build integration, Chromium visited http://127.0.0.1:4391/rift.html and /rift-demo.html: both decoded their two WebPs and had no horizontal overflow at 320 and 1440 px. Adding size L opened the demo dialog with subtotal £95. No JavaScript page errors were recorded. This confirms the local generated-page boundary only.
- Independent Assurance identified that the live status outside the modal was ignored by Chromium while the native dialog was active. Status was moved inside the dialog as a normal-flow, atomic polite live region; the add message now updates on the first animation frame after opening. Source-level CDP Accessibility.getPartialAXTree checks found role=status with ignored=false for add, increment, decrement and removal. Core bag totals, persistence, empty and validation states passed again; 20 forward/backward Tab presses remained contained and Escape restored add-button focus. At 320 px the status did not overlap bag items and neither page nor dialog overflowed horizontally. No page errors or JavaScript syntax errors. This checks accessibility-tree exposure; actual screen-reader speech was not tested. Parent must rebuild the generated page to include this fix.

## Integration contract

src/rift.html is a main-content fragment. Parent builder supplies the portfolio header/footer and links assets/rift.css alongside assets/portfolio.css. src/rift-demo.html is a complete standalone document. Published output names should be rift.html and rift-demo.html at the root, with assets/ paths unchanged. Case CSS is scoped under .rift-case and standalone CSS under .rift-demo or project-specific component classes. The case links index.html, morrow.html and rift-demo.html; the demo returns to rift.html.
