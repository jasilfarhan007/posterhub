/**
 * PosterHub – script.js
 * Handles: navbar scroll, mobile menu, gallery + filter, lightbox,
 *          contact form → WhatsApp, scroll-reveal, back-to-top year.
 *
 * ── HOW TO ADD A NEW POSTER ──────────────────────────────────────
 * 1. Drop the image into the images/ folder.
 * 2. Add a new entry to the `works` array below with:
 *    { id, file, title, category, description, featured (optional) }
 * 3. That's it — the gallery and filters update automatically.
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

/* ================================================================
   1. PORTFOLIO DATA
   ================================================================ */
const works = [
  {
    id: 1,
    file: 'images/fiver%202.png',
    title: 'Infinity Grand Opening',
    category: 'Grand Opening',
    description: 'Launch reveal poster for Infinity — a fancy, toys and gifts store in Charankavu.',
    featured: true,
  },
  {
    id: 2,
    file: 'images/fiver%201.png',
    title: 'Strangers Camp – Munnar',
    category: 'Events',
    description: "Munnar getaway poster for Vibe Pokk, set among the tea estates.",
  },
  {
    id: 3,
    file: 'images/Artboard%206.png',
    title: 'Strangers Camp – Special Guests',
    category: 'Events',
    description: 'Special Strangers Camp edition featuring a mentalist and a singer.',
  },
  {
    id: 4,
    file: 'images/kbn%20hiring%202.png',
    title: 'KBN Traders – We Are Hiring',
    category: 'Hiring',
    description: 'Recruitment poster for KBN Traders & Home Appliances — clean and professional.',
  },
  {
    id: 5,
    file: 'images/p1%20for%20cherans.png',
    title: 'Cherans – Launching Soon',
    category: 'Brand Teasers',
    description: 'Bold launch teaser billboard poster for Cherans food brand.',
  },
  {
    id: 6,
    file: 'images/p3.png',
    title: 'Cherans – Malayalam Teaser',
    category: 'Brand Teasers',
    description: 'Malayalam-language teaser poster for Cherans Foods.',
  },
  {
    id: 7,
    file: 'images/OANAM%20INFINITY.png',
    title: 'Happy Onam – Infinity & PM Electricals',
    category: 'Festival',
    description: 'Joint Onam greeting for Infinity and P M Electricals with Maveli character.',
  },
];

/* ================================================================
   2. HELPERS
   ================================================================ */

/** Safely query one element; throws if not found in dev. */
function qs(selector, ctx = document) {
  const el = ctx.querySelector(selector);
  if (!el) console.warn(`[PosterHub] Element not found: ${selector}`);
  return el;
}

/** Build a unique sorted category list from the works array. */
function getCategories(data) {
  const cats = [...new Set(data.map(w => w.category))].sort();
  return ['All', ...cats];
}

/* ================================================================
   3. NAVBAR
   ================================================================ */
(function initNavbar() {
  const navbar    = qs('#navbar');
  const toggle    = qs('#navToggle');
  const menu      = qs('#navMenu');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!navbar || !toggle || !menu) return;

  /* Scroll: add 'scrolled' class */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* Hamburger toggle */
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  /* Close menu on link click (mobile) */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });

  /* Active link on scroll using IntersectionObserver */
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ================================================================
   4. AUTO-FILL CURRENT YEAR
   ================================================================ */
(function setYear() {
  const el = qs('#year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ================================================================
   5. SCROLL REVEAL
   ================================================================ */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => observer.observe(el));
})();

/* ================================================================
   6. GALLERY — render + filter
   ================================================================ */
(function initGallery() {
  const grid      = qs('#galleryGrid');
  const filterBar = qs('#filterBar');

  if (!grid || !filterBar) return;

  let activeFilter = 'All';

  /* ── 6a. Render filter buttons ─────────────────────────────── */
  const categories = getCategories(works);
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className   = 'filter-btn' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat;
    btn.setAttribute('aria-pressed', String(cat === 'All'));
    btn.addEventListener('click', () => applyFilter(cat));
    filterBar.appendChild(btn);
  });

  /* ── 6b. Render gallery items ──────────────────────────────── */
  works.forEach((work, index) => {
    const item = document.createElement('div');
    item.className   = 'gallery-item reveal';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `View poster: ${work.title}`);
    item.dataset.category = work.category;
    item.dataset.index    = String(index);

    // Featured badge (first item only)
    const featuredBadge = work.featured
      ? `<div class="gallery-badge-featured" aria-hidden="true">Latest</div>`
      : '';

    // Image with error fallback to placeholder
    item.innerHTML = `
      ${featuredBadge}
      <div class="gallery-img-wrap">
        <img
          src="${escapeAttr(work.file)}"
          alt="${escapeAttr(work.title)}"
          loading="lazy"
        />
      </div>
      <div class="gallery-overlay" aria-hidden="true">
        <p class="gallery-overlay-title">${escapeHTML(work.title)}</p>
        <p class="gallery-overlay-cat">${escapeHTML(work.category)}</p>
      </div>
    `;

    // Handle broken / SVG-placeholder images gracefully
    const img = item.querySelector('img');
    img.addEventListener('error', function() {
      const wrap = this.closest('.gallery-img-wrap');
      if (wrap) wrap.innerHTML = renderPlaceholder(work.title);
    });

    // Open lightbox on click / Enter / Space
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });

    grid.appendChild(item);
  });

  // Trigger reveal for gallery items
  requestAnimationFrame(() => {
    const revealItems = grid.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealItems.forEach(el => obs.observe(el));
  });

  /* ── 6c. Filter logic ──────────────────────────────────────── */
  function applyFilter(category) {
    activeFilter = category;

    // Update button states
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      const isActive = btn.textContent === category;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    // Show / hide items
    grid.querySelectorAll('.gallery-item').forEach(item => {
      const match = category === 'All' || item.dataset.category === category;
      item.classList.toggle('hidden', !match);
    });
  }

  /* ── 6d. Helpers ───────────────────────────────────────────── */
  function renderPlaceholder(title) {
    return `<div class="gallery-placeholder">
      <span class="gallery-placeholder-icon">🖼️</span>
      <span>${escapeHTML(title)}</span>
    </div>`;
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function escapeHTML(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }
})();

