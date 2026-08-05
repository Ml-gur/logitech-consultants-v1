import { chromium } from '@playwright/test'

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 390, height: 1200 }, deviceScaleFactor: 1 })
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {})
await page.waitForTimeout(2000)
// scroll so first card fully visible at top
await page.evaluate(() => {
  const t = [...document.querySelectorAll('div')].find((d) => d.textContent?.includes('Workflow Automations'))
  t && t.closest('section')?.scrollIntoView({ block: 'start' })
})
await page.waitForTimeout(2500)
await page.screenshot({ path: '/tmp/fullcard1.png' })
await browser.close()
