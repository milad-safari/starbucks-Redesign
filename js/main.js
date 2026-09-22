/* ===========================
   BREW & BOTANICALS – SHARED JS
=========================== */

// ---- Scroll reveal ----
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ---- Steam particle canvas ----
function initSteam(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size  = Math.random() * 18 + 6;
      this.speedY = Math.random() * 0.6 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.life   = 0;
      this.maxLife = Math.random() * 220 + 160;
      this.wobble = Math.random() * Math.PI * 2;
    }
    update() {
      this.life++;
      this.wobble += 0.018;
      this.x += Math.sin(this.wobble) * 0.5 + this.speedX;
      this.y -= this.speedY;
      if (this.life > this.maxLife || this.y < -30) this.reset();
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.22;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,232,216,${alpha})`;
      ctx.fill();
    }
  }

  function init() {
    particles = Array.from({ length: 55 }, () => {
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      return p;
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', () => { resize(); });
  init();
  loop();

  return () => cancelAnimationFrame(animId);
}

// ---- Mobile menu ----
function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const menu      = document.querySelector('.mobile-menu');
  const close     = document.querySelector('.mobile-close');
  if (!hamburger || !menu) return;
  hamburger.addEventListener('click', () => menu.classList.add('open'));
  close && close.addEventListener('click', () => menu.classList.remove('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

// ---- Nav scroll effect ----
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(15,20,16,0.97)';
    } else {
      nav.style.background = 'rgba(15,20,16,0.85)';
    }
  });
}

// ---- Active nav link ----
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });
}

// ---- Tab system ----
function initTabs() {
  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.dataset.tabGroup;
      const target = tab.dataset.tab;
      document.querySelectorAll(`[data-tab-group="${group}"]`).forEach(t => t.classList.remove('active'));
      document.querySelectorAll(`[data-tab-content="${group}"]`).forEach(c => {
        c.style.display = c.dataset.tab === target ? 'grid' : 'none';
        if (c.dataset.tab === target) setTimeout(() => c.querySelectorAll('.reveal').forEach(r => r.classList.add('visible')), 50);
      });
      tab.classList.add('active');
    });
  });
}

// ---- Counter animation ----
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseInt(el.dataset.count);
      let start = 0;
      const dur = 1600;
      const step = end / (dur / 16);
      const timer = setInterval(() => {
        start += step;
        el.textContent = Math.floor(start).toLocaleString();
        if (start >= end) { el.textContent = end.toLocaleString(); clearInterval(timer); }
      }, 16);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

// ---- Init all on DOM ready ----
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initMobileMenu();
  initNavScroll();
  setActiveNav();
  initTabs();
  initCounters();
});
