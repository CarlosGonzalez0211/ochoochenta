// HTML templates for Ocho 80 flyers. Pure functions: (data, options) -> full HTML string.
// Brand tokens mirror src/index.css (@theme). Keep them in sync if the site palette changes.
import { pathToFileURL } from 'node:url'
import { fileURLToPath } from 'node:url'
import { CONTACT } from '../../src/data/contact.js'
import { VENUE_TZ } from '../../src/data/events/schema.js'

const root = (p) => pathToFileURL(fileURLToPath(new URL(`../../${p}`, import.meta.url))).href
const font = (pkg, file) => root(`node_modules/@fontsource/${pkg}/files/${file}`)

export const SIZES = { feed: { w: 1080, h: 1350 }, story: { w: 1080, h: 1920 } }

const SCRIPT_LINE = {
  soccer: { es: 'ven con tu banda', en: 'bring your crew' },
  football: { es: 'game day', en: 'game day' },
  boxing: { es: 'noche de pelea', en: 'fight night' },
  mma: { es: 'noche de peleas', en: 'fight night' },
  baseball: { es: 'play ball', en: 'play ball' },
  basketball: { es: 'a la cancha', en: 'game on' },
  other: { es: 'en pantalla gigante', en: 'on the big screen' },
}
const SPORT_LABEL = {
  soccer: 'Fútbol', football: 'Fútbol americano', boxing: 'Box', mma: 'MMA', baseball: 'Béisbol', basketball: 'Basquetbol', other: 'Deportes',
}

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export function fmtDay(iso, opts = { weekday: 'long', day: 'numeric', month: 'long' }) {
  return new Intl.DateTimeFormat('es-MX', { ...opts, timeZone: VENUE_TZ }).format(new Date(iso))
}
export function fmtTime(iso) {
  // "7:00 p.m." style, Juárez time
  return new Intl.DateTimeFormat('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: VENUE_TZ })
    .format(new Date(iso)).replace(/\s?([ap])\.?\s?m\.?/i, (_, m) => ` ${m.toUpperCase()}.M.`)
}

/** Compact "SÁB 14 NOV" for list rows. */
export function fmtShortDay(iso) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('es-MX', { weekday: 'short', day: 'numeric', month: 'short', timeZone: VENUE_TZ }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]))
  return `${p.weekday} ${p.day} ${p.month}`.replace(/\./g, '')
}
/** Compact "6:00 PM". */
export function fmtShortTime(iso) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: VENUE_TZ }).format(new Date(iso))
}

const BASE_CSS = ({ w, h }) => `
@font-face{font-family:Rye;src:url(${font('rye', 'rye-latin-400-normal.woff2')})}
@font-face{font-family:Kaushan;src:url(${font('kaushan-script', 'kaushan-script-latin-400-normal.woff2')})}
@font-face{font-family:Chakra;font-weight:600;src:url(${font('chakra-petch', 'chakra-petch-latin-600-normal.woff2')})}
@font-face{font-family:Chakra;font-weight:700;src:url(${font('chakra-petch', 'chakra-petch-latin-700-normal.woff2')})}
@font-face{font-family:Poppins;font-weight:400;src:url(${font('poppins', 'poppins-latin-400-normal.woff2')})}
@font-face{font-family:Poppins;font-weight:600;src:url(${font('poppins', 'poppins-latin-600-normal.woff2')})}
:root{--ink:#0a0706;--char:#151010;--ember:#d3141c;--ember-hot:#f0262e;--ember-deep:#8f0e14;--bone:#efe6d4;--bone-dim:#b9ad98;--brass:#d9a24a}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;background:var(--ink);color:var(--bone);font-family:Poppins,sans-serif;overflow:hidden}
.flyer{position:relative;width:${w}px;height:${h}px;display:flex;flex-direction:column;align-items:center;padding:${h > 1500 ? 120 : 64}px 72px ${h > 1500 ? 110 : 56}px;isolation:isolate;text-align:center}
.bg{position:absolute;inset:0;z-index:-2;background:#1a0e08 url(${root('public/img/wood-wall.webp')}) center/900px}
.bg::after{content:"";position:absolute;inset:0;background:
  radial-gradient(70% 45% at 50% 38%,rgba(211,20,28,.38),transparent 70%),
  radial-gradient(120% 80% at 50% 0%,rgba(255,170,90,.14),transparent 55%),
  linear-gradient(180deg,rgba(10,6,4,.55) 0%,rgba(10,6,4,.82) 55%,rgba(10,6,4,.95) 100%)}
.frame{position:absolute;inset:26px;z-index:-1;border:2px solid rgba(217,162,74,.55);border-radius:36px;box-shadow:inset 0 0 0 8px rgba(10,7,6,.55),inset 0 0 0 9px rgba(239,230,212,.12)}
.logo{height:${h > 1500 ? 200 : 150}px;width:auto}
.chip{display:inline-flex;align-items:center;gap:12px;background:var(--ember);color:#fff;font:700 26px Chakra;letter-spacing:.2em;text-transform:uppercase;padding:8px 26px;border-radius:999px}
.league{font:600 28px Chakra;letter-spacing:.2em;text-transform:uppercase;color:var(--bone-dim)}
.display{font-family:Rye,Georgia,serif;text-transform:uppercase;line-height:1.02;color:var(--bone);text-shadow:0 4px 30px rgba(0,0,0,.85)}
.script{font-family:Kaushan,cursive;color:var(--ember-hot);text-shadow:0 3px 18px rgba(0,0,0,.8)}
.tech{font-family:Chakra,sans-serif;text-transform:uppercase}
.brass{color:var(--brass)}
.ribbon{background:var(--ember);color:#fff;font:700 34px Chakra;letter-spacing:.14em;text-transform:uppercase;padding:14px 64px 14px 40px;clip-path:polygon(0 0,100% 0,95% 50%,100% 100%,0 100%)}
.footer{margin-top:auto;width:100%;border-top:1px solid rgba(239,230,212,.2);padding-top:26px;font-size:25px;color:var(--bone-dim);line-height:1.5}
.footer b{color:var(--bone);font-weight:600}
.footer .row{display:flex;justify-content:center;gap:34px;flex-wrap:wrap}
.star{width:.9em;height:.9em;vertical-align:-.1em;fill:currentColor}
`