/* ================================================================
   7. LIGHTBOX
   ================================================================ */
(function initLightbox() {
  const lb        = qs('#lightbox');
  const lbOverlay = qs('#lbOverlay');
  const lbClose   = qs('#lbClose');
  const lbPrev    = qs('#lbPrev');
  const lbNext    = qs('#lbNext');
  const lbImg     = qs('#lbImg');
  const lbTitle   = qs('#lbTitle');
  const lbCat     = qs('#lbCategory');
  const lbDesc    = qs('#lbDesc');

  if (!lb) return;

  let currentIndex = 0;
  let visibleWorks = [...works]; // respects filter; for simplicity use full list

  /* Open lightbox at given index */
  window.openLightbox = function(index) {
    currentIndex = index;
    updateLightbox();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    requestAnimationFrame(() => lbClose && lbClose.focus());
  };

  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = '';

    // Return focus to the triggering gallery item
    const item = document.querySelector(`.gallery-item[data-index="${currentIndex}"]`);
    if (item) item.focus();
  }

  function updateLightbox() {
    const work = visibleWorks[currentIndex];
    if (!work) return;

    // Fade-swap image
    lbImg.style.opacity = '0';
    lbImg.src = '';

    setTimeout(() => {
      lbImg.src = work.file;
      lbImg.alt = work.title;
      lbImg.onload = () => { lbImg.style.opacity = '1'; };
      lbImg.onerror = () => { lbImg.style.opacity = '0.3'; };
    }, 80);

    lbTitle.textContent = work.title;
    lbCat.textContent   = work.category;
    lbDesc.textContent  = work.description || '';

    // Disable prev/next at edges
    lbPrev.disabled = currentIndex === 0;
    lbNext.disabled = currentIndex === visibleWorks.length - 1;
  }

  function showPrev() {
    if (currentIndex > 0) { currentIndex--; updateLightbox(); }
  }

  function showNext() {
    if (currentIndex < visibleWorks.length - 1) { currentIndex++; updateLightbox(); }
  }

  /* Event listeners */
  lbClose.addEventListener('click',   closeLightbox);
  lbOverlay.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',    showPrev);
  lbNext.addEventListener('click',    showNext);

  /* Keyboard navigation */
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* Touch swipe support */
  let touchStartX = 0;
  lb.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? showNext() : showPrev();
  }, { passive: true });
})();

/* ================================================================
   8. CONTACT FORM → WHATSAPP
   ================================================================ */
(function initContactForm() {
  const form    = qs('#contactForm');
  const nameEl  = qs('#cf-name');
  const phoneEl = qs('#cf-phone');
  const msgEl   = qs('#cf-message');

  if (!form) return;

  // ── Change this number to update the WhatsApp target ──
  const WA_NUMBER = '+917306478435';

  form.addEventListener('submit', e => {
    e.preventDefault();

    let valid = true;

    // Simple validation
    [nameEl, phoneEl].forEach(el => {
      if (!el.value.trim()) {
        el.classList.add('error');
        valid = false;
      } else {
        el.classList.remove('error');
      }
    });

    if (!valid) {
      nameEl.focus();
      return;
    }

    // Build pre-filled WhatsApp message
    const name    = nameEl.value.trim();
    const phone   = phoneEl.value.trim();
    const message = msgEl.value.trim();

    const waText = `Hi PosterHub! 👋

Name: ${name}
Phone: ${phone}
${message ? `\nMessage:\n${message}` : ''}

I'd like to discuss a poster design.`;

    const waURL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
    window.open(waURL, '_blank', 'noopener,noreferrer');
  });

  // Clear error on input
  [nameEl, phoneEl, msgEl].forEach(el => {
    if (el) el.addEventListener('input', () => el.classList.remove('error'));
  });
})();
