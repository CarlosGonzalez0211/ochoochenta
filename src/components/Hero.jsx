import { useI18n } from '../i18n'
import { Icon, OrderButton, img } from './ui'

export default function Hero() {
  const { s } = useI18n()
  return (
    <section id="top" className="wood grain relative isolate min-h-[100dvh] overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-28">
      <div className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-ember/25 blur-[110px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-ember/20 blur-[120px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="text-center lg:text-left">
          <img
            src="/img/logo.png"
            alt="Ocho 80 Restaurant Bar"
            className="rise mx-auto w-[74%] max-w-[400px] drop-shadow-[0_10px_50px_rgba(211,20,28,0.5)] lg:mx-0"
            width="990"
            height="490"
            fetchPriority="high"
          />
          <p className="rise mt-7 inline-block rounded-full border border-brass/40 bg-black/30 px-3.5 py-1 font-tech text-[10px] font-semibold uppercase tracking-[0.3em] text-brass" style={{ animationDelay: '120ms' }}>{s.hero.kicker}</p>
          <h1 className="rise mt-3 font-display text-[2.3rem] leading-[1.08] [text-shadow:0_4px_30px_rgba(0,0,0,0.8)] sm:text-6xl lg:text-[4rem]" style={{ animationDelay: '220ms' }}>{s.hero.title}</h1>
          <p className="rise mx-auto mt-5 max-w-md text-base text-bone/85 sm:text-lg lg:mx-0" style={{ animationDelay: '320ms' }}>{s.hero.sub}</p>

          <div className="rise mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start" style={{ animationDelay: '420ms' }}>
            <a href="#menu" className="btn btn-red">{s.hero.cta}<span className="knob" aria-hidden><Icon name="arrow" className="h-4 w-4" /></span></a>
            <OrderButton className="btn btn-ghost" />
          </div>
          <p className="rise mx-auto mt-4 max-w-sm text-xs text-bone/70 lg:mx-0" style={{ animationDelay: '520ms' }}>{s.menu.priceNote}</p>
        </div>

        <div className="rise relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: '350ms' }}>
          <div className="grid grid-cols-6 grid-rows-6 gap-3 sm:gap-4" style={{ aspectRatio: '1 / 1.05' }}>
            <div className="col-span-4 row-span-4 overflow-hidden rounded-[1.6rem] ring-1 ring-bone/20 ring-offset-4 ring-offset-black/40 shadow-2xl shadow-black/70">
              <img src={img('aguachile')} alt="Aguachile en molcajete" className="h-full w-full object-cover" />
            </div>
            <div className="col-span-2 row-span-3 overflow-hidden rounded-[1.6rem] ring-1 ring-bone/20 ring-offset-4 ring-offset-black/40 shadow-2xl shadow-black/70">
              <img src={img('clamato')} alt="Clamato refrescante" className="h-full w-full object-cover" />
            </div>
            <div className="col-span-2 row-span-3 overflow-hidden rounded-[1.6rem] ring-1 ring-bone/20 ring-offset-4 ring-offset-black/40 shadow-2xl shadow-black/70">
              <img src={img('coctel')} alt="Coctel de camarones" className="h-full w-full object-cover" />
            </div>
            <div className="col-span-4 row-span-2 overflow-hidden rounded-[1.6rem] ring-1 ring-bone/20 ring-offset-4 ring-offset-black/40 shadow-2xl shadow-black/70">
              <img src={img('steak')} alt="Corte a las brasas con papa asada" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
