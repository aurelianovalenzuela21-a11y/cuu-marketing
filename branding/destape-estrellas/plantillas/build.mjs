// Genera el kit de marca de "El Destape de las Estrellas":
// logos (SVG + PNG) y piezas para Instagram, TikTok y Facebook.
// Uso: npm install && npm run build
// Para cambiar textos (fecha, lugar, nombres) edita CONFIG y vuelve a correr.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = path.join(ROOT, 'fuentes');
const out = (...p) => path.join(ROOT, ...p);

// ------------------------------------------------------------------
// CONFIG — textos editables
// ------------------------------------------------------------------
const CONFIG = {
  fecha: 'SÁBADO 00 · NOVIEMBRE',
  hora: '8:00 PM',
  lugar: 'NOMBRE DEL LUGAR · CHIHUAHUA',
  handle: '@eldestapedelasestrellas',
  cta: 'APARTA TU LUGAR',
  estrella: { nombre: 'NOMBRE DE LA ESTRELLA', categoria: 'CATEGORÍA · TALENTO' },
  episodio: { numero: 'EPISODIO 01', titulo: 'LA PRIMERA ESTRELLA' },
  cuentaRegresiva: 7,
};

// ------------------------------------------------------------------
// PALETA
// ------------------------------------------------------------------
export const PALETA = {
  oro: '#D4AF37',        // Oro 24K — color principal
  oroClaro: '#F2D27A',   // Oro brillo — luces y realces
  champagne: '#FFF0B3',  // Champagne — destellos
  oroViejo: '#A57A1E',   // Oro viejo — sombras del metal
  bronce: '#5C4310',     // Bronce profundo — fondos cálidos
  noche: '#0B0A08',      // Negro noche — fondo principal
  marfil: '#FFF8E7',     // Marfil — texto sobre negro
};

const GOLD_STOPS = [
  [0, '#FFF3C4'], [0.22, '#F2D27A'], [0.48, '#C9992E'],
  [0.52, '#A57A1E'], [0.75, '#E6C35C'], [1, '#FFF0B3'],
];
const GOLD_CSS = `linear-gradient(180deg, ${GOLD_STOPS.map(([o, c]) => `${c} ${o * 100}%`).join(', ')})`;

// ------------------------------------------------------------------
// TIPOGRAFÍA → TRAZOS (para logos sin dependencia de fuentes)
// ------------------------------------------------------------------
const font = (f) => opentype.loadSync(path.join(FONTS, f));
const F = {
  cinzelBlack: font('Cinzel-Black.ttf'),
  cinzelBold: font('Cinzel-Bold.ttf'),
  cormorant: font('CormorantGaramond-SemiBoldItalic.ttf'),
  montserrat: font('Montserrat-SemiBold.ttf'),
};

// Devuelve { d, x1, y1, x2, y2 } de un texto con tracking (em).
function textPath(f, text, size, tracking = 0) {
  const scale = size / f.unitsPerEm;
  const p = new opentype.Path();
  let x = 0;
  const glyphs = f.stringToGlyphs(text);
  glyphs.forEach((g, i) => {
    p.extend(g.getPath(x, 0, size));
    x += g.advanceWidth * scale;
    if (i < glyphs.length - 1) {
      x += f.getKerningValue(g, glyphs[i + 1]) * scale + tracking * size;
    }
  });
  const bb = p.getBoundingBox();
  return { d: p.toPathData(2), ...bb };
}

// Coloca un texto con su caja superior en `top`, centrado en cx (o alineado a la izquierda en x)
function placeText(f, text, { size, tracking = 0, top, cx, left, width }) {
  let t = textPath(f, text, size, tracking);
  if (width) {
    const s = width / (t.x2 - t.x1);
    t = textPath(f, text, size * s, tracking);
  }
  const w = t.x2 - t.x1, h = t.y2 - t.y1;
  const tx = (left ?? cx - w / 2) - t.x1;
  const ty = top - t.y1;
  return { svg: `<path transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)})" d="${t.d}"/>`, w, h, bottom: top + h, left: left ?? cx - w / 2 };
}

