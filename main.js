(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], streams = [], time = 0;
  const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.life = Math.random();
      this.maxLife = 0.6 + Math.random() * 0.4;
      this.r  = 1 + Math.random() * 2;
      this.type = Math.random() > 0.3 ? 'blue' : 'white';
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life += 0.003;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      const alpha = Math.sin(this.life / this.maxLife * Math.PI) * 0.7;
      ctx.save();
      ctx.globalAlpha = alpha;
      if (this.type === 'blue') {
        ctx.shadowBlur = 8; ctx.shadowColor = isDark() ? '#38c5ff' : '#0077cc';
        ctx.fillStyle  = isDark() ? '#38c5ff' : '#0077cc';
      } else {
        ctx.shadowBlur = 6; ctx.shadowColor = '#ffffff';
        ctx.fillStyle  = isDark() ? 'rgba(255,255,255,0.8)' : 'rgba(100,160,220,0.8)';
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Stream {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.len = 80 + Math.random() * 180;
      this.angle = Math.random() * Math.PI * 2;
      this.vAngle = (Math.random() - 0.5) * 0.005;
      this.speed = 0.3 + Math.random() * 0.5;
      this.life = 0;
      this.maxLife = 1;
      this.width = 1 + Math.random() * 2;
      this.alpha = 0.08 + Math.random() * 0.18;
    }
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.angle += this.vAngle;
      this.life += 0.004;
      if (this.life >= this.maxLife || this.x < -50 || this.x > W + 50 || this.y < -50 || this.y > H + 50)
        this.reset();
    }
    draw() {
      const a = Math.sin(this.life / this.maxLife * Math.PI) * this.alpha;
      const grd = ctx.createLinearGradient(
        this.x, this.y,
        this.x + Math.cos(this.angle) * this.len,
        this.y + Math.sin(this.angle) * this.len
      );
      const c = isDark() ? '56,197,255' : '0,119,204';
      grd.addColorStop(0, `rgba(${c},0)`);
      grd.addColorStop(0.3, `rgba(${c},${a})`);
      grd.addColorStop(0.7, `rgba(${c},${a * 0.6})`);
      grd.addColorStop(1, `rgba(${c},0)`);
      ctx.save();
      ctx.strokeStyle = grd;
      ctx.lineWidth = this.width;
      ctx.shadowBlur = 12;
      ctx.shadowColor = isDark() ? 'rgba(56,197,255,0.4)' : 'rgba(0,119,204,0.3)';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x + Math.cos(this.angle) * this.len,
        this.y + Math.sin(this.angle) * this.len
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  class Spark {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = (Math.random() - 0.5) * 3;
      this.life = 0;
      this.maxLife = 0.3 + Math.random() * 0.4;
      this.size = 2 + Math.random() * 4;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vx *= 0.97; this.vy *= 0.97;
      this.life += 0.015;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      const a = (1 - this.life / this.maxLife) * 0.6;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.shadowBlur = 10; ctx.shadowColor = isDark() ? '#38c5ff' : '#0077cc';
      ctx.fillStyle = isDark() ? '#a0e8ff' : '#5cb0ff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * (1 - this.life / this.maxLife), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    particles = Array.from({length: 60}, () => new Particle());
    streams   = Array.from({length: 18}, () => { const s = new Stream(); s.life = Math.random(); return s; });
    sparks    = Array.from({length: 25}, () => { const sp = new Spark(); sp.life = Math.random(); return sp; });
  }
  let sparks = [];

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (isDark()) {
      ctx.fillStyle = 'rgba(4,8,15,0.15)';
    } else {
      ctx.fillStyle = 'rgba(220,235,255,0.15)';
    }
    ctx.fillRect(0, 0, W, H);

    streams.forEach(s => { s.update(); s.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });
    sparks.forEach(sp => { sp.update(); sp.draw(); });

    time++;
    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();
  window.addEventListener('resize', () => { resize(); });
})();

const html = document.documentElement;
let isDark = (localStorage.getItem('glrx-theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';

function applyTheme(dark) {
  isDark = dark;
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  const icon = dark ? '☀️' : '🌙';
  document.getElementById('themeIcon').textContent = icon;
  const mIcon = document.getElementById('mobileThemeIcon');
  if (mIcon) mIcon.textContent = icon;
  localStorage.setItem('glrx-theme', dark ? 'dark' : 'light');
}
applyTheme(isDark);
document.getElementById('themeToggle').addEventListener('click', () => applyTheme(!isDark));
const mobileToggle = document.getElementById('mobileThemeToggle');
if (mobileToggle) mobileToggle.addEventListener('click', () => applyTheme(!isDark));

const sideNav = document.getElementById('side-nav');
let navExpanded = false;

const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item[data-section]');

const mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-section]');

function setActiveNav() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= window.innerHeight * 0.5) current = sec.id;
  });
  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.section === current);
  });
  mobileNavItems.forEach(item => {
    item.classList.toggle('active', item.dataset.section === current);
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

document.querySelectorAll('[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
  });
});

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.currentTarget.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.transform = `scaleX(${bar.dataset.width / 100})`;
      });
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.glass-card').forEach(c => { if (c.querySelector('.skill-fill')) skillObs.observe(c); });

const filterBar = document.getElementById('filterBar');
if (filterBar) {
  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(c => {
      c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none';
    });
  });
}

document.querySelectorAll('.carousel-thumb[data-carousel]').forEach(thumb => {
  const track = thumb.querySelector('.carousel-track');
  const slides = thumb.querySelectorAll('.carousel-slide');
  const dots   = thumb.querySelectorAll('.carousel-dot');
  const prev   = thumb.querySelector('.carousel-prev');
  const next   = thumb.querySelector('.carousel-next');
  if (!slides.length) return;
  let idx = 0;

  function go(i) {
    idx = (i + slides.length) % slides.length;
    track.style.width = `${slides.length * 100}%`;
    slides.forEach(s => s.style.width = `${100 / slides.length}%`);
    track.style.transform = `translateX(-${idx * (100 / slides.length)}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === idx));
  }
  track.style.width = `${slides.length * 100}%`;
  slides.forEach(s => s.style.width = `${100 / slides.length}%`);

  if (prev) prev.addEventListener('click', e => { e.stopPropagation(); go(idx - 1); });
  if (next) next.addEventListener('click', e => { e.stopPropagation(); go(idx + 1); });
  dots.forEach((d, di) => d.addEventListener('click', e => { e.stopPropagation(); go(di); }));
});

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const ok  = document.getElementById('statusSuccess');
    const err = document.getElementById('statusError');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Sending…';
    ok.classList.remove('visible'); err.classList.remove('visible');
    try {
      const res = await fetch(form.action, {
        method: 'POST', headers: {'Accept':'application/json'},
        body: new FormData(form)
      });
      if (res.ok) { ok.classList.add('visible'); form.reset(); }
      else err.classList.add('visible');
    } catch { err.classList.add('visible'); }
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'Send Message';
  });
}

function tick() {
  const el = document.getElementById('clock-footer');
  if (!el) return;
  el.textContent = new Date().toTimeString().slice(0,8);
}
tick(); setInterval(tick, 1000);

