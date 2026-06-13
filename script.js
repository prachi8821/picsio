/* =============================================
   PICSIO — script.js
   Loader · Cursor · Particles · Scroll · Counter · Slider · Form
============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- LOADING SCREEN ---- */
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  const loaderText = document.getElementById('loaderText');
  const messages = [
    'Loading design assets...',
    'Preparing animations...',
    'Almost ready...',
  ];
  let prog = 0;
  let msgIdx = 0;
  const interval = setInterval(() => {
    prog += Math.random() * 18 + 6;
    if (prog >= 100) { prog = 100; clearInterval(interval); }
    loaderFill.style.width = prog + '%';
    const i = Math.floor((prog / 100) * messages.length);
    if (i !== msgIdx && i < messages.length) {
      msgIdx = i;
      loaderText.textContent = messages[msgIdx];
    }
    if (prog >= 100) {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => { loader.style.display = 'none'; initReveal(); }, 600);
      }, 300);
    }
  }, 80);


  /* ---- CUSTOM CURSOR ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = -100, my = -100;
  let fx = -100, fy = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.14;
    fy += (my - fy) * 0.14;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .why-card, .service-card, .portfolio-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });

  // Hide cursor on mobile
  if (window.matchMedia('(hover: none)').matches) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
  }


  /* ---- PARTICLE CANVAS ---- */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2.2 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.25 + 0.04;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37,99,235,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37,99,235,${0.06 * (1 - dist/110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  /* ---- MOUSE PARALLAX GLOW ---- */
  const heroGlow = document.getElementById('heroGlow');
  document.addEventListener('mousemove', e => {
    if (heroGlow) {
      heroGlow.style.left = e.clientX + 'px';
      heroGlow.style.top = e.clientY + 'px';
    }
  });


  /* ---- NAV SCROLL ---- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }, { passive: true });


  /* ---- HAMBURGER MOBILE MENU ---- */
  const hamburger = document.getElementById('hamburger');
  let mobileMenu = null;

  hamburger.addEventListener('click', () => {
    if (!mobileMenu) {
      mobileMenu = document.createElement('div');
      mobileMenu.className = 'nav-mobile-menu';
      mobileMenu.innerHTML = `
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#contact">Contact</a>
        <a href="#booking" style="color:var(--accent);font-weight:600;border-bottom:none;">Book a Call</a>
      `;
      nav.appendChild(mobileMenu);
    }
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  document.addEventListener('click', e => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (!nav.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    }
  });


  /* ---- SCROLL REVEAL ---- */
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }


  /* ---- ANIMATED COUNTERS ---- */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1600;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current);
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));


  /* ---- PROGRESS BAR (About card) ---- */
  const progFills = document.querySelectorAll('.acm-prog-fill');
  const progObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => {
          el.style.width = el.dataset.width || '100%';
        }, 400);
        progObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  progFills.forEach(p => progObserver.observe(p));


  /* ---- TESTIMONIALS SLIDER ---- */
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let current = 0;
  const total = document.querySelectorAll('.testimonial-card').length;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Auto-slide
  let autoSlide = setInterval(() => goTo(current + 1), 5500);
  const slider = document.getElementById('testimonialsSlider');
  if (slider) {
    slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goTo(current + 1), 5500); });
  }

  // Touch swipe for slider
  let touchStartX = 0;
  if (track) {
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) goTo(current + (dx > 0 ? -1 : 1));
    });
  }


  /* ---- BOOKING FORM ---- */
  const form = document.getElementById('bookingForm');
  const successOverlay = document.getElementById('successOverlay');
  const closeSuccess = document.getElementById('closeSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Basic validation
      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const desc = form.querySelector('[name="description"]').value.trim();

      if (!name || !email || !desc) {
        // Shake effect on empty required fields
        form.querySelectorAll('[required]').forEach(input => {
          if (!input.value.trim()) {
            input.style.borderColor = 'var(--red)';
            input.style.animation = 'shake 0.4s';
            setTimeout(() => {
              input.style.animation = '';
              input.style.borderColor = '';
            }, 600);
          }
        });
        return;
      }

      if (successOverlay) {
        successOverlay.classList.add('show');
        form.reset();
      }
    });
  }

  if (closeSuccess) {
    closeSuccess.addEventListener('click', () => {
      successOverlay.classList.remove('show');
    });
  }

  if (successOverlay) {
    successOverlay.addEventListener('click', e => {
      if (e.target === successOverlay) successOverlay.classList.remove('show');
    });
  }


  /* ---- SMOOTH ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile menu if open
        if (mobileMenu) {
          mobileMenu.classList.remove('open');
          hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
      }
    });
  });


  /* ---- PARALLAX HERO CARDS ---- */
  const heroSection = document.querySelector('.hero');
  const floatCards = document.querySelectorAll('.float-card');

  window.addEventListener('mousemove', e => {
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const cx = (e.clientX / window.innerWidth - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;
    floatCards.forEach((card, i) => {
      const depth = (i + 1) * 7;
      card.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  });


  /* ---- SHAKE ANIMATION ---- */
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
  `;
  document.head.appendChild(styleEl);


  /* ---- SECTION ACTIVE HIGHLIGHT IN NAV ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

});