// ------------------------------------------------------------------
// FORMAS
// ------------------------------------------------------------------
const star4 = (cx, cy, R, k = 0.16, rot = 0) => {
  const pts = [];
  for (let i = 0; i < 4; i++) {
    const a = (rot + i * 90 - 90) * Math.PI / 180;
    const b = a + Math.PI / 4;
    pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)], [cx + R * k * Math.cos(b), cy + R * k * Math.sin(b)]);
  }
  // curvas cóncavas entre puntas
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < 8; i += 2) {
    const ctrl = pts[i + 1], next = pts[(i + 2) % 8];
    d += ` Q${ctrl[0].toFixed(2)} ${ctrl[1].toFixed(2)} ${next[0].toFixed(2)} ${next[1].toFixed(2)}`;
  }
  return d + 'Z';
};

const star5 = (cx, cy, R, r = R * 0.42) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r : R;
    const a = (i * 36 - 90) * Math.PI / 180;
    d += `${i ? 'L' : 'M'}${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`;
  }
  return d + 'Z';
};

const goldDefs = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${GOLD_STOPS.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;

// Isotipo: medallón con estrella de destape y rayos. Centro (0,0), radio 100.
function isotipoInner(paint) {
  const rays = [];
  for (let i = 0; i < 48; i++) {
    const a = (i * 7.5) * Math.PI / 180;
    const r2 = i % 2 ? 72 : 84;
    rays.push(`M${(44 * Math.cos(a)).toFixed(2)} ${(44 * Math.sin(a)).toFixed(2)}L${(r2 * Math.cos(a)).toFixed(2)} ${(r2 * Math.sin(a)).toFixed(2)}`);
  }
  return `
    <circle r="96" fill="none" stroke="${paint}" stroke-width="3"/>
    <circle r="89" fill="none" stroke="${paint}" stroke-width="1.2"/>
    <path d="${rays.join('')}" stroke="${paint}" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>
    <path d="${star4(0, 0, 40, 0.2, 45)}" fill="${paint}" opacity=".55"/>
    <path d="${star4(0, 0, 70, 0.15)}" fill="${paint}"/>
    <path d="${star4(-52, -50, 11, 0.18)}" fill="${paint}"/>
    <path d="${star4(54, 48, 8, 0.18)}" fill="${paint}"/>
    <path d="${star4(58, -40, 5, 0.2)}" fill="${paint}"/>`;
}

function paintFor(variant, id) {
  if (variant === 'oro') return { defs: goldDefs(id), paint: `url(#${id})` };
  return { defs: '', paint: variant };
}

function svgIsotipo(variant = 'oro', id = 'oroIso') {
  const { defs, paint } = paintFor(variant, id);
  // gradiente en unidades de usuario para que todo el medallón comparta el brillo
  const d = defs.replace('x1="0" y1="0" x2="0" y2="1"', 'gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="0" y2="100"');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200"><defs>${d}</defs><g>${isotipoInner(paint)}</g></svg>`;
}

function svgLogoVertical(variant = 'oro', id = 'oroLogo') {
  const { paint } = paintFor(variant, id);
  const W = 1000, cx = 500, wordW = 820;
  const l1 = placeText(F.cinzelBlack, 'EL DESTAPE', { size: 100, tracking: 0.06, top: 330, cx, width: wordW });
  const l2 = placeText(F.cormorant, 'de las', { size: 76, top: l1.bottom + 30, cx });
  const l3 = placeText(F.cinzelBlack, 'ESTRELLAS', { size: 100, tracking: 0.06, top: l2.bottom + 30, cx, width: wordW });
  const midY = l2.bottom - l2.h * 0.42;
  const gap = 34, lineL = (wordW - l2.w) / 2 - gap;
  const lines = `<path d="M${cx - wordW / 2} ${midY}h${lineL}M${cx + l2.w / 2 + gap} ${midY}h${lineL}" stroke="${variant === 'oro' ? PALETA.oro : paint}" stroke-width="3"/>
    <path d="${star4(cx - wordW / 2, midY, 12, 0.2)}${star4(cx + wordW / 2, midY, 12, 0.2)}" fill="${paint}"/>`;
  const H = Math.ceil(l3.bottom + 40);
  const grad = variant === 'oro'
    ? goldDefs(id)
      + goldDefs(id + 'I').replace('x1="0" y1="0" x2="0" y2="1"', 'gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="0" y2="100"')
    : '';
  const isoPaint = variant === 'oro' ? `url(#${id}I)` : paint;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs>${grad}</defs>
  <g transform="translate(${cx} 160) scale(1.45)">${isotipoInner(isoPaint)}</g>
  <g fill="${paint}">${l1.svg}${l2.svg}${l3.svg}</g>${lines}</svg>`;
}

function svgLogoHorizontal(variant = 'oro', id = 'oroLogoH') {
  const { paint } = paintFor(variant, id);
  const isoR = 150, left = isoR * 2 + 70, wordW = 760;
  const l1 = placeText(F.cinzelBlack, 'EL DESTAPE', { size: 100, tracking: 0.06, top: 40, left, width: wordW });
  const l2 = placeText(F.cormorant, 'de las', { size: 62, top: l1.bottom + 20, cx: left + wordW / 2 });
  const l3 = placeText(F.cinzelBlack, 'ESTRELLAS', { size: 100, tracking: 0.06, top: l2.bottom + 20, left, width: wordW });
  const midY = l2.bottom - l2.h * 0.42, gap = 28, lineL = (wordW - l2.w) / 2 - gap;
  const H = Math.ceil(l3.bottom + 40), W = left + wordW + 20;
  const cy = H / 2;
  const grad = variant === 'oro'
    ? goldDefs(id)
      + goldDefs(id + 'I').replace('x1="0" y1="0" x2="0" y2="1"', 'gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="0" y2="100"')
    : '';
  const isoPaint = variant === 'oro' ? `url(#${id}I)` : paint;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs>${grad}</defs>
  <g transform="translate(${isoR + 10} ${cy}) scale(${isoR / 100})">${isotipoInner(isoPaint)}</g>
  <g fill="${paint}">${l1.svg}${l2.svg}${l3.svg}</g>
  <path d="M${left} ${midY}h${lineL}M${left + wordW / 2 + l2.w / 2 + gap} ${midY}h${lineL}" stroke="${variant === 'oro' ? PALETA.oro : paint}" stroke-width="3"/></svg>`;
}

// ------------------------------------------------------------------
// ICONOS para portadas de destacadas (trazo, caja 200x200)
// ------------------------------------------------------------------
const ICONOS = {
  evento: `<path d="${star4(100, 100, 70, 0.16)}" fill="none"/><path d="${star4(150, 46, 14, 0.2)}" fill="none"/>`,
  estrellas: `<path d="${star5(100, 108, 72)}" fill="none" stroke-linejoin="round"/>`,
  boletos: `<path d="M30 60h140v26a16 16 0 0 0 0 32v26H30v-26a16 16 0 0 0 0-32z" fill="none" stroke-linejoin="round"/><path d="M120 64v80" stroke-dasharray="8 10"/><path d="${star5(76, 103, 18)}" fill="none"/>`,
  backstage: `<rect x="34" y="78" width="132" height="86" rx="6" fill="none"/><path d="M34 78 L46 38 L164 54 L166 78" fill="none" stroke-linejoin="round"/><path d="M70 43l-10 33M104 47l-10 33M138 51l-10 30"/>`,
  ubicacion: `<path d="M100 172s-54-58-54-96a54 54 0 0 1 108 0c0 38-54 96-54 96z" fill="none" stroke-linejoin="round"/><path d="${star4(100, 76, 22, 0.2)}" fill="none"/>`,
  fecha: `<rect x="36" y="48" width="128" height="116" rx="10" fill="none"/><path d="M36 84h128M70 34v28M130 34v28"/><path d="${star5(100, 124, 22)}" fill="none"/>`,
};

// ------------------------------------------------------------------
// FONDOS Y PIEZAS HTML
// ------------------------------------------------------------------
const fontFace = [
  ['Cinzel', 'Cinzel-Medium.ttf', 500, 'normal'], ['Cinzel', 'Cinzel-Bold.ttf', 700, 'normal'], ['Cinzel', 'Cinzel-Black.ttf', 900, 'normal'],
  ['Cormorant', 'CormorantGaramond-MediumItalic.ttf', 500, 'italic'], ['Cormorant', 'CormorantGaramond-SemiBoldItalic.ttf', 600, 'italic'],
  ['Montserrat', 'Montserrat-Regular.ttf', 400, 'normal'], ['Montserrat', 'Montserrat-Medium.ttf', 500, 'normal'],
  ['Montserrat', 'Montserrat-SemiBold.ttf', 600, 'normal'], ['Montserrat', 'Montserrat-Bold.ttf', 700, 'normal'],
].map(([fam, file, w, s]) => `@font-face{font-family:'${fam}';src:url(data:font/ttf;base64,${fs.readFileSync(path.join(FONTS, file)).toString('base64')});font-weight:${w};font-style:${s}}`).join('\n');

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function particles(w, h, seed, n) {
  const r = rng(seed);
  let dots = '', sparks = '';
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = r() * h, o = 0.15 + r() * 0.6;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.6 + r() * 2.2).toFixed(2)}" fill="#F2D27A" opacity="${o.toFixed(2)}"/>`;
  }
  for (let i = 0; i < Math.round(n / 14); i++) {
    const x = r() * w, y = r() * h;
    sparks += `<path d="${star4(x, y, 6 + r() * 14, 0.14)}" fill="#FFF0B3" opacity="${(0.3 + r() * 0.6).toFixed(2)}"/>`;
  }
  return `<svg class="layer" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${dots}${sparks}</svg>`;
}

function background(w, h, { seed = 1, glowY = 38, frame = true, density = 1 } = {}) {
  const inset = Math.round(Math.min(w, h) * 0.035);
  return `
  <div class="layer" style="background:radial-gradient(ellipse 75% 60% at 50% ${glowY}%, #3a2a0a 0%, #1a1306 40%, #0B0A08 78%)"></div>
  <div class="layer" style="background:repeating-conic-gradient(from 0deg at 50% -8%, rgba(255,220,130,.06) 0deg 1.6deg, transparent 1.6deg 7deg);-webkit-mask:radial-gradient(ellipse 80% 75% at 50% 0%, #000 0%, transparent 75%)"></div>
  ${particles(w, h, seed, Math.round((w * h) / 9000 * density))}
  ${frame ? `<div class="layer" style="inset:${inset}px;border:2px solid rgba(212,175,55,.65)"></div>
  <div class="layer" style="inset:${inset + 12}px;border:1px solid rgba(212,175,55,.3)"></div>` : ''}`;
}

const baseCSS = `
${fontFace}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:transparent}
.canvas{position:relative;overflow:hidden;color:${PALETA.marfil};font-family:'Montserrat',sans-serif}
.layer{position:absolute;inset:0;pointer-events:none}
.center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.gold{background:${GOLD_CSS};-webkit-background-clip:text;background-clip:text;color:transparent}
.glow{filter:drop-shadow(0 0 28px rgba(212,175,55,.35))}
.cinzel{font-family:'Cinzel',serif;font-weight:900;letter-spacing:.06em;line-height:1}
.serif{font-family:'Cormorant',serif;font-style:italic;font-weight:600}
.kicker{font-family:'Montserrat';font-weight:600;letter-spacing:.42em;text-transform:uppercase;color:${PALETA.oroClaro}}
.rule{display:flex;align-items:center;gap:22px;color:${PALETA.oro}}
.rule::before,.rule::after{content:'';height:2px;width:var(--rw,120px);background:linear-gradient(90deg,transparent,${PALETA.oro})}
.rule::after{transform:scaleX(-1)}
.btn{display:inline-block;padding:.9em 2.2em;border:2px solid ${PALETA.oro};font-weight:700;letter-spacing:.3em;color:${PALETA.noche};background:${GOLD_CSS};box-shadow:0 0 40px rgba(212,175,55,.35)}
.logo svg{display:block;width:100%;height:auto}
.logo{filter:drop-shadow(0 0 30px rgba(212,175,55,.3))}
`;

const page = (w, h, body, extraCSS = '') => `<!doctype html><html><head><meta charset="utf-8"><style>${baseCSS}${extraCSS}
.canvas{width:${w}px;height:${h}px}</style></head><body><div class="canvas">${body}</div></body></html>`;

let uid = 0;
const logoV = (width) => `<div class="logo" style="width:${width}px">${svgLogoVertical('oro', 'g' + uid++)}</div>`;
const logoH = (width) => `<div class="logo" style="width:${width}px">${svgLogoHorizontal('oro', 'g' + uid++)}</div>`;
const iso = (size) => `<div class="logo" style="width:${size}px">${svgIsotipo('oro', 'g' + uid++)}</div>`;

// ---------------- Piezas ----------------
const piezas = [];
const add = (file, w, h, body, opts = {}) => piezas.push({ file, w, h, html: page(w, h, body, opts.css), transparent: !!opts.transparent });

// Avatar de perfil (sirve para IG, TikTok y FB; recorte circular)
const avatar = (seed) => `${background(1080, 1080, { seed, frame: false, glowY: 50, density: .6 })}
  <div class="layer" style="inset:70px;border-radius:50%;border:3px solid rgba(212,175,55,.5)"></div>
  <div class="center">${iso(760)}</div>`;
add('instagram/ig-perfil-1080x1080.png', 1080, 1080, avatar(11));
add('tiktok/tt-perfil-1080x1080.png', 1080, 1080, avatar(11));
add('facebook/fb-perfil-1080x1080.png', 1080, 1080, avatar(11));

// --- INSTAGRAM ---
add('instagram/ig-post-teaser-1080x1080.png', 1080, 1080, `${background(1080, 1080, { seed: 21 })}
  <div class="center" style="gap:46px">
    <div class="kicker" style="font-size:24px">Algo brilla en camino</div>
    ${logoV(640)}
    <div class="rule" style="--rw:150px;font:600 30px 'Montserrat';letter-spacing:.5em">PRÓXIMAMENTE</div>
  </div>`);

add('instagram/ig-post-anuncio-1080x1350.png', 1080, 1350, `${background(1080, 1350, { seed: 22 })}
  <div class="center" style="gap:44px;padding-top:20px">
    <div class="kicker" style="font-size:24px">Una noche · Muchas estrellas</div>
    ${logoV(700)}
    <div style="display:flex;flex-direction:column;gap:14px;align-items:center">
      <div class="cinzel gold" style="font-size:52px;font-weight:700">${CONFIG.fecha}</div>
      <div style="font:500 28px 'Montserrat';letter-spacing:.3em;color:${PALETA.marfil}">${CONFIG.hora}</div>
      <div style="font:500 26px 'Montserrat';letter-spacing:.25em;color:${PALETA.oroClaro}">${CONFIG.lugar}</div>
    </div>
    <div class="btn" style="font-size:26px">${CONFIG.cta}</div>
  </div>`);

const ARCO = 'M190 970V500A350 350 0 0 1 890 500V970Z';
const mascaraArco = `url('data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350"><path fill-rule="evenodd" d="M0 0H1080V1350H0Z${ARCO}"/></svg>`)}')`;
const estrella = (transparentWindow) => `
  <div class="layer" style="${transparentWindow ? `-webkit-mask:${mascaraArco}` : ''}">${background(1080, 1350, { seed: 23 })}</div>
  <svg class="layer" width="1080" height="1350" viewBox="0 0 1080 1350">
    ${transparentWindow ? '' : `<defs><radialGradient id="ph" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#2e2410"/><stop offset="1" stop-color="#0f0c06"/></radialGradient></defs><path d="${ARCO}" fill="url(#ph)"/>
      <path d="${star5(540, 560, 80)}" fill="none" stroke="${PALETA.oro}" stroke-width="5" stroke-linejoin="round" opacity=".6"/>
      <text x="540" y="700" text-anchor="middle" style="font:600 24px Montserrat;letter-spacing:.4em" fill="rgba(242,210,122,.6)">FOTO AQUÍ</text>`}
    <path d="${ARCO}" fill="none" stroke="${PALETA.oro}" stroke-width="5"/>
    <path d="M172 988V500A368 368 0 0 1 908 500V988Z" fill="none" stroke="rgba(212,175,55,.4)" stroke-width="1.5"/>
  </svg>
  <div class="layer" style="top:118px;display:flex;justify-content:center;height:60px"><div style="padding:12px 30px;background:${PALETA.noche};border:2px solid ${PALETA.oro}" class="kicker"><span style="font-size:22px">La estrella revelada</span></div></div>
  <div class="layer" style="top:1020px;display:flex;flex-direction:column;align-items:center;gap:18px">
    <div class="cinzel gold glow" style="font-size:54px;max-width:900px">${CONFIG.estrella.nombre}</div>
    <div class="rule" style="--rw:110px;font:600 24px 'Montserrat';letter-spacing:.35em">${CONFIG.estrella.categoria}</div>
    <div style="margin-top:14px">${logoH(340)}</div>
  </div>`;
