/**
 * NEXCELL CLUB — NEO-BRUTALIST INTERACTIVE SCRIPTS
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordion();
  initLightbox();
  initReviewLivePreview();
  initTeamFilters();
  initCrimeSceneTapeScroll();
});

/* --------------------------------------------------------------------------
   CRIME SCENE TAPE: RANDOM ENTRANCE & RANDOM LEAVE SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initCrimeSceneTapeScroll() {
  const wrapper = document.getElementById('heroPinnedWrapper');
  const tapeEls = [
    document.getElementById('crimeTape1'),
    document.getElementById('crimeTape2'),
    document.getElementById('crimeTape3'),
    document.getElementById('crimeTape4'),
    document.getElementById('crimeTape5')
  ];
  const siteHeader = document.getElementById('siteHeader');

  if (!tapeEls[0] && !tapeEls[1]) return;

  // Base resting configuration for each tape over NEXCELL
  const tapeConfigs = [
    {
      baseY: -65,
      baseRot: 6,
      // Enter from Top-Right (quadrant 1: +X, -Y)
      enterDir: { x: 1.25, y: -0.85, rot: 18 },
      // Leave towards Top-Left (quadrant 2: -X, -Y)
      leaveDir: { x: -1.35, y: -0.75, rot: -22 }
    },
    {
      baseY: 45,
      baseRot: -7,
      // Enter from Bottom-Left (quadrant 3: -X, +Y)
      enterDir: { x: -1.30, y: 0.90, rot: -20 },
      // Leave towards Bottom-Right (quadrant 4: +X, +Y)
      leaveDir: { x: 1.40, y: 0.85, rot: 18 }
    },
    {
      baseY: -10,
      baseRot: 3.5,
      // Enter from Bottom-Right (quadrant 4: +X, +Y)
      enterDir: { x: 1.15, y: 1.05, rot: 14 },
      // Leave towards Top-Right (quadrant 1: +X, -Y)
      leaveDir: { x: 1.30, y: -0.95, rot: 24 }
    },
    {
      baseY: 20,
      baseRot: -4.5,
      // Enter from Top-Left (quadrant 2: -X, -Y)
      enterDir: { x: -1.25, y: -1.05, rot: -16 },
      // Leave towards Bottom-Left (quadrant 3: -X, +Y)
      leaveDir: { x: -1.35, y: 0.95, rot: -20 }
    },
    {
      baseY: 80,
      baseRot: 8,
      // Enter from Bottom-Center / Left (-X, +Y)
      enterDir: { x: -0.75, y: 1.35, rot: -12 },
      // Leave towards Direct Top-Right / Far Top (+X, -Y)
      leaveDir: { x: 0.85, y: -1.40, rot: 28 }
    }
  ];

  // Apply subtle random jitter per visit so every reload is uniquely randomized
  tapeConfigs.forEach(cfg => {
    const rx = (Math.random() - 0.5) * 0.25;
    const ry = (Math.random() - 0.5) * 0.25;
    const rRot = (Math.random() - 0.5) * 8;
    cfg.enterDir.x += rx;
    cfg.enterDir.y += ry;
    cfg.enterDir.rot += rRot;
    cfg.leaveDir.x += rx;
    cfg.leaveDir.y += ry;
    cfg.leaveDir.rot += rRot;
  });

  const tapes = tapeEls.map((el, i) => ({ el, cfg: tapeConfigs[i] })).filter(t => t.el);

  let isIntroAnimating = false;
  let ticking = false;

  function updateTape() {
    if (isIntroAnimating) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    let progress = 0;
    if (wrapper) {
      const wrapperTop = wrapper.offsetTop;
      const scrollDistance = wrapper.offsetHeight - window.innerHeight;
      if (scrollDistance > 0) {
        progress = Math.max(0, Math.min(1, (scrollY - wrapperTop) / scrollDistance));
      }
    } else {
      progress = Math.max(0, Math.min(1, scrollY / 600));
    }

    const travelDistance = Math.max(window.innerWidth * 1.85, 2600);

    // Each tape leaves in its assigned random direction across all quadrants
    tapes.forEach(({ el, cfg }) => {
      const x = cfg.leaveDir.x * progress * travelDistance;
      const y = cfg.baseY + (cfg.leaveDir.y * progress * travelDistance);
      const r = cfg.baseRot + (cfg.leaveDir.rot * progress);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${r.toFixed(2)}deg)`;
    });

    // Reveal top navigation bar as the tapes leave
    if (siteHeader && siteHeader.classList.contains('reveal-on-tape')) {
      const navProgress = Math.max(0, Math.min(1, (progress - 0.20) / 0.65));
      siteHeader.style.transform = `translate3d(0, ${(-100 * (1 - navProgress)).toFixed(1)}%, 0)`;
      siteHeader.style.opacity = navProgress.toFixed(2);
      siteHeader.style.pointerEvents = navProgress > 0.4 ? 'auto' : 'none';
    }

    ticking = false;
  }

  // Entrance animation on page load: tapes enter from random directions
  function playEntrance() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 40) {
      // User refreshed while scrolled down, skip intro entrance
      updateTape();
      return;
    }

    isIntroAnimating = true;
    const travelDistance = Math.max(window.innerWidth * 1.6, 2200);

    // 1. Initial offscreen position along random entrance trajectory
    tapes.forEach(({ el, cfg }) => {
      const startX = cfg.enterDir.x * travelDistance;
      const startY = cfg.baseY + (cfg.enterDir.y * travelDistance);
      const startRot = cfg.baseRot + cfg.enterDir.rot;
      el.style.transition = 'none';
      el.style.transform = `translate3d(${startX.toFixed(1)}px, ${startY.toFixed(1)}px, 0) rotate(${startRot.toFixed(2)}deg)`;
      el.style.opacity = '0';
    });

    // 2. Staggered slam-in entrance with snappy Neo-Brutalist curve
    tapes.forEach(({ el, cfg }, index) => {
      const delay = 60 + index * 90;
      setTimeout(() => {
        el.style.transition = 'transform 0.65s cubic-bezier(0.18, 0.95, 0.3, 1.15), opacity 0.3s ease';
        el.style.transform = `translate3d(0px, ${cfg.baseY}px, 0) rotate(${cfg.baseRot}deg)`;
        el.style.opacity = '1';
      }, delay);
    });

    // 3. Once entrance animation finishes, hand control over to scroll scrubbing
    const totalDuration = 60 + (tapes.length * 90) + 700;
    setTimeout(() => {
      tapes.forEach(({ el }) => {
        el.style.transition = '';
      });
      isIntroAnimating = false;
      updateTape();
    }, totalDuration);
  }

  window.addEventListener('scroll', () => {
    if (isIntroAnimating) {
      // If user scrolls during intro, cancel intro instantly and scrub smoothly
      isIntroAnimating = false;
      tapes.forEach(({ el }) => { el.style.transition = ''; });
    }
    if (!ticking) {
      window.requestAnimationFrame(updateTape);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateTape);
      ticking = true;
    }
  }, { passive: true });

  // Trigger random entrance on initial load
  playEntrance();
}

/* --------------------------------------------------------------------------
   MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('is-open');
    toggleBtn.classList.toggle('is-active', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close drawer on link click
  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      
      // Close other open items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
        }
      });

      item.classList.toggle('is-open', !isOpen);
    });
  });
}

/* --------------------------------------------------------------------------
   LIGHTBOX MODAL FOR GALLERY
   -------------------------------------------------------------------------- */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');

  if (!modal || !lightboxImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'NexCell Event Photo';
        modal.classList.add('is-open');
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('is-open');
    lightboxImg.src = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   REVIEWS: LIVE PREVIEW & INTERACTIVE STARS
   -------------------------------------------------------------------------- */
function initReviewLivePreview() {
  const form = document.getElementById('reviewForm');
  if (!form) return;

  const nameInput = document.getElementById('reviewName');
  const roleInput = document.getElementById('reviewRole');
  const textInput = document.getElementById('reviewText');
  const ratingInput = document.getElementById('reviewRating');
  const starBtns = document.querySelectorAll('.star-btn');

  // Preview elements
  const prevAuthor = document.getElementById('previewAuthor');
  const prevRole = document.getElementById('previewRole');
  const prevText = document.getElementById('previewText');
  const prevStars = document.getElementById('previewStars');

  // Interactive stars
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-value') || '5', 10);
      if (ratingInput) ratingInput.value = val;

      starBtns.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-value') || '0', 10);
        s.classList.toggle('selected', sVal <= val);
        s.textContent = sVal <= val ? '★' : '☆';
      });

      if (prevStars) {
        prevStars.textContent = '★'.repeat(val) + '☆'.repeat(5 - val);
      }
    });
  });

  // Real-time input binding
  if (nameInput && prevAuthor) {
    nameInput.addEventListener('input', () => {
      prevAuthor.textContent = nameInput.value.trim() || 'Your Name Here';
    });
  }

  if (roleInput && prevRole) {
    roleInput.addEventListener('input', () => {
      prevRole.textContent = roleInput.value.trim() || 'Student / Innovator';
    });
  }

  if (textInput && prevText) {
    textInput.addEventListener('input', () => {
      prevText.textContent = textInput.value.trim() ? `"${textInput.value.trim()}"` : '"Start typing below to see your review preview card in real-time..."';
    });
  }
}

/* --------------------------------------------------------------------------
   TEAM SEARCH & CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initTeamFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('teamSearch');
  const cards = document.querySelectorAll('.team-card');

  if (!cards.length) return;

  let currentCategory = 'all';
  let currentSearch = '';

  function applyFilters() {
    cards.forEach(card => {
      const category = card.getAttribute('data-category') || 'member';
      const name = (card.querySelector('.team-name')?.textContent || '').toLowerCase();
      const role = (card.querySelector('.team-role')?.textContent || '').toLowerCase();
      
      const matchesCategory = (currentCategory === 'all') || (category === currentCategory);
      const matchesSearch = !currentSearch || name.includes(currentSearch) || role.includes(currentSearch);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

