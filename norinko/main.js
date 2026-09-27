/* ================================================
   NORINKO PERFORMANCE — Interacciones
   ================================================ */

// Número de WhatsApp (formato internacional, sin + ni espacios)
const WHATSAPP_NUMBER = '526561278916';

(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  // ---- Nav: fondo al hacer scroll ----
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Menú móvil ----
  const burger = $('#burger');
  const links = $('#nav-links');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    links.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', links).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ---- Reveal al hacer scroll ----
  const revealTargets = $$('.reveal, .split__media');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Contadores del hero ----
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    setTimeout(() => requestAnimationFrame(tick), 500);
  });

  // ---- Paquetes: preseleccionar servicio en el formulario ----
  const serviceSelect = $('#f-service');
  $$('[data-interest]').forEach((a) => {
    a.addEventListener('click', () => {
      const value = a.dataset.interest;
      const opt = $$('option', serviceSelect).find((o) => o.value === value || o.textContent === value);
      if (opt) serviceSelect.value = opt.value;
    });
  });

  // ---- Formulario → WhatsApp ----
  const form = $('#quote-form');
  const error = $('#form-error');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const required = ['#f-name', '#f-phone', '#f-car', '#f-service'].map((s) => $(s, form));
    let valid = true;
    required.forEach((field) => {
      const ok = field.value.trim() !== '';
      field.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });
    error.hidden = valid;
    if (!valid) { required.find((f) => f.classList.contains('is-invalid')).focus(); return; }

    const data = new FormData(form);
    const lines = [
      'Hola Norinko Performance, quiero cotizar un proyecto:',
      '',
      `• Nombre: ${data.get('name').trim()}`,
      `• WhatsApp: ${data.get('phone').trim()}`,
      `• Vehículo: ${data.get('car').trim()}`,
      `• Servicio: ${data.get('service')}`,
    ];
    if (data.get('budget')) lines.push(`• Presupuesto: ${data.get('budget')}`);
    const msg = (data.get('message') || '').trim();
    if (msg) lines.push('', msg);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  });
  $$('input, select', form).forEach((f) => f.addEventListener('input', () => f.classList.remove('is-invalid')));

  // ---- WhatsApp flotante con mensaje ----
  $('#wa-float').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola Norinko Performance, quiero información sobre sus servicios.')}`;

  // ---- Año del footer ----
  $('#year').textContent = new Date().getFullYear();
})();
