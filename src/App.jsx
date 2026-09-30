import { useEffect, useState } from 'react'
import { I18nProvider, useI18n } from './i18n'
import Header from './components/Header'
import Hero from './components/Hero'
import Promos from './components/Promos'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Reviews from './components/Reviews'
import Visit from './components/Visit'
import OrderModal from './components/OrderModal'
import { Marquee, OrderButton } from './components/ui'

const SECTION_IDS = ['top', 'menu', 'promos', 'galeria', 'resenas', 'visitanos']

/** Lands at the top (or at #section from the URL), and keeps the URL hash in sync while scrolling. */
function useHashScroll() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    const go = (behavior) => {
      const id = decodeURIComponent(location.hash.slice(1))
      const el = id && document.getElementById(id)
      if (el) el.scrollIntoView({ behavior })
      else window.scrollTo({ top: 0, behavior })
    }

    go('instant')
    // fonts/images settle after first paint and shift the layout; re-align until the visitor scrolls on their own
    let touched = false
    const touch = () => { touched = true }
    const realign = () => { if (!touched) go('instant') }
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown']
    inputs.forEach((ev) => window.addEventListener(ev, touch, { once: true, passive: true }))
    if (document.readyState !== 'complete') window.addEventListener('load', realign, { once: true })
    document.fonts?.ready.then(realign)
    // lazy images keep growing the page; follow the layout for a few seconds
    const ro = new ResizeObserver(realign)
    ro.observe(document.body)
    const stop = setTimeout(() => ro.disconnect(), 5000)

    const onHash = () => go('smooth')
    window.addEventListener('hashchange', onHash)

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const id = e.target.id
          const url = id === 'top' ? location.pathname + location.search : `#${id}`
          if (decodeURIComponent(location.hash.slice(1)) !== (id === 'top' ? '' : id)) history.replaceState(null, '', url)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })

    return () => {
      window.removeEventListener('load', realign)
      clearTimeout(stop)
      ro.disconnect()
      inputs.forEach((ev) => window.removeEventListener(ev, touch))
      window.removeEventListener('hashchange', onHash)
      io.disconnect()
    }
  }, [])
}

function StickyOrder() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 500)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300 sm:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <OrderButton className="btn btn-red w-full max-w-sm shadow-2xl shadow-black" />
    </div>
  )
}

function Footer() {
  const { s } = useI18n()
  return (
    <footer className="wood grain relative border-t border-black/60 py-14 text-center">
      <img src="/img/logo.png" alt="Ocho 80" className="mx-auto h-16 w-auto" width="990" height="490" loading="lazy" />
      <p className="mt-4 text-sm text-bone-dim">
        © {new Date().getFullYear()} Ocho 80 Restaurant · Bar. {s.footer.rights}
      </p>
    </footer>
  )
}

export default function App() {
  useHashScroll()
  return (
    <I18nProvider>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Menu />
        <Promos />
        <Gallery />
        <Reviews />
        <Visit />
      </main>
      <Footer />
      <StickyOrder />
      <OrderModal />
    </I18nProvider>
  )
}
