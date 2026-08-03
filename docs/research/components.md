# AIthor Clone — Component Interaction Research

Source: `aithor.framer.website` (live), extracted via headless Chromium (puppeteer-core),
screenshots, computed-style probing, and bundle analysis (`script_main.*.mjs`).
Date: 2026-08-03.

## Motion system (from bundle + DOM)

- **Scroll reveal (universal).** Every card/row in every section enters with
  `opacity: 0` → `1` and `translateY(40px)` → `0` (observed `matrix(1,0,0,1,0,40)`
  on hidden elements in all 9 sections). Spring config in bundle:
  `{ type: 'spring', bounce: 0.2, duration: 0.7 }`. Stagger between sibling cards.
- **Hover** is a plain CSS/transition state, no spring on hover.
- **Mobile overlay exit** uses `y: '100%'` (slides down out of view).
- One tween exists in the bundle: `{ delay: 0, duration: 0.3, ease: [0.44, 0, 0.56, 1] }`.

## Verified hover states (computed styles before/after)

| Element | Default | Hover |
|---|---|---|
| Benefit card (dark section) | transparent bg | **bg → `#f0f0f0` (light-flip)** |
| Testimonial card (dark section) | `#151619` | **bg → `#f0f0f0`/`#e5e5e5` (light-flip)** |
| Service card title (light section) | `#0a0a0a` | dims to `#4f4f4f` |
| Process card title (light section) | `#0a0a0a` | dims to `#4f4f4f` |
| Footer links (light footer) | `#0a0a0a` | dims to `#4f4f4f` |
| Case-study rows / images | — | **no change (no image zoom)** |
| Pricing cards | `#f0f0f0` | no bg/scale change |

## Section-by-section facts

- **Section labels**: original uses numbered labels `002/ Our Services`,
  `003/ Benefits`, `004/ Our Process`, `005/ Case Studies`, `006/ Why Us`,
  `007/ Our Clients`, `008/ Our Pricing`, `009/ FAQs` (clone matches).
- **Hero**: dark panel inset 3px over orange radial glow; badge "2 slots Available
  this month"; word-by-word reveal; automation-flow card.
- **Services**: 3 cards (gap 15px, radius 20px) on light `#f0f0f0` panel; bar chart
  with 0–50% y-axis scale.
- **Benefits**: 6 cards (gap 10px, radius 15px) on dark panel; light-flip on hover.
- **Process**: 4 cards in 2×2 grid (radius 16px).
- **Case studies**: stacked full-width rows; **no image zoom on hover**.
- **WhyUs**: 3 comparison cards (radius 16px): light gray / dark / highlighted.
- **Testimonials ("What our clients say")**: 6 quotes, cards flip light on hover.
  Note: rebuilt as a dual-row MagicUI-style marquee per operator instruction.
- **Metrics**: light section, 4 dashed cards (radius 30px), big Halant number with
  orange suffix, 4-segment highlighter bar (1 orange + 3 gray), count-up on scroll.
  Targets: **3x / 100+ / 60% / 98%**.
- **Pricing**: light `#e5e5e5` panel, **all three cards `#f0f0f0`, no border,
  radius 20px, no badge, no featured treatment**. Prices $1.995 / $2.995 / $5.995,
  "Per project" badge on Pilot only, `/monthly` suffix.
- **FAQ**: 7 items numbered `01/`…`07/`, accordion with rotating plus icon.
- **Blog**: 3 posts, no newsletter (newsletter lives in the footer).
- **Footer**: **light `#e5e5e5`**. Newsletter block first ("Join 5K+ Readers / Get 1
  actionable AI tip every Saturday. All in under 4 minutes. / Subscribe"), then
  Navigation (Home, About, Case Studies, Blog, Contact), Legal (Privacy policy,
  Terms of service, 404 Page), Socials (X(twitter), Linkedin, You Tube, Instagram),
  bottom row: AITHOR + "©2026 AIthor." + "Designed By Marso" + "Built in Framer".
- **Nav**: fixed, 76px tall, transparent over hero.

## References

- Screenshots: `/tmp/aithor/shots/orig-hover-*.png` (hover states),
  `orig-mobile-nav.png`, `orig-faq-open.png`, `full-desktop.png`.
- Saved DOM: `/tmp/aithor/rendered.html`; bundle: `/tmp/aithor/main.mjs`.
