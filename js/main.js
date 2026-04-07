/* =========================================================
   PetMyPet — Main JavaScript
   ========================================================= */

// --- Sticky Header ---
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// --- Hamburger Menu ---
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
    hamburger.querySelectorAll('span')[1].style.opacity  = open ? '0' : '1';
    hamburger.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// --- Intersection Observer Fade-In ---
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));
}

// --- Animated Counters ---
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('.stat-number[data-target]');
if (counterEls.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));
}

// --- Carousel Drag Scroll ---
const carouselWrap = document.querySelector('.carousel-track-wrap');
if (carouselWrap) {
  let isDown = false, startX, scrollLeft;
  carouselWrap.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - carouselWrap.offsetLeft;
    scrollLeft = carouselWrap.scrollLeft;
  });
  carouselWrap.addEventListener('mouseleave', () => { isDown = false; });
  carouselWrap.addEventListener('mouseup', () => { isDown = false; });
  carouselWrap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carouselWrap.offsetLeft;
    carouselWrap.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
  // Arrow nav
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { carouselWrap.scrollBy({ left: -240, behavior: 'smooth' }); });
  if (nextBtn) nextBtn.addEventListener('click', () => { carouselWrap.scrollBy({ left: 240, behavior: 'smooth' }); });
}

// --- Waitlist Forms ---
document.querySelectorAll('.waitlist-form, .hero-waitlist').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value) return;
    input.value = '';
    // Show success message if present
    const successEl = form.closest('section')?.querySelector('.waitlist-success') ||
                      form.parentElement?.querySelector('.waitlist-success');
    if (successEl) {
      successEl.style.display = 'block';
      setTimeout(() => { successEl.style.display = 'none'; }, 4000);
    } else {
      const msg = document.createElement('p');
      msg.textContent = "🎉 You're on the list! We'll be in touch.";
      msg.style.cssText = 'color:#A9B388;font-weight:700;font-family:Nunito,sans-serif;margin-top:12px;';
      form.after(msg);
      setTimeout(() => msg.remove(), 4000);
    }
  });
});

// --- FAQ Accordion (inner pages) ---
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// --- TOC Active Link (inner pages) ---
const tocLinks = document.querySelectorAll('.inner-toc a');
if (tocLinks.length) {
  const sections = Array.from(tocLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const tocObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        tocLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.inner-toc a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(s => tocObserver.observe(s));
}
