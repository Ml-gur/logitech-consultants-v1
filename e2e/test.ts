import { test as base, expect } from '@playwright/test'
import { waitForFonts } from './fonts'

/**
 * The suite's `test`, with one addition: every navigation waits for the site's
 * webfonts before the test body continues.
 *
 * Doing it here rather than in each spec means no test can forget, and a
 * geometry assertion can never be measured against a fallback face that has not
 * been replaced yet (see e2e/fonts.ts for why that is a real failure mode and
 * not a theoretical one). Import `test` and `expect` from this module in specs.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page)
    page.goto = async (url, options) => {
      const response = await goto(url, options)
      await waitForFonts(page)
      return response
    }
    await use(page)
  },
})

export { expect }
