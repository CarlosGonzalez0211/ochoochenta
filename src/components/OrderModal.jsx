import { useEffect, useRef } from 'react'
import { UBER_URL, useI18n } from '../i18n'
import { Icon } from './ui'

export default function OrderModal() {
  const { orderOpen, closeOrder, s } = useI18n()
  const goRef = useRef(null)

  useEffect(() => {
    if (!orderOpen) return
    const onKey = (e) => e.key === 'Escape' && closeOrder()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    goRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [orderOpen, closeOrder])

  if (!orderOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={closeOrder}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
        onClick={(e) => e.stopPropagation()}
        className="pop wood grain relative overflow-hidden w-full max-w-md rounded-t-3xl border border-bone/15 p-6 pb-8 shadow-2xl sm:rounded-3xl sm:pb-6"
      >
        <button type="button" onClick={closeOrder} aria-label={s.close} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-bone-dim hover:text-bone">
          <Icon name="x" />
        </button>
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-ember text-white">
          <Icon name="bag" className="h-6 w-6" />
        </div>
        <h3 id="order-title" className="font-display text-2xl">{s.order.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-bone/85">{s.order.body}</p>
        <div className="mt-6 flex flex-col gap-3">
          <a ref={goRef} href={UBER_URL} target="_blank" rel="noopener noreferrer" onClick={closeOrder} className="btn btn-red">
            {s.order.go}
            <Icon name="ext" className="h-4 w-4" />
          </a>
          <button type="button" onClick={closeOrder} className="btn btn-ghost">{s.order.cancel}</button>
        </div>
      </div>
    </div>
  )
}
