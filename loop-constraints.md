# Loop Constraints — aithor-clone (AIthor website)

> Read at the start of EVERY loop run (loop-constraints skill). Binding — every
> rule below MUST be enforced. Derived from ADR-001..006 and live measurements.

## 1. Fidelity — the #1 rule

1. NEVER invent design values. Measure the live original (`aithor.framer.website`)
   first — ADR-005 workflow: puppeteer probes (computed styles, geometry,
   pixel sampling, interaction simulation) against original and clone.
2. Light theme (ADR-002): page `#f0f0f0`, panels `#e5e5e5`, cards `#f0f0f0`,
   text `#0a0a0a`, muted `#4f4f4f`, accent `#ff3700`. Dark `#151619` ONLY for:
   nav pill, the 3 pricing cards, the WhyUs "Working with Us" column, one process
   step, the Buy-template block, and the Services flow illustrations.
3. Motion (ADR-004): reveals once-only, spring `{ bounce: 0.2, duration: 0.7 }`,
   `translateY(40px)` — via `src/motion.ts` (single source of truth). Hovers are
   CSS transitions (150–250ms), never springs. NO parallax. NO image-zoom hovers.
4. Marquee (ADR-006): operator-mandated MagicUI component. Keep as-is — 35s,
   dual reversed rows, pause-on-hover, edge fades. DO NOT "fix" it to static;
   the original's testimonials are static but the operator requested the marquee.
   - Services "Work automated" chart (2026-08-05 operator): bars grow ONCE,
     staggered Jan→Apr, and STAY (progressive growth, matches +20→+51% labels).
     The original's grow-hold-reset-LOOP is replaced — do not re-add the loop.
5. Buy-template block: **REMOVED** per operator instruction (2026-08-04). Do not
   re-add (`BuyTemplate.tsx` deleted; `buyTemplateUrl` dropped from `content.ts`).
   Supersedes ADR-006's original mandate.
6. Layout geometry: content column max 1400px (L=80/R=1360 at 1440px). Hero
   composition centered. Services / WhyUs / Pricing headings centered (L=370).
   Benefits / Process / CaseStudies / Testimonials / FAQ / Blog left (L=80).
   Nav 76px fixed. Footer bottom row: © left, "Designed By Samuel" (2026-08-05
   operator: Marso → Samuel; the trailing "Built in Framer" text was REMOVED).

## 2. Code

7. TypeScript strict. No semicolons. Single quotes. 2-space indent. Trailing
   commas in multiline.
8. Components < 200 lines; split before exceeding. Reuse `src/motion.ts`, the
   `cn()` util, and the design tokens in `src/index.css`.
9. Animate only `transform` and `opacity`. Honor `prefers-reduced-motion`
   everywhere (marquee must disable; reveals must skip).
10. One fix per run (`minimal-fix`). No drive-by refactors.

## 3. Paths

11. DENY: `.env*`, `dist/`, `node_modules/`, `.superpowers/`, `.claude/` (scaffold —
    do not edit), `/tmp` scratch, anything outside `aithor-clone/`.
12. ALLOW: `src/`, `docs/`, loop files (`LOOP.md`, `STATE.md`, `loop-*.md`),
    `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`, `README.md`,
    `AGENTS.md`.

## 4. Accessibility

13. Designed focus rings (2px `#ff3700`, offset 3px) — global rule in `index.css`.
    Never browser-default outlines. Form fields: ring-only (not outline).
14. 44px touch targets. Form fields: visible labels, visible focus, error states
    with `aria-invalid` (contact form already implements this — preserve it).
15. Skip link is the first tab stop and navigates into `#main`. Full keyboard
    navigation must work on every route.
16. Every route: ZERO console errors; no horizontal overflow at 390px.

## 5. Verification gates (before anything is marked done)

17. `npm run typecheck` — clean.
18. `npx vite build` — clean.
19. Browser probe (puppeteer) for every change: compare to the original where
    applicable (ADR-005); zero console errors; mobile 390 no overflow.
20. Independent verifier (`loop-verifier`) must APPROVE. Verifier runs its own
    tests — never trust the implementer's claim alone.

## 6. Push & Merge

21. Never auto-merge to main. Never push without human approval.
22. Week-one is report-only: no unattended fixes or merges.

## 7. Budget & run loop

23. One fix per item; max 3 attempts per item, then escalate to the human.
24. Early-exit: when triage finds no actionable High-Priority items, the loop is
    COMPLETE — report and stop.
