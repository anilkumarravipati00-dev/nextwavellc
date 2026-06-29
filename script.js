/* ====================================================================
   NextWave Services LLC — interactions
   ==================================================================== */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header scroll state ---------- */
  const header = $('#siteHeader');
  const toTop = $('#toTop');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    toTop.classList.toggle('show', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const toggle = $('#navToggle');
  const menu = $('#navMenu');
  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  // mobile dropdown accordion (only intercept when collapsed nav is active)
  const drop = $('.has-drop');
  const dropToggle = $('.drop-toggle');
  if (drop && dropToggle) {
    dropToggle.addEventListener('click', e => {
      if (window.matchMedia('(max-width:980px)').matches) {
        e.preventDefault();
        drop.classList.toggle('open');
      }
    });
  }
  $$('#navMenu a:not(.drop-toggle)').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- rotating hero headline + slider dots (Zenith-inspired) ---------- */
  const rots = $$('#heroTitle .rot');
  const dots = $$('#heroDots button');
  if (rots.length > 1) {
    let idx = 0, timer = null;
    const show = (n) => {
      rots[idx].classList.remove('is-active');
      dots[idx] && (dots[idx].classList.remove('on'), dots[idx].setAttribute('aria-selected', 'false'));
      idx = (n + rots.length) % rots.length;
      rots[idx].classList.add('is-active');
      dots[idx] && (dots[idx].classList.add('on'), dots[idx].setAttribute('aria-selected', 'true'));
    };
    const start = () => { if (!reduceMotion) timer = setInterval(() => show(idx + 1), 4500); };
    const restart = () => { clearInterval(timer); start(); };
    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); restart(); }));
    start();
  }

  /* ---------- testimonials marquee: duplicate for seamless loop ---------- */
  const qTrack = document.getElementById('quotesTrack');
  if (qTrack && !reduceMotion) {
    Array.from(qTrack.children).forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      qTrack.appendChild(clone);
    });
  }

  /* ---------- reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const ro = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => ro.observe(el));
  }

  /* ---------- animated counters ---------- */
  const stats = $$('.stat__num');
  const runCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const dur = 1500;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => { if (en.isIntersecting) { runCount(en.target); obs.unobserve(en.target); } });
    }, { threshold: 0.6 });
    stats.forEach(s => so.observe(s));
  } else {
    stats.forEach(runCount);
  }

  /* ---------- signal-line "draw" (signature) ---------- */
  const drawPath = (path) => {
    try {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = reduceMotion ? 0 : len;
      path.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)';
    } catch (e) {/* non-rendered svg */}
  };
  const allPaths = $$('.signal-path');
  allPaths.forEach(drawPath);

  // hero signal draws on load
  const heroPath = $('.hero__signal .signal-path');
  if (heroPath) requestAnimationFrame(() => { heroPath.style.strokeDashoffset = '0'; });

  // divider signals draw when scrolled into view
  if ('IntersectionObserver' in window) {
    const do_ = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const p = $('.signal-path', en.target);
          if (p) p.style.strokeDashoffset = '0';
          en.target.classList.add('on');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    $$('.signal-divider').forEach(d => do_.observe(d));
  } else {
    $$('.signal-divider .signal-path').forEach(p => { p.style.strokeDashoffset = '0'; });
  }

  /* ---------- contact form (front-end only) ---------- */
  const form = $('#contactForm');
  const ok = $('#formOk');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const valid = name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) {
        const bad = !name ? form.name : form.email;
        bad.focus();
        bad.style.borderColor = '#e0564f';
        bad.addEventListener('input', () => { bad.style.borderColor = ''; }, { once: true });
        return;
      }
      ok.hidden = false;
      form.querySelector('button[type="submit"]').textContent = 'Request received ✓';
      form.querySelectorAll('input,select,textarea,button').forEach(el => { el.disabled = true; });
    });
  }

  /* ---------- active nav link on scroll ---------- */
  const sections = ['home', 'about', 'services', 'industries', 'contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  const links = $$('#navMenu .nav__links a');
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = en.target.id;
          links.forEach(l => l.style.color = '');
          const active = links.find(l => l.getAttribute('href') === '#' + id);
          if (active && !header.classList.contains('scrolled')) active.style.color = '#fff';
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- off-canvas quick-contact panel (4-dot grid icon) ---------- */
  const oc = document.getElementById('ocPanel');
  const ocBtn = document.getElementById('navGrid');
  if (oc && ocBtn) {
    const openOc = () => {
      oc.classList.add('open');
      oc.setAttribute('aria-hidden', 'false');
      ocBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const c = oc.querySelector('.oc__close');
      if (c) c.focus();
    };
    const closeOc = () => {
      oc.classList.remove('open');
      oc.setAttribute('aria-hidden', 'true');
      ocBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    ocBtn.addEventListener('click', openOc);
    oc.querySelectorAll('[data-oc-close]').forEach(el => el.addEventListener('click', closeOc));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && oc.classList.contains('open')) closeOc(); });
  }
})();
