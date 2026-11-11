// Validates src/data/events/*.json. No dependencies. Exit 1 on errors, warnings are informational.
import { readFileSync } from 'node:fs'
import { validateEvent } from '../src/data/events/schema.js'

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))
const events = read('../src/data/events/events.json')
const promos = read('../src/data/events/promos-by-sport.json')
const promoIds = Object.keys(promos).filter((k) => !k.startsWith('_'))

let errors = 0
let warnings = 0
const seen = new Set()
const now = Date.now()

if (!Array.isArray(events)) {
  console.error('events.json must be an array')
  process.exit(1)
}

for (const e of events) {
  const label = e?.id ?? '(no id)'
  for (const msg of validateEvent(e, { promoIds })) { console.error(`✗ ${label}: ${msg}`); errors++ }
  if (seen.has(e.id)) { console.error(`✗ ${label}: duplicate id`); errors++ }
  seen.add(e.id)
  if (Date.parse(e.kickoff) < now - 24 * 3600 * 1000) { console.warn(`! ${label}: kickoff is in the past — run npm run build:events to prune`); warnings++ }
  if (!e.verified) { console.warn(`! ${label}: unverified (hidden on the live site)`); warnings++ }
}

for (const id of promoIds) {
  const p = promos[id]
  if (typeof p.approved !== 'boolean' || !p.text?.es || !p.text?.en) { console.error(`✗ promo "${id}": needs approved (boolean) and text.es/text.en`); errors++ }
}

console.log(`${events.length} events, ${promoIds.length} promos — ${errors} error(s), ${warnings} warning(s)`)
process.exit(errors ? 1 : 0)
