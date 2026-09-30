import { GOOGLE, useI18n } from '../i18n'
import { REVIEWS } from '../data/reviews'
import { Icon, Reveal, SectionHead } from './ui'

function Stars({ value, className = 'h-5 w-5' }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" className={`${className} ${i <= Math.round(value) ? 'text-brass' : 'text-bone/20'}`} />
      ))}
    </span>
  )
}

function ReviewCard({ r }) {
  return (
    <article className="bezel h-full">
      <div className="core flex h-full flex-col gap-4 bg-char p-6">
        <Stars value={r.rating} className="h-4 w-4" />
        <p className="flex-1 text-[15px] leading-relaxed text-bone/90 sm:text-base">“{r.text}”</p>
        <div className="flex items-center gap-3 border-t border-bone/10 pt-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ember font-tech text-lg font-bold">{r.name[0]}</span>
          <div className="min-w-0">
            <p className="truncate font-tech text-base font-bold">{r.name}</p>
            {r.badge && <p className="text-xs text-brass">{r.badge}</p>}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Reviews() {
  const { s } = useI18n()
  const v = s.reviews

  return (
    <section id="resenas" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={s.eyebrow.reviews} title={v.title} sub={v.sub} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <Reveal className="bezel">
            <div className="core flex h-full flex-col items-center gap-4 bg-ember-deep/60 p-7 text-center">
              <p className="font-display text-7xl leading-none">{GOOGLE.rating.toFixed(1).replace('.', s.decimal)}</p>
              <Stars value={GOOGLE.rating} className="h-7 w-7" />
              <p className="font-tech text-sm uppercase tracking-[0.18em] text-bone/80">
                {v.outOf} · {v.count(GOOGLE.count)}
              </p>

              <ul className="w-full space-y-1.5" aria-hidden>
                {[5, 4, 3, 2, 1].map((n) => (
                  <li key={n} className="flex items-center gap-2 text-xs text-bone/80">
                    <span className="w-3 font-tech font-bold">{n}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-black/40">
                      <span className="block h-full rounded-full bg-brass" style={{ width: `${(GOOGLE.breakdown[n] / GOOGLE.count) * 100}%` }} />
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex w-full flex-col gap-3">
                <a href={GOOGLE.writeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-red">
                  {v.write}
                  <span className="knob" aria-hidden><Icon name="arrow" className="h-4 w-4" /></span>
                </a>
                <a href={GOOGLE.profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  {v.seeAll}
                  <span className="knob" aria-hidden><Icon name="arrow" className="h-4 w-4" /></span>
                </a>
              </div>
              <p className="text-xs text-bone/60">{v.via}</p>
            </div>
          </Reveal>

          <div className="tabs-scroll -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={(i % 2) * 90} className="w-[84%] shrink-0 snap-center sm:w-auto">
                <ReviewCard r={r} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