add('instagram/ig-post-estrella-revelada-1080x1350.png', 1080, 1350, estrella(false));
// Marco con ventana transparente: coloca la foto en una capa debajo (Canva / CapCut / Photoshop)
add('instagram/ig-marco-estrella-transparente-1080x1350.png', 1080, 1350, estrella(true), { transparent: true });

const historia = (body, seed) => `${background(1080, 1920, { seed })}${body}`;
add('instagram/ig-historia-anuncio-1080x1920.png', 1080, 1920, historia(`
  <div class="center" style="gap:60px">
    <div class="kicker" style="font-size:28px">Una noche · Muchas estrellas</div>
    ${logoV(820)}
    <div style="display:flex;flex-direction:column;gap:18px;align-items:center">
      <div class="cinzel gold" style="font-size:60px;font-weight:700">${CONFIG.fecha}</div>
      <div style="font:500 32px 'Montserrat';letter-spacing:.3em">${CONFIG.hora}</div>
      <div style="font:500 30px 'Montserrat';letter-spacing:.25em;color:${PALETA.oroClaro}">${CONFIG.lugar}</div>
    </div>
    <div class="btn" style="font-size:30px">${CONFIG.cta}</div>
  </div>`, 31));

add('instagram/ig-historia-cuenta-regresiva-1080x1920.png', 1080, 1920, historia(`
  <div class="center" style="gap:30px">
    ${logoH(700)}
    <div class="kicker" style="font-size:34px;margin-top:120px">Faltan</div>
    <div class="cinzel gold glow" style="font-size:520px;line-height:.9">${CONFIG.cuentaRegresiva}</div>
    <div class="cinzel gold" style="font-size:96px">DÍAS</div>
    <div class="rule" style="--rw:140px;font:600 30px 'Montserrat';letter-spacing:.35em;margin-top:60px">${CONFIG.fecha}</div>
  </div>`, 32));

