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
- **Section backgrounds**: **no full-bleed panels** — every section is transparent
  over the page `#f0f0f0` (verified-scroll pixel ground truth, 2026-08-04; earlier
  "#e5e5e5 panel" claims were fooled by a zero-size ancestor div). `#e5e5e5` appears
  only on individual cards/rows.
- **Hero**: transparent on the page; badge "2 slots Available this month";
  word-by-word reveal; dark `#151619` CTA pill + `#e5e5e5` secondary pill.
- **Services**: 3 cards (gap 15px, radius 20px) `#e5e5e5`, no border; dark
  illustrations inside. Card 02 (Data & Integrations) shows the operator-provided
  **integration logo marquee** (dual-row, 35s, reverse, pause-on-hover, inline SVG
  brand glyphs). Card 03 (Business Consulting) shows an **animated "Work automated"
  bar chart** (Jan +20% → Apr +51%, bars grow once staggered Jan→Apr and STAY —
  progressive growth matching the labels; the original's grow-hold-reset-loop
  was replaced per operator instruction 2026-08-05); the standalone "Work
  automated" section was removed (it duplicated the card chart). Card 01
  (Workflow Automations) rows slide in staggered.
- **Benefits**: 6 cards (gap 10px, radius 15px) `#e5e5e5`, no border, no bg change on hover.
- **Process**: 4 stacked cards (gap 15px, radius 18px); light cards `#e5e5e5`,
  **dark step is 02** (`#151619`, index 1), not 03.
- **Case studies**: stacked full-width rows `#e5e5e5` radius 20; **no image zoom on hover**.
- **WhyUs**: 3 comparison cards (radius 16px): two `#e5e5e5`, one dark `#151619`
  ("Working with Us"). List glyphs: light columns use a dark-gray **X**, the dark
  "Working with Us" column uses an accent `#ff3700` **checkmark** (measured).
- **Testimonials ("What our clients say")**: 6 quotes, cards `#e5e5e5` radius 16,
  no bg change on hover. Rebuilt as a dual-row MagicUI-style marquee per operator
  instruction; fade edges fade to the page `#f0f0f0`.
- **Metrics**: light section, 4 dashed cards (radius 30px), big Halant number with
  orange suffix, 4-segment highlighter bar (1 orange + 3 gray), count-up on scroll.
  Targets: **3x / 100+ / 60% / 98%**.
- **Pricing**: transparent section; each card `#f0f0f0` (radius 20) wrapping an
  `#e5e5e5` inner layer (radius 16) with a dark `#151619` top block (name/subtitle/
  badge/price/CTA). Prices $1.995 / $2.995 / $5.995, "Per project" badge, `/monthly` suffix.
- **FAQ**: 7 items numbered `01/`…`07/`, accordion with rotating plus icon.
  **No panel** — sits on the page `#f0f0f0`; two-column layout (heading left, rows right).
  Row cards `#e5e5e5` radius 16, question `#0a0a0a` 20px/600, answer `#4f4f4f` 16px lh 23.2,
  plus icon accent `#ff3700` (two 14×2 bars radius 10). No hover change on rows (measured 2026-08-04).
- **Images (2026-08-05 performance pass)**: all referenced photos are now
  size-capped **WebP** (`scripts/optimize-images.py`): testimonial avatars
  1200×1200 PNG ~500kB → 160px WebP ~5kB each (they render at 40px); case-study
  and blog photos downscaled + WebP (q80). Home total transfer dropped
  4.9MB → ~510kB. The hero h1 is the LCP element; its word-reveal base delay
  was reduced 0.5s → 0.2s and the display/body fonts are now `<link rel=preload>`
  in `index.html` (LCP 3.5s → ~1.9s; guarded by `e2e/performance.spec.ts`).
- **Blog**: 3 posts, no newsletter (newsletter lives in the footer). Post meta
  (date) uses `#666` instead of the original's `#999` — axe-core `color-contrast`
  flagged `#999` on `#f0f0f0` at 2.55:1 (fails WCAG AA 4.5:1); `#666` is 5.07:1.
  A11y-driven deviation per operator request (2026-08-05), guarded by
  `e2e/accessibility.spec.ts`.
