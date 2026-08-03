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
| Page background | `#f0f0f0` light gray (every page) |
| Section panels | `#e5e5e5` |
| Cards inside panels | `#f0f0f0` |
| Headings / body text | near-black `#0a0a0a` |
| Nav | light `#f0f0f0`, black text, dark `#151619` "Book a call" pill |
| Hero | light panel, dark headline, orange radial glow accent |

Dark `#151619` appears **only** as a deliberate accent on: the nav pill, all three pricing
cards, the "Working with Us" WhyUs column, one process step, the floating "Buy template" hero
block, and the dark embedded flow illustrations inside Services cards.

This was a fundamental color-system inversion of the clone, so the operator was asked and
confirmed: **"Yes, re-theme to light."**

## Decision
Re-theme the entire clone to the original's light system:

- Global shell: `Layout` background `#f0f0f0`; panels `#e5e5e5` with `50px` radius, floating on
  the page per the original's stacked-panel geometry.
- Semantic tokens in `src/index.css` `:root`: `--color-bg-page`, `--color-bg-panel`,
  `--color-bg-card`, `--color-bg-dark: #151619`, `--color-bg-dark-deep: #0a0a0a`,
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
- `components.md` (docs/research) was written before this re-theme; treat its section-color
  notes as superseded by this ADR where they conflict.
- Design tokens are centralized, so future tweaks are one-line changes in `:root`.
- Contrast remains safe: `#0a0a0a` on `#f0f0f0`/`#e5e5e5` exceeds WCAG AA for body text.
