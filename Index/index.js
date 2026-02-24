/* Classic Version JS */
(function() {
  'use strict';

  // Birthday countdown (8 June, 9:08 PM)
  function pad(v) {
    return String(v).padStart(2, '0');
  }

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
    
    // Create next birthday (June 8 at 9:08 PM)
    let nextBirthday = new Date(currentYear, 5, 8, 21, 8, 0);
    
    // If birthday has passed this year, set to next year
    if (nextBirthday <= now) {
      nextBirthday = new Date(currentYear + 1, 5, 8, 21, 8, 0);
    }

    const diff = nextBirthday - now;
    
    if (diff <= 0) {
      Object.values(els).forEach(el => el.textContent = '00');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Scroll to top button
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('show', window.scrollY > 300);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Audio handling
  const audio = document.getElementById('bg-music');
  if (audio) {
    const lastTime = localStorage.getItem('lastPlayedTime');
    if (lastTime) {
      audio.currentTime = parseFloat(lastTime);
    }
    audio.play().catch(() => {});

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('lastPlayedTime', audio.currentTime);
    });
  }

  console.log('🎨 Classic version loaded!');
})();
