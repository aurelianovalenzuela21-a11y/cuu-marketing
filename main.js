/* ================================================
   CUU MARKETING — main.js
   Tracking, lead capture, animations, slider
   ================================================ */

'use strict';

// ---- Helpers ----
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const CONFIG = Object.assign({ whatsapp: '526145148056', social: {} }, window.CUU_CONFIG);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function waUrl(text) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}


// ---- Attribution: keep UTMs / click IDs from the ad that brought the visitor ----
const attribution = (function initAttribution() {
  const KEY = 'cuu_attribution';
  const FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'ttclid'];
  const params = new URLSearchParams(location.search);
  const fresh = {};
  FIELDS.forEach(f => { if (params.get(f)) fresh[f] = params.get(f); });

  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) { /* storage blocked */ }

  // A new ad click overrides the previous source; otherwise keep the first one.
  const data = Object.keys(fresh).length
    ? { ...fresh, landing: location.pathname, referrer: document.referrer, first_seen: new Date().toISOString() }
    : stored;
  if (!data.referrer && document.referrer) data.referrer = document.referrer;

  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) { /* storage blocked */ }
  return data;
})();


// ---- Ad pixels & analytics (loaded only when IDs are configured) ----
(function initPixels() {
  if (CONFIG.metaPixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    fbq('init', CONFIG.metaPixelId);
    fbq('track', 'PageView');
  }

  if (CONFIG.googleTagId) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.googleTagId}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', CONFIG.googleTagId);
    const adsId = (CONFIG.googleAdsLeadConversion || '').split('/')[0];
    if (adsId && adsId !== CONFIG.googleTagId) gtag('config', adsId);
  }

  if (CONFIG.tiktokPixelId) {
    /* eslint-disable */
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load(CONFIG.tiktokPixelId);ttq.page();
    }(window, document, 'ttq');
    /* eslint-enable */
  }
})();

// Sends one conversion to every configured platform.
// type: 'lead' (form sent) | 'contact' (WhatsApp click) | 'cta' (intent click)
function track(type, label, extra = {}) {
  const data = { label, ...extra };
  if (window.fbq) {
    if (type === 'lead') fbq('track', 'Lead', data);
    else if (type === 'contact') fbq('track', 'Contact', data);
    else fbq('trackCustom', 'CTAClick', data);
  }
  if (window.gtag) {
    const name = { lead: 'generate_lead', contact: 'contact', cta: 'cta_click' }[type];
    gtag('event', name, { event_label: label, ...extra });
    if (type === 'lead' && CONFIG.googleAdsLeadConversion) {
      gtag('event', 'conversion', { send_to: CONFIG.googleAdsLeadConversion });
    }
  }
  if (window.ttq) {
    if (type === 'lead') ttq.track('SubmitForm', data);
    else if (type === 'contact') ttq.track('Contact', data);
    else ttq.track('ClickButton', data);
  }
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-track]');
  if (!el) return;
  const label = el.dataset.track;
  track(label.startsWith('whatsapp') ? 'contact' : 'cta', label, el.dataset.service ? { service: el.dataset.service } : {});
});


