/* Global interactions for upgraded homepage */
/* Requires: AOS, Swiper (included in HTML) */

// --- PRELOADER ---
window.addEventListener('load', () => {
  // initialize AOS after load
  AOS.init({duration:800,once:true,offset:100});
  // hide preloader
  const pre = document.getElementById('preloader');
  if(pre){
    pre.style.opacity = '0';
    setTimeout(()=>pre.parentNode.removeChild(pre),700);
  }
  // set year
  document.getElementById('year')?.replaceWith(document.createTextNode(new Date().getFullYear()));
  // start counters
  startCounters();
  // init swiper
  initSwiper();
});

// --- HAMBURGER / MOBILE NAV ---
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger?.addEventListener('click', () => {
  const open = mobileNav.getAttribute('aria-hidden') === 'false';
  mobileNav.setAttribute('aria-hidden', !open);
  mobileNav.style.transform = open ? 'translateY(-8px) scaleY(0.98)' : 'translateY(0)';
  mobileNav.style.display = open ? 'none' : 'block';
});

// close mobile nav on link click
document.querySelectorAll('.mobile-link').forEach(a=>a.addEventListener('click', ()=>{
  mobileNav.style.display='none';
  mobileNav.setAttribute('aria-hidden', true);
}));

// --- SMOOTH SCROLL for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// --- COUNTERS (animated) ---
function startCounters(){
  const counters = document.querySelectorAll('.count');
  counters.forEach(counter => {
    const target = +counter.dataset.target || 0;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 120));
    const update = () => {
      current += step;
      if(current >= target){ counter.innerText = String(target); }
      else { counter.innerText = String(current); requestAnimationFrame(update); }
    };
    // only animate when visible
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          update();
          obs.disconnect();
        }
      });
    }, {threshold:0.6});
    obs.observe(counter);
  });
}

// --- SWIPER INIT for reviews ---
function initSwiper(){
  try {
    const swiper = new Swiper('.reviews-swiper', {
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: true },
      pagination: { el: '.swiper-pagination', clickable: true },
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: { 800: { slidesPerView: 1 } }
    });
  } catch (e){ console.warn('Swiper init failed', e); }
}

// --- FAQ accordion ---
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.nextElementSibling;
    const open = panel.style.display === 'block';
    // close others
    document.querySelectorAll('.faq-a').forEach(a => { a.style.display = 'none'; a.previousElementSibling.querySelector('i').className = 'fas fa-plus'; });
    if(!open){ panel.style.display = 'block'; btn.querySelector('i').className = 'fas fa-minus'; }
  });
});

// --- Newsletter form (very basic validation + fake submit) ---
const newsletter = document.getElementById('newsletterForm');
if(newsletter){
  newsletter.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('nname').value.trim();
    const email = document.getElementById('nemail').value.trim();
    const msg = document.getElementById('newsletterMsg');
    if(!name || !email || !/^\S+@\S+\.\S+$/.test(email)){
      msg.textContent = 'Please provide a valid name and email.';
      msg.style.color = 'crimson';
      return;
    }
    msg.textContent = 'Thanks! Subscribed — we will send updates soon.';
    msg.style.color = '#0a6b3a';
    newsletter.reset();
  });
}

// small a11y & keyboard fallback for hamburger
document.addEventListener('keyup', (e) => {
  if(e.key === 'Escape'){
    mobileNav.style.display='none';
    mobileNav.setAttribute('aria-hidden', true);
  }
});



