/* Classic Version JS */
(function() {
  'use strict';

  // Birthday countdown (8 June 2011, 9:08 PM)
  const BIRTH = new Date(2011, 5, 8, 21, 8, 0);

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
    let next = new Date(now.getFullYear(), BIRTH.getMonth(), BIRTH.getDate(), BIRTH.getHours(), BIRTH.getMinutes(), BIRTH.getSeconds());
    
    if (next <= now) next.setFullYear(next.getFullYear() + 1);

    let diff = next - now;
    
    if (diff <= 0) {
      Object.values(els).forEach(el => el.textContent = '00');
      return;
    }

    const days = Math.floor(diff / 86400000); diff %= 86400000;
    const hours = Math.floor(diff / 3600000); diff %= 3600000;
    const minutes = Math.floor(diff / 60000); diff %= 60000;
    const seconds = Math.floor(diff / 1000);

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