// Portadas de historias destacadas
for (const [name, icon] of Object.entries(ICONOS)) {
  add(`instagram/destacadas/ig-destacada-${name}.png`, 1080, 1920, `${background(1080, 1920, { seed: 40 + name.length, frame: false, glowY: 50, density: .5 })}
    <div class="center"><div style="width:600px;height:600px;border-radius:50%;border:3px solid rgba(212,175,55,.55);display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,#2a1f08,transparent 70%)">
      <svg width="360" height="360" viewBox="0 0 200 200" fill="none" stroke="url(#gi)" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 18px rgba(212,175,55,.45))">
        <defs>${goldDefs('gi').replace('x1="0" y1="0" x2="0" y2="1"', 'gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="180"')}</defs>${icon}</svg>
    </div></div>`);
}

// --- TIKTOK ---
add('tiktok/tt-portada-video-1080x1920.png', 1080, 1920, historia(`
  <div class="layer" style="top:260px;display:flex;justify-content:center">${logoH(640)}</div>
  <div class="center" style="gap:34px;padding-bottom:120px">
    <div class="rule" style="--rw:120px;font:700 34px 'Montserrat';letter-spacing:.4em">${CONFIG.episodio.numero}</div>
    <div class="cinzel gold glow" style="font-size:118px;max-width:880px;line-height:1.05">${CONFIG.episodio.titulo}</div>
  </div>`, 51));

