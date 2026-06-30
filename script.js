/* WHALE TECH — site interactions
   Vanilla JS, no frameworks. */

(function () {
  'use strict';

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('site-header');
  let lastScroll = 0;
  function onScroll() {
    const y = window.scrollY;
    if (y > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
    lastScroll = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  function setNavOpen(open) {
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      mobileNav.hidden = false;
    } else {
      // delay so the click on a link registers before we hide
      setTimeout(() => { mobileNav.hidden = true; }, 200);
    }
  }

  navToggle.addEventListener('click', () => {
    const isOpen = !mobileNav.hidden;
    setNavOpen(!isOpen);
  });

  // Close mobile nav after clicking a link
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setNavOpen(false));
  });

  // Close mobile nav on resize back to desktop
  const mq = window.matchMedia('(min-width: 861px)');
  mq.addEventListener('change', (e) => {
    if (e.matches) setNavOpen(false);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.card, .subcard, .stat, .why-card, .mv-block, .section-header, .section-lede, .what-you-get, .license-block, .contact-info, .contact-form, .hero-inner'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    revealTargets.forEach(el => io.observe(el));
  } else {
    // Fallback: show everything
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Smooth-scroll offset for sticky header ---------- */
  const headerHeight = () => header.getBoundingClientRect().height;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === '#top') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = headerHeight() + 8;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------- Contact form (Formspree AJAX) ---------- */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const errorBox = document.getElementById('formError');
  const submitBtn = document.getElementById('formSubmit');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Hide any previous status
      if (success) success.hidden = true;
      if (errorBox) errorBox.hidden = true;

      // Native validity check
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Honeypot — if filled, silently bail
      const gotcha = form.querySelector('input[name="_gotcha"]');
      if (gotcha && gotcha.value) return;

      // Lock the button
      const originalText = submitBtn ? submitBtn.textContent : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' },
        });

        if (res.ok) {
          if (success) success.hidden = false;
          form.reset();
          if (submitBtn) submitBtn.textContent = 'Sent ✓';
          // Restore after a delay so user can send another if they want
          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
            }
          }, 6000);
        } else {
          // Formspree returns 4xx with JSON { errors: [...] }
          let msg = 'Submission failed.';
          try {
            const body = await res.json();
            if (body && Array.isArray(body.errors) && body.errors.length) {
              msg = body.errors.map(e => e.message || e).join(' ');
            }
          } catch (_) { /* ignore */ }
          if (errorBox) {
            errorBox.hidden = false;
            errorBox.querySelector('strong').nextSibling.nodeValue = ' ' + msg + ' You can also email us directly at ';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        }
      } catch (err) {
        if (errorBox) errorBox.hidden = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }

  /* ---------- Year stamp (in case footer uses it later) ---------- */
  const yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
