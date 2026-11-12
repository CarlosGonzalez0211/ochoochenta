// HTML templates for Ocho 80 flyers. Pure functions: (data) -> full HTML string, rendered by scripts/build-flyers.js.
//
// Design system (keep it tight):
//   Fonts:  Rye (brand display, matches the logo) for names + "VS" only; Chakra Petch for everything else.
//   Color:  each side of a matchup takes its team's colors; Ocho 80 owns the frame — ink black, ember red, brass, bone.
//   Brand:  logo top-center, brass frame, ember seam, footer strip. The teams are the hero; Ocho 80 is the host.
import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { CONTACT } from '../../src/data/contact.js'
import { VENUE_TZ } from '../../src/data/events/schema.js'

const abs = (p) => fileURLToPath(new URL(`../../${p}`, import.meta.url))
const url = (p) => pathToFileURL(abs(p)).href
const font = (pkg, file) => url(`node_modules/@fontsource/${pkg}/files/${file}`)

export const SIZES = { feed: { w: 1080, h: 1350 }, story: { w: 1080, h: 1920 } }

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

// ---------- dates (always Juárez time) ----------
const parts = (iso, o) => Object.fromEntries(new Intl.DateTimeFormat('es-MX', { ...o, timeZone: VENUE_TZ }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]))
export const fmtWeekday = (iso) => parts(iso, { weekday: 'long' }).weekday
export const fmtDate = (iso) => { const p = parts(iso, { day: 'numeric', month: 'long' }); return `${p.day} de ${p.month}` }
export const fmtShortDay = (iso) => { const p = parts(iso, { weekday: 'short', day: 'numeric', month: 'short' }); return `${p.weekday} ${p.day} ${p.month}`.replace(/\./g, '') }
export const fmtTime = (iso) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: VENUE_TZ }).format(new Date(iso))

// ---------- assets ----------
const ASSET_DIRS = ['flyers/assets/custom', 'flyers/assets/cache']
function findAsset(base) {
  for (const d of ASSET_DIRS) {
    if (!existsSync(abs(d))) continue
    const f = readdirSync(abs(d)).find((n) => n.replace(/\.[^.]+$/, '') === base)
    if (f) return url(`${d}/${f}`)
  }
  return null
}
/** Resolves what to draw for a participant: cutout (fighters), logo (teams), flag (countries / fighter badge). */
export function visual(p) {
  if (!p) return {}
  return {
    cut: p.kind === 'fighter' ? findAsset(`${p.slug}-cut`) : null,
    logo: p.kind === 'team' ? findAsset(p.slug) : null,
    flag: p.flag ? findAsset(`flag-${p.flag}`) : null,
  }
}

