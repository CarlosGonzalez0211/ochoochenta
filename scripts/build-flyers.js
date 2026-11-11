// Renders Ocho 80 flyers (PNG) from src/data/events/events.json into flyers/out/.
//
//   npm run build:flyers                  verified upcoming events
//   npm run build:flyers -- --all         include unverified events (PREVIEW ONLY — don't post these)
//   npm run build:flyers -- --id <id>     one event only
//   npm run build:flyers -- --days 7      roundup window (default 7)
//   npm run build:flyers -- --now <ISO>   pretend it's another moment (testing)
//
// Output — ready to post as a carousel, in this order:
//   flyers/out/esta-semana-<date>/00-esta-semana-{feed,story}.png   the roundup (cover slide)
//   flyers/out/esta-semana-<date>/NN-<event-id>-{feed,story}.png    one VS flyer per event in the roundup
//   flyers/out/proximos/<event-id>-{feed,story}.png                 events after this week
//
// Assets: run `npm run fetch:assets` (logos, flags, photos) and `python3 scripts/cutout.py` (fighter cutouts) first.
// Needs Playwright + Chromium (preinstalled in the cloud sandbox; locally: npm i -D playwright && npx playwright install chromium).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { eventFlyer, roundupFlyer, fmtDate, SIZES } from './flyers/templates.js'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const val = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined }

const now = val('now') ? Date.parse(val('now')) : Date.now()
const days = Number(val('days') ?? 7)
const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))
const promos = read('../src/data/events/promos-by-sport.json')
const participants = read('../src/data/events/participants.json')
const outDir = fileURLToPath(new URL('../flyers/out/', import.meta.url))
const promoFor = (e) => { const p = e.promoId && promos[e.promoId]; return p?.approved ? p.text.es : null }
const resolve = (slug) => (participants[slug] ? { slug, ...participants[slug] } : null)

let events = read('../src/data/events/events.json')
  .filter((e) => (flag('all') || e.verified) && Date.parse(e.kickoff) > now)
  .sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff))
  .map((e) => ({ ...e, sides: e.matchup?.map(resolve) }))
if (val('id')) events = events.filter((e) => e.id === val('id'))

if (!events.length) {
  console.log('No flyers to build: no upcoming verified events. (Use --all to preview unverified ones.)')
  process.exit(0)
}
for (const e of events) for (const s of e.matchup ?? []) if (!participants[s]) console.warn(`! ${e.id}: unknown participant "${s}"`)

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
const tmp = `${outDir}.render.html`

async function render(html, size, file) {
  const { w, h } = SIZES[size]
  writeFileSync(tmp, html)
  await page.setViewportSize({ width: w, height: h })
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  mkdirSync(`${outDir}${file.split('/').slice(0, -1).join('/')}`, { recursive: true })
  await page.screenshot({ path: `${outDir}${file}`, clip: { x: 0, y: 0, width: w, height: h } })
  console.log(`✓ flyers/out/${file}`)
}

const end = now + days * 24 * 3600 * 1000
const week = val('id') ? [] : events.filter((e) => Date.parse(e.kickoff) <= end)
const later = events.filter((e) => !week.includes(e))

if (week.length) {
  const folder = `esta-semana-${new Date(now).toISOString().slice(0, 10)}`
  const rangeLabel = `${fmtDate(new Date(now).toISOString())} – ${fmtDate(new Date(end).toISOString())}`
  for (const size of ['feed', 'story']) await render(roundupFlyer(week, { rangeLabel, promoFor }, size), size, `${folder}/00-esta-semana-${size}.png`)
  for (const [i, e] of week.entries()) {
    const n = String(i + 1).padStart(2, '0')
    for (const size of ['feed', 'story']) await render(eventFlyer(e, promoFor(e), size), size, `${folder}/${n}-${e.id}-${size}.png`)
  }
}
for (const e of later) for (const size of ['feed', 'story']) await render(eventFlyer(e, promoFor(e), size), size, `proximos/${e.id}-${size}.png`)

rmSync(tmp, { force: true })
await browser.close()
