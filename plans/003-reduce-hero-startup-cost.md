# Plan 003 — Reduce hero startup cost without harming accessibility

- **Baseline commit:** `59de2fb`
- **Finding:** The first route eagerly loads a remote autoplaying video as a hero background and starts four independent `requestAnimationFrame` counters after intersection. This adds network/decode work to the critical route and can consume CPU/battery before the visitor reaches the content below.
- **Category:** Performance/accessibility
- **Impact:** Higher mobile data use, slower first meaningful interaction, unnecessary media/animation work, and potential motion sensitivity issues.
- **Effort:** M
- **Fix risk:** Medium. Hero is the primary visual surface and changes can affect layout, visual snapshots, and reduced-motion behavior.
- **Confidence:** High.
- **Evidence:** `src/components/Hero.tsx:20-25` loads a remote CloudFront MP4 with `autoPlay muted loop playsInline`; `src/components/Hero.tsx:5-27` creates one IntersectionObserver and RAF loop per stat. `src/motion.ts:2-4` currently defines reveal states as already visible, so this plan must not assume motion is disabled globally.

## Ordered implementation steps

1. Measure the current baseline with the existing Playwright setup at desktop and mobile: capture load timing, video request/bytes if available, and the hero screenshot. **Verify:** baseline artifacts are saved outside the repository or intentionally updated only after review.
2. Make video loading non-blocking: keep the poster as the immediate fallback, add an explicit preload strategy appropriate for a decorative background, and ensure the video is not fetched/played when `prefers-reduced-motion: reduce` or when the browser indicates constrained data. Keep the video `aria-hidden` and decorative semantics. **Verify:** reduced-motion and data-saver browser tests show the poster remains visible and no autoplay violation/console error occurs.
3. Consolidate metric animation scheduling into one observer/RAF coordinator or a shared hook, cancel RAF work on unmount, and skip the animation under reduced motion. Preserve the final metric values and avoid starting duplicate loops if the element re-enters the viewport. **Verify:** unit/component or Playwright checks confirm each counter reaches its target once, cleanup occurs on navigation, and reduced-motion renders final values without animation.
4. Preserve accessible names and semantics for the metric group, hero heading, links, and decorative video. **Verify:** `e2e/accessibility.spec.ts` reports no new violations and the existing skip-link/focus test still passes.
5. Compare the final bundle/network behavior against baseline and update visual snapshots only if the poster/video timing intentionally changes pixels. **Verify:** `npm run build`, `npm run test:e2e:visual`, and mobile E2E pass.

## Done criteria

- Decorative video is not a critical blocking resource and is suppressed for reduced-motion/constrained-data users.
- Metric RAF work is bounded, cancellable, and does not restart on repeated intersections.
- `npm run build` and `npm run test:e2e` pass.
- No horizontal overflow or hero layout shift is introduced at 320, 390, 768, and 1440px.

## Stop conditions

Stop if the media provider does not support the required caching/range behavior or if a browser test cannot observe the network policy reliably; report measurements instead of deleting the hero media or adding speculative polyfills.

## Maintenance note

Any future hero media or stat metric must preserve the poster-first, reduced-motion, and cancellation guarantees. Treat the remote media URL as a deployment dependency and monitor its transfer size separately from the JS bundle.