// ---------- shared css ----------
const CSS = ({ w, h }) => `
@font-face{font-family:Rye;src:url(${font('rye', 'rye-latin-400-normal.woff2')})}
@font-face{font-family:Chakra;font-weight:600;src:url(${font('chakra-petch', 'chakra-petch-latin-600-normal.woff2')})}
@font-face{font-family:Chakra;font-weight:700;src:url(${font('chakra-petch', 'chakra-petch-latin-700-normal.woff2')})}
:root{--ink:#0a0706;--ember:#d3141c;--ember-hot:#f0262e;--bone:#efe6d4;--bone-dim:#b9ad98;--brass:#d9a24a}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;background:var(--ink);color:var(--bone);font-family:Chakra,sans-serif;font-weight:600;overflow:hidden}
.flyer{position:relative;width:${w}px;height:${h}px;overflow:hidden;isolation:isolate}
.layer{position:absolute;inset:0}
.wood{background:url(${url('public/img/wood-wall.webp')}) center/900px;mix-blend-mode:overlay;opacity:.35;z-index:3;pointer-events:none}
.vignette{z-index:4;background:radial-gradient(120% 75% at 50% 45%,transparent 40%,rgba(5,3,2,.85) 100%),linear-gradient(180deg,rgba(5,3,2,.55),transparent 22%,transparent 55%,rgba(5,3,2,.97) 82%)}
.frame{position:absolute;inset:22px;z-index:20;border:3px solid var(--brass);border-radius:30px;box-shadow:inset 0 0 0 7px rgba(10,7,6,.6),inset 0 0 0 8px rgba(239,230,212,.18);pointer-events:none}
.top{position:absolute;z-index:10;top:52px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:14px}
.logo{height:118px;filter:drop-shadow(0 6px 20px rgba(0,0,0,.9))}
.label{font-weight:700;font-size:25px;letter-spacing:.32em;text-transform:uppercase;color:var(--bone);text-shadow:0 2px 10px #000}
.label .dot{color:var(--brass);margin:0 .5em}
.tag{display:inline-flex;align-items:center;gap:10px;background:var(--ember);color:#fff;font-weight:700;font-size:21px;letter-spacing:.24em;padding:7px 20px;border-radius:999px;text-transform:uppercase;box-shadow:0 6px 20px rgba(0,0,0,.6)}
.star{width:.95em;height:.95em;fill:currentColor}
.rye{font-family:Rye,Georgia,serif;font-weight:400;text-transform:uppercase}
.footer{position:absolute;z-index:10;left:50px;right:50px;bottom:50px;display:flex;justify-content:center;gap:22px;font-weight:600;font-size:18px;letter-spacing:.12em;color:var(--bone-dim);text-transform:uppercase;white-space:nowrap}
.footer b{color:var(--bone);font-weight:700}
.ribbon{background:var(--ember);color:#fff;font-weight:700;font-size:28px;letter-spacing:.14em;text-transform:uppercase;padding:12px 56px 12px 34px;clip-path:polygon(0 0,100% 0,95% 50%,100% 100%,0 100%)}
`
const STAR = '<svg class="star" viewBox="0 0 24 24"><path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9L12 2.6Z"/></svg>'
const LOGO = () => `<img class="logo" src="${url('public/img/logo.png')}" alt="Ocho 80">`
const FOOTER = () => `<div class="footer"><span><b>Ocho 80</b> · Av. Gómez Morín #680</span><span>${esc(CONTACT.phone)}</span><span>@${esc(CONTACT.instagram)}</span></div>`
const page = (size, css, body) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${CSS(SIZES[size])}${css}</style></head><body><div class="flyer">${body}<div class="frame"></div></div></body></html>`

const initials = (p) => (p?.short ?? '?').slice(0, 2)

// ---------- VS event flyer ----------
/**
 * @param event   events.json entry (with matchup resolved: event.sides = [participantA, participantB], each with .slug)
 * @param promo   approved promo text (es) or null
 */
export function eventFlyer(event, promo, size = 'feed') {
  const story = size === 'story'
  const { w, h } = SIZES[size]
  const [A, B] = event.sides ?? []
  if (!A || !B) return titleFlyer(event, promo, size)
  const va = visual(A), vb = visual(B)
  const fighters = A.kind === 'fighter' || B.kind === 'fighter'

  // geometry
  const seamTop = 56, seamBottom = 44 // % of width where the diagonal crosses top/bottom
  const midY = story ? 0.46 : 0.47
  const markSize = story ? 350 : 320
  const vsSize = story ? 210 : 190

  const sideBg = (p, v, side) => {
    const [c1, c2] = p.colors ?? ['#333', '#111']
    const poly = side === 'L' ? `0 0,${seamTop}% 0,${seamBottom}% 100%,0 100%` : `${seamTop}% 0,100% 0,100% 100%,${seamBottom}% 100%`
    const big = v.flag && p.kind === 'country'
      ? `<img class="flagfill" src="${v.flag}" alt="">`
      : v.logo ? `<img class="ghost ghost-${side}" src="${v.logo}" alt="">`
      : v.flag ? `<img class="flagfill flagsoft" src="${v.flag}" alt="">` : ''
    return `<div class="side" style="clip-path:polygon(${poly});background:linear-gradient(${side === 'L' ? '135deg' : '225deg'},${c1} 0%,${c1} 35%,${c2} 140%)">${big}<div class="shade-${side}"></div></div>`
  }

  const hero = (p, v, side) => {
    if (v.cut) return `<img class="cut cut-${side}" src="${v.cut}" alt="">`
    if (v.logo) return `<div class="mark mark-${side}"><img src="${v.logo}" alt=""></div>`
    if (v.flag && p.kind === 'country') return `<div class="mark mark-${side}"><div class="flagdisc" style="background-image:url('${v.flag}')"></div></div>`
    return `<div class="mark mark-${side}"><div class="mono rye" style="background:${p.colors?.[0] ?? '#333'}">${esc(initials(p))}</div></div>`
  }

  const name = (p, v, side) => `<div class="name name-${side}">
    ${v.flag && p.kind === 'fighter' ? `<img class="badge" src="${v.flag}" alt="">` : ''}
    <span class="rye nm">${esc(p.short ?? p.name.es)}</span></div>`

  const cx = (side) => (side === 'L' ? 0.22 : 0.78) * w
  const cy = midY * h
  const nameY = cy + markSize / 2 + (story ? 70 : 30)
  const infoTop = story ? 1430 : 990
  const cutH = story ? 1000 : 690

  const css = `