const ttOverlay = `
  <div class="layer" style="inset:28px;border:3px solid rgba(212,175,55,.85)"></div>
  <div class="layer" style="inset:40px;border:1px solid rgba(212,175,55,.4)"></div>
  <div class="layer" style="top:150px;left:70px;width:300px">${logoH(300)}</div>
  <div class="layer" style="top:1300px;left:70px;right:180px;height:150px;background:linear-gradient(90deg,rgba(11,10,8,.92),rgba(11,10,8,.6) 80%,transparent);border-left:6px solid ${PALETA.oro};padding:24px 34px;display:flex;flex-direction:column;justify-content:center;gap:12px">
    <div class="cinzel gold" style="font-size:44px;white-space:nowrap">${CONFIG.estrella.nombre}</div>
    <div style="font:600 22px 'Montserrat';letter-spacing:.35em;color:${PALETA.oroClaro}">${CONFIG.estrella.categoria}</div>
  </div>`;
add('tiktok/tt-overlay-video-transparente-1080x1920.png', 1080, 1920, ttOverlay, { transparent: true });

add('tiktok/tt-guia-zonas-seguras-1080x1920.png', 1080, 1920, `<div class="layer" style="background:#333 linear-gradient(160deg,#4a4a4a,#1d1d1d)"></div>
  ${ttOverlay}
  <div class="layer" style="height:150px;background:rgba(255,40,60,.35)"></div>
  <div class="layer" style="top:auto;height:480px;background:rgba(255,40,60,.35)"></div>
  <div class="layer" style="left:auto;width:140px;top:150px;bottom:480px;background:rgba(255,40,60,.35)"></div>
  <div class="layer" style="top:40px;text-align:center;font:700 30px 'Montserrat';color:#fff">ZONA OCUPADA POR TIKTOK (no poner texto)</div>
  <div class="layer" style="top:auto;bottom:200px;text-align:center;font:700 30px 'Montserrat';color:#fff">DESCRIPCIÓN · BOTONES · MÚSICA</div>`);

