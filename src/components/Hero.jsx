import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { Icon, OrderButton, img } from './ui'

/** Muted looping reel: skips autoplay for reduced-motion / data-saver, pauses off-screen, has a pause control. */
function Reel() {
  const { s } = useI18n()
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [allowed] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !navigator.connection?.saveData
  )
  const userPaused = useRef(false)

  useEffect(() => {
    const v = ref.current
    if (!v || !allowed) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused.current) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)
    return () => io.disconnect()
  }, [allowed])

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      userPaused.current = false
      v.play().catch(() => {})
    } else {
      userPaused.current = true
      v.pause()
    }
  }

  return (
    <div className="relative h-full w-full">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src="/video/reel.mp4"
        poster="/img/reel-poster.webp"
        muted
        loop
        playsInline
        preload={allowed ? 'metadata' : 'none'}
        aria-label={s.hero.reelLabel}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? s.hero.pause : s.hero.play}
        className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur-md transition-colors hover:bg-ember"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l11-6.5z" />}
        </svg>
      </button>
    </div>
  )
}

export default function Hero() {
  const { s } = useI18n()
  return (
    <section id="top" className="wood grain relative isolate min-h-[100dvh] overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-28">
      <div className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-ember/25 blur-[110px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-ember/20 blur-[120px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
        <div className="text-center lg:text-left">
          <img
            src="/img/logo.png"
            alt="Ocho 80 Restaurant Bar"
            className="rise mx-auto w-[74%] max-w-[400px] drop-shadow-[0_10px_50px_rgba(211,20,28,0.5)] lg:mx-0"
            width="990"
            height="490"
            fetchPriority="high"
          />
          <h1 className="rise mt-8 font-display text-[2.3rem] leading-[1.08] [text-shadow:0_4px_30px_rgba(0,0,0,0.8)] sm:text-6xl lg:text-[4rem]" style={{ animationDelay: '220ms' }}>{s.hero.title}</h1>
          <p className="rise mx-auto mt-5 max-w-md text-base text-bone/85 sm:text-lg lg:mx-0" style={{ animationDelay: '320ms' }}>{s.hero.sub}</p>

          <div className="rise mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start" style={{ animationDelay: '420ms' }}>
            <a href="#menu" className="btn btn-red">{s.hero.cta}<span className="knob" aria-hidden><Icon name="arrow" className="h-4 w-4" /></span></a>
            <OrderButton className="btn btn-ghost" />
          </div>
          <p className="rise mx-auto mt-4 max-w-sm text-xs text-bone/70 lg:mx-0" style={{ animationDelay: '520ms' }}>{s.menu.priceNote}</p>
        </div>

        <div className="rise relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: '350ms' }}>
          <div className="grid grid-cols-6 grid-rows-[repeat(6,minmax(0,1fr))] gap-3 sm:gap-4" style={{ aspectRatio: '1 / 1.05' }}>
            <div className="col-span-6 row-span-3 overflow-hidden rounded-[1.6rem] ring-1 ring-bone/20 ring-offset-4 ring-offset-black/40 shadow-2xl shadow-black/70">
              <Reel />
            </div>
            <div className="col-span-2 row-span-3 overflow-hidden rounded-[1.6rem] ring-1 ring-bone/20 ring-offset-4 ring-offset-black/40 shadow-2xl shadow-black/70">
              <img src={img('aguachile')} alt="Aguachile en molcajete" className="h-full w-full object-cover" />
            </div>
            <div className="col-span-2 row-span-3 overflow-hidden rounded-[1.6rem] ring-1 ring-bone/20 ring-offset-4 ring-offset-black/40 shadow-2xl shadow-black/70">
              <img src={img('clamato')} alt="Clamato refrescante" className="h-full w-full object-cover" />
            </div>
            <div className="col-span-2 row-span-3 overflow-hidden rounded-[1.6rem] ring-1 ring-bone/20 ring-offset-4 ring-offset-black/40 shadow-2xl shadow-black/70">
              <img src={img('steak')} alt="Corte a las brasas con papa asada" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