.side{position:absolute;inset:0;z-index:0;overflow:hidden}
.flagfill{position:absolute;inset:-6%;width:112%;height:112%;object-fit:cover;opacity:.55;filter:saturate(1.15)}
.flagsoft{opacity:.25}
.ghost{position:absolute;top:${story ? 18 : 10}%;width:${story ? 900 : 780}px;height:${story ? 900 : 780}px;object-fit:contain;opacity:.16;filter:grayscale(.2) brightness(1.4)}
.ghost-L{left:-${story ? 330 : 300}px;transform:rotate(-12deg)}
.ghost-R{right:-${story ? 330 : 300}px;transform:rotate(12deg)}
.shade-L,.shade-R{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.05) 40%,rgba(0,0,0,.55))}
.seam{position:absolute;inset:0;z-index:2;background:linear-gradient(90deg,transparent calc(50% - 5px),var(--ember) calc(50% - 5px),var(--ember-hot) 50%,var(--ember) calc(50% + 5px),transparent calc(50% + 5px));transform:skewX(${Math.atan(((seamTop - seamBottom) / 100 * w) / h) * -180 / Math.PI}deg);box-shadow:0 0 40px var(--ember);filter:drop-shadow(0 0 18px rgba(240,38,46,.8))}
.mark{position:absolute;z-index:6;width:${markSize}px;height:${markSize}px;display:grid;place-items:center;transform:translate(-50%,-50%)}
.mark img{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 18px 30px rgba(0,0,0,.75)) drop-shadow(0 0 2px rgba(255,255,255,.25))}
.mark-L{left:${cx('L')}px;top:${cy}px}.mark-R{left:${cx('R')}px;top:${cy}px}
.flagdisc{width:86%;height:86%;border-radius:50%;background-size:cover;background-position:center;border:8px solid var(--bone);box-shadow:0 18px 40px rgba(0,0,0,.75),inset 0 0 0 2px rgba(0,0,0,.2)}
.mono{width:86%;height:86%;border-radius:50%;display:grid;place-items:center;font-size:${markSize * 0.42}px;color:var(--bone);border:8px solid var(--bone);box-shadow:0 18px 40px rgba(0,0,0,.75)}
.cut{position:absolute;z-index:5;height:${cutH}px;bottom:${h - infoTop + 30}px;filter:drop-shadow(0 20px 40px rgba(0,0,0,.8));-webkit-mask-composite:source-in;mask-composite:intersect}
.cut-L{-webkit-mask-image:linear-gradient(180deg,#000 72%,transparent 98%),linear-gradient(270deg,transparent 0%,#000 22%);left:${story ? -40 : -30}px;max-width:${w * 0.62}px;object-fit:contain;object-position:bottom left}
.cut-R{-webkit-mask-image:linear-gradient(180deg,#000 72%,transparent 98%),linear-gradient(90deg,transparent 0%,#000 22%);right:${story ? -40 : -30}px;max-width:${w * 0.62}px;object-fit:contain;object-position:bottom right}
.vs{position:absolute;z-index:8;left:50%;top:${fighters ? (story ? 0.36 : 0.40) * h : cy}px;transform:translate(-50%,-50%);font-size:${vsSize}px;line-height:1;color:var(--bone);
  text-shadow:0 0 0 #000,6px 6px 0 var(--ember),0 0 60px rgba(240,38,46,.75),0 10px 40px rgba(0,0,0,.9);-webkit-text-stroke:3px #0a0706}
.name{position:absolute;z-index:9;top:${fighters ? infoTop - 120 : nameY}px;width:${w * 0.46}px;display:flex;align-items:center;justify-content:center;gap:14px}
.name-L{left:${fighters ? 40 : cx('L') - w * 0.23}px;${fighters ? 'justify-content:flex-start;' : ''}}
.name-R{left:${fighters ? w - 40 - w * 0.46 : cx('R') - w * 0.23}px;${fighters ? 'justify-content:flex-end;' : ''}}
.nm{font-size:${fighters ? 72 : 62}px;line-height:1;color:var(--bone);text-shadow:0 4px 0 rgba(0,0,0,.6),0 8px 30px rgba(0,0,0,.95);white-space:nowrap}
.badge{height:42px;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.7);border:2px solid rgba(239,230,212,.7)}
.info{position:absolute;z-index:10;left:0;right:0;top:${infoTop}px;display:flex;flex-direction:column;align-items:center;gap:${story ? 22 : 14}px}
.when{display:flex;align-items:stretch;background:rgba(10,7,6,.82);border:2px solid rgba(217,162,74,.6);border-radius:22px;box-shadow:0 20px 50px rgba(0,0,0,.7);overflow:hidden}
.when > div{padding:${story ? '20px 36px' : '16px 30px'};display:flex;flex-direction:column;justify-content:center}
.day{border-right:2px solid rgba(217,162,74,.45);text-align:right}
.wd{font-weight:700;font-size:${story ? 34 : 30}px;letter-spacing:.2em;text-transform:uppercase;color:var(--bone)}
.dt{font-weight:600;font-size:${story ? 26 : 23}px;letter-spacing:.16em;text-transform:uppercase;color:var(--bone-dim)}
.time{font-weight:700;font-size:${story ? 96 : 84}px;line-height:1;color:var(--brass)}
.chan{font-weight:700;font-size:22px;letter-spacing:.24em;text-transform:uppercase;color:var(--bone-dim)}
.chan b{color:var(--bone)}
`
  const label = `${esc(event.league)}`
  const body = `
${sideBg(A, va, 'L')}${sideBg(B, vb, 'R')}
<div class="seam"></div>
<div class="layer wood"></div><div class="layer vignette"></div>
<div class="top">${LOGO()}${event.featured ? `<span class="tag">${STAR} Partido destacado</span>` : ''}<span class="label">${label}</span></div>
${hero(A, va, 'L')}${hero(B, vb, 'R')}
<div class="vs rye">VS</div>
${name(A, va, 'L')}${name(B, vb, 'R')}
<div class="info">
  <div class="when"><div class="day"><span class="wd">${esc(fmtWeekday(event.kickoff))}</span><span class="dt">${esc(fmtDate(event.kickoff))}</span></div><div><span class="time">${esc(fmtTime(event.kickoff))}</span></div></div>
  ${event.channel ? `<div class="chan">En vivo en Ocho 80 · <b>${esc(event.channel)}</b></div>` : '<div class="chan">En vivo en Ocho 80</div>'}
  ${promo ? `<div class="ribbon">${esc(promo)}</div>` : ''}
</div>
${FOOTER()}`
  return page(size, css, body)
}

/** Fallback for events without a matchup (e.g. a full fight card or a draft): big title on the Ocho 80 palette. */
function titleFlyer(event, promo, size) {
  const story = size === 'story'
  const t = event.title.es
  const fs = t.length < 16 ? 130 : t.length < 28 ? 100 : 78
  const css = `
.bg{z-index:0;background:radial-gradient(70% 50% at 50% 42%,rgba(211,20,28,.55),transparent 70%),#140a08}
.mid{position:absolute;z-index:10;left:70px;right:70px;top:${story ? 520 : 360}px;text-align:center}
.t{font-size:${fs}px;line-height:1.02;text-shadow:0 6px 0 rgba(0,0,0,.5),0 10px 40px #000}
.info{position:absolute;z-index:10;left:0;right:0;top:${story ? 1240 : 900}px;display:flex;flex-direction:column;align-items:center;gap:14px}
.wd{font-weight:700;font-size:34px;letter-spacing:.22em;text-transform:uppercase}
.time{font-weight:700;font-size:110px;line-height:1;color:var(--brass)}`
  return page(size, css, `<div class="layer bg"></div><div class="layer wood"></div><div class="layer vignette"></div>
<div class="top">${LOGO()}<span class="label">${esc(event.league)}</span></div>
<div class="mid"><h1 class="rye t">${esc(t)}</h1></div>
<div class="info"><span class="wd">${esc(fmtWeekday(event.kickoff))} · ${esc(fmtDate(event.kickoff))}</span><span class="time">${esc(fmtTime(event.kickoff))}</span>${event.channel ? `<span class="label">${esc(event.channel)}</span>` : ''}${promo ? `<div class="ribbon">${esc(promo)}</div>` : ''}</div>${FOOTER()}`)
}

// ---------- weekly roundup ("Esta semana") ----------
export function roundupFlyer(events, { rangeLabel, promoFor, pageLabel = '', last = true }, size = 'feed') {
  const story = size === 'story'
  const { h } = SIZES[size]
  const shown = events.slice(0, story ? 8 : 6)
  const rowH = story ? 142 : shown.length > 5 ? 112 : 130
  const chip = (p) => {
    if (!p) return '<span class="chip"></span>'
    const v = visual(p)
    if (v.cut) return `<span class="chip" style="background:${p.colors?.[0]}"><img class="face" src="${v.cut}" alt=""></span>`
    if (v.logo) return `<span class="chip logo"><img src="${v.logo}" alt=""></span>`
    if (v.flag) return `<span class="chip" style="background-image:url('${v.flag}');background-size:cover;background-position:center"></span>`
    return `<span class="chip rye mono" style="background:${p.colors?.[0]}">${esc(initials(p))}</span>`
  }
  const css = `
.bg{z-index:0;background:radial-gradient(80% 45% at 50% 18%,rgba(211,20,28,.5),transparent 70%),linear-gradient(180deg,#1a0c09,#0a0706)}
.head{position:absolute;z-index:10;top:50px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:10px}
.h1{font-size:${story ? 112 : 92}px;line-height:1;margin-top:8px;text-shadow:5px 5px 0 var(--ember),0 10px 40px rgba(0,0,0,.9);-webkit-text-stroke:2px #0a0706}
.range{font-weight:700;font-size:25px;letter-spacing:.3em;text-transform:uppercase;color:var(--brass)}
.list{position:absolute;z-index:10;left:60px;right:60px;top:${story ? 470 : 395}px;display:flex;flex-direction:column;gap:${story ? 22 : shown.length > 5 ? 12 : 16}px}
.row{height:${rowH}px;display:flex;align-items:center;gap:22px;padding:0 24px;border-radius:22px;background:linear-gradient(90deg,rgba(28,18,16,.94),rgba(12,8,7,.94));border:2px solid rgba(239,230,212,.12);box-shadow:0 14px 34px rgba(0,0,0,.55)}
.row.feat{border-color:rgba(217,162,74,.75)}
.when{width:178px;flex:none;text-align:center;white-space:nowrap}
.d{font-weight:700;font-size:22px;letter-spacing:.16em;text-transform:uppercase;color:var(--bone-dim)}
.t{font-weight:700;font-size:42px;line-height:1.05;color:var(--brass)}
.pair{flex:none;display:flex;align-items:center;gap:8px}
.chip{width:${rowH - 40}px;height:${rowH - 40}px;border-radius:50%;overflow:hidden;display:grid;place-items:center;border:3px solid rgba(239,230,212,.85);background:#222;box-shadow:0 6px 16px rgba(0,0,0,.6)}
.chip.logo{border:none;background:transparent;box-shadow:none;border-radius:0}
.chip.logo img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 4px 8px rgba(0,0,0,.7))}
.chip .face{width:100%;height:100%;object-fit:cover;object-position:50% 0}
.chip.mono{font-size:34px;color:var(--bone)}
.v{font-family:Rye,serif;font-size:24px;color:var(--ember-hot)}
.mid{flex:1;min-width:0}
.n{font-family:Rye,serif;font-size:${story ? 36 : 32}px;line-height:1.05;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.m{margin-top:6px;font-weight:600;font-size:19px;letter-spacing:.14em;text-transform:uppercase;color:var(--bone-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.m .p{color:var(--ember-hot)}
.cta{position:absolute;z-index:10;left:0;right:0;bottom:${story ? 150 : 108}px;text-align:center;font-weight:700;font-size:24px;letter-spacing:.3em;text-transform:uppercase;color:var(--bone)}
.cta span{color:var(--brass)}`
  const rows = shown.map((e) => {
    const [A, B] = e.sides ?? []
    const promo = promoFor(e)
    const nm = A && B ? `${esc(A.short)} <span class="v">vs</span> ${esc(B.short)}` : esc(e.title.es)
    return `<div class="row${e.featured ? ' feat' : ''}">
  <div class="when"><div class="d">${esc(fmtShortDay(e.kickoff))}</div><div class="t">${esc(fmtTime(e.kickoff))}</div></div>
  ${A && B ? `<div class="pair">${chip(A)}${chip(B)}</div>` : ''}
  <div class="mid"><div class="n">${nm}</div><div class="m">${esc(e.league)}${e.channel ? ` · ${esc(e.channel)}` : ''}${promo ? ` · <span class="p">${esc(promo)}</span>` : ''}</div></div>
</div>`
  }).join('')
  const more = events.length - shown.length
  return page(size, css, `<div class="layer bg"></div><div class="layer wood"></div>
<div class="head">${LOGO()}<h1 class="rye h1">Esta semana</h1><span class="range">${esc(rangeLabel)}${pageLabel ? ` · ${esc(pageLabel)}` : ''}</span></div>
<div class="list">${rows}</div>
<div class="cta">${more > 0 ? `+${more} más · ` : ''}${last ? 'Desliza para ver cada partido' : 'Desliza, hay más partidos'} <span>→</span></div>
${FOOTER()}`)
}