// --- FACEBOOK ---
// Contenido centrado: en celular Facebook recorta los costados de la portada
add('facebook/fb-portada-1640x624.png', 1640, 624, `${background(1640, 624, { seed: 61, glowY: 50 })}
  <div class="center" style="gap:26px">
    ${logoH(720)}
    <div class="rule" style="--rw:120px;font:600 22px 'Montserrat';letter-spacing:.35em;color:${PALETA.oroClaro}">${CONFIG.fecha} · ${CONFIG.hora}</div>
  </div>`);

add('facebook/fb-portada-evento-1920x1005.png', 1920, 1005, `${background(1920, 1005, { seed: 62, glowY: 45 })}
  <div class="center" style="gap:40px">
    <div class="kicker" style="font-size:26px">Una noche · Muchas estrellas</div>
    ${logoH(1000)}
    <div class="rule" style="--rw:160px;font:700 40px 'Cinzel';letter-spacing:.12em;color:${PALETA.oroClaro}">${CONFIG.fecha} · ${CONFIG.hora}</div>
    <div style="font:500 26px 'Montserrat';letter-spacing:.3em">${CONFIG.lugar}</div>
  </div>`);

add('facebook/fb-post-enlace-1200x630.png', 1200, 630, `${background(1200, 630, { seed: 63, glowY: 45 })}
  <div class="center" style="gap:28px">
    ${logoH(760)}
    <div class="rule" style="--rw:110px;font:600 24px 'Montserrat';letter-spacing:.35em">${CONFIG.fecha}</div>
  </div>`);

