import { useEffect, useState } from 'react'
import { I18nProvider, useI18n } from './i18n'
import Header from './components/Header'
import Hero from './components/Hero'
import Promos from './components/Promos'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Visit from './components/Visit'
import OrderModal from './components/OrderModal'
import { Marquee, OrderButton } from './components/ui'

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
  return (
    <I18nProvider>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Menu />
        <Promos />
        <Gallery />
        <Visit />
      </main>
      <Footer />
      <StickyOrder />
      <OrderModal />
    </I18nProvider>
  )
}
