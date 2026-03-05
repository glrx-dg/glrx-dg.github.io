
const html      = document.documentElement;
const metaTheme = document.getElementById('meta-theme');
const themeIcon  = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

let isDark = (
  localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
) === 'dark';

function applyTheme(dark) {
  isDark = dark;
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  if (themeIcon)  themeIcon.textContent  = dark ? '☀️' : '🌙';
  if (themeLabel) themeLabel.textContent = dark ? 'LIGHT' : 'DARK';
  if (metaTheme)  metaTheme.content      = dark ? '#000000' : '#faebd7';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

applyTheme(isDark);

document.getElementById('themeToggle')
  .addEventListener('click', () => applyTheme(!isDark));

window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', e => {
    if (!localStorage.getItem('theme')) applyTheme(e.matches);
  });

const hamburger  = document.getElementById('hamburger');
const navMenu    = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu(open) {
  hamburger.classList.toggle('active', open);
  navMenu.classList.toggle('active', open);
  navOverlay.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () =>
  toggleMenu(!hamburger.classList.contains('active'))
);
hamburger.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ')
    toggleMenu(!hamburger.classList.contains('active'));
});
navOverlay.addEventListener('click', () => toggleMenu(false));
document.querySelectorAll('.nav-menu a')
  .forEach(a => a.addEventListener('click', () => toggleMenu(false)));

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage ||
     (currentPage === '' && href === 'index.html') ||
     (currentPage === 'index.html' && href === 'index.html')) {
    a.classList.add('active');
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.anim').forEach(el => observer.observe(el));

function tick() {
  const el = document.getElementById('clock-footer');
  if (!el) return;
  el.textContent = [
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getSeconds()
  ].map(n => String(n).padStart(2, '0')).join(':');
}
tick();
setInterval(tick, 1000);

function animateSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const w = bar.dataset.width;
    setTimeout(() => { bar.style.transform = `scaleX(${w / 100})`; }, 300);
  });
}

if (document.querySelector('.skill-bar-fill')) {

  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) animateSkillBars(); });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));
}

const filterBar = document.getElementById('filterBar');
if (filterBar) {
  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.style.display = match ? '' : 'none';
    });
  });

}
 document.querySelectorAll('.social-menu a').forEach(link => {
      link.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top  = (e.clientY - rect.top)  + 'px';
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });

     const form       = document.getElementById('contactForm');
    const submitBtn  = document.getElementById('submitBtn');
    const statusOk   = document.getElementById('statusSuccess');
    const statusErr  = document.getElementById('statusError');


    form.addEventListener('submit', async function(e) {
    e.preventDefault();
    statusOk.classList.remove('visible');
    statusErr.classList.remove('visible');

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message || !emailRe.test(email)) {
    statusErr.classList.add('visible');
    return;
  }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      statusOk.classList.add('visible');
      form.reset();
    } else {
      statusErr.classList.add('visible');
    }
    } catch {
    statusErr.classList.add('visible');
    } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});
