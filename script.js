/* ---------- Theme Toggle ---------- */
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

// Set initial theme
document.body.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  const theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
});

/* ---------- Scroll progress + nav ---------- */
const progress = document.getElementById('progress');
const nav = document.getElementById('nav');
const topBtn = document.getElementById('top');

function onScroll(){
  const h = document.documentElement;
  const p = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  progress.style.width = p + '%';
  nav.classList.toggle('scrolled', h.scrollTop > 40);
  topBtn.classList.toggle('show', h.scrollTop > 600);
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

topBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open');
  navLinks.classList.remove('open');
}));

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = Math.min(idx, 5) * 90 + 'ms';
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, {threshold:0.12, rootMargin:'0px 0px -60px 0px'});
revealEls.forEach(el => io.observe(el));

/* ---------- Dynamic Counters (CGPA, Projects, etc.) ---------- */
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    let start = null;
    const dur = 1500;
    function step(ts){
      if(!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if(prog < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    cio.unobserve(el);
  });
}, {threshold:0.5});
counters.forEach(el => cio.observe(el));

/* ---------- Cursor glow ---------- */
const glow = document.getElementById('glow');
if(window.matchMedia('(pointer:fine)').matches){
  let gx = 0, gy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    glow.style.opacity = 1;
  });
  (function loop(){
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseleave', () => glow.style.opacity = 0);
}

/* ---------- Project tilt + spotlight ---------- */
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.transform = `perspective(900px) rotateY(${(px - .5) * 9}deg) rotateX(${(.5 - py) * 9}deg) translateY(-6px)`;
    const inner = card.querySelector('.proj-inner');
    inner.style.setProperty('--x', px * 100 + '%');
    inner.style.setProperty('--y', py * 100 + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});