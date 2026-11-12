// HTML templates for Ocho 80 flyers. Pure functions: (data) -> full HTML string, rendered by scripts/build-flyers.js.
//
// Design system (keep it tight):
//   Fonts:  Rye (brand display, matches the logo) for names + "VS" only; Chakra Petch for everything else.
//   Color:  each side of a matchup takes its team's colors; Ocho 80 owns the frame — ink black, ember red, platinum silver (matches the logo's ribbon), bone.
//   Brand:  logo top-center, silver frame, ember seam, footer strip. The teams are the hero; Ocho 80 is the host.
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

// ---------- flags as backgrounds ----------
// Where the flag's recognisable part sits, as [x%, y%] of the flag image. The background is positioned so this point lands
// on the side's focal point, instead of cropping the flag to whatever slice happens to be in the middle.
const FLAG_FOCUS = {
  mx: [50, 50], // coat of arms
  jm: [50, 50], // gold saltire
  cz: [21, 50], // blue triangle
  nz: [76, 52], // Southern Cross
  us: [22, 27], // star canton
  fr: [50, 50],
  br: [50, 50], // globe
}

// ---------- shared css ----------
const CSS = ({ w, h }) => `
@font-face{font-family:Rye;src:url(${font('rye', 'rye-latin-400-normal.woff2')})}
@font-face{font-family:Chakra;font-weight:600;src:url(${font('chakra-petch', 'chakra-petch-latin-600-normal.woff2')})}
@font-face{font-family:Chakra;font-weight:700;src:url(${font('chakra-petch', 'chakra-petch-latin-700-normal.woff2')})}
:root{--ink:#0a0706;--ember:#d3141c;--ember-hot:#f0262e;--bone:#eeeeec;--bone-dim:#a8adb4;--silver:#c9cdd3;--silver-hi:#f4f6f8;--silver-lo:#8f959d;--metal:linear-gradient(180deg,#f7f9fb 0%,#d3d7dc 46%,#9ba1a9 54%,#e3e6ea 100%)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;background:var(--ink);color:var(--bone);font-family:Chakra,sans-serif;font-weight:600;overflow:hidden}
.flyer{position:relative;width:${w}px;height:${h}px;overflow:hidden;isolation:isolate}
.layer{position:absolute;inset:0}
.wood{background:url(${url('public/img/wood-wall.webp')}) center/900px;mix-blend-mode:overlay;opacity:.35;z-index:3;pointer-events:none}
.vignette{z-index:4;background:radial-gradient(120% 75% at 50% 45%,transparent 40%,rgba(5,3,2,.85) 100%),linear-gradient(180deg,rgba(5,3,2,.55),transparent 22%,transparent 55%,rgba(5,3,2,.97) 82%)}
.frame{position:absolute;inset:22px;z-index:20;border:3px solid var(--silver);border-radius:30px;box-shadow:inset 0 0 0 7px rgba(10,7,6,.6),inset 0 0 0 8px rgba(244,246,248,.22),0 0 18px rgba(201,205,211,.18);pointer-events:none}
.top{position:absolute;z-index:10;top:52px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:14px}
.logo{height:${h > 1500 ? 250 : 186}px;filter:drop-shadow(0 6px 20px rgba(0,0,0,.9))}
.label{font-weight:700;font-size:25px;letter-spacing:.32em;text-transform:uppercase;color:var(--bone);text-shadow:0 2px 10px #000}
.label .dot{color:var(--silver);margin:0 .5em}
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
// Shrinks any [data-fit] text until it fits its container, so long names never collide with flags or run off the flyer.
const FIT = `<script>
document.fonts.ready.then(function () {
  // Equalise logo weight: wide logos (Patriots, Chargers) and tall ones get the same visual area, within the column.
  document.querySelectorAll('.mark img').forEach(function (img) {
    function size() {
      var box = img.parentElement.clientWidth, r = img.naturalWidth / img.naturalHeight;
      if (!r) return;
      var area = box * box * 0.85, w = Math.sqrt(area * r), h = Math.sqrt(area / r);
      var k = Math.min(1, (box * 0.9) / w, (box * 1.1) / h);
      img.style.width = Math.round(w * k) + 'px'; img.style.height = Math.round(h * k) + 'px'; img.style.maxWidth = 'none'; img.style.maxHeight = 'none';
    }
    if (img.complete) size(); else img.addEventListener('load', size);
  });
  document.querySelectorAll('[data-fit]').forEach(function (box) {
    var target = box.querySelector('[data-fit-text]');
    var el = target || box;
    var size = parseFloat(getComputedStyle(el).fontSize);
    function tooWide() {
      if (!target) return box.scrollWidth > box.clientWidth + 1; // plain block: its own text overflows
      var gap = parseFloat(getComputedStyle(box).columnGap) || 0, used = gap * (box.children.length - 1);
      for (var i = 0; i < box.children.length; i++) used += box.children[i].getBoundingClientRect().width;
      return used > box.clientWidth - 8; // flex row: flag + name must fit with a margin
    }
    for (var n = 0; tooWide() && size > 14 && n < 80; n++) { size -= 2; el.style.fontSize = size + 'px'; }
  });
});
</script>`
const page = (size, css, body) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${CSS(SIZES[size])}${css}</style></head><body><div class="flyer">${body}<div class="frame"></div></div>${FIT}</body></html>`

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
  const D = story ? 100 : 62 // extra room taken by the larger logo
  const markSize = story ? 350 : 320
  const vsSize = story ? 190 : 172

  const sideBg = (p, v, side) => {
    const [c1, c2] = p.colors ?? ['#333', '#111']
    const poly = side === 'L' ? `0 0,${seamTop}% 0,${seamBottom}% 100%,0 100%` : `${seamTop}% 0,100% 0,100% 100%,${seamBottom}% 100%`
    const flagBg = (soft) => {
      const [fx, fy] = FLAG_FOCUS[p.flag] ?? [50, 50]
      const tx = soft ? (side === 'L' ? 0.26 : 0.74) * w : cx(side)
      const ty = soft ? 0.42 * h : 0.33 * h
      return `<img class="flagfill${soft ? ' flagsoft' : ''}" src="${v.flag}" alt="" style="left:${Math.round(tx)}px;top:${Math.round(ty)}px;height:${soft ? 760 : 980}px;transform:translate(-${fx}%,-${fy}%)">`
    }
    const big = v.flag && p.kind === 'country' ? flagBg(false)
      : v.logo ? `<img class="ghost ghost-${side}" src="${v.logo}" alt="">`
      : v.flag ? flagBg(true) : ''
    return `<div class="side" style="clip-path:polygon(${poly});background:linear-gradient(${side === 'L' ? '135deg' : '225deg'},${c1} 0%,${c1} 35%,${c2} 140%)">${big}<div class="shade-${side}"></div></div>`
  }

  const hero = (p, v, side) => {
    if (v.cut) return `<img class="cut cut-${side}" src="${v.cut}" alt="">`
    if (v.logo) return `<div class="mark mark-${side}"><img src="${v.logo}" alt=""></div>`
    if (v.flag && p.kind === 'country') return `<div class="mark mark-${side}"><div class="flagdisc" style="background-image:url('${v.flag}')"></div></div>`
    return `<div class="mark mark-${side}"><div class="mono rye" style="background:${p.colors?.[0] ?? '#333'}">${esc(initials(p))}</div></div>`
  }

  const name = (p, v, side) => `<div class="name name-${side}" data-fit>
    ${v.flag && p.kind === 'fighter' && side === 'L' ? `<img class="badge" src="${v.flag}" alt="">` : ''}
    <span class="rye nm" data-fit-text>${esc(p.short ?? p.name.es)}</span>
    ${v.flag && p.kind === 'fighter' && side === 'R' ? `<img class="badge" src="${v.flag}" alt="">` : ''}</div>`

  const cx = (side) => (side === 'L' ? 0.24 : 0.76) * w
  const cy = midY * h + D
  const nameY = cy + markSize / 2 + (story ? 70 : 30)
  const infoTop = (story ? 1430 : 990) + D * 0.8
  const cutH = story ? 960 : 640

  const css = `
.side{position:absolute;inset:0;z-index:0;overflow:hidden}
.flagfill{position:absolute;width:auto;max-width:none;opacity:.5;filter:saturate(1.15);-webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 14%,#000 62%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0%,#000 14%,#000 62%,transparent 100%)}
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
.vs{position:absolute;z-index:8;left:50%;top:${fighters ? (story ? 0.36 : 0.40) * h + D : cy}px;transform:translate(-50%,-50%);font-size:${vsSize}px;line-height:1;color:var(--bone);
  text-shadow:0 0 0 #000,6px 6px 0 var(--ember),0 0 60px rgba(240,38,46,.75),0 10px 40px rgba(0,0,0,.9);-webkit-text-stroke:3px #0a0706}
.name{position:absolute;z-index:9;top:${fighters ? infoTop - 120 : nameY}px;width:${w * (fighters ? 0.46 : 0.4)}px;padding:0 4px;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:14px}
.name-L{left:${fighters ? 40 : cx('L') - w * 0.2}px;${fighters ? 'justify-content:flex-start;' : ''}}
.name-R{left:${fighters ? w - 40 - w * 0.46 : cx('R') - w * 0.2}px;${fighters ? 'justify-content:flex-end;' : ''}}
.nm{font-size:${fighters ? 72 : 62}px;line-height:1;color:var(--bone);text-shadow:0 4px 0 rgba(0,0,0,.6),0 8px 30px rgba(0,0,0,.95);white-space:nowrap}
.badge{flex:none;height:42px;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.7);border:2px solid rgba(239,230,212,.7)}
.info{position:absolute;z-index:10;left:0;right:0;top:${infoTop}px;display:flex;flex-direction:column;align-items:center;gap:${story ? 22 : 14}px}
.when{display:flex;align-items:stretch;background:rgba(10,7,6,.82);border:2px solid rgba(201,205,211,.6);border-radius:22px;box-shadow:0 20px 50px rgba(0,0,0,.7);overflow:hidden}
.when > div{padding:${story ? '20px 36px' : '16px 30px'};display:flex;flex-direction:column;justify-content:center}
.day{border-right:2px solid rgba(201,205,211,.45);text-align:right}
.wd{font-weight:700;font-size:${story ? 34 : 30}px;letter-spacing:.2em;text-transform:uppercase;color:var(--bone)}
.dt{font-weight:600;font-size:${story ? 26 : 23}px;letter-spacing:.16em;text-transform:uppercase;color:var(--bone-dim)}
.time{font-weight:700;font-size:${story ? 96 : 84}px;line-height:1;color:var(--silver);background:var(--metal);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.chan{font-weight:700;font-size:22px;letter-spacing:.24em;text-transform:uppercase;color:var(--bone-dim)}
.chan b{color:var(--bone)}
`
  const label = `${esc(event.league)}`
  const body = `
${sideBg(A, va, 'L')}${sideBg(B, vb, 'R')}
<div class="seam"></div>
<div class="layer wood"></div><div class="layer vignette"></div>
<div class="top">${LOGO()}<span class="label">${label}</span></div>
${hero(A, va, 'L')}${hero(B, vb, 'R')}
<div class="vs rye">VS</div>
${name(A, va, 'L')}${name(B, vb, 'R')}
<div class="info">
  <div class="when"><div class="day"><span class="wd">${esc(fmtWeekday(event.kickoff))}</span><span class="dt">${esc(fmtDate(event.kickoff))}</span></div><div><span class="time">${esc(fmtTime(event.kickoff))}</span></div></div>
  <div class="chan">En vivo en Ocho 80</div>
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
.mid{position:absolute;z-index:10;left:70px;right:70px;top:${story ? 640 : 440}px;text-align:center}
.t{font-size:${fs}px;line-height:1.02;text-shadow:0 6px 0 rgba(0,0,0,.5),0 10px 40px #000}
.info{position:absolute;z-index:10;left:0;right:0;top:${story ? 1360 : 990}px;display:flex;flex-direction:column;align-items:center;gap:14px}
.wd{font-weight:700;font-size:34px;letter-spacing:.22em;text-transform:uppercase}
.time{font-weight:700;font-size:110px;line-height:1;color:var(--silver);background:var(--metal);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}`
  return page(size, css, `<div class="layer bg"></div><div class="layer wood"></div><div class="layer vignette"></div>
<div class="top">${LOGO()}<span class="label">${esc(event.league)}</span></div>
<div class="mid"><h1 class="rye t">${esc(t)}</h1></div>
<div class="info"><span class="wd">${esc(fmtWeekday(event.kickoff))} · ${esc(fmtDate(event.kickoff))}</span><span class="time">${esc(fmtTime(event.kickoff))}</span>${promo ? `<div class="ribbon">${esc(promo)}</div>` : ''}</div>${FOOTER()}`)
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
.head{position:absolute;z-index:10;top:44px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:10px}
.h1{font-size:${story ? 112 : 84}px;line-height:1;margin-top:2px;text-shadow:5px 5px 0 var(--ember),0 10px 40px rgba(0,0,0,.9);-webkit-text-stroke:2px #0a0706}
.range{font-weight:700;font-size:25px;letter-spacing:.3em;text-transform:uppercase;color:var(--silver)}
.list{position:absolute;z-index:10;left:60px;right:60px;top:${story ? 560 : 430}px;display:flex;flex-direction:column;gap:${story ? 22 : shown.length > 5 ? 10 : 16}px}
.row{height:${rowH}px;display:flex;align-items:center;gap:22px;padding:0 24px;border-radius:22px;background:linear-gradient(90deg,rgba(28,18,16,.94),rgba(12,8,7,.94));border:2px solid rgba(239,230,212,.12);box-shadow:0 14px 34px rgba(0,0,0,.55)}
.row.feat{border-color:rgba(201,205,211,.8);box-shadow:0 14px 34px rgba(0,0,0,.55),0 0 16px rgba(201,205,211,.16)}
.when{width:178px;flex:none;text-align:center;white-space:nowrap}
.d{font-weight:700;font-size:22px;letter-spacing:.16em;text-transform:uppercase;color:var(--bone-dim)}
.t{font-weight:700;font-size:42px;line-height:1.05;color:var(--silver);background:var(--metal);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.pair{flex:none;display:flex;align-items:center;gap:8px}
.chip{width:${rowH - 40}px;height:${rowH - 40}px;border-radius:50%;overflow:hidden;display:grid;place-items:center;border:3px solid rgba(239,230,212,.85);background:#222;box-shadow:0 6px 16px rgba(0,0,0,.6)}
.chip.logo{border:none;background:transparent;box-shadow:none;border-radius:0}
.chip.logo img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 4px 8px rgba(0,0,0,.7))}
.chip .face{width:100%;height:100%;object-fit:cover;object-position:50% 0}
.chip.mono{font-size:34px;color:var(--bone)}
.v{font-family:Rye,serif;font-size:24px;color:var(--ember-hot)}
.mid{flex:1;min-width:0}
.n{font-family:Rye,serif;font-size:${story ? 36 : 32}px;line-height:1.05;text-transform:uppercase;white-space:nowrap}
.m{margin-top:6px;font-weight:600;font-size:19px;letter-spacing:.14em;text-transform:uppercase;color:var(--bone-dim);white-space:nowrap}
.m .p{color:var(--ember-hot)}
.cta{position:absolute;z-index:10;left:0;right:0;bottom:${story ? 150 : 100}px;text-align:center;font-weight:700;font-size:24px;letter-spacing:.3em;text-transform:uppercase;color:var(--bone)}
.cta span{color:var(--silver)}`
  const rows = shown.map((e) => {
    const [A, B] = e.sides ?? []
    const promo = promoFor(e)
    const nm = A && B ? `${esc(A.short)} <span class="v">vs</span> ${esc(B.short)}` : esc(e.title.es)
    return `<div class="row${e.featured ? ' feat' : ''}">
  <div class="when"><div class="d">${esc(fmtShortDay(e.kickoff))}</div><div class="t">${esc(fmtTime(e.kickoff))}</div></div>
  ${A && B ? `<div class="pair">${chip(A)}${chip(B)}</div>` : ''}
  <div class="mid"><div class="n" data-fit>${nm}</div><div class="m" data-fit>${esc(e.league)}${promo ? ` · <span class="p">${esc(promo)}</span>` : ''}</div></div>
</div>`
  }).join('')
  const more = events.length - shown.length
  return page(size, css, `<div class="layer bg"></div><div class="layer wood"></div>
<div class="head">${LOGO()}<h1 class="rye h1">Esta semana</h1><span class="range">${esc(rangeLabel)}${pageLabel ? ` · ${esc(pageLabel)}` : ''}</span></div>
<div class="list">${rows}</div>
<div class="cta">${more > 0 ? `+${more} más · ` : ''}${last ? 'Desliza para ver cada partido' : 'Desliza, hay más partidos'} <span>→</span></div>
${FOOTER()}`)
}

