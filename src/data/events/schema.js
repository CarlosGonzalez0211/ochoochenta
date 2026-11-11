// Single source of truth for the shape of an event. Used by scripts/validate-events.js and documented in research/README.md.
export const SPORTS = ['soccer', 'football', 'boxing', 'mma', 'baseball', 'basketball', 'other']

// Ciudad Juárez observes US Mountain time; kickoff strings must carry an explicit UTC offset.
export const VENUE_TZ = 'America/Ciudad_Juarez'

const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})$/

/** Returns a list of human-readable problems (empty = valid). */
export function validateEvent(e, { promoIds = [], participantIds = null } = {}) {
  const errs = []
  const need = (cond, msg) => { if (!cond) errs.push(msg) }
  need(typeof e.id === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(e.id), 'id must be lowercase-kebab-case')
  need(SPORTS.includes(e.sport), `sport must be one of: ${SPORTS.join(', ')}`)
  need(typeof e.league === 'string' && e.league.trim(), 'league is required')
  need(e.title && typeof e.title.es === 'string' && e.title.es.trim() && typeof e.title.en === 'string' && e.title.en.trim(), 'title.es and title.en are required')
  need(typeof e.kickoff === 'string' && ISO_WITH_OFFSET.test(e.kickoff) && !Number.isNaN(Date.parse(e.kickoff)), 'kickoff must be ISO-8601 with UTC offset, e.g. 2026-11-21T19:00:00-07:00')
  need(typeof e.verified === 'boolean', 'verified must be true/false')
  if (e.promoId != null && e.promoId !== '') need(promoIds.includes(e.promoId), `promoId "${e.promoId}" not found in promos-by-sport.json`)
  if (e.matchup != null) {
    need(Array.isArray(e.matchup) && e.matchup.length === 2 && e.matchup.every((s) => typeof s === 'string'), 'matchup must be [left, right] participant slugs')
    if (participantIds && Array.isArray(e.matchup)) for (const s of e.matchup) need(participantIds.includes(s), `matchup "${s}" not found in participants.json`)
  }
  if (e.verified === true) need(typeof e.source === 'string' && /^https?:\/\//.test(e.source), 'verified events need a source URL')
  return errs
}
