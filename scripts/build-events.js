// Merges research findings (research/inbox/*.json, arrays of events) into src/data/events/events.json.
//   node scripts/build-events.js          write changes
//   node scripts/build-events.js --dry    show what would change
// Rules: new ids are added as verified:false; existing ids keep curated fields (featured, promoId, verified)
// unless kickoff/channel changed, in which case they are updated and verified is reset to false for re-checking.
// Events more than 24h past are dropped.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { validateEvent } from '../src/data/events/schema.js'

const dry = process.argv.includes('--dry')
const eventsUrl = new URL('../src/data/events/events.json', import.meta.url)
const promosUrl = new URL('../src/data/events/promos-by-sport.json', import.meta.url)
const inboxUrl = new URL('../research/inbox/', import.meta.url)

const events = JSON.parse(readFileSync(eventsUrl, 'utf8'))
const promoIds = Object.keys(JSON.parse(readFileSync(promosUrl, 'utf8'))).filter((k) => !k.startsWith('_'))
const byId = new Map(events.map((e) => [e.id, e]))
const cutoff = Date.now() - 24 * 3600 * 1000
let added = 0, updated = 0, rejected = 0

for (const file of readdirSync(inboxUrl).filter((f) => f.endsWith('.json'))) {
  let batch
  try { batch = JSON.parse(readFileSync(new URL(file, inboxUrl), 'utf8')) } catch (err) { console.error(`✗ ${file}: invalid JSON (${err.message})`); rejected++; continue }
  for (const raw of batch) {
    const incoming = { featured: false, promoId: '', source: '', notes: '', ...raw, verified: false }
    const problems = validateEvent(incoming, { promoIds })
    if (problems.length) { console.error(`✗ ${file} / ${raw.id ?? '(no id)'}: ${problems.join('; ')}`); rejected++; continue }
    const current = byId.get(incoming.id)
    if (!current) { byId.set(incoming.id, incoming); added++; continue }
    if (current.kickoff !== incoming.kickoff || current.channel !== incoming.channel) {
      byId.set(incoming.id, { ...current, kickoff: incoming.kickoff, channel: incoming.channel ?? current.channel, source: incoming.source || current.source, verified: false })
      updated++
    }
  }
}

const next = [...byId.values()]
  .filter((e) => Date.parse(e.kickoff) >= cutoff)
  .sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff))
const pruned = byId.size - next.length

console.log(`added ${added}, updated ${updated}, pruned ${pruned}, rejected ${rejected}${dry ? ' (dry run — nothing written)' : ''}`)
if (!dry) writeFileSync(eventsUrl, JSON.stringify(next, null, 2) + '\n')
