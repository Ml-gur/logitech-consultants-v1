/**
 * Motion policy, and the one timing value that is genuinely shared.
 *
 * There is a single orchestrated moment on this site: the hero's page-load
 * sequence (src/components/Hero.tsx). Everything below it is present from first
 * paint. No section, card or list row fades in as it scrolls into view.
 *
 * That pattern was here before, applied uniformly to every element on every
 * page, and it is the most recognisable generated-page motion there is. It also
 * has two costs that are not aesthetic:
 *
 *   · content below the fold is invisible until an IntersectionObserver fires,
 *     so if it never fires the content is simply gone. A set of visual goldens
 *     was once recorded with rows 2 and 3 of a list missing, and the comparison
 *     against them passed;
 *   · it delays the moment a reader can start reading, on every section, on
 *     every visit.
 *
 * What remains is motion that answers a person: the hero load, an accordion
 * opening, a menu sliding in, a hover state, and the scroll-linked
 * deployment-pattern stack in src/components/DeploymentStack.tsx, which is bound
 * to scroll position rather than to a timer. `MotionConfig reducedMotion="user"`
 * wraps every animated component, so `prefers-reduced-motion` is honoured rather
 * than treated as a nicety.
 *
 * Only `transform` and `opacity` are animated. Both are compositor-only and
 * cannot cause layout, which is what keeps CLS and INP inside the budgets that
 * e2e/performance.spec.ts asserts.
 */

/**
 * The decelerating curve every transition on the site uses: expo-out, which
 * arrives fast and settles gently. Deliberately not a spring or a bounce, both
 * of which read as dated on a page that is otherwise still.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const
