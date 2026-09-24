# ADR-004: Motion policy — one orchestrated moment, everything else answers a user

## Status

Accepted

## Date

2026-09-23 (supersedes the 2026-08-03 reveal system)

## Context

The original motion system applied the same scroll reveal to every section, card
and list row: `opacity: 0 → 1` with `translateY(40px) → 0`, spring, staggered
between siblings, fired once on entry.

Applied uniformly and repeatedly down a long page, that pattern is the most
recognisable generated-page motion there is. It also has real costs:

- Content below the fold starts invisible. If a reveal never fires — a
  JavaScript error, an aggressive scroll position, an interrupted
  IntersectionObserver — the content is simply gone. This actually happened: a
  set of visual-regression goldens had captured pages with rows 2 and 3 of a
  list invisible, and passed, because the goldens had been generated in the same
  broken state.
- It delays the moment a reader can start reading, on every section, on every
  visit.

Motion also has to answer to accessibility: `prefers-reduced-motion` is a
preference people set because motion makes them unwell, not because they are
being fussy.

## Decision

**One orchestrated moment, plus motion that responds to the user.**

1. **The hero load is the single non-user-triggered sequence.** The headline
   lines rise out of their own mask, then the supporting content settles. It runs
   once, on first paint, and it is the only thing on the page that moves without
   being asked to.
2. **Below the fold, content is present.** No per-section entrance animation. If
   something needs to draw the eye, that is a design problem, not an animation
   problem.
3. **Motion that answers an action is welcome.** The FAQ accordion opening, the
   mobile menu sliding in, a form field confirming, a button's hover and press
   states — these show what changed, and they stay.
4. **Scroll-linked motion is bound to scroll position, not to a timer.** The
   deployment-pattern stack on `/deployment-patterns` uses `useScroll` +
   `useTransform`, so it tracks the finger exactly and reverses when the reader
   scrolls back. `src/components/DeploymentStack.tsx` is the reference
   implementation.
5. **Reduced motion is a hard floor.** `MotionConfig reducedMotion="user"` wraps
   every animated component; `src/lib/useLenis.ts` disables smooth scrolling; CSS
   keyframes are switched off in a `prefers-reduced-motion: reduce` block in
   `src/index.css`. Layout that happens to be laid out as a stack stays sticky —
   that is layout, not animation.
6. **Only `transform` and `opacity` are animated.** Both run on the compositor;
   neither can cause layout. This protects CLS and INP, and it is checked by
   `e2e/performance.spec.ts`.
7. **Shared timings live in `src/motion.ts`.** Components do not invent durations
   or easings. Transitions are 150–300 ms with a decelerating curve — no bounce,
   no elastic.

## Alternatives considered

### Keep the uniform scroll reveal, but fix the failure mode

- Pros: no design change.
- Cons: fixes the bug and keeps the tell. The reveal is not wrong because it
  breaks; it is wrong because it is the default.
- Rejected.

### Animate with GSAP ScrollTrigger

- Pros: powerful timelines, precise control.
- Cons: a second animation runtime for one interaction that framer-motion already
  expresses declaratively.
- Rejected.

### A JavaScript `requestAnimationFrame` marquee

- Pros: arbitrary easing.
- Cons: runs on the main thread, which is an INP risk, for an effect that is
  linear and belongs in CSS.
- Rejected. Where a marquee or loop is genuinely wanted, it is CSS keyframes with
  a reduced-motion off-switch.

## Implementation note (2026-09-23)

This ADR was accepted before it was true. The decision above was written, and
`src/motion.ts` was rewritten to state it — but the reveal props were still on
sixteen components and eight pages. A pass through the suite with a working
browser found it: the `/about` page rendered with the medium-weight address line
collapsed and every section still gated on an observer.

All of it is gone. `revealInitial` / `revealWhileInView` / `revealViewport` /
`springReveal` no longer exist anywhere in `src`; `src/motion.ts` exports the
shared easing curve and the policy, nothing else. Two media fade-ins that used
the same props (`BlogPostPage`, `DeploymentPatternDetail`) became plain `<div>`s.

## Consequences

- The home page reads immediately. Nothing below the hero gates on scroll.
- The visual-regression suite is more reliable, because content is no longer
  conditional on an observer firing. `e2e/visual.spec.ts` no longer needs the
  machinery it once carried to force reveals open and assert none were left at
  `opacity: 0`; the system it was defending against does not exist. What remains
  to settle is the hero's load sequence and a scroll-linked transform.
- Readers who ask for reduced motion get a static, complete page rather than a
  degraded one.
- Adding an entrance animation to a new section is now a deliberate exception
  that a reviewer should push back on.
