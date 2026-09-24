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
 * The face list is not hard-coded here on purpose: a face added to the design
 * system is waited on the moment it is declared, with no second edit.
 *
 * Three waits beyond that, all learned the hard way:
 *
 * 1. **Walk nested rules.** The site's faces are declared inside `@layer base`
 *    (`src/index.css`), so they are children of a `CSSLayerBlockRule`, not of
 *    the stylesheet. A top-level scan finds zero faces — which is what this did
 *    until it was fixed, silently turning the whole wrapper into a no-op. The
 *    walk therefore descends through grouping rules (`@layer`, `@media`,
 *    `@supports`, `@container`), which is where a modern build puts everything.
 * 2. **Wait for the rules to exist at all.** `load()` called before the site's
 *    stylesheet has been parsed resolves immediately with nothing pending,
 *    because there is nothing to load yet, and `document.fonts.ready` resolves
 *    just as fast. The first navigation of a session is exactly where that
 *    happens, so the first capture in `e2e/visual.spec.ts` was the one that
 *    could record a fallback while every later capture, on a warm document,
 *    recorded the real face.
 * 3. **Verify, do not assume.** `load()` resolving is not proof that the
 *    document is using the face; only `document.fonts.check()` answers the
 *    question a geometry assertion (or a golden) actually depends on. A bounded
 *    retry gives a slow first paint its chance to finish, and if a face never
 *    becomes available this throws rather than silently recording the fallback —
 *    a golden captured in the wrong face is worse than a red build, because it
 *    pins the wrong pixels for everyone who regenerates from it.
 */
export async function waitForFonts(page: Page) {
  const unresolved = await page.evaluate(async () => {
    const deadline = Date.now() + 3000

    /** The site's own @font-face rules, once the stylesheets are applied. */
    const declared = () => {
      const specs = new Set<string>()

      const visit = (rules: CSSRuleList | null | undefined) => {
        for (const rule of Array.from(rules ?? [])) {
          if (rule instanceof CSSFontFaceRule) {
            const { style } = rule
            const family = style.getPropertyValue('font-family').replace(/^['"]|['"]$/g, '').trim()
            if (!family) continue
            const weight = style.getPropertyValue('font-weight').trim() || '400'
            const fontStyle = style.getPropertyValue('font-style').trim() || 'normal'
            specs.add(`${fontStyle} ${weight} 16px "${family}"`)
            continue
          }
          // Grouping rules hold their children: @layer, @media, @supports,
          // @container, @scope. The site's faces are inside @layer base.
          visit((rule as Partial<CSSGroupingRule>).cssRules)
        }
      }

      for (const sheet of Array.from(document.styleSheets)) {
        try {
          visit(sheet.cssRules)
        } catch {
          // Cross-origin sheet: nothing we can read, and nothing we ship.
        }
      }

      return [...specs]
    }

    let specs: string[] = []
    while (specs.length === 0 && Date.now() < deadline) {
      specs = declared()
      if (specs.length === 0) await new Promise((r) => setTimeout(r, 25))
    }

    const loadAll = async () => {
      await Promise.all(specs.map((spec) => document.fonts.load(spec).catch(() => null)))
      await document.fonts.ready
    }

    await loadAll()

    while (Date.now() < deadline) {
      if (specs.every((spec) => document.fonts.check(spec))) return []
      await loadAll()
      await new Promise((r) => setTimeout(r, 50))
    }

    return specs.filter((spec) => !document.fonts.check(spec))
  })

  if (unresolved.length > 0) {
    throw new Error(
      `The site's webfonts never became available: ${unresolved.join(', ')}. ` +
        'A geometry assertion or a screenshot taken in the fallback face is not ' +
        'measuring the site. See e2e/fonts.ts.',
    )
  }
}
