/* ================================================
   CANTINA TODOS SANTOS — app
   Lee data/events.json (lo escribe el flujo de n8n),
   data/menu.json y data/site.json.
   ================================================ */

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const WEEK_ORDER = [3, 4, 5, 6, 0, 1, 2]; // la semana de la cantina arranca en miércoles
const UPCOMING_DAYS = 21;
const UPCOMING_MAX = 8;

const $ = (sel) => document.querySelector(sel);

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (err) {
    console.warn(`No se pudo cargar ${path}`, err);
    return null;
  }
}

/* ---------- Fechas ---------- */

function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toISO(date) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

function startOfToday() {
  const now = new Date();
  // Hasta las 4 am seguimos en "la noche de ayer".
  if (now.getHours() < 4) now.setDate(now.getDate() - 1);
  now.setHours(0, 0, 0, 0);
  return now;
}

function formatTime(hhmm) {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

function relativeDay(date, today) {
  const diff = Math.round((date - today) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  return `${DAYS[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

/* ---------- Eventos ---------- */

// Combina los eventos del calendario con el programa fijo semanal:
// si un día del programa no tiene evento en el calendario, se genera uno genérico.
function buildUpcoming(data, today) {
  const limit = new Date(today);
  limit.setDate(limit.getDate() + UPCOMING_DAYS);

  const dated = (data.events || [])
    .map((ev) => ({ ...ev, _date: parseDate(ev.date) }))
    .filter((ev) => ev._date >= today && ev._date < limit);

  const taken = new Set(dated.map((ev) => ev.date));
  const generated = [];
  for (let d = new Date(today); d < limit; d.setDate(d.getDate() + 1)) {
    const iso = toISO(d);
    if (taken.has(iso)) continue;
    const slot = (data.weekly || []).find((w) => w.day === d.getDay());
    if (slot) generated.push({ ...slot, id: `weekly-${iso}`, date: iso, artist: '', flyer: '', _date: new Date(d) });
  }

  return [...dated, ...generated].sort((a, b) => a._date - b._date || (a.start || '').localeCompare(b.start || ''));
}

function autoflyer(ev) {
  return `
    <div class="autoflyer" data-type="${esc(ev.type)}">
      <span class="autoflyer__day">${esc(DAYS[ev._date.getDay()])} ${ev._date.getDate()} ${esc(MONTHS[ev._date.getMonth()].slice(0, 3))}</span>
      <div>
        <p class="autoflyer__title">${esc(ev.title)}</p>
        ${ev.artist ? `<p class="autoflyer__artist">${esc(ev.artist)}</p>` : ''}
      </div>
      <span class="autoflyer__foot">Cantina Todos Santos · ${esc(formatTime(ev.start))}</span>
    </div>`;
}

function flyerMarkup(ev) {
  if (!ev.flyer) return autoflyer(ev);
  return `<img src="${esc(ev.flyer)}" alt="Flyer: ${esc(ev.title)}${ev.artist ? ' — ' + esc(ev.artist) : ''}" loading="lazy" data-fallback="${esc(ev.id)}">`;
}

// Si el flyer no carga (permiso de Drive, link roto), se reemplaza por el flyer generado.
function wireFlyerFallbacks(root, events) {
  root.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      const ev = events.find((e) => e.id === img.dataset.fallback);
      if (ev) img.outerHTML = autoflyer(ev);
    }, { once: true });
  });
}

function renderHero(ev, today) {
  if (!ev) return;
  const when = relativeDay(ev._date, today);
  $('#hero-when').textContent = when === 'Hoy' ? 'Esta noche' : when;
  $('#hero-title').textContent = ev.title;
  $('#hero-artist').textContent = ev.artist || '';
  $('#hero-desc').textContent = ev.description || $('#hero-desc').textContent;

  const chips = [];
  if (when === 'Hoy') chips.push('<span class="chip chip--live">● Hoy</span>');
  if (ev.start) chips.push(`<span class="chip">${esc(formatTime(ev.start))}</span>`);
  if (ev.cover) chips.push(`<span class="chip">Cover ${esc(ev.cover)}</span>`);
  $('#hero-meta').innerHTML = chips.join('');

  const fig = $('#hero-flyer');
  fig.innerHTML = flyerMarkup(ev);
  wireFlyerFallbacks(fig, [ev]);
}

function renderEvents(list, today) {
  const root = $('#events-list');
  if (!list.length) {
    root.innerHTML = '<p class="events__empty">Pronto anunciamos la cartelera. Síguenos en redes.</p>';
    return;
  }
  root.innerHTML = list.map((ev) => `
    <article class="event">
      <div class="event__media">${flyerMarkup(ev)}</div>
      <div class="event__body">
        <p class="event__date">${esc(relativeDay(ev._date, today))} · ${esc(formatTime(ev.start))}</p>
        <h3 class="event__title">${esc(ev.title)}</h3>
        ${ev.artist ? `<p class="event__artist">${esc(ev.artist)}</p>` : ''}
      </div>
    </article>`).join('');
  wireFlyerFallbacks(root, list);
}

function renderWeek(weekly, today) {
  $('#week-list').innerHTML = WEEK_ORDER.map((day) => {
    const slot = weekly.find((w) => w.day === day);
    const cls = ['week__day', day === today.getDay() ? 'week__day--today' : '', slot ? '' : 'week__day--off'].join(' ');
    return `
      <li class="${cls}">
        <span class="week__name">${DAYS[day]}</span>
        <span class="week__title">${slot ? esc(slot.title) : 'Descanso'}</span>
        ${slot ? `<span class="week__time">Desde ${esc(formatTime(slot.start))}</span>` : ''}
      </li>`;
  }).join('');
}

function renderUpdated(iso) {
  if (!iso) return;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return;
  $('#updated-at').textContent = `${d.getDate()} de ${MONTHS[d.getMonth()]}, ${formatTime(`${d.getHours()}:${d.getMinutes()}`)}`;
}

/* ---------- Menú ---------- */

const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

function renderMenu(menu) {
  const tabs = $('#menu-tabs');
  const panel = $('#menu-panel');
  if (!menu || !menu.categories?.length) {
    panel.innerHTML = '<p class="events__empty">Menú no disponible por el momento.</p>';
    return;
  }

  const show = (id) => {
    const cat = menu.categories.find((c) => c.id === id);
    tabs.querySelectorAll('.menu-tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.id === id)));
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.innerHTML = `
      ${cat.intro ? `<p class="menu-panel__intro">${esc(cat.intro)}</p>` : ''}
      <ul class="menu-list">
        ${cat.items.map((it) => `
          <li class="dish">
            <div class="dish__row">
              <span class="dish__name">${esc(it.name)}${it.tag ? `<span class="dish__tag">${esc(it.tag)}</span>` : ''}</span>
              <span class="dish__dots" aria-hidden="true"></span>
              <span class="dish__price">${money.format(it.price)}</span>
            </div>
            ${it.desc ? `<p class="dish__desc">${esc(it.desc)}</p>` : ''}
          </li>`).join('')}
      </ul>`;
    try { sessionStorage.setItem('ts-menu-tab', id); } catch (_) { /* sin storage */ }
  };

  tabs.innerHTML = menu.categories.map((c) =>
    `<button class="menu-tab" role="tab" id="tab-${esc(c.id)}" data-id="${esc(c.id)}" aria-selected="false">${esc(c.name)}</button>`
  ).join('');
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-tab');
    if (btn) show(btn.dataset.id);
  });

  let initial = menu.categories[0].id;
  try {
    const saved = sessionStorage.getItem('ts-menu-tab');
    if (saved && menu.categories.some((c) => c.id === saved)) initial = saved;
  } catch (_) { /* sin storage */ }
  show(initial);
}

/* ---------- Datos del local ---------- */

function renderSite(site) {
  if (!site) return;
  const wa = site.whatsapp
    ? `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(site.whatsappMessage || '')}`
    : '#visitanos';
  const links = { whatsapp: wa, maps: site.maps, instagram: site.instagram, facebook: site.facebook, tiktok: site.tiktok };

  document.querySelectorAll('[data-fill]').forEach((el) => {
    const key = el.dataset.fill;
    if (key === 'address') el.textContent = site.address;
    else if (links[key]) el.href = links[key];
  });

  $('#roster').innerHTML = (site.roster || [])
    .map((name, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${esc(name)}</li>`).join('');
}

/* ---------- Nav ---------- */

function initNav() {
  const burger = $('#burger');
  const links = $('#nav-links');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      links.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------- Init ---------- */

(async function init() {
  initNav();
  const [events, menu, site] = await Promise.all([
    loadJSON('data/events.json'),
    loadJSON('data/menu.json'),
    loadJSON('data/site.json'),
  ]);

  const today = startOfToday();
  // El programa semanal vive en site.json; n8n solo reescribe events.json.
  const data = { events: events?.events || [], weekly: site?.weekly || [], updated: events?.updated };
  const upcoming = buildUpcoming(data, today);

  renderHero(upcoming[0], today);
  renderEvents(upcoming.slice(0, UPCOMING_MAX), today);
  renderWeek(data.weekly || [], today);
  renderUpdated(data.updated);
  renderMenu(menu);
  renderSite(site);
})();
