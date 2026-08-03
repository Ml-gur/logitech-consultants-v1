# ADR-004: Motion system — measured spring reveals + CSS-driven marquee

## Status
Accepted

## Date
2026-08-03

## Context
The original's motion was extracted from its shipped bundle and from DOM observation:

- **Universal scroll reveal:** every card/row in every section enters with
  `opacity: 0 → 1` and `translateY(40px) → 0` (hidden elements show `matrix(1,0,0,1,0,40)`),
  spring `{ type: 'spring', bounce: 0.2, duration: 0.7 }`, staggered between sibling cards,
  single-fire on first view.
- **Marquee:** the "What our clients say" testimonials run as a **two-row infinite marquee**
  (row 1 forward, row 2 reversed, ~35s loop, pause on hover, gradient edge fades). Cards
  light-flip `#151619 → #f0f0f0` on hover.
- **Hovers:** card surfaces change color (never scale/rotate — the original has no image zoom
  on case studies); service/process titles and footer links dim `#0a0a0a → #4f4f4f`; nav links
  get an underline sweep; buttons get a fill change. No spring on hovers — plain transitions.

## Decision

### Reveals — shared config, framer-motion `whileInView`
Centralize the extracted recipe in `src/motion.ts` and use it everywhere:

```ts
export const revealInitial = { opacity: 0, y: 40 }
export const revealWhileInView = { opacity: 1, y: 0 }
export const revealViewport = { once: true, margin: '-50px' }
export const springReveal = (delay = 0) =>
  ({ delay, type: 'spring', bounce: 0.2, duration: 0.7 }) as const
```

- Single source of truth → every section reveals identically (fidelity + consistency).
- `once: true` + `margin: '-50px'` → trigger once, slightly before the element is fully visible.
- Staggering via per-child `delay` (0.05–0.15s) for card grids.

### Marquee — pure CSS keyframes (MagicUI-compatible)
`src/components/Marquee.tsx` implements the MagicUI `Marquee` API (verified against the
upstream source): children rendered `repeat` times (default 4), track translates
`0 → calc(-100% - var(--gap))`, `--duration`/`--gap` CSS variables, `reverse` via
`animation-direction: reverse`, `pauseOnHover` via `group-hover:[animation-play-state:paused]`,
vertical variant via `marquee-vertical`. Keyframes live in `src/index.css`; a
`prefers-reduced-motion: reduce` rule disables the animation entirely.

### Guardrails
- Animate **only `transform` and `opacity`** — compositor-thread, zero layout cost (protects
  CLS/INP; Lighthouse "avoid non-composited animations" stays green).
- Reduced-motion fallback for marquees (WCAG 2.3.3, animation from interactions).
- Hovers are CSS transitions (150–250ms), not springs — matching the original.
- `lenis` smooth scroll is applied at the shell level, with `[data-lenis-prevent]` used where
  the original locks internal scrolling.

## Alternatives Considered

### GSAP ScrollTrigger for reveals
- Pros: Powerful timelines.
- Cons: Imperative API; overkill for a single repeated recipe; adds a second animation runtime.
- Rejected: framer-motion already matches Framer's model 1:1.

### JS rAF-driven marquee
- Pros: Arbitrary easing.
- Cons: Runs on the main thread (INP risk); the original marquee is linear, which CSS handles
  perfectly; MagicUI's proven pattern is CSS.
- Rejected.

### Per-component animation props (no shared config)
- Pros: None.
- Cons: Drift between sections; the whole point is a uniform system.
- Rejected: `src/motion.ts` is the single source of truth.

## Consequences
- Clone reveals and marquee timing match the original's measured values.
- One shared config file keeps future sections consistent by construction.
- Marquee animates off the JS thread; reduced-motion users get a static grid (a11y pass).
- No image-zoom hovers anywhere — preserving the original's restraint and avoiding a common
  "AI-generated" tell.
