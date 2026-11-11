// Renders Ocho 80 flyers (PNG) from src/data/events/events.json into flyers/out/.
//   npm run build:flyers                  verified, upcoming events + this week's roundup (feed 4:5 and story 9:16)
//   npm run build:flyers -- --all         include unverified events (preview only — don't post these)
//   npm run build:flyers -- --id <id>     one event only
//   npm run build:flyers -- --days 10     roundup window in days (default 7)
//   npm run build:flyers -- --now <ISO>   pretend it's another moment (testing)
// Needs Playwright + Chromium (preinstalled in the cloud sandbox; locally: npm i -D playwright && npx playwright install chromium).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { eventFlyer, roundupFlyer, fmtDay, SIZES } from './flyers/templates.js'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const val = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined }

const now = val('now') ? Date.parse(val('now')) : Date.now()
const days = Number(val('days') ?? 7)
const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))
const promos = read('../src/data/events/promos-by-sport.json')
const outDir = fileURLToPath(new URL('../flyers/out/', import.meta.url))
const promoFor = (e) => { const p = e.promoId && promos[e.promoId]; return p?.approved ? p.text.es : null }

let events = read('../src/data/events/events.json')
  .filter((e) => (flag('all') || e.verified) && Date.parse(e.kickoff) > now)
  .sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff))
if (val('id')) events = events.filter((e) => e.id === val('id'))

if (!events.length) {
  console.log('No flyers to build: no upcoming verified events. (Use --all to preview unverified ones.)')
  process.exit(0)
}

let chromium
// createRequire also honors NODE_PATH, where the sandbox's global Playwright lives
try { ({ chromium } = createRequire(import.meta.url)('playwright')) } catch {
  console.error('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium')
  process.exit(1)
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })

async function render(html, size, name) {
  const { w, h } = SIZES[size]
  const tmp = `${outDir}.tmp.html`
  writeFileSync(tmp, html)
  await page.setViewportSize({ width: w, height: h })
  await page.goto(pathToFileURL(tmp).href)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: `${outDir}${name}.png`, clip: { x: 0, y: 0, width: w, height: h } })
  console.log(`✓ flyers/out/${name}.png`)
}

for (const e of events) {
  for (const size of ['feed', 'story']) await render(eventFlyer(e, promoFor(e), size), size, `${e.id}-${size}`)
}

if (!val('id')) {
  const end = now + days * 24 * 3600 * 1000
  const week = events.filter((x) => Date.parse(x.kickoff) <= end)
  if (week.length) {
    const label = `${fmtDay(new Date(now).toISOString(), { day: 'numeric', month: 'long' })} – ${fmtDay(new Date(end).toISOString(), { day: 'numeric', month: 'long' })}`
    const stamp = new Date(now).toISOString().slice(0, 10)
    for (const size of ['feed', 'story']) await render(roundupFlyer(week, { rangeLabel: label, promoFor }, size), size, `roundup-${stamp}-${size}`)
  }
}

rmSync(`${outDir}.tmp.html`, { force: true })
await browser.close()
