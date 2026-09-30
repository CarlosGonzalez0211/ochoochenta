import { useI18n } from '../i18n'
import { Reveal, SectionHead, img } from './ui'

const PHOTOS = [
  ['mesa', 'Mesa con cocteles y caldo de camarón'],
  ['aguachile2', 'Aguachile de camarón'],
  ['tajin', 'Bebida con borde enchilado'],
  ['fajitas', 'Fajitas con arroz y frijoles'],
  ['colada', 'Piña colada'],
  ['bar', 'La barra de Ocho 80'],
  ['clamato', 'Clamato'],
  ['enchiladas', 'Enchiladas verdes y rojas'],
  ['aguas', 'Aguas frescas'],
  ['mezcal', 'Mezcal con naranja'],
  ['parrillada', 'Parrillada para dos'],
  ['pastel', 'Pastel de zanahoria'],
]

export default function Gallery() {
  const { s } = useI18n()
  return (
    <section id="galeria" className="bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={s.eyebrow.gallery} title={s.gallery.title} sub={s.gallery.sub} />
        <div className="columns-2 gap-3 sm:gap-4 md:columns-3">
          {PHOTOS.map(([name, alt], i) => (
            <Reveal key={name} delay={(i % 3) * 80} className="group mb-3 overflow-hidden rounded-[1.6rem] ring-1 ring-bone/15 break-inside-avoid sm:mb-4">
              <img src={img(name)} alt={alt} loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-105" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
