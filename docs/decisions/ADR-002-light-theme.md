# ADR-002: Light theme matching the original (re-theme from dark)

## Status
Accepted

## Date
2026-08-03

## Context
The first full pass of the clone shipped a **dark theme** (`#0a0a0a` page, `#151619` panels,
light text) — an assumption made before deep measurement. A headless-browser audit of the live
original (computed styles + pixel sampling across every section) proved the assumption wrong:

| Surface | Original (measured) |
|---|---|
| Page background | `#f0f0f0` light gray (every page, every section) |
| Section panels | **none** — sections sit transparent on the page |
| Cards/rows inside sections | `#e5e5e5` |
| Lighter card surfaces | `#f0f0f0` (pricing outer card) |
| Headings / body text | near-black `#0a0a0a` |
| Nav | light `#f0f0f0`, black text, dark `#151619` "Book a call" pill |
| Hero | transparent on the page, dark headline, dark CTA pill |

Dark `#151619` appears **only** as a deliberate accent on: the nav pill, the pricing dark
blocks, the "Working with Us" WhyUs column, process step **02**, the floating "Buy template"
block, and the dark embedded flow illustrations inside Services cards.

> **Correction (2026-08-04):** the original draft of this ADR claimed every section is an
> `#e5e5e5` panel floating on the page. Live **pixel ground truth** (verified-scroll screenshots
> sampled per section with `elementsFromPoint` painted-layer checks) proved that wrong: the
> original has **no full-bleed section panels at all** — sections render transparent directly
> on the page `#f0f0f0`, and `#e5e5e5` appears only on individual cards/rows. The earlier
> DOM walk-up was fooled by a zero-size `#e5e5e5` ancestor div (`framer-PhbTP`).

This was a fundamental color-system inversion of the clone, so the operator was asked and
confirmed: **"Yes, re-theme to light."**

## Decision
Re-theme the entire clone to the original's light system:

- Global shell: `Layout` background `#f0f0f0`; section wrappers are **transparent** (page shows
  through), `#e5e5e5` on cards only, `50px` radius wrappers retained for layout geometry.
- Semantic tokens in `src/index.css` `:root`: `--color-bg-page: #f0f0f0`,
  `--color-bg-card: #e5e5e5`, `--color-bg-dark: #151619`, `--color-bg-dark-deep: #0a0a0a`,
  `--color-accent: #ff3700`, text/muted/border tokens.
- Dark accents confined to the measured list above (nav pill, pricing, WhyUs column, process
  step, Buy-template block, Services illustrations).
- Hover states flipped accordingly: cards light-flip `#151619 → #f0f0f0` in dark contexts;
  titles/footer links dim `#0a0a0a → #4f4f4f`.

## Alternatives Considered

### Keep the dark theme
- Pros: Zero rework; some find dark "premium-looking".
- Cons: Unfaithful to the reference; every pixel comparison would fail.
- Rejected: fidelity is the project's first requirement.

### Hybrid (light page, dark hero/features)
- Pros: More "exciting" first impression.
- Cons: The original is unambiguous — there is no dark hero panel, and section gaps are
  uniformly light.
- Rejected: invented composition.

## Consequences
- Clone now matches the original's measured colors, section gaps, and dark-accent placement.
- Sections are transparent over page `#f0f0f0` (no full-bleed panels); cards are `#e5e5e5`.
- `components.md` (docs/research) was written before this re-theme; treat its section-color
  notes as superseded by this ADR where they conflict.
- Design tokens are centralized, so future tweaks are one-line changes in `:root`.
- Contrast remains safe: `#0a0a0a` on `#f0f0f0`/`#e5e5e5` exceeds WCAG AA for body text.