// ---- Config-driven links ----
(function initLinks() {
  const defaultMsg = 'Hola, vi su página y quiero informes sobre CUU Marketing';
  $$('.js-whatsapp').forEach(a => { a.href = waUrl(defaultMsg); });

  $$('[data-social]').forEach(a => {
    const url = CONFIG.social[a.dataset.social];
    if (url) a.href = url;
    else a.remove();
  });
  const social = $('#footer-social');
  if (social && !social.children.length) social.remove();

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();


// ---- NAV scroll effect ----
(function initNav() {
  const nav    = $('#nav');
  const burger = $('#burger-btn');
  const links  = $('#nav-links');

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setOpen(open) {
    links.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', () => setOpen(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
})();


// ---- Anchor links: smooth scroll + preselect service in the form ----
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  const target = id && document.getElementById(id);
  if (!target) return;
  e.preventDefault();

  if (a.dataset.service) {
    const select = $('#form-service');
    if (select && select.querySelector(`option[value="${a.dataset.service}"]`)) {
      select.value = a.dataset.service;
    }
  }

  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);

  if (id === 'contacto') {
    const first = $('#form-name');
    if (first) setTimeout(() => first.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
  }
});


// ---- Reveal on scroll ----
(function initReveal() {
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  $$('.service-card, .price-card, .pillar, .process__step, .testimonial-card, .stat-card, .compare-row, .faq__item').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
})();


// ---- Counters (stats + hero dashboard) ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const format = n => prefix + n.toLocaleString('es-MX') + suffix;

  if (reduceMotion || target === 0) { el.textContent = format(target); return; }

  const duration = 1600;
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = format(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

(function initCounters() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$('[data-target]', entry.target).forEach(animateCounter);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  $$('.stats__grid, .dashboard-card').forEach(el => observer.observe(el));
})();


// ---- Chart bars animate in ----
(function initCharts() {
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$('.chart__bar', entry.target).forEach((bar, i) => {
        bar.style.animation = `bar-grow 0.8s ${i * 100}ms cubic-bezier(0.4,0,0.2,1) both`;
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  $$('.dashboard-card').forEach(el => observer.observe(el));
})();


// ---- Typing animation for AI message ----
(function initAiTyping() {
  const el = $('.ai__msg');
  if (!el || reduceMotion) return;

  const msgs = [
    'Incrementar pauta en Instagram Stories',
    'Publicar contenido los martes y jueves',
    'Optimizar keywords en Google Ads',
    'Crear campaña de retargeting',
    'Lanzar oferta de temporada',
  ];
  let msgIndex = 0;
  let charIndex = msgs[0].length;
  let isDeleting = true;

  function type() {
    const current = msgs[msgIndex];
    charIndex += isDeleting ? -1 : 1;
    el.textContent = current.substring(0, charIndex);

    let delay = isDeleting ? 40 : 70;
    if (!isDeleting && charIndex === current.length) {
      delay = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      msgIndex = (msgIndex + 1) % msgs.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }

  setTimeout(type, 3000);
})();


// ---- Testimonials slider ----
(function initSlider() {
  const slider  = $('#testimonials-slider');
  const dotsBox = $('#testimonials-dots');
  const prevBtn = $('#prev-btn');
  const nextBtn = $('#next-btn');
  const cards   = $$('.testimonial-card');
  if (!slider || !cards.length) return;

  let current = 0;
  let autoplay;
  let dots = [];

  const visibleCount = () => (window.innerWidth <= 768 ? 1 : 2);
  const maxIndex = () => Math.max(0, cards.length - visibleCount());

  function buildDots() {
    dotsBox.innerHTML = '';
    dots = Array.from({ length: maxIndex() + 1 }, (_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'dot';
      d.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
      d.addEventListener('click', () => { restart(); goTo(i); });
      dotsBox.appendChild(d);
      return d;
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const gap = parseFloat(getComputedStyle(slider).columnGap) || 20;
    slider.style.transform = `translateX(-${current * (cards[0].offsetWidth + gap)}px)`;
    dots.forEach((d, i) => {
      d.classList.toggle('dot--active', i === current);
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  }

  function start() {
    if (reduceMotion) return;
    autoplay = setInterval(() => goTo(current >= maxIndex() ? 0 : current + 1), 6000);
  }
  function restart() { clearInterval(autoplay); start(); }

  prevBtn.addEventListener('click', () => { restart(); goTo(current - 1); });
  nextBtn.addEventListener('click', () => { restart(); goTo(current + 1); });

  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; clearInterval(autoplay); }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    start();
  }, { passive: true });

  const track = $('#testimonials-track');
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', restart);

  let lastVisible = visibleCount();
  window.addEventListener('resize', () => {
    if (visibleCount() !== lastVisible) { lastVisible = visibleCount(); buildDots(); }
    goTo(current);
  }, { passive: true });

  buildDots();
  goTo(0);
  start();
})();


// ---- Contact form: validate, send lead, fall back to WhatsApp ----
(function initForm() {
  const form = $('#contact-form');
  if (!form) return;

  const btn        = $('#form-submit');
  const btnText    = $('#form-submit-text');
  const btnLoading = $('#form-submit-loading');
  const errorBox   = $('#form-error');
  let started = false;

  const checks = {
    nombre:   v => v.length >= 2 || 'Escribe tu nombre.',
    telefono: v => v.replace(/\D/g, '').length >= 10 || 'Escribe un WhatsApp de 10 dígitos.',
    negocio:  v => v.length >= 2 || 'Escribe el nombre de tu negocio.',
    email:    v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Revisa tu email.',
  };

  function validateField(field) {
    const check = checks[field.name];
    if (!check) return true;
    const result = check(field.value.trim());
    const ok = result === true;
    field.classList.toggle('is-invalid', !ok);
    field.setAttribute('aria-invalid', String(!ok));
    return ok ? true : result;
  }

  Object.keys(checks).forEach(name => {
    const field = form.elements[name];
    field.addEventListener('blur', () => { if (field.value.trim()) validateField(field); });
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) validateField(field);
      if (!started) { started = true; track('cta', 'form_start'); }
    });
  });

  function serviceLabel() {
    const select = form.elements.servicio;
    return select.value ? select.options[select.selectedIndex].text : 'Asesoría general';
  }

  function whatsappSummary(d) {
    return [
      'Hola, quiero mi diagnóstico gratuito.',
      `Nombre: ${d.nombre}`,
      `Negocio: ${d.negocio}`,
      `Me interesa: ${d.servicio_texto}`,
      d.mensaje && `Detalles: ${d.mensaje}`,
    ].filter(Boolean).join('\n');
  }

  function showSuccess(link, viaWhatsapp) {
    const title = viaWhatsapp ? '¡Ya casi! Envía tu mensaje' : '¡Recibimos tus datos!';
    const text = viaWhatsapp
      ? 'Abrimos WhatsApp con tu información lista. Solo presiona enviar y te respondemos en menos de 2 horas hábiles.'
      : 'Te contactaremos por WhatsApp en menos de 2 horas hábiles. Si quieres adelantar, escríbenos ahora.';
    form.innerHTML = `
      <div class="form-success" role="status">
        <div class="form-success__icon" aria-hidden="true">✓</div>
        <h3>${title}</h3>
        <p>${text}</p>
        <a href="${link}" target="_blank" rel="noopener" class="btn btn--primary" data-track="whatsapp_success">
          ${viaWhatsapp ? 'Abrir WhatsApp' : 'Escribir por WhatsApp'} →
        </a>
      </div>`;
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');

    // Honeypot: bots fill every field.
    if (form.elements.website.value) return;

    const errors = Object.keys(checks)
      .map(name => ({ field: form.elements[name], res: validateField(form.elements[name]) }))
      .filter(r => r.res !== true);
    if (errors.length) {
      showError(errors[0].res);
      errors[0].field.focus();
      return;
    }

    const data = {
      nombre:   form.elements.nombre.value.trim(),
      telefono: form.elements.telefono.value.trim(),
      negocio:  form.elements.negocio.value.trim(),
      email:    form.elements.email.value.trim(),
      servicio: form.elements.servicio.value || 'asesoria',
      servicio_texto: serviceLabel(),
      mensaje:  form.elements.mensaje.value.trim(),
      pagina:   location.href,
      fecha:    new Date().toISOString(),
      ...attribution,
    };
    const link = waUrl(whatsappSummary(data));

    track('lead', 'form_submit', { service: data.servicio });

    // No endpoint configured: hand the lead over through WhatsApp.
    // window.open runs synchronously inside the click so popup blockers allow it.
    if (!CONFIG.leadEndpoint) {
      showSuccess(link, true);
      // ('noopener' would make window.open return null, so detach the opener by hand.)
      const win = window.open(link, '_blank');
      if (win) win.opener = null;
      else location.href = link;
      return;
    }

    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    btn.disabled = true;

    try {
      const res = await fetch(CONFIG.leadEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showSuccess(link, false);
    } catch (err) {
      // Never lose a lead: if the endpoint fails, WhatsApp still works.
      console.error('Lead endpoint failed:', err);
      showSuccess(link, true);
    }
  });
})();


// ---- Active nav link on scroll ----
(function initActiveNav() {
  if (!('IntersectionObserver' in window)) return;
  const navLinks = $$('.nav__links a[href^="#"]:not(.nav__cta)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  $$('section[id]').forEach(sec => observer.observe(sec));
})();


// ---- Subtle parallax on hero orbs (desktop with a mouse only) ----
(function initParallax() {
  const orbs = $$('.hero__orb');
  if (!orbs.length || reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;

  let frame = null;
  window.addEventListener('mousemove', e => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.3;
        orb.style.translate = `${x * factor}px ${y * factor}px`;
      });
      frame = null;
    });
  }, { passive: true });
})();
