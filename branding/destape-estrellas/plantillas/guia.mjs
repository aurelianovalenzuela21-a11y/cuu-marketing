// Genera la guía de marca (HTML + PDF). Corre después de build.mjs.
// Uso: npm run guia

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = (f) => fs.readFileSync(path.join(ROOT, 'logo', f), 'utf8');

const GOLD = 'linear-gradient(180deg,#FFF3C4 0%,#F2D27A 22%,#C9992E 48%,#A57A1E 52%,#E6C35C 75%,#FFF0B3 100%)';
const colores = [
  ['Oro 24K', '#D4AF37', '212, 175, 55', '0, 17, 74, 17', 'Color principal. Logo, titulares, marcos.'],
  ['Oro brillo', '#F2D27A', '242, 210, 122', '0, 13, 50, 5', 'Luces, subtítulos y textos de apoyo.'],
  ['Champagne', '#FFF0B3', '255, 240, 179', '0, 6, 30, 0', 'Destellos y puntos de máximo brillo.'],
  ['Oro viejo', '#A57A1E', '165, 122, 30', '0, 26, 82, 35', 'Sombra del metal en degradados.'],
  ['Bronce profundo', '#5C4310', '92, 67, 16', '0, 27, 83, 64', 'Resplandor cálido en fondos.'],
  ['Negro noche', '#0B0A08', '11, 10, 8', '60, 40, 40, 100', 'Fondo principal. Siempre de noche.'],
  ['Marfil', '#FFF8E7', '255, 248, 231', '0, 3, 9, 0', 'Texto corrido sobre negro.'],
];

const specs = [
  ['Instagram', 'Foto de perfil', '1080 × 1080', 'instagram/ig-perfil-1080x1080.png'],
  ['Instagram', 'Post cuadrado (teaser)', '1080 × 1080', 'instagram/ig-post-teaser-1080x1080.png'],
  ['Instagram', 'Post vertical (anuncio)', '1080 × 1350', 'instagram/ig-post-anuncio-1080x1350.png'],
  ['Instagram', 'Post "Estrella revelada"', '1080 × 1350', 'instagram/ig-post-estrella-revelada-1080x1350.png'],
  ['Instagram', 'Marco con ventana transparente', '1080 × 1350', 'instagram/ig-marco-estrella-transparente-1080x1350.png'],
  ['Instagram', 'Historia anuncio', '1080 × 1920', 'instagram/ig-historia-anuncio-1080x1920.png'],
  ['Instagram', 'Historia cuenta regresiva', '1080 × 1920', 'instagram/ig-historia-cuenta-regresiva-1080x1920.png'],
  ['Instagram', 'Portadas de destacadas (6)', '1080 × 1920', 'instagram/destacadas/'],
  ['TikTok', 'Foto de perfil', '1080 × 1080', 'tiktok/tt-perfil-1080x1080.png'],
  ['TikTok', 'Portada de video', '1080 × 1920', 'tiktok/tt-portada-video-1080x1920.png'],
  ['TikTok', 'Overlay para video (transparente)', '1080 × 1920', 'tiktok/tt-overlay-video-transparente-1080x1920.png'],
  ['TikTok', 'Guía de zonas seguras', '1080 × 1920', 'tiktok/tt-guia-zonas-seguras-1080x1920.png'],
  ['Facebook', 'Foto de perfil', '1080 × 1080', 'facebook/fb-perfil-1080x1080.png'],
  ['Facebook', 'Portada de página', '1640 × 624', 'facebook/fb-portada-1640x624.png'],
  ['Facebook', 'Portada de evento', '1920 × 1005', 'facebook/fb-portada-evento-1920x1005.png'],
  ['Facebook', 'Post con enlace', '1200 × 630', 'facebook/fb-post-enlace-1200x630.png'],
  ['Facebook', 'Post cuadrado', '1080 × 1080', 'facebook/fb-post-cuadrado-1080x1080.png'],
];

const img = (p, style = '') => `<img src="${p}" style="${style}">`;

