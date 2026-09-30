import { useEffect, useRef } from 'react'
import { useI18n } from '../i18n'

export const img = (name) => `/img/${name}.webp`

export function Icon({ name, className = 'w-5 h-5' }) {
  const p = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  switch (name) {
    case 'bag':
      return (
        <svg {...p}>
          <path d="M5 8h14l-1 12H6L5 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      )
    case 'pin':
      return (
        <svg {...p}>
          <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...p}>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      )
    case 'insta':
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg {...p}>
          <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 4c.4 2.4 2 4 4.5 4.2" />
        </svg>
      )
    case 'fb':
      return (
        <svg {...p}>
          <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5c0-.3.2-.5.5-.5Z" />
        </svg>
      )
    case 'mic':
      return (
        <svg {...p}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
        </svg>
      )
    case 'glass':
      return (
        <svg {...p}>
          <path d="M4 4h16l-8 9-8-9ZM12 13v7M8 20h8" />
        </svg>
      )
    case 'note':
      return (
        <svg {...p}>
          <path d="M9 18V6l10-2v12" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="16" r="2" />
        </svg>
      )
    case 'fork':
      return (
        <svg {...p}>
          <path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v6M9 3v6M17 21V3c-2.2 1.2-3 4-3 7 0 2 1 3 3 3" />
        </svg>
      )
    case 'people':
      return (
        <svg {...p}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M18 14.3c1.8.8 3 2.6 3 4.7" />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...p}>
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      )
    case 'star':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9L12 2.6Z" />
        </svg>
      )
    case 'x':
      return (
        <svg {...p}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      )
    case 'ext':
      return (
        <svg {...p}>
          <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
      )
    default:
      return null
  }
}

/** Fades content in once it scrolls into view. */
export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in')
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

export function SectionHead({ title, sub, eyebrow, align = 'center' }) {
  return (
    <div className={`mb-8 md:mb-12 ${align === 'center' ? 'text-center' : ''}`}>
      {eyebrow && (
        <span className="mb-4 inline-block rounded-full border border-brass/40 bg-black/30 px-3.5 py-1 font-tech text-[10px] font-semibold uppercase tracking-[0.28em] text-brass">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-[2.1rem] leading-tight text-bone [text-shadow:0_2px_24px_rgba(0,0,0,0.8)] sm:text-6xl">{title}</h2>
      <div className={`mt-3 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="h-px w-10 bg-ember" />
        <span className="h-2 w-2 rotate-45 bg-ember" />
        <span className="h-px w-10 bg-ember" />
      </div>
      {sub && <p className="mx-auto mt-4 max-w-xl text-base text-bone-dim">{sub}</p>}
    </div>
  )
}

export function OrderButton({ className = 'btn btn-red', children }) {
  const { openOrder, s } = useI18n()
  return (
    <button type="button" onClick={openOrder} className={className}>
      <Icon name="bag" />
      {children ?? s.nav.order}
      <span className="knob" aria-hidden>
        <Icon name="arrow" className="h-4 w-4" />
      </span>
    </button>
  )
}

export function Marquee() {
  const { s } = useI18n()
  const row = [...s.marquee, ...s.marquee]
  return (
    <div className="marquee relative z-10 overflow-hidden border-y border-black/40 bg-ember py-3.5 text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)]" aria-hidden>
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={i} className="flex items-center font-tech text-sm font-bold uppercase tracking-[0.24em] sm:text-base">
                <span className="px-6">{t}</span>
                <span className="text-black/50">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Price({ value, className = '' }) {
  return (
    <span className={`font-tech font-bold tracking-wide text-ember-hot tabular-nums ${className}`}>
      ${value.toFixed(2)}
    </span>
  )
}
