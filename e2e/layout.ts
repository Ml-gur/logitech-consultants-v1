import type { Page } from '@playwright/test'

/**
 * How far the document scrolls sideways, in pixels. `0` means it does not.
 *
 * The raw difference `scrollWidth - clientWidth` is not a safe test for this:
 * with `scrollbar-gutter: stable` set on `html` (src/index.css, so that a route
 * change between a short page and a long one does not shift the layout), the
 * content box is *narrower* than the viewport, so the difference comes back
 * negative on a page that is perfectly fine. Asserting `=== 0` then fails on
 * every route for the opposite reason to the one it is guarding against.
 *
 * Only the excess matters, so the result is clamped at zero.
 */
export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
  )
}
