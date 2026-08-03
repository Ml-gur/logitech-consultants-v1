// Downloads fonts, images, favicon, and OG assets from the AIthor Framer site
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const FONTS_DIR = join(ROOT, 'public', 'fonts')
const IMAGES_DIR = join(ROOT, 'public', 'images')
mkdirSync(FONTS_DIR, { recursive: true })
mkdirSync(IMAGES_DIR, { recursive: true })

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) {
    console.error('FAIL', res.status, url)
    return false
  }
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(dest, buf)
  console.log('OK', (buf.length / 1024).toFixed(1) + 'KB', url.split('/').pop())
  return true
}

// Fonts (42 woff2 files from the site's @font-face rules)
const fonts = readFileSync('/tmp/aithor/all_fonts.txt', 'utf8')
  .split('\n')
  .filter(Boolean)
for (const url of fonts) {
  const name = url.split('/').pop()
  await download(url, join(FONTS_DIR, name))
}

// Images (24 site images)
const images = readFileSync('/tmp/aithor/all_images.txt', 'utf8')
  .split('\n')
  .filter(Boolean)
for (const url of images) {
  const name = url.split('/').pop()
  await download(url, join(IMAGES_DIR, name))
}

// Favicon
await download(
  'https://framerusercontent.com/images/GpQsINbeiGMnOJknc31u8Y6oU.svg',
  join(ROOT, 'public', 'favicon.svg')
)

console.log('ALL DONE')
