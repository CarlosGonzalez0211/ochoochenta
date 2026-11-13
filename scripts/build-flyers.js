// Renders Ocho 80 flyers (PNG) from src/data/events/events.json into flyers/out/.
//
//   npm run build:flyers                  verified upcoming events
//   npm run build:flyers -- --all         include unverified events (PREVIEW ONLY — don't post these)
//   npm run build:flyers -- --id <id>     one event only
//   npm run build:flyers -- --days 7      roundup window (default 7)
//   npm run build:flyers -- --now <ISO>   pretend it's another moment (testing)
//   npm run build:flyers -- --format jpg  png (default) | jpg (Instagram-ready, quality 95) | both
//
// Output — ready to post as a carousel, in this order:
//   flyers/out/esta-semana-<date>/00-esta-semana.png   the roundup (cover slide)
//   flyers/out/esta-semana-<date>/NN-<event-id>.png    one VS flyer per event in the roundup
//   flyers/out/proximos/<event-id>.png                 events after this week
// Every flyer is Instagram feed size, 1080×1350 (4:5), so a carousel stays uniform.
//
// Assets: run `npm run fetch:assets` (logos, flags, photos) and `python3 scripts/cutout.py` (fighter cutouts) first.
// Needs Playwright + Chromium (preinstalled in the cloud sandbox; locally: npm i -D playwright && npx playwright install chromium).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { eventFlyer, roundupFlyer, fmtDate, fmtShortDay, fmtTime, SIZES } from './flyers/templates.js'
import { VENUE_TZ } from '../src/data/events/schema.js'
import { planPosts } from './flyers/priority.js'

const args = process.argv.slice(2)
const flag = (n) => args.includes(`--${n}`)
const val = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined }

const SIZE = 'feed' // Instagram 4:5
const FORMAT = ['png', 'jpg', 'both'].includes(val('format')) ? val('format') : 'png'
const now = val('now') ? Date.parse(val('now')) : Date.now()
const days = Number(val('days') ?? 7)
const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))
const promos = read('../src/data/events/promos-by-sport.json')
const participants = read('../src/data/events/participants.json')
const priorities = read('../src/data/events/priorities.json')
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
  for (const ext of FORMAT === 'both' ? ['png', 'jpg'] : [FORMAT]) {
    const out = file.replace(/\.png$/, `.${ext}`)
    await page.screenshot({ path: `${outDir}${out}`, clip: { x: 0, y: 0, width: w, height: h }, type: ext === 'jpg' ? 'jpeg' : 'png', ...(ext === 'jpg' ? { quality: 95 } : {}) })
    console.log(`✓ flyers/out/${out}`)
  }
}

// window runs to the END of the last day, Juárez time (so a Sunday-night game isn't cut off)
const endOfDayInJuarez = (ms) => {
  const f = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: VENUE_TZ, year: 'numeric', month: '2-digit', day: '2-digit', timeZoneName: 'longOffset' }).formatToParts(new Date(ms)).map((x) => [x.type, x.value]))
  const off = f.timeZoneName.replace('GMT', '') || '+00:00'
  return Date.parse(`${f.year}-${f.month}-${f.day}T23:59:59${off}`)
}
const end = endOfDayInJuarez(now + days * 24 * 3600 * 1000)

// Which flyers to post: when events overlap in time, only the highest-priority one is posted (see priorities.json).
const plan = val('id') ? { posted: events, skipped: [], scores: new Map() } : planPosts(events, priorities)
const inWeek = (e) => Date.parse(e.kickoff) <= end
const week = val('id') ? [] : plan.posted.filter(inWeek)
const later = plan.posted.filter((e) => !inWeek(e))
const alternates = plan.skipped.map((s) => s.event)

