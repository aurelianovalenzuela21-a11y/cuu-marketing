/* ================================================
   CUU MARKETING — main.js
   Interactions, animations, counters, slider
   ================================================ */

'use strict';

// ---- Helpers ----
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ---- NAV scroll effect ----
(function initNav() {
  const nav    = $('#nav');
  const burger = $('#burger-btn');
  const links  = $('#nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close menu on link click
  $$('a', links).forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();


// ---- Smooth scroll for anchor links ----
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = document.getElementById(a.getAttribute('href').slice(1));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


// ---- Reveal on scroll (Intersection Observer) ----
(function initReveal() {
  $$('.service-card, .price-card, .pillar, .process__step, .testimonial-card, .stat-card, .compare-row').forEach((el, i) => {
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


// ---- Counter animation ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const tick = () => {
    step++;
    current = Math.min(Math.round(increment * step), target);

    // Format large numbers
    let display = current;
    if (target >= 10000) {
      display = current.toLocaleString('es-MX');
    }

    el.textContent = prefix + display + suffix;

    if (step < steps) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = prefix + target.toLocaleString('es-MX') + suffix;
    }
  };

  requestAnimationFrame(tick);
}

(function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('[data-target]', entry.target).forEach(animateCounter);
        // Also run on the element itself if it has data-target
        if (entry.target.hasAttribute('data-target')) {
          animateCounter(entry.target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  $$('.stats__grid, .hero__visual').forEach(el => observer.observe(el));
  $$('.stat-card__num').forEach(el => {
    const wrapper = el.closest('.stats__grid') || el.closest('.stat-card');
    if (wrapper) return; // handled by parent
    observer.observe(el);
  });
})();


// ---- Testimonials slider ----
(function initSlider() {
  const slider = $('#testimonials-slider');
  const dots   = $$('.dot');
  const prevBtn = $('#prev-btn');
  const nextBtn = $('#next-btn');
  const cards   = $$('.testimonial-card');

  if (!slider || !cards.length) return;

  let current = 0;
  let autoplay;
  const visibleCount = window.innerWidth <= 768 ? 1 : 2;
  const maxIndex = cards.length - visibleCount;

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = cards[0].offsetWidth + 20; // gap = 20px
    slider.style.transform = `translateX(-${current * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('dot--active', i === current));
  }

  function startAutoplay() {
    autoplay = setInterval(() => {
      goTo(current >= maxIndex ? 0 : current + 1);
    }, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  prevBtn.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
  nextBtn.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });

  dots.forEach((d, i) => {
    d.addEventListener('click', () => { stopAutoplay(); goTo(i); startAutoplay(); });
  });

  // Touch / swipe
  let startX = 0;
  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    startAutoplay();
  }, { passive: true });

  startAutoplay();

  // Recalculate on resize
  window.addEventListener('resize', () => {
    goTo(0);
  }, { passive: true });
})();


// ---- Contact form ----
(function initForm() {
  const form    = $('#contact-form');
  if (!form) return;

  const btnText    = $('#form-submit-text');
  const btnLoading = $('#form-submit-loading');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    let valid = true;
    $$('[required]', form).forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#FF4444';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Simulate sending
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    form.querySelector('button[type="submit"]').disabled = true;

    await new Promise(r => setTimeout(r, 1800));

    // Success state
    form.innerHTML = `
      <div style="text-align:center; padding:40px 20px; display:flex; flex-direction:column; align-items:center; gap:20px;">
        <div style="width:72px;height:72px;background:rgba(0,200,150,0.12);border:2px solid var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;">✓</div>
        <h3 style="font-family:var(--font-head);font-size:1.4rem;font-weight:700;color:var(--white);">¡Mensaje enviado!</h3>
        <p style="color:var(--gray-2);font-size:0.9rem;max-width:300px;line-height:1.6;">Te contactaremos en menos de 2 horas hábiles. ¡Prepárate para hacer crecer tu negocio! 🚀</p>
        <a href="https://wa.me/526141234567" target="_blank" class="btn btn--primary" style="margin-top:8px;">
          También por WhatsApp →
        </a>
      </div>
    `;
  });

  // Real-time validation feedback
  $$('[required]', form).forEach(field => {
    field.addEventListener('blur', () => {
      field.style.borderColor = field.value.trim()
        ? 'rgba(0,200,150,0.4)'
        : '#FF4444';
    });
    field.addEventListener('input', () => {
      if (field.value.trim()) field.style.borderColor = '';
    });
  });
})();


// ---- Chart bars animate in ----
(function initCharts() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.chart__bar', entry.target).forEach((bar, i) => {
          bar.style.animation = `bar-grow 0.8s ${i * 100}ms cubic-bezier(0.4,0,0.2,1) both`;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  $$('.dashboard-card').forEach(el => observer.observe(el));
})();


// ---- Typing animation for AI message ----
(function initAiTyping() {
  const msgs = [
    'Incrementar pauta en Instagram Stories',
    'Publicar contenido los martes y jueves',
    'Optimizar keywords en Google Ads',
    'Crear campaña de retargeting',
    'Lanzar oferta de temporada',
  ];

  const el = $('.ai__msg');
  if (!el) return;

  let msgIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function type() {
    const current = msgs[msgIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

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

    typingTimeout = setTimeout(type, delay);
  }

  // Start typing after a short delay
  setTimeout(type, 1500);
})();


// ---- Stats section counters (dedicated) ----
(function initStatsCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.stat-card__num', entry.target).forEach(el => animateCounter(el));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = $('.stats');
  if (statsSection) observer.observe(statsSection);

  // Hero dashboard counters
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.stat__val', entry.target).forEach(el => animateCounter(el));
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const dashCard = $('.dashboard-card');
  if (dashCard) heroObserver.observe(dashCard);
})();


// ---- Active nav link on scroll ----
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav__links a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === '#' + entry.target.id;
          link.style.color = isActive && !link.classList.contains('nav__cta')
            ? 'var(--orange)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => observer.observe(sec));
})();


// ---- Parallax subtle on hero orbs ----
(function initParallax() {
  const orbs = $$('.hero__orb');
  if (!orbs.length) return;

  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.3;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });
})();


console.log('%c🚀 CUU Marketing — Powered by Antigravity AI', 'color:#FF4D00;font-size:14px;font-weight:bold;');
