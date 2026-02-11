/* =========================
   ATHARV MANDLAVDIYA - 2025
   Advanced Features Edition
   ========================= */

(function() {
  'use strict';

  // ==================== BIRTHDAY COUNTDOWN ====================
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

  // ==================== HEADER SCROLL ====================
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ==================== MOBILE MENU ====================
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.textContent = '☰';
      });
    });
  }

  // ==================== SCROLL TO TOP ====================
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('show', window.scrollY > 300);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== FADE IN ON SCROLL ====================
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if (fadeElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => observer.observe(el));
  }

  // ==================== SMOOTH ANCHOR SCROLL ====================
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // ==================== CUSTOM CURSOR ====================
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    // Trail particles
    const trails = [];
    for (let i = 0; i < 5; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.opacity = (0.3 - i * 0.05);
      document.body.appendChild(trail);
      trails.push({ el: trail, x: 0, y: 0 });
    }

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Animate trails
    function animateTrails() {
      let x = mouseX, y = mouseY;
      trails.forEach((trail, i) => {
        const speed = 0.15 - i * 0.02;
        trail.x += (x - trail.x) * speed;
        trail.y += (y - trail.y) * speed;
        trail.el.style.left = trail.x + 'px';
        trail.el.style.top = trail.y + 'px';
        x = trail.x;
        y = trail.y;
      });
      requestAnimationFrame(animateTrails);
    }
    animateTrails();

    // Hover effect
    const hoverElements = document.querySelectorAll('a, button, .skill-card, .achievement-card, .project-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // ==================== READING PROGRESS BAR ====================
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  // ==================== MUSIC PLAYER ====================
  const audio = document.getElementById('bg-music');
  if (audio) {
    // Create player UI
    const player = document.createElement('div');
    player.className = 'music-player paused';
    player.innerHTML = `
      <button class="music-btn" data-tooltip="Play/Pause">
        <svg class="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        <svg class="pause-icon" style="display:none" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <div class="visualizer">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="music-info">
        <span class="music-title">Theme Music</span>
        <span class="music-status">Paused</span>
      </div>
      <input type="range" class="volume-slider" min="0" max="100" value="50" data-tooltip="Volume">
    `;
    document.body.appendChild(player);

    const playBtn = player.querySelector('.music-btn');
    const playIcon = player.querySelector('.play-icon');
    const pauseIcon = player.querySelector('.pause-icon');
    const statusEl = player.querySelector('.music-status');
    const volumeSlider = player.querySelector('.volume-slider');

    // Restore audio state
    const lastTime = localStorage.getItem('audioTime');
    const lastVolume = localStorage.getItem('audioVolume');
    
    if (lastTime) audio.currentTime = parseFloat(lastTime);
    if (lastVolume) {
      audio.volume = parseFloat(lastVolume);
      volumeSlider.value = parseFloat(lastVolume) * 100;
    } else {
      audio.volume = 0.5;
    }

    function updatePlayerUI() {
      if (audio.paused) {
        player.classList.add('paused');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        statusEl.textContent = 'Paused';
      } else {
        player.classList.remove('paused');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        statusEl.textContent = 'Playing';
      }
    }

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
      updatePlayerUI();
    });

    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value / 100;
      localStorage.setItem('audioVolume', audio.volume);
    });

    audio.addEventListener('play', updatePlayerUI);
    audio.addEventListener('pause', updatePlayerUI);

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('audioTime', audio.currentTime);
    });
  }

  // ==================== PARTICLES (Reduced for performance) ====================
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  document.body.appendChild(particlesContainer);

  // Reduced from 30 to 10 particles for better performance
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (20 + Math.random() * 10) + 's';
    particle.style.width = (2 + Math.random() * 3) + 'px';
    particle.style.height = particle.style.width;
    particlesContainer.appendChild(particle);
  }

  // ==================== THEME TOGGLE ====================
  const themeToggle = document.createElement('div');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = `
    <button class="theme-btn active" data-theme="dark" data-tooltip="Dark">🌙</button>
    <button class="theme-btn" data-theme="light" data-tooltip="Light">☀️</button>
  `;
  document.body.appendChild(themeToggle);

  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.querySelector('[data-theme="light"]').classList.add('active');
    themeToggle.querySelector('[data-theme="dark"]').classList.remove('active');
  }

  themeToggle.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      
      themeToggle.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (theme === 'light') {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
      
      localStorage.setItem('theme', theme);
    });
  });

  // ==================== PAGE TRANSITIONS ====================
  const transition = document.createElement('div');
  transition.className = 'page-transition';
  transition.innerHTML = '<div class="loader"></div>';
  document.body.appendChild(transition);

  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#')) {
          e.preventDefault();
          transition.classList.add('active');
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    }
  });

  // ==================== EASTER EGG (Secret Code: AMAM) ====================
  const secretCode = ['a', 'm', 'a', 'm'];
  let codeIndex = 0;

  const easterEgg = document.createElement('div');
  easterEgg.className = 'easter-egg';
  easterEgg.innerHTML = `
    <h2>🎉 You Found It! 🎉</h2>
    <p>You discovered the secret code!</p>
    <p style="font-size: 2rem; font-weight: bold;">A M A M</p>
    <p>Atharv Mandlavdiya's hidden surprise 🚀</p>
    <button class="close-btn">Awesome!</button>
  `;
  document.body.appendChild(easterEgg);

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === secretCode[codeIndex]) {
      codeIndex++;
      if (codeIndex === secretCode.length) {
        easterEgg.classList.add('active');
        createConfetti();
        codeIndex = 0;
      }
    } else {
      codeIndex = 0;
    }
  });

  easterEgg.querySelector('.close-btn').addEventListener('click', () => {
    easterEgg.classList.remove('active');
  });

  function createConfetti() {
    const colors = ['#ff0080', '#7928ca', '#00d4ff', '#e6cf78', '#22c55e'];
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-10px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(confetti);

      const animation = confetti.animate([
        { top: '-10px', opacity: 1 },
        { top: '100vh', opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });

      animation.onfinish = () => confetti.remove();
    }
  }

  // ==================== PROJECT FILTERING ====================
  const projectsGrid = document.querySelector('.projects-grid');
  if (projectsGrid) {
    const projects = projectsGrid.querySelectorAll('.project-card');
    const techs = new Set(['All']);
    
    projects.forEach(project => {
      const tags = project.querySelectorAll('.tech-tag');
      tags.forEach(tag => techs.add(tag.textContent));
    });

    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-buttons';
    
    techs.forEach(tech => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (tech === 'All' ? ' active' : '');
      btn.textContent = tech;
      btn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        projects.forEach(project => {
          if (tech === 'All') {
            project.classList.remove('hidden');
            project.classList.add('show');
          } else {
            const hasTech = Array.from(project.querySelectorAll('.tech-tag'))
              .some(tag => tag.textContent === tech);
            project.classList.toggle('hidden', !hasTech);
            project.classList.toggle('show', hasTech);
          }
        });
      });
      filterContainer.appendChild(btn);
    });

    projectsGrid.parentNode.insertBefore(filterContainer, projectsGrid);
  }

  // ==================== FORM ENHANCEMENT ====================
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      const btn = form.querySelector('.submit-btn');
      if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
      }
    });
  }

  // ==================== SKILL CARDS TILT ====================
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  console.log('🚀 Website loaded with all features!');
  console.log('💡 Try typing: AMAM');
})();
