import { useI18n } from '../i18n'
import { getPromo, getUpcoming } from '../data/events'
import { VENUE_TZ } from '../data/events/schema'
import { Reveal, SectionHead } from './ui'

function When({ iso, lang }) {
  const d = new Date(iso)
  const day = new Intl.DateTimeFormat(lang, { weekday: 'short', day: 'numeric', month: 'short', timeZone: VENUE_TZ }).format(d)
  const time = new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit', timeZone: VENUE_TZ }).format(d)
  return (
    <div className="shrink-0 text-center sm:w-28">
      <p className="font-tech text-xs font-semibold uppercase tracking-[0.18em] text-bone-dim">{day}</p>
      <p className="font-tech text-2xl font-bold text-brass">{time}</p>
    </div>
  )
}

export default function GameDay() {
  const { s, lang, tr } = useI18n()
  const events = getUpcoming()
  if (!events.length) return null
  const g = s.games
  return (
    <section id="partidos" className="relative bg-char py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHead eyebrow={s.eyebrow.games} title={g.title} sub={g.sub} />
        <ul className="space-y-4">
          {events.map((e, i) => {
            const promo = getPromo(e)
            return (
              <Reveal as="li" key={e.id} delay={i * 60} className="bezel">
                <div className="core flex flex-col gap-4 bg-panel p-5 sm:flex-row sm:items-center sm:gap-6">
                  <When iso={e.kickoff} lang={lang} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-ember px-3 py-0.5 font-tech text-[10px] font-bold uppercase tracking-[0.2em]">{g.sports[e.sport] ?? g.sports.other}</span>
                      <span className="font-tech text-xs font-semibold uppercase tracking-[0.16em] text-bone-dim">{e.league}</span>
                      {e.featured && <span className="font-tech text-xs font-bold uppercase tracking-[0.16em] text-brass">★ {g.featured}</span>}
                    </div>
                    <h3 className="mt-1.5 font-display text-2xl uppercase leading-tight sm:text-3xl">{tr(e.title)}</h3>
                    {promo && <p className="mt-1 text-sm text-ember-hot">{tr(promo)}</p>}
                  </div>
                  {e.channel && <p className="font-tech text-xs font-semibold uppercase tracking-[0.16em] text-bone-dim sm:text-right">{g.on} {e.channel}</p>}
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
