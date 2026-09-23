import type { Page } from '@playwright/test'

/**
 * Wait until every font the site declares has actually loaded.
 *
 * The site sets `font-display: swap`, so text paints in a fallback face first.
 * On a machine with no system fonts installed — a bare container, some CI
 * images — that fallback has zero metrics, so a paragraph set in a face that has
 * not arrived yet genuinely measures 0px tall. Any assertion about box size,
 * touch-target height or visibility then becomes a race that passes or fails
 * depending on machine timing, and a suite that only fails on one machine is
 * worse than no suite.
 *
 * The list of faces is read out of the loaded stylesheets rather than
 * duplicated here, so it cannot drift from src/index.css, and each one is loaded
 * through `document.fonts.load`, which requests the faces the document itself
 * declared. (Constructing a `FontFace` with a fresh family name — an easy first
 * instinct — loads the bytes but leaves the page's own text in the fallback.)
 */
export async function waitForFonts(page: Page) {
  await page.evaluate(async () => {
    const specs = new Set<string>()

    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList | null = null
      try {
        rules = sheet.cssRules
      } catch {
        // Cross-origin sheet: nothing we can read, and nothing we ship.
        continue
      }

      for (const rule of Array.from(rules ?? [])) {
        if (!(rule instanceof CSSFontFaceRule)) continue
        const { style } = rule
        const family = style.getPropertyValue('font-family').replace(/^['"]|['"]$/g, '').trim()
        if (!family) continue
        const weight = style.getPropertyValue('font-weight').trim() || '400'
        const fontStyle = style.getPropertyValue('font-style').trim() || 'normal'
        specs.add(`${fontStyle} ${weight} 16px "${family}"`)
      }
    }

    await Promise.all(Array.from(specs).map((spec) => document.fonts.load(spec).catch(() => null)))
    await document.fonts.ready
  })
}
