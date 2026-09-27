#!/usr/bin/env node
/* ================================================
   Auditoría de calidad para sitios estáticos
   Uso: node herramientas/auditar-sitio.mjs <carpeta-del-sitio> [--out reporte.md]
   Revisa SEO, conversión, accesibilidad, rendimiento y riesgos legales.
   Sin dependencias: solo Node 18+.
   ================================================ */

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative, extname, dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outFile = outIdx >= 0 ? args[outIdx + 1] : null;
const root = resolve(args.find((a, i) => !a.startsWith('--') && (outIdx < 0 || i !== outIdx + 1)) || '.');

const IGNORAR = new Set(['.git', 'node_modules', '.claude', 'herramientas', 'reportes', 'negocios']);
// Descuento máximo por severidad: con un solo crítico el sitio ya no puede pasar de 85
const PESO = { critico: [15, 40], alto: [5, 30], medio: [2, 20], bajo: [1, 10] };
const ETIQUETA = { critico: '🔴 Crítico', alto: '🟠 Alto', medio: '🟡 Medio', bajo: '⚪ Bajo' };

// ---- Recolectar archivos ----
function listar(dir) {
  return readdirSync(dir).flatMap(nombre => {
    if (IGNORAR.has(nombre)) return [];
    const ruta = join(dir, nombre);
    return statSync(ruta).isDirectory() ? listar(ruta) : [ruta];
  });
}

const archivos = listar(root);
const porTipo = ext => archivos.filter(f => extname(f).toLowerCase() === ext);
const htmls = porTipo('.html');
const jsTodo = porTipo('.js').map(f => readFileSync(f, 'utf8')).join('\n');
const hallazgos = [];

function agregar(severidad, categoria, archivo, mensaje, sugerencia) {
  hallazgos.push({ severidad, categoria, archivo: relative(root, archivo) || '.', mensaje, sugerencia });
}

