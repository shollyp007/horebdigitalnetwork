/* ═══════════════════════════════════════════════════════════════════
   HOREB DIGITAL NETWORK INC. — Main JavaScript
═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── Loader ──────────────────────────────────────────────────────── */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  let pct = 0;

  const step = () => {
    const inc = pct < 70 ? Math.random() * 12 + 5
              : pct < 90 ? Math.random() * 5 + 2
              :             Math.random() * 2 + 0.5;
    pct = Math.min(pct + inc, 100);
    progress.style.width = pct + '%';

    if (pct < 100) {
      setTimeout(step, 80 + Math.random() * 120);
    } else {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAnimations();
      }, 400);
    }
  };

  document.body.style.overflow = 'hidden';
  setTimeout(step, 200);
})();


/* ── Custom Cursor ───────────────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  const animateFollower = () => {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  };
  animateFollower();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '0.6';
  });
})();


/* ── Navigation ──────────────────────────────────────────────────── */
(function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');
  const links  = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      menu.classList.remove('open');
    });
  });

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a');

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const h   = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + h) {
        navLinkEls.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── Scroll Reveal Animations ────────────────────────────────────── */
function initAnimations() {
  const els = document.querySelectorAll('.reveal-up');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside the same parent
        const siblings = entry.target.parentElement.querySelectorAll('.reveal-up:not(.visible)');
        let delay = 0;
        siblings.forEach(sib => {
          if (sib === entry.target || entry.target.parentElement.contains(sib)) {
            setTimeout(() => sib.classList.add('visible'), delay);
            delay += 80;
          }
        });
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => io.observe(el));
}


/* ── Counter Animation ───────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 1800;
      const start  = performance.now();

      const tick = (now) => {
        const pct  = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - pct, 4);
        el.textContent = Math.floor(ease * target);
        if (pct < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.8 });

  counters.forEach(c => io.observe(c));
})();


/* ── Portfolio Filter ────────────────────────────────────────────── */
(function initPortfolioFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.port-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.4s, transform 0.4s';
        if (match) {
          card.classList.remove('hidden');
          card.style.opacity   = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => card.classList.add('hidden'), 400);
        }
      });
    });
  });
})();


/* ── Testimonial Slider ──────────────────────────────────────────── */
(function initTestimonials() {
  const track  = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('testimonialDots');
  if (!track) return;

  const cards   = track.querySelectorAll('.testimonial-card');
  const total   = cards.length;
  let current   = 0;
  let timer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('testimonial-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.testimonial-dot');

  const goTo = (idx) => {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    resetTimer();
  };

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6000);
  };
  resetTimer();
})();


/* ── Video Modal ─────────────────────────────────────────────────── */
(function initModal() {
  const reelBtn   = document.getElementById('reelBtn');
  const modal     = document.getElementById('videoModal');
  const overlay   = document.getElementById('modalOverlay');
  const closeBtn  = document.getElementById('modalClose');
  if (!modal) return;

  const open = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  reelBtn.addEventListener('click', open);
  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


/* ── Contact Form ────────────────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span>Sending...</span>';

    // Simulate async (wire up to your backend/formspree/etc.)
    setTimeout(() => {
      form.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
      btn.style.display = 'none';
      success.classList.add('show');
    }, 1500);
  });
})();


/* ── Back to top ─────────────────────────────────────────────────── */
(function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── Smooth anchor scrolling ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('nav')?.offsetHeight || 80;
    window.scrollTo({
      top: target.offsetTop - navH,
      behavior: 'smooth'
    });
  });
});


/* ── Parallax hero grid ──────────────────────────────────────────── */
(function initParallax() {
  const grid = document.querySelector('.hero-grid');
  const filmStrips = document.querySelectorAll('.film-strip');
  if (!grid) return;

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (s < window.innerHeight) {
      grid.style.transform = `translateY(${s * 0.15}px)`;
      filmStrips.forEach(fs => {
        fs.style.transform = `translateY(${s * 0.08}px)`;
      });
    }
  }, { passive: true });
})();


/* ── Magnetic buttons (subtle) ───────────────────────────────────── */
(function initMagneticBtns() {
  document.querySelectorAll('.btn-primary, .reel-play-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();
