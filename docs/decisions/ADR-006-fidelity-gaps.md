# ADR-006: Fidelity-gap verification — fixed Buy-template block, once-only reveals, marquee deviation

## Status
Accepted (partially superseded 2026-08-04: buy-template block REMOVED per operator instruction)

## Date
2026-08-03

## Context
The deep-research report on the original site (docs/research/framer-animation-patterns.md) left
open questions about its interaction behavior. A probe round against the live original
(headless-Chromium, per the ADR-005 workflow) answered them:

| Question | Measured verdict |
|---|---|
| Scroll-reveal re-fire | **once-only** — a case-study row (Genesy, 1280×470) sampled 16× on re-pass showed zero opacity/transform change |
| Hero parallax | **none** — badge, headline, and CTAs each moved exactly 400px over 400px of scroll (ratio 1.0) |
| Testimonial marquee | original is **static** — 78 card-like elements page-wide moved 0px over 2.4s; no `marquee`-named CSS animation; no inline transform animation |
| Buy-template block | `position: fixed`, right 20px / bottom 60px, 142×145px, bg `#1c1c1c`, radius 10px, **global** (identical on home and `/blog`), visible on mobile (390px), no entrance animation, links to Polar checkout |

## Decision
1. **Reveals stay `once: true`** (`src/motion.ts`) — matches the original's once-only behavior.
2. **Marquee stays.** The original's testimonials are static, but the operator explicitly
   requested the MagicUI-style dual-row marquee (pasted component, asked for it verbatim).
   Per the project rule "operator instruction wins", this is a **deliberate, documented
   deviation**, not a bug — the 35s dual-reversed-row configuration is unchanged.
3. **Buy-template block becomes a global fixed element** (`src/components/BuyTemplate.tsx`,
   rendered in `Layout`): `fixed bottom-[60px] right-[20px]`, 142×145px, `#1c1c1c`, radius 10,
   `z-40`, visible on all breakpoints, plain static anchor (no entrance animation), linking to
   `buyTemplateUrl` (Polar checkout) in a new tab. Removed from `Hero.tsx`.
4. **No parallax and no image-zoom hovers** were added anywhere — the original has neither.

## Alternatives Considered

### Re-fire reveals on every scroll-back
- Pros: More "alive".
- Cons: The original is once-only; re-triggering reads as jank and hurts CLS/INP.
- Rejected: measured behavior governs.

### Remove the marquee to match the original's static testimonials
- Pros: Perfect fidelity.
- Cons: The operator explicitly requested the MagicUI marquee component for this section.
- Rejected: operator instruction wins (documented deviation).

### Keep the Buy-template block absolute inside the hero
- Pros: Zero rework.
- Cons: The original is `position: fixed` and persists across every page and breakpoint; an
  absolute hero block scrolls away and is missing on subpages.
- Rejected: unfaithful.

### Hide the Buy-template block on mobile
- Pros: Less content occlusion.
- Cons: The original shows it at 390px (right 20 / bottom 60) over content.
- Rejected: unfaithful.

## Consequences
- Clone now matches the original's measured scroll-linked behavior (once-only reveals, no
  parallax).
- The marquee deviation is on record — future reviewers will not "fix" it by accident.
- **2026-08-04 supersession:** the operator removed the buy-template sticker from the site
  ("remove the buy template sticker from the website"). `BuyTemplate.tsx` was deleted,
  `Layout.tsx` no longer renders it, and the `buyTemplateUrl` export was dropped from
  `src/data/content.ts`. Per the project rule "operator instruction wins", this overrides
  decision #3 above — future loop runs MUST NOT re-add the block (see `loop-constraints.md`
  rule #5).
- Per-task review of the fix found no Critical/Important issues; Minor notes (focus-visible
  ring on the new link, consistent with the rest of the codebase) tracked for a future a11y pass.
