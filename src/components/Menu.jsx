import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { MENU, TABS } from '../data/menu'
import { OrderButton, Price, Reveal, SectionHead, img } from './ui'

function Row({ item, tr }) {
  return (
    <li className="py-3.5">
      <div className="flex items-baseline">
        <h4 className="font-tech text-[1.05rem] font-bold uppercase leading-snug tracking-wide text-ember-hot sm:text-lg">
          {tr(item.n)}
        </h4>
        {item.p != null && (
          <>
            <span className="leader" aria-hidden />
            <Price value={item.p} className="text-lg sm:text-xl" />
          </>
        )}
      </div>
      {item.d && <p className="mt-1 text-[15px] leading-relaxed text-bone/80">{tr(item.d)}</p>}
      {item.list && (
        <ul className="mt-2 space-y-1 text-[15px] text-bone/90">
          {item.list.map((l, i) => (
            <li key={i} className="flex gap-2"><span className="text-ember">•</span>{tr(l)}</li>
          ))}
        </ul>
      )}
      {item.v && (
        <ul className="mt-2 space-y-1.5">
          {item.v.map((v, i) => (
            <li key={i} className="flex items-baseline text-[15px] text-bone/90">
              <span>{tr(v.l)}</span>
              <span className="leader" aria-hidden />
              <Price value={v.p} className="text-base" />
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function CompactRow({ item, tr }) {
  return (
    <li className="flex items-baseline py-2">
      <span className="font-tech text-[15px] font-semibold uppercase leading-snug tracking-wide text-bone">{tr(item.n)}</span>
      <span className="leader" aria-hidden />
      <Price value={item.p} className="text-base" />
    </li>
  )
}

function Section({ sec, tr }) {
  return (
    <div className="mt-9 first:mt-0">
      <h3 className="script-title text-3xl text-bone sm:text-4xl">{tr(sec.title)}</h3>
      {sec.note && <p className="mt-3 text-[15px] text-bone/80">{tr(sec.note)}</p>}
      {sec.box && (
        <p className="mt-4 rounded-lg border-2 border-ember-deep bg-ember/5 px-4 py-3 text-center text-[15px] leading-relaxed text-bone/90">
          {tr(sec.box)}
        </p>
      )}
      {sec.items && sec.compact ? (
        <ul className="mt-3 grid gap-x-10 md:grid-cols-2">
          {sec.items.map((it, i) => <CompactRow key={i} item={it} tr={tr} />)}
        </ul>
      ) : sec.items ? (
        <ul className="mt-2 divide-y divide-bone/10">
          {sec.items.map((it, i) => <Row key={i} item={it} tr={tr} />)}
        </ul>
      ) : null}
    </div>
  )
}

function OrderCard({ className = '' }) {
  const { s } = useI18n()
  return (
    <div className={`rounded-3xl border border-ember/50 bg-black/55 p-4 text-center backdrop-blur-sm ${className}`}>
      <OrderButton className="btn btn-red w-full">{s.menu.orderCta}</OrderButton>
      <p className="mt-3 text-xs leading-relaxed text-bone/75">{s.menu.priceNote}</p>
    </div>
  )
}

export default function Menu() {
  const { s, tr, lang } = useI18n()
  const [tab, setTab] = useState('desayunos')
  const tabsRef = useRef(null)
  const top = useRef(null)
  const data = MENU[tab]

  const pick = (id) => {
    setTab(id)
    const el = top.current
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 128
      if (window.scrollY > y) window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  // keep the active tab visible in the horizontal scroller
  useEffect(() => {
    const el = tabsRef.current?.querySelector('[aria-selected="true"]')
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [tab])

  return (
    <section id="menu" className="wood-table relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHead eyebrow={s.eyebrow.menu} title={s.menu.title} sub={s.menu.sub} />
      </div>

      <div ref={top} className="sticky top-[4.75rem] z-30 border-y border-black/50 bg-ink/85 backdrop-blur-xl sm:top-[5.25rem]">
        <div ref={tabsRef} role="tablist" aria-label={s.menu.title} className="tabs-scroll mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 py-3 sm:justify-center sm:px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => pick(t.id)}
              className={`min-h-11 shrink-0 rounded-full border px-5 font-tech text-sm font-bold uppercase tracking-wider transition-colors ${
                tab === t.id ? 'border-ember bg-ember text-white' : 'border-bone/25 text-bone-dim hover:border-bone/60 hover:text-bone'
              }`}
            >
              {tr(t.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-12">
        <div key={tab + lang} className="fade-up grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div className="bezel min-w-0"><div className="core chalk p-5 sm:p-9">
            {data.sections.map((sec, i) => <Section key={i} sec={sec} tr={tr} />)}
            <OrderCard className="mt-8 lg:hidden" />
            {tab === 'bebidas' && <p className="mt-8 text-sm text-bone-dim">{s.menu.barNote}</p>}
          </div></div>

          <aside className="order-first lg:order-none">
            <div className="lg:sticky lg:top-40">
              <div className="bezel"><div className="core overflow-hidden">
                <img src={img(data.image)} alt="" className="h-40 w-full object-cover sm:h-64 lg:h-80" loading="lazy" />
              </div></div>
              <OrderCard className="mt-4 hidden lg:block" />
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
