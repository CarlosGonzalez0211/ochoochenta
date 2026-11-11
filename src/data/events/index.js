import events from './events.json'
import promos from './promos-by-sport.json'

const GRACE_MS = 3 * 60 * 60 * 1000 // keep a game listed for 3h after kickoff
const MAX_SHOWN = 8

/** Upcoming events for the site. Unverified entries only show in `vite dev`, never in production. */
export function getUpcoming(now = Date.now()) {
  return events
    .filter((e) => (e.verified || import.meta.env.DEV) && Date.parse(e.kickoff) + GRACE_MS > now)
    .sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff))
    .slice(0, MAX_SHOWN)
}

/** The promo text for an event, only if the owner has approved it. */
export function getPromo(event) {
  const p = event.promoId && promos[event.promoId]
  return p && p.approved ? p.text : null
}
