// Decides which flyers to post when events happen at the same time.
// Pure functions: no files, no network. Config lives in src/data/events/priorities.json.

const HOUR = 3600 * 1000

/** Score an event and say why. An explicit event.priority replaces the computed base. */
export function scoreEvent(e, cfg) {
  const why = []
  let score
  if (typeof e.priority === 'number') {
    score = e.priority
    why.push(`prioridad manual ${e.priority}`)
  } else {
    const base = cfg.sportBase[e.sport] ?? cfg.sportBase.other ?? 0
    score = base
    why.push(`${e.sport} ${base}`)
    let best = null
    for (const slug of e.matchup ?? []) {
      const b = cfg.participantBonus?.[slug]
      if (b && (!best || b > best.b)) best = { slug, b }
    }
    if (best) { score += best.b; why.push(`${best.slug} +${best.b}`) }
  }
  if (e.featured) { score += cfg.featuredBonus ?? 0; why.push(`destacado +${cfg.featuredBonus ?? 0}`) }
  return { score, why }
}

const windowOf = (e, cfg) => {
  const start = Date.parse(e.kickoff)
  return [start, start + (cfg.durationHours[e.sport] ?? cfg.durationHours.other ?? 3) * HOUR]
}
const overlaps = (a, b) => a[0] < b[1] && b[0] < a[1]

/**
 * Greedy pick: best score first; an event is posted unless it overlaps one that was already picked.
 * Returns { posted: Event[] (by kickoff), skipped: [{event, conflictsWith: Event}], scores: Map(id -> {score, why}) }.
 */
export function planPosts(events, cfg) {
  const scores = new Map(events.map((e) => [e.id, scoreEvent(e, cfg)]))
  const order = [...events].sort((a, b) =>
    scores.get(b.id).score - scores.get(a.id).score ||
    Number(!!b.featured) - Number(!!a.featured) ||
    Date.parse(a.kickoff) - Date.parse(b.kickoff) ||
    a.id.localeCompare(b.id))
  const posted = []
  const skipped = []
  for (const e of order) {
    const w = windowOf(e, cfg)
    const clash = posted.find((p) => overlaps(w, windowOf(p, cfg)))
    if (clash) skipped.push({ event: e, conflictsWith: clash })
    else posted.push(e)
  }
  const byKickoff = (a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff)
  posted.sort(byKickoff)
  skipped.sort((a, b) => byKickoff(a.event, b.event))
  return { posted, skipped, scores }
}