const STAR = '<svg class="star" viewBox="0 0 24 24"><path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9L12 2.6Z"/></svg>'

const footerHtml = () => `
<div class="footer">
  <div class="row"><span><b>${esc(CONTACT.phone)}</b></span><span><b>@${esc(CONTACT.instagram)}</b></span></div>
  <div>${esc(CONTACT.address)}</div>
</div>`

const wrap = (size, css, body) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${BASE_CSS(SIZES[size])}${css}</style></head>
<body><div class="flyer"><div class="bg"></div><div class="frame"></div>
<img class="logo" src="${root('public/img/logo.png')}" alt="Ocho 80">${body}${footerHtml()}</div></body></html>`

/** Scale the headline down for long titles so it always fits. */
function titleSize(text, story) {
  const n = text.length
  const base = story ? 1.12 : 1
  if (n <= 14) return Math.round(150 * base)
  if (n <= 24) return Math.round(118 * base)
  if (n <= 36) return Math.round(92 * base)
  return Math.round(74 * base)
}

/** Split "A vs. B" into two lines; keeps "vs." small and red. */
function titleHtml(title) {
  title = title.replace(/^[^:]{2,30}:\s+(?=.*\s(vs\.?|at)\s)/i, '') // "UFC 335: A vs. B" -> "A vs. B" (the league line already says UFC 335)
  const m = title.match(/^(.*?)\s+(vs\.?|at)\s+(.*)$/i)
  if (!m) return esc(title)
  return `${esc(m[1])}<br><span class="script" style="font-size:.5em;text-transform:none">${esc(m[2].toLowerCase())}</span><br>${esc(m[3])}`
}

export function eventFlyer(event, promoText, size = 'feed') {
  const story = size === 'story'
  const title = event.title.es
  const fs = titleSize(title.replace(/^[^:]{2,30}:\s+(?=.*\s(vs\.?|at)\s)/i, '').replace(/\s+(vs\.?|at)\s+/i, ' '), story)
  const line = SCRIPT_LINE[event.sport] ?? SCRIPT_LINE.other
  const en = event.title.en !== event.title.es ? event.title.en : ''
  const css = `