const html = `<!doctype html><html lang="es-MX"><head><meta charset="utf-8">
<title>El Destape de las Estrellas — Guía de marca</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
@font-face{font-family:Cinzel;src:url(fuentes/Cinzel-Bold.ttf);font-weight:700}
@font-face{font-family:Cinzel;src:url(fuentes/Cinzel-Black.ttf);font-weight:900}
@font-face{font-family:Cormorant;src:url(fuentes/CormorantGaramond-SemiBoldItalic.ttf);font-weight:600;font-style:italic}
@font-face{font-family:Montserrat;src:url(fuentes/Montserrat-Regular.ttf);font-weight:400}
@font-face{font-family:Montserrat;src:url(fuentes/Montserrat-SemiBold.ttf);font-weight:600}
@font-face{font-family:Montserrat;src:url(fuentes/Montserrat-Bold.ttf);font-weight:700}
@page{size:1920px 1080px;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0B0A08;color:#FFF8E7;font:400 22px/1.55 Montserrat,sans-serif}
section{width:1920px;height:1080px;position:relative;overflow:hidden;padding:110px 140px;page-break-after:always;
  background:radial-gradient(ellipse 70% 60% at 50% 30%,#2a1f08 0%,#120e05 45%,#0B0A08 80%)}
section::before{content:'';position:absolute;inset:36px;border:2px solid rgba(212,175,55,.55);pointer-events:none}
section::after{content:'';position:absolute;inset:48px;border:1px solid rgba(212,175,55,.25);pointer-events:none}
.n{font:600 18px Montserrat;letter-spacing:.45em;color:#F2D27A;text-transform:uppercase;margin-bottom:22px}
h1,h2{font-family:Cinzel;font-weight:900;letter-spacing:.04em;line-height:1.05;color:#E6C35C;text-shadow:0 0 30px rgba(212,175,55,.35)}
h2{font-size:84px;margin-bottom:40px;display:inline-block}
h2+*{clear:both}
h3{font:700 26px Cinzel;color:#F2D27A;letter-spacing:.06em;margin-bottom:10px}
p{max-width:900px;color:rgba(255,248,231,.85)}
em{font-family:Cormorant;font-style:italic;font-weight:600;font-size:1.25em;color:#F2D27A}
.grid{display:grid;gap:36px}
.card{border:1px solid rgba(212,175,55,.35);padding:30px;background:rgba(11,10,8,.55)}
.sw{height:200px;margin-bottom:18px;border:1px solid rgba(212,175,55,.3)}
.mono{font:600 18px Montserrat;letter-spacing:.06em;color:rgba(255,248,231,.75)}
table{border-collapse:collapse;width:100%;font-size:17px}
td,th{padding:6px 16px;border-bottom:1px solid rgba(212,175,55,.2);text-align:left}
th{font:600 15px Montserrat;letter-spacing:.3em;color:#F2D27A;text-transform:uppercase}
.no{position:relative}.no::after{content:'✕';position:absolute;top:12px;right:16px;color:#ff6b6b;font:700 30px Montserrat}
.cover{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
</style></head><body>

<section class="cover">
  <div style="width:820px;filter:drop-shadow(0 0 40px rgba(212,175,55,.35))">${svg('logo-vertical-oro.svg')}</div>
  <div class="n" style="margin-top:60px">Guía de marca · Kit para redes sociales</div>
</section>

<section>
  <div class="n">01 · Concepto</div>
  <h2>Una noche para<br>revelar estrellas</h2>
  <div class="grid" style="grid-template-columns:1.2fr 1fr;align-items:start">
    <div>
      <p><em>El destape</em> es el momento en que algo oculto sale a la luz: la cortina que se abre, la botella que se descorcha, el nombre que por fin se anuncia. La marca vive en ese instante.</p>
      <p style="margin-top:24px">Todo el sistema visual se construye con <b style="color:#F2D27A">oro sobre noche</b>: elegante como una gala, brillante como un reflector, y con suficiente misterio para que la gente quiera saber quién es la siguiente estrella.</p>
    </div>
    <div class="card"><h3>Personalidad</h3>
      <p>Glamurosa · Misteriosa · Celebratoria · Cercana.</p>
      <h3 style="margin-top:26px">Lo que nunca es</h3>
      <p>Barata, saturada de colores, informal en exceso ni fría.</p></div>
  </div>
</section>

<section>
  <div class="n">02 · Logotipo</div>
  <h2>Versiones del logo</h2>
  <div class="grid" style="grid-template-columns:1fr 1.5fr 0.8fr;align-items:center">
    <div class="card" style="text-align:center"><div style="width:100%">${svg('logo-vertical-oro.svg')}</div><p class="mono" style="margin-top:16px">Vertical · principal</p></div>
    <div class="card" style="text-align:center"><div style="width:100%">${svg('logo-horizontal-oro.svg')}</div><p class="mono" style="margin-top:16px">Horizontal · portadas y firmas</p></div>
    <div class="card" style="text-align:center"><div style="width:70%;margin:auto">${svg('isotipo-oro.svg')}</div><p class="mono" style="margin-top:16px">Isotipo · perfiles</p></div>
  </div>
  <p style="margin-top:40px">El isotipo es un medallón con la <em>estrella del destape</em>: una estrella de cuatro puntas que se abre en rayos, como un reflector que se enciende.</p>
</section>

<section>
  <div class="n">03 · Logotipo</div>
  <h2>Monocromos y reglas</h2>
  <div class="grid" style="grid-template-columns:repeat(3,1fr)">
    <div class="card" style="background:#FFF8E7"><div>${svg('logo-horizontal-negro.svg')}</div><p class="mono" style="color:#0B0A08;margin-top:14px">Negro · fondos claros</p></div>
    <div class="card"><div>${svg('logo-horizontal-marfil.svg')}</div><p class="mono" style="margin-top:14px">Marfil · fotos oscuras</p></div>
    <div class="card"><h3>Área de protección</h3><p>Deja libre alrededor del logo un espacio igual a la altura de la palabra <em>de las</em>.</p>
      <h3 style="margin-top:18px">Tamaño mínimo</h3><p>Vertical: 160 px de ancho. Horizontal: 220 px. Isotipo: 48 px.</p></div>
  </div>
  <h3 style="margin-top:46px">Usos incorrectos</h3>
  <div class="grid" style="grid-template-columns:repeat(4,1fr);margin-top:16px">
    <div class="card no"><div style="transform:scaleX(1.5) scaleY(.8)">${svg('logo-horizontal-marfil.svg')}</div><p class="mono">No deformar</p></div>
    <div class="card no"><div style="filter:hue-rotate(160deg) saturate(3)">${svg('logo-horizontal-oro.svg')}</div><p class="mono">No cambiar colores</p></div>
    <div class="card no" style="background:#E6C35C"><div>${svg('logo-horizontal-oro.svg')}</div><p class="mono" style="color:#0B0A08">No oro sobre oro</p></div>
    <div class="card no"><div style="transform:rotate(-12deg)">${svg('logo-horizontal-oro.svg')}</div><p class="mono">No rotar</p></div>
  </div>
</section>

<section>
  <div class="n">04 · Color</div>
  <h2>Paleta dorada</h2>
  <div class="grid" style="grid-template-columns:repeat(7,1fr);gap:22px">
    ${colores.map(([n, hex, rgb, cmyk, uso]) => `<div><div class="sw" style="background:${hex}"></div>
      <h3 style="font-size:20px">${n}</h3><div class="mono">${hex}<br>RGB ${rgb}<br>CMYK ${cmyk}</div>
      <p style="font-size:16px;margin-top:10px">${uso}</p></div>`).join('')}
  </div>
  <div class="grid" style="grid-template-columns:1fr 1fr;margin-top:40px;align-items:center">
    <div class="sw" style="background:${GOLD.replace('180deg', '90deg')};height:90px;margin:0"></div>
    <p style="font-size:18px">Degradado <b style="color:#F2D27A">Oro metálico</b>: champagne → oro brillo → oro viejo → oro → champagne. Úsalo en logo y titulares. En impresión se recomienda tinta metálica <b style="color:#F2D27A">Pantone 871 C</b> o hot-stamping dorado.</p>
  </div>
</section>

<section>
  <div class="n">05 · Tipografía</div>
  <h2>Tres voces, una noche</h2>
  <div class="grid" style="grid-template-columns:1.2fr 1fr 1fr">
    <div class="card"><div style="font:900 96px Cinzel;background:${GOLD};-webkit-background-clip:text;color:transparent">Aa</div>
      <h3>Cinzel · Black / Bold</h3><p>Titulares, nombres de estrellas, fechas. Siempre en MAYÚSCULAS con espaciado amplio.</p></div>
    <div class="card"><div style="font:italic 600 96px Cormorant;color:#F2D27A">Aa</div>
      <h3>Cormorant Garamond Italic</h3><p>Acentos elegantes y palabras de enlace: <em>de las</em>, <em>presenta</em>, <em>una noche</em>.</p></div>
    <div class="card"><div style="font:600 96px Montserrat;color:#FFF8E7">Aa</div>
      <h3>Montserrat</h3><p>Información práctica: hora, lugar, botones. En mayúsculas con tracking 0.3 em.</p></div>
  </div>
  <p style="margin-top:36px">Las tres son gratuitas (Google Fonts) y vienen incluidas en la carpeta <b style="color:#F2D27A">fuentes/</b>.</p>
</section>

<section>
  <div class="n">06 · Elementos gráficos</div>
  <h2>Reflector, destellos y marco</h2>
  <div class="grid" style="grid-template-columns:1fr 1fr 1fr">
    <div class="card"><h3>Rayos de reflector</h3><p>Haces de luz que bajan desde arriba al centro. Muy sutiles: la luz se intuye, no grita.</p></div>
    <div class="card"><h3>Polvo de oro</h3><p>Puntos y destellos de cuatro puntas esparcidos. Nunca sobre rostros ni textos pequeños.</p></div>
    <div class="card"><h3>Doble marco</h3><p>Línea dorada fina + línea interior más tenue, como una invitación de gala.</p></div>
  </div>
  <div style="display:flex;gap:30px;margin-top:40px;height:420px">
    ${img('instagram/ig-post-teaser-1080x1080.png', 'height:100%')}
    ${img('instagram/ig-post-estrella-revelada-1080x1350.png', 'height:100%')}
    ${img('instagram/ig-historia-cuenta-regresiva-1080x1920.png', 'height:100%')}
    ${img('instagram/destacadas/ig-destacada-estrellas.png', 'height:100%')}
  </div>
</section>

<section>
  <div class="n">07 · Voz</div>
  <h2>Cómo hablamos</h2>
  <div class="grid" style="grid-template-columns:1fr 1fr">
    <div class="card"><h3>Sí</h3><p>“Una noche. Muchas estrellas.”<br>“Algo brilla en camino.”<br>“¿Quién será la próxima estrella?”<br>“El telón está por abrirse.”</p></div>
    <div class="card"><h3>No</h3><p>“¡¡¡NO TE LO PIERDAS!!! 🔥🔥🔥”<br>“Evento chido este finde”<br>Exceso de emojis o colores fuera de la paleta.</p></div>
  </div>
  <p style="margin-top:36px">Emojis permitidos con moderación: ✨ ⭐ 🌟 🥂 🎬. Hashtags oficiales: <b style="color:#F2D27A">#ElDestapeDeLasEstrellas #ElDestape #UnaNocheMuchasEstrellas</b></p>
</section>

<section>
  <div class="n">08 · Aplicaciones</div>
  <h2>Medidas por red social</h2>
  <table><tr><th>Red</th><th>Pieza</th><th>Medida (px)</th><th>Archivo</th></tr>
  ${specs.map(([r, p, m, f]) => `<tr><td style="color:#F2D27A">${r}</td><td>${p}</td><td class="mono">${m}</td><td class="mono" style="font-size:15px">${f}</td></tr>`).join('')}
  </table>
</section>

<section>
  <div class="n">09 · Aplicaciones</div>
  <h2>Facebook y TikTok</h2>
  <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:30px;height:720px">
    <div style="display:flex;flex-direction:column;gap:24px">
      ${img('facebook/fb-portada-1640x624.png', 'width:100%')}
      ${img('facebook/fb-portada-evento-1920x1005.png', 'width:80%')}
    </div>
    <div style="display:flex;gap:20px;height:600px">
      ${img('tiktok/tt-portada-video-1080x1920.png', 'height:100%')}
      ${img('tiktok/tt-guia-zonas-seguras-1080x1920.png', 'height:100%')}
    </div>
  </div>
</section>

<section class="cover">
  <div style="width:300px">${svg('isotipo-oro.svg')}</div>
  <h2 style="margin-top:40px">Que brille</h2>
  <p style="text-align:center">Plantillas editables en <b style="color:#F2D27A">plantillas/build.mjs</b> · Textos en <b style="color:#F2D27A">textos-redes.md</b></p>
</section>
</body></html>`;

// Los SVG de logo comparten ids de gradiente; los hacemos únicos por aparición
let n = 0;
const unique = html.replace(/<svg[\s\S]*?<\/svg>/g, (s) => {
  const k = n++;
  return s.replace(/id="([^"]+)"/g, `id="$1_${k}"`).replace(/url\(#([^)]+)\)/g, `url(#$1_${k})`);
});

const file = path.join(ROOT, 'guia-de-marca.html');
fs.writeFileSync(file, unique);
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const pg = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await pg.goto(pathToFileURL(file).href, { waitUntil: 'load' });
await pg.evaluate(() => document.fonts.ready);
await pg.pdf({ path: path.join(ROOT, 'guia-de-marca.pdf'), width: '1920px', height: '1080px', printBackground: true });
await browser.close();
console.log('✓ guia-de-marca.html / guia-de-marca.pdf');