const attr = (tag, nombre) => {
  const m = tag.match(new RegExp(`\\b${nombre}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] ?? m[3]) : null;
};
const meta = (html, clave) => {
  const tag = (html.match(/<meta\b[^>]*>/gi) || []).find(t =>
    (attr(t, 'name') || attr(t, 'property') || '').toLowerCase() === clave);
  return tag ? attr(tag, 'content') : null;
};
const texto = s => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// ---- Auditoría por página ----
for (const archivo of htmls) {
  const html = readFileSync(archivo, 'utf8');
  const ids = new Set([...html.matchAll(/\bid\s*=\s*"([^"]+)"/g)].map(m => m[1]));

  // SEO básico
  if (!/<html[^>]*\blang=/i.test(html)) agregar('medio', 'SEO', archivo, 'Falta el atributo lang en <html>.', 'Agrega lang="es-MX".');
  if (!meta(html, 'viewport')) agregar('alto', 'Móvil', archivo, 'Falta meta viewport.', 'Agrega <meta name="viewport" content="width=device-width, initial-scale=1">.');

  const title = texto((html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1]);
  if (!title) agregar('alto', 'SEO', archivo, 'La página no tiene <title>.', 'Escribe un título de 30–60 caracteres con servicio + ciudad.');
  else if (title.length > 65) agregar('bajo', 'SEO', archivo, `El título mide ${title.length} caracteres; Google lo corta después de ~60.`, 'Acórtalo dejando al inicio la palabra clave principal.');

  const desc = meta(html, 'description');
  if (!desc) agregar('alto', 'SEO', archivo, 'Falta meta description.', 'Escribe 120–155 caracteres que vendan el clic.');
  else if (desc.length > 160) agregar('bajo', 'SEO', archivo, `La meta description mide ${desc.length} caracteres (máx. recomendado 155).`, 'Recórtala para que no aparezca truncada en Google.');

  if (!/<link[^>]*rel="canonical"/i.test(html)) agregar('medio', 'SEO', archivo, 'Falta link canonical.', 'Evita contenido duplicado con <link rel="canonical">.');
  if (!meta(html, 'og:image')) agregar('alto', 'Redes', archivo, 'Falta og:image: al compartir el enlace en WhatsApp/Facebook no aparece imagen.', 'Crea una imagen 1200×630 y agrega <meta property="og:image">.');
  if (!meta(html, 'twitter:card')) agregar('bajo', 'Redes', archivo, 'Falta twitter:card.', 'Agrega <meta name="twitter:card" content="summary_large_image">.');
  if (!/<link[^>]*rel="(shortcut )?icon"/i.test(html)) agregar('medio', 'Marca', archivo, 'No hay favicon.', 'Agrega un favicon (32×32 y 180×180 para iPhone).');
  if (!/application\/ld\+json/i.test(html)) agregar('medio', 'SEO', archivo, 'Sin datos estructurados (Schema.org).', 'Agrega LocalBusiness con teléfono, dirección y horario.');

  const schema = (html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i) || [])[1] || '';
  if (schema && !/telephone/.test(schema)) agregar('medio', 'SEO local', archivo, 'El Schema.org no incluye teléfono ni horario.', 'Agrega "telephone", "openingHours" y "sameAs" (redes) para Google Maps.');

  const h1s = html.match(/<h1\b/gi) || [];
  if (h1s.length !== 1) agregar('medio', 'SEO', archivo, `La página tiene ${h1s.length} etiquetas <h1> (debe ser 1).`, 'Deja un solo H1 con la propuesta de valor.');

  // Imágenes
  for (const img of html.match(/<img\b[^>]*>/gi) || []) {
    const src = attr(img, 'src') || '(sin src)';
    if (attr(img, 'alt') === null) agregar('medio', 'Accesibilidad', archivo, `Imagen sin alt: ${src}`, 'Describe la imagen en alt (ayuda a SEO y lectores de pantalla).');
    if (!attr(img, 'width') || !attr(img, 'height')) agregar('bajo', 'Rendimiento', archivo, `Imagen sin width/height: ${src}`, 'Declara dimensiones para evitar saltos de diseño (CLS).');
  }

  // Enlaces
  const vacios = new Set();
  for (const a of html.match(/<a\b[^>]*>/gi) || []) {
    const href = attr(a, 'href');
    if (href === null) continue;
    if (href === '#' || href === '') { vacios.add(attr(a, 'aria-label') || attr(a, 'id') || 'enlace'); continue; }
    if (href.startsWith('#')) {
      if (!ids.has(href.slice(1))) agregar('medio', 'Navegación', archivo, `Ancla rota: ${href} no existe en la página.`, 'Corrige el id o el enlace.');
    } else if (!/^(https?:|mailto:|tel:|\/\/|javascript:)/i.test(href)) {
      const destino = join(dirname(archivo), href.split(/[?#]/)[0]);
      if (!existsSync(destino)) agregar('alto', 'Navegación', archivo, `Enlace roto: "${href}" no existe.`, 'Crea la página o cambia el enlace. Un 404 hace perder al prospecto.');
    }
    if (attr(a, 'target') === '_blank' && !/noopener/.test(attr(a, 'rel') || '')) agregar('bajo', 'Seguridad', archivo, `target="_blank" sin rel="noopener": ${href}`, 'Agrega rel="noopener".');
  }
  if (vacios.size) agregar('medio', 'Conversión', archivo, `${vacios.size} enlaces apuntan a "#" (sin destino): ${[...vacios].slice(0, 8).join(', ')}.`, 'Conecta redes sociales y páginas legales reales; un enlace muerto resta confianza.');

  // Formularios: ¿realmente envían datos?
  const forms = html.match(/<form\b[^>]*>/gi) || [];
  const enviaPorJs = /\bfetch\s*\(|XMLHttpRequest|sendBeacon|wa\.me\/[^'"`]*\$\{|window\.open\(/.test(jsTodo);
  const simulado = /[Ss]imulate|simular/.test(jsTodo) && /setTimeout/.test(jsTodo);
  for (const f of forms) {
    if (attr(f, 'action') || enviaPorJs) continue;
    agregar('critico', 'Conversión', archivo,
      simulado
        ? `El formulario ${attr(f, 'id') || ''} "simula" el envío: muestra "¡Mensaje enviado!" sin mandar nada.`
        : `El formulario ${attr(f, 'id') || ''} no envía los datos a ningún lado (sin action ni envío por JS).`,
      'Cada prospecto que lo llena se pierde. Conéctalo a WhatsApp, correo, n8n/Make o un CRM.');
  }

  // Datos personales sin aviso de privacidad (LFPDPPP en México)
  const pideDatos = /type="(email|tel)"/i.test(html);
  const aviso = (html.match(/<a\b[^>]*>[^<]*privacidad[^<]*<\/a>/gi) || []).some(a => !['#', ''].includes(attr(a, 'href')));
  if (pideDatos && !aviso) agregar('alto', 'Legal', archivo, 'El sitio pide datos personales pero no enlaza a un Aviso de Privacidad real.', 'La LFPDPPP lo exige. Publica /aviso-de-privacidad.html y enlázalo junto al formulario.');

  // Medición
  if (!/googletagmanager|gtag\(|fbq\(|plausible|clarity\.ms|umami/i.test(html + jsTodo)) {
    agregar('alto', 'Medición', archivo, 'No hay analítica instalada (GA4, Meta Pixel, Clarity…).', 'Sin datos no se puede optimizar. Instala GA4 + Meta Pixel y mide clics a WhatsApp y envíos del formulario.');
  }

  // Afirmaciones que requieren sustento (PROFECO)
  const plano = texto(html);
  for (const [re, que] of [[/#\s?1\b/, '"#1"'], [/\bla única\b|\bel único\b/i, '"la única / el único"'], [/\bgarantizad/i, '"garantizado"']]) {
    if (re.test(plano)) agregar('medio', 'Legal / Confianza', archivo, `Afirmación absoluta ${que} sin sustento visible.`, 'Respáldala con dato verificable o suavízala; PROFECO puede sancionar publicidad engañosa.');
  }

  // Rendimiento
  const headScripts = ((html.split(/<\/head>/i)[0] || '').match(/<script\b(?![^>]*(defer|async|type="application\/ld\+json"))[^>]*src=/gi) || []);
  if (headScripts.length) agregar('medio', 'Rendimiento', archivo, `${headScripts.length} script(s) bloqueando el render en <head>.`, 'Usa defer o muévelos al final del body.');
  const estilosInline = (html.match(/\sstyle="/g) || []).length;
  if (estilosInline > 25) agregar('bajo', 'Mantenimiento', archivo, `${estilosInline} estilos inline.`, 'Muévelos a CSS para facilitar cambios.');
}

// ---- Revisión de todo el sitio ----
const wa = new Set([...(htmls.map(f => readFileSync(f, 'utf8')).join('\n') + jsTodo).matchAll(/wa\.me\/(\d+)/g)].map(m => m[1]));
if (wa.size > 1) agregar('critico', 'Conversión', root, `Hay ${wa.size} números de WhatsApp distintos: ${[...wa].join(', ')}.`, 'Deja uno solo; un número equivocado manda clientes a otra persona.');
for (const n of wa) if (/1234567|0000000/.test(n)) agregar('critico', 'Conversión', root, `Número de WhatsApp de ejemplo: ${n}.`, 'Reemplázalo por el número real.');

const htmlTodo = htmls.map(f => readFileSync(f, 'utf8')).join('\n');
for (const css of porTipo('.css')) {
  const nombre = relative(root, css);
  if (!htmlTodo.includes(nombre.split('/').pop())) agregar('bajo', 'Mantenimiento', css, `${nombre} no se usa en ninguna página.`, 'Elimínalo o enlázalo a la página que lo necesita.');
}
for (const f of archivos) {
  const kb = statSync(f).size / 1024;
  if (/\.(png|jpe?g|gif)$/i.test(f) && kb > 250) agregar('medio', 'Rendimiento', f, `Imagen de ${kb.toFixed(0)} KB.`, 'Conviértela a WebP/AVIF y comprímela (<150 KB).');
  if (/\.(css|js)$/i.test(f) && kb > 100) agregar('bajo', 'Rendimiento', f, `${relative(root, f)} pesa ${kb.toFixed(0)} KB sin minificar.`, 'Minifica al publicar.');
}
if (!existsSync(join(root, 'robots.txt'))) agregar('medio', 'SEO', root, 'Falta robots.txt.', 'Crea robots.txt que apunte al sitemap.');
if (!existsSync(join(root, 'sitemap.xml'))) agregar('medio', 'SEO', root, 'Falta sitemap.xml.', 'Crea sitemap.xml y regístralo en Google Search Console.');
if (!existsSync(join(root, '404.html'))) agregar('bajo', 'Conversión', root, 'No hay página 404 personalizada.', 'Crea una 404 con botón a WhatsApp para no perder al visitante.');

// ---- Reporte ----
const orden = ['critico', 'alto', 'medio', 'bajo'];
hallazgos.sort((a, b) => orden.indexOf(a.severidad) - orden.indexOf(b.severidad));
const conteo = Object.fromEntries(orden.map(s => [s, hallazgos.filter(h => h.severidad === s).length]));
const puntaje = 100 - orden.reduce((t, s) => t + Math.min(PESO[s][1], conteo[s] * PESO[s][0]), 0);

const lineas = [
  `# Auditoría de sitio — ${relative(process.cwd(), root) || '.'}`,
  '',
  `**Fecha:** ${new Date().toISOString().slice(0, 10)} · **Páginas:** ${htmls.length} · **Puntaje de salud:** ${puntaje}/100`,
  '',
  orden.map(s => `${ETIQUETA[s]}: ${conteo[s]}`).join(' · '),
  '',
  '| Severidad | Área | Archivo | Hallazgo | Qué hacer |',
  '|---|---|---|---|---|',
  ...hallazgos.map(h => `| ${ETIQUETA[h.severidad]} | ${h.categoria} | ${h.archivo} | ${h.mensaje.replace(/\|/g, '\\|')} | ${h.sugerencia.replace(/\|/g, '\\|')} |`),
  '',
];
const reporte = lineas.join('\n');
if (outFile) writeFileSync(outFile, reporte);
console.log(reporte);
