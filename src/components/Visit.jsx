import { CONTACT, MAPS_URL, useI18n } from '../i18n'
import { Icon, OrderButton, Reveal, SectionHead } from './ui'

function Line({ icon, label, href, children }) {
  const Tag = href ? 'a' : 'div'
  return (
    <Tag
      {...(href ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' } : {})}
      className="group flex min-h-14 items-center gap-4 rounded-2xl border border-bone/15 bg-black/55 px-4 py-3 backdrop-blur-sm transition-colors hover:border-ember/70"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ember/15 text-ember-hot group-hover:bg-ember group-hover:text-white">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-tech text-xs uppercase tracking-[0.2em] text-bone-dim">{label}</span>
        <span className="block break-words text-[15px] text-bone">{children}</span>
      </span>
    </Tag>
  )
}

export default function Visit() {
  const { s } = useI18n()
  const v = s.visit
  return (
    <section id="visitanos" className="wood grain relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={s.eyebrow.visit} title={v.title} />
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          <Reveal className="space-y-3">
            <Line icon="pin" label={v.addressLabel} href={MAPS_URL}>{CONTACT.address}</Line>
            <Line icon="phone" label={v.phoneLabel} href={CONTACT.phoneHref}>{CONTACT.phone}</Line>
            <Line icon="insta" label="Instagram" href={`https://www.instagram.com/${CONTACT.instagram}`}>@{CONTACT.instagram}</Line>
            <Line icon="tiktok" label="TikTok" href={`https://www.tiktok.com/@${CONTACT.tiktok}`}>@{CONTACT.tiktok}</Line>
            <Line icon="fb" label="Facebook" href={`https://www.facebook.com/search/top?q=${encodeURIComponent(CONTACT.facebook)}`}>{CONTACT.facebook}</Line>
            <Line icon="mail" label={v.emailLabel} href={`mailto:${CONTACT.email}`}>{CONTACT.email}</Line>

            <div className="mt-2 rounded-3xl border border-ember/50 bg-black/60 p-6 backdrop-blur-sm text-center sm:text-left">
              <h3 className="font-display text-2xl">{v.orderTitle}</h3>
              <p className="mt-1 text-[15px] text-bone/85">{v.orderBody}</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <OrderButton className="btn btn-red" />
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{v.directions}<span className="knob" aria-hidden><Icon name="arrow" className="h-4 w-4" /></span></a>
              </div>
              <p className="mt-3 text-xs text-bone/70">{s.menu.priceNote}</p>
            </div>
          </Reveal>

          <Reveal delay={120} className="bezel min-h-72 lg:min-h-full"><div className="core h-full overflow-hidden">
            <iframe
              title="Mapa Ocho 80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-80 w-full border-0 [filter:grayscale(0.4)_contrast(1.05)_brightness(0.9)]"
              src="https://www.google.com/maps?q=31.6543019,-106.3602914&z=17&output=embed"
            />
          </div></Reveal>
        </div>
      </div>
    </section>
  )
}
