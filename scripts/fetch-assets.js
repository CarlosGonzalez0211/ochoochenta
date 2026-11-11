// Downloads logos (teams), flags (countries/fighters) and photos (fighters) into flyers/assets/cache/.
//   npm run fetch:assets            fetch anything missing
//   npm run fetch:assets -- --force re-download everything
// Sources: flagcdn.com for flags; the infobox image of the English Wikipedia article in participants.json for
// logos/photos (page HTML, not the API, which rate-limits shared IPs). Credits are written to cache/credits.json.
// Your own files in flyers/assets/custom/<slug>.(svg|png|jpg|webp) always take priority and are never overwritten.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const force = process.argv.includes('--force')
const UA = 'Ocho80FlyerBot/1.0 (https://github.com/carlosgonzalez0211/ochoochenta)'
const dir = (p) => fileURLToPath(new URL(`../flyers/assets/${p}`, import.meta.url))
const cache = dir('cache/')
mkdirSync(cache, { recursive: true })
const participants = JSON.parse(readFileSync(new URL('../src/data/events/participants.json', import.meta.url), 'utf8'))
const creditsPath = `${cache}credits.json`
const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, 'utf8')) : {}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const have = (folder, base) => readdirSync(folder).some((f) => f.startsWith(`${base}.`))

async function get(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (res.ok) return res
    if (res.status === 429 || res.status >= 500) { await sleep(2000 * 2 ** i); continue }
    throw new Error(`${res.status} ${url}`)
  }
  throw new Error(`gave up on ${url}`)
}

async function save(url, base) {
  const res = await get(url)
  const type = res.headers.get('content-type') || ''
  const ext = type.includes('svg') ? 'svg' : type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg'
  writeFileSync(`${cache}${base}.${ext}`, Buffer.from(await res.arrayBuffer()))
  return ext
}

/** Main infobox image of the article -> { url, filePage }. SVGs come back as the original (scales cleanly); photos as a 900px thumb. */
async function infoboxImage(article) {
  const html = await (await get(`https://en.wikipedia.org/wiki/${encodeURIComponent(article)}`)).text()
  const start = html.indexOf('class="infobox')
  if (start < 0) return null
  const box = html.slice(start, start + 60000)
  const cell = box.indexOf('class="infobox-image"')
  if (cell < 0) return null
  const img = box.slice(cell).match(/<img[^>]*resource="[^"]*\/wiki\/(File:[^"]+)"[^>]*src="\/\/(?:thumb|upload)\.wikimedia\.org\/wikipedia\/(\w+)\/thumb\/(\w)\/(\w\w)\/([^/]+)\/\d+px-[^"?]+/)
  if (!img) return null
  const [, filePage, proj, a, ab, name] = img
  const original = `https://upload.wikimedia.org/wikipedia/${proj}/${a}/${ab}/${name}`
  if (/\.svg$/i.test(name)) return { url: original, filePage }
  const thumbExt = /\.(tiff?|webp)$/i.test(name) ? '.jpg' : ''
  return { url: `https://upload.wikimedia.org/wikipedia/${proj}/thumb/${a}/${ab}/${name}/900px-${name}${thumbExt}`, fallback: original, filePage }
}

let ok = 0, skipped = 0, failed = 0
for (const [slug, p] of Object.entries(participants)) {
  if (slug.startsWith('_')) continue
  try {
    if (p.flag && (force || !have(cache, `flag-${p.flag}`))) {
      await save(`https://flagcdn.com/${p.flag}.svg`, `flag-${p.flag}`)
      credits[`flag-${p.flag}`] = { source: 'https://flagcdn.com', license: 'Public domain (national flag)' }
      ok++
    }
    if (p.kind === 'country' || !p.wiki) continue
    if (have(dir('custom/'), slug)) { skipped++; continue }
    if (!force && have(cache, slug)) { skipped++; continue }
    await sleep(1200)
    const found = await infoboxImage(p.wiki)
    if (!found) { console.warn(`! ${slug}: no infobox image on ${p.wiki}`); failed++; continue }
    try { await save(found.url, slug) } catch (err) { if (!found.fallback) throw err; await save(found.fallback, slug) }
    credits[slug] = { source: `https://en.wikipedia.org/wiki/${found.filePage}`, article: `https://en.wikipedia.org/wiki/${p.wiki}`,
      note: p.kind === 'team' ? 'Trademarked logo — check usage rights before commercial posts' : 'Check the file page for license/attribution' }
    console.log(`✓ ${slug} <- ${found.filePage}`)
    ok++
  } catch (err) {
    console.error(`✗ ${slug}: ${err.message}`)
    failed++
  }
}
writeFileSync(creditsPath, JSON.stringify(credits, null, 2) + '\n')
console.log(`downloaded ${ok}, kept ${skipped}, failed ${failed}`)
