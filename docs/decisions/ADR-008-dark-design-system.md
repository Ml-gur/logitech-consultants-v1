# ADR-008: Dark LaunchDarkly-style design system (design.md adoption)

## Status
Accepted

## Date
2026-08-13

## Context
The operator provided a complete design reference (`design.md` — an extracted
LaunchDarkly-style system, also linked as the refero style
`styles.refero.design/style/18a75348-…`) with explicit tokens, components, and
do/don't rules, and requested: "improve our website following the instructions
the design.md file … invoke necessary skills … audit the full website through
that". The site was previously a light "aithor" clone theme (page `#f0f0f0`,
orange `#ff3700` accent, dark `#151619` accents, numbered section labels).

Operator decisions during scoping (2026-08-13):

| Question | Decision |
|---|---|
| Scope | **Full site — all 7 routes** (Home, About, Case Studies, Case Study detail, Blog, Blog post, Contact) |
| Home anatomy | **Match design.md anatomy** (hero form → logo strip → tabbed features → code block → resource cards), keeping Logitech Consultants' content/messaging |
| Typography | Use what design.md recommends (substitutes: Inter / Geist / Söhne / Space Grotesk for display; JetBrains Mono / IBM Plex Mono / Geist Mono for code) |
| Brand accent | **Fully adopt violet/blue** — orange removed everywhere |
| Process | Install + invoke the `referodesign/refero_skill` (`refero-design`), keep the dev server running on localhost so changes are trackable |

## Decision
1. **Adopt the design.md system as the site's design language** (this is the
   reference lock — the operator explicitly asked to adopt this style):
   - Canvas **Midnight Ink `#0e0e0e`**, surfaces **Carbon `#191919`** (nav pill,
     cards, footer, inputs), hairlines `rgba(255,255,255,0.1)`, elevation via
     **glow** (`rgba(64,91,255,0.25)` / `rgba(112,132,255,0.19)`) — drop shadows
     only on the floating nav pill.
   - Accents: **Signal Violet `#7084ff`** (headline line 2, links, checkmarks,
     ghost CTAs, focus rings) + **Voltage Blue `#405bff`** (primary CTA fills).
     The `179deg #405bff → #7084ff` gradient powers ambient glows. **No other
     accents** — orange `#ff3700` removed site-wide.
   - Radii: **60px** nav pill / full-width containers, **30px** cards/tags/
     buttons, **10px** inputs.
   - Typography: **Inter** (self-hosted, weights 400/500/600/700 — the font
     files were already Inter despite the old mislabeled Halant/Geist
     declarations; declared correctly now) with **weight-500 tight headlines**
     (line-height 1.0–1.09, negative tracking); **JetBrains Mono** (400/500,
     newly self-hosted) for SDK names, code, and technical identifiers.
   - **Hero:** "Move at AI speed." (white) / "Stay in control." (Signal Violet)
     + glowing email-capture form (Carbon composite, Voltage Blue "Get started").
   - **White product panels** on the dark canvas (the three service illustrations
     rebuilt light-on-white; the tabbed section is the design.md Segmented Tab
     Control: Workflow Automations / Data & Integrations / Business Consulting).
   - **Code integration section** ("Copy, paste, go.") with a Dracula-syntax
     code block (keywords `#66d9ef`, strings `#a6e22e`, literals `#f92672`,
     comments `#8a8c8e`) and a copy button.
   - **Resource card grid** (3 columns), metrics, WhyUs comparison, case-study
     rows, testimonials, process, pricing, FAQ, blog cards, and all inner pages
     re-skinned to the same system.
2. **Home page structure follows design.md's anatomy** while preserving
   Logitech content: Hero → Logo strip → Tabbed features → Code integration →
   Metrics → Case studies → Testimonials → Why us → Process → Resources →
   Pricing → FAQ. Section labels drop the old "00X/" numbering for wide-tracked
   uppercase eyebrows. `Services.tsx` and `Benefits.tsx` were deleted
   (superseded by `TabbedFeatures.tsx`; benefits folded into tab checklists).
3. **E2E suite updated to the new design** (labels, violet assertions, exact
   matches, tab-switch chart/marquee tests) and **visual goldens regenerated**
   for all 16 captures.
4. **Audit tooling:** `scripts/design-audit.mjs` runs the design.md compliance
   checks (nav pill 60px, CTA `#405bff` + 30px, mono code font, zero orange,
   no horizontal overflow, no console errors) against the production build.

## Alternatives Considered

### Re-skin the existing light theme in place (keep sections/structure)
- Pros: Less churn; existing E2E assertions mostly unchanged.
- Cons: The operator explicitly chose "match design.md anatomy" — the numbered
  light theme was not the target. Rejected.

### Keep Halant serif display
- Pros: Zero font changes.
- Cons: design.md specifies a weight-500 grotesk for display; the self-hosted
  font files are Inter anyway (the Halant names were mislabels). Rejected.

### Keep orange as a secondary brand accent
- Pros: Preserves the previous wordmark accent.
- Cons: design.md is explicit: "monochromatic-plus-violet — adding green, red,
  or yellow dilutes the signal." Operator chose "fully adopt". Rejected.

### Keep the Framer height-tween on the FAQ accordion
- Pros: Animated expansion parity.
- Cons: JS height measurement is layout-expensive and spiked the lab INP metric
  under CPU contention; a conditional render + rotating plus gives the same
  affordance for less work. The FAQ now renders the answer only when open
  (plus icon rotates). Rejected.

## Consequences
- The site is now a cohesive dark "control-room" system across all 7 routes.
- Performance: LCP ~0.8s, CLS 0.000, INP 32–64ms isolated (budgets 2.5s /
  0.1 / 200ms). The perf INP test can read higher under 2-worker CPU
  contention and relies on its `retries: 3` (stable at CI's `--workers=1`).
- Accessibility: axe A/AA clean on all 12 scanned routes; contrast on dark
  surfaces uses ash/fog (never slate for small text); code block and tab list
  are keyboard-focusable scroll regions.
- Full E2E suite: **61/61 green** at `--workers=1` (CI config); typecheck +
  build clean.
- JetBrains Mono (2 woff2, ~21 kB each) was added to `public/fonts`; the stale
  Halant/Geist @font-face declarations and index.html preloads were removed.
- Future work should keep every new component on the token system (Tailwind v4
  `@theme` utilities: `bg-midnight`, `text-ash`, `text-signal`, `rounded-pill`,
  …) and the design.md do/don't rules (30px pill radii, glow not shadow, no
  extra accents, mono for code, white product panels, tight headline leading).