const hhmm = (e) => `${fmtShortDay(e.kickoff)} ${fmtTime(e.kickoff)}`
const name = (e) => (e.sides?.[0] && e.sides?.[1] ? `${e.sides[0].name.es} vs. ${e.sides[1].name.es}` : e.title.es)
function writePlan() {
  const lines = ['# Plan de publicación', '', `Generado ${new Date(now).toISOString().slice(0, 10)} · hora de Ciudad Juárez. Si dos eventos se empalman, solo se publica el de mayor prioridad (config: \`src/data/events/priorities.json\`).`, '']
  lines.push('## Publicar', '')
  for (const e of plan.posted) { const s = plan.scores.get(e.id); lines.push(`- **${name(e)}** · ${hhmm(e)} · ${e.league} · puntos ${s?.score ?? '-'} (${s?.why.join(', ') ?? ''})`) }
  lines.push('', '## Récords en los flyers', '')
  for (const e of plan.posted.concat(plan.skipped.map((s) => s.event))) {
    const s = e.stats
    const shown = s?.enteringGame ? `sí · ${s.sides.map((x) => [x.record, x.rank].filter(Boolean).join(' ')).join(' vs. ')} (al ${s.asOf})` : 'no (aún no hay récord confirmado de cómo llegan a este partido)'
    lines.push(`- ${name(e)}: ${shown}${s?.notes ? ` — ${s.notes}` : ''}`)
  }
  lines.push('', '## No publicar (se empalma con uno de mayor prioridad)', '')
  if (!plan.skipped.length) lines.push('- Ninguno: no hay eventos empalmados.')
  for (const { event: e, conflictsWith: c } of plan.skipped) { const s = plan.scores.get(e.id); lines.push(`- ${name(e)} · ${hhmm(e)} · puntos ${s.score} (${s.why.join(', ')}) → se empalma con **${name(c)}** (${hhmm(c)}, puntos ${plan.scores.get(c.id).score}). Su flyer está en \`alternativas/\` por si prefieres publicarlo en lugar del otro.`) }
  return lines.join('\n') + '\n'
}
if (!val('id')) {
  mkdirSync(outDir, { recursive: true })
  writeFileSync(`${outDir}plan-de-publicacion.md`, writePlan())
  console.log(`✓ flyers/out/plan-de-publicacion.md (${plan.posted.length} a publicar, ${plan.skipped.length} empalmados)`)
}

const stamp = new Date(now).toISOString().slice(0, 10)
const folder = `esta-semana-${stamp}`
if (week.length) {
  const rangeLabel = `${fmtDate(new Date(now).toISOString())} – ${fmtDate(new Date(end).toISOString())}`
  // 6 games per cover; a busy week gets 00a, 00b… so every posted game is listed
  const pages = []
  const perPage = Math.ceil(week.length / Math.ceil(week.length / 6)) // balanced: 10 games -> 5 + 5, not 6 + 4
  for (let i = 0; i < week.length; i += perPage) pages.push(week.slice(i, i + perPage))
  for (const [i, chunk] of pages.entries()) {
    const suffix = pages.length > 1 ? String.fromCharCode(97 + i) : ''
    const pageLabel = pages.length > 1 ? `${i + 1}/${pages.length}` : ''
    await render(roundupFlyer(chunk, { rangeLabel, promoFor, pageLabel, last: i === pages.length - 1 }, SIZE), SIZE, `${folder}/00${suffix}-esta-semana.png`)
  }
  for (const [i, e] of week.entries()) {
    const n = String(i + 1).padStart(2, '0')
    await render(eventFlyer(e, promoFor(e), SIZE), SIZE, `${folder}/${n}-${e.id}.png`)
  }
}
for (const e of later) await render(eventFlyer(e, promoFor(e), SIZE), SIZE, `proximos/${e.id}.png`)
// flyers for events that lost a time slot: kept, but out of the carousel
for (const e of alternates) await render(eventFlyer(e, promoFor(e), SIZE), SIZE, `alternativas/${e.id}.png`)

rmSync(tmp, { force: true })
await browser.close()
