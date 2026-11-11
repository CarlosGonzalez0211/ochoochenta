# Sports-event research for Ocho 80

File-based pipeline — no database. Everything is reviewed in git.

```
research/
  sources.md            where we look, and how much we trust each source
  inbox/                raw findings: one JSON array per sweep, e.g. 2026-11-17.json
  notes/                optional human notes per sweep (what was skipped and why)
src/data/events/
  events.json           the curated list the website renders
  promos-by-sport.json  reusable specials (approved:false until the owner signs off)
  schema.js             the event shape (single source of truth)
scripts/
  validate-events.js    npm run validate:events  (also part of npm run lint)
  build-events.js       npm run build:events     (inbox -> events.json)
```

## Weekly flow
1. **Research** — find upcoming matches/fights worth showing (see `sources.md`). Write them to `research/inbox/<date>.json` using the event shape below. Leave `verified` out; it's forced to `false`.
2. **Merge** — `npm run build:events` (use `-- --dry` first). Adds new events, flags changed kickoff/channel for re-verification, prunes past events.
3. **Verify** — for each event you'll promote, confirm kickoff and channel on an official source, put the URL in `source`, and set `verified: true`. Only verified events appear on the live site.
4. **Promo** — set `promoId` and, once the owner has approved the special, flip `approved: true` in `promos-by-sport.json`.
5. **Check** — `npm run validate:events`, then commit.

## Event shape
```json
{
  "id": "2026-11-21-liga-mx-juarez-vs-xxx",
  "sport": "soccer",              // soccer | football | boxing | mma | baseball | basketball | other
  "league": "Liga MX",
  "title": { "es": "FC Juárez vs. XXX", "en": "FC Juárez vs. XXX" },
  "kickoff": "2026-11-21T19:00:00-07:00",   // ISO-8601 WITH UTC offset; shown in America/Ciudad_Juarez
  "channel": "TUDN",              // optional
  "featured": false,
  "promoId": "soccer",            // optional, key in promos-by-sport.json
  "source": "https://…",          // required when verified
  "verified": false,
  "notes": ""
}
```
Use stable ids (`date-league-teams`) so re-running a sweep updates instead of duplicating.
