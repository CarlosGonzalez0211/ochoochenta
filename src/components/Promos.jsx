import { useI18n } from '../i18n'
import { Icon, Reveal, SectionHead, img } from './ui'

const perkIcons = ['note', 'note', 'people']
const friIcons = ['note', 'fork', 'glass']

export default function Promos() {
  const { s } = useI18n()
  const p = s.promos
  return (
    <section id="promos" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={s.eyebrow.promos} title={p.title} sub={p.sub} />
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {/* Thursday */}
          <Reveal className="bezel"><div className="core relative isolate overflow-hidden bg-char p-6 sm:p-9">
            <img src={img('bar')} alt="" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30" loading="lazy" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/70 via-black/80 to-ember-deep/60" />
            <span className="inline-flex items-center gap-2 rounded-full bg-ember px-3 py-1 font-tech text-xs font-bold uppercase tracking-[0.2em]">
              <Icon name="mic" className="h-4 w-4" /> {p.thu}
            </span>
            <h3 className="mt-4 font-display text-4xl uppercase leading-[1] sm:text-5xl">{p.thuHead}</h3>
            <p className="script-title mt-1 block text-3xl text-ember-hot sm:text-4xl">{p.thuScript}</p>

            <div className="mt-6 flex flex-col items-start">
              <span className="w-fit bg-ember px-4 py-1 font-tech text-sm font-bold uppercase tracking-widest [clip-path:polygon(0_0,100%_0,94%_50%,100%_100%,0_100%)] pr-8">
                {p.thuFrom}
              </span>
              <span className="font-tech text-4xl font-bold text-brass sm:text-5xl">{p.thuTime}</span>
            </div>

            <ul className="mt-5 space-y-2.5">
              {p.thuPerks.map((t, i) => (
                <li key={t} className="flex items-center gap-3 font-tech font-semibold uppercase tracking-wide">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ember/90 text-white"><Icon name={perkIcons[i]} className="h-[18px] w-[18px]" /></span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-end gap-x-4 border-t border-bone/15 pt-5">
              <span className="font-display text-3xl uppercase">{p.thuLitros}</span>
              <span className="script-title text-5xl text-ember-hot sm:text-6xl">$88.80</span>
            </div>
          </div></Reveal>

          {/* Friday */}
          <Reveal delay={120} className="bezel"><div className="core relative isolate overflow-hidden bg-ember-deep p-6 sm:p-9">
            <img src={img('mezcal')} alt="" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25" loading="lazy" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ember-deep/85 via-[#4a0709]/90 to-black/90" />
            <span className="inline-flex items-center gap-2 rounded-full bg-bone px-3 py-1 font-tech text-xs font-bold uppercase tracking-[0.2em] text-ember-deep">
              <Icon name="glass" className="h-4 w-4" /> {p.fri}
            </span>
            <h3 className="mt-4 font-display text-4xl uppercase leading-[1] sm:text-5xl">{p.friHead}</h3>
            <p className="script-title mt-1 text-4xl text-ember-hot sm:text-5xl">{p.friTitle}</p>

            <p className="mt-6 font-tech text-3xl font-bold uppercase leading-none sm:text-4xl">
              {p.friBig.split(' ')[0]} <span className="text-brass">{p.friBig.split(' ').slice(1).join(' ')}</span>
            </p>

            <ul className="mt-6 grid grid-cols-3 gap-3 text-center">
              {p.friPerks.map((t, i) => (
                <li key={t} className="flex flex-col items-center gap-2 font-tech text-xs font-semibold uppercase leading-tight tracking-wide sm:text-sm">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-ember text-white shadow-lg shadow-black/40"><Icon name={friIcons[i]} className="h-6 w-6" /></span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-bone/70">{p.friTerms}</p>
          </div></Reveal>
        </div>
      </div>
    </section>
  )
}
