/**
 * Generate brand assets with headless Chromium.
 *
 * Renders with the site's real self-hosted fonts and the real design tokens, so
 * the favicon set, the web manifest icons and the Open Graph card stay visually
 * identical to the product instead of drifting from a hand-exported PNG.
 *
 * Usage:
 *   node scripts/generate-brand-assets.mjs
 *
 * Outputs (all into public/):
 *   favicon-16/32/48.png      browser tab + bookmarks
 *   favicon-180.png           apple-touch-icon (opaque, iOS rounds it itself)
 *   favicon-192/512.png       PWA / Android (manifest icons)
 *   og-image.png              1200x630 social card
 *
 * Run this after any change to the mark or the brand palette.
 */
import { chromium } from '@playwright/test'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Downscale a 2x render to exactly 1200x630 and strip metadata, if ImageMagick
 * is available. Rendering at 2x and downscaling keeps the type crisp while
 * producing a file small enough for social scrapers (many cap at ~1MB, and
 * several re-encode anything not 1200x630).
 */
function optimiseOg(file) {
  try {
    execFileSync('magick', [file, '-resize', '1200x630!', '-strip', '-quality', '90', file], {
      stdio: 'ignore',
    })
    return true
  } catch {
    return false
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const fontsDir = path.join(publicDir, 'fonts')

const CHROME =
  process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser'

/** Every size either index.html, the web manifest or the .ico container uses. */
const ICON_SIZES = [16, 32, 48, 180, 192, 512]

/**
 * Inlines the same self-hosted faces the site uses (src/index.css), so the
 * rendered card cannot drift from the product's typography. Missing files are
 * skipped rather than fatal: the fallback stack in the markup still renders.
 */
async function fontCss() {
  /** [css family name, file, weight, style] — mirrors the faces in src/index.css. */
  const faces = [
    ['Inter', 'inter-400.woff2', 400, 'normal'],
    ['Inter', 'inter-500.woff2', 500, 'normal'],
    ['JB', 'jetbrains-mono-400.woff2', 400, 'normal'],
  ]

  const css = []
  for (const [family, file, weight, style] of faces) {
    const abs = path.join(fontsDir, file)
    if (!existsSync(abs)) continue
    const b64 = (await readFile(abs)).toString('base64')
    css.push(
      `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};` +
        `src:url(data:font/woff2;base64,${b64}) format('woff2');}`
    )
  }
  return css.join('\n')
}

async function main() {
  await mkdir(publicDir, { recursive: true })
  const mark = await readFile(path.join(publicDir, 'favicon.svg'), 'utf8')
  const markDataUri = `data:image/svg+xml;base64,${Buffer.from(mark).toString('base64')}`
  const faces = await fontCss()

  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--font-render-hinting=none'],
  })

  try {
    // ---- Icons ----------------------------------------------------------
    for (const size of ICON_SIZES) {
      const page = await browser.newPage({
        viewport: { width: size, height: size },
        deviceScaleFactor: 1,
      })
      // apple-touch icons must be opaque — iOS applies its own mask.
      const opaque = size === 180
      await page.setContent(
        `<!doctype html><html><head><style>
          html,body{margin:0;padding:0;background:transparent;}
          img{display:block;width:${size}px;height:${size}px;}
          ${opaque ? `html,body{background:#f3ffc9;}` : ''}
        </style></head><body><img src="${markDataUri}" alt=""></body></html>`,
        { waitUntil: 'load' }
      )
      await page.screenshot({
        path: path.join(publicDir, `favicon-${size}.png`),
        omitBackground: !opaque,
      })
      await page.close()
      console.log(`  ✓ favicon-${size}.png`)
    }

    // ---- favicon.ico ---------------------------------------------------
    // Browsers, feed readers and link-preview bots still request /favicon.ico
    // by convention, so serving a 404 there looks broken. An ICO is just a
    // container: a 6-byte header, a 16-byte directory entry per image, then the
    // payloads. Modern browsers accept PNG payloads, so the PNGs generated
    // above are embedded directly — no separate encoder needed.
    const icoSizes = [16, 32, 48]
    const images = await Promise.all(
      icoSizes.map((s) => readFile(path.join(publicDir, `favicon-${s}.png`))),
    )
    const header = Buffer.alloc(6)
    header.writeUInt16LE(0, 0) // reserved
    header.writeUInt16LE(1, 2) // type: icon
    header.writeUInt16LE(images.length, 4)
    const directory = Buffer.alloc(16 * images.length)
    let offset = header.length + directory.length
    images.forEach((png, i) => {
      const entry = 16 * i
      directory.writeUInt8(icoSizes[i] >= 256 ? 0 : icoSizes[i], entry + 0) // width
      directory.writeUInt8(icoSizes[i] >= 256 ? 0 : icoSizes[i], entry + 1) // height
      directory.writeUInt8(0, entry + 2) // palette size (0 = truecolour)
      directory.writeUInt8(0, entry + 3) // reserved
      directory.writeUInt16LE(1, entry + 4) // colour planes
      directory.writeUInt16LE(32, entry + 6) // bits per pixel
      directory.writeUInt32LE(png.length, entry + 8) // payload size
      directory.writeUInt32LE(offset, entry + 12) // payload offset
      offset += png.length
    })
    await writeFile(
      path.join(publicDir, 'favicon.ico'),
      Buffer.concat([header, directory, ...images]),
    )
    console.log(`  ✓ favicon.ico (${icoSizes.join('/')})`)

    // ---- Open Graph card (1200x630) ------------------------------------
    const og = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 2, // render at 2x then let the encoder downscale-ish crisp text
    })
    await og.setContent(
      `<!doctype html><html><head><meta charset="utf-8">
      <style>
        ${faces}
        *{box-sizing:border-box;}
        html,body{margin:0;width:1200px;height:630px;background:#0e100f;
          font-family:'Inter',system-ui,sans-serif;color:#f2f4e9;overflow:hidden;}
        /* No glows and no gradient wash. A hairline grid is the only texture,
           which is the same structural device the site uses. */
        .grid{position:absolute;inset:0;opacity:.5;
          background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),
                           linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);
          background-size:80px 80px;
          mask-image:radial-gradient(80% 80% at 25% 35%, #000 0%, transparent 100%);}
        .frame{position:relative;width:100%;height:100%;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between;}
        .top{display:flex;align-items:center;gap:16px;}
        .mark{width:56px;height:56px;border-radius:12px;display:block;}
        .word{font-family:'Inter',system-ui,sans-serif;font-size:34px;font-weight:500;letter-spacing:-.01em;}
        .word .accent{color:#f3ffc9;}
        .eyebrow{font-size:17px;font-weight:500;color:#9aa189;}
        h1{margin:0 0 24px;font-family:'Inter',system-ui,sans-serif;font-size:84px;line-height:1.02;font-weight:400;letter-spacing:-.03em;}
        .sub{margin:0;max-width:820px;font-size:23px;line-height:1.5;color:#c2c8b4;}
        .bottom{display:flex;align-items:center;justify-content:space-between;gap:24px;border-top:1px solid rgba(255,255,255,.14);padding-top:26px;}
        .caps{display:flex;gap:10px;}
        .cap{border:1px solid rgba(243,255,201,.38);color:#f3ffc9;border-radius:999px;
          padding:8px 18px;font-size:16px;font-weight:500;letter-spacing:.01em;}
        .url{font-family:'JB',ui-monospace,monospace;font-size:17px;color:#9aa189;}
      </style></head><body>
        <div class="grid"></div>
        <div class="frame">
          <div class="top">
            <img class="mark" src="${markDataUri}" alt="">
            <div class="word">Naivo<span class="accent">labs</span></div>
          </div>
          <div>
            <p class="eyebrow" style="margin:0 0 26px">An applied AI systems company</p>
            <h1>Intelligence that<br>finishes the work.</h1>
            <p class="sub">Governed AI systems that answer, retrieve and act inside the systems you already run. In production, measured against targets agreed before launch.</p>
          </div>
          <div class="bottom">
            <div class="caps">
              <span class="cap">Converse</span>
              <span class="cap">Understand</span>
              <span class="cap">Act</span>
              <span class="cap">Orchestrate</span>
            </div>
            <div class="url">naivolabs.com</div>
          </div>
        </div>
      </body></html>`,
      { waitUntil: 'load' }
    )
    await og.evaluate(() => document.fonts.ready)
    const ogPath = path.join(publicDir, 'og-image.png')
    await og.screenshot({ path: ogPath })
    await og.close()
    const optimised = optimiseOg(ogPath)
    console.log(
      `  ✓ og-image.png (1200x630${optimised ? ', optimised' : ' from a 2x render — install ImageMagick to downscale'})`
    )

    // ---- Note for whoever opens this directory next --------------------
    await writeFile(
      path.join(publicDir, 'BRAND-ASSETS.md'),
      [
        '# Brand assets',
        '',
        'These files are generated — do not edit them by hand.',
        '',
        '```bash',
        'node scripts/generate-brand-assets.mjs',
        '```',
        '',
        'That script renders them with headless Chromium using the same',
        'self-hosted fonts and the same palette as the site, so they never drift',
        'from the product. Re-run it after changing `public/favicon.svg` or the',
        'colour tokens in `src/index.css`. It needs a Chromium binary (see the',
        'E2E section of README.md), and ImageMagick to downscale the OG card.',
        '',
        '| File | Used for |',
        '|---|---|',
        '| `favicon.svg` | modern browsers (hand-authored source) |',
        '| `favicon.ico` | legacy browsers, feed readers, link-preview bots |',
        '| `favicon-16/32/48.png` | browser tabs, bookmarks, and the .ico payloads |',
        '| `favicon-180.png` | `apple-touch-icon` (opaque) |',
        '| `favicon-192/512.png` | web manifest / Android install |',
        '| `og-image.png` | Open Graph + Twitter card (1200x630) |',
        '',
      ].join('\n')
    )
  } finally {
    await browser.close()
  }

  console.log('\nBrand assets written to public/')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