.top{margin-top:${story ? 70 : 34}px;display:flex;flex-direction:column;align-items:center;gap:14px}
.hero{margin-top:${story ? 90 : 34}px;font-size:${fs}px}
.en{margin-top:14px;font:400 26px Poppins;color:var(--bone-dim)}
.script-line{margin-top:${story ? 34 : 14}px;font-size:${story ? 84 : 70}px}
.when{margin-top:${story ? 80 : 36}px;display:flex;flex-direction:column;align-items:center;gap:6px}
.day{font:700 40px Chakra;letter-spacing:.2em;color:var(--bone)}
.time{font:700 ${story ? 150 : 124}px Chakra;line-height:1;color:var(--brass);text-shadow:0 4px 24px rgba(0,0,0,.7)}
.chan{margin-top:12px;font:600 28px Chakra;letter-spacing:.18em;border:2px solid rgba(239,230,212,.4);border-radius:12px;padding:8px 24px}
.promo{margin-top:${story ? 70 : 34}px}`
  const body = `
<div class="top">
  <span class="chip">${event.featured ? STAR : ''}${esc(event.featured ? 'Destacado' : SPORT_LABEL[event.sport] ?? 'Deportes')}</span>
  <span class="league">${esc(event.league)}</span>
</div>
<h1 class="display hero">${titleHtml(title)}</h1>
${en ? `<p class="en">${esc(en)}</p>` : ''}
<p class="script script-line">${esc(line.es)}</p>
<div class="when">
  <span class="tech day">${esc(fmtDay(event.kickoff))}</span>
  <span class="time">${esc(fmtTime(event.kickoff))}</span>
  ${event.channel ? `<span class="tech chan">${esc(event.channel)}</span>` : ''}
</div>
${promoText ? `<div class="promo ribbon">${esc(promoText)}</div>` : ''}`
  return wrap(size, css, body)
}

export function roundupFlyer(events, { rangeLabel, promoFor }, size = 'feed') {
  const story = size === 'story'
  const max = story ? 8 : 5
  const shown = events.slice(0, max)
  const rowH = story ? 150 : 122
  const css = `
.head{margin-top:${story ? 60 : 24}px}
.kicker{font:700 28px Chakra;letter-spacing:.3em;color:var(--brass);text-transform:uppercase}
.h{font-size:${story ? 96 : 72}px;margin-top:4px}
.sub{font-size:${story ? 78 : 56}px;margin-top:0}
.range{margin-top:10px;font:600 28px Chakra;letter-spacing:.2em;color:var(--bone-dim);text-transform:uppercase}
.list{margin-top:${story ? 50 : 22}px;width:100%;display:flex;flex-direction:column;gap:12px}
.item{display:flex;align-items:center;gap:26px;text-align:left;height:${rowH}px;padding:0 26px;border-radius:22px;background:linear-gradient(145deg,rgba(28,20,19,.92),rgba(10,7,6,.92));border:1px solid rgba(239,230,212,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.07)}
.item.feat{border-color:rgba(217,162,74,.7)}
.when{width:200px;flex:none;text-align:center;border-right:2px solid rgba(211,20,28,.8);padding-right:22px;white-space:nowrap}
.d{font:700 24px Chakra;letter-spacing:.14em;color:var(--bone-dim);text-transform:uppercase}
.t{font:700 46px Chakra;color:var(--brass);line-height:1.1}
.mid{flex:1;min-width:0}
.name{font:400 ${story ? 38 : 32}px Rye;text-transform:uppercase;line-height:1.08;color:var(--bone)}
.meta{margin-top:6px;font:600 23px Chakra;letter-spacing:.12em;text-transform:uppercase;color:var(--bone-dim)}
.meta .p{color:var(--ember-hot)}
.star-wrap{color:var(--brass);font-size:30px}`
  const rows = shown.map((e) => {
    const promo = promoFor(e)
    return `<div class="item${e.featured ? ' feat' : ''}">
  <div class="when"><div class="d">${esc(fmtShortDay(e.kickoff))}</div><div class="t">${esc(fmtShortTime(e.kickoff))}</div></div>
  <div class="mid"><div class="name">${esc(e.title.es)}</div>
  <div class="meta">${esc(e.league)}${e.channel ? ` · ${esc(e.channel)}` : ''}${promo ? ` · <span class="p">${esc(promo)}</span>` : ''}</div></div>
  ${e.featured ? `<span class="star-wrap">${STAR}</span>` : ''}
</div>`
  }).join('')
  const body = `
<div class="head">
  <p class="kicker">Esta semana en</p>
  <h1 class="display h">Ocho 80</h1>
  <p class="script sub">partidos en pantalla</p>
  <p class="range">${esc(rangeLabel)}</p>
</div>
<div class="list">${rows}</div>`
  return wrap(size, css, body)
}
