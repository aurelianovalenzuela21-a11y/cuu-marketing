/* ================================================
   CANTINA TODOS SANTOS — motion
   GSAP + ScrollTrigger. Si GSAP no carga o el usuario
   pide movimiento reducido, el sitio queda estático y legible.
   ================================================ */

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const loader = document.getElementById('loader');
  const nav = document.getElementById('nav');

  /* ---------- Preloader ---------- */
  const loaderMin = new Promise((r) => setTimeout(r, reduced ? 0 : 1300));
  const pageLoaded = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })));
  const contentReady = new Promise((r) => (window.__tsReady ? r() : document.addEventListener('ts:ready', r, { once: true })));

  /* ---------- Nav: fondo al hacer scroll, se esconde al bajar ---------- */
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > 400 && y > lastY && !document.getElementById('nav-links').classList.contains('is-open'));
    lastY = y;
  }, { passive: true });

  /* ---------- Luz del hero y cursor ---------- */
  const hero = document.querySelector('.hero');
  const cursor = document.getElementById('cursor');
  if (finePointer && !reduced) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add('is-visible');
      const r = hero.getBoundingClientRect();
      if (e.clientY < r.bottom) {
        hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
        hero.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
    }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    (function follow() {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(follow);
    })();
    document.addEventListener('pointerover', (e) => {
      cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .trophy, .event'));
    });
  }

  /* ---------- Botones magnéticos ---------- */
  function magnetize(root) {
    if (!finePointer || reduced) return;
    root.querySelectorAll('.magnetic:not([data-mag])').forEach((el) => {
      el.dataset.mag = '1';
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
        el.style.transform = '';
        setTimeout(() => (el.style.transition = ''), 600);
      });
    });
  }

  /* ---------- Títulos palabra por palabra ---------- */
  function splitTitles() {
    document.querySelectorAll('[data-split]').forEach((el) => {
      const walk = (node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === 3) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.append(' '); return; }
              const line = document.createElement('span');
              line.className = 'split-line';
              const word = document.createElement('span');
              word.className = 'split-word';
              word.textContent = part;
              line.append(word);
              frag.append(line);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === 1) {
            walk(child);
          }
        });
      };
      walk(el);
    });
  }

  /* ---------- Animaciones con GSAP ---------- */
  function animate() {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    splitTitles();

    // Entrada del hero
    const intro = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.4 } });
    intro
      .from('.hero__wordmark svg', { clipPath: 'inset(0 100% 0 0)', duration: 1.8, ease: 'power4.inOut' })
      .from('.hero .kicker', { y: 20, opacity: 0 }, 0.4)
      .from('.hero__tagline', { y: 30, opacity: 0 }, 0.9)
      .from('.hero__actions .btn', { y: 30, opacity: 0, stagger: 0.12 }, 1.0)
      .from('.feature', { x: 80, rotate: 4, opacity: 0, duration: 1.6 }, 0.5)
      .from('.hero__stag', { scale: 0.85, opacity: 0, duration: 2.4 }, 0)
      .from('.nav__inner', { y: -40, opacity: 0, duration: 1 }, 0.8);

    // Títulos
    gsap.utils.toArray('[data-split]').forEach((el) => {
      gsap.from(el.querySelectorAll('.split-word'), {
        yPercent: 110, rotate: 4, duration: 1.2, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    // Bloques que aparecen (fuera del hero, que ya tiene su intro)
    ScrollTrigger.batch('main > section:not(.hero) [data-reveal]', {
      start: 'top 88%',
      onEnter: (els) => gsap.from(els, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
      once: true,
    });

    // Parallax
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax);
      gsap.to(el, {
        yPercent: speed * 100, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // Sello de La Casa
    gsap.from('.casa__seal', {
      scale: 0.7, opacity: 0, rotate: -40, duration: 1.8, ease: 'expo.out',
      scrollTrigger: { trigger: '.casa', start: 'top 70%' },
    });

    // Programa semanal
    gsap.from('.week__day', {
      y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: '.week', start: 'top 85%' },
    });

    // Trofeos: entran como piezas colgadas en la pared
    gsap.from('.trophy', {
      y: 80, rotateX: -35, transformOrigin: '50% 0%', opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.09,
      scrollTrigger: { trigger: '.trophies', start: 'top 85%' },
    });

    // Cartelera: scroll horizontal fijado en escritorio
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const track = document.getElementById('events-list');
      if (track.scrollWidth <= window.innerWidth * 1.1) return;
      track.classList.add('is-pinned');
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: '.cartelera', pin: '.cartelera__pin', start: 'top top',
          end: () => `+=${distance()}`, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
      return () => { tween.scrollTrigger?.kill(); tween.kill(); track.classList.remove('is-pinned'); gsap.set(track, { clearProps: 'x' }); };
    });
    mm.add('(max-width: 1023px)', () => {
      gsap.from('.event', { x: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.events', start: 'top 85%' } });
    });

    // Cambio de categoría del menú
    document.addEventListener('ts:menu', () => {
      gsap.from('#menu-panel .menu-panel__head, #menu-panel .dish', { y: 24, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.04 });
    });

    // Las imágenes de flyers cambian alturas: recalcular
    window.addEventListener('load', () => ScrollTrigger.refresh());
    return intro;
  }

  /* ---------- Arranque ---------- */
  Promise.all([contentReady, Promise.race([pageLoaded, new Promise((r) => setTimeout(r, 2500))]), loaderMin]).then(() => {
    magnetize(document);
    const canAnimate = !reduced && window.gsap && window.ScrollTrigger;
    let intro;
    if (canAnimate) {
      intro = animate();
      intro.pause();
    }
    loader?.classList.add('is-done');
    if (intro) setTimeout(() => intro.play(), 250);
  });

  /* ---------- Menú móvil ---------- */
  document.getElementById('burger')?.addEventListener('click', () => {
    document.body.style.overflow = document.getElementById('nav-links').classList.contains('is-open') ? 'hidden' : '';
  });
  document.getElementById('nav-links')?.addEventListener('click', (e) => {
    if (e.target.closest('a')) document.body.style.overflow = '';
  });
})();