- **Footer**: **light `#e5e5e5`**. Newsletter block first ("Join 5K+ Readers / Get 1
  actionable AI tip every Saturday. All in under 4 minutes. / Subscribe"), then
  Navigation (Home, About, Case Studies, Blog, Contact), Legal (Privacy policy,
  Terms of service, 404 Page), Socials (X(twitter), Linkedin, You Tube, Instagram),
  bottom row: LOGITECH CONSULTANTS + "©2026 Logitech Consultants." + "Designed By
  Samuel" (Marso → Samuel and "Built in Framer" removed 2026-08-05 per operator;
  rebranded 2026-08-04 per operator).
- **Nav**: fixed, 76px tall, transparent over hero. Hover: links `#4f4f4f → #0a0a0a`, pill `#151619 → #0a0a0a` (measured).
- **Section labels**: `#0a0a0a`, 11.2px, weight 600 (measured; clone updated from 14px).
- **Mobile gutter (2026-08-05 correction)**: at 390px the original's section
  content sits at a **20px side gutter** (cards measure L=20 / R=370 / W=350 —
  verified for Services, Case Studies). The clone previously used a doubled
  15+15=30px gutter (panel padding 15px + inner padding 15px), making every
  card 330px wide — 10px narrower per side than the original. Fixed in
  `index.css`: mobile panel/inner padding now 10px each (20px total); cards
  measure L=20 / R=370 / W=350 at 390px, pixel-matching the original. Desktop
  gutter (40+40=80px → L=80 at 1440px) unchanged. Regression coverage:
  `e2e/mobile.spec.ts` (cards fit viewport at 320–1024px; near-full-bleed).
- **Pricing card hover**: bg stays `#151619`, a soft layered shadow appears (no bg change — measured).
  Clone implements via `.pricing-card:hover` in `index.css` (Tailwind v4 arbitrary `hover:shadow-[…]`
  with commas doesn't apply — var-composition quirk; plain CSS is the reliable equivalent).
- **Blog images**: no zoom on hover (measured none → none); clone's `scale-105` removed (ADR-006).

## Fidelity-gap verification (2026-08-03)

Probe round on the live original (headless Chromium, ADR-005 workflow) to close the open
questions from the deep-research report. See ADR-006 for the decisions.

| Question | Verdict (measured live) |
|---|---|
| Scroll-reveal re-fire | **once-only** — a case-study row (Genesy, 1280×470) sampled 16× on re-pass: zero opacity/transform change |
| Hero parallax | **none** — badge, headline, CTAs each moved exactly 400px over 400px scroll (ratio 1.0) |
| Testimonial marquee | original is **static** — 78 card-like elements page-wide moved 0px over 2.4s; no `marquee`-named CSS animation; no inline transform animation |
| Buy-template block | `position: fixed`, right 20px / bottom 60px, 142×145px, bg `#1c1c1c`, radius 10px, visible on home + `/blog` + mobile (390px), no entrance animation, href = Polar checkout (`buyTemplateUrl`) |

Consequences:

- The clone's `once: true` reveals (`src/motion.ts`) match the original exactly.
- The testimonials marquee is an **operator-mandated** MagicUI component (pasted and requested
  by the operator) — a deliberate deviation from the original's static cards. It stays, and its
  35s dual-reversed-row configuration is unchanged.
- The Buy-template block moved out of `Hero.tsx` into a global fixed component
  (`src/components/BuyTemplate.tsx`) rendered in `Layout`, matching the original's geometry,
  persistence across pages, and mobile visibility. **2026-08-04: removed entirely** per
  operator instruction — the sticker no longer renders anywhere and must not be re-added.

## References

- Screenshots: `/tmp/aithor/shots/orig-hover-*.png` (hover states),
  `orig-mobile-nav.png`, `orig-faq-open.png`, `full-desktop.png`.
- Saved DOM: `/tmp/aithor/rendered.html`; bundle: `/tmp/aithor/main.mjs`.
