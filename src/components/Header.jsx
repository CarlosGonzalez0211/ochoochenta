import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { OrderButton } from './ui'

function LangToggle() {
  const { lang, setLang, s } = useI18n()
  return (
    <div role="group" aria-label={s.langLabel} className="flex overflow-hidden rounded-full border border-bone/30 text-sm font-tech font-bold">
      {['es', 'en'].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`min-h-10 min-w-11 px-3 uppercase tracking-wider transition-colors ${
            lang === l ? 'bg-ember text-white' : 'text-bone-dim hover:text-bone'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Header() {
  const { s } = useI18n()
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const links = [
    ['menu', s.nav.menu],
    ['promos', s.nav.promos],
    ['galeria', s.nav.gallery],
    ['visitanos', s.nav.visit],
  ]

  return (
    <header className="fixed inset-x-0 top-2 z-40 px-2 sm:top-3 sm:px-4">
      <div
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 rounded-full border pl-4 pr-2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:h-16 sm:pl-6 ${
          solid ? 'border-bone/15 bg-ink/80 shadow-[0_18px_40px_-14px_#000] backdrop-blur-xl' : 'border-bone/10 bg-black/25 backdrop-blur-md'
        }`}
      >
        <a href="#top" aria-label="Ocho 80" className="shrink-0">
          <img src="/img/logo.png" alt="Ocho 80 Restaurant Bar" className="h-9 w-auto sm:h-11" width="990" height="490" />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="font-tech text-sm font-semibold uppercase tracking-[0.14em] text-bone-dim transition-colors hover:text-ember-hot">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LangToggle />
          <OrderButton className="btn btn-red hidden !min-h-11 !px-5 sm:inline-flex" />
        </div>
      </div>
    </header>
  )
}
