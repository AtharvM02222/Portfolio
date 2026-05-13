/* =========================
   ATHARV MANDLAVDIYA - 2025
   Focused Essentials Edition
   ========================= */

(function() {
  'use strict';

  function updateCountdown() {
    const els = {
      days: document.getElementById('days'),
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds')
    };

    if (!els.days) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    let nextBirthday = new Date(currentYear, 5, 8, 21, 8, 0);

    if (nextBirthday <= now) {
      nextBirthday = new Date(currentYear + 1, 5, 8, 21, 8, 0);
    }

    const diff = nextBirthday - now;
    if (diff <= 0) {
      Object.values(els).forEach((el) => {
        if (!el) return;
        el.style.setProperty('--value', 0);
        el.textContent = '0';
      });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (els.days) {
      els.days.style.setProperty('--value', days);
      els.days.textContent = days;
    }
    if (els.hours) {
      els.hours.style.setProperty('--value', hours);
      els.hours.textContent = hours;
    }
    if (els.minutes) {
      els.minutes.style.setProperty('--value', minutes);
      els.minutes.textContent = minutes;
    }
    if (els.seconds) {
      els.seconds.style.setProperty('--value', seconds);
      els.seconds.textContent = seconds;
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const header = document.querySelector('header');
  if (header) {
    window.addEventListener(
      'scroll',
      () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
      },
      { passive: true }
    );
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.textContent = '☰';
      });
    });
  }

  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener(
      'scroll',
      () => {
        scrollBtn.classList.toggle('show', window.scrollY > 300);
      },
      { passive: true }
    );

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    fadeElements.forEach((el) => observer.observe(el));
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('.submit-btn');
      if (!btn) return;
      btn.textContent = 'Sending...';
      btn.disabled = true;
    });
  }
})();