add('facebook/fb-post-cuadrado-1080x1080.png', 1080, 1080, `${background(1080, 1080, { seed: 64 })}
  <div class="center" style="gap:40px">
    ${logoV(600)}
    <div style="display:flex;flex-direction:column;gap:12px;align-items:center">
      <div class="cinzel gold" style="font-size:46px;font-weight:700">${CONFIG.fecha}</div>
      <div style="font:500 24px 'Montserrat';letter-spacing:.3em">${CONFIG.hora} · ${CONFIG.lugar}</div>
    </div>
    <div class="btn" style="font-size:22px">${CONFIG.cta}</div>
  </div>`);

// ------------------------------------------------------------------
// LOGOS
// ------------------------------------------------------------------
const logos = {
  'logo-vertical-oro': svgLogoVertical('oro'),
  'logo-vertical-negro': svgLogoVertical(PALETA.noche),
  'logo-vertical-marfil': svgLogoVertical(PALETA.marfil),
  'logo-horizontal-oro': svgLogoHorizontal('oro'),
  'logo-horizontal-negro': svgLogoHorizontal(PALETA.noche),
  'logo-horizontal-marfil': svgLogoHorizontal(PALETA.marfil),
  'isotipo-oro': svgIsotipo('oro'),
  'isotipo-negro': svgIsotipo(PALETA.noche),
  'isotipo-marfil': svgIsotipo(PALETA.marfil),
};
for (const [name, svg] of Object.entries(logos)) {
  fs.writeFileSync(out('logo', `${name}.svg`), svg);
  const vb = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const W = 2000, H = Math.round(W * vb[3] / vb[2]);
  piezas.push({ file: `logo/${name}.png`, w: W, h: H, transparent: true, html: page(W, H, `<div style="width:${W}px">${svg.replace('<svg ', `<svg width="${W}" height="${H}" `)}</div>`) });
}
// Logo principal sobre fondo negro (para presentaciones / pantallas)
add('logo/logo-vertical-oro-fondo-negro.png', 1600, 1600, `${background(1600, 1600, { seed: 7, frame: false, glowY: 50 })}<div class="center">${logoV(1100)}</div>`);

// ------------------------------------------------------------------
// RENDER
// ------------------------------------------------------------------
// En entornos con Chromium preinstalado se puede indicar la ruta con CHROMIUM_PATH
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const pg = await ctx.newPage();
for (const p of piezas) {
  fs.mkdirSync(path.dirname(out(p.file)), { recursive: true });
  await pg.setViewportSize({ width: p.w, height: p.h });
  await pg.setContent(p.html, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: out(p.file), omitBackground: p.transparent, clip: { x: 0, y: 0, width: p.w, height: p.h } });
  console.log('✓', p.file);
}
await browser.close();
